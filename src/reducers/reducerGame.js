import {
    AUTOPILOT,
    AUTOPILOT_OFF,
    CHALLENGE_PLAYER,
    FETCH_GAME,
    FINISHED_SHOT,
    FIRING_SHOT,
    SHOT_SALVO
} from "../actions";
import produce from 'immer';
import stringToArray from "../utils/stringToArray";

const initalState = {
    firing: false
};

const reducerGame = produce(
    (state, action) => {
        switch (action.type) {
            case FETCH_GAME:
                return action.payload;

            case FIRING_SHOT:
                state.firing = true;
                return;

            case FINISHED_SHOT:
                state.firing = false;
                return;

            case SHOT_SALVO:
                const { salvo } = action.payload.data;
                const keys = Object.keys(salvo);
                keys.forEach(key => {
                   const cell = key.split('x');
                   cell[1] = cell[1].charCodeAt(0) - 65;

                   const row = state.opponent.board[cell[0]];
                   const rowArray = stringToArray(row);

                   switch (salvo[key]) {
                       case 'MISS':
                           rowArray[cell[1]] = 'O';
                           break;
                       case 'HIT':
                           rowArray[cell[1]] = 'X';
                           break;
                       case 'KILL':
                           rowArray[cell[1]] = 'X';
                           break;
                   }
                   state.opponent.board[cell[0]] = rowArray.join('');
                });
                return;

            case CHALLENGE_PLAYER:
                return action.payload.data;

            case AUTOPILOT:
                if(action.meta.playerId === state.self.player_id){
                    state.self.autopilot = true;
                } else {
                    state.opponent.autopilot = true;
                }
                return;

            case AUTOPILOT_OFF:
                if(action.meta.playerId === state.self.player_id){
                    state.self.autopilot = false;
                } else {
                    state.opponent.autopilot = false;
                }
                return;
        }
    }, initalState
);

export default reducerGame;