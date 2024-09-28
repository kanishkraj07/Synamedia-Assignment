# Food order management assignment

## Overview
- Built with Node.js, express, typescript, ZOD for input validation and Vitest as testing framework
- Added 5 Food Order APIS along with error validations for each.
- Added Testcases for all apis (Code coverage: 100%)

## APIs
- **Place Order API**:  used to place an order

    ```sh    
    url: http://localhost:3000/api/v1/order/placeorder (POST)
    
    body: {
    "name": "Kushal",
    "email": "kushaldath@gmail.com",
    "deliveryAddress": "Hyderabad",
    "items": [{
        "item_name": "Tablet"
    }]}
  ```

- **User orders**:  used to get specific user orders by email

    ```sh    
    url: http://localhost:3000/api/v1/order?email=kushaldath@gmail.com (GET)
  ```

- **All Active Orders**:  used to get all active orders

     ```sh    
    url: http://localhost:3000/api/v1/order/allActiveOrders (GET)
  ```

- **Cancel Order**:  used to cancel the order by orderId and email
  
  ```sh    
    url: http://localhost:3000/api/v1/order/cancelOrder?orderId=1&email=kushaldath@gmail.com (PUT)
  ```

- **Update Delivery Address**:  used to update delivery address

 ```sh    
    url: http://localhost:3000/api/v1/order/updateDeliveryAddress (PUT)
    
    body:{
    "email": "kushaldath@gmail.com",
    "newDeliveryAddress": "xxxxxxxxxx",
    "orderId": "1000000"
   }
  ```

# Test cases Results

![image](https://github.com/user-attachments/assets/e9645743-f784-451b-a0f3-96cf8ceddac8)


# Code Coverage

![image](https://github.com/user-attachments/assets/41ff16e5-527d-4407-a439-f2eb09c3d961)

# Steps to run the server

## Prerequisites

- Need to have Node and typescript in local.

 ```sh    
  npm install 
  ```

 ```sh    
  tsc -b  
  ```

 ```sh    
  node dist/main.js 
  ```

- For testcases -
   
 ```sh    
  npm run test
  ```





  

