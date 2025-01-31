import { Document } from "mongoose";

/**
 * @typedef Images
 * @property {string} uid
 * @property {buffer} data
 * @property {string} type
 * @property {number} size
 * @property {string} name
 */
export function Swagger_DOC () {};

export interface IImage
{
    id: any;
    uid: `IMG_${string}`;
    data: Buffer;
    type: string;
    size: number;
    name: string;
}