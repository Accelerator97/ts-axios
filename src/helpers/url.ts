import {isDate,isObject} from './util'

//JSON.stringify有可能把一些常见字符转为特殊字符，所以需要转回来
//encodeURIComponent() 函数可把字符串作为 URI 组件进行编码。
//该方法不会对 ASCII 字母和数字进行编码，也不会对这些 ASCII 标点符号进行编码： - _ . ! ~ * ' ( ) 。
function encode (val: string): string {
    return encodeURIComponent(val)
      .replace(/%40/g, '@')
      .replace(/%3A/gi, ':')
      .replace(/%24/g, '$')
      .replace(/%2C/gi, ',')
      .replace(/%20/g, '+')
      .replace(/%5B/gi, '[')
      .replace(/%5D/gi, ']')
  }

export function buildURL(url:string,params?:any){
    //如果没传params 就不用进行url的拼接
    if(!params){
        return url
    }

    const parts:string[] = []
    Object.keys(params).forEach(key =>{
        const val = params[key]
        if(val === null || typeof val === 'undefined'){
            return 
        }
        let values = []
        if(Array.isArray(val)){
            values = val  
            key += '[]'  //参数值为数组时  拼接后的url为/base/get?foo[]=bar&foo[]=baz ，所以key要+='[]'
        }else {
            values = [val] //把val放在数组里，这是为了调用forEach方法
        }
        values.forEach(val=>{ //遍历values的每一项val
            if(isDate(val)){//val如果是日期，调用toISOString进行拼接
                val = val.toISOString() 
            }else if(isObject(val)){   //val如果是对象，调用JSON.stringify继续拼接
                val = JSON.stringify(val) 
            }
            parts.push(`${encode(key)}=${encode(val)}`)
        })
    })
    
    //parts的每一项通过&来连接
    let serializeParams = parts.join('&')
    if(serializeParams){
        //看是否有哈希标识符，有的话要忽略#及#后面的内容
        const markIndex= url.indexOf('#')
        if(markIndex !== -1){
            url = url.slice(0,markIndex)
        }
        //如果前面没有? 需要拼上? 否则 拼上 & 
        url += (url.indexOf('?') === -1 ? '?' : '&') + serializeParams
    }
    return url 
}