import axios from "../../src/axios";

axios.post("/more/post", {
    a:1
},{
   auth:{
     username: 'NLRX',
     password: '123456'
   }
  })
  .then(res => {
    console.log(res);
  });
