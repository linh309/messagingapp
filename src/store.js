import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'connected-react-router';
import thunk from 'redux-thunk';
import createHistory from 'history/createBrowserHistory';
import rootReducer from './modules';

//define then export history to outside of module
export const history = createHistory();

const initialState = {};
const enhancers = [];

//Middleware APIs can intercept requests to execute actions and generate side-effects
const middleware = [
    thunk,
    routerMiddleware(history)
];

//Don't understand => why need to add this
// set up our composeEnhancers function, baed on the existence of the
// DevTools extension when creating the store
//store enhancer
if (process.env.NODE_ENV === 'development') {
    const devToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION_;
    if (typeof devToolsExtension === 'function') {
        enhancers.push(devToolsExtension())
    }
}

const composeEnhancers = compose(
    applyMiddleware(...middleware),
    ...enhancers
);

//create reduxt store will parameters
//configure store to use middleware
const store = createStore (
    rootReducer(history),
    initialState,
    composeEnhancers
);

//export store to the outside of module
export default store;