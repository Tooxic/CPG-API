import mongoose, { model, Schema } from "mongoose"
import increment from "mongoose-auto-increment";
import { MongoDB_URI } from "../../Config";
import { IConfigurableOptions } from "../../Interfaces/ConfigurableOptions";
import Logger from "../../Lib/Logger";

const ConfigurableOptionsSchema = new Schema
(
    {

        name: {
            type: String,
            required: true,
        },

        products_ids: {
            type: Array,
            default: [],
        },

        options: {
            type: Array,
            default: [],
        },

    }
);

// Log when creation
ConfigurableOptionsSchema.post('save', function(doc: IConfigurableOptions)
{
    Logger.db(`Created configurable_options ${doc.id}`);
});

const connection = mongoose.createConnection(MongoDB_URI);
increment.initialize(connection);

ConfigurableOptionsSchema.plugin(increment.plugin, {
    model: 'configurable_options',
    field: 'id',
    startAt: 0,
    incrementBy: 1
});

const ConfigurableOptionsModel = model<IConfigurableOptions & Document>("configurable_options", ConfigurableOptionsSchema);

export default ConfigurableOptionsModel;