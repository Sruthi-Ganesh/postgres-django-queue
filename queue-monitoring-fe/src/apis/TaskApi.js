import { useSelector } from "react-redux";
import { SERVER_URL } from "../constants";
import { useDispatch } from "react-redux";
import { storeTasks } from "../redux/ApiSlice";

export const addTask = (token, taskName, priority) => {
  // const token = useSelector(state => state.tokenApi.token)
  const requestOptions = {
    method: "POST",
    headers: {
      Authorization: "Token " + token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: taskName, priority }),
  };
  return new Promise((resolve, reject) => {
    fetch(SERVER_URL + "task/", requestOptions)
      .then(resolve)
      .catch((error) => reject(error));
  });
};

export const listTasks = (token) => {
  const url = SERVER_URL + "task/";
  // const token = useSelector(state => state.tokenApi.token)
  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: "Token " + token,
      "Content-Type": "application/json",
    },
  };
  return new Promise((resolve, reject) => {
    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((data) => resolve(data))
      .catch((error) => reject(error));
  });
};

export const deleteTask = (token, id) => {
  const url = SERVER_URL + `task/${id}/`;
  // const token = useSelector(state => state.tokenApi.token)
  const requestOptions = {
    method: "DELETE",
    headers: {
      Authorization: "Token " + token,
      "Content-Type": "application/json",
    },
  };
  return new Promise((resolve, reject) => {
    fetch(url, requestOptions)
      .then(resolve)
      .catch((error) => reject(error));
  });
};

export const updateTask = (token, id, status) => {
  const url = SERVER_URL + `task/${id}/`;
  // const token = useSelector(state => state.tokenApi.token)
  const requestOptions = {
    method: "PATCH",
    headers: {
      Authorization: "Token " + token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  };
  return new Promise((resolve, reject) => {
    fetch(url, requestOptions)
      .then(resolve)
      .catch((error) => reject(error));
  });
};

export const listTasksByStatus = (token, status = null) => {
  const url = SERVER_URL + "task/";
  if (status) {
    url += "?status=" + status;
  }
  // const token = useSelector(state => state.tokenApi.token)
  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: "Token " + token,
      "Content-Type": "application/json",
    },
  };
  return new Promise((resolve, reject) => {
    fetch(url, requestOptions)
      .then(resolve)
      .catch((error) => reject(error));
  });
};
