import { IFileStorage } from "./file-storage.interface";
import { LocalStorage } from "./local-storage";

let storage: IFileStorage;

storage = new LocalStorage("uploads");

export default storage;
