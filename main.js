function handleClick(tipo) {
    alert(`Você selecionou: ${tipo}`);
  }
document.getElementById("formPontuacao").addEventListener("submit", function(e) { //Aceita input via submit no forms.
  e.preventDefault();

  const nome = document.getElementById("nomeUsuario").value; //Aqui corta e descobre nome

  fetch("https://script.google.com/macros/s/AKfycbwuJ-XLX_zIFr1zA0vyS4Ac94qxHpWNHqmJVGIJ_cRNRDa7LYlLovEfgTeIXLUKwSs_Hg/exec", { //Ainda vou implantar o server.
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: "nome=" + encodeURIComponent(nome)
  })
  .then(response => response.text())
  .then(data => {
    document.getElementById("mensagemResposta").innerText = data;
    document.getElementById("formPontuacao").reset();
  })
  .catch(error => {
    document.getElementById("mensagemResposta").innerText = "Erro ao enviar dados.";
    console.error(error);
  });
});

