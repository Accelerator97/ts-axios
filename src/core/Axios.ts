import { AxiosRequestConfig, AxiosPromise, Method, AxiosResponse, ResolvedFn, RejectedFn } from "../types";
import dispatchRequest from "./dispatchRequest";
import InterceptorManager from "./InterceptorManager";
import mergeConfig from "./mergeConfig";

interface Interceptors {
    request: InterceptorManager<AxiosRequestConfig>,
    response: InterceptorManager<AxiosResponse>
}

interface PromiseChain {
    resolved: ResolvedFn | ((config: AxiosRequestConfig) => AxiosPromise)
    rejected?: RejectedFn

}

//文件名首字母大写表明它是一个类
export default class Axios {
    defaults:AxiosRequestConfig
    //定义一个interceptors对象，这个对象拥有两个属性request和response。然后在constructor中进行初始化new InterceptorManager 
    //InterceptorManager 这个类上有use方法、forEach方法和eject方法
    interceptors: Interceptors
    constructor(initConfig:AxiosRequestConfig) {
        this.defaults = initConfig
        this.interceptors = {
            //request是对config进行操作，response是对响应信息进行操作
            request: new InterceptorManager<AxiosRequestConfig>(),
            response: new InterceptorManager<AxiosResponse>()
        }
    }
    //request方法 用户可以配置config method包括get/put/post/delete等等
    //实际上是通过dispatchRequest函数来实现，而dispatchRequest函数是基于xhr函数
    //支持传入一个或两个参数
    //虽然修改 request 的实现，支持了 2 种参数，但是我们对外提供的 request 接口仍然不变（Axios类中的request参数类型），可以理解为这仅仅是内部的实现的修改，与对外接口不必一致，只要保留实现兼容接口即可
    //也就是说当直接调用axios函数时可以传一个(config)或者两个参数(url和config)，但是调用axios.request时就只能传一个参数config
    request(url: any, config?: any): AxiosPromise {
        //函数重载
        if (typeof url === 'string') { //如果传递了url 还要判断config是否传入
            if (!config) {
                config = {}
            }
            config.url = url
        } else {
            //如果 url 不是字符串类型，则说明我们传入的就是单个参数，且 url 就是 config，因此把 url 赋值给 config
            config = url
        }
        //根据用户传入的配置和默认配置进行合并
        config = mergeConfig(this.defaults, config)

        //构造一个 PromiseChain 类型的数组 chain，并把 dispatchRequest 函数赋值给 resolved 属性
        const chain: PromiseChain[] = [{
            resolved: dispatchRequest,
            rejected: undefined
        }]

        this.interceptors.request.forEach(interceptor => {
            //对于请求拦截器来说，后添加的拦截器先执行，通过unshift先放到数组开头
            chain.unshift(interceptor)
        })
        this.interceptors.response.forEach(interceptor => {
            //对于响应拦截器来说，先添加的拦截器先执行
            chain.push(interceptor)
        })

        //定义一个已经 resolve 的 promise，循环这个 chain，拿到每个拦截器对象，把它们的 resolved 函数和 rejected 函数添加到 promise.then 的参数中
        //这样就相当于通过 Promise 的链式调用方式，实现了拦截器一层层的链式调用的效果。
        let promise = Promise.resolve(config)


        while (chain.length) {
            //chain有可能是Promise 也有可能是空，用!断言不为空
            //shift删除数组第一个元素并返回这个元素
            const { resolved, rejected } = chain.shift()!
            promise = promise.then(resolved, rejected)
        }
        //return dispatchRequest(config)
        return promise
    }

    //对于 get、delete、head、options、post、patch、put 这些方法，都是对外提供的语法糖，内部都是通过调用 request 方法实现发送请求，只不过在调用之前对 config 做了一层合并处理
    get(url: string, config?: AxiosRequestConfig): AxiosPromise {
        return this._requestMethodWithoutData('get', url, config)
    }
    delete(url: string, config?: AxiosRequestConfig): AxiosPromise {
        return this._requestMethodWithoutData('delete', url, config)
    }
    head(url: string, config?: AxiosRequestConfig): AxiosPromise {
        return this._requestMethodWithoutData('head', url, config)
    }
    options(url: string, config?: AxiosRequestConfig): AxiosPromise {
        return this._requestMethodWithoutData('options', url, config)
    }
    //post、put、patch的参数多了data
    post(url: string, config?: AxiosRequestConfig, data?: any): AxiosPromise {
        return this._requestMethodWithData('post', url, config, data)
    }
    put(url: string, config?: AxiosRequestConfig, data?: any): AxiosPromise {
        return this._requestMethodWithData('put', url, config, data)
    }
    patch(url: string, config?: AxiosRequestConfig, data?: any): AxiosPromise {
        return this._requestMethodWithData('patch', url, config, data)
    }

    _requestMethodWithoutData(method: Method, url: string, config?: AxiosRequestConfig) {
        return this.request((Object.assign(config || {}, {
            method: method,
            url
        })))
    }
    _requestMethodWithData(method: Method, url: string, config?: AxiosRequestConfig, data?: any) {
        return this.request((Object.assign(config || {}, {
            method: method,
            url,
            data
        })))
    }
}