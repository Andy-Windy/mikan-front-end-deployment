import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import ChapterAuthTable from "./ChapterAuthTable";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import axios from "axios";
import {API_MANGA} from "../../constant";
import {setSnackbar} from "../../controller/site";
import {useDispatch} from "react-redux";
import {Box} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    tabsWrap: { // 新增样式类
        '& .MuiTabs-scrollableX': {
            overflowX: 'auto', // 添加滚动条，如果需要
        },
        '& .MuiTabs-flexContainer': {
            justifyContent: 'space-around', // 或 'space-between' 根据需要调整对齐方式
            flexWrap: 'wrap', // 允许标签换行
        },
        '& .MuiTab-root': {
            minWidth: '33%', // 可以根据实际情况调整，确保三个标签能够舒适地显示
            textAlign: 'center', // 让标签文本居中
        },
    },
}));


export default function ChapterAuthList(props) {
    const classes = useStyles();
    const {mid} = props;
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <div className={classes.root}>
            <AppBar position="static" color={"transparent"}>
                <Tabs value={value} onChange={handleChange} className={classes.tabsWrap}>
                    <Tab label="翻译"/>
                    <Tab label="校对"/>
                    <Tab label="嵌字"/>
                </Tabs>
            </AppBar>
            <SubChapterAuthList mid={mid} listNumber={value}/>

        </div>
    );
}

export function SubChapterAuthList(props) {
    const {mid, listNumber} = props;
    const [loading, setLoading] = useState(true);
    const [auths, setAuths] = useState([]);
    const dispatch = useDispatch();

    React.useEffect(() => {
        if (mid !== undefined && mid !== null) { // 确保mid有值
            setLoading(true);
            setAuths([]); // 清空auths以准备接受新数据
            axios.get(`${API_MANGA}/${mid}/chapterAuth`, {
                params: {
                    query_status: listNumber
                },
                withCredentials: true,
                validateStatus: status => status === 200
            })
                .then(res => res.data)
                .then(res => {
                    if (typeof res["chapterauth"] === "object") {
                        setAuths(res["chapterauth"]);
                    }
                })
                .catch(err => {
                    dispatch(setSnackbar("拉取列表失败, 请刷新重试", "error"));
                })
                .finally(() => setLoading(false));
        }
    }, [mid, listNumber]); // 确保当mid或listNumber变化时重新执行
    //     setLoading(true);
    //     setAuths([]);
    //     axios.get(API_MANGA + "/" + mid + "/chapterAuth", {
    //         params: {
    //             query_status: listNumber
    //         },
    //         withCredentials: true,
    //         validateStatus: status => status === 200
    //     })
    //         .then(res => res.data)
    //         .then(res => {
    //                 typeof res["chapterauth"] === "object" && setAuths(res["chapterauth"]);
    //             }
    //         ).catch(err => {
    //         dispatch(setSnackbar("拉取列表失败, 请刷新重试", "error"));
    //     }).finally(() => setLoading(false));
    // },[listNumber]);

    return (
        <Box display="flex" style={{width: "100%"}} flexDirection="column">
            <ChapterAuthTable auths={auths}/>
        </Box>
    );
}