import { buildURL } from '../helpers/url'
import  {AxiosPromise, AxiosRequestConfig, AxiosResponse} from '../types/index'
import xhr from './xhr'
import { flattenHeaders, processHeaders } from '../helpers/headers'
import transform from './transform'

function dispatchRequest(config:AxiosRequestConfig):AxiosPromise{
    processConfig(config)
    return xhr(config).then((res: AxiosResponse)=>{
        return transformResponseData(res)
    })
}

function processConfig(config:AxiosRequestConfig):void{
    config.url = transformUrl(config)
    config.headers = transformHeaders(config)
    //对请求数据的处理和对响应数据的处理改成使用 transform 函数实现，并把配置中的 transformRequest 及 transformResponse 分别传入
    config.data = transform(config.data,config.headers,config.transformRequest)
    config.headers = flattenHeaders(config.headers,config.method!)
}



function transformUrl(config:AxiosRequestConfig):string{
    const {url,params} = config
    return buildURL(url!,params)
}
function transformHeaders(config:AxiosRequestConfig):string{
    const {headers = {},data } = config
    return processHeaders(headers,data)
}

function transformResponseData(res:AxiosResponse):AxiosResponse{
    //对请求数据的处理和对响应数据的处理改成使用 transform 函数实现，并把配置中的 transformRequest 及 transformResponse 分别传入。
    res.data = transform(res.data,res.headers,res.config.transformResponse)
    return res
}


export default dispatchRequest