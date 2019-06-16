import { IpcMain, BrowserWindow } from "electron";
import { DefaultEventLoader } from "./base";
import { IFilesFetchContext, IFolderStruct as IFileFetchResult, IPreferenceConfig, AppError, ICopyFileOptions, IUpdatePreferenceOptions, IAppFolderInit } from "../metadata";
export declare class EventLoader extends DefaultEventLoader {
    private win;
    constructor(win: BrowserWindow, ipcMain: IpcMain);
    openCloseDevTool(): void;
    readLocalFiles({ folderPath, showHideFiles, lazyLoad }: IFilesFetchContext): {
        files: {
            loaded: boolean;
            exist: boolean;
            path: string;
            files: string[];
            folders: IFileFetchResult[];
        };
    };
    copyFile({ sourcePath, targetPath }: ICopyFileOptions): AppError<{
        path: string;
    }> | Promise<boolean | AppError<any>>;
    initAppFolder({ folder }: IAppFolderInit): Promise<boolean | AppError<any>>;
    fetchPreference(): {
        configs: IPreferenceConfig;
        error: AppError<any>;
    };
    updatePreference({ configs }: IUpdatePreferenceOptions): true | AppError<any>;
}
