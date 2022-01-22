import axios, { AxiosTransformer } from '../../src/index'

// axios.defaults.headers.common['test2'] = 123

// axios({
//     url: '/config/post',
//     method: 'post',
//     data: JSON.stringify({
//         a: 1
//     }),
//     headers: {
//         test: '321'
//     }
// }).then((res) => {
//     console.log(res.data)
// })

//在执行它默认的 transformRequest 之前，我们先用 JSON.tringify 对传入的数据 data 做了一层转换。
//同时也对 transformResponse 做了修改，在执行完默认的 transformResponse 后，会给响应的 data 对象添加一个 data.b = 2

// axios({
//     transformRequest: [function (data) {
//         return JSON.stringify(data)
//     }, ...(axios.defaults.transformRequest as AxiosTransformer[])],
//     transformResponse: [...(axios.defaults.transformResponse as AxiosTransformer[]), function (data) {
//         if (typeof data === 'object') {
//             data.b = 2
//         }
//         return data
//     }],
//     url: '/config/post',
//     method: 'post',
//     data: {
//         a: 1
//     }
// }).then((res) => {
//     console.log(res.data)
// })


//axios.create创造一个新的axios实例
const instance = axios.create({
    transformRequest: [(function (data) {
        return JSON.stringify(data)
    }), ...(axios.defaults.transformRequest as AxiosTransformer[])],
    transformResponse: [...(axios.defaults.transformResponse as AxiosTransformer[]), function (data) {
        if (typeof data === 'object') {
            data.b = 2
        }
        return data
    }]
})

instance({
    url: '/config/post',
    method: 'post',
    data: {
        a: 1
    }
}).then((res) => {
    console.log(res.data)
})