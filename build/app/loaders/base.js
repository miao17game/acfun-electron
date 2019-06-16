"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var metadata_1 = require("../metadata");
var REGISTERS = Symbol.for("@registers");
var DefaultEventLoader = /** @class */ (function () {
    function DefaultEventLoader(ipcMain) {
        var _this = this;
        this.ipcMain = ipcMain;
        this.descriptors = {};
        this.descriptors = Object.getOwnPropertyDescriptors(this);
        var prototype = Object.getPrototypeOf(this);
        var _a = REGISTERS, _b = prototype[_a], registers = _b === void 0 ? {} : _b;
        Object.keys(registers).forEach(function (methodName) {
            var key = registers[methodName].value;
            _this.register(key, methodName);
        });
    }
    DefaultEventLoader.prototype.checkProtoMethod = function (target) {
        var _this = this;
        return Object.keys(this.descriptors).findIndex(function (name) { return _this.descriptors[name].value === target; });
    };
    DefaultEventLoader.prototype.register = function (key, action, _a) {
        var _this = this;
        var _b = (_a === void 0 ? {} : _a).sync, sync = _b === void 0 ? false : _b;
        var method = sync ? "sendSync" : "send";
        var actions = typeof action === "string" ? this[action] : action;
        if (this.checkProtoMethod(actions))
            actions = actions.bind(this);
        this.ipcMain.on(key, function (event, args) {
            if (args === void 0) { args = {}; }
            return __awaiter(_this, void 0, void 0, function () {
                var result, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, actions(args, event)];
                        case 1:
                            result = _a.sent();
                            if (!result)
                                return [2 /*return*/, event.sender[method](key, true)];
                            event.sender[method](key, result);
                            return [3 /*break*/, 3];
                        case 2:
                            error_1 = _a.sent();
                            event.sender[method](key, createDefaultError(error_1));
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        });
        return this;
    };
    return DefaultEventLoader;
}());
exports.DefaultEventLoader = DefaultEventLoader;
function Contract(register) {
    return function register_contract(prototype, propertyKey) {
        var proto = prototype;
        var registers = proto[REGISTERS] || (proto[REGISTERS] = {});
        registers[propertyKey] = {
            value: register
        };
    };
}
exports.Contract = Contract;
function createStamp() {
    return new Date().getTime();
}
exports.createStamp = createStamp;
function createUnknownError(error) {
    return new metadata_1.AppError(metadata_1.ErrorCode.Unknown, "unknown error.", __assign({}, error, { msg: error.message, stack: error.stack }));
}
exports.createUnknownError = createUnknownError;
function createDefaultError(error) {
    return new metadata_1.AppError(metadata_1.ErrorCode.Default, "action register error : unexpected error.", __assign({}, error, { msg: error.message, stack: error.stack }));
}
exports.createDefaultError = createDefaultError;
//# sourceMappingURL=base.js.map