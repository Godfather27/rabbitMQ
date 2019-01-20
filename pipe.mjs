"use strict";

import amqp from "amqplib";
import { QUEUE_OPTIONS, EXCHANGE_OPTIONS } from "./constants.mjs";

export default class Pipe {
  constructor({ pipeName, filters }) {
    if (!pipeName || !filters.length) throw "pipeName and filters have to be set";
    this.pipeName = pipeName;
    this.filters = filters;
  }

  async connect() {
    const connection = await amqp.connect('amqp://localhost')
    this.channel = await connection.createChannel()
    await this.setupExchange();
    this.setupQueues();
    this.end();
  }

  setupExchange() {
    this.exchange = this.pipeName;
    return this.channel.assertExchange(this.exchange, 'direct', EXCHANGE_OPTIONS);
  }

  setupQueues() {
    this.channel.assertQueue(`${this.pipeName}.end`, QUEUE_OPTIONS);
    this.channel.bindQueue(`${this.pipeName}.end`, this.exchange, `${this.pipeName}.end`)
    this.filters.forEach((filter, index) => {
      const queue = filter.name;
      this.channel.assertQueue(queue, QUEUE_OPTIONS);
      this.channel.bindQueue(queue, this.exchange, queue)
      const outputPort = this.filters[index + 1] || { name: `${this.pipeName}.end`}
      filter.setPorts(queue, outputPort.name);
    })
  }

  end() {
    this.channel.consume(`${this.pipeName}.end`, message => {
      if (message) {
        console.log(message.content.toString())
      }
    }, { noAck: true })
  }

  async start(message) {
    await this.connect();
    this.channel.publish(this.exchange, this.filters[0].name, Buffer.from(message))
  }

  close() {
    this.channel.close()
  }
}
