const getOpponent = (state) => {
    if(!state.game.opponent) {
        return null;
    }

    return state.players[state.game.opponent.player_id];
};

export default getOpponent;