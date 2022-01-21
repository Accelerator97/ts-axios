import { buildURL } from '../helpers/url'
import { transformRequest, transformResponse } from '../helpers/data'
import  {AxiosPromise, AxiosRequestConfig, AxiosResponse} from '../types/index'
import xhr from './xhr'
import { flattenHeaders, processHeaders } from '../helpers/headers'

function dispatchRequest(config:AxiosRequestConfig):AxiosPromise{
    processConfig(config)
    return xhr(config).then((res: AxiosResponse)=>{
        return transformResponseData(res)
    })
}

function processConfig(config:AxiosRequestConfig):void{
    config.url = transformUrl(config)
    config.headers = transformHeaders(config)
    config.data = transformRequestData(config)
    config.headers = flattenHeaders(config.headers,config.method!)
}

function transformUrl(config:AxiosRequestConfig):string{
    const {url,params} = config
    return buildURL(url!,params)
}
function transformRequestData(config:AxiosRequestConfig):string{
    return transformRequest(config.data)
}

function transformHeaders(config:AxiosRequestConfig):string{
    const {headers = {},data } = config
    return processHeaders(headers,data)
}

function transformResponseData(res:AxiosResponse):AxiosResponse{
    res.data = transformResponse(res.data)
    return res
}


export default dispatchRequest