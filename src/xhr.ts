import { resolve } from "dns";
import { AxiosPromise, AxiosRequestConfig, AxiosResponse } from "./types";
export default function xhr(config: AxiosRequestConfig): AxiosPromise {
    //Promise封装一个异步请求，用户可以通过then处理服务端返回的数据
    return new Promise((resovle) => {
        const { data = null, url, method = 'get', headers, responseType } = config
        const request = new XMLHttpRequest()
        //如果用户指定了返回数据的类型
        if (responseType) {
            request.responseType = responseType
        }

        //true开启异步
        request.open(method.toUpperCase(), url, true)

        request.onreadystatechange = function handleLoad() {
            if (request.readyState !== 4) {
                return
            }
            //获取所有响应头
            const responseHeaders = request.getAllResponseHeaders()
            //获取返回的响应数据
            const responseData = responseType && responseType !== 'text' ? request.response : request.responseText
            const response:AxiosResponse = {
                data:responseData,
                status:request.status,
                statusText:request.statusText,
                headers:responseHeaders,
                config,
                request
            }
            resovle(response)
        }

        //如果传入的data为空，请求headers配置Content-Type是没有意义的，所以删除掉
        Object.keys(headers).forEach((name) => {
            if (data === null && name.toLocaleLowerCase() === 'content-type') {
                delete headers[name]
            } else {
                request.setRequestHeader(name, headers[name])
            }
        })
        request.send(data)
    })

}