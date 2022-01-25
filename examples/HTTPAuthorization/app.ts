import axios from "../../src/axios";

axios.post("/more/post", {
  a: 1
}, {
  auth: {
    username: 'Aladdin',
    password: 'open sesame'
  }
})
  .then(res => {
    console.log(res);
  });
