const path = require("path");
const fs = require("fs");

// Require the fastify framework and instantiate it
const fastify = require("fastify")({
  // set this to true for detailed logging:
  logger: false,
});

const servFunc = require("./src/nodeFuncs/serverFuncs.js");

// Setup our static files
fastify.register(require("@fastify/static"), {
  root: path.join(__dirname, "public"),
  prefix: "/", // optional: default '/'
});

// fastify-formbody lets us parse incoming forms
fastify.register(require("@fastify/formbody"));

// point-of-view is a templating manager for fastify
fastify.register(require("@fastify/view"), {
  engine: {
    handlebars: require("handlebars"),
  },
});

fastify.get("/", function (request, reply) {
  let params = {};
  return reply.view("/src/pages/myform.html");//, params);
});

fastify.get("/t*", function (request, reply) {
  let arg = request.params["*"];
  if(arg.includes("/")){
    return "Invalid get params";
  }
  let params = {greeting: arg};
  return reply.view("/src/pages/myform.html", params);
});

fastify.post("/setDate", function (request, reply) {
  console.log(request.body.value + " = " + request.body.command);
  return servFunc.postAnswers(request.body.command, request.body.value, fs);
});

// Run the server and report out to the logs
fastify.listen(
  { port: process.env.PORT, host: "0.0.0.0" },
  function (err, address) {
    if (err) {
      fastify.log.error(err);
      process.exit(1);
    }
    console.log(`Your app is listening on ${address}`);
    fastify.log.info(`server listening on ${address}`);
  }
);
