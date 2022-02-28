import './App.css';
import React, { useEffect, useState } from 'react'
import {TaskChart} from './components/TaskChart';
import {TaskTable} from './components/TaskTable';
import {listTasks} from './apis/TaskApi'
import {getToken} from './apis/UserTokenApi'
import { useSelector, useDispatch } from 'react-redux'
import { storeTasks, storeToken } from './redux/ApiSlice'
import { throttle } from 'lodash';
import { store } from './redux/store';

import { WEBSOCKET_URL } from './constants';

const useForceUpdate = () => {
  const [value, setValue] = useState(0); // integer state
  return () => setValue(value => value + 1); 
}

function App() {
  const dispatch = useDispatch();
  const forceUpdate = useForceUpdate();
  useEffect(() => {
    getToken().then((token) => { 
      dispatch(storeToken(token))
      const ws = new WebSocket(WEBSOCKET_URL);
      ws.onopen = () => {
          console.log('web socket is open')
      };
      ws.onmessage = lastMessage => {
          try {
              if (lastMessage !== null) {
                listTasks(token).then((response) => {
                  dispatch(storeTasks(response))
                });
              }
          } catch (err) {
              console.log(err);
          }
      };
      return () => ws.close();
    }, []);
  });

  return (
    <div className="App">
      <TaskTable forceUpdate={forceUpdate}></TaskTable>
      <TaskChart></TaskChart>
    </div>
  );
}

export default App;
