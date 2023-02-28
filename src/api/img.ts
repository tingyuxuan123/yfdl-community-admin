import axios from 'axios'

export const getRoundImg = () => {
  return axios.get('/getRoundImg/')
  // return axios.get('https://api.likepoems.com/img/aliyun/bing')
}
