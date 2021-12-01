import { User } from '@utils/models/user'
import axios from 'axios'
import { API } from 'environment'

export const getUser = (token?: string) => () =>
  axios
    .get<User>(API + '/user', { headers: { authorization: 'Bearer ' + token } })
    .then((r) => r.data)

export const updateUserInformation = (data: { name: string }) =>
  axios.patch<User>(API + '/api/user', data).then((res) => res.data)
