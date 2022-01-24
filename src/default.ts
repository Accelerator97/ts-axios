import { AxiosRequestConfig } from "./types";
import { processHeaders } from "./helpers/headers";
import { transformRequestData, transformResponseData } from "./helpers/data";


//common 表示对于任何类型的请求都要添加该属性，而 method 表示只有该类型请求方法才会添加对应的属性。
const defaultConfig: AxiosRequestConfig = {
    method: 'get',
    timeout: 0,
    headers: {
        common: {
            //Accept表示客户端（浏览器）希望接受的数据类型
            Accept: 'application/json, text/plain, */*'
        }
    },
    //默认配置添加了 transformRequest 和 transformResponse 两个字段
    //它们的值是一个数组或者是一个函数
    transformRequest: [
        function (data: any, headers: any): any {
            processHeaders(headers, data)
            return transformRequestData(data)
        }
    ],

    transformResponse: [
        function (data: any): any {
            return transformResponseData(data)
        }
    ],
    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN',
    validateStatus(status: Number): boolean {
        return status >= 200 && status < 300
    }
}

const methodWithoutData = ['delete', 'get', 'head', 'options']
methodWithoutData.forEach(method => {
    defaultConfig.headers[method] = {}
})

const methodWithData = ['post', 'put', 'patch']
methodWithData.forEach(method => {
    defaultConfig.headers[method] = {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
})

export default defaultConfig