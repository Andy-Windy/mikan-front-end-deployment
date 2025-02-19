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
import { TextField } from 'mui-rff';
import { Form, Field } from 'react-final-form';
import ImgUrlTextField from "../Component/ImgUrlTextField/ImgUrlTextField";
import MultiDatePicker from "../Component/MultiDatePicker/MultiDatePicker";
import axios from "axios";
import { API_MAGAZINE } from "../constant";
import { tokenHeader } from "../controller/user";
import { useDispatch } from "react-redux";
import { setSnackbar } from "../controller/site";
import { makeStyles } from '@material-ui/core/styles';
import { FormHelperText } from '@material-ui/core';

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

export default function NewMagazineButton() {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const [isScheduled, setIsScheduled] = React.useState(false);
    const [scheduleType, setScheduleType] = React.useState(0); // 0 for date, 1 for week
    const MemoizedMultiDatePicker = React.memo(MultiDatePicker);
    const dispatch = useDispatch();

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
            // 将 magazine_schedule_dates 转换为字符串
            if (values.magazine_schedule_dates && Array.isArray(values.magazine_schedule_dates)) {
                values["magazine_schedule_dates"] = values.magazine_schedule_dates.join(',');
            }

            delete values["next_update_time"];
        } else {
            delete values["magazine_schedule_type"];
            delete values["magazine_schedule_dates"];
            delete values["magazine_schedule_time"];
        }
        values["magazine_schedule_flag"] = isScheduled;

        axios.put(API_MAGAZINE, values, {
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
        });
    };

    return (
            <div>
                <Button variant={"contained"} color={"primary"} onClick={handleClickOpen}>创建杂志</Button>
                <Dialog open={open} onClose={handleClose} disableEnforceFocus >
                    <Form onSubmit={onSubmit} initialValues={{magazine_schedule_time: "00:00" }}render={({ handleSubmit }) => (
                        <form onSubmit={handleSubmit}>
                            <DialogTitle id="form-dialog-title">创建杂志</DialogTitle>
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
                                            <Field name="magazine_schedule_dates">
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
                                            inputProps={{ step: 300 }}/>
                                        </Grid>
                                    </Grid>
                                )}
                                {!isScheduled && (
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item xs={12}>
                                            <TextField margin="dense" label="下次更新时间" type="datetime-local" name="next_update_time" InputLabelProps={{ shrink: true }} fullWidth />
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
                                <Field component={ImgUrlTextField} name="cover" />
                                <TextField margin="dense" name="url" label="杂志发布URL" type="string" fullWidth />
                            </DialogContent>

                            <DialogActions>
                                <Button onClick={handleClose} color="primary">取消</Button>
                                <Button type="submit" color="primary">创建</Button>
                            </DialogActions>
                        </form>
                    )} />
                </Dialog>
            </div>
    );
}