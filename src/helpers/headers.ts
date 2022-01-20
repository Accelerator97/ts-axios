import { isPlainObject } from "./util";

function normalizeHeaderName(headers:any,normalizeName:any):void{
    if(!headers){
        return
    }
    Object.keys(headers).forEach(name=>{
        //如果传入的是content-type 标准的是应该区分大小写Content-Type 
        if(name !== normalizeName && name.toUpperCase() === normalizeName.toUpperCase()){
            console.log('规范大小写，删除用户设置的content-type')
            headers[normalizeName] = headers[name]
            delete headers[name]
        }
    })
}

export function processHeaders(headers:any,data:any):any{
    normalizeHeaderName(headers,'Content-Type')
    //如果数据是普通对象，需要设置Content-Type=application/json;charset=utf-8，才能传送否则服务器无法正确解析数据
    if(isPlainObject(data)){
        //如果用户没有设置headers，提供一个默认设置
        if(headers && !headers['Content-Type']){
            headers['Content-Type'] = 'application/json;charset=utf-8'
        }
    }
    return headers
}