import { Canceler, CancelExecutor, CancelTokenSource, CancelInstance } from '../types'
import { Cancel } from './Cancel'

interface ResolvePromise {
  (reason: CancelInstance): void
}

// 在 CancelToken 构造函数内部，实例化一个 pending 状态的 Promise 对象，然后用一个 resolvePromise 变量指向 resolve 函数。调用resolvePromise相当于调用resolve函数
export class CancelToken {
  promise: Promise<CancelInstance>
  reason?: CancelInstance

  // 接受一个参数executor 这个参数类型是函数
  constructor(executor: CancelExecutor) {
    let resolvePromise: ResolvePromise
    this.promise = new Promise<CancelInstance>(resolve => {
      resolvePromise = resolve
    })

    // 执行 executor 函数，该函数接收的参数是: cancel 函数
    // cancel 函数就是将来的请求取消触发函数，当外部调用了 cancel 函数，在 cancel 函数内部，会调用 resolvePromise 把 Promise 对象从 pending 状态变为 resolved 状态。
    executor(message => {
      if (this.reason) {
        return
      }
      this.reason = new Cancel(message)
      resolvePromise(this.reason)
    })
  }
  // 如当一个请求携带的 cancelToken 已经被使用过，那么我们甚至都可以不发送这个请求，只需要抛一个异常即可，并且抛异常的信息就是我们取消的原因
  throwIfRequested(): void {
    if (this.reason) {
      throw this.reason
    }
  }

  // source方法返回的是一个对象，里面包含两个属性，分别是：CancelToken类的实例对象token，类型是CancelToken和触发函数cancel，类型是Canceler
  static source(): CancelTokenSource {
    let cancel!: Canceler

    const token = new CancelToken(c => {
      cancel = c
    })

    return {
      cancel,
      token
    }
  }
}
