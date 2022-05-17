import categoryReducer, { categoryActions } from './feature-category/reducers/category.reducer';
import todoReducer from './feature-todo/reducers/todo.reducer';
import * as todoService from './feature-todo/services/todo.service';
import * as categoryService from './feature-category/services/category.service';
import * as accountService from './feature-account/services/account.service';
import accountReducer, { accountActions } from './feature-account/reducers/account.reducer';

export const actions = {...accountActions, ...categoryActions};

export const reducers = {
  categories: categoryReducer,
  accounts: accountReducer,
  todos: todoReducer,
};

export const services = [todoService, categoryService, accountService];
