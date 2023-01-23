// On cible l'élément du DOM
const items = document.getElementById("items")

// On crée une fonction pour afficher tous les produits
function afficherProduits(product) {
    for (let i in product){
        let newLink = document.createElement('a')
        newLink.setAttribute("href", "./product.html?id=" + product[i]._id)
        items.appendChild(newLink)

        let newArticle = document.createElement('article')
        newLink.appendChild(newArticle)

        let newImage = document.createElement('img')
        newImage.setAttribute("src", product[i].imageUrl)
        newImage.setAttribute("alt", product[i].altTxt)
        newArticle.appendChild(newImage)

        let newName = document.createElement('h3')
        newName.classList.add("productName")
        newName.innerText = product[i].name
        newArticle.appendChild(newName)

        let newDescription = document.createElement('p')
        newDescription.classList.add("productDescription")
        newDescription.innerText = product[i].description
        newArticle.appendChild(newDescription)
    }
}

// On récupère les informations des produits au niveau de l'API et on appelle la fonction d'affichage
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