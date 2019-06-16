import { IpcMain } from "electron";
import { AppError } from "../metadata";
export interface IRegisterOptions {
    sync: boolean;
}
export declare class DefaultEventLoader {
    protected ipcMain: IpcMain;
    private descriptors;
    constructor(ipcMain: IpcMain);
    private checkProtoMethod;
    private register;
}
export declare function Contract(register: string): (prototype: any, propertyKey: string) => void;
export declare function createStamp(): number;
export declare function createUnknownError(error: any): AppError<any>;
export declare function createDefaultError(error: any): AppError<any>;
