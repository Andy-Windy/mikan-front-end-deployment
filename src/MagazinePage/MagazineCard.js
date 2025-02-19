import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import cover from '../cover.jpeg';
import Box from "@material-ui/core/Box";
import {Link} from "react-router-dom";
import CircularProgress from "@material-ui/core/CircularProgress";
import Chip from "@material-ui/core/Chip";
import TagChip from "../Component/TagChip/TagChip";
import {tagColor, textColor} from '../Component/TagChip/colors';

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: 175,
        [theme.breakpoints.up("md")]: {
            maxWidth: 275,
        },
        position: "relative",
        margin: theme.spacing(2)
    },
    labels: {
        position: "absolute",
        right: theme.spacing(0),
        top: theme.spacing(0)
    },
    label: {
        marginTop: theme.spacing(0.5),
        marginRight: theme.spacing(0.5)
    },
    content: {
        width: "100%",
        position: "absolute",
        bottom: 0,
        backgroundColor: "black",
        opacity: 0.8
    },
    details: {
        opacity: 1,
        color: "white"
    }
}));

export default function MagazineCard(props) {
    const classes = useStyles();
    const {magazine} = props;
    const [img, changeImg] = useState(cover);
    let datestatus;
    if (magazine.status === 0) {
        datestatus = timeUntilUpdate(magazine.next_update_time);
    } else {
        datestatus = { message: "已完结", color: "red" };
    }
    React.useEffect(() => {
        const img = new Image();
        img.src = magazine.cover;
        img.onload = function () {
            changeImg(magazine.cover);
        }
    }, []);

    return (
        <Card className={classes.root}
              component={Link} to={"/magazine/" + magazine.id}>
            <CardActionArea>
                <CardMedia
                    component={"img"}
                    image={img}
                    title={magazine.name}
                />
                <Box display={"flex"} flexDirection={"row-reverse"} flexWrap="wrap" className={classes.labels}>
                    <Chip style={{backgroundColor: "#99D9EA"}} className={classes.label} size="small" label={magazine.inclusion}/>
                    {datestatus.message !== "无时间" && <Chip style={{backgroundColor: tagColor(datestatus.color),color: textColor(datestatus.color)}} className={classes.label} size="small" label={datestatus.message}/>}
                    {typeof magazine.tags === "object" && magazine.tags.map((tag, key) =>
                        (<TagChip className={classes.label} tag={tag} size="small" key={key}/>))}
                </Box>
                <CardContent className={classes.content}>
                    <div className={classes.details}>
                        <Typography gutterBottom variant="h5" component="h2">
                            {magazine.name || <CircularProgress/>}
                        </Typography>
                    </div>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}

function timeUntilUpdate(stamp) {
    let result = "";
    let color = "lime"; // 默认颜色

    if (typeof stamp !== "number" || isNaN(stamp)) {
        return { message: "时间错误", color: "orange" };
    }

    if( stamp === 0 )
    {
        return { message: "无时间", color: "orange" };
    }

    // 创建一个新的 Date 对象来获取当前时间，并调整时间戳以考虑本地时区偏移
    const currentTimeUTC = new Date();
    const currentTime = new Date(currentTimeUTC.getTime() + 9 * 60 * 60 * 1000);
    const givenTime = new Date(stamp * 1000);

    // 检查给定时间是否已经过去
    if (givenTime <= currentTime) {
        return { message: "任务可更新", color: "orange" };
    }

    // 计算时间差（以毫秒为单位）
    const timeDifference = givenTime - currentTime;

    // 将时间差转换为天、小时和分钟
    const msPerDay = 24 * 60 * 60 * 1000;
    const msPerHour = 60 * 60 * 1000;
    const msPerMinute = 60 * 1000;

    const days = Math.floor(timeDifference / msPerDay);
    const hours = Math.floor((timeDifference % msPerDay) / msPerHour);
    const minutes = Math.floor((timeDifference % msPerHour) / msPerMinute);

    // 根据时间差返回相应的字符串
    if (days >= 1) {
        result = `${days}天后`;
    } else if (hours >= 1) {
        result = `${hours}小时后`;
    } else {
        result = `${minutes}分钟后`;
    }

    return { message: result, color: color };
}