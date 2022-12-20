const items = document.getElementById("items")
console.log(items)

fetch("http://localhost:3000/api/products")
.then(function(res) {
    if (res.ok) {
    return res.json()
    }
})
.then(function(value) {
    items.innerHTML = "<a href='.product.html?id" + value[0]._id + "'><article><img src='" + value[0].imageUrl + "' alt=" + value[0].altTxt + "><h3 class='productName'>" + value[0].name + "</h3><p class='productDescription'>" + value[0].description + "</p></article></a>"
})
.catch(function(err) {
    console.log("erreur")
})
console.log(items)