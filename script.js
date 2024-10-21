const sel = (el) => document.querySelector(el);
const All = (el) => document.querySelectorAll(el);

let modalQt = 1;
let modalKey = 1;
let cart = [];

//pizza list
pizzaJson.map((item, index) => {
  //clone
  let pizzaItem = sel(".models .pizza-item").cloneNode(true);

  //fill pizza-item
  pizzaItem.setAttribute("data-key", index);
  pizzaItem.querySelector(".pizza-item--img img").src = item.img;
  pizzaItem.querySelector(
    ".pizza-item--price"
  ).innerHTML = `R$${item.price.toFixed(2)}`;
  pizzaItem.querySelector(".pizza-item--name").innerHTML = item.name;
  pizzaItem.querySelector(".pizza-item--desc").innerHTML = item.description;
  pizzaItem.querySelector("a").addEventListener("click", (e) => {
    e.preventDefault();

    //fill modal
    let key = e.target.closest(".pizza-item").getAttribute("data-key");
    modalKey = key;
    modalQt = 1;
    sel(".pizzaInfo h1").innerHTML = pizzaJson[key].name;
    sel(".pizzaBig img").src = pizzaJson[key].img;
    sel(".pizzaInfo--actualPrice").innerHTML = `R$ ${pizzaJson[
      key
    ].price.toFixed(2)}`;
    sel(".pizzaInfo--desc").innerHTML = pizzaJson[key].description;
    sel(".pizzaInfo--size.selected").classList.remove("selected");
    All(".pizzaInfo--size").forEach((s, sindex) => {
      sindex === 2 && s.classList.add("selected");
      s.querySelector("span").innerHTML = pizzaJson[key].sizes[sindex];
    });
    sel(".pizzaInfo--qt").innerHTML = modalQt;

    //show modal
    sel(".pizzaWindowArea").style.opacity = 0;
    sel(".pizzaWindowArea").style.display = "flex";
    setTimeout(() => {
      sel(".pizzaWindowArea").style.opacity = 1;
    }, 200);
  });

  //add on the sceem
  sel(".pizza-area").append(pizzaItem);
});

//modal events
All(".pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton").forEach(
  (item) => item.addEventListener("click", closeModal)
);
function closeModal() {
  sel(".pizzaWindowArea").style.opacity = 0;
  setTimeout(() => {
    sel(".pizzaWindowArea").style.display = "none";
  }, 500);
}
sel(".pizzaInfo--qtmenos").addEventListener("click", () => {
  modalQt > 1 && modalQt--;
  sel(".pizzaInfo--qt").innerHTML = modalQt;
});
sel(".pizzaInfo--qtmais").addEventListener("click", () => {
  modalQt++;
  sel(".pizzaInfo--qt").innerHTML = modalQt;
});
All(".pizzaInfo--size").forEach((size) => {
  size.addEventListener("click", (e) => {
    sel(".pizzaInfo--size.selected").classList.remove("selected");
    size.classList.add("selected");
  });
});
sel(".pizzaInfo--addButton").addEventListener("click", () => {
  let size = +sel(".pizzaInfo--size.selected").getAttribute("data-key");

  let indentifier = pizzaJson[modalKey].id + "@" + size;

  let has = cart.findIndex((item) => item.indentifier === indentifier);

  console.log(has);

  if (has > -1) {
    cart[has].qt += modalQt;
  } else {
    cart.push({
      indentifier,
      id: pizzaJson[modalKey].id,
      size,
      qt: modalQt,
    });
  }
  updateCart();
  closeModal();
});

sel(".menu-openner").addEventListener("click", () => {
  if (cart.length > 0) sel("aside").style.left = 0;
});
sel(".menu-closer").addEventListener("click", () => {
  sel("aside").style.left = `100vw`;
});

function updateCart() {
  sel(".menu-openner span").innerHTML = cart.length;

  if (cart.length > 0) {
    sel("aside").classList.add("show");

    sel(".cart").innerHTML = "";

    let subtotal = 0,
      descont = 0,
      total = 0;

    for (let i in cart) {
      let pizzaItem = pizzaJson.find((item) => item.id == cart[i].id);
      subtotal += pizzaItem.price * cart[i].qt;

      let cartItem = sel(".models .cart--item").cloneNode(true);

      const pizzaSize =
        cart[i].size === 2 ? "G" : cart[i].size === 1 ? "M" : "P";

      //fil cartItem
      cartItem.querySelector("img").src = pizzaItem.img;
      cartItem.querySelector(
        ".cart--item-nome"
      ).innerHTML = `${pizzaItem.name} (${pizzaSize})`;
      cartItem.querySelector(".cart--item--qt").innerHTML = cart[i].qt;
      cartItem
        .querySelector(".cart--item-qtmais")
        .addEventListener("click", () => {
          cart[i].qt++;
          updateCart();
        });
      cartItem
        .querySelector(".cart--item-qtmenos")
        .addEventListener("click", () => {
          if (cart[i].qt > 1) {
            cart[i].qt--;
          } else {
            cart.splice(i, 1);
          }
          updateCart();
        });

      sel(".cart").append(cartItem);
    }

    descont = subtotal * 0.1;
    total = subtotal - descont;

    sel(".subtotal span:last-child").innerHTML = `R$ ${subtotal.toFixed(2)}`;
    sel(".desconto span:last-child").innerHTML = `R$ ${descont.toFixed(2)}`;
    sel(".total span:last-child").innerHTML = `R$ ${total.toFixed(2)}`;
  } else {
    sel("aside").classList.remove("show");
    sel("aside").style.left = `100vw`;
  }
}
