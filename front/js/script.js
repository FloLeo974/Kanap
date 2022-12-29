// On cible l'élément du DOM
const items = document.getElementById("items")

// On crée une fonction pour afficher tous les produits
function afficherProduits(e) {
    for (let i in e){
        let newLien = document.createElement('a')
        newLien.setAttribute("href", "./product.html?id=" + e[i]._id)
        items.appendChild(newLien)

        let newArticle = document.createElement('article')
        newLien.appendChild(newArticle)

        let newImage = document.createElement('img')
        newImage.setAttribute("src", e[i].imageUrl)
        newImage.setAttribute("alt", e[i].altTxt)
        newArticle.appendChild(newImage)

        let newName = document.createElement('h3')
        newName.classList.add("productName")
        newName.innerHTML = e[i].name
        newArticle.appendChild(newName)

        let newDescription = document.createElement('p')
        newDescription.classList.add("productDescription")
        newDescription.innerText = e[i].description
        newArticle.appendChild(newDescription)
    }
}

// On récupère les informations des produits au niveau de l'API et on appelle la fonction d'affichage
function recupererProduits () {
    fetch("http://localhost:3000/api/products")
    .then(function(res) {
        if (res.ok) {
        return res.json()
        }
    })
    .then(function(value) {
        afficherProduits(value)
    })
    .catch(function(err) {
        console.log("erreur")
    })
}

recupererProduits ()