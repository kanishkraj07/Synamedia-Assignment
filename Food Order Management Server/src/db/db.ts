import { UserOrderDetails, User, OrderStatus } from "../model/model";

export let ALL_USERS: User[] = [
    { name: 'Kanishk Mogalraj', email: 'kanishkmogalraj@gmail.com' },
    { name: 'Mike', email: 'mike@gmail.com' }
];

export let ALL_USER_ORDERS: UserOrderDetails[] = [
    {
        email: 'kanishkmogalraj@gmail.com',
        orderId: '9999',
        items: [{item_name: 'Mobile'}],
        deliveryAddress: 'Delhi',
        deliveryTime: new Date().toLocaleDateString('en-US'),
        status: OrderStatus.ACTIVE
    },
    {
        email: 'mike@gmail.com',
        orderId: '8888',
        items: [{item_name: 'laptop'}],
        deliveryAddress: 'Mumbai',
        deliveryTime: new Date().toLocaleDateString('en-US'),
        status: OrderStatus.ACTIVE
    }, 

    {
        email: 'kanishkmogalraj@gmail.com',
        orderId: '2222',
        items: [{item_name: 'IPhone'}],
        deliveryAddress: 'Jaipur',
        deliveryTime: new Date().toLocaleDateString('en-US'),
        status: OrderStatus.CANCELLED
    }
];
