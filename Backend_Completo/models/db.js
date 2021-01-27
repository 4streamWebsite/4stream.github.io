
const Sequelize=require('sequelize')
//dados de ligacao a base de dados
const sequelize= new Sequelize("postapp","root","Qwerty",{
    host:"localhost",
    dialect:'mysql'

})

sequelize.authenticate().then(function(){
    console.log("estou ligado a bd")
}).catch(function(erro){
    console.log("ups fizeste bosta, nao funcionou"+erro)
})

module.exports={
    Sequelize:Sequelize,
    sequelize:sequelize
}