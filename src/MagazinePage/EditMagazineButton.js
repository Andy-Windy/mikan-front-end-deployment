import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import ImgUrlTextField from "../Component/ImgUrlTextField/ImgUrlTextField";
import MultiDatePicker from "../Component/MultiDatePicker/MultiDatePicker";
import axios from "axios";

import {API_MAGAZINE} from "../constant";
import {Form, Field} from 'react-final-form';
import {TextField} from 'mui-rff';
import {tokenHeader} from "../controller/user";
import {useDispatch} from "react-redux";
import {setSnackbar} from "../controller/site";
import {useHistory} from "react-router";
import {makeStyles} from '@material-ui/core/styles';
import {FormHelperText} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    container: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: 200,
    },
  }));


export default function EditMagazineButton(props) {
    const classes = useStyles();
    const {magazine} = props;
    const [open, setOpen] = React.useState(false);
    const [isScheduled, setIsScheduled] = React.useState(false);
    const [scheduleType, setScheduleType] = React.useState(0);
    const MemoizedMultiDatePicker = React.memo(MultiDatePicker);
    const dispatch = useDispatch();
    const history = useHistory();

    React.useEffect(() => {
        if (magazine) {
            setIsScheduled(magazine.magazine_schedule_flag);
            setScheduleType(magazine.magazine_schedule_type);
        }
    }, [magazine]);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleScheduleChange = (event) => {
        setIsScheduled(event.target.checked);
    };

    const handleScheduleTypeChange = (event) => {
        setScheduleType(event.target.value);
    };

    const onSubmit = (values) => {
        if (isScheduled) {
            values["magazine_schedule_type"] = scheduleType;
            if (values.magazine_schedule_dates && Array.isArray(values.magazine_schedule_dates) && values.magazine_schedule_dates.length > 0 ) {
                values["magazine_schedule_dates"] = values.magazine_schedule_dates.join(',');
            }
            else {
                dispatch(setSnackbar("请选择至少一个日期", "error"));
                return;
            }

            delete values["next_update_time"];
        } else {
            delete values["magazine_schedule_type"];
            delete values["magazine_schedule_dates"];
            delete values["magazine_schedule_time"];
        }
        values["magazine_schedule_flag"] = isScheduled;
        values["cover"] = document.getElementById("cover").value;

        axios.post(API_MAGAZINE + "/" + magazine["id"], values, {
            headers: tokenHeader(),
            validateStatus: status => status === 200
        }).then(res => res.data).then(res => {
            if (res["id"] !== magazine["id"])
                history.replace("/magazine/" + res["id"]);
            window.location.reload();
        }).catch(err => {
            try {
                console.log(err.response.data.detail);
                dispatch(setSnackbar(err.response.data.detail, "error"));
            } catch (e) {
                dispatch(setSnackbar("未知的错误", "error"));
            }
        });
    };

    return (
        <div>
            <Button variant="outlined" color="primary" size="small" onClick={handleClickOpen}>编辑杂志</Button>

            <Dialog open={open} onClose={handleClose} adisableEnforceFocus>
                <Form initialValues={{name: magazine.name, id: magazine.id, status: magazine.status, next_update_time: magazine.next_update_time ? change2StandTime(magazine.next_update_time) : "",
                                      media: magazine.media, url: magazine.url,magazine_schedule_dates: magazine.magazine_schedule_dates ? magazine.magazine_schedule_dates.split(',').map(Number) : [],
                                      magazine_schedule_time: magazine.magazine_schedule_time ? secondsToTime(magazine.magazine_schedule_time) : "00:00"}}
                    onSubmit={onSubmit} render={({handleSubmit}) => (
                        <form onSubmit={handleSubmit}>
                        <DialogTitle id="form-dialog-title">编辑杂志</DialogTitle>
                        <DialogContent>
                            <TextField autoFocus margin="dense" name="name" label="杂志名称" type="string" fullWidth required />
                            <TextField margin="dense" name="id" label="杂志ID" type="string" fullWidth required helperText="杂志ID会出现在URL上，不可重名，最好避免使用汉字。建议：罗马字/英文简写。" />
                            <FormHelperText>注意，以下时间均采用日本时间</FormHelperText>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs={6}> <FormControlLabel control={<Switch checked={isScheduled} onChange={handleScheduleChange} />} label="是否自动更新" style={{ marginLeft: 0 }} labelPlacement="start" /> </Grid>
                                {isScheduled && (
                                    <Grid item xs={3}> <FormControl fullWidth margin="dense">
                                        <Select value={scheduleType} onChange={handleScheduleTypeChange}>
                                            <MenuItem value={0}>按日期更新</MenuItem>
                                            <MenuItem value={1}>按周次更新</MenuItem>
                                        </Select></FormControl></Grid>)}
                            </Grid> {isScheduled && (
                                <Grid container spacing={2} alignItems="center">
                                    <Grid item xs={6}>
                                        <Field name="magazine_schedule_dates" >
                                            {({ input }) => (
                                                <MemoizedMultiDatePicker
                                                    mode={scheduleType}
                                                    value={input.value || []}
                                                    onChange={(dates) => input.onChange(dates)}/>)}
                                        </Field>
                                    </Grid>
                                    <Grid item xs={6}>
                                    <TextField name="magazine_schedule_time" id="time" type="time"
                                        className={classes.textField}
                                        InputLabelProps={{ shrink: true, }}
                                        inputProps={{ step: 300 }}
                                        required={isScheduled}/>
                                    </Grid>
                                </Grid>
                            )}
                            {!isScheduled && (
                                <Grid container spacing={2} alignItems="center">
                                    <Grid item xs={12}>
                                        <TextField margin="dense" label="下次更新时间(日本时间)" type="datetime-local" name="next_update_time" InputLabelProps={{ shrink: true }} fullWidth />
                                    </Grid>
                                </Grid>
                            )}
                            <FormControl fullWidth margin="dense">
                                <InputLabel>状态</InputLabel>
                                <Field name="status" defaultValue={0}>
                                    {({ input }) => (
                                        <Select {...input} label="状态">
                                            <MenuItem value={0}>连载中</MenuItem>
                                            <MenuItem value={1}>完结</MenuItem>
                                        </Select>
                                    )}
                                </Field>
                            </FormControl>
                            <TextField margin="dense" name="media" label="媒介" type="string" fullWidth />
                            <Field component={ImgUrlTextField} name="cover" initVal={magazine.cover} />
                            <TextField margin="dense" name="url" label="杂志发布URL" type="string" fullWidth />
                        </DialogContent>

                        <DialogActions>
                            <Button onClick={handleClose} color="primary">取消</Button>
                            <Button type="submit" color="primary">修改</Button>
                        </DialogActions>
                    </form>)}/>
            </Dialog>
        </div>
    );
}

function change2StandTime(stamp) {
    if (!stamp) return "";
    const date = new Date(stamp * 1000); // 乘以 1000 转换为毫秒
    // 格式化为 "YYYY-MM-DDTHH:mm" 格式
    return date.toISOString().slice(0, 16);
}

function secondsToTime(seconds) {
    const h = Math.floor(seconds / 3600); // 计算小时
    const m = Math.floor((seconds % 3600) / 60); // 计算分钟

    // 使用padStart确保小时和分钟都是两位数
    const hh = String(h).padStart(2, '0');
    const mm = String(m).padStart(2, '0');

    return `${hh}:${mm}`;
}