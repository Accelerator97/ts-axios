const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())

const router = express.Router()

const cors = {
  'Access-Control-Allow-Origin': 'http://localhost:8085',
  'Access-Control-Allow-Credentials': true,
  'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
}

//此处切记一定要配置两个路由接口，除了post还有加一个options，这是因为cors跨域对于非简单请求浏览器会先发送一个options类型的请求来预检请求
router.post('/more/server2', (req, res) => {
  res.set(cors)
  res.json(req.cookies)
})

router.options('/more/server2', (req, res) => {
  res.set(cors)
  res.end()
})


app.use(router)

const port = 8088
module.exports = app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}, Ctrl+C to stop`)
})
