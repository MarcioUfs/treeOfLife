
const express = require("express");
const app = express();
const port = process.env.PORT || 3030;

app.get("/", function(req,res){})

app.listen(port, ()=> {
    console.log(`Servidor em http://localhost:${port}`)
})