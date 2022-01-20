export type Method = 'get' | 'GET' | 'delete' | 'DELETE' | 'head' | 'HEAD' | 'options' | 'OPTIONS' | 'post' | 'POST' | 'put' | 'PUT' | 'patch' | 'PATCH'

export interface AxiosRequestConfig {
    url?: string,
    method?: Method,
    data?: any
    params?: any,
    headers?: any,
    //在请求中指定服务器返回的响应数据类型
    //XMLHttpRequestResponseType 类型，它的定义是 "" | "arraybuffer" | "blob" | "document" | "json" | "text" 
    responseType?: XMLHttpRequestResponseType
    //设置请求的超时时间，当请求发送后超过某个时间后仍然没收到响应，则请求自动终止，并触发 timeout 事件
    timeout?: number
}

//处理服务端响应的数据，支持Promise链式调用
//并且在then方法里拿到res对象，该对象应该包括：返回的数据data/状态码status/状态码信息statusText/响应头headers/请求配置对象config/请求的XMLHttpRequest对象实例request
export interface AxiosResponse {
    data: any,
    status: number,
    statusText: string,
    headers: any,
    config: AxiosRequestConfig,
    request: any
}

//axios 函数返回的是一个 Promise 对象,可以定义一个 AxiosPromise 接口，它继承于 Promise<AxiosResponse> 这个泛型接口
//当 axios 返回的是 AxiosPromise 类型，那么 resolve 函数中的参数就是一个 AxiosResponse 类型。
export interface AxiosPromise extends Promise<AxiosResponse> { }


//对外提供的信息不仅仅包含错误文本信息，还包括了请求对象配置 config，错误代码 code，XMLHttpRequest 对象实例 request以及自定义响应对象 response
export interface AxiosError extends Error {
    config: AxiosRequestConfig,
    code?: string,
    request?: any,
    response?: AxiosResponse,
    isAxiosError: boolean
}


//首先定义一个 Axios 类型接口，它描述了 Axios 类中的公共方法，接着定义了 AxiosInstance 接口继承 Axios，它就是一个混合类型的接口
export interface Axios {
    request(config:AxiosRequestConfig):AxiosPromise
    get(url:string,config?:AxiosRequestConfig):AxiosPromise
    delete(url:string,config?:AxiosRequestConfig):AxiosPromise
    head(url:string,config?:AxiosRequestConfig):AxiosPromise
    options(url:string,config?:AxiosRequestConfig):AxiosPromise
    post(url:string,data?:any,config?:AxiosRequestConfig):AxiosPromise
    put(url:string,data?:any,config?:AxiosRequestConfig):AxiosPromise
    patch(url:string,data?:any,config?:AxiosRequestConfig):AxiosPromise
}

//混合类型的接口，拥有Axios下的各种方法
export interface AxiosInstance extends Axios {
    //定义一个函数 接收config 返回AxiosPromise
    (config:AxiosRequestConfig):AxiosPromise
}


