// import React from "react";
// import Autocomplete from "@material-ui/lab/Autocomplete";
// import TextField from "@material-ui/core/TextField";
// import CircularProgress from "@material-ui/core/CircularProgress";
// import axios from "axios";
// import {API_MAGAZINE} from "../../constant";
// import {setSnackbar} from "../../controller/site";
// import {useDispatch} from "react-redux";
// import matchSorter from "match-sorter";

// export default function MagazineAutocomplete(props) {
//     const {input, label, initVal, isRequired} = props;
//     const [open, setOpen] = React.useState(false);
//     const [loading, setLoading] = React.useState(false);
//     const [magazineList, setMagazineList] = React.useState([]);
//     const dispatch = useDispatch();

//     React.useEffect(() => {
//         if (open && !loading && magazineList.length === 0) {
//             setLoading(true);
//             axios.get(API_MAGAZINE, {
//                 withCredentials: true,
//                 validateStatus: status => status === 200
//             })
//                 .then(res => res.data)
//                 .then(res => {
//                         typeof res.magazines === "object" && setMagazineList(res.magazines);
//                     }
//                 ).catch(err => {
//                 dispatch(setSnackbar("拉取杂志列表失败，请重试", "error"));
//             }).finally(() => setLoading(false));
//         }
//     }, [open]);

//     return (
//         <Autocomplete open={open} onOpen={() => setOpen(true)} onClose={() => setOpen(false)}
//                       loading={loading} loadingText="加载中..." noOptionsText="没有此杂志" options={magazineList}
//                       {...props} onChange={((event, value) => input.onChange(value ? { id: value.id, name: value.name } : null))}
//                       getOptionLabel={(option) => option.name} defaultValue={initVal}
//                       renderOption={(option) => option.name + "@" + option.id}
//                       getOptionSelected={(option, value) => option.id === value.id}
//                       filterOptions={(options, { inputValue }) =>
//                           matchSorter(options, inputValue, {keys: ["name", "id"]})}
//                       renderInput={(params) => (
//                           <TextField required = {isRequired}
//                               {...params}
//                               label={label}
//                               InputProps={{
//                                   ...params.InputProps,
//                                   endAdornment: (
//                                       <React.Fragment>
//                                           {loading ? <CircularProgress size={20}/> : null}
//                                           {params.InputProps.endAdornment}
//                                       </React.Fragment>
//                                   ),
//                               }}
//                           />
//                       )}/>
//     );
// }

import React from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";
import axios from "axios";
import { API_MAGAZINE } from "../../constant";
import { setSnackbar } from "../../controller/site";
import { useDispatch } from "react-redux";
import matchSorter from "match-sorter";

export default function MagazineAutocomplete(props) {
    const { input, label, initVal, isRequired, ...rest } = props; // 解构时排除 initVal
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [magazineList, setMagazineList] = React.useState([]);
    const [value, setValue] = React.useState(null); // 用于受控组件的 value 状态
    const dispatch = useDispatch();

    React.useEffect(() => {
        if (!loading && magazineList.length === 0) {
            setLoading(true);
            axios
                .get(API_MAGAZINE, {
                    withCredentials: true,
                    validateStatus: (status) => status === 200,
                })
                .then((res) => res.data)
                .then((res) => {
                    if (typeof res.magazines === "object") {
                        setMagazineList(res.magazines);
                        // 查找与 initVal 匹配的对象
                        if (initVal) {
                            const foundMagazine = res.magazines.find(
                                (magazine) => magazine.id === initVal
                            );
                            if (foundMagazine) {
                                setValue(foundMagazine); // 设置受控组件的 value
                            }
                        }
                    }
                })
                .catch((err) => {
                    dispatch(setSnackbar("拉取杂志列表失败，请重试", "error"));
                })
                .finally(() => setLoading(false));
        }
    }, [open]);

    return (
        <Autocomplete
            open={open}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            loading={loading}
            loadingText="加载中..."
            noOptionsText="没有此杂志"
            options={magazineList}
            value={value} // 使用受控组件的 value
            onChange={(event, newValue) => {
                setValue(newValue); // 更新受控组件的 value
                input.onChange(newValue ? { id: newValue.id, name: newValue.name } : null); // 触发外部的 onChange
            }}
            getOptionLabel={(option) => option.name}
            renderOption={(option) => option.name + "@" + option.id}
            getOptionSelected={(option, value) => option.id === value.id}
            filterOptions={(options, { inputValue }) =>
                matchSorter(options, inputValue, { keys: ["name", "id"] })
            }
            renderInput={(params) => (
                <TextField
                    required={isRequired}
                    {...params}
                    label={label}
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <React.Fragment>
                                {loading ? <CircularProgress size={20} /> : null}
                                {params.InputProps.endAdornment}
                            </React.Fragment>
                        ),
                    }}
                />
            )}
            {...rest} // 传递其他属性
        />
    );
}