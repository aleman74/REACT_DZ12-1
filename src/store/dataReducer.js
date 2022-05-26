import {createSlice} from '@reduxjs/toolkit';


// Структура данных
const initialState = {
    items: [],
    loading: false,
    error: null
};



const dataReducer = createSlice({
    name: 'data',
    initialState,
    reducers: {

        dataReducer_search_start(state, action)
        {
            console.log('dataReducer_search_start', action.payload);
            state = {...state, loading: true, error: null}

            return state;
        },

        dataReducer_search_success (state, action)
        {
            console.log('dataReducer_search_success', action.payload.items);

            let items = [];

            if (action.payload.items)
                items = action.payload.items;

            state = {...state, items: items, loading: false, error: null};

            console.log({state});

            return state;
        },

        dataReducer_search_failure(state, action)
        {
            console.log('dataReducer_search_failure', action.payload);

            const error = action.payload.error;
            state = {...state, loading: false, error: error}

            return state;
        }
    },
});

export const set_dataReducer_param_success = (items) => (
    {items: items}
);
export const set_dataReducer_param_failure = (error) => (
    {error: error}
);
export const { dataReducer_search_start, dataReducer_search_success, dataReducer_search_failure } =  dataReducer.actions;

export default  dataReducer.reducer;

// Value Selector
export const dataReducer_valueSelector = (store) => store.dataReducer;
