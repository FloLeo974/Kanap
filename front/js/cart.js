let contenuAjoutLinea = localStorage.getItem("obj"); // récupération des données stockées (pour tester mais sinon dans cart.js)
let contenuAjoutJson = JSON.parse(contenuAjoutLinea); // mis en format javascript
console.table(contenuAjoutJson) // affichage test dans la console du contenu du panier