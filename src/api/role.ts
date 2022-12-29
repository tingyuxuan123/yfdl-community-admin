import request from '@/utils/request'

export const getRoleList = (queryParam: any) => {
  return request('/role/roleList', 'get', {
    ...queryParam
  })
}

export const insertRole = (form: any) => {
  return request('/role/insertRole', 'post', {
    ...form
  })
}

export const updateRole = (form: any) => {
  return request('/role/updateRole', 'post', {
    ...form
  })
}

export const deleteRole = (roleId: any) => {
  return request('/role/deleteRole', 'get', {
    roleId
  })
}

export const roleListBySelect = () => {
  return request('/role/roleListBySelect', 'get')
}
