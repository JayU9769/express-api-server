"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "capitalize", {
    enumerable: true,
    get: function() {
        return capitalize;
    }
});
const capitalize = (text)=>{
    if (text) {
        return text[0].toUpperCase() + text.slice(1);
    }
    return text;
};

//# sourceMappingURL=helper.js.map