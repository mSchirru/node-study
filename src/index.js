const express = require('express');
const {v4: uuidv4} = require('uuid');

const app = express();

app.use(express.json());  

customers = [];

// Middleware

function verifyIfExistsAccountCPF(request, response, next) {
    const { cpf } = request.params;

    const customer = customers.find((customer) => customer.cpf === cpf); 

    if (!customer) {
        return response.status(400).json({error: 'Customer not found'});
    }

    request.customer = customer;
    return next();
}

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
});

app.get("/statement/:cpf",verifyIfExistsAccountCPF,(request, response) => {
    const {customer} = request;
    return response.json(customer.statement);
});

app.post("/deposit/:cpf",verifyIfExistsAccountCPF,(request, response) => {
    const {description, amount} = request.body;

    const {customer} = request;

    const depositOperation = {
        description,
        amount,
        created_at: new Date(),
        type: "credit"
    }

    customer.statement.push(depositOperation);
    return response.status(201).send();
});

app.listen(3333);