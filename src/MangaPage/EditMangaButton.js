import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import UserAutocomplete from "../Component/UserAutocomplete/UserAutocomplete";
import MagazineAutocomplete from '../Component/MagazineAutocomplete/MagazineAutoComplete';
import ImgUrlTextField from "../Component/ImgUrlTextField/ImgUrlTextField";

import axios from "axios";
import {Form, Field} from 'react-final-form';
import {TextField, Checkboxes} from 'mui-rff';
import {API_MANGA} from "../constant";
import {tokenHeader} from "../controller/user";
import {useDispatch, useSelector} from "react-redux";
import {setSnackbar} from "../controller/site";
import {useHistory} from "react-router";



export default function EditMangaButton(props) {
    const {manga} = props;
    const privilege = useSelector(state => state.user.privilege);
    const [open, setOpen] = React.useState(false);
    const dispatch = useDispatch();
    const history = useHistory();

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const onSubmit = (values) => {
        values["producer"] = document.getElementById("producer").value;
        values["cover"] = document.getElementById("cover").value;
        values["attribute_magazine"] = values.attribute_magazine?.id;
        values["cherry"] = values["cherry"] === true;
        values["status"] = values["status"] === true ? 1 : 0;
        values["ps"] = values["ps"] ? values["ps"] : "";
        values["status_at_magazine"] = values["status_at_magazine"] === true ? 1 : 0;
        axios.post(API_MANGA + "/" + manga["id"], values, {
            headers: tokenHeader(),
            validateStatus: status => status === 200
        }).then(res => res.data).then(res => {
            if (res["id"] !== manga["id"])
                history.replace("/manga/" + res["id"]);
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
            <Button variant="outlined" color="primary" size="small" onClick={handleClickOpen}>编辑漫画</Button>

            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <Form initialValues={{name: manga.name, id: manga.id, cherry: manga.cherry, status: manga.status === 1, ps: manga.ps, status_at_magazine: manga.status_at_magazine === 1,}}
                    onSubmit={onSubmit} render={({handleSubmit}) => (
                    <form onSubmit={handleSubmit}>
                        <DialogTitle id="form-dialog-title">编辑漫画</DialogTitle>
                        <DialogContent>
                            <TextField autoFocus margin="dense" name="name" label="漫画名称" type="string" fullWidth required/>
                            <TextField margin="dense" name="id" label="漫画ID" type="string" fullWidth required helperText="漫画ID会出现在URL上，不可重名，最好避免使用汉字。"/>
                            <Checkboxes name="status" data={{label: "汉化完成", value: "cherry"}}/>
                            <Checkboxes name="status_at_magazine" data={{label: "已完结", value: "status_at_magazine"}}/>
                            <Field component={ UserAutocomplete } name="producer" label="制作人" id="producer" disabled={privilege < 2} initVal={manga.producer} style={{ marginBottom: '7px' }}/>
                            <Field component={ MagazineAutocomplete } name="attribute_magazine" label="杂志" id="attribute_magazine" fullWidth isRequired={false} initVal={manga.attribute_magazine}/>
                            <Field component={ ImgUrlTextField } name="cover" initVal={manga.cover}/>
                            <TextField name="ps" label={"備考"} multiline rowsMax={5}/>
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
