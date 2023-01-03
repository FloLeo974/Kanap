// On cible les éléments du DOM:
const productInformations = document.getElementById("cart__items")
const totalQuantity = document.getElementById("totalQuantity")

// On récupère le panier mémorisé dans le local storage
let contenuPanierLinea = localStorage.getItem("obj"); // récupération des données stockées
let contenuPanierJson = JSON.parse(contenuPanierLinea); // reformation de l'objet
console.table(contenuPanierJson) // affichage test dans la console du contenu du panier

const totalPrice = document.getElementById("totalPrice")
let cartPrice = 0;

// On crée une fonction qui crée et insère les éléments dans la page
// Par sécurité le prix n'est pas récupéré depuis le local storage mais depuis l'API 
function afficherPanier(product) {
    let newArticle = document.createElement('article')
    newArticle.classList.add("cart__item")
    newArticle.setAttribute("data-id", contenuPanierJson[product].id)
    newArticle.setAttribute("data-color", contenuPanierJson[product].color)
    productInformations.appendChild(newArticle)

    let newDivImg = document.createElement('div')
    newDivImg.classList.add("cart__item__img")
    newArticle.appendChild(newDivImg)

    let newImage = document.createElement('img')
    newImage.setAttribute("src", contenuPanierJson[product].imageUrl)
    newImage.setAttribute("alt", contenuPanierJson[product].altTxt)
    newDivImg.appendChild(newImage)

    let newDivContent = document.createElement('div')
    newDivContent.classList.add("cart__item__content")
    newArticle.appendChild(newDivContent)

    let newDivContentDescription = document.createElement('div')
    newDivContentDescription.classList.add("cart__item__content__description")
    newDivContent.appendChild(newDivContentDescription)

    let newTitle = document.createElement('h2')
    newTitle.innerText = contenuPanierJson[product].name
    newDivContentDescription.appendChild(newTitle)

    let newColor = document.createElement('p')
    newColor.innerText = contenuPanierJson[product].color
    newDivContentDescription.appendChild(newColor)

    let newPrice = document.createElement('p')
    fetch("http://localhost:3000/api/products/" + contenuPanierJson[product].id)
            .then(function(res) {
                if (res.ok) {
                return res.json()
                }
            })
            .then(function(value) {
                newPrice.innerHTML = value.price + " €"
                cartPrice += value.price * contenuPanierJson[product].quantity
                totalPrice.innerHTML = cartPrice
            })
            .catch(function(err) {
                console.log("erreur")
            })
    newDivContentDescription.appendChild(newPrice)

    let newDivContentSettings = document.createElement('div')
    newDivContentSettings.classList.add("cart__item__content__settings")
    newDivContent.appendChild(newDivContentSettings)

    let newDivContentSettingsQuantity = document.createElement('div')
    newDivContentSettingsQuantity.classList.add("cart__item__content__settings__quantity")
    newDivContentSettings.appendChild(newDivContentSettingsQuantity)

    let newQuantity = document.createElement('p')
    newQuantity.innerText = "Qté : "
    newDivContentSettingsQuantity.appendChild(newQuantity)

    let newInputQuantity = document.createElement('input')
    newInputQuantity.setAttribute("type", "number")
    newInputQuantity.setAttribute("class", "itemQuantity")
    newInputQuantity.setAttribute("name", "itemQuantity")
    newInputQuantity.setAttribute("min", 1)
    newInputQuantity.setAttribute("max", 100)
    newInputQuantity.setAttribute("value", contenuPanierJson[product].quantity)
    newDivContentSettingsQuantity.appendChild(newInputQuantity)

    let newDivContentSettingsDelete = document.createElement('div')
    newDivContentSettingsDelete.classList.add("cart__item__content__settings__delete")
    newDivContentSettings.appendChild(newDivContentSettingsDelete)

    let newDeleteItem = document.createElement('p')
    newDeleteItem.classList.add("deleteItem")
    newDeleteItem.innerText = "Supprimer"
    newDivContentSettingsDelete.appendChild(newDeleteItem)
}

// On parcourt l'array et on utilise la fonction d'affichage
for (let i in contenuPanierJson) {
    afficherPanier(i)
}

// On calcule le prix total du panier et le nombre de produits contenus
function calculTotaux() {
    let quantity = 0
    //let price = 0
    for (let i in contenuPanierJson) {
        quantity += contenuPanierJson[i].quantity
    //    price += contenuPanierJson[i].price * contenuPanierJson[i].quantity
    }
    totalQuantity.innerHTML = quantity
    //totalPrice.innerHTML = price
}
calculTotaux()

/*function calculPrixTotal() {
    let totalPrice = document.getElementById("totalPrice")
    let productsPriceParent = document.querySelectorAll(".cart__item__content__description");
    console.log(productsPriceParent);
    let productsQuantity = document.querySelectorAll(".itemQuantity");

    let cartPrice = 0;
    for (let i = 0 ; i < productsPriceParent.length ; i++) {
        cartPrice += parseInt(productsPriceParent[i].lastElementChild.textContent, 10) * productsQuantity[i].value;
    };
    totalPrice.innerHTML = cartPrice;
}

calculPrixTotal();*/

