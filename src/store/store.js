import dataReducer from './dataReducer';
import {configureStore} from '@reduxjs/toolkit';

// Конфигурируем Store
export default configureStore({
    reducer: {
        dataReducer
    }
});