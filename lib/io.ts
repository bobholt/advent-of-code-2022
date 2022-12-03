import * as fs from 'fs';
import type { Immutable } from './immutable';

export const readFile = fs.readFile;

export function readFileToString(
  path: fs.PathOrFileDescriptor,
  cb: (err: NodeJS.ErrnoException | null, data: Immutable<string>) => void
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
  cb: (err: NodeJS.ErrnoException | null, data: Immutable<string[]>) => void
): void {
  readFile(path, (err, data) => {
    let ss: string[] = [];
    if (!err) {
      ss= data.toString().trim().split('\n');
    }
    cb(err, ss);
  });
}