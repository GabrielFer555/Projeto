const express = require('express');
const app = express();
const cors = require('cors');
app.use(express.json());

app.use(cors());
app.get('/', async (req, res, next) => {
    console.log("GET");
});


const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();
app.post("/checklogin", async(req, res) => {
    console.log(req.body);
    const data = await prisma.users.findFirst({
        where:{
            nome:req.body.nome,
            password: req.body.password
        }
    })
    if(!data){
        console.log('no');
        return res.status(404).json({message:"Erro: Not Found"})
    }
    else{
        console.log('yes')
        return res.status(200).json({message:"Logado!"});
    }
})

app.post("/createaccount", async(req, res) => {
    console.log(req.body);
    const nome = req.body.nome;
    const password = req.body.password;
    const data = await prisma.users.findFirst({
        where:{
            nome:req.body.nome,
            password: req.body.password
        }
    })
    if(data){
        return res.status(200).json({message:"Usuário já existe"})
    }else{
        console.log(req.body);
        try{
            const creation = await prisma.users.create({
                data:{
                    nome:nome, 
                    password: password
                }
            })
            return res.status(400).json({message:"Usuário criado"})
        }
        catch (error){
            console.log(error)
            return res.status(404).json({message: "Algo deu errado"})
        }
    }
})




app.listen(8080, function () {
    console.log('listening on port 8080');
    
})