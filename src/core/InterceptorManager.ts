import { ResolvedFn, RejectedFn } from '../types'

interface Interceptor<T> {
  resolved: ResolvedFn<T>
  rejected?: RejectedFn
}

// 定义了一个 InterceptorManager 泛型类，内部维护一个私有属性interceptors
// 该类还提供了三个方法use/forEach/eject
export default class InterceptorManager<T> {
  // 私有属性，实际上是存储拦截器，实际上是一个数组
  private interceptors: Array<Interceptor<T> | null>
  constructor() {
    // 在构造器中对interceptors进行初始化
    this.interceptors = []
  }
  // use实际上是添加拦截器
  use(resolved: ResolvedFn<T>, rejected?: RejectedFn): number {
    this.interceptors.push({
      resolved,
      rejected
    })
    // 拦截器的id 此时等于interceptors数组的长度
    return this.interceptors.length - 1
  }
  // forEach遍历拦截器
  // 把每个拦截器作为传入的fn的参数执行一遍
  forEach(fn: (interceptor: Interceptor<T>) => void): void {
    this.interceptors.forEach(interceptor => {
      if (interceptor !== null) {
        fn(interceptor)
      }
    })
  }
  // eject删除拦截器
  // 删除的时候不能改变数组的长度，所以直接设置为null
  eject(id: number): void {
    if (this.interceptors[id]) {
      this.interceptors[id] = null
    }
  }
}
