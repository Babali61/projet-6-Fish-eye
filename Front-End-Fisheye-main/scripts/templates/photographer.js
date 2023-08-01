function photographerTemplate(data) {
    const { id, name, city, country, tagline, price, portrait } = data;

    const picture = `assets/photographers/${portrait}`;

    function getUserCardDOM() {
        const article = document.createElement('article');
        const link = document.createElement('a');
        link.className = 'lien-Photographe';
        link.href = `photographer.html?id=${id}`;

        const img = document.createElement('img');
        img.setAttribute("src", picture);
        img.setAttribute("alt", name);

        const h2 = document.createElement('h2');
        h2.textContent = name;

        const divInfo = document.createElement('div'); // Conteneur pour les informations du photographe
        divInfo.className = 'info';

        const divVillePays = document.createElement('div');
        divVillePays.className = 'info-ville-pays'

        const paraVille = document.createElement('p');
        paraVille.textContent = city.concat(',');
        paraVille.className = 'Para-Ville';

        const paraPays = document.createElement('p');
        paraPays.textContent = country;
        paraPays.className = 'Para-Pays';

        const description = document.createElement('p');
         description.textContent = tagline;
         description.className = 'description-photographe';

        const prix = document.createElement('p');
        prix.textContent = price + '/jour';
        prix.className = 'prix-photographe';

        link.appendChild(img);
        link.appendChild(h2);
        article.appendChild(link);

        
        divInfo.appendChild(divVillePays);
        divVillePays.appendChild(paraVille); // Ajout de paraVille à divInfo au lieu de l'article
        divVillePays.appendChild(paraPays);// Ajout de paraPays à divInfo au lieu de l'article
        divInfo.appendChild(description)
        divInfo.appendChild(prix)
        article.appendChild(divInfo); // Ajout de divInfo à l'article

        return article;
    }

    return { name, city, country, picture, getUserCardDOM }
}
