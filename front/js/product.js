// On récupère l'id du produit depuis l'url
const url = new URL(document.location.href)
const searchParams = new URLSearchParams(url.search)
const idProduct = searchParams.get('id')

// On cible les éléments du DOM
const imageProductClass = document.getElementsByClassName("item__img")
const imageProduct = imageProductClass [0]
const nameProduct = document.getElementById("title")
const priceProduct = document.getElementById("price")
const descriptionProduct = document.getElementById("description")
const colorsProduct = document.getElementById("colors")

const boutonAjouter = document.getElementById("addToCart")

// On récupère les informations du produit au niveau de l'API à partir de son id et on affiche les informations
function afficherInformationsProduit () {
    fetch("http://localhost:3000/api/products/"+idProduct)
    .then(function(res) {
        if (res.ok) {
        return res.json()
        }
    })
    .then(function(value) {
        let newImage = document.createElement('img')
        newImage.setAttribute("src", value.imageUrl)
        newImage.setAttribute("alt", value.altTxt)
        imageProduct.appendChild(newImage)

        nameProduct.innerText = value.name
        priceProduct.innerText = value.price
        descriptionProduct.innerText = value.description

        for (let i in value.colors) {
            let newOption = document.createElement('option')
            newOption.setAttribute("value", value.colors[i])
            newOption.innerText = value.colors[i]
            colorsProduct.appendChild(newOption)
        }
    })
    .catch(function(err) {
        console.log("erreur")
    })
}

afficherInformationsProduit ()

// On récupére l'array qui contient les produits ajoutés au panier 
// Ou on le crée s'il n'existe pas encore dans le local storage
let contenuAjout = JSON.parse(localStorage.getItem("obj")) || []

// On gère le remplissage du panier et on enregistre son contenu dans le local storage
function ajoutPanier () {
    let quantityProduct = Number(document.getElementById("quantity").value) // quantité saisie
    let colorProductSelected = colorsProduct.options[colorsProduct.selectedIndex].value //couleur sélectionée
    if (quantityProduct < 1 || quantityProduct > 100 || colorProductSelected == "") { // vérification de la validité des données du panier
        alert("Veuillez sélectionner une couleur et choisir un nombre d'article compris entre 1 et 100"); // message d'erreur pour l'utilisateur
    }
    else { // si le produit n'est pas encore dans le panier on l'ajoute sinon on met seulement à jour la quantité
        let existingProduct = (element) => element.id == idProduct && element.color == colorProductSelected // recherche du produit dans l'array
        let existingProductIndex = contenuAjout.findIndex(existingProduct) // indique l'index du produit s'il existe sinon "-1"
        if (existingProductIndex == -1) { // si le produit n'est pas encore présent dans le panier
        contenuAjout.push({ id: idProduct, quantity: quantityProduct, color: colorProductSelected })// ajout d'une ligne dans l'array avec le contenu ajouté
        }
        else { // si le produit est déjà dans le panier
            contenuAjout[existingProductIndex].quantity += quantityProduct // addition de la nouvelle quantité à la précédente
        }
        alert("Votre produit a été ajouté au panier") // message de succés pour l'utilisateur
    }

    let contenuAjoutLinea = JSON.stringify(contenuAjout) // mis en format json
    localStorage.setItem("obj", contenuAjoutLinea) // stockage dans le local storage
}

// On met à jour le panier au clic
boutonAjouter.addEventListener('click', function(){ // écoute du clic sur le bouton
    ajoutPanier() // activation de la fonction d'ajout au panier

    // A RETIRER UNE FOIS TERMINE: JUSTE POUR VOIR LE RESULTAT DANS LA CONSOLE:
    let contenuAjoutLinea = localStorage.getItem("obj"); // récupération des données stockées (pour tester mais sinon dans cart.js)
    let contenuAjoutJson = JSON.parse(contenuAjoutLinea); // mis en format javascript
    console.table(contenuAjoutJson) // affichage test dans la console du contenu du panier
})