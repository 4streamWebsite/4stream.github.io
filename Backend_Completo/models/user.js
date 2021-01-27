const db = require('./db')

const User=db.sequelize.define('users', {
    email: {
        type: db.Sequelize.STRING,        
        allowNull: false,
      },
    nome: {
        type: db.Sequelize.STRING,
        allowNull: false,
      },
    username: {
        type: db.Sequelize.STRING,
        allowNull: false,
      },
    password: {
        type: db.Sequelize.STRING,
        allowNull: false,
      },
    eAdmin:{
          type:db.Sequelize.INTEGER,
          default:0
      }
});

//User.associate = models =>{
  //  User.hasMany(models.Post,{
    //    onDelete:"cascade"
    //})

    //User.hasOne(models.Post,{
     //   onDelete:"cascade"
    //})
//}

//User.sync({force:true})
module.exports=User