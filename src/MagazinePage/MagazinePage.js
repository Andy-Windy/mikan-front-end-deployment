import React, {useState} from "react";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import {makeStyles} from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import {Route, Switch, useParams, useRouteMatch, Link as RouterLink} from "react-router-dom";
import Skeleton from "@material-ui/lab/Skeleton";
import cover from "../cover.jpeg";
import Collapse from "@material-ui/core/Collapse";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import clsx from "clsx";
import IconButton from "@material-ui/core/IconButton";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import { Switch as MaterialUISwitch } from "@material-ui/core";
import MangaCard from "../MainPage/MangaCard";

import axios from "axios";
import {API_MAGAZINE} from "../constant";
import {setBusy, setSnackbar} from "../controller/site";
import {useDispatch, useSelector} from "react-redux";
import {setTitle} from "../controller/utils";
import {change2Time} from "../controller/timer";
import TagChip from "../Component/TagChip/TagChip";
import AddTagChip from "../Component/TagChip/AddTagChip";
import Link from "@material-ui/core/Link";
import EditMagazineButton from "./EditMagazineButton";
import AddMangaButton from "./AddMangaButton";
import DelMangaButton from "./DelMangaButton";
import UpdateMagazineButton from "./UpdateMagazineButton";
import SkipUpdateButton from "./SkipUpdateButton";

const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
      },
    coverCard: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      maxWidth: 275,
      position: "relative"
    },
    contentBox: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
    },
    titleArea: {
        marginTop: theme.spacing(5),
        marginBottom: theme.spacing(1),
    },
    label: {
        marginTop: theme.spacing(0.5),
        marginRight: theme.spacing(0.5)
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    }
  }));

