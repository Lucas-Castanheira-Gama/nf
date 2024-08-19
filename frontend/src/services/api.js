import axios from "axios";

const api = axios.create({
    baseURL: 'https://nf-umber.vercel.app/',
})

export default api


