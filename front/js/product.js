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
            console.log(colorsProduct)
        }
    })
    .catch(function(err) {
        console.log("erreur")
    })
}

afficherInformationsProduit ()