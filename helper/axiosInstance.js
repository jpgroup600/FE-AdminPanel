import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://admin-backend-jacob-627c227daad2.herokuapp.com',
});

export default axiosInstance;