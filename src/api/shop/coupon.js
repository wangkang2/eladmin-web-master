import request from '@/utils/request'

export function getCoupons(params) {
  return request({
    url: 'api/coupon',
    method: 'get',
    params
  })
}

export function add(data) {
  return request({
    url: 'api/coupon',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/coupon',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/coupon',
    method: 'put',
    data
  })
}

export default { add, edit, del, getCoupons }
