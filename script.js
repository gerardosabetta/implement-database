// Si el usuario no esta identificado, lo mandamos al login

const jwt = localStorage.getItem("jwt");
const decodedJwt = parseJwt(jwt);

if (!jwt) {
  window.location.href = "/login.html";
}

const saludo = document.getElementById("saludo");

saludo.innerText = `Hola ${decodedJwt.usuario}!!!`;

const logOutButton = document.getElementById("log-out");

logOutButton.addEventListener("click", logOut);
function logOut() {
  localStorage.removeItem("jwt");
  window.location.href = "/login.html";
}
