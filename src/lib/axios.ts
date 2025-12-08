import axios from 'axios'
import { useAuth } from '@/store/auth'

const api = axios.create({
    baseURL: 'https://api.bookingcabs.in:3002/api',
    withCredentials: true,
})

api.interceptors.request.use(
    (config) => {
        const token = useAuth.getState().token
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => Promise.reject(error)
)

export default api;
