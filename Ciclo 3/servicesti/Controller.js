const express=require('express');
const cors=require('cors');
const {op}=require('sequelize');

const models=require('./models');
const req = require('express/lib/request');
const res = require('express/lib/response');

const app=express();
app.use(cors());
app.use(express.json());

let cliente=models.Cliente;
let servico=models.Servico;
let pedido=models.Pedido;

app.get('/', function(req,res){
    res.send('Olá mundo!');
});

app.get('/clientes', async(req,res)=>{
    let create=await cliente.create(
        req.body
    );
    res.send('Cliente foi adicionado!');
});

app.post('/servicos', async(req,res)=>{
    let create=await servico.create(
        req.body
    );
    res.send('Serviço foi inserido!');
});

app.post('/pedidos', async(req,res)=>{
    let create=await pedido.create(
        req.body
    );
    res.send('O pedido foi aceito!');
});

app.get('/pedidos', async(req,res)=>{
    let create=await pedido.create({
        idCliente:"1",
        idServico:"1",
        valor:"250.00",
    });
    res.send('Pedido aceito!');
});

app.get('/listaservicos', async(req,res)=>{
    await servico.findAll({
        order:[['nome','DESC']]
    }).then(function(servicos){
        res.json({servicos})
    });
});

app.get('/ofertas', async(req,res)=>{
    await servico.count('id')
    .then(function(servicos){
        res.json(servicos);
    });
});

app.get('/servico/:id',async(req,res)=>{
    servico.findByPk(req.params.id)
    .then(servico=>{
        return res.json({
            error:false,
            servico
        });
    }).catch(function(erro){
        return res.status(400).json({
            error:true,
            message:"Código não está cadastrado!"
        });
    });
});

//Todos os clientes
app.get('/listaclientes',async(req, res)=>{
    await cliente.findAll({
        raw: true
    }).then(function(clientes){
        res.json({clientes})
    });
});

//Todos os clientes em ordem de antiguidade
app.get('/listaclientesantig',async(req, res)=>{
    await cliente.findAll({
        order:[['createdAt']]
    }).then(function(clientes){
        res.json({clientes})
    });
});

//Todos os pedidos
app.get('/listapedidos',async(req, res)=>{
    await pedido.findAll({
        raw: true
    }).then(function(pedidos){
        res.json({pedidos})
    });
});

//Todos os pedidos em ordem de valor
app.get('/listapedidosvalor',async(req, res)=>{
    await pedido.findAll({
        order:[['valor','DESC']]
    }).then(function(pedidos){
        res.json({pedidos})
    });
});

//Numero de clientes
app.get('/numclientes',async(req, res)=>{
    await cliente.count('id')
    .then(function(clientes){
        res.json({clientes})
    });
});

//Numero de pedidos
app.get('/numpedidos',async(req, res)=>{
    await pedido.count('id')
    .then(function(pedidos){
        res.json({pedidos})
    });
});

//Soma dos gastos de um cliente
app.get('/totalgasto/:id',async(req,res)=>{
    await pedido.sum('valor',{
        where:{
            ClienteId:{[Op.eq]:req.params.id}
        }
    }).then((pedido)=>{
        return res.json({pedido})
    });
});

//alterações
app.get('/atualizaservico',async(req,res)=>{
    await servico.findByPk(1)
    .then(servico=>{
        servico.nome='HTML/CSS/JS';
        servico.descricao='Páginas estáticas e dinâmicas estilizadas';
        servico.save();
        return res.json({servico});
    });
});

app.put('/editarservico',(req,res)=>{
    servico.update(req.body,{
    where:{id:req.body.id}
    }).then(function(){
        return res.json({
            error:false,
            message:"Serviço foi alterado com sucesso."
        });
    }).catch(function(erro){
        return res.status(400).json({
            error:true,
            message:"Erro na alteração do serviço."
        });
    });
});

app.get('/servicospedidos',async(req,res)=>{
    await servico.findByPk(1,{
        include:[{all:true}]
    }).then(servico=>{
        return res.json({servico})
    });
});

app.put('/editarpedidos',(req,res)=>{
    pedido.update(req.body,{
        where:{ServicoId: req.body.ServicoId}
    }).then(function(){
        return res.json({
            error:false,
            message:"Pedido modificado com sucesso."
        });
    }).catch(function(error){
        return res.status(400).json({
            error:true,
            message: "Não foi possível modificar o pedido."
        });
    });
});

app.get('/excluircliente',async(req,res)=>{
    cliente.destroy({
        where:{id:2}
    });
});

app.delete('/apagarcliente/:id',(req,res)=>{
    cliente.destroy({
        where:{id:req.params.id}
    }).then(function(){
        error:false;
        message:"Cliente foi excluído com sucesso."
    });
}).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Não foi possível excluir o cliente."
        });
    });

//INDICADOR DE SERVIDOR ATIVO
let port=process.env.PORT || 3000;

app.listen(port,(req,res)=>{
    console.log('Servidor ativo');
});