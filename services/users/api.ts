import satellite from "../satellite";
import { AxiosError } from 'axios'

const URL = 'https://jsonplaceholder.typicode.com/users'

export const getUsers = async () => {
    return await satellite.get(URL)
        .then(res => res.data)
        .catch(error => (error instanceof AxiosError ? error.response?.data : error))
}
export const getUser = async (id: number) => {
    return await satellite.get(`${URL}/${id}`)
        .then(res => res.data)
        .catch(error => (error instanceof AxiosError ? error.response?.data : error))
}
