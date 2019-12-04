const express = require('express'); // importing a CommonJS module
const helmet = require('helmet') //<---install pkg

const hubsRouter = require('./hubs/hubs-router.js');

const server = express();

//middleware

//custom middleware
function logger(req, res, next){
  console.log(`${req.method} to ${req.origionalUrl}`);
  next(); //allows the request to continue to the next MW or route.
}

//write a gatekeeper middleware that reads a password from the headers, and if the PW is melon, let it continue.
//if not send back status code 401 and a message.
//Use it for the /area51 endpoint only.
function gateKeeper(req, res, next){
  next();
}


server.use(express.json());  //built in middleware
// server.use(helmet()); //<---use pkg  //3rd party MW  this is applied gloablly
server.use(logger);
server.use(gateKeeper);

//endpoints
server.use('/api/hubs', helmet(), hubsRouter);//this is local middleware

server.get('/', (req, res) => {
  const nameInsert = (req.name) ? ` ${req.name}` : '';

  res.send(`
    <h2>Lambda Hubs API</h2>
    <p>Welcome${nameInsert} to the Lambda Hubs API</p>
    `);
});

server.get("/echo", (req, res) => {
  res.send(req.headers);
});

function auth(req, res, next) {
  if (req.url === '/area51') {
    next();
  } else {
    res.status(401).json({message: 'You shall not pass!'});
  }
}
server.get("/area51", auth, (req, res, next) => {
  res.send("Welcome!");
});

module.exports = server;
