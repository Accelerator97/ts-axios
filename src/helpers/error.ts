import { AxiosRequestConfig, AxiosResponse } from '../types'

export class AxiosError extends Error {
  // 以下是AxiosError自身有的属性
  isAxiosError: boolean
  config: AxiosRequestConfig
  code?: string | null
  request?: any
  response?: AxiosResponse
  constructor(
    message: string,
    config: AxiosRequestConfig,
    code?: string | null,
    request?: any,
    response?: AxiosResponse
  ) {
    // message是父类Error身上的属性
    super(message)
    this.config = config
    this.isAxiosError = true
    this.code = code
    this.request = request
    this.response = response

    // 这是为了解决ts在继承一些内置对象时会出现bug ，无法访问原型链上的属性和方法，需要指定实例对象的原型为AxiosError.prototype
    Object.setPrototypeOf(this, AxiosError.prototype)
  }
}

// 为了方便使用，对外暴露一个createError的工厂方法
export function createError(
  message: string,
  config: AxiosRequestConfig,
  code?: string | null,
  request?: any,
  response?: AxiosResponse
): AxiosError {
  const error = new AxiosError(message, config, code, request, response)
  return error
}
