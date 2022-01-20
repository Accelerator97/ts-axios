import Axios from './core/Axios'
import { AxiosInstance } from './types'
import { extend } from './helpers/util'


//instance本身是一个函数，但是又拥有Axios类上的所有原型和实例属性
function createInstance(): AxiosInstance {
    const context = new Axios()
    //instance 指向 Axios.prototype.request 方法，并绑定了上下文 context，这样能拥有Axios类上的原型方法
    const instance = Axios.prototype.request.bind(context)

    extend(instance, context)

    return instance as AxiosInstance

}

const axios = createInstance()

export default axios
