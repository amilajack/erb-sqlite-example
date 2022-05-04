const sqlite = require('../../../services/sqlite');

// NOTE: IMPORTANT! always name the route method with method.
// Because it is used inside init function.
const method = async (accounts) => {
  const AccountModel = sqlite.getModel('Account');
  const allAddAccountPromises = accounts.map(account => new Promise(async(resolve, reject) => {
    const result = await AccountModel.handleAddAccount(account);
    resolve(result);
  }));
  const result = await Promise.all(allAddAccountPromises);
  return result;
};

module.exports = {
  method,
};
