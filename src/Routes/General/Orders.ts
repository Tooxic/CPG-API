import { Application, Router } from "express";
import { CacheOrder } from "../../Cache/CacheOrder";
import OrderModel from "../../Database/Schemas/Orders";
import { IOrder } from "../../Interfaces/Orders";
import AW from "../../Lib/AW";
import { idOrder } from "../../Lib/Generator";
import { APIError, APISuccess } from "../../Lib/Response";
import EnsureAdmin from "../../Middlewares/EnsureAdmin";
import { validOrder } from "../../Validator/ValidOrder";

export default class OrdersRouter
{
    private server: Application;
    private router = Router();

    constructor(server: Application)
    {
        this.server = server;
        this.server.use("/oders", this.router);
        
        /**
         * Gets all orders
         * @route GET /orders
         * @group Orders
         * @returns {Array} 200 - An array of orders
         * @security JWT
         * @security Basic
         */
        this.router.get("/", EnsureAdmin, (req, res) => {
            return APISuccess({
                orders: CacheOrder.array(),
            })(res);
        });

        /**
         * Gets specific orders
         * @route GET /orders/{uid}
         * @group Orders
         * @param {string} uid.path.required - The uid of order.
         * @returns {Object} 200 - The order
         * @returns {Error} 400 - Unable to find by uid
         * @security JWT
         * @security Basic
         */        
        this.router.get("/:uid", EnsureAdmin, (req, res) => {
            const uid = req.params.uid as IOrder["uid"];

            const order = CacheOrder.get(uid);

            if(!order)
                return APIError({
                    text: `Unable to find order by uid ${uid}`,
                })(res);

            return APISuccess({
                order: order,
            })(res);
        });

        /**
         * Create new order
         * @route POST /orders/create
         * @group Orders
         * @param {Order} data.body.required - The data for creating order.
         * @security JWT
         * @security Basic
         */
        this.router.post("/create", EnsureAdmin, (req, res) => {
            
            let {
                billing_type,
                customer_uid,
                dates,
                order_status,
                payment_method,
                product_uid,
                quantity,
                billing_cycle,
                price_override
            } = req.body as any;

            let data: IOrder = {
                uid: idOrder(),
                billing_type,
                customer_uid,
                dates,
                order_status,
                payment_method,
                product_uid,
                quantity,
                billing_cycle,
                price_override
            };

            if(!data.price_override)
                data.price_override = 0;

            if(!validOrder(data, res))
                return;

            new OrderModel(data).save();
            CacheOrder.set(data.uid, data);

            return APISuccess({
                text: `Succesfully created new order`,
                uid: data.uid,
                order: data,
            });
        });

        /**
         * Updates new order
         * @route PATCH /orders/create
         * @group Orders
         * @param {Order} data.body - The data for updating order.
         * @security JWT
         * @security Basic
         */        
        this.router.patch("/:uid", EnsureAdmin, async (req, res) => {
            let uid = req.params.uid as IOrder["uid"];
            const Order = CacheOrder.get(uid);
            
            if(!Order)
                return APIError({
                    text: `Unable to find order by uid ${uid}`,
                })(res);
            
            let {
                billing_type,
                customer_uid,
                dates,
                order_status,
                payment_method,
                product_uid,
                quantity,
                billing_cycle,
                price_override
            } = req.body as any;

            let data = Order;

            if(billing_type && billing_type !== data.billing_type)
                data.billing_type = billing_type;

            if(customer_uid && customer_uid !== data.customer_uid)
                data.customer_uid = customer_uid;

            if(dates && dates !== data.dates)
                data.dates = dates;

            if(order_status && order_status !== data.order_status)
                data.order_status = order_status;

            if(payment_method && payment_method !== data.payment_method)
                data.payment_method = payment_method;

            if(product_uid && product_uid !== data.product_uid)
                data.product_uid = product_uid;

            if(quantity && quantity !== data.quantity)
                data.quantity = quantity;

            if(billing_cycle && data.billing_type === "recurring" && billing_cycle !== data.billing_cycle)
                data.billing_cycle = billing_cycle;

            if(price_override && price_override !== data.price_override)
                data.price_override = price_override;

            if(!validOrder(data))
                return;

            const [S, F] = await AW(OrderModel.updateOne({ uid: uid }, data));

            if(F)
                return APIError({
                    text: `Something went wrong.. try again later`
                })(res);

            CacheOrder.set(data.uid, data);

            return APISuccess({
                text: `Succesfully updated order`,
                order: data,
            })(res);
        });
    }
}