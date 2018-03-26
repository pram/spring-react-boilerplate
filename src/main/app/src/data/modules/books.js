// @flow
import axios from 'axios';
import type { Thunk } from '../';
import * as Names from "../../constants/names";

export type Book = { id: number, name: string, price: number };
export type BookAddRequest = { name: string, price: number};

type State = {
    status: 'stale' | 'loaded',
    data: Book[]
}

type BooksRefreshedAction = {
    type: 'BOOKS_REFRESHED',
    books: Book[]
}

type Action = BooksRefreshedAction;

const defaultState: State = {
    status: 'stale',
    data: []
};

export default function reducer(state : State = defaultState, action : Action) : State {
    switch (action.type) {

        case 'BOOKS_REFRESHED':
            return {
                status: 'loaded',
                data: action.books
            };

        default:
            return state;
    }
}

export function booksRefreshed(books: Book[]) : BooksRefreshedAction {
    return {
        type: 'BOOKS_REFRESHED',
        books
    };
}

export function refreshBooks() : Thunk<BooksRefreshedAction> {

    // $FlowFixMe Flow complaining about the localstorage being null
    let headerToken = `Bearer ${localStorage.getItem(Names.JWT_TOKEN)}`;

    return dispatch => {
        axios.get(`/api/allbooks`,{
            headers: {authorization: headerToken}
        })
            .then(
                success => dispatch(booksRefreshed(success.data)),
                failure => console.log(failure)
            );
    };
}

export function requestBookAdd(bookAddRequest: BookAddRequest) : Thunk<BooksRefreshedAction> {

    // $FlowFixMe Flow complaining about the localstorage being null
    let headerToken = `Bearer ${localStorage.getItem(Names.JWT_TOKEN)}`;

    return dispatch => {
        axios.post('/api/addbook', bookAddRequest,{
            headers: {authorization: headerToken}
        })
            .then(
                success => dispatch(booksRefreshed(success.data)),
                failure => console.log(failure)
            );
    };
}