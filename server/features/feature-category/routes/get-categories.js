const sqlite = require('../../../services/sqlite');

// NOTE: IMPORTANT! always name the route method with method.
// Because it is used inside init function.

const method = async () => {
  const CategoryModel = sqlite.getModel('Category');
  const result = await CategoryModel.handleGetCategories();
  return result;
};

module.exports = {
  method,
};
