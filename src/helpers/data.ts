import { isPlainObject } from "./util";

export function transformRequest(data:any):any{
    if(isPlainObject(data)){
        //普通对象需要转为JSON字符串才能被写进body被传递
        return JSON.stringify(data)
    }
    return data
}