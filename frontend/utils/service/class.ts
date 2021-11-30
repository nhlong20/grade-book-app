import { Assignment } from '@utils/models/assignment'
import { Class } from '@utils/models/class'
import axios from 'axios'
import { API } from 'environment'

export const getCourses = (token?: string) => () =>
  axios
    .get<Class[]>(API + '/class', {
      headers: { Authorization: 'Bearer ' + token },
    })
    .then((r) => r.data)

export const createCourse = (
  data: Partial<Pick<Class, 'name' | 'description'>>,
) => axios.post(API + '/class', data)

export const createAssignment =
  (id: string) => (data: Pick<Assignment, 'name' | 'point'>) =>
    axios.post(API + '/class/' + id + '/assignment', data).then((r) => r.data)

export const getClass = (id: string) => () =>
  axios.get<Class>(API + '/class/' + id).then((res) => res.data)
