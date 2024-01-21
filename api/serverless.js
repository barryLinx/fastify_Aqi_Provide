// Require the framework and instantiate it
"use strict";

// Require the framework
import Fastify from "fastify";
// Read the .env file.
import * as dotenv from "dotenv";
dotenv.config();

const app = Fastify({
  logger: true,
});

// Register your application as a normal plugin.
app.register(import("../src/app"));

export default async (req, res) => {
  await app.ready();
  app.server.emit('request', req, res);
}


