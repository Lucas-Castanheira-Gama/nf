import axios from "axios";

const api = axios.create({
    baseURL: 'https://nf-umber.vercel.app/',
    timeout: 30000,
})

export default api


