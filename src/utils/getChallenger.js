const getChallenger = (state) => {
    if(!state.game.self) {
        return null;
    }

    return state.players[state.game.self.player_id];
};

export default getChallenger;