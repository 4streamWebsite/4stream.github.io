module.exports={
    eAdmin: function(req,res,next){//variavel eAdmin 
        if(req.isAuthenticated() && req.user.eAdmin==1 ){
            return next()
        }
        req.flash("error_msg", "Isto não é para 4streamers so para Certified Jedis :)")
        res.redirect("/")
    }
}