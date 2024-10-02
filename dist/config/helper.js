"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.capitalize = void 0;
/**
 * Capitalizes the first character of a given string.
 *
 * @param text - The input string that needs to be capitalized.
 * @returns A new string where the first character is capitalized, and the rest of the string remains unchanged.
 *          If the input string is empty or falsy, the function will return it as is.
 */
const capitalize = (text) => {
    // Check if the input string is not empty or falsy
    if (text) {
        // Capitalize the first character of the input string and concatenate with the rest of the string
        return text[0].toUpperCase() + text.slice(1);
    }
    // Return the input string as is if it is empty or falsy
    return text;
};
exports.capitalize = capitalize;
//# sourceMappingURL=helper.js.map