import mongoose,{ Document, model, Schema } from "mongoose"
import increment from "mongoose-auto-increment";
import { MongoDB_URI } from "../../Config";
import { IImage } from "../../Interfaces/Images";
import Logger from "../../Lib/Logger";

const ImageSchema = new Schema
(
    {

        uid: {
            type: String,
            required: true,
        },

        data: {
            type: Buffer,
            required: true,
        },

        name: {
            type: String,
            required: true,
        },

        type: {
            type: String,
            required: true,
        },

        size: {
            type: Number,
            required: true,
        },

    }
);

// Log when creation
ImageSchema.post('save', function(doc: IImage)
{
    Logger.db(`Created image ${doc.id}`);
});

const connection = mongoose.createConnection(MongoDB_URI);
increment.initialize(connection);

ImageSchema.plugin(increment.plugin, {
    model: 'images',
    field: 'id',
    startAt: 0,
    incrementBy: 1
});

const ImageModel = model<IImage & Document>("images", ImageSchema);

export default ImageModel;