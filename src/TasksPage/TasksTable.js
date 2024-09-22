import React from "react";
import MaterialTable from "material-table";
import {useHistory} from "react-router";
import {tableIcons} from "../Component/MaterialTable/tableIcons";
import {localtime_exact} from "../controller/utils";
import TagChip from "../Component/TagChip/TagChip";
import { Badge } from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles"

//1个月lightBule
//2个月#FFFF00 lightYellow
//3个月#FF5252 lightRed
const useStyles = makeStyles((theme) => ({
    smallBadge: {
        minWidth: '14px', // 设置最小宽度
        width: '14px', // 设置宽度
        height: '14px', // 设置高度
        fontSize: '10px', // 设置字体大小
        padding: '0', // 移除内边距
        borderRadius: '50%', // 保持圆形
    },
    lightBlueBadge: {
        backgroundColor: "lightBlue",
    },
    lightYellowBadge: {
        backgroundColor: '#FFFF00',
    },
    lightRedBadge: {
        backgroundColor: "#FF5252",
    },
}));

const getBadgeContent = (tasks, task, type) => {
    // 假设tasks是一个包含所有漫画任务的数组
    // 计算等待状态大于0的任务数量
    return tasks.filter(t => t.mname === task && String(t.type) === type && t.wait_status%4 > 0).length;
};

const getBadgeStatus = (tasks, task, type) => {
    const waitStatuses = tasks
        .filter(t => t.mname === task && String(t.type) === type && t.wait_status % 4 > 0)
        .map(t => t.wait_status % 4);
    return waitStatuses.length > 0 ? Math.max(...waitStatuses) : 0;
};

export default function TasksTable(props) {
    const classes = useStyles();
    const history = useHistory();
    const {tasks} = props;
    const getBadgeClass = (value) => {
        switch (value) {
            case 1:
                return `${classes.smallBadge} ${classes.lightBlueBadge}`;
            case 2:
                return `${classes.smallBadge} ${classes.lightYellowBadge}`;
            case 3:
                return `${classes.smallBadge} ${classes.lightRedBadge}`;
            default:
                return classes.smallBadge;
        }
    };

    return (
        <MaterialTable icons={tableIcons} columns={[
            {title: "漫画", field: "mname", defaultGroupOrder: 1,
                render: (task) => { // 自定义渲染函数
                const [mname, type] = task.split('-');
                return(
                <Badge badgeContent={getBadgeContent(tasks,task,type)} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} overlap="rectangle" classes={{ badge: getBadgeClass(getBadgeStatus(tasks,task,type)) }}>
                    <span style={{ paddingRight: '10px' }}>{mname}</span>
                </Badge>
                );
            },},
            {title: "章节", field: "cname"},
            {title: "任务", field: "name"},
            {title: "类型", field: "type", lookup: {
                    0: "其他",
                    1: "图源",
                    2: "翻译",
                    3: "校对",
                    4: "嵌字",
                    5: "审核",
                    6: "发布",
                }, defaultGroupOrder: 0},
            {title: "标签", field: "tags", grouping: false, render: task =>
                <>{task["tags"].map((tag, key) => {
                    return <TagChip tag={tag} size="small" key={key}/>;
                })}</>
                , sorting: false},
            {title: "上一次活跃", field: "last_update", render: task => localtime_exact(task["last_update"]), grouping: false},
        ]} options={{
            pageSize: 20,
            grouping: true,
            rowStyle: rowData => {
                const colorMapping = {
                    0: 'transparent',
                    1: 'lightBlue', // 第一种颜色
                    2: '#FFFF00', // 第二种颜色
                    3: '#FF5252', // 第三种颜色
                };
                const backgroundColor = colorMapping[rowData.wait_status % 4] || 'transparent';

                return { backgroundColor };
            }
        }} data={tasks} components={{
            Toolbar: props => (<></>)
        }} onRowClick={(event, rowData, togglePanel) => {
            history.push("/manga/" + rowData["mid"] + "/" + rowData["cid"] + "/" + rowData["id"]);
        }} localization={{
            grouping: {
                placeholder: "拖拽表头至此以聚合显示...",
                groupedBy: "聚合:"
            },
            pagination: {
                labelDisplayedRows: '第{from}到{to}行 共 {count}行',
                labelRowsSelect: '行',
                labelRowsPerPage: '每页行数:',
                firstAriaLabel: '首页',
                firstTooltip: '首页',
                previousAriaLabel: '上一页',
                previousTooltip: '上一页',
                nextAriaLabel: '下一页',
                nextTooltip: '下一页',
                lastAriaLabel: '末页',
                lastTooltip: '末页'
            },
        }}/>
    );
}