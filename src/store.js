import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

import ticker from './reducers/ticker';

const reducers = combineReducers({
  ticker,
});

const middlewares = applyMiddleware(
  thunk,
  logger,
);

const store = createStore(reducers, undefined, middlewares);

export default store;
