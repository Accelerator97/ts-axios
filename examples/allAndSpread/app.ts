import axios from "../../src/axios";

function getA() {
    return axios.get('/more/A')
}

function getB() {
    return axios.get('/more/B')
}

axios.all([getA(), getB()])
    .then(axios.spread(function (resA, resB) {
        console.log(resA.data)
        console.log(resB.data)
    }))

axios.all([getA(), getB()])
    .then(([resA, resB]) => {
        console.log(resA.data)
        console.log(resB.data)
    })