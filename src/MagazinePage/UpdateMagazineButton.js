import React, { useState,useEffect } from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Tooltip from '@material-ui/core/Tooltip';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import axios from "axios";
import {API_MAGAZINE} from "../constant";
import {tokenHeader} from "../controller/user";
import {useDispatch} from "react-redux";
import {setSnackbar} from "../controller/site";
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  customBlue: {
    backgroundColor: '#87cefa',
    '&:hover': {
      backgroundColor: '#50abe4',
    },
  },
}));

function MangaEntry({ manga, index, onUpdate }) {
  const [isUpdating, setIsUpdating] = useState(manga.isUpdating);
  const [hasProofreading, setHasProofreading] = useState(manga.hasProofreading);

  return (
    <TableRow>
      <TableCell> <Checkbox checked={isUpdating} onChange={(e) => { setIsUpdating(e.target.checked); onUpdate(index, e.target.checked, manga.nextChapter, hasProofreading); }} /> </TableCell>
      <TableCell> {manga.manga_name} </TableCell>
      <TableCell>
        <Tooltip title={ <div> {manga.recentChapters.map((chapter, idx) => ( <div key={idx}>{chapter}</div> ))} </div> } placement="top" >
          <span>{manga.latestChapter}</span>
        </Tooltip>
      </TableCell>
      <TableCell> <Checkbox checked={hasProofreading} onChange={(e) => { setHasProofreading(e.target.checked); onUpdate(index, isUpdating, manga.nextChapter, e.target.checked);}} disabled={!isUpdating} /> </TableCell>
      <TableCell> <TextField value={manga.nextChapter || ''}  disabled={!isUpdating} onChange={(e) => onUpdate(index, isUpdating, e.target.value, hasProofreading)} required={isUpdating}/> </TableCell>
    </TableRow>
  );
}

function MangaTable({ mangas, onMangasChange }) {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>是否更新</TableCell>
            <TableCell>漫画</TableCell>
            <TableCell>上一章</TableCell>
            <TableCell>有无校对</TableCell>
            <TableCell>更新章节</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {mangas.map((manga, index) => (
            <MangaEntry
              key={index}
              manga={manga}
              index={index}
              onUpdate={(idx, updating, nextChapter, hasProofreading) =>
                onMangasChange(idx, updating, nextChapter, hasProofreading)
              }
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default function UpdateMagazineButton(props) {
  const groupMangasByChapter = (mangaList) => {
    const grouped = {};
    mangaList.forEach((manga) => {
      if (!grouped[manga.manga_id]) {
        grouped[manga.manga_id] = {
          manga_id: manga.manga_id,
          manga_name: manga.manga_name,
          chapters: [],
          isUpdating: false, // 默认选中“是否更新”
          hasProofreading: true, // 默认选中“有无校对”
        };
      }
      if (manga.chapter_name) {
        grouped[manga.manga_id].chapters.push(manga.chapter_name);
      }
    });
    Object.keys(grouped).forEach((key) => {
      grouped[key].recentChapters = grouped[key].chapters;
      grouped[key].latestChapter = grouped[key].chapters[0] || '无';
    });
    return Object.values(grouped);
  };

  const classes = useStyles();
  const { magazine } = props; // 从 props 中接收 magazine 对象
  const [mangas, setMangas] = useState([]); // 使用 magazine.manga_list.mangas 初始化状态
  useEffect(() => { if (magazine && magazine.manga_list) { setMangas(groupMangasByChapter(magazine.manga_list)); }}, [magazine]); // 监听 magazine 的变化
  const [open, setOpen] = React.useState(false);
  const dispatch = useDispatch();

  const handleMangasChange = (index, isUpdating, nextChapter, hasProofreading) => {
    const newMangas = [...mangas];
    newMangas[index] = {
      ...newMangas[index],
      isUpdating,
      nextChapter,
      hasProofreading,
    };
    setMangas(newMangas);
  };

  const handleClickOpen = () => { setOpen(true);};

  const handleClose = () => { setOpen(false);};

  const onSubmit = (e) => {
    e.preventDefault(); // 阻止表单的默认提交行为

    const values = mangas
    .filter(manga => manga.isUpdating) // 只保留 isUpdating 为 true 的条目
    .map(manga => ({
      manga_id: manga.manga_id,
      nextChapter: manga.nextChapter,
      hasProofreading: manga.hasProofreading,
    }));

    // 如果没有需要更新的条目，直接返回
    if (values.length === 0) {
      dispatch(setSnackbar('没有需要更新的漫画', 'info'));
      return;
    }

    axios
      .put(API_MAGAZINE + '/' + magazine['id'], values, {
        headers: tokenHeader(),
        validateStatus: (status) => status === 200,
      })
      .then((res) => {
        window.location.reload();
      })
      .catch((err) => {
        try {
          dispatch(setSnackbar(err.response.data.detail, 'error'));
        } catch (e) {
          dispatch(setSnackbar('未知的错误', 'error'));
        }
      });
  };

  return (
    <div>
      <Button variant={'contained'} color={magazine.need_update ? "primary" : undefined} className={magazine.need_update ? undefined : classes.customBlue} onClick={handleClickOpen}> 更新 </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <form onSubmit={onSubmit}> {/* 添加 form 标签 */}
          <DialogContent>
            <MangaTable mangas={mangas} onMangasChange={handleMangasChange} />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              取消
            </Button>
            <Button type="submit" color="primary"> {/* 添加 type="submit" */}
              更新
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}

