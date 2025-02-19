import React from 'react';
import axios from "axios";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import MagazineMangaAutocomplete from '../Component/MagazineAutocomplete/MagazineMangaAutocomplete';

import {Form, Field} from 'react-final-form';
import {API_MAGAZINE} from "../constant";
import {tokenHeader} from "../controller/user";
import {useDispatch} from "react-redux";
import {setSnackbar} from "../controller/site";

export default function DelMangaButton(props) {
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
        axios.delete(API_MAGAZINE + "/manga/" + document.getElementById("manga_id").value, {
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
            <Button variant="outlined" color="primary" size="small" onClick={handleClickOpen}>删除漫画</Button>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <Form onSubmit={onSubmit} render={({handleSubmit}) => (
                    <form onSubmit={handleSubmit}>
                        <DialogTitle id="form-dialog-title">删除漫画</DialogTitle>
                        <DialogContent>
                            <Field component={ MagazineMangaAutocomplete } name="manga_id" label="漫画" id="manga_id" mid={magazine["id"]}/>
                        </DialogContent>

                        <DialogActions>
                            <Button onClick={handleClose} color="primary">
                                取消
                            </Button>
                            <Button type="submit" color="primary">
                                删除
                            </Button>
                        </DialogActions>
                    </form>)}/>
            </Dialog>
        </div>
    );
}
