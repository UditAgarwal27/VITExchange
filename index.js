const http = require('http');
const app = require('./server');
const server = http.createServer(app);

const port = process.env.PORT || 4000;

server.listen(port, ()=>{
    console.log(`Server is up and running at port ${port}`);
})