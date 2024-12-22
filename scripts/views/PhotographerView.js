class PhotographerView {
    constructor() {
        this.photographerSection = document.querySelector(".photographer_section");
        this.errorContainer = this.createErrorContainer();
        document.body.appendChild(this.errorContainer);
    }

    createErrorContainer() {
        const container = document.createElement("div");
        container.className = "error-container";
        container.setAttribute("role", "alert");
        container.style.display = "none";
        return container;
    }

    showError(message) {
        this.errorContainer.textContent = message;
        this.errorContainer.style.display = "block";
        setTimeout(() => {
            this.errorContainer.style.display = "none";
        }, 5000);
    }

    createPhotographerCard(photographer) {
        try {
            const article = document.createElement("article");
            article.setAttribute("role", "article");
            article.setAttribute("aria-label", `Photographe ${photographer.name}`);

            const link = this.createLink(photographer);
            const divInfo = this.createInfoDiv(photographer);

            article.appendChild(link);
            article.appendChild(divInfo);

            return article;
        } catch (error) {
            console.error('Erreur lors de la création de la carte photographe:', error);
            this.showError('Erreur lors de l\'affichage du photographe');
            return null;
        }
    }

    createLink(photographer) {
        const link = document.createElement("a");
        link.className = "lien-Photographe";
        link.href = `photographer.html?id=${photographer.id}`;
        link.setAttribute("aria-label", `Voir le profil de ${photographer.name}`);

        const img = document.createElement("img");
        img.setAttribute("src", `assets/photographers/${photographer.portrait}`);
        img.setAttribute("alt", `Portrait de ${photographer.name}`);
        img.setAttribute("loading", "lazy");

        const h2 = document.createElement("h2");
        h2.textContent = photographer.name;

        link.appendChild(img);
        link.appendChild(h2);

        return link;
    }

    createInfoDiv(photographer) {
        const divInfo = document.createElement("div");
        divInfo.className = "info";

        const divVillePays = document.createElement("div");
        divVillePays.className = "info-ville-pays";
        divVillePays.setAttribute("aria-label", `Localisation: ${photographer.city}, ${photographer.country}`);

        const paraVille = document.createElement("p");
        paraVille.textContent = photographer.city.concat(",");
        paraVille.className = "Para-Ville";

        const paraPays = document.createElement("p");
        paraPays.textContent = photographer.country;
        paraPays.className = "Para-Pays";

        const description = document.createElement("p");
        description.textContent = photographer.tagline;
        description.className = "description-photographe";
        description.setAttribute("aria-label", `Tagline: ${photographer.tagline}`);

        const prix = document.createElement("p");
        prix.textContent = `${photographer.price}€/jour`;
        prix.className = "prix-photographe";
        prix.setAttribute("aria-label", `Tarif: ${photographer.price} euros par jour`);

        divVillePays.appendChild(paraVille);
        divVillePays.appendChild(paraPays);
        divInfo.appendChild(divVillePays);
        divInfo.appendChild(description);
        divInfo.appendChild(prix);

        return divInfo;
    }

    displayPhotographers(photographers) {
        try {
            this.clearPhotographers();
            photographers.forEach(photographer => {
                const photographerCard = this.createPhotographerCard(photographer);
                if (photographerCard) {
                    this.photographerSection.appendChild(photographerCard);
                }
            });

            if (photographers.length === 0) {
                this.showNoResults();
            }
        } catch (error) {
            console.error('Erreur lors de l\'affichage des photographes:', error);
            this.showError('Erreur lors de l\'affichage des photographes');
        }
    }

    showNoResults() {
        const noResults = document.createElement("p");
        noResults.className = "no-results";
        noResults.textContent = "Aucun photographe trouvé";
        noResults.setAttribute("role", "status");
        this.photographerSection.appendChild(noResults);
    }

    clearPhotographers() {
        while (this.photographerSection.firstChild) {
            this.photographerSection.removeChild(this.photographerSection.firstChild);
        }
    }
}

export default PhotographerView; 