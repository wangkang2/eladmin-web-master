import request from '@/utils/request'

export function getBoxs(params) {
    return request({
        url: 'api/box',
        method: 'get',
        params
    })
}


export function add(data) {
    return request({
        url: 'api/box',
        method: 'post',
        data
    })
}

export function del(ids) {
    return request({
        url: 'api/box',
        method: 'delete',
        data: ids
    })
}

export function edit(data) {
    return request({
        url: 'api/box',
        method: 'put',
        data
    })
}

export default { add, edit, del, getBoxs }
