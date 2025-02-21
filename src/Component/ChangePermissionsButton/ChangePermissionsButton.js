import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import axios from "axios";
import { Form } from 'react-final-form';
import { tokenHeader } from '../../controller/user';
import { useDispatch } from "react-redux";
import { setSnackbar } from '../../controller/site';
import { API_USER } from '../../constant';
import MenuItem from '@material-ui/core/MenuItem';
import { Select } from "mui-rff";



export default function ChangePermissionsButton(props) {
    const {user} = props;
    const [open, setOpen] = React.useState(false);
    const dispatch = useDispatch();

    const handleClickOpen = () => {
        setOpen(true);

    };

    const handleClose = () => {
        setOpen(false);
    };

    const onSubmit = (values) => {
        axios.post(API_USER +"/" + user.uid + "/permissions", values, {
            headers: tokenHeader(),
            validateStatus: status => status === 200
        }).then(res => {
            window.location.reload();
        }).catch(err => {
            try {
                dispatch(setSnackbar(err.response.data.detail, "error"));
            } catch (e) {
                dispatch(setSnackbar("未知的错误", "error"));
            }
        })
    };

    return (
        <div>
            <Button variant="contained" color="secondary" style={{marginTop: "0.5rem",marginRight: "0.5rem"}} onClick={handleClickOpen}>修改接取权限</Button>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <Form onSubmit={onSubmit} initialValues={{permissions: user.permissions}} render={({handleSubmit}) => (
                    <form onSubmit={handleSubmit}>
                        <DialogTitle id="form-dialog-title">修改接取权限</DialogTitle>
                        <DialogContent>
                            <Select name="permissions" fullWidth required>
                                <MenuItem value={0}>不活跃组员</MenuItem>
                                <MenuItem value={1}>普通组员</MenuItem>
                                <MenuItem value={2}>不设上限组员</MenuItem>
                            </Select>
                        </DialogContent>

                        <DialogActions>
                            <Button onClick={handleClose} color="primary">
                                取消
                            </Button>
                            <Button type="submit" color="primary">
                                修改
                            </Button>
                        </DialogActions>
                    </form>)}/>
            </Dialog>
        </div>
    );
}
