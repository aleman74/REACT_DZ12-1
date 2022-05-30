import dataReducer from './dataReducer';
import {configureStore} from '@reduxjs/toolkit';
import {combineEpics, createEpicMiddleware} from 'redux-observable';
import {searchEpic} from "../epics/epic";


const epicMiddleware = createEpicMiddleware();

export const rootEpic = combineEpics(
    searchEpic,
);

// Конфигурируем Store
const store = configureStore({
    reducer: {
        dataReducer           // dataReducer: dataReducer
    },
    middleware: [epicMiddleware]
});

epicMiddleware.run(rootEpic);

export default store;
