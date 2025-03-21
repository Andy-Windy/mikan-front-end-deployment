import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Box from "@material-ui/core/Box";
import {useDispatch, useSelector} from "react-redux";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import DataRender from "./DataRender";
import {localtime_exact} from "../../../controller/utils";
import UserChip from "../../../Component/UserChip/UserChip";

import axios from "axios";
import {API_MANGA} from "../../../constant";
import {setGoo, tokenHeader} from "../../../controller/user";
import {setBusy, setSnackbar} from "../../../controller/site";
import DialogTitle from "@material-ui/core/DialogTitle";
import {Field, Form} from "react-final-form";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Dialog from "@material-ui/core/Dialog";
import UserAutocomplete from "../../../Component/UserAutocomplete/UserAutocomplete";
import StatusIcon from "../../../Component/StatusIcon/StatusIcon";
import Chip from "@material-ui/core/Chip";
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Radio from "@material-ui/core/Radio"

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%'
    },
    listItem: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
    button: {
        marginLeft: theme.spacing(1),
    }
}));

const statusToColor = (status) => {
    switch (status % 4) {
        case 1:
            return { color: 'lightBlue', label: '三成熟' }
        case 2:
            return { color: 'rgba(255, 255, 0, 0.5)', label: '五成熟' }
        case 3:
            return { color: 'rgba(255, 82, 82, 0.5)', label: '七成熟' }
        default:
            return { color: 'rgba(46, 255, 60, 0.7)', label: '新鲜' }
    }
};

export default function TaskBlock(props) {
    const classes = useStyles();
    const {task, adminAuth} = props;
    const [taskState, setTaskState] = useState();
    const dispatch = useDispatch();

    React.useEffect(() => {
        setTaskState(task);
    }, [task]);

    const handleDismiss = () => {
        dispatch(setBusy(true));
        axios.delete(API_MANGA + "/" + taskState["mid"] + "/chapter/" + taskState["cid"] + "/task/" + taskState["id"] + "/charge", {
            headers: tokenHeader(),
            validateStatus: status => status === 200
        }).then(res => res.data).then(res => {
            setTaskState(Object.assign({}, taskState, {accept_by: {uid: "", nickname: "", avatar: ""}}));
        }).catch(err => {
            try {
                console.log(err.response.data.detail);
                dispatch(setSnackbar(err.response.data.detail, "error"));
            } catch (e) {
                dispatch(setSnackbar("未知的错误", "error"));
            }
        }).finally(() => dispatch(setBusy(false)));
    };

    return (
        <div className={classes.root}>
            <Box display="flex" flexDirection="column">
                <Box display="flex" className={classes.listItem}>
                    <Box flexGrow={1}><Typography variant="h6">承接人</Typography></Box>
                    <Box>
                        {taskState && taskState["accept_by"]["uid"] !== "" &&
                        <UserChip user={taskState["accept_by"]}
                                  onDelete={adminAuth && (taskState["status"] === 0 || taskState["status"] === 2) && handleDismiss}/>}
                        {taskState && taskState["accept_by"]["uid"] === "" &&
                        <ToggleButtons taskState={taskState} setTaskState={setTaskState} {...props} />}
                    </Box>
                </Box>
                <Divider/>
                <Box display="flex" className={classes.listItem}>
                    <Box flexGrow={1}><Typography variant="h6">状态</Typography></Box>
                    <Box><Typography variant="h6">{taskState && taskState["status"] === 0 && <StatusIcon status={0}/>}
                        {taskState && taskState["status"] === 1 && <StatusIcon status={1}/>}
                        {taskState && taskState["status"] === 2 && <StatusIcon status={2}/>}
                    </Typography></Box>
                    <Box>{taskState &&
                    <ToggleStatusButtons taskState={taskState} setTaskState={setTaskState} {...props}/>}</Box>

                </Box>
                {taskState && taskState["wait_status"] !== null && taskState["status"] === 0 && <>
                    <Divider/>
                    <Box display="flex" className={classes.listItem}>
                        <Box flexGrow={1}><Typography variant="h6">鸽度</Typography></Box>
                        <WaitStatusChip taskState={taskState} setTaskState={setTaskState} {...props}></WaitStatusChip>
                    </Box>
                </>}
                {taskState && taskState["accept_by"]["uid"] !== "" && <>
                    <Divider/>
                    <Box display="flex" className={classes.listItem}>
                        <Box flexGrow={1}><Typography>承接时间</Typography></Box>
                        <Box>{localtime_exact(taskState["accept_on"])}</Box>
                    </Box>
                </>}
                {taskState && taskState["status"] === 1 && <>
                    <Divider/>
                    <Box display="flex" className={classes.listItem}>
                        <Box flexGrow={1}><Typography>完成时间</Typography></Box>
                        <Box>{localtime_exact(taskState["complete_on"])}</Box>
                    </Box>
                </>}
                <Divider/>
                <Box display="flex" className={classes.listItem}>
                    <Box flexGrow={1}><Typography>创建时间</Typography></Box>
                    <Box>{taskState && localtime_exact(taskState["create_on"])}</Box>
                </Box>
            </Box>
            <DataRender data={taskState && taskState["data"]}/>
        </div>
    );
}

