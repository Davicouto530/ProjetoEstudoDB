const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const app = express();
//Vamos carregar as middlwares
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("combined"));

//Conexão com o servidor de banco de dados
const urldb = "mongodb+srv://senac:123senac@projetonode.ynvnv.mongodb.net/ProjetoEstudoDB?retryWrites=true&w=majority&appName=ProjetoNode";

//estabelecer a conexão com o banco de dados
mongoose.connect(urldb,{useNewUrlParser:true, useUnifiedTopology:true});

//Definir a estrurura dos dados
const schema = new mongoose.Schema({
    nome: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    cpf: { type: String, unique: true, required: true },
    telefone: { type: String },
    idade: { type: Number, min: 16, max: 120 },
    usuario: { type: String, unique: true },
    senha: { type: String },
    datacadastro: { type: Date, default: Date.now }
});

//Criar este modelo de dados no banco mongoose, (Criar tabela)
const Cliente = mongoose.model("tbclientes" ,schema);

app.get("/", (req, res) => {
    Cliente.find().then((result) => {
        res.status(200).send({ output: "ok", payload: result });
    }).catch((erro) => {
        res.status(500).send({ output: `Erro ao processar dados -> ${erro}` });
    });
});

app.get("/projeto/teste",(req,res) => {
    res.send("Você está em outro endpoint")
});

app.post("/cadastro",(req,res)=> {
    const rs = new Cliente(req.body);
    rs.save().then((result,error) => {
        if(error){
            return res.status(500).send({msg: "Erro ao cadastrar"})
        }else {
            res.status(201).send({msg: result})
        }
    })
    .catch((er)=>res.status(500).send({msg:er}));
});

app.put("/update/:id", (req, res) => {
    Cliente.findByIdAndUpdate(req.params.id, req.body, { new: true }).then((result) => {
        if (!result) {
            return res.status(400).send({ output: "Não foi possível atualizar" });
        }
        res.status(202).send({ output: "Atualizado", payload: result });
    }).catch((erro) => {
        res.status(500).send({ output: `Erro ao processar a solicitação -> ${erro}` });
    });
});

app.delete("/delete/:id", (req, res) => {
    Cliente.findByIdAndDelete(req.params.id).then((result) => {
        res.status(204).send({ payload: result });
    }).catch((erro) => {
        console.log(`Erro ao tentar apagar -> ${erro}`);
    });
});

app.use((req, res) => {
    res.type("application/json");
    res.status(404).send("404 - Not Found")
})

//Configurações do servidor 
app.listen("5000",()=> console.log("Servidor online em http://127.0.0.1:5000"));