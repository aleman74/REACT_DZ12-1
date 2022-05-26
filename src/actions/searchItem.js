import {
    dataReducer_search_failure,
    dataReducer_search_start,
    dataReducer_search_success, set_dataReducer_param_failure,
    set_dataReducer_param_success
} from "../store/dataReducer";


export const searchItem = async (dispatch, text) => {

    dispatch(
        dataReducer_search_start()
    );


    try {

        // Считываем данные только если id указан, иначе возвращаем пустой массив
        let data = [];

        if (text)
        {
            const param = new URLSearchParams({q: text})

            const response = await fetch(
                process.env.REACT_APP_API_URL + '?' + param,
                {
                    method: 'GET',
                    headers: {'Content-Type': 'application/json'}
                }
            );

            if (!response.ok) {
                throw new Error(response.statusText);
            }

            const data = await response.json();
            console.log('searchItem - data', data);
        }

        dispatch(
            dataReducer_search_success(
                set_dataReducer_param_success(data)
            )
        );

    } catch (ex) {
//        console.log('ERROR', ex.message);
        dispatch(
            dataReducer_search_failure(
                set_dataReducer_param_failure(ex.message)
            )
        );
    }
}
