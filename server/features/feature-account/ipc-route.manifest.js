/* eslint-disable global-require */
/*
    EXPORT FEATURE IPC ROUTES HERE
*/

module.exports = {
  /*
      SETUP FEATURE IPC ENDPOINTS
  */

  routes: [
    {
      name: 'add-accounts',
      handler: require('./routes/add-accounts'),
    },
    {
      name: 'get-accounts',
      handler: require('./routes/get-accounts'),
    },
  ],
};
