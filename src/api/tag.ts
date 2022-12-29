import request from '@/utils/request'

/**
 * 返回所有的标签
 * @returns 标签列表
 */
export const getAllTagList = () => {
  return request('/tag/tagList', 'get')
}

export const getAllTagDetailList = (queryParams: any) => {
  return request('/tag/queryTagListByParams', 'get', {
    ...queryParams
  })
}

export const insertTag = (form: any) => {
  return request('/tag/insertTag', 'post', {
    ...form
  })
}

export const updateTag = (form: any) => {
  return request('/tag/updateTag', 'post', {
    ...form
  })
}

export const deleteTag = (id: number) => {
  return request('/tag/deleteTag', 'get', {
    id
  })
}
