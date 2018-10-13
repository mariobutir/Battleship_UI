import stringToArray from "./stringToArray";

const getOpponentBoard = (state) => {
    if(!state.game.opponent) {
        return [[]];
    }
    return state.game.opponent.board.map(row => stringToArray(row));
};

export default getOpponentBoard;