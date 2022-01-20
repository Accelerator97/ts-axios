import { buildURL } from './helpers/url'
import { transformRequest } from './helpers/data'
import  {AxiosRequestConfig} from './types/index'
import xhr from './xhr'
import { processHeaders } from './helpers/headers'

function axios(config:AxiosRequestConfig):void{
    processConfig(config)
    xhr(config)
}

function processConfig(config:AxiosRequestConfig):void{
    config.url = transformUrl(config)
    config.headers = transformHeaders(config)
    config.data = transformRequestData(config)
}

function transformUrl(config:AxiosRequestConfig):string{
    const {url,params} = config
    return buildURL(url,params)
}
function transformRequestData(config:AxiosRequestConfig):string{
    return transformRequest(config.data)
}

function transformHeaders(config:AxiosRequestConfig):string{
    const {headers = {},data } = config
    return processHeaders(headers,data)
}


export default axios