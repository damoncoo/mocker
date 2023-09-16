const express = require('express')
const request = require('request')
const agent = require('https-proxy-agent')
const url = require('url')

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

const app = express()

app.all('*', (req, res) => {
  const { originalUrl } = req
  const realServerUrl = 'https://imovie.seungyu.cn'
  req.pipe(request(realServerUrl + originalUrl), {
    agent: new agent.HttpsProxyAgent(url.parse('http://localhost:10000')),
    rejectUnauthorized: 0,
  }).pipe(res)
})

module.exports.startProxy = () => {
  const port = 1081
  app.listen(port, () => {
    console.log(`Web server is running on port ${port}`)
  })
}
