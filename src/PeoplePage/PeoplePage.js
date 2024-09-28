import React, {useEffect, useState} from "react";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import {makeStyles} from "@material-ui/core/styles";
import {setTitle} from "../controller/utils";
import {setBusy, setSnackbar} from "../controller/site";
import axios from "axios";
import {API_USER} from "../constant";
import {useDispatch} from "react-redux";
import {Box} from "@material-ui/core";
import UsersTable from "./UsersTable";

const useStyles = makeStyles((theme) => ({
    title: {
        marginTop: theme.spacing(5),
        marginBottom: theme.spacing(5),
    },
}));

export default function PeoplePage() {
    const classes = useStyles();
    const [users, setUsers] = useState([]); // 原始的用户列表
    const [filteredUsers, setFilteredUsers] = useState([]); // 过滤后的用户列表
    const [filterText, setFilterText] = useState(""); // 用户输入的筛选文本
    const dispatch = useDispatch();

    useEffect(() => {
        setTitle("组员");
        dispatch(setBusy(true));
        axios.get(API_USER, {
            withCredentials: true,
            validateStatus: status => status === 200
        })
            .then(res => res.data)
            .then(res => {
                setUsers(res["users"]);
                setFilteredUsers(res["users"]); // 初始情况下过滤结果和原始列表相同
            })
            .catch(err => {
            dispatch(setSnackbar("拉取组员列表失败", "error"));
        }).finally(() => dispatch(setBusy(false)));
    }, []);

    // 当筛选文本改变时，重新过滤用户列表
    useEffect(() => {
        if (filterText.trim() === "") {
            setFilteredUsers(users); // 如果没有筛选条件，则显示全部用户
        } else {
            const regex = new RegExp(filterText, "i"); // 创建不区分大小写的正则表达式
            const filtered = users.filter(user =>
                user && Object.values(user).some(value =>
                    typeof value === 'string' && regex.test(value)
                )
            );
            setFilteredUsers(filtered);
        }
    }, [filterText, users]);

    return (
        <Container>
            <Box display="flex" style={{width: "100%"}} flexDirection="column">
                <div className={classes.title}>
                    <Typography variant="h2">组员</Typography>
                </div>
                <TextField
                    label="搜索"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    value={filterText}
                    onChange={e => setFilterText(e.target.value)}
                />
                {filteredUsers.length === 0 ? (
                    <Typography variant="body1" color="textSecondary">
                        没有找到符合条件的组员。
                    </Typography>
                ) : (
                    <UsersTable users={filteredUsers} />
                )}
            </Box>
        </Container>
    );
}
