const express = require('express');
const pessoaController = require('../controllers/pessoas.controller');

const router = express.Router();

router.post('/sign-up', pessoaController.create)
router.post('/login', pessoaController.login)
router.get('/', pessoaController.show);
// router.get('/:id',pessoaController.showOne)

module.exports = router;