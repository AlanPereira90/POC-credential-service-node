# Credential Service

### What is?

Credential-service is a POC used to study DDD and TDD with Node

### How to use in development environment?

Run the command `docker-compose up` to up local dynamoDB (port 8000) and credential-service (ports 6060) containers.
With the containers up, the api documentation can be checked [here](http://127.0.0.1:6060/api-docs)

### How to test?

Run the command `npm run test:tdd` to run tests and keep watching the code changes, and `npm test` to execute a single test execution.

#### Important:

After up the local dynamoDB instance at the first time, it's necessary create the single table _Credentials_ to execute local end to end tests.

#### Dynamo DB utils commands:

- To create the table Credentials:

```
aws dynamodb create-table \

  --table-name Credentials \

  --attribute-definitions \

    AttributeName=PK,AttributeType=S \

  --key-schema \

    AttributeName=PK,KeyType=HASH \

  --provisioned-throughput ReadCapacityUnits=1,WriteCapacityUnits=1 \

  --endpoint-url http://localhost:8000/
```

- To list Dynamo DB created tables:

```
aws dynamodb list-tables --endpoint-url http://localhost:8000/
```

- To scan Dynamo DB Credentials Table:

```
aws dynamodb scan --table-name Credentials --endpoint-url http://localhost:8000/
```

- To remove Dynamo DB Credentials Table:

```
aws dynamodb delete-table --table-name Credentials --endpoint-url http://localhost:8000/
```
