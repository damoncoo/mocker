const { mockServerClient } = require('mockserver-client');

mockServerClient('localhost', 1080)
  .reset()
  .then(
    () => {
      console.log('reset all state');
    },
    (error) => {
      console.log(error);
    },
  );
