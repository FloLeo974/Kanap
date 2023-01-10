// On cible les éléments du DOM:
const productInformations = document.getElementById("cart__items")
const totalQuantity = document.getElementById("totalQuantity")
const totalPrice = document.getElementById("totalPrice")

// On récupère le panier mémorisé dans le local storage
let contenuPanierLinea = localStorage.getItem("obj"); // récupération des données stockées
let contenuPanierJson = JSON.parse(contenuPanierLinea); // reformation de l'objet
console.table(contenuPanierJson) // affichage test dans la console du contenu du panier

// fonction pour enregistrer le panier dans le LS (utilisé en cas de modification)
function memoriserPanier() {
    let contenuPanierLinea = JSON.stringify(contenuPanierJson) // linéarisation de l'objet
    localStorage.setItem("obj", contenuPanierLinea) // stockage dans le local storage
}


let cartPrice = 0;

// On crée une fonction qui crée et insère les éléments dans la page
// Par sécurité le prix n'est pas récupéré depuis le local storage mais depuis l'API 
function afficherProduit(product) {
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
    newPrice.classList.add("cart__item__content__description__price")
    fetch("http://localhost:3000/api/products/" + contenuPanierJson[product].id)
            .then(function(res) {
                if (res.ok) {
                return res.json()
                }
            })
            .then(function(value) {
                newPrice.innerHTML = value.price + " €"
                /*cartPrice += value.price * contenuPanierJson[product].quantity
                totalPrice.innerHTML = cartPrice*/
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

    // écoute des modification de quantité
    newInputQuantity.addEventListener('change', function() {
        if (
            newInputQuantity.value < 1 ||
            newInputQuantity.value > 100
            ) {
                alert("Veuillez saisir un nombre entre 1 et 100")
            }
        else {
        const changedProduct = newInputQuantity.closest('article')
        const changedPoductDataId = changedProduct.getAttribute('data-id')
        const changedPoductDataColor = changedProduct.getAttribute('data-color')
        console.log(changedProduct)
        console.log(changedPoductDataId)
        console.log(changedPoductDataColor)
        console.log("il y a eu un changement")
        newInputQuantity.value = this.value // modification de la quantité dans le DOM
        console.log(newInputQuantity.value)
        let existingProduct = (element) => element.id == changedPoductDataId && element.color == changedPoductDataColor // recherche du produit dans l'array
        let existingProductIndex = contenuPanierJson.findIndex(existingProduct) // indique l'index du produit s'il existe sinon "-1"
        console.log(existingProductIndex)
        contenuPanierJson[existingProductIndex].quantity = Number(this.value) // modification dans le panier
        console.table(contenuPanierJson)
        memoriserPanier() // actualisation du LS
        }
    })
}

// On parcourt l'array et on utilise la fonction d'affichage
function afficherPanier() {
    for (let i in contenuPanierJson) {
        afficherProduit(i)
    }
    calculQuantiteTotale()
    calculPrixTotal()
}
afficherPanier()

// On clacule la quantité total de produits dans le panier
function calculQuantiteTotale() {
    let quantity = 0
    for (let i in contenuPanierJson) {
        quantity += contenuPanierJson[i].quantity
    }
    totalQuantity.innerHTML = quantity
}

function calculPrixTotal() {
    let productsPrice = document.getElementsByClassName("cart__item__content__description__price")
    console.log(productsPrice)
    let productsQuantity = document.getElementsByClassName("itemQuantity")
    console.log(productsQuantity)

    let cartPrice = 0
    for (let i = 0 ; i < contenuPanierJson.length ; i++) {
        console.log(contenuPanierJson.length)
        console.log(productsPrice[i].textContent) // /!\ retourne "empty string" le fetch qui affiche le prix donne le résultat après!
        console.log(productsQuantity[i].value)
        cartPrice += parseInt(productsPrice[i].textContent, 10) * productsQuantity[i].value
    };
    totalPrice.innerHTML = cartPrice
    console.log(cartPrice)
}
