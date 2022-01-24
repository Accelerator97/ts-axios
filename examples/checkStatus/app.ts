//自定义状态码合法校验
import axios from "../../src/axios";
import { AxiosError } from "../../src/types";

axios.get('/more/304').then(res => {
    console.log(res)
}).catch((e: AxiosError) => {
    console.log(e.message)
})

axios.get('/more/304', {
    validateStatus(status) {
        return status >= 200 && status < 400
    }
}).then(res => {
    console.log(res)
}).catch((e: AxiosError) => {
    console.log(e.message)
})


