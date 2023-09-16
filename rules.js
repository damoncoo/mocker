const fs = require('fs')

function createHttpRequest(request) {
  return {
    method: request.method || 'GET',
    path: request.path,
    headers: request.headers || {},
  }
}

function createHttpResponse(response, headers) {
  if (!response) {
    return {}
  }
  const res = {
    statusCode: response.statusCode || 200,
    headers: Object.assign(response.headers || {}, headers),
    body: response.body.type === 'file' ? fs.readFileSync(response.body.value, 'utf8') : response.body.value,
  }
  if (response.delay) {
    res.delay = {
      timeUnit: 'SECONDS',
      value: response.delay,
    }
  }
  return res
}

function convertToMockServerExpectation(config) {
  let rules = config.expectations.map((expectation) => {
    const request = expectation.request || {}
    const response = expectation.response || {}
    const rule = {
      httpRequest: createHttpRequest(request),
      httpResponse: createHttpResponse(response, config.defaults.headers),
      times: { unlimited: true },
    }
    return rule
  })
  if (config.forward != null) {
    rules = [...rules, {
      httpRequest: {
        path: '.*',
      },
      httpForward: {
        host: config.forward.host,
        port: config.forward.port,
        scheme: config.forward.scheme,
      },
    }]
  }
  return rules
}

module.exports.convertToMockServerExpectation = convertToMockServerExpectation
