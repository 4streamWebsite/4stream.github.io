const db = require('./db')

const favoritos=db.sequelize.define('favoritos', {
    filme:{
        type:db.Sequelize.INTEGER,
        allownull:false
    },
    email:{
        type:db.Sequelize.INTEGER,
        allownull:false
    },
    
});

//favoritos.sync({force:true})
module.exports=favoritos