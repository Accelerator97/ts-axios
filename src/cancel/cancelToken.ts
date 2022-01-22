import { Canceler, CancelExecutor, CancelTokenSource } from "../types"

interface ResolvePromise {
    (reason: string): void
}


//在 CancelToken 构造函数内部，实例化一个 pending 状态的 Promise 对象，然后用一个 resolvePromise 变量指向 resolve 函数。调用resolvePromise相当于调用resolve函数
export default class CancelToken {
    promise: Promise<string>
    reason?: string

    //接受一个参数executor 这个参数类型是函数
    constructor(executor: CancelExecutor) {
        let resolvePromise:  ResolvePromise
        this.promise = new Promise<string>((resolve) => {
            resolvePromise = resolve;
          });
      
        //执行 executor 函数，该函数接收的参数是: cancel 函数
        //cancel 函数就是将来的请求取消触发函数，当外部调用了 cancel 函数，在 cancel 函数内部，会调用 resolvePromise 把 Promise 对象从 pending 状态变为 resolved 状态。
        executor(message => {
            if (this.reason) {
                return
            }
            this.reason = message
            resolvePromise(this.reason!)
        })
    }

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

