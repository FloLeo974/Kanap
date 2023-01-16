// On récupère l'identifiant de la commande depuis l'url
const url = new URL(document.location.href)
const searchParams = new URLSearchParams(url.search)
const orderNumber = searchParams.get('orderid')

// On affiche le numéro de commande
const orderId = document.getElementById("orderId")
orderId.innerText = orderNumber