import satellite from "../satellite";
import { AxiosError } from 'axios'

const URL = 'https://jsonplaceholder.typicode.com'

export const getTodos = async () => {
    return await satellite.get(`${URL}/todos`)
        .then(res => res.data)
        .catch(error => (error instanceof AxiosError ? error.response?.data : error))
}
export const getPosts = async () => {
    return await satellite.get(`${URL}/posts`)
        .then(res => res.data)
        .catch(error => (error instanceof AxiosError ? error.response?.data : error))
}
