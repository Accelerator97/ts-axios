export type Method = 'get' | 'GET' | 'detele' | 'DELETE' | 'head' | 'HEAD' | 'options' | 'OPTIONS' | 'post' | 'POST' | 'put' | 'PUT' | 'patch' | 'PATCH'
 
export interface AxiosRequestConfig{
    url:string,
    method?:Method,
    data?:any
    params?:any,
    headers?:any,
    //在请求中指定服务器返回的响应数据类型
    //XMLHttpRequestResponseType 类型，它的定义是 "" | "arraybuffer" | "blob" | "document" | "json" | "text" 
    responseType?:XMLHttpRequestResponseType
}

//处理服务端响应的数据，支持Promise链式调用
//并且在then方法里拿到res对象，该对象应该包括：返回的数据data/状态码status/状态码信息statusText/响应头headers/请求配置对象config/请求的XMLHttpRequest对象实例request
export interface AxiosResponse {
    data:any,
    status:number,
    statusText:string,
    headers:any,
    config:AxiosRequestConfig,
    request:any
}

//axios 函数返回的是一个 Promise 对象,可以定义一个 AxiosPromise 接口，它继承于 Promise<AxiosResponse> 这个泛型接口
//当 axios 返回的是 AxiosPromise 类型，那么 resolve 函数中的参数就是一个 AxiosResponse 类型。
export interface AxiosPromise extends Promise<AxiosResponse>{}
