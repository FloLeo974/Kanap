const url = new URL(document.location.href)
const searchParams = new URLSearchParams(url.search)
const idProduct = searchParams.get('id')