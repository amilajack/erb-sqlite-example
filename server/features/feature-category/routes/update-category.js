const sqlite = require('../../../services/sqlite');

// NOTE: IMPORTANT! always name the route method with method.
// Because it is used inside init function.

const method = async (args) => {
  const CategoryModel = sqlite.getModel('Category');
  const result = await CategoryModel.handleUpdateCategory(args);
  return result;
};

module.exports = {
  method,
};
