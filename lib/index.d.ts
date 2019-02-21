
// / <reference path="node" />

import { Readable } from 'stream'

export declare class S3Adapter {
  constructor (client: S3Client);

  remove(filename: string, options?: object): Promise<any>;
  read(filename: string, options?: object): Promise<Buffer>;
  exists(filename: string, options?: object): Promise<boolean>;
  createReadStream(filename: string, options?: object): Readable;
  readInfo(filename: string, options?: object): Promise<FileInfo>;
  write(filename: string, content: any, options?: WriteOptions): Promise<FileInfo>;
}

export interface S3Client {
  deleteObject(params: object, cb: (err: any) => void): void
  upload(params: object, cb: (err: any, data: any) => void): void
  getObject(params: object): { createReadStream: () => Readable }
  getObject(params: object, cb: (err: any, data: any) => void): void
  headObject(params: object, cb: (err: any, data: any) => void): void
}

export interface FileInfo {
  [key: string]: any;
  mimeType: string;
  modified: number;
  size: number;
}

export interface WriteOptions {
  overwrite?: boolean;
  [key: string]: any;
}
