"user-strict";
function validaUser(){
    const nome = document.getElementById("nome");
    if (nome.value == "João"){
      const pass = document.getElementById("pass");
      if (pass.value == "123"){
        
        alert("Seja bem Admin:"+" "+nome.value);
        
        
        return(action="/back/dist/index.html");
      }
    }
    alert("Epa Amigo secalhar estas no sitio errado");
    location.reload();
    
  }
(function(){
    //Codigo para abrir e fechar barra lateral
    $("#menu-toggle").click(function (e) {
        e.preventDefault();
        $(".side-nav").toggleClass("toggled");
    });
    
    //botão go to top
    const gototop = document.querySelector("#floatBtn");
    gototop.addEventListener("click", ()=>{window.scrollTo({top:0,behavior:"smooth"})});

    //Favoritos
    var favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    // add class 'fav' to each favorite
    favorites.forEach(function(favorite) {
    document.getElementById(favorite).className = 'fav';
    });
    // register click event listener
    document.querySelector('.list').addEventListener('click', function(e) {
      var id = e.target.id,
      item = e.target,
      index = favorites.indexOf(id);
    // return if target doesn't have an id (shouldn't happen)
      if (!id) return;
    // item is not favorite
      if (index == -1) {
      favorites.push(id);
      item.className = 'fav';
    // item is already favorite
    } else {
      favorites.splice(index, 1);
      item.className = '';
    }
    // store array in local storage
    localStorage.setItem('favorites', JSON.stringify(favorites));
    });
    
    //Registo de utilizador e login
    const regForm = document.querySelector("#myMReg");
    const loginForm = document.querySelector("#myMlogin");
    regForm.addEventListener("submit", (event)=>{
        event.preventDefault();
        const fields = event.currentTarget.querySelectorAll("input");
        const name = fields[0].value;
        const email = fields[1].value;
        const password = fields[2].value;
        const pwrepeat = fields[3].value;
        if(password !== pwrepeat){
            console.log("Passwords don't match!");
            return
        }
        const user = {
            name:name,
            email:email,
            password:password
        }
        
        const users = JSON.parse(localStorage.getItem("users")) ? JSON.parse(localStorage.getItem("users")) : [];
            users.push(user);
            localStorage.setItem("users",JSON.stringify(users));
            let mod=document.getElementById("myMRegForm");   
            $("#myMRegForm").modal('hide');      
            alert("Utilizador"+" "+name+" Registrado com sucesso");
    });
    loginForm.addEventListener("submit", (event)=>{
        event.preventDefault();
        const fields = event.currentTarget.querySelectorAll("input");
        const name = fields[0].value;
        const password = fields[1].value;
        const users = JSON.parse(localStorage.getItem("users"));

        const foundUser = users.filter((u)=>{
            if(u.name === name && u.password === password){
                return u;
            }
        });
    
            if(foundUser.length > 0){
            console.log("Welcome "+foundUser[0].name);
            let layer = document.createElement("p");
            let welcomeU = document.createTextNode("Welcome"+" "+foundUser[0].name);
            layer.appendChild(welcomeU);
            let element = document.getElementById("NameUser");
            element.appendChild(layer);
            let prefs=document.getElementById("myprefs");
            prefs.style.display="block";
            let mod=document.getElementById("myMloginForm");   
            $("#myMloginForm").modal('hide');      
            alert("Bem vindo"+" "+foundUser[0].name);       
            }else{
            alert('Username ou Password estão errados.');
            console.log("Username ou Password estão errados.");
            
        }
        
    
});
    
        
    

}());