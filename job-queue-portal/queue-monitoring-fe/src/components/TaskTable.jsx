import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { alpha, styled } from "@mui/material/styles";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import TableFooter from "@mui/material/TableFooter";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import DeleteIcon from "@mui/icons-material/Delete";
import { visuallyHidden } from "@mui/utils";
import {
  TASK_TABLE_VALUES,
  TASK_TABLE_COLORS,
  TASK_STATUS_KEY,
  TASK_PRIORITY_KEY,
  TASK_STATUS,
} from "../constants";
import { useSelector, useDispatch } from "react-redux";
import { storeTasks } from '../redux/ApiSlice'
import { TaskSearch } from "./TaskSearch";
import AddIcon from "@mui/icons-material/Add";
import Toolbar from "@mui/material/Toolbar";
import FilterListIcon from "@mui/icons-material/FilterList";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import {addTask, deleteTask, updateTask, listTasks} from '../apis/TaskApi';

const useStyles = makeStyles((theme) => ({
  table: {
    width: "auto",
  },
  tableContainer: {
    borderRadius: 15,
    margin: "10px 10px",
  },
  tableHeaderCell: {
    fontWeight: "bold",
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.getContrastText(theme.palette.primary.dark),
  },
  avatar: {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.getContrastText(theme.palette.primary.light),
  },
  name: {
    fontWeight: "bold",
    color: theme.palette.secondary.dark,
  },
  status: {
    fontWeight: "bold",
    fontSize: "0.75rem",
    color: "white",
    backgroundColor: "grey",
    borderRadius: 8,
    padding: "3px 10px",
    display: "inline-block",
  },
  hover: {
    cursor: "pointer",
  },
  center: {
    textAlign: "center",
  },
  width: {
    width: '100%',
  },
  flex: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  end: {
    justifyContent: 'space-evenly',
    flex: '1 1 20%'
  }
}));

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

