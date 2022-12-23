const url = new URL(document.location.href)
const searchParams = new URLSearchParams(url.search)
const idProduct = searchParams.get('id')

fetch("http://localhost:3000/api/products/"+idProduct)
.then(function(res) {
    if (res.ok) {
    return res.json()
    }
})
.then(function(value) {
    console.log(value)
})
.catch(function(err) {
    console.log("erreur")
})