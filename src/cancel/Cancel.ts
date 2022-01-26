export class Cancel {
  message?: string
  constructor(message?: string) {
    this.message = message
  }
}

// 创建好Cancel类之后，我们还应该创建一个isCancel函数，该函数用来判断异常对象是不是取消原因对象，返回true或false
export function isCancel(value: any): boolean {
  return value instanceof Cancel
}