function EnhancedTableHead(props) {
  const {
    order,
    orderBy,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {TASK_TABLE_VALUES.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={"left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
};

const EnhancedTableToolbar = (props) => {
  const {
    selectedItem,
    onFilterIconClicked,
    filterIconClicked,
    taskSearchProps,
    deleteSelectedTask,
    markTaskAsComplete,
    markTaskAsFailed
  } = props;

  const classes = useStyles();

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(selectedItem && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      {selectedItem ? (
        <Typography
          sx={{ flex: "1 1 80%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          Selected Task: {selectedItem.name}
        </Typography>
      ) : (
        <Typography
          sx={{ flex: "1 1 40%" }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Task Details
        </Typography>
      )}

      {selectedItem ? (
        <Grid container className={classes.end}>
          <Grid item lg={3}>
            <Tooltip title="Delete">
              <Typography>
                <DeleteIcon color="secondary" onClick={deleteSelectedTask} />
              </Typography>
            </Tooltip>
          </Grid>

          <Grid item lg={3}>
            <Tooltip title="Mark Task as Complete">
              <Typography>
                <CheckIcon color="secondary" onClick={markTaskAsComplete} />
              </Typography>
            </Tooltip>
          </Grid>

          <Grid item lg={3}>
            <Tooltip title="Mark Task as Failed">
              <Typography>
                <CloseIcon color="secondary" onClick={markTaskAsFailed} />
              </Typography>
            </Tooltip>
          </Grid>
        </Grid>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            {filterIconClicked ? (
              <CloseIcon onClick={onFilterIconClicked}></CloseIcon>
            ) : (
              <FilterListIcon onClick={onFilterIconClicked} />
            )}
          </IconButton>
        </Tooltip>
      )}
      {!selectedItem && filterIconClicked && <TaskSearch {...taskSearchProps}></TaskSearch>}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  selectedItem: PropTypes.object.isRequired,
  filterIconClicked: PropTypes.bool.isRequired,
  onFilterIconClicked: PropTypes.func.isRequired,
  taskSearchProps: PropTypes.object.isRequired,
  markTaskAsFailed: PropTypes.func.isRequired,
  markTaskAsComplete: PropTypes.func.isRequired,
  deleteSelectedTask: PropTypes.func.isRequired,
};

const getClassNameForRow = (status) => {
  const valueFiltered = TASK_TABLE_COLORS.find((item) => item.value === status);
  return valueFiltered.key;
};

const getDateInfo = (stringDate1, created = false) => {
  const date1 = new Date(stringDate1);
  const date2 = new Date();
  const diffTime = Math.abs(date2 - date1);
  const diffSeconds = Math.floor(diffTime / 1000);
  const keyword = created ? "Created" : "Updated";
  if (diffSeconds < 1) {
    return `${keyword} just now`;
  } else if (diffSeconds >= 1 && diffSeconds < 5) {
    return `${keyword} few seconds ago`;
  } else if (diffSeconds < 60) {
    return `${keyword} a minute ago`;
  } else if (diffSeconds >= 60 && diffSeconds < 300) {
    return `${keyword} few minutes ago`;
  } else if (diffSeconds < 3600) {
    return `${keyword} in last hour`;
  }
  return `${keyword} ${Math.floor(diffSeconds / 3600)} hours ago`;
};

export const TaskTable = ({forceUpdate}) => {
  const dispatch = useDispatch();
  const originalRows = useSelector((state) => state.tokenApi.tasks);
  const token = useSelector((state) => state.tokenApi.token);
  const [rows, setRows] = useState(originalRows);
  const [filteredRows, setFilteredRows] = useState(null);
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("updated_at");
  const [selectedItem, setSelectedItem] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [addTaskState, setAddTaskState] = useState({
    enabled: false,
    priority: 0,
    taskName: ''
  });
  const [filterIconClicked, setFilterIconClicked] = useState(false);

  useEffect(() => {
    setRows(originalRows);
  }, [originalRows]);

  const classes = useStyles();

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleClick = (event, row) => {
    const alreadySelected = selectedItem ? selectedItem.id === row.id : false;

    if (alreadySelected) {
      setSelectedItem(null)
    } else {
      setSelectedItem(row);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const onAddTaskStateCalled = () => {
    setAddTaskState({ ...addTaskState, enabled: !addTaskState.enabled});
  };

  const fetchTasks = () => {
    listTasks(token).then((response) => { 
      dispatch(storeTasks(response));
      setOrder("desc")
      setOrderBy("updated_at");
      forceUpdate();
    });
  }

  const addNewTask = () => {
    const {taskName, priority} = addTaskState;
    addTask(token, taskName, priority);
    fetchTasks();
    onAddTaskStateCalled();
  };

  const deleteSelectedTask = () => {
    deleteTask(token, selectedItem.id);
    fetchTasks();
  };

  const markTaskAsComplete = () => {
    updateTask(token, selectedItem.id, TASK_STATUS.COMPLETED);
    fetchTasks();
  };

  const markTaskAsFailed = () => {
    updateTask(token, selectedItem.id, TASK_STATUS.FAILED);
    fetchTasks();
  };

  const handlePriorityChange = (event) => {
    const priority = event.target.value;
    setAddTaskState({ ...addTaskState, priority });
  };

  const handleTaskNameChange = (event) => {
    const taskName = event.target.value;
    setAddTaskState({ ...addTaskState, taskName });
  };

  const onFilterIconClicked = () => {
    if (filterIconClicked) {
      setFilteredRows(null);
    }
    setFilterIconClicked(!filterIconClicked);

  };

  const isSelected = (id) => selectedItem ? selectedItem.id === id : false;

  const taskSearchProps = {
    originalRows,
    rows: rows,
    setRows: setFilteredRows,
  };

  const whichRows = filteredRows || rows;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <EnhancedTableToolbar
          selectedItem={selectedItem}
          taskSearchProps={taskSearchProps}
          onFilterIconClicked={onFilterIconClicked}
          filterIconClicked={filterIconClicked}
          deleteSelectedTask={deleteSelectedTask}
          markTaskAsComplete={markTaskAsComplete}
          markTaskAsFailed={markTaskAsFailed}
        />
        {/* <EnhancedTableToolbar numSelected={selected.length} /> */}
        <TableContainer className={classes.tableContainer}>
          <Table className={classes.table} aria-label="simple table">
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
            />
            <TableBody>
              {stableSort(whichRows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.id);
                  const labelId = `enhanced-table-checkbox-${index}`;
                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.id}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            "aria-labelledby": labelId,
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Grid container>
                          <Grid item lg={2}>
                            <Avatar
                              alt={row.name}
                              src="."
                              className={classes.avatar}
                            />
                          </Grid>
                          <Grid item lg={2} sx={{ padding: "7px 0 0 7px" }}>
                            <Typography className={classes.name}>
                              {row.name}
                            </Typography>
                          </Grid>
                        </Grid>
                      </TableCell>
                      <TableCell>
                        <Grid container>
                          <Grid item lg={9}>
                            <Typography
                              className={classes.status}
                              style={{
                                backgroundColor:
                                  (row.priority === 2 && "red") ||
                                  (row.priority === 1 && "orange") ||
                                  (row.priority === 0 && "grey"),
                              }}
                            >
                              {TASK_PRIORITY_KEY[row.priority]}
                            </Typography>
                          </Grid>
                        </Grid>
                      </TableCell>
                      <TableCell>{getDateInfo(row.created_at, true)}</TableCell>
                      <TableCell>{getDateInfo(row.updated_at)}</TableCell>
                      <TableCell>{row.number_of_retries}</TableCell>
                      <TableCell>
                        <Grid container>
                          <Grid item lg={9}>
                            <Typography
                              className={classes.status}
                              style={{
                                backgroundColor:
                                  (row.status === 3 && "red") ||
                                  (row.status === 1 && "blue") ||
                                  (row.status === 2 && "orange") ||
                                  (row.status === 4 && "green"),
                              }}
                            >
                              {TASK_STATUS_KEY[row.status]}
                            </Typography>
                          </Grid>
                        </Grid>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={4}>
                  <Grid container>
                    <Grid item lg={6} className={classes.width}>
                      <Typography className={classes.flex}>
                        {addTaskState.enabled ? (
                          <>
                            <Button
                              variant="contained"
                              color="secondary"
                              onClick={onAddTaskStateCalled}
                              className={classes.button}
                            >
                              Close
                            </Button>
                            <TextField label="Enter Task Name" value={addTaskState.taskName} onChange={handleTaskNameChange} />
                            <FormControl>
                              <InputLabel id="filter-select-label">
                                Filter By
                              </InputLabel>
                              <Select
                                labelId="filter-select-label"
                                id="filter-select"
                                value={addTaskState.priority}
                                label="Filter By"
                                onChange={handlePriorityChange}
                              >
                                <MenuItem value={0}>Low Priority</MenuItem>
                                <MenuItem value={1}>Medium Priority</MenuItem>
                                <MenuItem value={2}>High Priority</MenuItem>
                              </Select>
                            </FormControl>
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={addNewTask}
                              className={classes.button}
                              startIcon={<AddIcon />}
                            >
                              Add
                            </Button>
                          </>
                        ) : (
                          <Button
                            variant="contained"
                            color="secondary"
                            onClick={onAddTaskStateCalled}
                            className={classes.button}
                            startIcon={<AddIcon />}
                          >
                            Add Task
                          </Button>
                        )}
                      </Typography>
                    </Grid>
                  </Grid>
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
};
