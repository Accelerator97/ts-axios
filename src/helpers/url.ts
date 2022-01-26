import { isDate, isObject, isURLSearchParams } from './util'

// encodeURIComponent() 函数可把字符串作为 URI 组件进行编码
// 该方法不会对 ASCII 字母和数字进行编码，也不会对这些 ASCII 标点符号进行编码： - _ . ! ~ * ' ( )
// 对于字符 @ : $ , [ ]，我们是允许出现在 url 中的，不希望被 encode
// 空格字符会被替换成 +
function encode(val: string): string {
  return encodeURIComponent(val)
    .replace(/%40/g, '@')
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']')
}

export function buildURL(url: string, params?: any, paramsSerializer?: (params: any) => string) {
  // 如果没传params 就不用进行url的拼接
  if (!params) {
    return url
  }
  let serializeParams
  if (paramsSerializer) {
    serializeParams = paramsSerializer(params)
  } else if (isURLSearchParams(params)) {
    serializeParams = params.toString()
  } else {
    const parts: string[] = []
    Object.keys(params).forEach(key => {
      const val = params[key]
      if (val === null || typeof val === 'undefined') {
        return
      }
      let values = []
      if (Array.isArray(val)) {
        values = val
        key += '[]' // 参数值为数组时  拼接后的url为/base/get?foo[]=bar&foo[]=baz ，所以key要+='[]'
      } else {
        values = [val] // 把val放在数组里，这是为了调用forEach方法
      }
      values.forEach(val => {
        // 遍历values的每一项val
        if (isDate(val)) {
          // val如果是日期，调用toISOString进行拼接
          val = val.toISOString()
        } else if (isObject(val)) {
          // val如果是对象，调用JSON.stringify继续拼接
          val = JSON.stringify(val)
        }
        parts.push(`${encode(key)}=${encode(val)}`)
      })
    })

    // parts的每一项通过&来连接
    serializeParams = parts.join('&')
  }

  if (serializeParams) {
    // 看是否有哈希标识符，有的话要忽略#及#后面的内容
    const markIndex = url.indexOf('#')
    if (markIndex !== -1) {
      url = url.slice(0, markIndex)
    }
    // 如果前面没有? 需要拼上? 否则 拼上 &
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializeParams
  }
  return url
}

// 如果URL以“<scheme>：//”或“//”（协议相对URL）开头，则该URL被视为绝对值。
// RFC 3986将方案名称定义为以字母开头的字符序列，后跟字母，数字，加号，句点或连字符的任意组合。
export function isAbsoluteURL(url: string): boolean {
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url)
}

export function combineURL(baseURL: string, relativeURL?: string): string {
  return relativeURL ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '') : baseURL
}

// 通过创建一个a标签的 DOM，然后设置该a标签的href属性为我们请求的的url，然后这样就可以获取到该DOM的protocol、host、port。
// 再把当前页面的url也都通过这种方式获取，然后对比它们的protocol、host以及port是否都相同，进而判断出请求是否是跨域

interface URLOrigin {
  protocol: string
  host: string
  port: string
}

export function isURLSameOrigin(requestURL: string): boolean {
  let urlParsingNode = document.createElement('a')

  // 获取当前页面地址的协议、域名、端口号
  const currentOrigin = resolveURL(window.location.href)
  // 获取请求的url的协议、域名、端口号
  const parsedOrigin = resolveURL(requestURL)

  // 比较是否相同，即判断是否是同源还是跨域
  return (
    parsedOrigin.protocol === currentOrigin.protocol &&
    parsedOrigin.host === currentOrigin.host &&
    parsedOrigin.port === currentOrigin.port
  )

  // 创建一个可以通过URL获取协议、域名、端口号的函数
  function resolveURL(url: string): URLOrigin {
    urlParsingNode.setAttribute('href', url)
    return {
      protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
      host: urlParsingNode.host,
      port: urlParsingNode.port
    }
  }
}
