import {ofType} from 'redux-observable';
import {of} from 'rxjs';
import {ajax} from 'rxjs/ajax';
import {map, filter, debounceTime, switchMap, catchError} from 'rxjs/operators';
import {
    dataReducer_search_failure,
    dataReducer_search_start,
    dataReducer_search_success,
    set_dataReducer_param_failure,
    set_dataReducer_param_success
} from "../store/dataReducer";


// Выполнение поиска
// Запуск dispatch(dataReducer_search_start(set_dataReducer_param_search(text_search)))
export const searchEpic = (action$, state$) => action$.pipe(
    ofType(dataReducer_search_start),      //    ofType('data/dataReducer_search_start'),

    map(o => {
        console.log('epic-1-1', {o});
        return o.payload.search.trim();
    }),
//            filter(o => o.trim().length > 2),       // фильтруем значения
    debounceTime(100),                  // значение генерируется не чаще 1 раза в 100 мс

    map(o => {
        console.log('epic-1-2', {o});
        return new URLSearchParams({q: o});
    }),      // подготавливаем параметры в http запросе

    switchMap(o => ajax.getJSON(process.env.REACT_APP_API_URL + '?' + o).pipe(        // запускаем новый поток
//                retry(3),                                  // 3 попытки выполнить запрос
        map(o => o.map(v => v.name)),       // Возвращаем не весь объект, а только одно поле
        map(o => {
            console.log('epic-1-3', {o});
            return dataReducer_search_success(
                set_dataReducer_param_success(o)
            );
        }),
        catchError(ex => {
            of(console.log('error_handler', {ex}, ex.status, ex.request.url));
            return of(dataReducer_search_failure(
                set_dataReducer_param_failure(ex.message))
            );
        }),
    )),

);
