import { model, Schema } from "mongoose"
import { IDConfigs } from "../../Interfaces/Admin/Configs";

const ConfigsSchema = new Schema
(
    {

        smtp: {
            type: Object,
            default: {},
        },

        smtp_emails: {
            type: Array,
            default: [],
        },

        webhooks_urls: {
            type: Array,
            default: [],
        }

    }
);

const ConfigModel = model<IDConfigs>("configs", ConfigsSchema);

export default ConfigModel;