# Pipes and Filters with RabbitMQ

## Installation

`rabbitmq`, `node` and `npm` have to be installed on the local machine

```bash
npm install
```

## Run

run the server and the node app

```bash
npm start

rabbitmq-server
```

## Filters

Filters must extend the `Filter` class and implement a `process` method which returns an updated value.
The filter takes an Object with `filterName` <String> as constructur Argument

```javascript
import Filter from "./filter.mjs";

class MyFilter extends Filter {
  process(message) {
    return message + "foo bar buz"
  }


new MyFilter("MyFilter1")}
```

## Pipes

The `Pipe` takes an Object with `pipeName` <String> and `filters` <Filter[]> as constructor Argument.
The filters order depicts the piping order.
`start` will take the first value as param and initiates the piping process.

```javascript
import Pipe from "./pipe.mjs";

const myPipe = new Pipe({
  pipeName: "myPipe",
  filters: [
    new MyFilter1("MyFilter1"),
    new MyFilter2("MyFilter2"),
    new MyFilter3("MyFilter3"),
  ]
});

myPipe.start("first value")
```

## Acks

For this example I didn't use Acknoledgements, because we call trivial functions.
If this library would be used in a production environment, it could only be used for non critical pipe and filtering jobs.

## Flags

passive - since we ensure that the queue and exchange exists, we don't need the server to do that.
durable - we want the queue to persist on restart, so we don't loose data on server restarts.

## Errors

This library doesn't support error handling.
This means, when an error occurs in a filter, the process wouldn't finish, or even alert that an error occured.