"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var fs = require("fs");
var base_1 = require("./base");
var paths_1 = require("../constants/paths");
var metadata_1 = require("../metadata");
var events_1 = require("../constants/events");
var EventLoader = /** @class */ (function (_super) {
    __extends(EventLoader, _super);
    function EventLoader(win, ipcMain) {
        var _this = _super.call(this, ipcMain) || this;
        _this.win = win;
        return _this;
    }
    EventLoader.prototype.openCloseDevTool = function () {
        var devToolOpened = this.win.webContents.isDevToolsOpened();
        if (devToolOpened) {
            this.win.webContents.closeDevTools();
        }
        else {
            this.win.webContents.openDevTools();
        }
    };
    EventLoader.prototype.readLocalFiles = function (_a) {
        var _b = _a.folderPath, folderPath = _b === void 0 ? undefined : _b, _c = _a.showHideFiles, showHideFiles = _c === void 0 ? false : _c, _d = _a.lazyLoad, lazyLoad = _d === void 0 ? true : _d;
        var folder = connectFolder(folderPath);
        var fies = readFiles({ path: folder, isRoot: true, showHideFiles: showHideFiles, lazyLoad: lazyLoad });
        return {
            files: __assign({}, fies, { loaded: true })
        };
    };
    EventLoader.prototype.copyFile = function (_a) {
        var sourcePath = _a.sourcePath, targetPath = _a.targetPath;
        if (!fs.existsSync(sourcePath)) {
            return new metadata_1.AppError(metadata_1.ErrorCode.FileNotFound, "file is not exist", { path: sourcePath });
        }
        var fileName = path.basename(sourcePath);
        var toCopyPath = path.join(targetPath, fileName);
        return new Promise(function (resolve) {
            fs.readFile(sourcePath, { encoding: "binary" }, function (error, data) {
                if (fs.existsSync(toCopyPath)) {
                    return resolve(new metadata_1.AppError(metadata_1.ErrorCode.FileAlreadyExist, "file is exist", { path: toCopyPath }));
                }
                if (error)
                    return resolve(base_1.createUnknownError(error));
                fs.writeFile(toCopyPath, data, { encoding: "binary" }, function (error) {
                    if (error)
                        return resolve(base_1.createUnknownError(error));
                    resolve(true);
                });
            });
        });
    };
    EventLoader.prototype.initAppFolder = function (_a) {
        var _b = _a.folder, folder = _b === void 0 ? paths_1.ROOT_FOLDER : _b;
        if (fs.existsSync(folder))
            return;
        return new Promise(function (resolve) {
            fs.mkdir(folder, function (error) { return resolve(!error ? true : base_1.createUnknownError(error)); });
        });
    };
    EventLoader.prototype.fetchPreference = function () {
        return tryLoadPreference();
    };
    EventLoader.prototype.updatePreference = function (_a) {
        var _b = _a.configs, configs = _b === void 0 ? {} : _b;
        var _c = tryLoadPreference(), sourceConfs = _c.configs, errors = _c.error;
        if (errors) {
            return errors;
        }
        var preferenceConf = __assign({}, sourceConfs, configs, { updateAt: base_1.createStamp() });
        try {
            fs.appendFileSync(paths_1.PREFERENCE_CONF, JSON.stringify(preferenceConf, null, "  "), { flag: "w+" });
            return true;
        }
        catch (error) {
            return base_1.createUnknownError(error);
        }
    };
    __decorate([
        base_1.Contract(events_1.ClientEvent.DebugMode),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], EventLoader.prototype, "openCloseDevTool", null);
    __decorate([
        base_1.Contract(events_1.ClientEvent.FetchFiles),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], EventLoader.prototype, "readLocalFiles", null);
    __decorate([
        base_1.Contract(events_1.ClientEvent.CopyFile),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], EventLoader.prototype, "copyFile", null);
    __decorate([
        base_1.Contract(events_1.ClientEvent.InitAppFolder),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], EventLoader.prototype, "initAppFolder", null);
    __decorate([
        base_1.Contract(events_1.ClientEvent.FetchPreferences),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], EventLoader.prototype, "fetchPreference", null);
    __decorate([
        base_1.Contract(events_1.ClientEvent.UpdatePreferences),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], EventLoader.prototype, "updatePreference", null);
    return EventLoader;
}(base_1.DefaultEventLoader));
exports.EventLoader = EventLoader;
function connectFolder(folderPath) {
    var p = paths_1.ROOT_FOLDER;
    if (folderPath) {
        if (folderPath.startsWith(paths_1.OS_HOME)) {
            p = folderPath;
        }
        else {
            p = path.join(paths_1.OS_HOME, folderPath);
        }
    }
    return p;
}
function tryLoadPreference(path) {
    if (path === void 0) { path = paths_1.PREFERENCE_CONF; }
    var error;
    var preferenceConf;
    try {
        if (!fs.existsSync(path)) {
            var defaultConfigs = { updateAt: base_1.createStamp() };
            fs.appendFileSync(path, JSON.stringify(defaultConfigs, null, "  "), { flag: "w+" });
            preferenceConf = defaultConfigs;
        }
        else {
            var confStr = fs.readFileSync(path).toString();
            preferenceConf = JSON.parse(confStr);
        }
    }
    catch (_e) {
        if (_e.code === "ENOENT" && _e.errno === -2 && _e.syscall === "open") {
            error = new metadata_1.AppError(metadata_1.ErrorCode.PreferenceNotFound, "preference file not found.", {
                syscall: _e.syscall,
                path: _e.path,
                msg: _e.message,
                stack: _e.stack
            });
        }
        else {
            error = base_1.createUnknownError(error);
        }
    }
    return { configs: preferenceConf, error: error };
}
function readFiles(options) {
    var thisPath = options.path, _a = options.isRoot, isRoot = _a === void 0 ? false : _a, _b = options.lazyLoad, lazyLoad = _b === void 0 ? false : _b, _c = options.showHideFiles, showHideFiles = _c === void 0 ? false : _c;
    var result = {
        loaded: false,
        exist: false,
        path: thisPath,
        files: [],
        folders: []
    };
    if (!fs.existsSync(thisPath)) {
        return result;
    }
    result.exist = true;
    var children = fs.readdirSync(thisPath);
    var finalChilds = (showHideFiles ? children : children.filter(function (i) { return !i.startsWith("."); })).map(function (p) {
        return path.resolve(thisPath, p);
    });
    for (var _i = 0, finalChilds_1 = finalChilds; _i < finalChilds_1.length; _i++) {
        var each = finalChilds_1[_i];
        if (lazyLoad && !isRoot)
            break;
        var status_1 = fs.lstatSync(each);
        if (status_1.isDirectory()) {
            result.folders.push(readFiles(__assign({}, options, { path: each, isRoot: false })));
        }
        else if (status_1.isFile()) {
            result.files.push(each);
        }
        result.loaded = true;
    }
    return result;
}
//# sourceMappingURL=index.js.map