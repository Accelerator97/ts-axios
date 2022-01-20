import { AxiosRequestConfig, AxiosPromise, Method } from "../types";
import dispatchRequest from "./dispatchRequest";


//文件名首字母大写表明它是一个类
export default class Axios {
    //request方法 用户可以配置config method包括get/put/post/delete等等
    //实际上是通过dispatchRequest函数来实现，而dispatchRequest函数是基于xhr函数
    //支持传入一个或两个参数
    //虽然修改 request 的实现，支持了 2 种参数，但是我们对外提供的 request 接口仍然不变（Axios类中的request参数类型），可以理解为这仅仅是内部的实现的修改，与对外接口不必一致，只要保留实现兼容接口即可
    //也就是说当直接调用axios函数时可以传一个(config)或者两个参数(url和config)，但是调用axios.request时就只能传一个参数config
    request(url:any,config?:any): AxiosPromise {
        if(typeof url === 'string'){ //如果传递了url 还要判断config是否传入
            if(!config){
                config = {}
            }
            config.url = url
        }else{
            //如果 url 不是字符串类型，则说明我们传入的就是单个参数，且 url 就是 config，因此把 url 赋值给 config
            config = url
        }
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