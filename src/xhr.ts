import { AxiosRequestConfig } from "./types";
export default function xhr (config:AxiosRequestConfig):void {
    const {data = null,url,method = 'get'} = config
    const request = new XMLHttpRequest()
    
    //true开启异步
    request.open(method.toUpperCase(),url,true)

    request.send(data)


}