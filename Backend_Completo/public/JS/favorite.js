function marcaFavoritos(favbooks) {
    const btnFIcon = document.getElementsByClassName("favorite-icon");
    for (let i = 0; i < btnFIcon.length; i++) {
      btnFIcon[i].src = "img/AddFav.png";
      btnFIcon[i].style.display = "inline";
    }
    favbooks.forEach((fav) => {
      document.getElementById(`fav${fav.bookid}`).src = "img/Favorito.png";
    });
  }

  function criaClickEventoFavoritos() {
    const token = localStorage.token;
    if (token == undefined) {
      alert("Falta autenticação!");
      return;
    }
    const btnFIcon = document.getElementsByClassName("favorite-icon");
    for (let i = 0; i < btnFIcon.length; i++) {
      btnFIcon[i].addEventListener("click", () => {
        const bookid = btnFIcon[i].id.substring(3);
        fetch(`${urlBase}/clickFavorito`, {
          method: "POST",
          body: `item=${bookid}`,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${token}`,
          },
        })
          .then((response) => {
            return response.json();
          })
          .then((result) => {
            marcaFavoritos(JSON.parse(result.favoritos));
          });
      });
    }
  }



