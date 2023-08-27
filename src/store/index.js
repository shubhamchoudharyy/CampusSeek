import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk'; // Correct import
import rootReducer from '../reducers';

const store = createStore(rootReducer, applyMiddleware(thunkMiddleware));

export default store;