export default function MagazinePage(props) {
    const classes = useStyles();
    const {id} = useParams();
    const {path} = useRouteMatch();
    const dispatch = useDispatch();
    const privilege = useSelector(state => state.user.privilege);
    const [adminAuth, setAdminAuth] = useState(false);
    const [expanded, setExpanded] = React.useState(false);
    const [showFinished, setShowFinished] = React.useState(false);
    const [magazine, setMagazine] = useState({});

    const onChangeFinish = (event) => {
        setShowFinished(event.target.checked);
    };

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    React.useEffect(() => {
        dispatch(setBusy(true));
        axios.get(API_MAGAZINE + "/" + id, {
            withCredentials: true,
            validateStatus: status => status === 200
        })
            .then(res => res.data)
            .then(res => {
                    setMagazine(res);
                    setTitle(res.name);
                }
            ).catch(err => {
            dispatch(setSnackbar("获取杂志信息失败", "error"));
        }).finally(() => dispatch(setBusy(false)));
    }, []);

    React.useEffect(() => {
        setAdminAuth(privilege >= 2);
    }, [privilege]);

    return (
        <Container maxWidth={"lg"}>
            <Box display={"flex"} alignItems={"flex-end"} className={classes.titleArea}>
                <Box flexGrow={1}>
                    {/* 这里是添加标签 */}
                    <Typography variant="h5">
                        {(typeof magazine.tags === "object" && magazine.tags.map((tag, key) => {
                            return <TagChip key={key} size="small" tag={tag} className={classes.label}
                                            deletable={adminAuth ? "true" : "false"} lid={id}/>;
                        })) || <Skeleton/>}
                        {typeof magazine.tags === "object" && adminAuth &&
                        <AddTagChip className={classes.label} level={3} lid={magazine["id"]}/>}
                    </Typography>
                    {/* 这里是把杂志名给写上去 */}
                    <Typography variant="h2">
                        {<Link component={RouterLink} to={"/magazine/" + magazine["id"]}
                               color="inherit">{magazine.name}</Link> || <Skeleton/>}
                    </Typography>
                </Box>
                {/* 这里是更新、编辑、杂志按钮 */}
                <Switch>
                    <Route exact path={path}>
                        <Box mr={1}>{adminAuth && <EditMagazineButton magazine={magazine}/>}</Box>
                        <Box mr={1}>{adminAuth && <AddMangaButton magazine={magazine}/>}</Box>
                        <Box mr={1}>{adminAuth && <DelMangaButton magazine={magazine}/>}</Box>
                    </Route>
                </Switch>
            </Box>
            <div className={classes.root}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                    <Box display="flex" justifyContent="center" alignItems="center">
                        <Card className={classes.coverCard}>
                            <CardMedia component={"img"} image={magazine.cover || cover} title={magazine.name} />
                        </Card>
                    </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                    <Box display={"flex"} flexDirection={"column"} className={classes.root}>
                        <Box display={"flex"}>
                            <Box flexGrow={1}>
                                <Typography variant="h5">详细信息</Typography>
                            </Box>
                        </Box>
                        <Box display="flex" flexDirection={"column"} style={{ width: '100%' }}>
                            {magazine.url && <Box display="flex" flexDirection={"row"}>
                                <Box flexGrow={1}><Typography>出处</Typography></Box>
                                <Link href={magazine.url} target="_blank" rel="noopener noreferrer"> {magazine.url} </Link>
                            </Box>}
                            {magazine.next_update_time !== 0 && <Box display="flex" flexDirection={"row"}>
                                <Box flexGrow={1}><Typography>下一次更新时间（日本时间）</Typography></Box>
                                <Box>{change2Time(magazine.next_update_time)}</Box>
                            </Box>}
                            {magazine.next_update_time !== 0 && <Box display="flex" flexDirection={"row"}>
                                <Box flexGrow={1}><Typography>距离下次更新剩余时间</Typography></Box>
                                <Box>{timeToUpdate(magazine.next_update_time)}</Box>
                            </Box>}
                            {magazine.media && <Box display="flex" flexDirection={"row"}>
                                <Box flexGrow={1}><Typography>媒介</Typography></Box>
                                <Box>{magazine.media}</Box>
                            </Box>}
                            <Box display="flex" flexDirection={"row"}>
                                <Box flexGrow={1}><Typography>状态</Typography></Box>
                                <Box>{magazine.status === 0 ? "连载中" : "完结"}</Box>
                            </Box>
                            <Box>
                                <Typography paragraph>{magazine.ps}</Typography>
                            </Box>
                        </Box>
                    </Box>
                        <Box className={classes.contentBox}>
                            <Box style={{ marginRight: '10px' }}>{adminAuth && magazine.status === 0 && <UpdateMagazineButton magazine={magazine} />}</Box>
                            <Box>{adminAuth && magazine.status === 0 && magazine.need_update && <SkipUpdateButton magazine={magazine} />}</Box>
                        </Box>
                    </Grid>
                </Grid>
            </div>
            <Box style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Box>
                    <IconButton className={clsx(classes.expand, { [classes.expandOpen]: expanded, })}
                        onClick={handleExpandClick}
                        aria-expanded={expanded}
                        aria-label="更多选项" >
                        <ExpandMoreIcon/>
                    </IconButton>
                </Box>
            </Box>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <Box flexGrow={1}></Box>
                <Box display={"flex"} justifyContent="flex-end">
                    <FormControlLabel
                        checked={showFinished}
                        onChange={onChangeFinish}
                        size={"small"}
                        control={<MaterialUISwitch color="primary"/>}
                        label="显示完结的作品"
                        labelPlacement="start"/>
                </Box>
            </Collapse>
            <Grid container spacing={1}>
                {typeof magazine.mangas === "object" && magazine.mangas.map((manga) => {
                    if (manga.status_at_magazine === 0 || showFinished)
                        return (<Grid item xs={6} sm={3} md={3} lg={2} key={manga.id}><MangaCard manga={manga}/></Grid>);
                })}
            </Grid>
        </Container>
    );
}

function timeToUpdate(stamp) {
    let result = "";

    if (typeof stamp !== "number" || isNaN(stamp)) {
        return "时间错误";
    }

    if( stamp === 0 )
    {
        return "无时间";
    }

    const currentTimeUTC = new Date();
    const currentTime = new Date(currentTimeUTC.getTime() + 9 * 60 * 60 * 1000);
    // 将时间戳转换为 Date 对象
    const givenTime = new Date(stamp * 1000);

    // 检查给定时间是否已经过去
    if (givenTime <= currentTime) {
        return "等待任务更新中······";
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

    return result;
}