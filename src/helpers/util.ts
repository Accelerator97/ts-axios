const toString = Object.prototype.toString

//val is Date 是自定义的类型保护：类型谓词，会在运行时检查以确保在某个作用域里的类型
//告诉 TS 编译器，如果上述逻辑语句的返回结果是 true，那么当前判断的 vehicle 变量值的类型是 Car 类型。
export function isDate(val:any):val is Date {
   return  toString.call(val) === '[object Date]'
}

export function isObject(val:any):val is Object {
    return val !== null && typeof val === 'object'
}

export function isPlainObject(val:any):val is Object{
    return toString.call(val) === '[object Object]'
}
