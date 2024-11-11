console.log("Content script cargado correctamente");
//Prueba
let products = [];

function fetchProducts() {
    let productElements = document.querySelectorAll('.Showcase');

    if (productElements.length > 0) {
        productElements.forEach(productElement => {
            const productName = productElement.querySelector('.Showcase__name') ? 
                productElement.querySelector('.Showcase__name').textContent.trim() : 'Producto no encontrado';

            const productBrand = productElement.querySelector('.Showcase__brand a') ? 
                productElement.querySelector('.Showcase__brand a').textContent.trim() : 'Marca no disponible';

            const providerName = productElement.querySelector('.Showcase__SellerName') ? 
                productElement.querySelector('.Showcase__SellerName').textContent.trim() : 'Proveedor no disponible';

            const oldPrice = productElement.querySelector('.Showcase__oldPrice .price') ? 
                productElement.querySelector('.Showcase__oldPrice .price').textContent.trim() : 'Precio antiguo no disponible';

            const productPrice = productElement.querySelector('.Showcase__salePrice .price') ? 
                productElement.querySelector('.Showcase__salePrice .price').textContent.trim() : 'Precio no disponible';

            const productData = {
                name: productName,
                brand: productBrand,
                provider: providerName,
                oldPrice: oldPrice,
                price: productPrice
            };
            products.push(productData);
        });
        // Guardar 
        chrome.storage.local.set({ 'products': products }, () => {
            console.log('Productos guardados');
        });
        //Aviso
        alert("¡Scraping completado! ¿Quieres cerrar esta página?");
        if (window.confirm("¿Deseas cerrar esta página?")) {
            window.close(); 
        }
    } else {
        console.log('No se encontraron productos');
    }
}

//Cargar Pagina
let interval = setInterval(fetchProducts, 9000);