import mongoose, { Document, model, Schema } from "mongoose"
import increment from "mongoose-auto-increment";
import { MongoDB_URI } from "../../Config";
import { IProduct } from "../../Interfaces/Products";
import Logger from "../../Lib/Logger";

const ProductSchema = new Schema
(
    {

        uid: {
            type: String,
            required: true,
        },

        name: {
            type: String,
            required: true,
        },

        description: {
            type: String,
            default: '',
        },

        hidden: {
            type: Boolean,
            required: true,
        },

        category_uid: {
            type: String,
            required: true,
        },

        stock: {
            type: Number,
            required: true,
        },

        BStock: {
            type: Boolean,
            required: true,
        },

        special: {
            type: Boolean,
            required: true,
        },

        payment_type: {
            type: String,
            default: "one_time",
        },

        price: {
            type: Number,
            required: true,
        },

        setup_fee: {
            type: Number,
            required: true,
        },

        tax_rate: {
            type: Number,
            required: true,
        },
        
        recurring_method: {
            type: String,
            default: undefined,
        },

        image: {
            type: Array,
            default: [],
        },

        module_name: {
            type: String,
            default: 'none',
        },

        modules: {
            type: Array,
            default: [],
        },

    }
);

// Log when creation
ProductSchema.post('save', function(doc: IProduct)
{
    Logger.db(`Created product ${doc.name} (${doc.id})`);
});

const connection = mongoose.createConnection(MongoDB_URI);
increment.initialize(connection);

ProductSchema.plugin(increment.plugin, {
    model: 'products',
    field: 'id',
    startAt: 0,
    incrementBy: 1
});

const ProductModel = model<IProduct & Document>("products", ProductSchema);

export default ProductModel;