const express = require ("express")
const router=express.Router()
const db = require('../models/db')
const user=require("../models/user")
const bcrypt=require("bcrypt")
const User = require("../models/user")
const passport = require("passport")
const nodemailer=require("nodemailer")
const Swal = require('sweetalert2')
const Filme= require("../models/Filme")
const Categoria=require('../models/Categoria')

//configurações de Email
let transporter=nodemailer.createTransport({ //função de configuracao de dados de email
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true, 
    auth: {
        user: process.env.EMAIL_NAME,
        pass: process.env.EMAIL_PASS
    }
})
//Rota Get pra chamar a pagina de registo
router.get("/registo", (req,res)=>{
    res.render("users/registo")
})
//Rota Post para processar os dados validar valores recebidos e se tudo ok sumeter
router.post("/registo",  (req,res)=>{
    let erros=[]//array para listar os respectivos, é possivel ter mais do que um erro a aparecer
    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome==null){ //confirmacao de nome diferente de null undefined ou vazio
        erros.push({etext: "Nome Invalido"})
    }
    if(!req.body.email || typeof req.body.email == undefined || req.body.email==null){//confirmacao de email diferente de null undefined ou vazio
        erros.push({etext: "Nome Email Invalido"})
    }
    if(req.body.password.length < 4){ //password tem de ser maior que 4 caracteres
        erros.push({etext: "Password é demasiado curta"})
    }
    if(req.body.password != req.body.password2){ //password tem de ser iguais
        erros.push({etext: "As Passwords não são iguais"})
    }

    if(erros.length >0){//funcao se, se tiver erros usa o flash para mostrar os erros senão passa para o else
        res.render("users/registo", {erros:erros})
    }else{
        user.findOne({where:{email:req.body.email}}).then((user)=>{//pesquisa se o email não se encontra ja registado na base de dados, se já existir barra o if
            if(user){
                req.flash("error_msg", "já existe 4Streamer registado com esse email tenta antes fazer login")
                res.redirect("/")
            }else{//processo de encryptacao e envio de email e salvar na bd
                
                bcrypt.hash(req.body.password, 10, (err,hash)=>{//processo de encryptacao e inserção na Bd
                    User.create({
                        email:req.body.email,
                        nome:req.body.nome,
                        password:hash,
                        username:req.body.username
                    })
                transporter.sendMail({//processo de envio de email
                    from: "4Stream <4streamual@gmail.com>",
                    to: req.body.email,
                    subject:" Bem vindo ao 4Stream",
                    text: "olá, bem vindo 4streamer",
                    html:"<img src='https://i.ibb.co/VTsN8Q1/Logo4.png' style='width: 100px' alt='4Stream Logo'/><br>Olá 4streamer</h4<br><h4>Bem vindo ao maior site de Streaming nacional</h4><br><p>a tua conta esta confirmada</p><a href='http://www.4stream.website/login'> clicka aqui para fazeres login</a>" 
                    
                    }).then(message=>{ //controlo de erro email then e catch
                        console.log(message);
                    }).catch(err=>{
                        console.log(err)
                    })
                })
                req.flash('success_msg', 'Conta 4Stream registada, vai ao teu email para confirmar a tua conta')//mensagem de sucesso de registo
                res.redirect('/users/login')//fw para a pagina de login
            }
            
        }).catch((err)=>{//catch geral caso a registo como uma funcao tenha falhado
            req.flash("erro_msg", "Houve um erro interno no registo")
            res.redirect("/")  
        })
    }
})
//rota de get pagina login
router.get("/login", (req,res)=>{
    res.render("users/login")//rendirização da pagina user login
})
//rota de processamento de dados do login
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {//metodo de request auth.js para confirmação dos dados inseridos
      successRedirect: '/',//em caso de sucesso passa para a main page
      failureRedirect: '/users/login',//em caso de falha permanece na pagina de login com o respectivo erro
      failureFlash: true,
      successFlash: true 
    })(req, res, next);
  });
//rota de logout
  router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'Até a próxima B4Streamer');//mensagem de confirmação de logout
    res.redirect('/users/login');
  });
  

    

module.exports=router