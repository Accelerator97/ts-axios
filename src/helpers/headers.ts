import { Method } from "../types";
import { deepMerge, isPlainObject } from "./util";

function normalizeHeaderName(headers: any, normalizeName: any): void {
    if (!headers) {
        return
    }
    Object.keys(headers).forEach(name => {
        //如果传入的是content-type 标准的是应该区分大小写Content-Type 
        //把content-type对应的值赋值给Content-Type，然后删除content-type这个字段
        if (name !== normalizeName && name.toUpperCase() === normalizeName.toUpperCase()) {
            headers[normalizeName] = headers[name]
            delete headers[name]
        }
    })
}

export function processHeaders(headers: any, data: any): any {
    normalizeHeaderName(headers, 'Content-Type')
    //如果数据是普通对象，需要设置Content-Type=application/json;charset=utf-8，才能传送否则服务器无法正确解析数据
    if (isPlainObject(data)) {
        //如果用户没有设置headers，提供一个默认设置
        if (headers && !headers['Content-Type']) {
            headers['Content-Type'] = 'application/json;charset=utf-8'
        }
    }
    return headers
}


//对响应头进行处理，解析成一个对象结构
export function parseHeaders(headers: string): any {
    //创造一个对象，用于保存key,value
    let parsed = Object.create(null)
    if (!headers) {
        return parsed
    }
    headers.split('\r\n').forEach(line => {
        let [key, val] = line.split(':')
        key = key.trim().toLowerCase()
        if (!key) {
            return
        }
        if (val) {
            val = val.trim()
        }
        parsed[key] = val
    })
    return parsed
}

//合并用户传入的配置和默认配置之后，对headers进行压缩，压缩成一级
export function flattenHeaders(headers:any,method:Method):any{
    if(!headers){
        return headers
    }
    headers = deepMerge(headers.common || {}, headers[method] || {},headers)

    const methodsToDelete = ['delete', 'get', 'head', 'options', 'post', 'put', 'patch', 'common']
    //删掉headers中不需要的字段 比如headers[method]
    methodsToDelete.forEach(method =>{
        delete headers[method]
    })

    return headers
    
}