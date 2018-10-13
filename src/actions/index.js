import axios from 'axios';

export const FETCH_PLAYERS = 'fetch_players';
export const CREATE_PLAYER = 'create_player';
export const FETCH_PLAYER_GAME_LIST = 'fetch_playerGameList';
export const FETCH_GAME = 'fetch_game';
export const FETCH_PLAYER = 'fetch_player';
export const SHOT_SALVO = 'shot_salvo';
export const CHALLENGE_PLAYER = 'challenge_player';
export const AUTOPILOT = 'autopilot';
export const AUTOPILOT_OFF = 'autopilot_off';
export const FIRING_SHOT = 'firing_shot';
export const FINISHED_SHOT = 'finished_shot';

const ROOT_URL = process.env.REACT_APP_API_URL;

export function fetchPlayers() {
    return dispatch => {
        axios.get(`${ROOT_URL}/player/list`)
            .then(result => {
                dispatch({
                    type: FETCH_PLAYERS,
                    payload: result
                });
            });
    };
}

export function createPlayer(values, callback) {
    return dispatch => {
        axios.post(`${ROOT_URL}/player`, values)
            .then(result => {
                dispatch({
                    type: CREATE_PLAYER,
                    payload: result
                });
                callback();
            });
    };
}

export function fetchPlayerGameList(playerId) {
    return dispatch => {
        axios.get(`${ROOT_URL}/player/${playerId}/game/list`)
            .then(result => {
                dispatch({
                    type: FETCH_PLAYER_GAME_LIST,
                    payload: result,
                    meta: playerId
                });
            });
    }
}

export function fetchGame(playerId, gameId) {
    return dispatch => {
        axios.get(`${ROOT_URL}/player/${playerId}/game/${gameId}`)
            .then(result => {
                dispatch({
                    type: FETCH_GAME,
                    payload: result.data,
                    meta: {playerId, gameId}
                });
            });
    }
}

export function fetchPlayer(playerId) {
    return dispatch => {
        axios.get(`${ROOT_URL}/player/${playerId}`)
            .then(result => {
                dispatch({
                    type: FETCH_PLAYER,
                    payload: result,
                    meta: playerId
                });
            });
    }
}

export function shotSalvo(playerId, opponentId, gameId, values, callback) {
    return dispatch => {
        dispatch({
            type: FIRING_SHOT
        });
        axios.put(`${ROOT_URL}/player/${playerId}/game/${gameId}`, values)
            .then(result => {
                dispatch({
                    type: SHOT_SALVO,
                    payload: result
                });
                dispatch({
                    type: FINISHED_SHOT
                });
            })
            .catch(() => {
                    callback(playerId, gameId);
                }
            );
    };
}

export function challengePlayer(opponentId, values, historyPush) {
    return dispatch => {
        axios.post(`${ROOT_URL}/player/${opponentId}/game`, values)
            .then(result => {
                dispatch({
                    type: CHALLENGE_PLAYER,
                    payload: result
                });
                historyPush(`/game/${result.data.game_id}/turn/${result.data.starting}`);
            });
    }
}

export function turnOnAutopilot(playerId, gameId) {
    return dispatch => {
        axios.put(`${ROOT_URL}/player/${playerId}/game/${gameId}/autopilot`)
            .then( () => {
                dispatch({
                    type: AUTOPILOT,
                    meta: {playerId, gameId}
                });
            });
    }
}

export function turnOffAutopilot(playerId, gameId) {
    return dispatch => {
        axios.put(`${ROOT_URL}/player/${playerId}/game/${gameId}/autopilot/off`)
            .then( () => {
                dispatch({
                    type: AUTOPILOT_OFF,
                    meta: {playerId, gameId}
                });
            });
    }
}

export function updateGame(gameStatus, gameId) {
    return dispatch => {
        console.log('update game action');
        dispatch({
            type: FETCH_GAME,
            payload: gameStatus,
            meta: {playerId: gameStatus.self.player_id, gameId: gameId}
        });
    }
}