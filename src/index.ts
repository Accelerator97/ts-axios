import { buildURL } from './helpers/url'
import  {AxiosRequestConfig} from './types/index'
import xhr from './xhr'

function axios(config:AxiosRequestConfig):void{
    processConfig(config)
    xhr(config)
}

//对 config 中的数据做处理，除了对 url 和 params 处理之外，未来还会处理其它属性。
function processConfig(config:AxiosRequestConfig):void{
    config.url = transformUrl(config)
    console.log(config.url)
}

function transformUrl(config:AxiosRequestConfig):string{
    const {url,params} = config
    return buildURL(url,params)
}
export default axios