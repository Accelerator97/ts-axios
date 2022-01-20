import { AxiosRequestConfig } from "./types";
export default function xhr (config:AxiosRequestConfig):void {
    const {data = null,url,method = 'get',headers} = config
    const request = new XMLHttpRequest()
    
    //true开启异步
    request.open(method.toUpperCase(),url,true)
   
    //如果传入的data为空，请求headers配置Content-Type是没有意义的，所以删除掉
    Object.keys(headers).forEach((name)=>{
        if(data === null && name.toLocaleLowerCase() === 'content-type'){
            delete headers[name]
        }else{
            request.setRequestHeader(name,headers[name])
        }
    })
    request.send(data)
}