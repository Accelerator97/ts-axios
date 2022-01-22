import { deepMerge, isPlainObject } from "../helpers/util";
import { AxiosRequestConfig } from "../types";

const strats = Object.create(null)

//合并策略
//1.优先获取配置2相应字段的值，如果配置2相应字段没有值，则用配置1相应字段的值
function defaultStrat(val1: any, val2: any): any {
    return typeof val2 !== 'undefined' ? val2 : val1
}

//2.只获取配置2相应字段的值
function fromVal2Strat(val1: any, val2: any): any {
    if (typeof val2 !== 'undefined') {
        return val2
    }
}

//3.深度合并策略，例如headers
function deepMergeStrat(val1:any,val2:any):any{
    if(isPlainObject(val2)){ //情况1：val2存在并且是一个普通对象
        return deepMerge(val1,val2) 
    }else if(typeof val2 !== 'undefined'){ //情况2:val存在但不是普通对象
        return val2
    }else if(isPlainObject(val1)){ //情况3：val2不存在并且val1是一个普通对象
        return deepMerge(val1)
    }else if(typeof val1 !== 'undefined'){ //情况4：val2不存在并且val1不是一个普通对象
        return val1
    }

}

const stratKeysFromVal2 = ['url', 'params', 'data']
stratKeysFromVal2.forEach(key => {
    strats[key] = fromVal2Strat //上述字段的合并策略直接指向fromVal2Strat策略
})

const stratKeysDeepMerge = ['headers','auth']
stratKeysDeepMerge.forEach(key=>{
    strats[key] = deepMergeStrat
})

export default function mergeConfig(
    config1: AxiosRequestConfig,
    config2: AxiosRequestConfig
): any {
    if (!config2) {
        config2 = {}
    }

    const config = Object.create(null)

    //先对config2进行合并
    for (let key in config2) {
        mergeFiled(key)
    }
    //再对config1进行合并
    for (let key in config1) {
        //判断字段没有在config2出现过
        if (!config2[key]) {
            mergeFiled(key)
        }
    }

    function mergeFiled(key: string): void {
        //不同字段对应不同的合并策略函数
        const strat = strats[key] || defaultStrat
        config[key] = strat(config1[key], config2[key])
    }
    return config
}

