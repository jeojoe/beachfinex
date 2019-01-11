import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

import ticker from './reducers/ticker';
import book from './reducers/book';
import trades from './reducers/trades';

const reducers = combineReducers({
  ticker,
  book,
  trades,
});

const middlewares = applyMiddleware(
  thunk,
  logger,
);

const store = createStore(reducers, undefined, middlewares);

export default store;
