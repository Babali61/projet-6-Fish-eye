class PhotographerController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.observers = [];
        this.photographers = [];
    }

    async loadPhotographers() {
        try {
            const response = await fetch("./data/photographers.json");
            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }
            const data = await response.json();
            this.photographers = data.photographers.map(photographer => new this.model(photographer));
            return this.photographers;
        } catch (error) {
            console.error('Erreur lors du chargement des photographes:', error);
            this.notifyObservers({ type: 'error', message: error.message });
            return [];
        }
    }

    async initialize() {
        try {
            const photographers = await this.loadPhotographers();
            this.view.clearPhotographers();
            this.view.displayPhotographers(photographers);
            this.notifyObservers({ type: 'init', data: photographers });
        } catch (error) {
            console.error('Erreur lors de l\'initialisation:', error);
            this.notifyObservers({ type: 'error', message: error.message });
        }
    }

    sortPhotographers(criteria) {
        try {
            switch (criteria) {
                case 'name':
                    this.photographers.sort((a, b) => a.name.localeCompare(b.name));
                    break;
                case 'popularity':
                    this.photographers.sort((a, b) => b.totalLikes - a.totalLikes);
                    break;
                case 'price':
                    this.photographers.sort((a, b) => a.price - b.price);
                    break;
                default:
                    throw new Error(`Critère de tri invalide: ${criteria}`);
            }
            this.view.clearPhotographers();
            this.view.displayPhotographers(this.photographers);
            this.notifyObservers({ type: 'sort', criteria });
        } catch (error) {
            console.error('Erreur lors du tri:', error);
            this.notifyObservers({ type: 'error', message: error.message });
        }
    }

    filterPhotographers(location) {
        try {
            const filteredPhotographers = location === 'all' 
                ? this.photographers 
                : this.photographers.filter(p => p.city === location || p.country === location);
            
            this.view.clearPhotographers();
            this.view.displayPhotographers(filteredPhotographers);
            this.notifyObservers({ type: 'filter', location });
        } catch (error) {
            console.error('Erreur lors du filtrage:', error);
            this.notifyObservers({ type: 'error', message: error.message });
        }
    }

    // Pattern Observer
    addObserver(observer) {
        if (typeof observer.update !== 'function') {
            throw new Error('L\'observateur doit avoir une méthode update');
        }
        this.observers.push(observer);
    }

    removeObserver(observer) {
        this.observers = this.observers.filter(obs => obs !== observer);
    }

    notifyObservers(data) {
        this.observers.forEach(observer => {
            try {
                observer.update(data);
            } catch (error) {
                console.error('Erreur lors de la notification d\'un observateur:', error);
            }
        });
    }
}

export default PhotographerController; 