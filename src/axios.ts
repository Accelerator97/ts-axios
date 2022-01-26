import Axios from './core/Axios'
import { AxiosRequestConfig, AxiosStatic } from './types'
import { extend } from './helpers/util'
import defaultConfig from './default'
import mergeConfig from './core/mergeConfig'
import CancelToken from './cancel/CancelToken'
import { Cancel, isCancel } from './cancel/Cancel'

// instance本身是一个函数，但是又拥有Axios类上的所有原型和实例属性
function createInstance(config: AxiosRequestConfig): AxiosStatic {
  const context = new Axios(config)
  // instance 指向 Axios.prototype.request 方法，并绑定了上下文 context，这样能拥有Axios类上的原型方法
  const instance = Axios.prototype.request.bind(context)

  extend(instance, context)

  return instance as AxiosStatic
}

const axios = createInstance(defaultConfig)

// 取消请求
axios.CancelToken = CancelToken

axios.Cancel = Cancel
axios.isCancel = isCancel

// axios.create静态方法
// 内部调用了 createInstance 函数，并且把参数 config 与 defaults 合并，作为新的默认配置。注意这里需要 createInstance 函数的返回值类型为 AxiosStatic。
axios.create = function create(config: AxiosRequestConfig) {
  return createInstance(mergeConfig(defaultConfig, config))
}

// axios.all方法与Promise.all方法是一模一样的，不管是使用方式还是传入的参数都是一模一样的
axios.all = function all(promises) {
  return Promise.all(promises)
}

// axios.all 就是 Promise.all 的封装，它返回的是一个 Promise 数组，then 函数的参数本应是一个参数为 Promise resolves（数组）的函数，在这里使用了 axios.spread 方法。所以 axios.spread 方法是接收一个函数，返回一个新的函数，新函数的结构满足 then 函数的参数结构
axios.spread = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr)
  }
}

axios.Axios = Axios

export default axios
