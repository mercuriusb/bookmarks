let searchData = null;

async function loadSearchIndex() {
    if (!searchData) {
        const response = await fetch('search-index.json');
        searchData = await response.json();
    }
}

async function handleSearch(event) {
    const query = event.target.value.toLowerCase();
    if (query.length < 3) {
        // Optional: restore original view
        return;
    }

    await loadSearchIndex();
    const tokens = query.split(/\W+/).filter(t => t.length > 2);
    if (tokens.length === 0) return;

    let resultIds = null;
    for (const token of tokens) {
        const matches = new Set();
        for (const key in searchData.index) {
            if (key.includes(token)) {
                searchData.index[key].forEach(id => matches.add(id));
            }
        }

        if (resultIds === null) {
            resultIds = matches;
        } else {
            resultIds = new Set([...resultIds].filter(x => matches.has(x)));
        }
    }

    displayResults(resultIds ? Array.from(resultIds) : []);
}

function displayResults(ids) {
    const container = document.getElementById('bookmark-list');
    const title = document.querySelector('h1');
    title.innerText = 'Search Results';
    container.innerHTML = '';

    ids.forEach(id => {
        const b = searchData.bookmarks[id];
        const item = `
            <div class="mb-2">
                <span class="font-bold"><a href="${b.url}" target="_blank" class="link link-primary">${b.title}</a></span>
                <span class="ml-1 text-sm opacity-80">${b.summary || ''}</span>
            </div>
        `;
        container.innerHTML += item;
    });
}
