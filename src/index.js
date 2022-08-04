const express = require('express');
const {v4: uuidv4} = require('uuid');

const app = express();

app.use(express.json());  

customers = [];

app.post("/account", (request, response) => {
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

app.get("/statement/:cpf", (request, response) => {
    const { cpf } = request.params;

    const customer = customers.find((customer) => customer.cpf === cpf);

    return response.json(customer.statement);
});

app.listen(3333);