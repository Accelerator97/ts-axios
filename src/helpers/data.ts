import { isPlainObject } from './util'

// 请求的data如果是普通对象，转换成JSON字符串
export function transformRequestData(data: any): any {
  if (isPlainObject(data)) {
    // 普通对象需要转为JSON字符串才能被写进body被传递
    return JSON.stringify(data)
  }
  return data
}

// 响应的data从JSON字符串转为普通对象
export function transformResponseData(data: any): any {
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data)
    } catch (e) {
      // do nothing
    }
  }
  return data
}
