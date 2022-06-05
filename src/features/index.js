import categoryReducer, {
  categoryActions,
} from './feature-category/reducers/category.reducer';
import todoReducer from './feature-todo/reducers/todo.reducer';
import * as todoService from './feature-todo/services/todo.service';
import * as categoryService from './feature-category/services/category.service';
import * as accountService from './feature-account/services/account.service';
import * as settingService from './feature-setting/services/setting.service';
import accountReducer, {
  accountActions,
} from './feature-account/reducers/account.reducer';
import settingReducer, {
  settingActions,
} from './feature-setting/reducers/setting.reducer';

export const actions = {
  ...accountActions,
  ...categoryActions,
  ...settingActions,
};

export const reducers = {
  categories: categoryReducer,
  accounts: accountReducer,
  todos: todoReducer,
  settings: settingReducer,
};

export const services = [
  todoService,
  categoryService,
  accountService,
  settingService,
];
