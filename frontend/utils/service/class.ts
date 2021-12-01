import { Assignment } from '@utils/models/assignment'
import { Class } from '@utils/models/class'
import { Invitation } from '@utils/models/invitation'
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

export const createInvitation =
  (id: string) => (data: Pick<Invitation, 'emails' | 'type'>) =>
    axios.post(API + '/class/' + id + '/invite', data).then((r) => r.data)


export const updateAssignment =
  (id: string) => (data: Pick<Assignment, 'name' | 'point'>) =>
    axios.put(API + '/class/assignment/' + id, data)

export const deleteAssignment = (id: string) =>
  axios.delete(API + '/class/assignment/' + id)

export const getClass = (id: string) => () =>
  axios.get<Class>(API + '/class/' + id).then((res) => res.data)

