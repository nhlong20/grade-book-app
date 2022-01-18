import { Class } from '@utils/models/class'
import { GradeStruct } from '@utils/models/gradeStruct'
import { Invitation } from '@utils/models/invitation'
import { Student } from '@utils/models/student'
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

export const createInvitation =
  (id: string) => (data: Pick<Invitation, 'emails' | 'type'>) =>
    axios.post(API + '/class/' + id + '/invite', data).then((r) => r.data)

export const getClass = (id: string, token?: string) => () =>
  axios
    .get<Class>(API + '/class/' + id, {
      headers: { authorization: 'Bearer ' + token },
    })
    .then((res) => res.data)

export const createGradeStruct =
  (id: string) => (data: Pick<GradeStruct, 'detail' | 'title'>) =>
    axios.post(API + '/class/' + id + '/grade-structure', data)

export const updateGradeStruct =
  (id: string) => (data: Pick<GradeStruct, 'detail' | 'title'>) =>
    axios.patch(API + '/class/grade-structure/' + id, data)

export const deleteGradeStruct = (id: string) => () =>
  axios.delete(API + '/class/grade-structure/' + id)

export const updateOrder = (data: { id1: string; id2: string }) =>
  axios.patch(API + '/class/grade-structure/order', data)

export const getStudents = (classId: string, token?: string) => () =>
  axios
    .get<Student[]>(API + '/student/grade/' + classId, {
      headers: {
        authorization: 'Bearer ' + token,
      },
    })
    .then((res) => res.data)

export const updatePoint = (id: string) => (data: { point: number }) =>
  axios.patch(API + '/student/grade/' + id, data).then((res) => res.data)

export const createPoint = (data: {
  point: number
  studentId: string
  structId: string
}) => axios.post(API + '/student/grade', data).then((res) => res.data)

export const joinByCode = (params: { code: string }) =>
  axios
    .put<Class>(API + '/class/join-by-code', undefined, { params })
    .then((r) => r.data)
