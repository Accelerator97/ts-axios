import axios from '../../src/axios'
import { AxiosRequestConfig } from '../../src/types'

const instance = axios.create({
    baseURL: 'http://192.168.1.106:8085/'
})

instance.get('/baseURL/get')

instance.get('http://192.168.1.106:8085/baseURL/get')

// const instance3 = axios.create({
//     baseURL: 'https://img.mukewang.com/'
// })

// instance3.get('5cc01a7b0001a33718720632.gif')
// instance3.get('https://img.mukewang.com/szimg/5becd5ad0001b89306000338-360-202.jpg')

const fakeConfig: AxiosRequestConfig = {
    baseURL: 'https://www.baidu.com/',
    url: '/user/12345',
    params: {
        idClient: 1,
        idTest: 2,
        testString: 'thisIsATest'
    }
}

console.log(axios.getUri(fakeConfig) === 'https://www.baidu.com/user/12345?idClient=1&idTest=2&testString=thisIsATest')