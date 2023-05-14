const express = require('express');
const app = express();
const cors = require('cors');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
app.use(express.json());

app.use(cors());
app.get('/', async (req, res, next) => {
    console.log("GET");
});


const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
app.post("/checklogin", async (req, res) => {
    console.log(req.body);
    const {nome, password} = req.body;
    
    const temUser = await prisma.users.findFirst({
        where: {
            nome: nome,
        }
    })
    if (!temUser) {
        console.log('no');
        return res.status(404).json({ message: "Erro: Not Found" })
    }
    else {
        console.log('yes')
        const isPasswordValid = await bcrypt.compare(password,temUser.password)
        if(isPasswordValid) {
            return res.status(200).json({ message: "Logado!" });
        }
        else{
            return res.status(404).json({ message: "Erro: Not Found" })
        }
    }
})
app.post('/checkregister', async (req, res) => {
    const user = req.body.nome;
    const verification = await prisma.users.findFirst({
        where: {
            nome: user
        }
    })
    if (verification) {
        return res.status(200).json({ message: "Usuário já existe!" });
    } else {
        return res.status(404).json({ message: "Usuário não encontrado!" });
    }
})

app.post('/createaccount',
    async (req, res) => {
        console.log(req.body.password)
        const { nome, password } = req.body;
        const salt = await bcrypt.genSalt(10);
        const encryptedPassword = await bcrypt.hash(password, salt);

        const user = await prisma.users.create({
            data: {
                nome: nome,
                password: encryptedPassword
            }
        });
        return res.status(201).json({ message: 'Usuário criado com sucesso!' });

    }
);

app.listen(8080, function () {
    console.log('listening on port 8080');

})