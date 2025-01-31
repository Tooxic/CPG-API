import { Application, Router } from "express";
import Logger from "../../../Lib/Logger";
import { APIError, APISuccess } from "../../../Lib/Response";
import EnsureAdmin from "../../../Middlewares/EnsureAdmin";
import { CacheImages } from "../../../Cache/CacheImage";
import { IImage } from "../../../Interfaces/Images";
import { UploadedFile } from "express-fileupload";
import { idImages } from "../../../Lib/Generator";
import ImageModel from "../../../Database/Schemas/Images";
import AW from "../../../Lib/AW";

export default class ImagesRouter
{
    private server: Application;
    private router = Router();

    constructor(server: Application, version: string)
    {
        this.server = server;
        this.server.use(`/${version}/images`, this.router);

        /**
         * Gets all images except buffer.
         * @route GET /images
         * @group Images
         * @returns {Images} 200 - Images data
         * @security JWT
         */
        this.router.get("/", (req, res) => {
            return APISuccess(CacheImages.array().map(e => {
                return {
                    uid: e.uid,
                    name: e.name,
                    type: e.type,
                    size: e.size
                }
            }))(res);
        });
        /**
         * Gets image with buffer
         * @route GET /images/{uid}
         * @group Images
         * @param {string} uid.path.required - uid for image
         * @returns {Images} 200 - Image data in base64
         * @returns {APIError} 404 - Failed to find
         * @security Basic
         */
        this.router.get("/:id", (req, res) => {
            const id = req.params.id as IImage["id"];

            const data = CacheImages.get(id);

            if(!data)
                return APIError(`Unable to find image by id ${id}`)(res);

            let binstr = Array.prototype.map.call(data.data, function (ch) {
                return String.fromCharCode(ch);
            }).join('');
            
            let d = btoa(binstr);

            return APISuccess(d)(res);
        });

        /**
         * Gets image with buffer
         * @route POST /images
         * @group Images
         * @param {file} image.formData.required Image data as formdata
         * @security Basic
         */
        this.router.post("/", EnsureAdmin, async (req, res) => {
            if(req.files)
            {
                // @ts-ignore
                let image = (req.files.image as UploadedFile);

                Logger.debug(`Uploading image ${image.name}`);

                let dataImage = {
                    uid: idImages(),
                    data: image.data,
                    type: image.mimetype,
                    size: image.size,
                    name: image.name
                };

                const db_Image = await new ImageModel(dataImage).save();
                
                // @ts-ignore
                CacheImages.set(db_Image.id, db_Image);

                return APISuccess(db_Image.id)(res);
            }
            return APIError({
                text: `Failed to create image`,
            })(res);
        });

        /**
         * Deletes image
         * @route DELETE /images/{uid}
         * @group Images
         * @param {string} uid.path.required - uid for image
         * @security Basic
         */
         this.router.delete("/:id", EnsureAdmin, async (req, res) => {
            const id = req.params.id as IImage["id"];
            const data = CacheImages.get(id);
            if(!data)
                return APIError(`Unable to find image by id ${id}`)(res);
            
            const [S, F] = await AW(ImageModel.deleteOne({ id: id }));
            
            if(F)
                return APIError(`Something went wrong.. try again later`)(res);
            
            CacheImages.delete(id);
            
            APISuccess(`Succesfully delete image`)(res);
        });
    }
} 