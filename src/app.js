import Axios from 'axios';

async function routes (fastify, options) {
// Declare a route

fastify.get("/",async function(req,reply){
  return { hello: 'world' }
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