import request from '@/utils/request'

export const login = (userName: string, password: string) => {
  return request('/user/login', 'post', {
    userName,
    password
  })
}

export const sendEmail = (email: string) => {
  return request('/user/sendCode', 'get', {
    email
  })
}

export const loginOrRegisterByCode = (codeForm: any) => {
  return request('/user/loginOrRegisterByCode', 'post', {
    ...codeForm
  })
}
