document.getElementById('scrapeBtn').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript(
            {
                target: { tabId: tabs[0].id },
                func: getCategories, 
            },
            (result) => {
                const categoriesDiv = document.getElementById('categories');
                categoriesDiv.innerHTML = ''; 
                if (result && result[0]) {
                    const categories = result[0].result;
                    chrome.storage.local.set({ categories: categories }, () => {
                        console.log("Categorías guardadas");
                    });
                    const baseUrl = "https://www.plazavea.com.pe/";
                    categories.forEach(category => {
                        const formattedCategory = formatCategoryName(category.name);
                        const categoryUrl = baseUrl + formattedCategory;
                        const categoryElement = document.createElement('div');
                        categoryElement.className = 'category';
                        const button = document.createElement('button');
                        button.innerText = `Ir a ${category.name}`;
                        button.onclick = () => {
                            chrome.tabs.create({ url: categoryUrl }, (tab) => {
                                chrome.tabs.onUpdated.addListener(function onTabUpdated(tabId, changeInfo, updatedTab) {
                                    if (tabId === tab.id && changeInfo.status === 'complete') {
                                    }
                                });
                            });
                        };
                        categoryElement.innerHTML = `<strong>${category.name}</strong>: <a href="${categoryUrl}" target="_blank">${categoryUrl}</a>`;
                        categoryElement.appendChild(button);
                        categoriesDiv.appendChild(categoryElement);
                    });
                }
            }
        );
    });
});
function getCategories() {
    const categoryItems = document.querySelectorAll('.MainMenu__wrapper__departments .bt8 .MainMenu__wrapper__departments__item');
    const categories = [];
    categoryItems.forEach(item => {
        const linkElement = item.querySelector('.MainMenu__wrapper__departments__item__link');
        if (linkElement) {
            const nameElement = linkElement.querySelector('.textMenu span');
            if (nameElement) {
                const categoryName = nameElement.innerText.trim();
                categories.push({ name: categoryName });
            }
        }
    });
    return categories; 
}
function formatCategoryName(categoryName) {
    const accentsMap = {
        'á': 'a',
        'é': 'e',
        'í': 'i',
        'ó': 'o',
        'ú': 'u',
        'Á': 'a',
        'É': 'e',
        'Í': 'i',
        'Ó': 'o',
        'Ú': 'u',
        'ñ': 'n',
        'Ñ': 'n'
    };
    return categoryName
        .split('')
        .map(char => accentsMap[char] || char)
        .join('')
        .toLowerCase()
        .replace(/\s+/g, '-');
}
document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.local.get('categories', (data) => {
        const categoriesDiv = document.getElementById('categories');
        categoriesDiv.innerHTML = ''; 
        if (data.categories && data.categories.length > 0) {
            const categories = data.categories;
            categories.forEach(category => {
                const categoryElement = document.createElement('div');
                categoryElement.className = 'category';
                const button = document.createElement('button');
                button.innerText = `Ir a ${category.name}`;
                button.onclick = () => {
                    const categoryUrl = `https://www.plazavea.com.pe/${category.name}`;
                    chrome.tabs.create({ url: categoryUrl });
                };
                categoryElement.innerHTML = `<strong>${category.name}</strong>`;
                categoryElement.appendChild(button);
                categoriesDiv.appendChild(categoryElement);
            });
        } else {
            categoriesDiv.innerHTML = '<p>No hay categorías disponibles.</p>';
        }
    });
});
document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.local.get('products', (data) => {
        const productsDiv = document.getElementById('products');
        productsDiv.innerHTML = ''; 
        if (data.products && data.products.length > 0) {
            const products = data.products;
            products.forEach(product => {
                const productElement = document.createElement('div');
                productElement.className = 'product';
                productElement.innerHTML = `
                    <strong>${product.name}</strong><br>
                    <p>Marca: ${product.brand}</p>
                    <p>Proveedor: ${product.provider} </p>
                    <p>Precio antiguo: ${product.oldPrice}</p>
                    <p>Precio de venta: ${product.price}</p>
                `;
                productsDiv.appendChild(productElement);
            });
        } else {
            productsDiv.innerHTML = '<p>No hay productos guardados.</p>';
        }
    });
});
document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.local.get('products', (data) => {
        const productsDiv = document.getElementById('products');
        productsDiv.innerHTML = ''; 

        if (data.products && data.products.length > 0) {
            const products = data.products;
            products.forEach(product => {
                const productElement = document.createElement('div');
                productElement.className = 'product';
                productElement.innerHTML = `
                    <strong>${product.name}</strong><br>
                    <p>Marca: ${product.brand}</p>
                    <p>Proveedor: ${product.provider} </p>
                    <p>Precio antiguo: ${product.oldPrice}</p>
                    <p>Precio de venta: ${product.price}</p>
                `;
                productsDiv.appendChild(productElement);
            });
            const downloadButton = document.getElementById('downloadButton');
            downloadButton.addEventListener('click', () => {
                const productsJson = JSON.stringify(data.products, null, 2);
                const blob = new Blob([productsJson], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'productos.json';
                a.click();
                URL.revokeObjectURL(url);
            });

        } else {
            productsDiv.innerHTML = '<p>No hay productos guardados.</p>';
        }
    });
});

//Cargar categorias - error
const boton = document.querySelector('.dropdown__button gtm_element');

if (boton) {
    boton.click(); 

    setTimeout(() => {
        getCategories();
    }, 2000); 
}