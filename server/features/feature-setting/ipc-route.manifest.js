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
      name: 'upsert-setting',
      handler: require('./routes/upsert-setting'),
    },
    {
      name: 'get-setting',
      handler: require('./routes/get-setting'),
    },
  ],
};
