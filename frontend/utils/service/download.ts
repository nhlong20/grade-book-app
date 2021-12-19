import axios from 'axios'
import { API } from 'environment'

export const downloadTemplate = (name: string) => {
  axios
    .get(API + '/student/csv/default', {
      responseType: 'stream',
    })
    .then((res) => {
      const url = window.URL.createObjectURL(new Blob([res.data]))

      const link = document.createElement('a')
      
      link.href = url
      link.download = name + '.csv'
      link.click()
      link.remove()
    })
}
