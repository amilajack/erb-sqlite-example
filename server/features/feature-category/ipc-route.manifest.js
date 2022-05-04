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
      name: 'add-category',
      handler: require('./routes/add-category'),
    },
    {
      name: 'update-category',
      handler: require('./routes/update-category'),
    },
    {
      name: 'get-categories',
      handler: require('./routes/get-categories'),
    },
  ],
};
