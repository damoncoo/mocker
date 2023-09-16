const fs = require('fs');

function createHttpRequest(request) {
  return {
    method: request.method || 'GET',
    path: request.path,
    headers: request.headers || {},
  };
}

function createHttpResponse(response) {
  if (!response) {
    return {};
  }
  return {
    statusCode: response.statusCode || 200,
    headers: response.headers || {},
    body: response.body.type === 'file' ? fs.readFileSync(response.body.value, 'utf8') : response.body.value,
  };
}

function convertToMockServerExpectation(config) {
  if (!config) {
    throw new Error('Please specify "rules" in your config');
  }

  let rules = config.expectations.map((expectation) => {
    const request = expectation.request || {};
    const response = expectation.response || {};
    const rule = {
      httpRequest: createHttpRequest(request),
      httpResponse: createHttpResponse(response),
      times: { unlimited: true },
    };
    return rule;
  });
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
    }];
  }
  return rules;
}

module.exports.convertToMockServerExpectation = convertToMockServerExpectation;
