const getAttackersRemainingShips = (state) => {
    if(!state.game.self) {
        return null;
    }

    return state.game.self.remaining_ships;
};

export default getAttackersRemainingShips;