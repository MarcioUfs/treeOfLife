const express = require('express')
const verifyJwt = require('./src/middleware/verifyJWT')
require('dotenv').config()
const app = express()
const cors = require('cors')
const port = process.env.PORT || 3030;
const pessoaRoute = require('./src/routes/pessoaRoute')
// const adminRoute = require('./src/routes/admin')
// const cargoRoute = require('./src/routes/cargo')
// const inscricaoRoute = require('./src/routes/inscricao')

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors())

app.use('/inclusao', pessoaRoute);
app.use('/', pessoaRoute);
// app.use('/admin', adminRoute);
// app.use('/cargo', verifyJwt, cargoRoute);
// app.use('/inscricao', verifyJwt, inscricaoRoute);
app.listen(port, () => {
    console.log(`Api rodandando na porta ${port}`)
})