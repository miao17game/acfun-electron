"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ClientEvent;
(function (ClientEvent) {
    /** 改变控制台的显示与隐藏 */
    ClientEvent["DebugMode"] = "CLIENT::DEBUG_MODE_CHANGE";
    /** 获取当前用户home文件夹下子目录的files */
    ClientEvent["FetchFiles"] = "CLIENT::HOME_DIR_FILES_FETCH";
    /** 复制文件到指定文件路径 */
    ClientEvent["CopyFile"] = "CLIENT::COPY_FILE";
    /** 初始化app的指定文件夹作为默认文件夹 */
    ClientEvent["InitAppFolder"] = "CLIENT::INIT_APP_FOLDER";
    /** 获取当前应用的偏好设置 */
    ClientEvent["FetchPreferences"] = "CLIENT::FETCH_PREFERENCES_CONFIG";
    /** 更新当前应用的偏好设置 */
    ClientEvent["UpdatePreferences"] = "CLIENT::UPDATE_PREFERENCE_CONFIG";
})(ClientEvent = exports.ClientEvent || (exports.ClientEvent = {}));
//# sourceMappingURL=events.js.map