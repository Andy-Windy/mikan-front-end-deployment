import React from "react";
import MaterialTable from "material-table";

import {useHistory} from "react-router";
import {tableIcons} from "../../Component/MaterialTable/tableIcons";
import {localtime} from "../../controller/utils";

  

export default function ChapterAuthTable(props) {
    const history = useHistory();
    const {auths} = props;

    return (
        <MaterialTable icons={tableIcons} columns={[
            {title: "用户", field: "nickname"},
            {title: "完成话数", field: "count"},
            {title: "最近活跃", field: "lastComplete",render: rowData => localtime(rowData.lastComplete), }
        ]} options={{
            pageSize: 7 ,
            paging: false,
        }} data={auths} components={{
            Pagination: () => null,
            Toolbar: props => (<></>)
        }} onRowClick={(event, rowData, togglePanel) => {
            history.push("/user/" + rowData["accept_uid"]);
        }} 
        />
        );
}
