import React from "react";
import Hidden from "@material-ui/core/Hidden";
import Drawer from "@material-ui/core/Drawer";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import SidebarItem from "./SidebarItem";
import MenuBookIcon from '@material-ui/icons/MenuBook';
import DateRangeIcon from '@material-ui/icons/DateRange';
import FolderSharedIcon from '@material-ui/icons/FolderShared';
import PeopleIcon from '@material-ui/icons/People';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import ExtensionIcon from '@material-ui/icons/Extension';
import Storage from '@material-ui/icons/Storage';
import useMediaQuery from "@material-ui/core/useMediaQuery";

import {makeStyles, useTheme} from "@material-ui/core/styles";
import {Box} from "@material-ui/core";
import {useSelector} from "react-redux";
import {Deck} from "@material-ui/icons";

export const desktopWidth = 80;
const mobileWidth = 150;

const useStyle = makeStyles((theme) => ({
    drawer: {
        [theme.breakpoints.up('md')]: {
            width: desktopWidth,
            flexShrink: 0,
        },
    },
    placeholder: theme.mixins.toolbar,
    drawerPaper: {
        [theme.breakpoints.up('md')]: {
            width: desktopWidth,
        },
        width: mobileWidth,
    }
}));

export default function Sidebar(props) {
    const {sidebarToggle, openStatus} = props;
    const classes = useStyle();
    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

    const privilege = useSelector(state => state.user.privilege);

    const drawer = (
        <span style={{height: "100%"}}>
            <Box style={{height: "100%"}} display="flex" flexDirection={"column"}
                 justifyContent={"space-between"} alignItems={"stretch"}>
                <Box>
                    <div className={classes.placeholder}/>
                    <Divider/>
                    <List disablePadding={true}>
                        <SidebarItem to={"/"} name={"漫画"} sidebarToggle={sidebarToggle}>
                            <MenuBookIcon style={isDesktop ? {fontSize: 62} : {}}/>
                        </SidebarItem>
                        <SidebarItem to={"/magazinePage"} name={"杂志"} sidebarToggle={sidebarToggle}>
                            <Storage style={isDesktop ? {fontSize: 62} : {}}/>
                        </SidebarItem>
                        <SidebarItem to={"/tasks"} name={"任务"} sidebarToggle={sidebarToggle}>
                            <DateRangeIcon style={isDesktop ? {fontSize: 62} : {}}/>
                        </SidebarItem>
                        <SidebarItem to={"/runningTasks"} name={"进行中的任务"} sidebarToggle={sidebarToggle}>
                            <Deck style={isDesktop ? {fontSize: 62} : {}}/>
                        </SidebarItem>
                        <SidebarItem to={"/cloud"} name={"文件"} sidebarToggle={sidebarToggle}>
                            <FolderSharedIcon style={isDesktop ? {fontSize: 62} : {}}/>
                        </SidebarItem>
                        <SidebarItem to={"/users"} name={"成员"} sidebarToggle={sidebarToggle}>
                            <PeopleIcon style={isDesktop ? {fontSize: 62} : {}}/>
                        </SidebarItem>
                        {privilege > 99 &&
                        <SidebarItem to={"/stat"} name={"统计"} sidebarToggle={sidebarToggle}>
                            <EqualizerIcon style={isDesktop ? {fontSize: 62} : {}}/>
                        </SidebarItem>}
                    </List>
                </Box>
                {privilege > 99 &&
                <Box>
                    <Divider/>
                    <List>
                        <SidebarItem name={"管理"} sidebarToggle={sidebarToggle}>
                            <ExtensionIcon style={isDesktop ? {fontSize: 62} : {}}/>
                        </SidebarItem>
                    </List>
                </Box>
                }
            </Box>
        </span>

    );

    return (<nav className={classes.drawer}>
        <Hidden mdUp implementation="css">
            <Drawer
                variant="temporary"
                anchor="left"
                open={openStatus}
                onClose={sidebarToggle}
                classes={{
                    paper: classes.drawerPaper,
                }}
                ModalProps={{
                    keepMounted: true,
                }}
            >
                {drawer}
            </Drawer>
        </Hidden>
        <Hidden smDown implementation="css">
            <Drawer
                classes={{
                    paper: classes.drawerPaper,
                }}
                variant="permanent"
                open
            >
                {drawer}
            </Drawer>
        </Hidden>
    </nav>);
}