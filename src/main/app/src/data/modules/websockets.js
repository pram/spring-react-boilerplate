/* @flow */
import * as types from '../../middleware/actionTypes';
import { SOCKETS_MESSAGE_RECEIVE } from "../../middleware/actionTypes";

export type SocketState = { loaded: boolean, message: string, connected: boolean };

const initState = {
    loaded: false,
    message: 'Just created',
    connected: false
};

export default (state: SocketState = initState, action: types) => {
    switch (action.type) {
        case types.SOCKETS_CONNECTING:
            return Object.assign({}, state, {
                loaded: true,
                message: 'Connecting...',
                connected: false

            });
        case types.SOCKETS_CONNECTED:
            return Object.assign({}, state, {
                loaded: true,
                message: 'Connected',
                connected: true
            });
        case types.SOCKETS_DISCONNECTING:
            return Object.assign({}, state, {
                loaded: true,
                message: 'Disconnecting...',
                connected: true
            });
        case types.SOCKETS_DISCONNECTED:
            return Object.assign({}, state, {
                loaded: true,
                message: 'Disconnected',
                connected: false
            });
        case types.SOCKETS_MESSAGE_SENDING:
            return Object.assign({}, state, {
                loaded: true,
                message: action.messageSend,
                connected: true
            });
        case types.SOCKETS_MESSAGE_RECEIVING:
            return Object.assign({}, state, {
                loaded: true,
                message: action.messageReceive,
                connected: true
            });
        default:
            return state;
    }
}
