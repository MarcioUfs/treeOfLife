const app = require('./app');
const port = process.env.PORT || 3030;

app.listen(port, ()=> {
    console.log(`Servidor em http://localhost:${port}`)
})