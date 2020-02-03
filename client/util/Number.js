/**
 * Used bitwise | operator for parsing to 32-bit integer
 * @param {Number} val numerical Value to convert
 */
export function parse32Int(val) {
    return val | 0;
}

export function parseToDollar(val) {
    return '$' + Number(val).toFixed(2);
}