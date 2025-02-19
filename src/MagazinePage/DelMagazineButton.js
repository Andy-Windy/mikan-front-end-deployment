import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import {Form, Field} from 'react-final-form';
import MagazineAutocomplete from '../Component/MagazineAutocomplete/MagazineAutoComplete';

import axios from "axios";
import {API_MAGAZINE} from "../constant";
import {tokenHeader} from "../controller/user";
import {useDispatch} from "react-redux";
import {setSnackbar} from "../controller/site";


export default function DelMagazineButton() {
    const [open, setOpen] = React.useState(false);
    const [confirmDelete, setConfirmDelete] = React.useState(false);
    const [selectedMagazine, setSelectedMagazine] = React.useState(null);
    const [selectedId, setSelectedId] = React.useState(null);
    const dispatch = useDispatch();

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setConfirmDelete(false);
        setSelectedMagazine(null);
        setSelectedId(null);
    };

    const handleConfirmDelete = () => {
        setConfirmDelete(true);
    };

    const onSubmit = (values) => {
        if(!confirmDelete)
        {
            handleConfirmDelete();
            setSelectedMagazine(values["magazine"].name)
            setSelectedId(values["magazine"].id)
            return ;
        }
            
        axios.delete(API_MAGAZINE + "/" + selectedId, {
            headers: tokenHeader(),
            validateStatus: status => status === 200
        }).then(res => {
            window.location.reload();
        }).catch(err => {
            try {
                console.log(err.response.data.detail);
                dispatch(setSnackbar(err.response.data.detail, "error"));
            } catch (e) {
                dispatch(setSnackbar("未知的错误", "error"));
            }
        })
    };

    return (
        <div>
            <Button variant={"contained"} color={"primary"} onClick={handleClickOpen}>删除杂志</Button>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <Form onSubmit={onSubmit} render={({handleSubmit}) => (
                    <form onSubmit={handleSubmit}>
                        {!confirmDelete ? (
                            <>
                                <DialogTitle id="form-dialog-title">确认删除</DialogTitle>
                                <DialogContent>
                                    <DialogContentText>注意！删除后将不可恢复！</DialogContentText>
                                    <Field component={MagazineAutocomplete} name="magazine" label="杂志" id="magazine" fullWidth isRequired={true}/>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={handleClose} color="primary">
                                        取消
                                    </Button>
                                    <Button type="submit" color="primary">
                                        删除
                                    </Button>
                                </DialogActions>
                            </>
                        ) : (
                            <>
                                <DialogTitle id="form-dialog-title">确认删除</DialogTitle>
                                <DialogContent>
                                <DialogContentText>
                                        你确定要删除《<strong>{selectedMagazine}</strong>》吗？此操作无法撤销。
                                    </DialogContentText>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={() => setConfirmDelete(false)} color="primary">
                                        返回
                                    </Button>
                                    <Button type="submit" color="primary">
                                        删除
                                    </Button>
                                </DialogActions>
                            </>
                        )}
                    </form>)}/>
            </Dialog>
        </div>
    );

}
