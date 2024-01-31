import JSONdb from "simple-json-db";
import { join } from "path";

export const jsonDb = new JSONdb(join(__dirname, "..", "db.json"));