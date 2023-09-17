const express = require('express')
const request = require('request')

const app = express()
const ProxyAgent = require('proxy-agent')

function startProxy(realServerUrl, proxy) {
  process.env.http_proxy = proxy
  process.env.https_proxy = proxy

  app.all('*', (req, res) => {
    const { originalUrl } = req
    const prequest = request(realServerUrl + originalUrl)
    req.pipe(prequest, {
      agent: new ProxyAgent.ProxyAgent(),
      followAllRedirects: true,
    }).pipe(res)
  })
  const port = 1081
  app.listen(port, () => {
    console.log(`Web server is running on port ${port}`)
  })
}

module.exports.startProxy = startProxy
