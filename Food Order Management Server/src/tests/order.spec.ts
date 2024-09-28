import { describe, expect, it, vi } from "vitest";
import request from 'supertest';
import { Item, OrderStatus, PlaceOrderRequestDetails, UserOrderDetails } from "../model/model";
import app  from "../index";
import { ALL_USER_ORDERS, ALL_USERS } from "../db/db";

const mockUserOrderDetails: UserOrderDetails = {
    email: 'johndoe@gmail.com',
    orderId: '1',
    items:  [{item_name: 'Laptop'}] as Item[],
    deliveryAddress: 'New york',
    deliveryTime: '1/1/1970',
    status: OrderStatus.ACTIVE
} as UserOrderDetails

describe('App Routes', () => {

    const mockPlaceOrder: PlaceOrderRequestDetails = {
        name: 'John Doe',
        email: 'johndoe@gmail.com',
        deliveryAddress: 'New york',
        items: [{item_name: 'Laptop'}] as Item[]
    } as PlaceOrderRequestDetails

    describe('Place order', () => {
        it('should return 400 status code and error message when inputs are invalid', async() => {
          const response = await request(app).post("/api/v1/order/placeorder").send({});
          expect(response.statusCode).toBe(400);
          expect(response.body.response).toEqual('Invalid order details');
        });

        it('should return 200 status code and order confirmation details', async() => { 
            const response = await request(app).post('/api/v1/order/placeorder').send(mockPlaceOrder);
            expect(response.statusCode).toBe(200);
            expect(ALL_USERS.length).toBe(3);
            expect(ALL_USERS.find(user => user.email === mockPlaceOrder.email)).toBeTruthy();
            expect(response.body.message).toEqual('Order Confirmed');
            expect(response.body.orderDetails).toEqual(mockUserOrderDetails);
          });
    });

    describe('User orders', () => {
        it('should return 400 status code when user is not found', async() => {
          const response = await request(app).get("/api/v1/order").query({ email: 'xxxxx@gmail.com' });
          expect(response.statusCode).toBe(400);
          expect(response.body.message).toEqual('User not found with email xxxxx@gmail.com');
        });

        it('should return 200 status code and user orders', async() => { 
            const response = await request(app).get('/api/v1/order').query({ email: 'kanishkmogalraj@gmail.com' });
            expect(response.statusCode).toBe(200);
            expect(response.body.orders).toEqual(ALL_USER_ORDERS.filter(order => order.email === 'kanishkmogalraj@gmail.com'));
        });
    });

    describe('All Active Orders', () => {
        it('should return 200 status code and all active orders', async() => { 
            const response = await request(app).get('/api/v1/order/allActiveOrders');
            expect(response.statusCode).toBe(200);
            expect(response.body.AllActiveOrders).toEqual(ALL_USER_ORDERS.filter(order => order.status === OrderStatus.ACTIVE));
        });
    });

    describe('Cancel Order', () => {
        it('should return 400 status code when orderId is invalid', async() => {
          const response = await request(app).put("/api/v1/order/cancelOrder").query({ orderId: null, email: 'xxxxx@gmail.com' });
          expect(response.statusCode).toBe(400);
          expect(response.body.message).toEqual('Invalid orderId');
        });

        it('should return 400 status code when emailId is invalid', async() => {
            const response = await request(app).put("/api/v1/order/cancelOrder").query({ orderId: '123', email: null });
            expect(response.statusCode).toBe(400);
            expect(response.body.message).toEqual('Invalid Email');
        });

        it('should return 400 status code when user is not found', async() => {
            const response = await request(app).put("/api/v1/order/cancelOrder").query({ orderId: '123', email: 'xxxxx@gmail.com' });
            expect(response.statusCode).toBe(400);
            expect(response.body.message).toEqual('User not found with email xxxxx@gmail.com');
        });


        it('should return 400 status code when order is not found for a user', async() => {
            const response = await request(app).put("/api/v1/order/cancelOrder").query({ orderId: '123', email: 'kanishkmogalraj@gmail.com' });
            expect(response.statusCode).toBe(400);
            expect(response.body.message).toEqual('Order not found');
        });

        it('should return 400 status code when order is already been cancelled', async() => {
            const response = await request(app).put("/api/v1/order/cancelOrder").query({ orderId: '2222', email: 'kanishkmogalraj@gmail.com' });
            expect(response.statusCode).toBe(400);
            expect(response.body.message).toEqual('Order with id: 2222 is already been cancelled')
        });

        it('should return 200 status code and cancel order successfully', async() => { 
            const response = await request(app).put("/api/v1/order/cancelOrder").query({ orderId: '8888', email: 'mike@gmail.com' });
            expect(response.statusCode).toBe(200);
            expect(response.body.message).toEqual('Order Cancelled successfully');
        });
    });


    describe('Update Delivery Address', () => {
        it('should return 400 status code when inputs are invalid', async() => {
          const response = await request(app).put("/api/v1/order/updateDeliveryAddress").send({});
          expect(response.statusCode).toBe(400);
          expect(response.body.message).toEqual('Invalid inputs');
        });

        it('should return 400 status code when user is not present', async() => {
            const mockDeliveryAddress = {
                email: 'xxxxx@gmail.com',
                orderId: '1234',
                newDeliveryAddress: '',
            }
            const response = await request(app).put("/api/v1/order/updateDeliveryAddress").send(mockDeliveryAddress);
            expect(response.statusCode).toBe(400);
            expect(response.body.message).toEqual(`User not found with email ${mockDeliveryAddress.email}`);
          });

          it('should return 400 status code when order is not found', async() => {
            const mockDeliveryAddress = {
                email: 'kanishkmogalraj@gmail.com',
                orderId: '1234',
                newDeliveryAddress: 'san francisco',
            }
            const response = await request(app).put("/api/v1/order/updateDeliveryAddress").send(mockDeliveryAddress);
            expect(response.statusCode).toBe(400);
            expect(response.body.message).toEqual('Order not found');
          });

          it('should return 200 status code and update new delivery address', async() => {
            const mockDeliveryAddress = {
                email: 'kanishkmogalraj@gmail.com',
                orderId: '9999',
                newDeliveryAddress: 'san francisco',
            }
            const response = await request(app).put("/api/v1/order/updateDeliveryAddress").send(mockDeliveryAddress);
            expect(response.statusCode).toBe(200);
            expect(response.body.message).toEqual('Delivery address updated successfully');
          });
    });
});