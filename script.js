// Si el usuario no esta identificado, lo mandamos al login

const jwt = localStorage.getItem("jwt");

if (!jwt) {
  window.location.href = "/login.html";
}

const decodedJwt = parseJwt(jwt);

const saludo = document.getElementById("saludo");
const listaDeProductosContainer = document.getElementById("lista-de-productos");

displayAllProducts();

saludo.innerText = `Hola ${decodedJwt.usuario}!!!`;

const logOutButton = document.getElementById("log-out");

logOutButton.addEventListener("click", logOut);
function logOut() {
  localStorage.removeItem("jwt");
  window.location.href = "/login.html";
}

async function displayAllProducts() {
  listaDeProductosContainer.innerHTML = null;
  const allProducts = await getAllProducts();

  allProducts.forEach((product) => {
    const productLi = document.createElement("li");
    productLi.textContent = `${product.nombre} (${product.vendedor_email}) 
    ${
      product.comprador_id
        ? `Comprado por ${product.comprador_id}`
        : "Disponible!"
    }`;

    const botonComprar = document.createElement("button");
    botonComprar.textContent = "Comprar!";

    botonComprar.addEventListener("click", async () => {
      const res = await buyProduct(product.producto_id);
      console.log(res);
      displayAllProducts();
    });

    if (!product.comprador_id) {
      productLi.appendChild(botonComprar);
    }

    listaDeProductosContainer.appendChild(productLi);
  });
}

async function getAllProducts() {
  const res = await fetch("http://localhost:3000/products", {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  });
  const resAsJson = await res.json();

  return resAsJson;
}

async function buyProduct(id) {
  const res = await fetch(`http://localhost:3000/comprar/${id}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  });

  const resAsJson = await res.json();

  return resAsJson;
}
