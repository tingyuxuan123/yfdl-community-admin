import request from '@/utils/request'

export const insertMenu = (form: any) => {
  return request('/menu/insertMenu', 'post', {
    ...form
  })
}

export const updateMenu = (form: any) => {
  return request('/menu/updateMenu', 'post', {
    ...form
  })
}

export const deleteMenu = (id: number) => {
  return request('/menu/deleteMenu', 'get', {
    id
  })
}
