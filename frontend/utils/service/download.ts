import axios from 'axios'
import { API } from 'environment'

const handleReponse = (name: string) => (res: any) => {
  const url = window.URL.createObjectURL(new Blob([res.data]))

  const link = document.createElement('a')

  link.href = url
  link.download = name + '.csv'
  link.click()
  link.remove()
}

export const downloadTemplate = (name: string) => {
  axios
    .get(API + '/student/csv/default', {
      responseType: 'stream',
    })
    .then(handleReponse(name))
}

export const downloadGrade = (name: string, classId: string) => {
  axios
    .get(API + '/student/csv/scoreboard', {
      responseType: 'stream',
      params: { classId },
    })
    .then(handleReponse(name))
}

export const downloadScoreTemplate = (name: string, classId: string) => {
  axios
    .get(API + '/student/csv/scoring', {
      responseType: 'stream',
      params: { classId },
    })
    .then(handleReponse(name))
}
