import { Application, Router } from "express";
import { CacheInvoice } from "../Cache/CacheInvoices";
import { IInvoice } from "../Interfaces/Invoice";
import Logger from "../Lib/Logger";
import { APIError, APISuccess } from "../Lib/Response";
import EnsureAdmin from "../Middlewares/EnsureAdmin";

export default class InvoiceRouter
{
    private server: Application;
    private router = Router();

    constructor(server: Application)
    {
        this.server = server;
        this.server.use("/invoices", this.router);

        this.router.get("/", EnsureAdmin, (req, res) => {
            APISuccess({
                invoices: CacheInvoice.array(),
            })(res);
        });

        this.router.get("/:uid", EnsureAdmin, (req, res) => {
            const uid = req.params.uid as IInvoice["uid"];

            const invoice = CacheInvoice.get(uid);

            if(!invoice)
                return APIError({
                    text: `Unable to find invoice by uid ${uid}`,
                })(res);

            return APISuccess({
                invoice: invoice,
            })(res);
        });

    }
}