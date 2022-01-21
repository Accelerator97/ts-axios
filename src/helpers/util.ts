const toString = Object.prototype.toString

//val is Date 是自定义的类型保护：类型谓词，会在运行时检查以确保在某个作用域里的类型
//告诉 TS 编译器，如果上述逻辑语句的返回结果是 true，那么当前判断的 vehicle 变量值的类型是 Car 类型。
export function isDate(val: any): val is Date {
    return toString.call(val) === '[object Date]'
}

export function isObject(val: any): val is Object {
    return val !== null && typeof val === 'object'
}

export function isPlainObject(val: any): val is Object {
    return toString.call(val) === '[object Object]'
}

//extend 的最终目的是把 from 里的属性都扩展到 to 中，包括原型上的属性。
export function extend<T, U>(to: T, from: U): T & U {
    //遍历from上的所有属性
    for (const key in from) {
        ; (to as T & U)[key] = from[key] as any
    }
    return to as T & U
}

//普通对象的深拷贝和合并，支持传入多个参数
//但是深拷贝的对象result[key] args[0].key会被args[1].key结果覆盖掉
export function deepMerge(...args: any[]): any {
    let result = Object.create(null)
    args.forEach(arg => {
        if (arg) {
            //Object.keys只遍历自身上的属性或者方法
            Object.keys(arg).forEach(key => {
                const val = arg[key]
                if (isPlainObject(val)) { //情况1：如果val是对象，进行递归
                    if (isPlainObject(result[key])) {    //递归之前，判断result[key]是否为对象再进行赋值（因为支持多个参数传递）
                        result[key] = deepMerge(result[key], val)
                    } else {
                        result[key] = deepMerge({}, val)
                    }
                } else { //情况2：如果val不是对象
                    result[key] = val
                }
            })
        }
    })
    return result
}