const stringToArray = (string) =>
    new Array(string.length).fill(null).map((_, index) => string[index]);

export default stringToArray;