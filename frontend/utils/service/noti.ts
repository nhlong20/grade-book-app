import { Noti } from '@utils/models/noti'
import { User } from '@utils/models/user'
import axios from 'axios'
import { API } from 'environment'

export const getReceivedNotification = (token?: string) => () =>
  axios
    .get<Noti[]>(API + '/user/notification', { headers: { authorization: 'Bearer ' + token } })
    .then((r) => {
      console.log(r.data)
      return r.data
    })