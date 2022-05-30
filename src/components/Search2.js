import React, { Component } from 'react';
import dataReducer, {
    dataReducer_search_failure,
    dataReducer_search_start, dataReducer_search_success,
    set_dataReducer_param_failure, set_dataReducer_param_search,
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

        // Запускаем epic
        this.props.dataReducer_search_start(event.target.value);
    }

    componentDidMount() {
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
//        console.log('componentDidUpdate');
    }

    componentWillUnmount() {
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
                            <div className="cssload-zenith" />
                        </div>
                    </div>
                </>
            );

        if (this.state.text === '')
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

        dataReducer_search_start: (text_search) => dispatch(
            dataReducer_search_start(
                set_dataReducer_param_search(text_search)
            )
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
