import { Review } from '@utils/models/review'
import axios from 'axios'
import { API } from 'environment'

export const createReview = (
  data: Pick<Review, 'expectedGrade' | 'explanation'> & { gradeId: string },
) => axios.post<Review>(API + '/review', data).then((res) => res.data)

export const getReview = (id: string, token?: string) => () =>
  axios
    .get<Review>(API + '/review/' + id, {
      headers: {
        authorization: 'Bearer ' + token,
      },
    })
    .then((res) => res.data)

export const resolveReview = (id: string) => () =>
  axios.put(API + '/review/' + id + '/resolve').then((res) => res.data)
