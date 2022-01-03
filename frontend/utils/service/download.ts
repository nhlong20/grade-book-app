import axios from 'axios'
import { API } from 'environment'

const handleReponse = (name: string) => (res: any) => {
  var universalBOM = "\uFEFF";
  const link = document.createElement('a')
  link.href = "data:text/csv;charset=utf-8," + encodeURIComponent(universalBOM + res.data)
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
