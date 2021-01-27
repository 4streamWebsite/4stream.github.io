const db = require('./db')

const Filme=db.sequelize.define('filmes', {
    Nome:{
        type:db.Sequelize.TEXT,
        allownull:false
    },
    NomePT:{
        type:db.Sequelize.TEXT,
        allownull:false
    },
    DuracaoFilme:{
        type:db.Sequelize.INTEGER,
        allownull:false
    },
    AnoLancamento:{
        type:db.Sequelize.DATEONLY,
        allownull:false
    },
    CustoTotal:{
        type:db.Sequelize.INTEGER,
        allownull:false
    },
    categoria:{
        type:db.Sequelize.TEXT,
        allownull:false
    },
    linkimdb:{
        type:db.Sequelize.TEXT,
        allownull:false
    },
    linkyoutube:{
        type:db.Sequelize.TEXT,
        allownull:false
    }

    
});

Filme.associate=models =>{
    Filme.belongsTo(models.Categoria,{
        foreignkey :{
           categoria,
           allownull:false
        }
   })
}

//Filme.sync({force:true})
module.exports=Filme