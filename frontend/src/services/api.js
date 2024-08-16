import axios from "axios";

const api = axios.create({
    baseURL: 'https://nf-mj4t.vercel.app/'
})

export default api


