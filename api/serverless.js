"use strict";

// Read the .env file.
import * as dotenv from "dotenv";
dotenv.config();

import FastifyImp from "fastify";

import Axios from 'axios';
const app = FastifyImp({
  logger: true,
});

//const cors_Orgin = process.env.VanillaJS_PMAQI || 'http://localhost:8050';
import cors from '@fastify/cors';
// Require the framework
await app.register(cors, { 
  // put your options here
  //origin:[cors_Orgin]
   origin:['http://localhost:8050/main.html','http://127.0.0.1:5500']
});


// rate-limit 流量限制
await app.register(import('@fastify/rate-limit'), {
  //global : false,          // default true
  max: 10,                 // default 1000
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

app.setErrorHandler(function (error, request, reply) {
  if (error.statusCode === 429) {
    reply.code(429)
    error.message = 'You hit the rate limit! Slow down please!'
  }
  reply.send(error)
})


// Declare a route



app.get("/",async function(req,reply){
  reply.send({ hello: 'world' });
  //return { hello: 'world' }
});

app.get("/hi",async function(req,reply){
  reply.send({  hi: "AQI"  });
  //return { hello: 'world' }
});

app.get("/api/aqi", async function (request, reply) {
  const aqiURL=`${process.env.URL}${process.env.API_KEY}`;
  try{
    let response  = await Axios.get(aqiURL);
    //let response  = await fetch('https://data.moenv.gov.tw/api/v2/aqx_p_432?api_key=4684ccb2-ffa1-4d65-b57e-3de48d92ab1e');
    //console.log("repdata=", response.data);
    reply.send(response.data);
  }catch(err){
    app.log.error(err);
    process.exit(1);
   //api.js console.error(`Error:${err}`);
  }
  
});




// Register your application as a normal plugin.
// app.register(import("../src/app"));

/* Run the server!*/
app.listen({ port: 8080 }, function (err, address) {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  //Server is now listening on ${address}
});

export default async (req, res) => {
  await app.ready();
  app.server.emit('request', req, res);
}


