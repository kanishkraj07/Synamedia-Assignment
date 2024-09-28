import zod from 'zod';


export const PLACE_ORDER_SCHEMA = zod.object({
    name: zod.string(),
    email: zod.string(),
    deliveryAddress: zod.string(),
    items: zod.array(zod.object({
        item_name: zod.string()
    }))
});


export const UPDATE_DELIVERY_ADDRESS_REQUEST = zod.object({
    email: zod.string(),
    orderId: zod.string(),
    newDeliveryAddress: zod.string(),
});


