import axios from 'axios';
import config from '../config';
import { sessionService } from '../sessionServices/sessionServices';

const { API_BASE_URL, APP_BASE_URL } = config;

const axiosAPI = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'x-access-token': sessionService.getSessionToken() || ''
    },
    responseType: 'json'
});

axiosAPI.interceptors.request.use(config => {
    config.headers['x-access-token'] = sessionService.getSessionToken();
    return config;
});

axiosAPI.interceptors.response.use(data => {
    return Promise.resolve(data);
}, err => {
    if (err.response && err.response.data && err.response.data.error && err.response.data.error.message === 'Your session has been expired.') {
        sessionService.destroy();
        setTimeout(() => window.location.replace(APP_BASE_URL), 1000);
    }
    return Promise.reject(err);
});

export default axiosAPI;
