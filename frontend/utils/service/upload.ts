import axios from 'axios'
import { API } from 'environment'

export const uploadScore = ({ file, id }: { id: string; file: File }) => {
  const data = new FormData()
  data.append('file', file)

  return axios
    .post(API + '/student/grade/batch/' + id, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((res) => res.data)
}

export const uploadStudent = (id: string) => (file: File) => {
  const data = new FormData()
  data.append('file', file)

  return axios
    .post(API + '/student/' + id, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((res) => res.data)
}
