import { Review } from '@utils/models/review'
import axios from 'axios'
import { API } from 'environment'

export const createReview = (
  data: Pick<Review, 'expectedGrade' | 'explanation'> & { gradeId: string },
) => axios.post<Review>(API + '/review', data).then((res) => res.data)
