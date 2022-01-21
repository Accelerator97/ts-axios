import { AxiosRequestConfig } from "./types";

//common 表示对于任何类型的请求都要添加该属性，而 method 表示只有该类型请求方法才会添加对应的属性。
const defaultConfig: AxiosRequestConfig = {
    method: 'get',
    timeout: 0,
    headers: {
        common: {
            //Accept表示客户端（浏览器）希望接受的数据类型
            Accept: 'application/json, text/plain, */*'
        }
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