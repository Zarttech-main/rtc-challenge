import axios from 'axios';

import { SERVER_BASE_URL } from './constants';

const Axios = axios.create({
    baseURL: SERVER_BASE_URL
})

const storedUser = localStorage.getItem("rtc_user")
const user = storedUser ? JSON.parse(storedUser) : null;


if (user) {
    Axios.defaults.headers.common['Authorization'] = "JWT " + user.token;
}

export default Axios
