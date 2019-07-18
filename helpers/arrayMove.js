/**
 * Moves the item to the new position in the array. Useful for huge arrays where absolute performance is needed.
 * @param {array} array List of items
 * @param {number} from Index of item to move. If negative, it will begin that many elements from the end.
 * @param {number} to Index of where to move the item. If negative, it will begin that many elements from the end.
 */
export const arrayMoveMutate = (array, from, to) => {
    array.splice(to < 0 ? array.length + to : to, 0, array.splice(from, 1)[0]);
};

/**
 * Returns a new array with the item moved to the new position.
 * @param {Array} array List of items
 * @param {number} from Index of item to move. If negative, it will begin that many elements from the end.
 * @param {number} to Index of where to move the item. If negative, it will begin that many elements from the end.
 * @return {Array} New array with the item moved to the new position
 */
export const arrayMove = (array, from, to) => {
    array = array.slice();
    arrayMoveMutate(array, from, to);
    return array;
};
