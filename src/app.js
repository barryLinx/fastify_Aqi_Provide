
import Axios from 'axios';


// Declare a route

async function routes(fastify,options){

  fastify.get("/",async function(req,reply){
    reply.send({ hello: 'world' });
    //return { hello: 'world' }
  });
  
  fastify.get("/hi",async function(req,reply){
    reply.send({  hi: "AQI"  });
    //return { hello: 'world' }
  });

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
}

export default routes;




/* Run the server!*/
// fastify.listen({ port: 8080 }, function (err, address) {
//   if (err) {
//     app.log.error(err);
//     process.exit(1);
//   }
//   //Server is now listening on ${address}
// });







