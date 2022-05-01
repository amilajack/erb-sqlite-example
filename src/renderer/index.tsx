import { reducers } from 'features/feature-todo';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import thunk from 'redux-thunk';
import App from './App';
const store = createStore(combineReducers(reducers), applyMiddleware(thunk));
render(
  <Provider store={store} >
    <App />
  </Provider>,
  document.getElementById('root'));
