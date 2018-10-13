const getPlayerTurn = (state) => {
    if(!state.game.game) {
        return null;
    }

    if(!state.game.game.player_turn) {
        return null;
    }

    return state.game.game.player_turn;

};

export default getPlayerTurn;