function ToggleButtons(props) {
    const classes = useStyles();
    const {taskState, adminAuth, setTaskState} = props;
    const privilege = useSelector(state => state.user.privilege);
    const uid = useSelector(state => state.user.uid);
    const dispatch = useDispatch();

    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const onSubmit = (values) => {
        handleAssign(values["assign_to"])();
        handleClose();
    };

    const handleAssign = (assign_to) => () => {
        if (assign_to === uid) dispatch(setGoo());
        dispatch(setBusy(true));
        axios.get(API_MANGA + "/" + taskState["mid"] + "/chapter/" + taskState["cid"] + "/task/" + taskState["id"] + "/charge", {
            params: {assign_to: assign_to},
            headers: tokenHeader(),
            validateStatus: status => status === 200
        }).then(res => res.data).then(res => {
            setTaskState(res);
        }).catch(err => {
            try {
                console.log(err.response.data.detail);
                dispatch(setSnackbar(err.response.data.detail, "error"));
            } catch (e) {
                dispatch(setSnackbar("未知的错误", "error"));
            }
        }).finally(() => dispatch(setBusy(false)));
    };

    const handleAssignNormal = (assign_to) => () => {
        if (assign_to === uid) dispatch(setGoo());
        dispatch(setBusy(true));
        axios.get(API_MANGA + "/" + taskState["mid"] + "/chapter/" + taskState["cid"] + "/task/" + taskState["id"] + "/charge_normal", {
            params: {assign_to: assign_to},
            headers: tokenHeader(),
            validateStatus: status => status === 200
        }).then(res => res.data).then(res => {
            setTaskState(res);
        }).catch(err => {
            try {
                console.log(err.response.data.detail);
                dispatch(setSnackbar(err.response.data.detail, "error"));
            } catch (e) {
                dispatch(setSnackbar("未知的错误", "error"));
            }
        }).finally(() => dispatch(setBusy(false)));
    };

    if (privilege === 0) return <Typography>无</Typography>;

    return <>
        {adminAuth && <Button variant="contained" color="primary" onClick={handleClickOpen} className={classes.button}>分配</Button>}
        {taskState["status"] === 0 && <Button variant="contained" color="primary" onClick={handleAssignNormal(uid)} className={classes.button}>承接</Button>}

        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" maxWidth="sm" fullWidth>
            <DialogTitle id="form-dialog-title">分配</DialogTitle>
            <Form onSubmit={onSubmit} render={({handleSubmit}) => (
                <form onSubmit={handleSubmit}>
                    <DialogContent>
                        <Field component={ UserAutocomplete } name="assign_to" label="分配"/>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            取消
                        </Button>
                        <Button type="submit" color="primary">
                            保存
                        </Button>

                    </DialogActions>
                </form>)}/>
        </Dialog>
    </>;
}

