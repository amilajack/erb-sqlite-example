const sqlite = require('../../../services/sqlite');

// NOTE: IMPORTANT! always name the route method with method.
// Because it is used inside init function.
const method = async (setting) => {
  const SettingModel = sqlite.getModel('Setting');
  const result = await SettingModel.handleUpsertSetting(setting);
  return result;
};

module.exports = {
  method,
};
