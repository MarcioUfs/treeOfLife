const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const database = require('../database/db');
const tratarCPF = require('../functions/tratarCPF');
async function show(req, res) {
    return res.status(200).send({"msg":"ola show"})
    // await database.select().table("pessoa").then(data => {
    //     return res.status(200).send(data)
    // }).catch(err => {
    //     return res.status(500).send({ "msg": "Erro do servidor!" })
    // })
}
// async function showOne(req, res) {
//     let id = parseInt(req.params.id)
//     if (isNaN(id)) {
//         res.status(400).send({ "msg": "Valor inserido é inválido!" })
//     } else {
//         await database.where({ id: id }).select().table("pessoa").then(data => {
//             if (data == 0) {
//                 return res.status(404).send({ "msg": "Não encontrado!" })
//             }
//             return res.send(data)

//         }).catch(err => {
//             return res.status(404).send({ "msg": "Não encontrado!" })
//         })
//     }
// }

async function create(req, res) {
    let validCpf = ''
    if(req.body.cpf){
        validCpf = tratarCPF(req.body.cpf);
    }else{
        return res.status(403).json({ 'msg': "CPF inválido!" })
    }
    await database.select().table('pessoa').where({ cpf: validCpf }).orWhere({ email: req.body.email }).then(data => {
        if (data.length >= 1) {
            return res.status(409).json({ 'msg': "Email ou CPF já cadastrado!" })
        } else {
            bcryptjs.genSalt(10, function (err, salt) {
                bcryptjs.hash(req.body.password, salt, async function (err, hash) {
                    const user = {
                        nome: req.body.nome,
                        datanasc: req.body.datanasc,
                        naturalidade: req.body.naturalidade,
                        nacionalidade: req.body.nacionalidade,
                        estadocivil: req.body.estadocivil,
                        sexo: req.body.sexo,
                        logradouro: req.body.logradouro,
                        bairro: req.body.bairro,
                        cidade: req.body.cidade,
                        estado: req.body.estado,
                        cep: req.body.cep,
                        telefone: req.body.telefone,
                        cpf: req.body.cpf,
                        rg: req.body.rg,
                        rgemissao: req.body.rgemissao,
                        rguf: req.body.rguf,
                        pispasep: req.body.pispasep,
                        tituloeleitoral: req.body.tituloeleitoral,
                        titulozona: req.body.titulozona,
                        titulosecao: req.body.titulosecao,
                        nomemae: req.body.nomemae,
                        nomepai: req.body.nomepai,
                        email: req.body.email,
                        permissao: req.body.permissao,
                        condicao: req.body.condicao,
                        created_at: req.body.createdat,
                        updated_at: req.body.updatedat,
                        password: hash
                    }
                    try {
                        if (
                            user.nome === '' ||
                            user.datanasc === '' ||
                            user.naturalidade === '' ||
                            user.nacionalidade === '' ||
                            user.estadocivil === '' ||
                            user.sexo === '' ||
                            user.logradouro === '' ||
                            user.bairro === '' ||
                            user.cidade === '' ||
                            user.estado === '' ||
                            user.cep === '' ||
                            user.telefone === '' ||
                            user.cpf === '' ||
                            user.nomemae === '' ||
                            user.email === '' ||
                            user.password === '') {
                            return res.status(403).json({ "msg": "Falta algum dado!" })
                        }
                        await database.insert(user).into('pessoa').then(data => {
                            return res.status(200).json({ "msg": "Cadastrado com sucesso!" })
                        }).catch(err => {
                            return res.status(500).json({ "msg": "Erro interno do servidor" })
                        })
                    } catch (error) {
                        console.log(error)
                    }
                });
            });
        }
    }).catch(err => {
        return res.status(500).json({ "msg": "Erro do servidor" })
    })
}
function login(req, res) {
    let validCpf = ''
    if(req.body.cpf){
        validCpf = tratarCPF(req.body.cpf);
    }else{
        return res.status(403).json({ 'msg': "CPF inválido!" })
    }
    database.select().table('pessoa').where({ cpf: validCpf }).then(data => {
        if (data.length <= 0) {
            return res.status(401).send({ "msg": "Credencial inválida!" })
        } else {
            // myId(data[0].id)
            bcryptjs.compare(req.body.password, data[0].password, function (err, result) {
                if (result) {
                    const token = jwt.sign({
                        email: data[0].email,
                        userId: data[0].idpkpessoa,
                        condicao: data[0].condicao,
                        permissao: data[0].permissao
                    }, 'secret', { expiresIn: '1h' }, function (err, token) {
                        return res.status(200).json({
                            "msg": "Autenticação com sucesso!",
                            token: token,
                        });
                    });
                } else {
                    return res.status(401).json({ "msg": "Dados inválidos!!!" })
                }
            });
        }
    }).catch(error => {
        return res.status(500).json({ "msg": "Erro do servidor!" })
    })
}
// //iat 1637668993 1637676193
// async function deleteF(req, res) {
//     let id = parseInt(req.params.id)
//     try {
//         if (isNaN(id)) {
//             res.status(400).send({ "msg": "Valor inserido é inválido!" })
//         } else {
//             await database.where({ id: id }).delete().table("pessoa").then(data => {
//                 if (data == 0) {
//                     return res.status(404).send({ "msg": "Não encontrado!" })
//                 }
//                 return res.status(200).send({ "msg": "Excluido com sucesso!" })

