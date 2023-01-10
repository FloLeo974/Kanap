// On cible les éléments du DOM:
const productInformations = document.getElementById("cart__items")
const totalQuantity = document.getElementById("totalQuantity")
const totalPrice = document.getElementById("totalPrice")

// On récupère le panier mémorisé dans le local storage
let contenuPanierLinea = localStorage.getItem("obj"); // récupération des données stockées
let contenuPanierJson = JSON.parse(contenuPanierLinea); // reformation de l'objet

// On récupère les informations des produits dans l'API (nous permettra de récupérer les prix via l'API plutôt que le LS)
fetch("http://localhost:3000/api/products/")
.then(function(res) {
    if (res.ok) {
    return res.json()
    }
})
.then(function(value) {
    afficherProduits()
    // Ajout du prix récupéré via l'API
    for (let product in contenuPanierJson) {
        let existingProduct = (element) => element._id == contenuPanierJson[product].id
        let existingProductIndex = value.findIndex(existingProduct) // indique l'index du produit au niveau de l'API
        let classPrice = document.getElementsByClassName('cart__item__content__description__price')
        classPrice[product].innerHTML = value[existingProductIndex].price + " €"
    }
    modificationQuantite()
    calculQuantiteTotale()
    calculPrixTotal()
})
.catch(function(err) {
    console.log("erreur")
})

// On crée une fonction qui crée et insère les éléments dans la page
function afficherProduits() {
    for (let product in contenuPanierJson) {
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
}

function modificationQuantite() {
    for (let i in contenuPanierJson) {
        let inputQuantity = document.querySelectorAll('.itemQuantity')
        inputQuantity[i].addEventListener('change', function() {
            if (
                inputQuantity[i].value < 1 ||
                inputQuantity[i].value > 100
                ) {
                    alert("Veuillez saisir un nombre entre 1 et 100")
                }
            else {
            const changedProduct = inputQuantity[i].closest('article')
            const changedPoductDataId = changedProduct.getAttribute('data-id')
            const changedPoductDataColor = changedProduct.getAttribute('data-color')
            inputQuantity[i].value = this.value // modification de la quantité dans le DOM
            let existingProduct = (element) => element.id == changedPoductDataId && element.color == changedPoductDataColor // recherche du produit dans l'array
            let existingProductIndex = contenuPanierJson.findIndex(existingProduct) // indique l'index du produit s'il existe sinon "-1"
            contenuPanierJson[existingProductIndex].quantity = Number(this.value) // modification dans le panier
            memoriserPanier() // actualisation du LS
            document.location.reload()
            }
        })
    }
}

// fonction pour enregistrer le panier dans le LS (utilisé en cas de modification)
function memoriserPanier() {
    let contenuPanierLinea = JSON.stringify(contenuPanierJson) // linéarisation de l'objet
    localStorage.setItem("obj", contenuPanierLinea) // stockage dans le local storage
}

function calculQuantiteTotale() {
    let quantity = 0
    for (let i in contenuPanierJson) {
        quantity += contenuPanierJson[i].quantity
    }
    totalQuantity.innerHTML = quantity
}

function calculPrixTotal() {
    let productsPrice = document.getElementsByClassName("cart__item__content__description__price")
    let productsQuantity = document.getElementsByClassName("itemQuantity")

    let cartPrice = 0 // On initialise le prix du panier à 0
    for (let i = 0 ; i < contenuPanierJson.length ; i++) {
        cartPrice += parseInt(productsPrice[i].textContent, 10) * productsQuantity[i].value
    };
    totalPrice.innerHTML = cartPrice
}