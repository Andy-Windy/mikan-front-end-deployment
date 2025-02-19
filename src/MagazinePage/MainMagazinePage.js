import React, {useEffect} from "react";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import {makeStyles} from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import clsx from "clsx";
import Collapse from "@material-ui/core/Collapse";
import {useSelector} from "react-redux";
import {setTitle} from "../controller/utils";

import NewMagazineButton from "./NewMagazineButton";
import MagazineCardList from "./MagazineCardList";
import DelMagazineButton from "./DelMagazineButton";

const useStyles = makeStyles((theme) => ({
    titleArea: {
        marginTop: theme.spacing(5),
        marginBottom: theme.spacing(5),
    },
    cardsArea: {
        margin: theme.spacing(5)
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

export default function MainMagazinePage(props) {
    const classes = useStyles();
    const privilege = useSelector(state => state.user.privilege);
    const [expanded, setExpanded] = React.useState(false);
    const [showFinished, setShowFinished] = React.useState(false);

    useEffect(() => setTitle(""), []);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const onChangeFinish = (event) => {
        setShowFinished(event.target.checked);
    };

    return (
        <Container>
            <Box display={"flex"} className={classes.titleArea}>
                <Box flexGrow={1}>
                    <Typography variant="h5">雑誌</Typography>
                    <Typography variant="h2">觀測中</Typography>
                </Box>
                <Box alignSelf={"flex-end"}>
                    <IconButton
                        className={clsx(classes.expand, {
                            [classes.expandOpen]: expanded,
                        })}
                        onClick={handleExpandClick}
                        aria-expanded={expanded}
                        aria-label="更多选项"
                    >
                        <ExpandMoreIcon/>
                    </IconButton>
                </Box>
            </Box>

            <Collapse className={classes.filterArea} in={expanded} timeout="auto" unmountOnExit>
                <Box flexGrow={1}>
                </Box>
                <Box display={"flex"} justifyContent="flex-end">
                    {privilege >= 2 && (<><Box mr={2}><NewMagazineButton /></Box><DelMagazineButton/></>)}
                    <FormControlLabel
                        checked={showFinished}
                        onChange={onChangeFinish}
                        value={showFinished}
                        size={"small"}
                        control={<Switch color="primary"/>}
                        label="显示完结杂志"
                        labelPlacement="start"/>
                </Box>
            </Collapse>
            <MagazineCardList showFinished={showFinished}/>
        </Container>
    );
}