import React from "react";
import Chip from "@material-ui/core/Chip";
import AvatarIcon from "../AvatarIcon/AvatarIcon";
import {useHistory} from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    userChip: {
        backgroundColor: 'white',
        color: 'black', // 文本颜色
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: 'lightgray', // 鼠标悬停时的颜色
        },
    },
}));

export default function ForTableUserChip(props) {
    const {user} = props;
    const history = useHistory();
    const classes = useStyles();

    if (user === undefined) return (<></>);

    return (
        <Chip aria-label="User Chip" onClick={(e) => { e.stopPropagation();  history.push("/user/" + user["uid"]); }} className={classes.userChip}
        clickable avatar={<AvatarIcon avatar={user["avatar"]} name={user["nickname"]}/>} label={user["nickname"]} {...props}/>
    );
}