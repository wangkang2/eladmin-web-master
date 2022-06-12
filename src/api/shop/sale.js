import request from '@/utils/request'

export function getSales(params) {
  return request({
    url: 'api/sale',
    method: 'get',
    params
  })
}

export function getBoxBySaleId(params) {
  return request({
    url: 'api/sale/getBoxBySaleId',
    method: 'get',
    params
  })
}

export function getLoopValueBySaleId(params) {
  return request({
    url: 'api/sale/getLoopValueBySaleId',
    method: 'get',
    params
  })
}

export function add(data) {
  return request({
    url: 'api/sale',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/sale',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/sale',
    method: 'put',
    data
  })
}

export default { add, edit, del, getSales, getBoxBySaleId, getLoopValueBySaleId }
