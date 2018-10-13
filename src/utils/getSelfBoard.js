import stringToArray from "./stringToArray";

const getSelfBoard = (state) => {
    if(!state.game.self) {
        return [[]];
    }

    return state.game.self.board.map(row => stringToArray(row));
};

export default getSelfBoard;