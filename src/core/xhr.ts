import { AxiosPromise, AxiosRequestConfig, AxiosResponse } from '../types'
import { parseHeaders } from '../helpers/headers'
import { createError } from '../helpers/error'
import { isURLSameOrigin } from '../helpers/url'
import cookie from '../helpers/cookie'
import { isFormData } from '../helpers/util'

//  整个流程分为 7 步：
//  创建一个 request 实例。
//  执行 request.open 方法初始化。
//  执行 configureRequest 配置 request 对象。
//  执行 addEvents 给 request 添加事件处理函数。
//  执行 processHeaders 处理请求 headers。
//  执行 processCancel 处理请求取消逻辑。
//  执行 request.send 方法发送请求。

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  // Promise封装一个异步请求，用户可以通过then处理服务端返回的数据
  return new Promise((resolve, reject) => {
    // config是用户设置的请求信息
    const {
      data = null,
      url,
      method = 'get',
      headers,
      responseType,
      timeout,
      cancelToken,
      withCredentials,
      xsrfCookieName,
      xsrfHeaderName,
      onDownloadProgress,
      onUploadProgress,
      auth,
      validateStatus
    } = config
    const request = new XMLHttpRequest()
    // true开启异步
    request.open(method.toUpperCase(), url!, true)

    // 配置requestConfig对象
    configRequest()

    // 给request添加事件处理函数
    addEvents()

    // 处理headers
    processHeaders()

    // 处理请求取消逻辑
    processCancel()

    request.send(data)

    function configRequest(): void {
      // 如果用户指定了返回数据的类型
      if (responseType) {
        request.responseType = responseType
      }
      // 如果用户指定请求的超时时间，超过一定时间没有响应触发timeout事件
      if (timeout) {
        request.timeout = timeout
      }
      // 如果用户设置withCredentials，发送请求时会携带cookie
      if (withCredentials) {
        request.withCredentials = withCredentials
      }
    }

    function addEvents(): void {
      request.onreadystatechange = function handleLoad() {
        if (request.readyState !== 4) {
          return
        }
        if (request.status === 0) {
          return
        }
        // 获取所有响应头
        const responseHeaders = parseHeaders(request.getAllResponseHeaders())
        // 获取返回的响应数据
        const responseData =
          responseType && responseType !== 'text' ? request.response : request.responseText
        const response: AxiosResponse = {
          data: responseData,
          status: request.status,
          statusText: request.statusText,
          headers: responseHeaders,
          config,
          request
        }
        handleResponse(response)
      }

      // 处理网络错误
      request.onerror = function handleError() {
        reject(createError('Network Error', config, null, request))
      }

      // 处理超时
      request.ontimeout = function handleTimeout() {
        reject(
          createError(`Timeout of ${config.timeout} ms exceeded`, config, 'ECONNABORTED', request)
        )
      }

      // 下载和上传的进度
      if (onDownloadProgress) {
        request.onprogress = onDownloadProgress
      }

      if (onUploadProgress) {
        request.upload.onprogress = onUploadProgress
      }
    }

    function processHeaders(): void {
      // 如果请求是个 FormData 类型，则删除 headers['Content-Type'] 让浏览器自动为请求带上合适的 Content-Type
      if (isFormData(data)) {
        delete headers['Content-Type']
      }
      // 读取和设置cookie
      if ((withCredentials || isURLSameOrigin(url!)) && xsrfCookieName) {
        const xsrfValue = cookie.read(xsrfCookieName)
        if (xsrfValue) {
          headers[xsrfHeaderName!] = xsrfValue
        }
      }
      // 如果用户设置了auth,如果配置了就把该属性经过base64 加密后添加到请求 headers 中的 Authorization 属性上
      if (auth) {
        headers['Authorization'] = `Basic ${btoa(`${auth.username} : ${auth.password}`)}`
      }

      // 如果传入的data为空，请求headers配置Content-Type是没有意义的，所以删除掉
      Object.keys(headers).forEach(name => {
        if (data === null && name.toLocaleLowerCase() === 'content-type') {
          delete headers[name]
        } else {
          request.setRequestHeader(name, headers[name])
        }
      })
    }

    function processCancel(): void {
      // 首先判断用户是否配置的cancelToken，如果没有配置，表示没有取消请求这项需求；
      // 如果配置cancelToken，并且当外部调用了请求取消触发函数，此时cancelToken.promise会变成resolved 状态，然后就会执行then函数，在then函数内部调用XMLHttpRequest对象上的abort()取消请求
      if (cancelToken) {
        cancelToken.promise
          .then(reason => {
            request.abort()
            reject(reason)
          })
          .catch(() => {
            // do nothing
          })
      }
    }

    function handleResponse(response: AxiosResponse) {
      // 自定义合法状态码
      if (!validateStatus || validateStatus(response.status)) {
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
  })
}
