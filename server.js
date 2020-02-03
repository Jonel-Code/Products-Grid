const app = require('./server/index');
const jsonServer = require('json-server');

const server = jsonServer.create();
const apiRoute = jsonServer.router(app());
const middlewares = jsonServer.defaults();
const port = process.env.PORT || 4000;

middlewares.push(require('./server/handle-ads'));
middlewares.push(require('./server/handle-delay'));

server.use(middlewares);
server.use('/api/', apiRoute);

server.listen(port, () => {
    console.log('started');
});
