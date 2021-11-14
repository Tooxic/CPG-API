import { Application, Router } from "express";

export default class ProductsRouter
{
    private server: Application;
    private router = Router();

    constructor(server: Application, version: string)
    {
        this.server = server;
        this.server.use(`/${version}/stripe`, this.router);

        

    }

}