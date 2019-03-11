import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import createBrowserHistory from 'history/createBrowserHistory';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import ReduxActionsPromise from 'redux-actions-promise';

import rootReducers from './reducers';

let browserHistory = createBrowserHistory();
const middleware = routerMiddleware(browserHistory);
const loggerMiddleware = createLogger();

export const store = createStore(combineReducers({
  ...rootReducers,
  router: routerReducer
}), applyMiddleware(
  middleware,
  ReduxActionsPromise,
  thunkMiddleware, // lets us dispatch() functions
  loggerMiddleware // neat middleware that logs actions
));

export const history = browserHistory;
