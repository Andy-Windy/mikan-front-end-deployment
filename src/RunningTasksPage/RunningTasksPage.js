import React, {useEffect, useState} from "react";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import {makeStyles} from "@material-ui/core/styles";
import {setTitle} from "../controller/utils";
import {setBusy, setSnackbar} from "../controller/site";
import axios from "axios";
import {API_RUNNING_TASK, API_TASK} from "../constant";
import {useDispatch} from "react-redux";
import {Box} from "@material-ui/core";
import RunningTasksTable from "./RunningTasksTable";

const useStyles = makeStyles((theme) => ({
    title: {
        marginTop: theme.spacing(5),
        marginBottom: theme.spacing(5),
    },
    taskListItem: {
        marginTop: theme.spacing(1)
    }
}));

export default function RunningTasksPage() {
    const classes = useStyles();
    const [tasks, setTasks] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        setTitle("进行中的任务");
        dispatch(setBusy(true));
        axios.get(API_RUNNING_TASK, {
            withCredentials: true,
            validateStatus: status => status === 200
        })
            .then(res => res.data)
            .then(res => {
                const processedTasks = res["tasks"].map(task => ({
                    ...task,
                    mname: `${task.mname}鸪鸪鸪${task.type}`
                }));
                setTasks(processedTasks);
                }
            ).catch(err => {
            dispatch(setSnackbar("拉取任务列表失败", "error"));
        }).finally(() => dispatch(setBusy(false)));
    }, []);

    return (
        <Container>
            <Box display="flex" style={{width: "100%"}} flexDirection="column">
                <div className={classes.title}>
                    <Typography variant="h2">进行中的任务</Typography>
                </div>
                <RunningTasksTable tasks={tasks}/>
            </Box>
        </Container>
    );
}