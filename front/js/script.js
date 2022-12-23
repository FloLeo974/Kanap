const items = document.getElementById("items")

function afficherProduits () {
    fetch("http://localhost:3000/api/products")
    .then(function(res) {
        if (res.ok) {
        return res.json()
        }
    })
    .then(function(value) {
        for (let i in value){
            let newLien = document.createElement('a')
            newLien.setAttribute("href", "./product.html?id=" + value[i]._id)
            items.appendChild(newLien)

            let newArticle = document.createElement('article')
            newLien.appendChild(newArticle)

            let newImage = document.createElement('img')
            newImage.setAttribute("src", value[i].imageUrl)
            newImage.setAttribute("alt", value[i].altTxt)
            newArticle.appendChild(newImage)

            let newName = document.createElement('h3')
            newName.classList.add("productName")
            newName.innerHTML = value[i].name
            newArticle.appendChild(newName)

            let newDescription = document.createElement('p')
            newDescription.classList.add("productDescription")
            newDescription.innerText = value[i].description
            newArticle.appendChild(newDescription)
        }
    })
    .catch(function(err) {
        console.log("erreur")
    })
}

afficherProduits ()