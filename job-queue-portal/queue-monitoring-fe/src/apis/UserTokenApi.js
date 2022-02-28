import {SERVER_URL} from '../constants';
import { storeToken } from '../redux/ApiSlice'

export const getToken = () => {
    const requestOptions = {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({username: "admin", password: "admin123"})
    };
    return new Promise((resolve, reject) => {
    fetch(SERVER_URL + 'api-token-auth/', requestOptions)
        .then(response => response.json())
        .then(data => resolve(data.token))
        .catch(error => reject(error));
    });
}
