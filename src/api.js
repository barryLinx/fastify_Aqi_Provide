// Require the framework and instantiate it
"use strict";

import Axios from 'axios';

// Read the .env file.
import * as dotenv from "dotenv";
dotenv.config();
import cors from '@fastify/cors';

import Fastify from "fastify";
const fastify = Fastify({
  logger: true,
});

//const cors_Orgin = process.env.VanillaJS_PMAQI || 'http://localhost:8050';

await fastify.register(cors, { 
  // put your options here
  //origin:[cors_Orgin]
   origin:'*'
});

fastify.register(
  fastifyCaching,
  {privacy: fastifyCaching.privacy.NOCACHE},
  (err) => { if (err) throw err }
)

// rate-limit 流量限制
await fastify.register(import('@fastify/rate-limit'), {
  //global : false,          // default true
  max: 3,                 // default 1000
  timeWindow: '1 minute',// default 1000 * 60
  //allowList:[cors_Orgin],
  errorResponseBuilder: function (request, context) {
    return {
      code: 429,
      error: 'Too Many Requests',
      message: `I only allow ${context.max} requests per ${context.after} to this Website. Try again soon.`,
      date: Date.now(),
      expiresIn: context.ttl // milliseconds
    }
  }
});

fastify.setErrorHandler(function (error, request, reply) {
  if (error.statusCode === 429) {
    reply.code(429)
    error.message = 'You hit the rate limit! Slow down please!'
  }
  reply.send(error)
})


// Declare a route
fastify.get("/api/aqi", async function (request, reply) {
  const aqiURL=`${process.env.URL}${process.env.API_KEY}`;
  try{
    let response  = await Axios.get(aqiURL);
    //let response  = await fetch('https://data.moenv.gov.tw/api/v2/aqx_p_432?api_key=4684ccb2-ffa1-4d65-b57e-3de48d92ab1e');
    //console.log("repdata=", response.data);
    reply.send(response.data);
  }catch(err){
    fastify.log.error(err);
    process.exit(1);
   //api.js console.error(`Error:${err}`);
  }
  
});

// Run the server!
fastify.listen({ port: 8080 }, function (err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  //Server is now listening on ${address}
});

// Register your application as a normal plugin.
fastify.register(import("../src/api.js"));

export default async (req, res) => {
  await fastify.ready();
  fastify.server.emit('request', req, res);
}