//             }).catch(err => {
//                 return res.status(404).send({ "msg": "Não encontrado!" })
//             })
//         }
//     } catch (error) {
//         return res.status(500).send({ "msg": "Erro do servidor!" })
//     }
// }
// async function update(req, res) {
//     let { id, nome, dataNasc, naturalidade, nacionalidade, estadoCivil, sexo, logradouro, bairro, cidade, estado, cep, telefone,
//         niveldeformacao, cpf, rg, rgemissao, rguf, rgorgaoemissor, pispasep, banconome, bancoagencia, bancoconta, bancotipo,
//         passaport, passaportdatavisto, chegadabrasil, tituloeleitoral, titulozona, titulosecao, nomemae, nomepai, email, password } = req.body
//     let id_params = parseInt(id)
//     try {
//         if (nome === '' || dataNasc === '' || naturalidade === '' || nacionalidade === '' || estadoCivil === '' ||
//             sexo === '' || logradouro === '' || bairro === '' || cidade === '' || estado === '' || cep === '' ||
//             telefone === '' || niveldeformacao === '' || cpf === '' || rg === '' || rgemissao === '' ||
//             rguf === '' || rgorgaoemissor === '' || pispasep === '' || banconome === '' || bancoagencia === '' ||
//             bancoconta === '' || bancotipo === '' || passaport === '' || passaportdatavisto === '' || chegadabrasil === '' ||
//             tituloeleitoral === '' || titulozona === '' || titulosecao === '' || nomemae === '' || nomepai === '' || email === '' || password === '') {
//             return res.status(402).send({ "msg": "Algum está vazio" })
//         }
//         if (isNaN(id_params)) {
//             res.status(400).send({ "msg": "Parametro faltando na url!" })
//         } else {
//             await database.where({ id: id_params }).update(req.body).table("pessoa").then(data => {
//                 if (data == 0) {
//                     return res.status(404).send({ "msg": "Não encontrado!" })
//                 }
//                 return res.status(200).send({ "msg": "Atualizado com sucesso!" })

//             }).catch(err => {
//                 return res.status(403).send({ "msg": "Solicitação inválida" })
//             })
//         }
//     } catch (error) {
//         res.send({ "msg": "Erro desconhecido! " + error })
//     }
// }
module.exports = {
    show: show, 
    // showOne: showOne,
    create: create,
    // deleteF: deleteF,
    // update: update,
    login: login
}