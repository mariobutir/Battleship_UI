import _ from 'lodash';
import produce from 'immer';
import {FETCH_PLAYER_GAME_LIST, FETCH_PLAYERS, FETCH_PLAYER} from "../actions";

const initalState = {};

const reducerPlayer = produce(
    (state, action) => {
        switch (action.type) {
            case FETCH_PLAYERS:
                return _.mapKeys(action.payload.data.players, 'id');
            case FETCH_PLAYER_GAME_LIST:
                state[action.meta].games = action.payload.data.games;
                return;
            case FETCH_PLAYER:
                state[action.meta] = action.payload.data;
                return;
        }
    }, initalState
);

export default reducerPlayer;