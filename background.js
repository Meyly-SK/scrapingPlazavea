chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'closeTab') {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]) {
                chrome.tabs.remove(tabs[0].id, () => {
                    console.log('Pestaña cerrada después de completar el scraping');
                });
            }
        });
    }

    if (message.action === 'saveProducts') {
        chrome.storage.local.set({ 'products': message.products }, () => {
            console.log('Productos guardados');
        });
    }
});