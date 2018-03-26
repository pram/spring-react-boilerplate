// @flow
import axios from 'axios';
import type {Thunk} from '../';

import jwt_decode from 'jwt-decode';

import * as Names from '../../constants/names';

import {socketsConnect, socketsDisconnect} from '../../middleware/socketActions';

export type Role =
    'ROLE_ADMIN'
    | 'ROLE_USER'
    | 'ROLE_ANONYMOUS';

export type AuthState = {
    signedIn: boolean,
    username: string,
    roles: Role[],
    authFailure: boolean
};

type AuthenticatedAction = {
    type: 'AUTHENTICATED' | 'AUTHENTICATION_FAILURE',
    payload: { username: string, roles: Role[] }
};

type LogoutAction = {
    type: 'LOGGED_OUT'
};

type Action = AuthenticatedAction | LogoutAction;

const defaultState = {
    signedIn: false,
    username: '',
    roles: ['ROLE_ANONYMOUS'],
    authFailure: false
};

export default function reducer(state: AuthState = defaultState, action: Action): AuthState {
    switch (action.type) {
        case 'AUTHENTICATED':
            return {
                signedIn: true,
                username: action.payload.username,
                roles: action.payload.roles,
                authFailure: false
            };

        case 'AUTHENTICATION_FAILURE':
            return {
                signedIn: false,
                username: '',
                roles: [],
                authFailure: true
            };

        case 'LOGGED_OUT':
            return defaultState;

        default:
            return state;
    }
}

export function authenticated(authData: AuthState): AuthenticatedAction {
    return {
        type: 'AUTHENTICATED',
        payload: authData
    };
}

export function authenticationFailure(): AuthenticatedAction {
    return {
        type: 'AUTHENTICATION_FAILURE',
        payload: {signedIn: false, username: '', roles: [], authFailure: true}
    };
}

export function login(username: string, password: string): Thunk<AuthenticatedAction> {
    return dispatch => {
        const credentials = {username, password};
        axios.post(`/auth`, credentials)
            .then(
                success => {
                    let authorization = success.data.token;
                    localStorage.setItem(Names.JWT_TOKEN, authorization);

                    let token = jwt_decode(authorization);
                    dispatch(authenticated({
                        signedIn: true,
                        username: token.username,
                        roles: token.roles,
                        authFailure: false
                    }));

                    //Trigger a call to a private route and the authorization token should get cached
                    // $FlowFixMe Flow complaining about the localstorage being null
                    let headerToken = `Bearer ${localStorage.getItem(Names.JWT_TOKEN)}`;
                    dispatch(socketsConnect());
                    axios.get(`/api/validate/${token.sub}`, {
                        headers: {authorization: headerToken}
                    });


                },
                failure => {
                    dispatch(authenticationFailure());
                }
            );
    };
}

export function loggedOut(): LogoutAction {
    return {
        type: 'LOGGED_OUT'
    };
}

export function logout(): Thunk<LogoutAction> {
    return dispatch => {
        axios.post('/api/signout')
            .then(
                () => {
                    localStorage.removeItem(Names.JWT_TOKEN);
                    dispatch(loggedOut());
                    dispatch(socketsDisconnect());
                },
                failure => console.error(`Failed to log out successfully: ${failure}`)
            )
    };
}
