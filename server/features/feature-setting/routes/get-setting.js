const sqlite = require('../../../services/sqlite');

// NOTE: IMPORTANT! always name the route method with method.
// Because it is used inside init function.

const method = async (keys) => {
  const SettingModel = sqlite.getModel('Setting');
  const result = await SettingModel.handleGetSetting(keys);
  return result;
};

module.exports = {
  method,
};
