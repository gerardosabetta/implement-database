// esta funcion de utilidad sirve para poder ver el JWT en el frontend y mostrar el nombre de usuario
// Los JWT estan codificados en base64 y pueden ser desencondificados
// Esto no representa un problema de seguridad, mientras el frontend no sepa el secreto, no va a poder modificar el JWT y cambiar su info

function parseJwt(t) {
  const decoded = JSON.parse(window.atob(t.split(".")[1]));
  return decoded;
}
