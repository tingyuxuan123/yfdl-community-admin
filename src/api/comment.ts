import request from '@/utils/request'

export const getcommentAuditListApi = (queryParams: any) => {
  return request('/comment/commentAuditList', 'get', { ...queryParams })
}

export const getcommentAudit = (id: number, audit: number) => {
  return request('/comment/commentAudit', 'get', {
    id,
    audit
  })
}
