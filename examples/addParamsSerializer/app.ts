//自定义参数转义
import axios from '../../src/index'
import qs from 'qs'

//编写了 3 种情况的请求，第一种满足请求的 params 参数是 URLSearchParams 对象类型的。后两种请求的结果主要区别在于前者并没有对 [] 转义，而后者会转义
//情况1：
axios.get('/more/get', {
    params: new URLSearchParams('a=b&c=d')
}).then(res => {
    console.log(res)
})

// //情况2：
// axios.get('/more/get', {
//     params: {
//         a: 1,
//         b: 2,
//         c: ['a', 'b', 'c']
//     }
// }).then(res => {
//     console.log(res)
// })

//情况3：
const instance = axios.create({
    paramsSerializer(params) {
        return qs.stringify(params, { arrayFormat: 'brackets' })
    }
})

instance.get('/more/get', {
    params: {
        a: 1,
        b: 2,
        c: ['a', 'b', 'c']
    }
}).then(res => {
    console.log(res)
})