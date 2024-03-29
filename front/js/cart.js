// On cible les éléments du DOM:
const productInformations = document.getElementById("cart__items")
const totalQuantity = document.getElementById("totalQuantity")
const totalPrice = document.getElementById("totalPrice")

// On récupère le panier mémorisé dans le local storage
let cartContentLinea = localStorage.getItem("obj"); // récupération des données stockées
let cartContentJson = JSON.parse(cartContentLinea); // reformation de l'objet

if (cartContentJson !== null) {
// On récupère les informations des produits dans l'API (nous permettra de récupérer les prix via l'API plutôt que le LS)
    fetch("http://localhost:3000/api/products/")
        .then(function(res) {
            if (res.ok) {
            return res.json()
            }
        })
        .then(function(value) {
            afficherProduits()
            afficherPrix(value)
            modifierQuantite()
            supprimerProduit()
            calculerTotaux()
        })
        .catch(function(err) {
            console.log("erreur")
        })
}

// On crée une fonction qui crée et insère les éléments dans la page
function afficherProduits() {
    for (let product in cartContentJson) {
        let newArticle = document.createElement('article')
        newArticle.classList.add("cart__item")
        newArticle.setAttribute("data-id", cartContentJson[product].id)
        newArticle.setAttribute("data-color", cartContentJson[product].color)
        productInformations.appendChild(newArticle)

        let newDivImage = document.createElement('div')
        newDivImage.classList.add("cart__item__img")
        newArticle.appendChild(newDivImage)

        let newImage = document.createElement('img')
        newImage.setAttribute("src", cartContentJson[product].imageUrl)
        newImage.setAttribute("alt", cartContentJson[product].altTxt)
        newDivImage.appendChild(newImage)

        let newDivContent = document.createElement('div')
        newDivContent.classList.add("cart__item__content")
        newArticle.appendChild(newDivContent)

        let newDivContentDescription = document.createElement('div')
        newDivContentDescription.classList.add("cart__item__content__description")
        newDivContent.appendChild(newDivContentDescription)

        let newTitle = document.createElement('h2')
        newTitle.innerText = cartContentJson[product].name
        newDivContentDescription.appendChild(newTitle)

        let newColor = document.createElement('p')
        newColor.innerText = cartContentJson[product].color
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
        newInputQuantity.setAttribute("value", cartContentJson[product].quantity)
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

function afficherPrix(value) {
    for (let product in cartContentJson) {
        let existingProduct = (element) => element._id == cartContentJson[product].id
        let existingProductIndex = value.findIndex(existingProduct) // indique l'index du produit au niveau de l'API
        let classPrice = document.getElementsByClassName('cart__item__content__description__price')
        classPrice[product].innerHTML = value[existingProductIndex].price + " €"
    }
}

function modifierQuantite() {
    for (let i in cartContentJson) {
        let inputQuantity = document.querySelectorAll('.itemQuantity')
        inputQuantity[i].addEventListener('change', function() {
            if (
                inputQuantity[i].value < 1 ||
                inputQuantity[i].value > 100
                ) {
                    alert("Veuillez saisir un nombre entre 1 et 100")
                    location.reload()
                }
            else {
            const changedProduct = inputQuantity[i].closest('.cart__item')
            const changedPoductDataId = changedProduct.getAttribute('data-id')
            const changedPoductDataColor = changedProduct.getAttribute('data-color')
            inputQuantity[i].value = this.value // modification de la quantité dans le DOM
            let existingProduct = (element) => element.id == changedPoductDataId && element.color == changedPoductDataColor // recherche du produit dans l'array
            let existingProductIndex = cartContentJson.findIndex(existingProduct) // indique l'index du produit s'il existe sinon "-1"
            cartContentJson[existingProductIndex].quantity = Number(this.value) // modification dans le panier
            memoriserPanier() // actualisation du LS
            location.reload()
            }
        })
    }
}

function supprimerProduit() {
    for (let i in cartContentJson) {
        let deleteButton = document.querySelectorAll('.deleteItem')
        deleteButton[i].addEventListener('click', function() {
            if (confirm("Vous allez supprimer ce produit")) {
                const deletedProduct = deleteButton[i].closest('.cart__item')
                const deletedPoductDataId = deletedProduct.getAttribute('data-id')
                const deletedPoductDataColor = deletedProduct.getAttribute('data-color')
                deletedProduct.remove() // suppression du produit dans le DOM
                let existingProduct = (element) => element.id == deletedPoductDataId && element.color == deletedPoductDataColor // recherche du produit dans l'array
                let existingProductIndex = cartContentJson.findIndex(existingProduct) // indique l'index du produit
                cartContentJson.splice(existingProductIndex, 1) // suppression dans le panier
                memoriserPanier() // actualisation du LS
                location.reload()
            }
        })
    }
}

// fonction pour enregistrer le panier dans le LS (utilisé en cas de modification ou de suppression)
function memoriserPanier() {
    let cartContentLinea = JSON.stringify(cartContentJson) // linéarisation de l'objet
    localStorage.setItem("obj", cartContentLinea) // stockage dans le local storage
}

function calculerTotaux() {
    let productsPrice = document.getElementsByClassName("cart__item__content__description__price")
    let productsQuantity = document.getElementsByClassName("itemQuantity")

    let cartPrice = 0
    let quantity = 0
    for (let i = 0 ; i < cartContentJson.length ; i++) {
        cartPrice += parseInt(productsPrice[i].textContent, 10) * productsQuantity[i].value
        quantity += cartContentJson[i].quantity
    };
    totalPrice.innerHTML = cartPrice
    totalQuantity.innerHTML = quantity
}

// Définition des regex
let nameRegex = /^[A-Za-zÀ-ÿ]{1,15}[-\s]{0,1}[A-Za-zÀ-ÿ]{1,15}$/
let addressRegex = /^[A-Za-zÀ-ÿ0-9]([,'/\\]{0,1}[\s]{0,1}[-A-zÀ-ÿ0-9.]+)+$/
let cityRegex = /(^[A-Za-zÀ-ÿ]([-'\s/\\]{0,1}[a-zA-ZÀ-ÿ]+)*[']{0,1}[a-za-ÿ]$)|(^[A-ZÀ-ß]$)/
let emailRegex = /^([A-Za-z0-9]+[_.]{0,1}[\w-]+)+@([a-z0-9]+[-]{0,1}[a-z0-9]+)+\.[a-z]{2,}([.]{0,1}[a-z]{2,})*$/

// Affichage des messages d'erreur ou de succés concernant la validité des textes saisis dans les champs du formulaire
const firstNameErrorMsg = document.getElementById("firstNameErrorMsg")
const lastNameErrorMsg = document.getElementById("lastNameErrorMsg")
const addressErrorMsg = document.getElementById("addressErrorMsg")
const cityErrorMsg = document.getElementById("cityErrorMsg")
const emailErrorMsg = document.getElementById("emailErrorMsg")

const firstNameInput = document.getElementById("firstName")
const lastNameInput = document.getElementById("lastName")
const addressInput = document.getElementById("address")
const cityInput = document.getElementById("city")
const emailInput = document.getElementById("email")

firstNameInput.addEventListener('change', function() {
    let firstNameValue = document.getElementById("firstName").value
    if (firstNameValue == "") {
        firstNameErrorMsg.innerText = "Veuillez saisir votre prénom"
    }
    else {
        if(firstNameValue.match(nameRegex)) {
        firstNameErrorMsg.innerText = ""
        }
        else {
            firstNameErrorMsg.innerText = "Veuillez saisir un prénom valide"
        }    
    }
})

lastNameInput.addEventListener('change', function() {
    let lastNameValue = document.getElementById("lastName").value
    if (lastNameValue == "") {
        lastNameErrorMsg.innerText = "Veuillez saisir votre nom"
    }
    else {
        if(lastNameValue.match(nameRegex)) {
        lastNameErrorMsg.innerText = ""
        }
        else {
            lastNameErrorMsg.innerText = "Veuillez saisir un nom valide"
        }    
    }
})

addressInput.addEventListener('change', function() {
    let addressValue = document.getElementById("address").value
    if (addressValue == "") {
        addressErrorMsg.innerText = "Veuillez saisir votre adresse"
    }
    else {
        if(addressValue.match(addressRegex)) {
        addressErrorMsg.innerText = ""
        }
        else {
            addressErrorMsg.innerText = "Veuillez saisir une adresse valide"
        }    
    }
})

cityInput.addEventListener('change', function() {
    let cityValue = document.getElementById("city").value
    if (cityValue == "") {
        cityErrorMsg.innerText = "Veuillez saisir votre ville"
    }
    else {
        if(cityValue.match(cityRegex)) {
        cityErrorMsg.innerText = ""
        }
        else {
            cityErrorMsg.innerText = "Veuillez saisir une ville valide"
        }    
    }
})

emailInput.addEventListener('change', function() {
    let emailValue = document.getElementById("email").value
    if (emailValue == "") {
        emailErrorMsg.innerText = "Veuillez saisir votre email"
    }
    else {
        if(emailValue.match(emailRegex)) {
        emailErrorMsg.innerText = ""
        }
        else {
            emailErrorMsg.innerText = "Veuillez saisir un email valide"
        }    
    }
})

// Envoie de la commande au clic sur le bouton commander
const submitButton = document.getElementById("order")

order.addEventListener('click', function(e) {
    e.preventDefault()
    if (cartContentJson == null) {
        alert("Votre panier est vide")
    }
    else{
        sendOrder()
    }
})

// On envoie la commande et on récupère son identifiant
function sendOrder() {
    // Création de l'objet contact
    let contact = {
        firstName: document.getElementById("firstName").value,
        lastName: document.getElementById("lastName").value,
        address: document.getElementById("address").value,
        city: document.getElementById("city").value,
        email: document.getElementById("email").value,
    }

    // Création du tableau de produits
    let products = []
    for (let product in cartContentJson) {
        products.push(cartContentJson[product].id)
    }

    // Vérification de la validité du texte saisi dans les champs et que le panier n'est pas vide
    let firstNameValue = document.getElementById("firstName").value
    let lastNameValue = document.getElementById("lastName").value
    let addressValue = document.getElementById("address").value
    let cityValue = document.getElementById("city").value
    let emailValue = document.getElementById("email").value

    if(
    firstNameValue.match(nameRegex) &&
    lastNameValue.match(nameRegex) &&
    addressValue.match(addressRegex) &&
    cityValue.match(cityRegex) &&
    emailValue.match(emailRegex) &&
    cartContentJson.length !== 0
    ) {
        // Si tout est conforme envoie la requête à l'API
        fetch("http://localhost:3000/api/products/order", {
            method: "POST",
            headers: {
            'Accept': 'application/json', 
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contact,
                products
            })
        })
        .then(function(res) {
            if (res.ok) {
            return res.json();
            }
        })
        .then(function(value) {
            location.href = "confirmation.html?orderid=" + value.orderId;
        })
    }
    else {
        // Sinon affichage de messages d'erreur
        if(cartContentJson.length == 0 || cartContentJson == null) {
            alert("Votre panier est vide")
        }
        else {
        alert("Tous les champs doivent être renseignés\nLes informations saisies doivent être valides")
        }
    }
}