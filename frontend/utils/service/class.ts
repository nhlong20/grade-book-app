import { Assignment } from '@utils/models/assignment'
import { Class } from '@utils/models/class'
import { GradeStruct } from '@utils/models/gradeStruct'
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

export const createAssignment = (
  data: Pick<Assignment, 'name' | 'point' | 'order'> & {
    gradeStructId: string
  },
) => axios.post(API + '/class/assignment', data).then((r) => r.data)

export const createInvitation =
  (id: string) => (data: Pick<Invitation, 'emails' | 'type'>) =>
    axios.post(API + '/class/' + id + '/invite', data).then((r) => r.data)

export const updateAssignment =
  (id: string) =>
    (data: Pick<Assignment, 'name' | 'point'> & { gradeStructId: string }) =>
      axios.put(API + '/class/assignment/' + id, data)

export const deleteAssignment = (id: string) =>
  axios.delete(API + '/class/assignment/' + id)

export const getClass = (id: string, token?: string) => () =>
  axios
    .get<Class>(API + '/class/' + id, {
      headers: { authorization: 'Bearer ' + token },
    })
    .then((res) => res.data)

export const createGradeStruct =
  (id: string) => (data: Pick<GradeStruct, 'detail' | 'title'>) =>
    axios.post(API + '/class/' + id + '/grade-structure', data)

export const updateOrder = (data: { id1: string; id2: string }) =>
  axios.patch(API + '/class/assignment/order', data)
