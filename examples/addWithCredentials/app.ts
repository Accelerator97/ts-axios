import axios from '../../src/index'
document.cookie = 'a = 998989898'

/*
 对于同域请求，会携带 cookie，而对于跨域请求，只有我们配置了 withCredentials 为 true，才会携带 cookie
 */
axios.get('/more/get').then(res => {
  console.log(res)
})

axios.post('http://127.0.0.1:8088/more/server2', {}, {
  withCredentials: true
}).then(res => {
  console.log(res)
})