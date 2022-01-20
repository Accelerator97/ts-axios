import axios from '../../src/index'


//对url参数进行拼接
axios({
    method: 'get',
    url: '/base/get',
    params: {
        foo: ['bar', 'baz']
    }
})

axios({
    method: 'get',
    url: '/base/get',
    params: {
        foo: {
            bar: 'baz'
        }
    }
})

const date = new Date()

axios({
    method: 'get',
    url: '/base/get',
    params: {
        date
    }
})

axios({
    method: 'get',
    url: '/base/get',
    params: {
        foo: '@:$, '
    }
})

axios({
    method: 'get',
    url: '/base/get',
    params: {
        foo: 'bar',
        baz: null
    }
})

axios({
    method: 'get',
    url: '/base/get#hash',
    params: {
        foo: 'bar'
    }
})

axios({
    method: 'get',
    url: '/base/get?foo=bar',
    params: {
        bar: 'baz'
    }
})


//对data参数进行处理，普通对象转为JSON字符串
axios({
    method: 'post',
    url: '/base/post',
    data: {
        a: 1,
        b: 2
    }
})

const arr = new Int32Array([21, 31])

//Int32Array类型的数据可以直接传给XMLHttpRequest对象的send方法
axios({
    method: 'post',
    url: '/base/buffer',
    data: arr
})