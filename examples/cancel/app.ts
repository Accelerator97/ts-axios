import axios from "../../src/axios";
import { Canceler } from "../../src/types";

//调用方式2
//1.用户为请求配置了cancelToken属性，该属性的属性值是CancelToken类的实例。
//2.实例化CancelToken类时，会执行类的构造函数，我们为构造函数传入了一个executor函数，该函数接收一个参数，并把这个参数赋给了变量cancel；
//3.在构造函数内部，首先实例化了一个 pending 状态的 Promise 对象，然后用一个 resolvePromise 变量指向 resolve 函数
//4.在构造函数内部，接着执行了传入的 executor 函数，在执行 executor 函数的时候为其传入了一个参数
// let cancel = message => {
//     if (this.reason) {
//         return;
//     }
//     this.reason = message;
//     resolvePromise(this.reason);
// }
//5.执行了executor 函数，该函数会把这个参数赋给变量cancel
//6.变量cancel 就是将来的请求取消触发函数，当外部取消请求时就会调用 cancel 函数，在 cancel 函数内部，会调用 resolvePromise 把 Promise 对象从 pending 状态变为 resolved 状态，也就是说把CancelToken类中的this.promise变成了 resolved 状态
//7.请求配置对象中的cancelToken属性是CancelToken类的实例对象，那么它自然能够访问到类里面的promise属性，当该属性的状态变成resolved 时，表明有人在外面调用了cancel 函数，此时它就通过
//xhr.ts中
//cancelToken.promise.then(reason => {
//     request.abort();
//     reject(reason)
// })
//8.如果没有人调用cancel 函数，那么cancelToken.promise的状态就一直是pendding，就不能调用then方法，就不能取消请求

const CancelToken = axios.CancelToken;
// let cancel: Canceler;

// axios.get("/cancel/get", {
//     cancelToken: new CancelToken(c => {
//       cancel = c;
//     })
//   })
//   .catch(function(e) {
//     console.log(e);
//   });

// setTimeout(() => {
//   cancel("Operation canceled by the user");
// }, 200);


//调用方式1：
// const source = CancelToken.source();

// axios
//   .get("/cancel/get", {
//     cancelToken: source.token
//   })
//   .catch(function(e) {
//     console.log(e);
//   });

// setTimeout(() => {
//   source.cancel("Operation canceled by the user");
// }, 1000);


//该接口接收一个异常对象e作为参数，用来判断该异常是否是由取消请求导致的，如果是的话该异常对象就应该是请求取消的原因
// let cancel1: Canceler
// axios.get("/cancel/get", {
//     cancelToken: new CancelToken(c => {
//         cancel1 = c;
//     })
// })
//     .catch(function (e) {
//         // 新增
//         if (axios.isCancel(e)) {
//             console.log(`请求取消原因：${e.message}`);
//         }
//     });

// setTimeout(() => {
//   cancel1("Operation canceled by the user");
// }, 200);


//如果一个 token 已经被使用过，则再次携带该 token 的请求并不会发送
const source = CancelToken.source()

axios.get('/cancel/get', {
  cancelToken: source.token
}).catch(function (e) {
  if (axios.isCancel(e)) {
    console.log('Request canceled', e.message)
  }
})

setTimeout(() => {
  source.cancel('Operation canceled by the user.')

  axios.get('/cancel/post', { cancelToken: source.token }).catch(function (e) {
    if (axios.isCancel(e)) {
      console.log('Request canceled', e.message)
    }
  })
}, 100)

