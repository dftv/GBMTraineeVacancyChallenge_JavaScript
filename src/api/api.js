import axios from 'axios';

const api = axios.create({
    baseURL: 'https://api.tot.apigbmtech.com/api/selective-process/',
    params: {
        authorization: '67c9d5c3887b64c33671bb25f681753a',
    },
});

export default api;