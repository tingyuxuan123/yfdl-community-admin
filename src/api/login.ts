import request from '@/utils/request'

export const login = (userName: string, password: string) => {
  return request('/user/login', 'post', {
    userName,
    password
  })
}
