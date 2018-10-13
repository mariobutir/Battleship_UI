import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Redirect, Route, Switch} from 'react-router-dom';
import PlayersIndex from './components/PlayerIndex';
import thunk from 'redux-thunk';
import registerServiceWorker from './registerServiceWorker';
import {Provider} from "react-redux";
import {applyMiddleware, compose, createStore} from "redux";
import reducers from './reducers';
import 'semantic-ui-css/semantic.min.css';
import PlayerNew from "./components/PlayerNew";
import GameIndex from './components/GameIndex';
import ActiveGame from "./components/ActiveGame";
import PlayerChallenger from "./components/PlayerChallenger";

const store = createStore(
    reducers,
    compose(applyMiddleware(thunk))
);

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <div>
                <Switch>
                    <Route path={'/game/:gameId/turn/:playerTurn'} component={ActiveGame} />
                    <Route path={'/game/challenge/:playerId'} component={PlayerChallenger} />
                    <Route path={'/player/:playerId/game/:gameId'} component={GameIndex} />
                    <Route path={'/player/list'} component={PlayersIndex}/>
                    <Route path={'/player'} component={PlayerNew}/>
                    <Route path={'/'} render={() => <Redirect to="/player/list"/>}/>
                </Switch>
            </div>
        </BrowserRouter>
    </Provider>
    , document.getElementById('root'));

registerServiceWorker();
