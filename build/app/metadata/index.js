"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ErrorCode;
(function (ErrorCode) {
    ErrorCode[ErrorCode["Default"] = -1] = "Default";
    ErrorCode[ErrorCode["Unknown"] = 0] = "Unknown";
    ErrorCode[ErrorCode["PreferenceNotFound"] = 1] = "PreferenceNotFound";
    ErrorCode[ErrorCode["FileNotFound"] = 2] = "FileNotFound";
    ErrorCode[ErrorCode["FileAlreadyExist"] = 3] = "FileAlreadyExist";
})(ErrorCode = exports.ErrorCode || (exports.ErrorCode = {}));
var AppError = /** @class */ (function () {
    function AppError(code, message, extras) {
        if (extras === void 0) { extras = {}; }
        this.code = code;
        this.message = message;
        this.extras = extras;
    }
    return AppError;
}());
exports.AppError = AppError;
//# sourceMappingURL=index.js.map