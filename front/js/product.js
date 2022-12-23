const url = new URL(document.location.href)
const searchParams = new URLSearchParams(url.search)
const idProduct = searchParams.get('id')

const imageProductClass = document.getElementsByClassName("item__img")
const imageProduct = imageProductClass [0]
const nameProduct = document.getElementById("title")
const priceProduct = document.getElementById("price")
const descriptionProduct = document.getElementById("description")

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
})
.catch(function(err) {
    console.log("erreur")
})
