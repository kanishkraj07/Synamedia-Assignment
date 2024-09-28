export interface User {
    name: string;
    email: string;
}

export interface UserOrderDetails  {
    email: string;
    orderId: string;
    items: Item[];
    deliveryAddress: string;
    deliveryTime: string;
    status: OrderStatus
}

export enum OrderStatus {
    ACTIVE = 'active',
    CANCELLED = 'cancelled'
}

export interface Item {
    item_name: string;
}

export interface PlaceOrderRequestDetails extends User {
    deliveryAddress: string;
    items: Item[]
}

export interface UpdateDeliveryAddressReq {
    email: string;
    orderId: string;
    newDeliveryAddress: string;
}