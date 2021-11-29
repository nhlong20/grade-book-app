import { Course } from '@utils/models/course'
import axios from 'axios'
import { API } from 'environment'

export const getCourses = (token?: string) => () =>
  axios
    .get<Course[]>(API + '/course', {
      headers: { Authorization: 'Bearer ' + token },
    })
    .then((r) => r.data)

export const createCourse = (data: Pick<Course, 'name'>) =>
  axios.post(API + '/course', data)
