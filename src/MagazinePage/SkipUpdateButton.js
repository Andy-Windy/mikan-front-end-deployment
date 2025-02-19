import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import axios from "axios";
import {API_MAGAZINE} from "../constant";
import {tokenHeader} from "../controller/user";
import {useDispatch} from "react-redux";
import {setSnackbar} from "../controller/site";
import {Form} from 'react-final-form';


export default function SkipUpdateButton(props) {
    const {magazine} = props;
    const [open, setOpen] = React.useState(false);
    const dispatch = useDispatch();

    const handleClickOpen = () => {
        setOpen(true);

    };

    const handleClose = () => {
        setOpen(false);
    };

    const onSubmit = () => {
        axios
        .put(API_MAGAZINE + '/' + magazine['id'], [],  {
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
            <Button variant={'contained'} color="secondary" onClick={handleClickOpen}>跳过更新</Button>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <Form onSubmit={onSubmit} render={({handleSubmit}) => (
                    <form onSubmit={handleSubmit}>
                        <DialogTitle id="form-dialog-title">跳过更新</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                是否跳过本次更新？
                            </DialogContentText>
                        </DialogContent>

                        <DialogActions>
                            <Button onClick={handleClose} color="primary">
                                取消
                            </Button>
                            <Button type="submit" color="primary">
                                确定
                            </Button>
                        </DialogActions>
                    </form>)}/>
            </Dialog>
        </div>
    );
}
