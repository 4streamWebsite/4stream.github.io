const db = require('./db')

const categoria=db.sequelize.define('categoria', {
    nome:{
        type:db.Sequelize.TEXT,
        allownull:false
    },
    
});

//categoria.sync({force:true})
module.exports=categoria