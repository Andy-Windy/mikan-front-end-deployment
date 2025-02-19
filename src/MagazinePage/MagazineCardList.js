import React, {useState} from "react";
import Grid from "@material-ui/core/Grid";

import MagazineCard from "./MagazineCard"
import axios from "axios";
import {setBusy, setSnackbar} from "../controller/site";
import {API_MAGAZINE} from "../constant";
import {useDispatch} from "react-redux";

export default function MagazineCardList(props) {
    const {showFinished} = props;
    const [magazines, setMagazines] = useState([]);
    const dispatch = useDispatch();

    React.useEffect(  () => {
        dispatch(setBusy(true));
         axios.get(API_MAGAZINE, {
            withCredentials: true,
            validateStatus: status => status === 200
        })
            .then(res => res.data)
            .then(res => {
                typeof res.magazines === "object" && setMagazines(res.magazines);
                }
            ).catch(err => {
                dispatch(setSnackbar("获取漫画列表失败", "error"));
            }).finally(() => dispatch(setBusy(false)));
    }, []);

    return (
            <Grid container spacing={1}>
                {magazines.map((magazine) => {
                    if (magazine.status === 0 || showFinished)
                        return (<Grid item xs={6} sm={3} md={3} lg={2} key={magazine.id}><MagazineCard magazine={magazine}/></Grid>);
                })}
            </Grid>
    );
}