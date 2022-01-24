export type Method =
  | 'get'
  | 'GET'
  | 'delete'
  | 'DELETE'
  | 'head'
  | 'HEAD'
  | 'options'
  | 'OPTIONS'
  | 'post'
  | 'POST'
  | 'put'
  | 'PUT'
  | 'patch'
  | 'PATCH'

export interface AxiosRequestConfig {
  url?: string
  method?: Method
  data?: any
  params?: any
  headers?: any
  //在请求中指定服务器返回的响应数据类型
  //XMLHttpRequestResponseType 类型，它的定义是 "" | "arraybuffer" | "blob" | "document" | "json" | "text"
  responseType?: XMLHttpRequestResponseType
  //设置请求的超时时间，当请求发送后超过某个时间后仍然没收到响应，则请求自动终止，并触发 timeout 事件
  timeout?: number
  //默认配置添加了 transformRequest 和 transformResponse 两个字段，它们的值是一个数组或者是一个函数
  transformRequest?: AxiosTransformer | AxiosTransformer[]
  transformResponse?: AxiosTransformer | AxiosTransformer[]
  //CancelToken 是实例类型的接口定义，Canceler 是取消方法的接口定义，CancelExecutor 是 CancelToken 类构造函数参数的接口定义
  cancelToken?: CancelToken
  //跨域情况下要设置为true才会携带cookie
  withCredentials?: boolean
  //存放token的cookie名称
  xsrfCookieName?: string
  //请求 headers 中 token 对应的 header 名称
  xsrfHeaderName?: string
  //下载和上传进度监控
  onDownloadProgress?: (e: ProgressEvent) => void
  onUploadProgress?: (e: ProgressEvent) => void
  [propName: string]: any
}

//处理服务端响应的数据，支持Promise链式调用
//并且在then方法里拿到res对象，该对象应该包括：返回的数据data/状态码status/状态码信息statusText/响应头headers/请求配置对象config/请求的XMLHttpRequest对象实例request
//接口添加泛型参数
export interface AxiosResponse<T = any> {
  data: T
  status: number
  statusText: string
  headers: any
  config: AxiosRequestConfig
  request: any
}

//axios 函数返回的是一个 Promise 对象,可以定义一个 AxiosPromise 接口，它继承于 Promise<AxiosResponse> 这个泛型接口
//当 axios 返回的是 AxiosPromise 类型，那么 resolve 函数中的参数就是一个 AxiosResponse 类型。
//接口添加泛型参数
export interface AxiosPromise<T = any> extends Promise<AxiosResponse<T>> {}

//对外提供的信息不仅仅包含错误文本信息，还包括了请求对象配置 config，错误代码 code，XMLHttpRequest 对象实例 request以及自定义响应对象 response
export interface AxiosError extends Error {
  config: AxiosRequestConfig
  code?: string
  request?: any
  response?: AxiosResponse
  isAxiosError: boolean
}

//首先定义一个 Axios 类型接口，它描述了 Axios 类中的公共方法，接着定义了 AxiosInstance 接口继承 Axios，它就是一个混合类型的接口
//接口添加泛型参数
export interface Axios {
  defaults: AxiosRequestConfig
  interceptors: {
    request: AxiosInterceptorManager<AxiosRequestConfig>
    response: AxiosInterceptorManager<AxiosResponse>
  }
  request<T = any>(config: AxiosRequestConfig): AxiosPromise<T>
  get<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
  delete<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
  head<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
  options<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>
  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>
  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>
}

//混合类型的接口，拥有Axios下的各种方法
//接口添加泛型参数
export interface AxiosInstance extends Axios {
  //定义一个函数 接收config 返回AxiosPromise,支持传入一个参数
  <T = any>(config: AxiosRequestConfig): AxiosPromise<T>
  //支持传入两个参数
  <T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
}

//拦截器管理对象对外的接口
//也就是说axios.interceptor下有两个属性request和response，他们都有use和eject方法,forEach方法不对外暴露
//use方法接受两个参数:resolved和rejected,use接受的参数都为函数，所以定义两个函数接口
export interface AxiosInterceptorManager<T> {
  //use返回一个id，供eject来删除拦截器
  use(resolved: ResolvedFn<T>, rejected?: RejectedFn): number
  eject(id: number): void
}

export interface ResolvedFn<T = any> {
  //如果直接返回T，说明是同步调用；返回Promise，说明是异步调用
  (val: T): T | Promise<T>
}

export interface RejectedFn {
  (err: any): any
}

//默认配置添加 transformRequest 和 transformResponse 两个字段，它们的值是一个数组或者是一个函数。
export interface AxiosTransformer {
  (data: any, headers?: any): any
}

//扩展静态接口
//通过axios.create创造一个新的axios实例
//由于CancelToken是一个类，我们还要为这个类定义一个类类型接口CancelTokenStatic
export interface AxiosStatic extends AxiosInstance {
  create(config?: AxiosRequestConfig): AxiosInstance
  CancelToken: CancelTokenStatic
  Cancel: CancelStatic
  isCancel: (value: any) => boolean
}

//CancelTokenStatic 作为 CancelToken 类的类型
export interface CancelTokenStatic {
  new (executor: CancelExecutor): CancelToken
  source(): CancelTokenSource
}

//CancelTokenSource 作为 CancelToken 类静态方法 source 函数的返回值类型
export interface CancelTokenSource {
  token: CancelToken
  cancel: Canceler
}

//CancelToken类的实例对象接口类型
//包含两个参数：一个必选参数是promise，类型是Promise<string>，因为它要接收字符串类型的取消原因作为参数；另一个是可选参数取消原因reason，类型是string
export interface CancelToken {
  promise: Promise<CancelInstance>
  reason?: CancelInstance
  throwIfRequested(): void
}

//取消函数的类型
export interface Canceler {
  (message?: string): void
}

//因为CancelToken类的构造函数接收一个函数作为参数，因此，我们也需要定义一个该参数函数的类型。该参数函数又接收一个取消函数作为参数，它的类型是Canceler
export interface CancelExecutor {
  (cancel: Canceler): void
}

//定义了Cancel类的实例对象类型CancelInstance，它里面只有一个属性，那就是取消原因message，
//接着还定义Cancel类的类型CancelStatic，它里面包含了构造函数属性，构造函数接收取消原因作为参数，返回CancelInstance类型的实例对象。
//该接口接收一个异常对象e作为参数，用来判断该异常是否是由取消请求导致的，如果是的话该异常对象就应该是请求取消的原因
export interface CancelInstance {
  message?: string
}

export interface CancelStatic {
  new (message?: string): CancelInstance
}
