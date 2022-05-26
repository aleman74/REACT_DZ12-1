import React, { Component } from 'react';
import dataReducer, {
    dataReducer_search_failure,
    dataReducer_search_start, dataReducer_search_success,
    set_dataReducer_param_failure,
    set_dataReducer_param_success
} from "../store/dataReducer";
import {searchItem} from "../actions/searchItem";
import {connect} from "react-redux";
import { ajax } from 'rxjs/ajax';
import { observable, fromEvent, of } from 'rxjs';
import { map, filter, debounceTime, retry } from 'rxjs/operators';
import { mergeMap, concatMap, exhaustMap, switchMap, catchError } from 'rxjs/operators';


class Search extends Component {

    constructor(props) {
        super(props);

//        console.log({props});

        this.state = {
            text: ''
        };

        // Привязываем функции использующие контекст
        this.onChange = this.onChange.bind(this);

    }

    onChange(event) {
        this.setState({text: event.target.value});

    }

    componentDidMount() {
        // Создаём входящий поток
        const html_item = document.getElementById('my_input');
        this.inputStream$ = fromEvent(html_item, 'input');

        this.subscribe = this.inputStream$.pipe(
            map(o => {                   // на вход html элемент
//                console.log('step 1', {o});
                return o.target.value;
            }),
//            filter(o => o.trim().length > 2),       // фильтруем значения
            debounceTime(100),                  // значение генерируется не чаще 1 раза в 100 мс

            map(o => {
                this.props.dataReducer_search_start();
                return new URLSearchParams({q: o});
            }),      // подготавливаем параметры в http запросе

            switchMap(o => ajax.getJSON(process.env.REACT_APP_API_URL + '?' + o).pipe(        // запускаем новый поток
//                retry(3),                                  // 3 попытки выполнить запрос
                map(o => o.map(v => v.name)),       // Возвращаем не весь объект, а только одно поле
                catchError(ex => {
//                    of(console.log('error_handler', {ex}, ex.status, ex.request.url));
                    return of(this.props.dataReducer_search_failure(ex.message));
                }),
            )),

        ).subscribe({
//            next: value => (value) ? console.log('next', value) : console.log('next', 'none'),
            next: value => {
                // Считаем, что успешный запрос обязательно должен вернуть массив
                if (Array.isArray(value))
                {
                    // Если параметры поиска не заданы, то ничего не показываем
                    if (this.state.text != '')
                        this.props.dataReducer_search_success(value);
                    else
                        this.props.dataReducer_search_success([]);
                }
            },
//            error: error => console.error('error', error),           // Не обработанная ошибка - поток остановился
            error: error => (this.props.dataReducer_search_failure(error)),
            complete: () => console.info('complete')
        });


    }

    componentDidUpdate(prevProps, prevState, snapshot) {
//        console.log('componentDidUpdate');
    }

    componentWillUnmount() {

//        console.log('componentWillUnmount', this.subscribe);
        this.subscribe.unsubscribe();
    }

    render() {

        const { data } = this.props;
//        console.log({data});
//        console.log('render length = ' + data.items.length, data.loading);


        if (data.error)
            return (
                <>
                    <input id="my_input" value={this.state.text} onChange={this.onChange} />
                    <div id="result">
                        <div className="error">Произошла ошибка!</div>
                        <div className="error">{data.error}</div>
                    </div>
                </>
            );

        if (data.loading)
            return (
                <>
                    <input id="my_input" value={this.state.text} onChange={this.onChange} />
                    <div id="result">
                        <div className="cssload-container">
                            <div className="cssload-zenith"></div>
                        </div>
                    </div>
                </>
            );

        if (this.state.text == '')
            return (
                <>
                    <input id="my_input" value={this.state.text} onChange={this.onChange} />
                    <div>Type something to search...</div>
                </>
            );

        return (
            <>
                <input id="my_input" value={this.state.text} onChange={this.onChange} />
                <div id="result">
                    {data.items.map(
                        (item, index) =>
                            <div key={index}>{item}</div>
                    )}
                </div>
            </>
        );

    }
}

// Считываем данные из Reducer в this.props
const mapStateToProps = (state, ownProps)  => {
//    const { dataReducer } = state;
//    const dataReducer = state.dataReducer;
//    return { data: dataReducer };

    return { data: state.dataReducer };
}

// Вызываем асинхронные методы через dispatch, вызовы будут доступны в this.props
const mapDispatchToProps = (dispatch, ownProps)  => {

    return {
        searchItem: (text)  =>
            searchItem(dispatch, text)
        ,

        dataReducer_search_start: () => dispatch(
            dataReducer_search_start()
        ),

        dataReducer_search_success: (data) => dispatch(
            dataReducer_search_success(
                set_dataReducer_param_success(data)
            )
        ),

        dataReducer_search_failure: (error) => dispatch(
            dataReducer_search_failure(
                set_dataReducer_param_failure(error)
            )
        ),

    };
};

export default connect(mapStateToProps, mapDispatchToProps) (Search);
