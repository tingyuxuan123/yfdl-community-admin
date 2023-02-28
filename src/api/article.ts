import request from '@/utils/request'

export const queryArticleList = (queryParams: any, pageinfo: any) => {
  return request('/article/adminArticleList', 'get', {
    ...queryParams,
    ...pageinfo
  })
}

export const queryAllArticleList = (queryParams: any, pageinfo: any) => {
  return request('/article/adminAllArticleList', 'get', {
    ...queryParams,
    ...pageinfo
  })
}

export const queryArticleInfo = (id: number) => {
  return request('/article/articleInfo', 'get', {
    id
  })
}

/**
 * 更新文章
 */
export const updateArticle = (id: number, article: any) => {
  return request('/article/updateArticle', 'post', {
    id,
    ...article
  })
}

/**
 * 修改文章
 */

export const insertArticle = (article: any) => {
  return request('/article/insertArticle', 'post', {
    ...article
  })
}

export const deleteArticle = (id: number) => {
  return request('/article/deleteArticle', 'get', {
    id
  })
}

export const getArticleAuditListApi = (queryParams: any) => {
  return request('/article/articleAuditList', 'get', { ...queryParams })
}

export const getarticleRecommendAPi = (id: number, isTop: string) => {
  return request('/article/articleRecommend', 'get', {
    id,
    isTop
  })
}

export const getarticleAuditApi = (id: number, audit: number) => {
  return request('/article/articleAudit', 'get', {
    id,
    audit
  })
}

export const getarticleContentApi = (id: number) => {
  return request('/article/articleContent', 'get', {
    id
  })
}
