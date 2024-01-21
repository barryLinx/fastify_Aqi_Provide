// Require the framework and instantiate it
"use strict";



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


/* Register  your application as a normal plugin.*/
fastify.register(import("../api/serverless.js"));
// import Rou from '../api/serverless.js';
// fastify.register(Rou, {
//   prefix: "/",
// });


// Run the server!
// fastify.listen({ port: 8080 }, function (err, address) {
//   if (err) {
//     fastify.log.error(err);
//     process.exit(1);
//   }
//   //Server is now listening on ${address}
// });




export default async (req, res) => {
  await fastify.ready();
  fastify.server.emit('request', req, res);
}


