"use strict";

import amqp from "amqplib";
import { QUEUE_OPTIONS, EXCHANGE_OPTIONS } from "./constants.mjs";

export default class Filter {
  constructor({ filterName }) {
    if (!filterName) throw "filterName has to be set";
    this.name = filterName;
  }

  async connect() {
    const connection = await amqp.connect('amqp://localhost');
    this.channel = await connection.createChannel();
  }
  
  async setPorts(inputPort, outputPort, pipe) {
    this.inputPort = inputPort;
    this.outputPort = outputPort;
    this.pipe = pipe;
    await this.connect();
    this.channel.assertQueue(inputPort, QUEUE_OPTIONS)
    this.channel.assertQueue(outputPort, QUEUE_OPTIONS)
    this.listen();
  }

  async listen() {
    this.channel.consume(this.inputPort, message => {
      if (message.content) {
        const newMessage = this.process(message.content.toString());
        this.channel.publish(this.pipe, this.outputPort, Buffer.from(newMessage), { noAck: true });
      }
    }, { noAck: true })
  }

  process(message) {
    throw "Process method must be implemented";
  }
}