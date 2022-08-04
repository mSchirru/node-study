const express = require('express');
const {v4: uuidv4} = require('uuid');

const app = express();

app.use(express.json());  

customers = [];

app.get("/account", (request, response) => {
    const {name, cpf} = request.body;
    const id = uuidv4();

    const customerAlreadyExists = customers.some(
        (customer) => customer.cpf === cpf
    );

    if (customerAlreadyExists) {
        return response.status(400).json({error: 'Customer already exists'});
    }

    const customer = {
        name,
        cpf,
        id,
        statement: []
    };

    

    customers.push(customer);
    return response.status(201).send();
})

app.listen(3333);