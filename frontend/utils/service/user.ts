import { User } from '@utils/models/user'
import axios from 'axios'
import { API } from 'environment'

export const getUser = (token?: string) => () =>
  axios.get<User>(API + '/user').then((r) => r.data)
