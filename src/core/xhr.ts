import { AxiosPromise, AxiosRequestConfig, AxiosResponse } from "../types";
import { parseHeaders } from '../helpers/headers'
import { createError } from "../helpers/error";

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
    //Promise封装一个异步请求，用户可以通过then处理服务端返回的数据
    return new Promise((resolve, reject) => {
        //config是用户设置的请求信息
        const { data = null, url, method = 'get', headers, responseType, timeout } = config
        const request = new XMLHttpRequest()
        //如果用户指定了返回数据的类型
        if (responseType) {
            request.responseType = responseType
        }
        //如果用户指定请求的超时时间，超过一定时间没有响应触发timeout事件
        if (timeout) {
            request.timeout = timeout
        }

        //true开启异步
        request.open(method.toUpperCase(), url!, true)

        request.onreadystatechange = function handleLoad() {
            if (request.readyState !== 4) {
                return
            }
            if (request.status === 0) {
                return
            }
            //获取所有响应头
            const responseHeaders = parseHeaders(request.getAllResponseHeaders())
            //获取返回的响应数据
            const responseData = responseType && responseType !== 'text' ? request.response : request.responseText
            const response: AxiosResponse = {
                data: responseData,
                status: request.status,
                statusText: request.statusText,
                headers: responseHeaders,
                config,
                request
            }
            handleResponse(response)
            function handleResponse(response: AxiosResponse) {
                if (response.status >= 200 && response.status < 300) {
                    resolve(response)
                } else {
                    reject(
                        createError(
                            `Request failed with status code ${response.status}`,
                            config,
                            null,
                            request,
                            response
                        )
                    )
                }
            }
        }


        //处理网络错误
        request.onerror = function handleError() {
            reject(
                createError(
                    'Newwork Error',
                    config,
                    null,
                    request
                )
            )
        }
        
        //处理超时
        request.ontimeout = function handleTimeout() {
            reject(
                createError(
                    `Timeout of ${config.timeout} ms exceeded`,
                    config,
                    'ECONNABORTED',
                    request
                )
            )
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