function ToggleStatusButtons(props) {
    const classes = useStyles();
    const {taskState, adminAuth, setTaskState} = props;
    const uid = useSelector(state => state.user.uid);
    const dispatch = useDispatch();

    const handleStatusClick = (to) => () => {
        dispatch(setBusy(true));
        axios.get(API_MANGA + "/" + taskState["mid"] + "/chapter/" + taskState["cid"] + "/task/" + taskState["id"] + "/status", {
            params: {to: to},
            headers: tokenHeader(),
            validateStatus: status => status === 200
        }).then(res => res.data).then(res => {
            setTaskState(res);
            if (to === 1 && taskState["accept_by"]["uid"] === uid) dispatch(setGoo());
        }).catch(err => {
            try {
                console.log(err.response.data.detail);
                dispatch(setSnackbar(err.response.data.detail, "error"));
            } catch (e) {
                dispatch(setSnackbar("未知的错误", "error"));
            }
        }).finally(() => dispatch(setBusy(false)));
    };

    return <>{taskState["status"] === 0 && <>
        {adminAuth && <Button variant="contained" color="secondary" size="small" onClick={handleStatusClick(2)} className={classes.button}><StatusIcon status={2}/>停止</Button>}
        {(taskState["accept_by"]["uid"] === uid || adminAuth) && taskState["accept_by"]["uid"] !== "" &&
        <Button variant="contained" color="primary" size="small" onClick={handleStatusClick(1)} className={classes.button}><StatusIcon status={1}/>完成</Button>}
    </>}
        {adminAuth && <>{taskState && taskState["status"] === 1 &&
        <Button variant="contained" color="primary" size="small" onClick={handleStatusClick(0)} className={classes.button}><StatusIcon status={0}/>再开</Button>}
            {taskState && taskState["status"] === 2 &&
            <Button variant="contained" color="primary" size="small" onClick={handleStatusClick(0)} className={classes.button}><StatusIcon status={0}/>开始</Button>}</>}
    </>;
}


function WaitStatusChip(props) {
    const {taskState, adminAuth, setTaskState} = props;
    const [selectedValue, setSelectedValue] = useState(taskState["wait_status"]); // 初始化状态

    const dispatch = useDispatch();

    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const onSubmit = () => {
        handleAssign(selectedValue)();
        handleClose();
    };

    const handleRadioChange = (event) => {
        setSelectedValue(event.target.value); // 更新状态
    };

    const handleAssign = (selectedValue) => () => {
        dispatch(setBusy(true));
        axios.get(API_MANGA + "/" + taskState["mid"] + "/chapter/" + taskState["cid"] + "/task/" + taskState["id"] + "/waitStatusChange", {
            params: {selected_value: selectedValue},
            headers: tokenHeader(),
            validateStatus: status => status === 200
        }).then(res => res.data).then(res => {
            setTaskState(res);
        }).catch(err => {
            try {
                console.log(err.response.data.detail);
                dispatch(setSnackbar(err.response.data.detail, "error"));
            } catch (e) {
                dispatch(setSnackbar("未知的错误", "error"));
            }
        }).finally(() => dispatch(setBusy(false)));
    };

    return <>
        {adminAuth && <Chip style={{ backgroundColor: statusToColor(taskState["wait_status"]).color }} onClick={handleClickOpen} label={statusToColor(taskState["wait_status"]).label}/>}
        {(!adminAuth) && <Chip style={{ backgroundColor: statusToColor(taskState["wait_status"]).color }} label={statusToColor(taskState["wait_status"]).label}/>}

        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" maxWidth="sm" fullWidth>
            <DialogTitle id="form-dialog-title">修改</DialogTitle>
            <DialogContent>
                <FormControl component="fieldset">
                    <RadioGroup aria-label="gender" name="gender1" value={String(selectedValue)} onChange={handleRadioChange} row>
                        <FormControlLabel value="4" control={<Radio />} label="新鲜" />
                        <FormControlLabel value="5" control={<Radio />} label="三成熟" />
                        <FormControlLabel value="6" control={<Radio />} label="五成熟" />
                        <FormControlLabel value="7" control={<Radio />} label="七成熟" />
                        <FormControlLabel value="0" control={<Radio />} label="自动设置" />
                    </RadioGroup>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    取消
                </Button>
                <Button onClick={onSubmit} color="primary">
                    保存
                </Button>
            </DialogActions>
        </Dialog>
    </>;
}