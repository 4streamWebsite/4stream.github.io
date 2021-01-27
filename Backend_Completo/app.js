//declaracao de encriptacao das variaveis
if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}
//importacao de bibliotecas
const express=require("express");
const app=express();
const handlebars=require('express-handlebars')
const engine = require('engine-handlebars')(handlebars);
const bodyparser=require('body-parser')
const admin=require("./routes/admin")
const path= require("path")
const session=require("express-session")
const flash = require('connect-flash')
const Categoria=require('./models/Categoria')
const Filme=require('./models/Filme')
const user=require("./routes/users")
const User=require('./models/user');
const passport = require("passport");
const categoria = require('./models/Categoria');



require("./config/auth")(passport)




//config
    //configuracao da sessao 
    app.use(session({
        secret:process.env.SESSION_SECRET,
        resave:false,
        name:'session.4stream.sid',
        saveUninitialized:false,
        cookie:  {maxAge: 30 * 60 * 1000}
    }))
    //utilizacao de passport
    app.use(passport.initialize())
    app.use(passport.session())
    //utilizacao do flash para mostrar as mensagens
    app.use(flash())

    //Middleware
    app.use(function(req,res,next) {
        res.locals.success_msg= req.flash("success_msg")//manda as mensagens de sucesso
        res.locals.error_msg= req.flash("error_msg")//manda as mensagens de erro
        res.locals.error=req.flash("error")//manda as mensagens de erro em geral
        res.locals.user= req.user || null;//utilizacao da variavel user a nivel global para confirmar o login nas funcoes
        next()
    })
   
    //template engine handlebars   
    app.engine('handlebars', handlebars({defaultLayout: 'main',
        runtimeOptions: {
            allowProtoPropertiesByDefault: true,
            allowProtoMethodsByDefault: true,
        },
    }))

    app.set("view engine", "handlebars");
     
    //Body parser
    app.use(bodyparser.urlencoded({extended:false}))
    app.use(bodyparser.json())
    //Declaracao da public
    app.use(express.static(path.join(__dirname,"public")))
//connect to db
    const dbconnect=require(__dirname+ '/models/db.js')
//rotas
//rota sem categorias a funcionar para os filmes só usar em caso de urgencia
    app.get('/', function(req,res) {
        Filme.findAll().then((filmes)=>{
            res.render("index", {filmes:filmes})
        }).catch((err)=>{
            req.flash("error_msg","houve um erro intero desculpe")
            res.redirect("/404")
        })        
    })
    
//rota de categorias
app.get('/categorias', function(req,res) {
    Filme.findAll().then((filmes)=>{
        
            res.render("categorias/", {filmes:filmes})
        
            
    }).catch((err)=>{
        req.flash("error_msg","houve um erro intero desculpe")
        res.redirect("/404")
    })        
})
    
//rota de users
    app.get("/users", (req,res)=>{
        User.findAll().then((users)=>{
            res.render("users/index", {users:users})
        }).catch((err)=>{
            req.flash("error_msg", "Ups houve um erro na lista de categorias")
            res.redirect("/")
        })
    })
//rota de 404
    app.get("/404", (req,res)=>{
        res.send("erro 404!")
    })
    //utilizacao da rota de admin e user
    app.use('/admin', admin)
    app.use("/users", user)

        
    //porta de listagem
app.listen(3000,function(){console.log("estou a correr deixa-me em paz")})