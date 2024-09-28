import express, { Request, Response, Router } from 'express';
import { PLACE_ORDER_SCHEMA, UPDATE_DELIVERY_ADDRESS_REQUEST } from '../../schema/schema';
import { OrderStatus, PlaceOrderRequestDetails, UpdateDeliveryAddressReq, User, UserOrderDetails } from '../../model/model';
import { ALL_USER_ORDERS, ALL_USERS } from '../../db/db';

const orderRouter: Router = express.Router();
let uniqueId: number = 1;

orderRouter.post('/placeorder', (req: Request, res: Response) => {

    const parsedOrderDetails = PLACE_ORDER_SCHEMA.safeParse(req.body);
    
    if(!parsedOrderDetails.success) {
        res.status(400).json({
            response: 'Invalid order details'
        });
        return;
    }

    if(!ALL_USERS.find((user: User) => user.email === parsedOrderDetails.data.email)) {
        ALL_USERS.push({ email: parsedOrderDetails.data.email, name: parsedOrderDetails.data.name } as User);
    }

    const newOrder = buildOrder(parsedOrderDetails.data);

    ALL_USER_ORDERS.push(newOrder);

    res.status(200).json({
        message: 'Order Confirmed',
        orderDetails: newOrder
    });
});

orderRouter.get("/", (req: Request, res: Response) => {
    const email: string = req.query?.email as string;
    
    if(!isUserPresent(email)) {
        res.status(400).json({
            message: `User not found with email ${email}`
        });
        return;
    }

    res.status(200).json({
        orders: ALL_USER_ORDERS.filter((userOrder: UserOrderDetails) => userOrder.email === email)
    });
});


orderRouter.get("/allActiveOrders", (req: Request, res: Response) => {
    res.status(200).json({
        AllActiveOrders: ALL_USER_ORDERS.filter((userOrder: UserOrderDetails) => userOrder.status === OrderStatus.ACTIVE)
    });
});

orderRouter.put("/cancelOrder", (req: Request, res: Response) => {
    const orderId: string = req.query?.orderId as string || '';
    const email: string = req.query?.email as string || '';

    if(!orderId) {
        res.status(400).json({
            message: 'Invalid orderId'
        });
        return;
    }

    if(!email) {
        res.status(400).json({
            message: 'Invalid Email'
        });
        return;
    }

    if(!isUserPresent(email)) {
        res.status(400).json({
            message: `User not found with email ${email}`
        });
        return;
    }

    const orderDetails = getOrderDetailsByEmailAndOrderId(email, orderId);

    if(!orderDetails) {
        res.status(400).json({
            message: `Order not found`
        });
        return;
    }

    if(orderDetails.status === OrderStatus.CANCELLED) {
        res.status(400).json({
            message: `Order with id: ${orderDetails.orderId} is already been cancelled`
        });
        return;
    }

    orderDetails.status = OrderStatus.CANCELLED;

    res.status(200).json({
        message: 'Order Cancelled successfully'
    });
});


orderRouter.put("/updateDeliveryAddress", (req: Request, res: Response) => {

    const parsedDeliveryDetails = UPDATE_DELIVERY_ADDRESS_REQUEST.safeParse(req.body);

    if(!parsedDeliveryDetails.success) {
        res.status(400).json({
            message: 'Invalid inputs'
        });
        return;
    }

    if(!isUserPresent(parsedDeliveryDetails.data.email)) {
        res.status(400).json({
            message: `User not found with email ${parsedDeliveryDetails.data.email}`
        });
        return;
    }

    const orderDetails = getOrderDetailsByEmailAndOrderId(parsedDeliveryDetails.data.email, parsedDeliveryDetails.data.orderId);

    if(!orderDetails) {
        res.status(400).json({
            message: 'Order not found'
        });
        return;
    }

    orderDetails.deliveryAddress = parsedDeliveryDetails.data.newDeliveryAddress;

    res.status(200).json({
        message: 'Delivery address updated successfully'
    });
});


export const getOrderDetailsByEmailAndOrderId = (email: string, orderId: string) => {
    return ALL_USER_ORDERS.find((userOrder: UserOrderDetails) => userOrder.email === email && userOrder.orderId === orderId);
}

export const buildOrder: (object: PlaceOrderRequestDetails) => UserOrderDetails = (orderDetails: PlaceOrderRequestDetails) => {
    return {
        email: orderDetails.email,
        orderId: getOrderId(),
        items: orderDetails.items,
        deliveryAddress: orderDetails.deliveryAddress,
        deliveryTime: getDeliveryTime(),
        status: OrderStatus.ACTIVE
    } as UserOrderDetails
}

export const getOrderId: () => string = () => {
    return (uniqueId++).toString();
}


export const getDeliveryTime: () => string = () => {
    return new Date(new Date().getDate() + 5).toLocaleDateString('en-US');
}

export const isUserPresent: (email: string) => boolean = (email: string) => {
    return !!ALL_USERS.find((user: User) => user.email === email);
}

export default orderRouter;