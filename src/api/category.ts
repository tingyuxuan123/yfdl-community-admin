import request from '@/utils/request'

/**
 * 返回所有的分类
 * @returns 所有的分类
 */
export const getAllCategoryList = () => {
  return request('/category/allCategoryList', 'get')
}

/**
 * 返回所有的分类详细版本
 * @returns 所有的分类
 */
export const getAllTagDetailList = (queryParams: any) => {
  return request('/category/allCategoryDetailList', 'get', {
    ...queryParams
  })
}

export const insertCategory = (form: any) => {
  return request('/category/insertCategory', 'post', {
    ...form
  })
}

export const updateCategory = (form: any) => {
  return request('/category/updateCategory', 'post', {
    ...form
  })
}

export const deleteCategory = (id: number) => {
  return request('/category/deleteCategory', 'get', {
    id
  })
}
