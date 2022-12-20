fetch("http://localhost:3000/api/products")
.then(function(res) {
    if (res.ok) {
    return res.json()
    }
})
.then(function(value) {
    console.table(value[0]._id)
})
.catch(function(err) {
    console.log("erreur")
})