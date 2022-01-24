import { buildURL, combineURL, isAbsoluteURL } from '../helpers/url'
import { AxiosPromise, AxiosRequestConfig, AxiosResponse } from '../types/index'
import xhr from './xhr'
import { flattenHeaders, processHeaders } from '../helpers/headers'
import transform from './transform'

function dispatchRequest(config: AxiosRequestConfig): AxiosPromise {
  throwIfCancellationRequested(config)
  processConfig(config)
  return xhr(config).then((res: AxiosResponse) => {
    return transformResponseData(res)
  })
}

function processConfig(config: AxiosRequestConfig): void {
  config.url = transformUrl(config)
  config.headers = transformHeaders(config)
  //对请求数据的处理和对响应数据的处理改成使用 transform 函数实现，并把配置中的 transformRequest 及 transformResponse 分别传入
  config.data = transform(config.data, config.headers, config.transformRequest)
  config.headers = flattenHeaders(config.headers, config.method!)
}

//发送请求前检查一下配置的 cancelToken 是否已经使用过了，如果已经被用过则不用再次发出请求，直接抛异常。
function throwIfCancellationRequested(config: AxiosRequestConfig): void {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested()
  }
}

//先判断传入的url是否是绝对地址，如果不是，则将baseURL与传入的url进行拼接；拼接好之后，将拼接后的url作为请求真正的url发送请求
export function transformUrl(config: AxiosRequestConfig): string {
  let { url, params,paramsSerializer,baseURL } = config
  if (baseURL && !isAbsoluteURL(url!)) {
    url = combineURL(baseURL, url);
  }
  return buildURL(url!, params,paramsSerializer)
}
function transformHeaders(config: AxiosRequestConfig): string {
  const { headers = {}, data } = config
  return processHeaders(headers, data)
}

function transformResponseData(res: AxiosResponse): AxiosResponse {
  //对请求数据的处理和对响应数据的处理改成使用 transform 函数实现，并把配置中的 transformRequest 及 transformResponse 分别传入。
  res.data = transform(res.data, res.headers, res.config.transformResponse)
  return res
}

export default dispatchRequest
