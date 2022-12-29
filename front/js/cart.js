let contenuPanierLinea = localStorage.getItem("obj"); // récupération des données stockées
let contenuPanierJson = JSON.parse(contenuPanierLinea); // reformation de l'objet
console.table(contenuPanierJson) // affichage test dans la console du contenu du panier