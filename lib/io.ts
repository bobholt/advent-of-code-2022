import * as fs from 'fs';
import { List } from 'immutable';

export type DataStringArray = List<string> & { __brand: "File Data" };

export const readFile = fs.readFile;

export function readFileToString(
  path: fs.PathOrFileDescriptor,
  cb: (err: NodeJS.ErrnoException | null, data: string) => void
): void {
  readFile(path, (err, data) => {
    let s: string = '';
    if (!err) {
      s = data.toString().trim();
    }
    cb(err, s);
  });
}

export function readFileToStringArray(
  path: fs.PathOrFileDescriptor,
  cb: (err: NodeJS.ErrnoException | null, data: DataStringArray) => void
): void {
  readFile(path, (err, data) => {
    let ss: string[] = [];
    if (!err) {
      ss = data.toString().split('\n');
    }
    cb(err, List(ss).filterNot((v, i) => i === ss.length - 1 && v === '') as DataStringArray);
  });
}
