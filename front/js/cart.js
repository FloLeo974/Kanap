// On cible les éléments du DOM:
const productInformations = document.getElementById("cart__items")

// On récupère le panier mémorisé dans le local storage
let contenuPanierLinea = localStorage.getItem("obj"); // récupération des données stockées
let contenuPanierJson = JSON.parse(contenuPanierLinea); // reformation de l'objet
console.table(contenuPanierJson) // affichage test dans la console du contenu du panier

// On crée une fonction qui crée et insère les éléments dans la page

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
    newColor.innerHTML = contenuPanierJson[product].price + " €"
    newDivContentDescription.appendChild(newPrice)
}

// On parcourt l'array et on utilise la fonction d'affichage

for (let i in contenuPanierJson) {
    afficherPanier(i)
}
