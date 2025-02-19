import React from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";
import axios from "axios";
import {API_MAGAZINE} from "../../constant";
import {setSnackbar} from "../../controller/site";
import {useDispatch} from "react-redux";
import matchSorter from "match-sorter";

export default function MagazineMangaAutocomplete(props) {
    const {input, label, initVal, mid} = props;
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [mangaList, setMangaList] = React.useState([]);
    const dispatch = useDispatch();

    React.useEffect(() => {
        if (open && !loading && mangaList.length === 0) {
            setLoading(true);
            axios.get(API_MAGAZINE + "/manga/" + mid, {
                withCredentials: true,
                validateStatus: status => status === 200
            })
                .then(res => res.data)
                .then(res => {
                        typeof res.mangas === "object" && setMangaList(res.mangas);
                    }
                ).catch(err => {
                dispatch(setSnackbar("拉取漫画列表失败，请重试", "error"));
            }).finally(() => setLoading(false));
        }
    }, [open]);

    return (
        <Autocomplete open={open} onOpen={() => setOpen(true)} onClose={() => setOpen(false)}
                      loading={loading} loadingText="加载中..." noOptionsText="没有此漫画" options={mangaList}
                      {...props} onChange={((event, value) => input.onChange(value ? value.id : null))}
                      getOptionLabel={(option) => option.id} defaultValue={initVal}
                      renderOption={(option) => option.name + "@" + option.id}
                      getOptionSelected={(option, value) => option.id === value.id}
                      filterOptions={(options, { inputValue }) =>
                          matchSorter(options, inputValue, {keys: ["name", "id"]})}
                      renderInput={(params) => (
                          <TextField required
                              {...params}
                              label={label}
                              InputProps={{
                                  ...params.InputProps,
                                  style: { width: '250px' },
                                  endAdornment: (
                                      <React.Fragment>
                                          {loading ? <CircularProgress size={20}/> : null}
                                          {params.InputProps.endAdornment}
                                      </React.Fragment>
                                  ),
                              }}
                          />
                      )}/>
    );
}