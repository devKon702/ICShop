import { env } from "../constants/env";
import { IFileStorage } from "./file-storage.interface";
import { LocalStorage } from "./local-storage";

let storage: IFileStorage;

storage = new LocalStorage(env.STORAGE_PATH);

export default storage;
