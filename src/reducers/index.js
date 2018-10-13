import {combineReducers} from 'redux';
import {reducer as formReducer} from 'redux-form';
import playersReducer from './reducerPlayers';
import reducerGame from "./reducerGame";

const rootReducer = combineReducers({
    players: playersReducer,
    game: reducerGame,
    form: formReducer,
});

export default rootReducer;