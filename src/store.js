import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

import ticker from './reducers/ticker';
import book from './reducers/book';

const reducers = combineReducers({
  ticker,
  book,
});

const middlewares = applyMiddleware(
  thunk,
  logger,
);

const store = createStore(reducers, undefined, middlewares);

export default store;
