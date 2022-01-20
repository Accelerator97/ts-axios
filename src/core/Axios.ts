import { AxiosRequestConfig, AxiosPromise, Method } from "../types";
import dispatchRequest from "./dispatchRequest";


//首字母大写表明它是一个类
export default class Axios {
    //request方法 用户可以配置config method包括get/put/post/delete等等
    //实际上是通过dispatchRequest函数来实现，而dispatchRequest函数是基于xhr函数
    request(config: AxiosRequestConfig): AxiosPromise {
        return dispatchRequest(config)
    }
    
    //对于 get、delete、head、options、post、patch、put 这些方法，都是对外提供的语法糖，内部都是通过调用 request 方法实现发送请求，只不过在调用之前对 config 做了一层合并处理
    get(url: string, config?: AxiosRequestConfig): AxiosPromise {
        return this._requestMethodWithoutData('get',url,config)
    }
    delete(url: string, config?: AxiosRequestConfig): AxiosPromise {
        return this._requestMethodWithoutData('delete',url,config)
    }
    head(url: string, config?: AxiosRequestConfig): AxiosPromise {
        return this._requestMethodWithoutData('head',url,config)
    }
    options(url: string, config?: AxiosRequestConfig): AxiosPromise {
        return this._requestMethodWithoutData('options',url,config)
    }
    //post、put、patch的参数多了data
    post(url: string, config?: AxiosRequestConfig,data?:any): AxiosPromise {
        return this._requestMethodWithData('post',url,config,data)
    }
    put(url: string, config?: AxiosRequestConfig,data?:any): AxiosPromise {
        return this._requestMethodWithData('put',url,config,data)
    }
    patch(url: string, config?: AxiosRequestConfig,data?:any): AxiosPromise {
        return this._requestMethodWithData('patch',url,config,data)
    }
    
    _requestMethodWithoutData(method:Method,url:string,config?:AxiosRequestConfig){
        return this.request((Object.assign(config || {}, {
            method: method,
            url
        })))
    }
    _requestMethodWithData(method:Method,url:string,config?:AxiosRequestConfig,data?:any){
        return this.request((Object.assign(config || {}, {
            method: method,
            url,
            data
        })))
    }
}