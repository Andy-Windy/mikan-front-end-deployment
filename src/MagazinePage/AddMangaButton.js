import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import {Form, Field} from 'react-final-form';
import MangaAutocomplete from '../Component/MagazineAutocomplete/MangaAutocomplete';

import axios from "axios";
import {API_MAGAZINE} from "../constant";
import {tokenHeader} from "../controller/user";
import {useDispatch} from "react-redux";
import {setSnackbar} from "../controller/site";


export default function AddMangaButton(props) {
    const {magazine} = props;
    const [open, setOpen] = React.useState(false);
    const dispatch = useDispatch();

    const handleClickOpen = () => {
        setOpen(true);

    };

    const handleClose = () => {
        setOpen(false);
    };

    const onSubmit = (values) => {
        values["manga_id"] = document.getElementById("manga_id").value;
        axios.put(API_MAGAZINE + "/" + magazine["id"] + "/manga", values, {
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
            <Button variant="outlined" color="primary" size="small" onClick={handleClickOpen}>新增漫画</Button>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <Form onSubmit={onSubmit} render={({handleSubmit}) => (
                    <form onSubmit={handleSubmit}>
                        <DialogTitle id="form-dialog-title">新增漫画</DialogTitle>
                        <DialogContent>
                            <Field component={ MangaAutocomplete } name="manga_id" label="漫画" id="manga_id"/>
                        </DialogContent>

                        <DialogActions>
                            <Button onClick={handleClose} color="primary">
                                取消
                            </Button>
                            <Button type="submit" color="primary">
                                创建
                            </Button>
                        </DialogActions>
                    </form>)}/>
            </Dialog>
        </div>
    );
}
