import { Document } from "mongoose";
import { IImage } from "./Images";

export interface ICategory
{
    uid: `CAT_${string}`;
    name: string;
    description: string;
    images?: IImage["id"][];
    private: Boolean;
}

export interface IDCategory extends Document, ICategory {};