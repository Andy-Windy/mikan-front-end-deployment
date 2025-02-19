import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import clsx from "clsx";
import IconButton from "@material-ui/core/IconButton";
import Box from "@material-ui/core/Box";
import Divider from "@material-ui/core/Divider";
import Collapse from "@material-ui/core/Collapse";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelActions from "@material-ui/core/ExpansionPanelActions";
import EditMangaButton from "./EditMangaButton";
import UserChip from "../Component/UserChip/UserChip";

import {localtime} from "../controller/utils";
import {API_MANGA} from "../constant";
import {change2Time} from '../controller/timer';
import {Link as RouterLink} from "react-router-dom";
import DeleteButton from "../Component/DeleteButton/DeleteButton";
import ChapterAuthList from './ChapterAuthList/ChapterAuthList';
import Link from "@material-ui/core/Link";
import Skeleton from "@material-ui/lab/Skeleton";

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        marginTop: theme.spacing(1)
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
    },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary,
    },
    details: {
        alignItems: 'center',
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
    },
}));

export default function Metadata(props) {
    const classes = useStyles();
    const {manga, adminAuth} = props;
    const [expanded, setExpanded] = React.useState(true);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    return (
        <Box display={"flex"} flexDirection={"column"} className={classes.root}>
            <Box display={"flex"}>
                <Box flexGrow={1}>
                    <Typography variant="h5">详细信息</Typography>
                </Box>
                <Box alignSelf={"flex-end"}>
                    <IconButton
                        className={clsx(classes.expand, {
                            [classes.expandOpen]: expanded,
                        })}
                        onClick={handleExpandClick}
                        aria-expanded={expanded}
                        aria-label="详情"
                    >
                        <ExpandMoreIcon/>
                    </IconButton>
                </Box>
            </Box>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <ExpansionPanelDetails className={classes.details}>
                    <Box display="flex" flexDirection={"column"} style={{ width: '100%' }}>

                        <Box display="flex" flexDirection={"row"}>
                            <Box flexGrow={1}><Typography>制作人</Typography></Box>
                            <Box><UserChip user={manga.producer} size="small"/></Box>
                        </Box>
                        <Box display="flex" flexDirection={"row"}>
                            <Box flexGrow={1}><Typography>开坑时间</Typography></Box>
                            <Box>{localtime(manga.create_on)}</Box>
                        </Box>
                        <Box display="flex" flexDirection={"row"}>
                            <Box flexGrow={1}><Typography>最后一次活跃</Typography></Box>
                            <Box>{localtime(manga.last_update)}</Box>
                        </Box>
                        {manga.magazine_name && <Box display="flex" flexDirection={"row"}>
                            <Box flexGrow={1}><Typography>所属杂志</Typography></Box>
                            <Box>{<Link component={RouterLink} to={"/magazine/" + manga.attribute_magazine} color="inherit">{manga.magazine_name}</Link> || <Skeleton/>}</Box>
                        </Box>}
                        {manga.next_update_time !== 0 && manga.status_at_magazine === 0 && manga.magazine_status === 0 && <Box display="flex" flexDirection={"row"}>
                            <Box flexGrow={1}><Typography>下一次更新时间（日本时间）</Typography></Box>
                            <Box>{change2Time(manga.next_update_time)}</Box>
                        </Box>}
                        <Box display="flex" flexDirection={"row"}>
                            <Box flexGrow={1}><Typography>状态</Typography></Box>
                            <Box>{(manga.status_at_magazine === 0 && manga.magazine_status === 0)? "连载中" : "已完结"}</Box>
                        </Box>
                        <Box>
                            <Typography paragraph>{manga.ps}</Typography>
                        </Box>
                    </Box>
                </ExpansionPanelDetails>
                <Divider/>
                <ExpansionPanelActions>
                    {adminAuth && <>
                        <DeleteButton api={API_MANGA + "/" + manga["id"]} size="small" variant="outlined"
                                      callback={""} className={classes.button} id={manga["id"]} name={"漫画"}/>
                                      <EditMangaButton manga={manga}/></>}
                </ExpansionPanelActions>
            </Collapse>
            <ChapterAuthList mid={manga["id"]}/>
        </Box>
    );
}
