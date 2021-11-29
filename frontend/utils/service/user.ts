import axios from 'axios'
import { API } from 'environment'

export const getUser = (token?: string) => () =>
  axios.get(API + '/user').then((r) => r.data)
