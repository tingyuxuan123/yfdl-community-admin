import request from '@/utils/request'

export const updateInfo = (userInfo) => {
  return request('/user/updateInfo', 'post', {
    ...userInfo
  })
}

export const updatePassword = (password: string) => {
  return request('/user/updatePassword', 'post', {
    password
  })
}

export const getRouters = () => {
  return request('/getRouters', 'get')
}

export const getUserList = (queryParam: any) => {
  return request('/user/userList', 'get', { ...queryParam })
}

export const updateUserInfo = (form: any) => {
  return request('/user/updateUserInfo', 'post', {
    ...form
  })
}

export const insertUser = (form: any) => {
  return request('/user/insertUser', 'post', {
    ...form
  })
}
