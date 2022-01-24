import axios from "../../src/axios";

const instacne = axios.create()
const config = {
  baseURL: "https://www.baidu.com/",
  url: "/user/NLRX",
  params: {
    idClient: 1,
    idTest: 2,
    testString: "thisIsATest"
  }
};

console.log(instacne.getUri(config));