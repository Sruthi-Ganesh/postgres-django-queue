import PropTypes from 'prop-types';
import React, {useEffect} from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import {TASK_STATUS_KEY} from '../constants'

export const TaskSearch = ({originalRows, rows, setRows}) => {
    const filterMap = {1: 'name', 2: 'status'}
    const [filterBy, setFilterBy] = React.useState(1);
    const [rowsFiltered, setRowsFiltered] = React.useState({filterBy: 1, 'rowNames': rows});

    const handleChange = (event) => {
        setFilterBy(event.target.value);
        setRows(null);
      };

    useEffect(() => {
        if (!rows) {
            return;
        }
        const compareValue = filterMap[filterBy];
        const uniqueRowSet = rows.map(row => row[compareValue]).filter((row, index, a) => a.indexOf(row) === index)
        const filteredRows = {'value': filterBy, 'rowNames': uniqueRowSet};
        setRowsFiltered(filteredRows);
    }, [filterBy]);

    return <> 
        <FormControl>
            <InputLabel id="filter-select-label">Filter By</InputLabel>
            <Select
                labelId="filter-select-label"
                id="filter-select"
                value={filterBy}
                label="Filter By"
                onChange={handleChange}
            >
                <MenuItem value={1}>Task Name</MenuItem>
                <MenuItem value={2}>Status</MenuItem>
            </Select>
        </FormControl>
        <Autocomplete
            className="air-quality-search"
            value={''}
            onChange={(event, newValue) => {
                if (!newValue && !typeof newValue === 'string' && rows.length === 0) {
                    setRows(null);
                }
                if (filterBy === 1) {
                    const filteredRows = rows.filter((row) => {
                        return row.name.toLowerCase().includes(newValue.toLowerCase());
                    });
                    setRows(filteredRows);
                }
                if (filterBy === 2) {
                    const filteredRows = rows.filter((row) => {
                        return row.status === newValue;
                    });
                    setRows(filteredRows);
                }
            }}
            selectOnFocus
            clearOnBlur
            handleHomeEndKeys
            id="free-solo-with-text-demo"
            options={rowsFiltered.rowNames}
            getOptionLabel={option => {
                // Value selected with enter, right from the input
                if (filterBy === 2) {
                    return option ? TASK_STATUS_KEY[option] : "";
                }
                // Regular option
                return option;
            }}
            renderOption={(renderProps, option) => <li {...renderProps}>{option && filterBy === 2 ? TASK_STATUS_KEY[option]: option}</li>}
            sx={{ 'width': 300 }}
            freeSolo
            renderInput={params => <TextField {...params} label={`Search Task By ${filterMap[filterBy]}`}/>
            }
        />
    </>
}


TaskSearch.propTypes = {
    'rows': PropTypes.array,
    'setRow': PropTypes.func,
}
