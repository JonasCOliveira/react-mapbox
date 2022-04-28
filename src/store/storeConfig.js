import { createStore, combineReducers } from 'redux';

import alvosReducer from './reducers/alvos';

const reducers = combineReducers({
    alvos: alvosReducer
});

function storeConfig() {
    return createStore(reducers);
}

export default storeConfig;