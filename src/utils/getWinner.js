const geWinner = (state) => {
    if(!state.game.game) {
        return null;
    }

    if(!state.game.game.won) {
        return null;
    }

    return state.game.game.won;

};

export default geWinner;