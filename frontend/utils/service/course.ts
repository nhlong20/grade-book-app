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
  data: Partial<
    Pick<
      Class,
      | 'name'
      | 'academicYear'
      | 'credit'
      | 'department'
      | 'description'
      | 'indentityCode'
      | 'semester'
    >
  >,
) => axios.post(API + '/course', data)
