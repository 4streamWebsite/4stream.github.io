//importação de modulos
const express = require ("express")
const router=express.Router()
const db = require('../models/db')
const Categoria=require('../models/Categoria')
const categoria = require("../models/Categoria")
const Filme=require('../models/Filme')
const User = require("../models/user")
const{eAdmin}= require("../helpers/eAdmin")

//Segmento Admin HomePage
router.get('/', eAdmin, function(req,res){
    res.render("admin/index")
})

// Dashboard admin
router.get('/admin', (req, res) =>
  res.render('admin', {
    user: req.body.nome
  })
);


//segmento de Filmes
//rota de get filmes com proteção de user
router.get('/filmes',eAdmin,function(req,res) {
    Filme.findAll().then((filmes)=>{//pesquisa de todos os filmes
        res.render("admin/filmes", {filmes:filmes})
    }).catch((err)=>{
        req.flash("error_msg", "Houve um erro pá... desculpa")
        res.redirect("/admin/filmes")
    })
    

})
//rota de get para adição de filme
router.get("/filmes/add", (req,res) =>{
    Categoria.findAll().then((Categoria)=>{//pesquisa de toda as categorias e injeccao no formulario add filmes
        res.render("admin/addfilmes", {Categoria:Categoria})
    }).catch((err)=>{
       req.flash("error_msg", "houve um erro" +err) 
       res.redirect("admin/addfilmes")
    })    
})
//rota post para inserir novo filme
router.post("/filmes/novo",(req,res)=>{
    let erros=[]//array de erros
    //validações 
    if(req.body.categoria=="0"){
        erros.push({etext:"Categoria inválida, tem te adicionar uma categoria primeiro"})
    }
    if(erros.length>0){
        res.render("admin/addfilmes", {erros:erros})
    }else{Filme.create({//insercao dos campos na base de dados
        Nome:req.body.nome,
        NomePT:req.body.nomept,
        DuracaoFilme:req.body.duracao,
        AnoLancamento:req.body.anoL,
        CustoTotal:req.body.custoTotal, 
        categoria:req.body.categoria,   
        linkimdb:req.body.linkimdb,
        linkimdb:req.body.linkyoutube
    }).then(function(){
        req.flash("success_msg","Filme Adicionado com sucesso")
        res.redirect('/admin/filmes')        
        console.log("Categoria salva com sucesso")
    }).catch(function(erro){
        req.flash("error_msg","Algo não esta certo foi apanhado no catch de adicção de filmes")
        res.send("opa deu porcaria tenta ver o codigo no novo Filme" +erro)
    })}   
})
//rota de edicao de filmes atraves do ID
router.get("/filmes/edit/:id", (req,res)=>{
    Filme.findOne({where:{'id':req.params.id}}).then(function(Filme) {//encontra um Filme por ID
        Categoria.findAll().then(function(Categoria){//procura as categorias
            res.render('admin/editfilmes',{Categoria:Categoria, Filme:Filme}) //injecta as categorias e filmes
            
        }).catch((err)=>{
            req.flash("error_msg", "houve um erro a carregar as categorias")
            res.redirect("/admin/filmes")            
        })
    }).catch(function(erro){
        req.flash("error_msg","opa deu porcaria tenta ver o codigo"+erro)
        res.redirect("/admin/filmes")
       })    
    
})
//Edição dos dados Filme [POST]
//rota de edicao para insercao da edicao dos filmes
router.post("/filmes/edit", (req,res) =>{
    Filme.findOne({where:{'id':req.body.id}}).then(function(Filmes) {
        Filmes.update(
            {Nome:req.body.nome,
                NomePT:req.body.nomept,
                DuracaoFilme:req.body.duracao,
                AnoLancamento:req.body.anoL,
                CustoTotal:req.body.custoTotal, 
                categoria:req.body.categoria,   
                linkimdb:req.body.linkimdb,
                linkyoutube:req.body.linkyoutube
            } //nome do campo que vai ser trocado na bd tabela filmes
        )
        req.flash("success_msg","Editado com sucesso")
        res.redirect("/admin/filmes")
    }).catch(function (erro) {
        req.flash("error_msg", "houve um erro a editar o filme" +erro)
        res.redirect("/admin/filmes")
    })

})
//rota de apagar filme
router.post("/filmes/delete/",function(req,res){
    Filme.destroy({where:{'id':req.body.id}}).then(function(){
        req.flash("success_msg", "iupi apagaste me com sucesso")
        res.redirect("/admin/filmes")
    }).catch(function(erro){
        req.flash("error_msg","opa deu porcaria tenta ver o codigo não consigo apagar" +erro)
       res.redirect("/admin/filmes")
    })
})
//fim Segmento Filmes
//Segmento de Categorias
//pagina geral de categorias
router.get("/categorias",function(req,res) {
    Categoria.findAll().then(function(Categoria){//pesquisa todos 
        res.render('admin/categorias',{Categoria: Categoria})
    }).catch(function(erro){
     req.flash("error_msg","opa deu porcaria tenta ver o codigo" +erro)
        res.redirect("/admin")
    })
})
//pagina de adicionar uma categoria
router.get('/categorias/add',function(req,res) {
    res.render('admin/addcategorias')
})
//pagina de edicao de categoria
router.get("/categorias/edit/:id",function (req,res){
    Categoria.findOne({where:{'id':req.params.id}}).then(function(Categoria) {
        res.render("admin/editcategorias", {Categoria:Categoria})
    }).catch(function(erro){
        req.flash("error_msg","opa deu porcaria tenta ver o codigo"+erro)
        res.redirect("/cat")
       })    
})
//pagina de delete de uma categoria
router.post("/categorias/delete/",function(req,res){
    Categoria.destroy({where:{'id':req.body.id}}).then(function(){//pesquisa por ID da categoria e apaga a categoria selecionada
        req.flash("iupi apagaste me com sucesso")
        res.redirect("/admin/categorias")
    }).catch(function(erro){
        req.flash("error_msg","opa deu porcaria tenta ver o codigo não consigo apagar" +erro)
       res.redirect("/admin/categorias")
})
   
})
//envio de pedido de nova categoria ao precionar o envio do formulario [POST]
//criacao de nova postagem
router.post("/categorias/nova",function(req,res) {
    var erros=[]//variaveis 
    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome==null){//checks
        erros.push({etext:"nome é um dado requerido"})        
    }
    if(req.body.nome.length < 2){
        erros.push({etext:"nome demasiado curto"}) //etext texto de erro
    }
    if(erros.length >0){
        res.render("admin/addcategorias", {erros: erros})
    }else{Categoria.create({//adiciona na base dados 
        nome:req.body.nome    
    }).then(function(){
        req.flash("success_msg","Categoria salva com sucesso")
        res.redirect('/admin/categorias')        
        console.log("Categoria salva com sucesso")
    }).catch(function(erro){
        req.flash("error_msg","opa deu porcaria tenta ver o codigo")
        res.send("opa deu porcaria tenta ver o codigo" +erro)
    })}
       
})
//Edição de Categoria [POST]
//edição de categoria atraves de id
router.post("/categorias/edit",function (req,res) {
    Categoria.findOne({where:{'id':req.body.id}}).then(function(Categoria) {//pesquisa o id e faz update na bd
        Categoria.update(//chama o model categoria e faz um update ao campo nome
            {nome:req.body.nome} //nome do campo que vai ser trocado na bd tabela categoria
        )
        req.flash("success_msg","Editado com sucesso")
        res.redirect("/admin/categorias")
    }).catch(function (erro) {
        req.flash("error_msg", "houve um erro a editar a categoria" +erro)
        res.redirect("/admin/categorias")
    })
})
//Segmento Users:
//rota get para ir buscar todos os utilizadores
router.get('/users',function(req,res) {
    User.findAll().then((users)=>{//query para ir buscar todos os user, usa o model User
        res.render("admin/users", {users:users})
    }).catch((err)=>{
        req.flash("error_msg", "Houve um erro pá... desculpa")
        res.redirect("/admin/")
    })
    
//tornar admin
//rota para tornar admin
router.get("/users/edit/:id",function (req,res){
    User.findOne({where:{'id':req.params.id}}).then(function(users) {//pesquisa um utilizador pelo id e emite os dados por variavel user user para ser usado na edicao os campos
        res.render("admin/editusers", {users:users})
    }).catch(function(erro){
        req.flash("error_msg","opa deu porcaria tenta ver o codigo"+erro)
        res.redirect("/admin/users")
       })    
})

//rota de edicao de dados do utilizador
router.post("/users/edit",function (req,res) {
    User.findOne({where:{'id':req.body.id}}).then(function(users) {//pesquisa do user e faz update por id.
        users.update(
            {nome:req.body.nome,
            email:req.body.email,
            eAdmin:req.body.eAdmin
            } //nome do campo que vai ser trocado na bd tabela categoria
        )
        req.flash("success_msg","User editado com sucesso")
        res.redirect("/admin/users")
    }).catch(function (erro) {
        req.flash("error_msg", "houve um erro a editar a categoria" +erro)
        res.redirect("/admin/users")
    })
})                        


//pagina de delete de um user
router.post("/users/delete/",function(req,res){//destroy o user atraves de ID
    User.destroy({where:{'id':req.body.id}}).then(function(){
        req.flash("iupi apagaste me com sucesso")
        res.redirect("/admin/users")
    }).catch(function(erro){
        req.flash("error_msg","opa deu porcaria tenta ver o codigo não consigo apagar" +erro)
       res.redirect("/admin/")
    })
})


})
module.exports=router