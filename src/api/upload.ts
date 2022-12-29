import request from '@/utils/request'

export const uploadImg = (img: any) => {
  return request(
    '/upload',
    'post',
    {
      img
    },
    {
      'Content-Type': 'multipart/form-data'
    }
  )
}
