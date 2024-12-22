class PhotographerModel {
    constructor(data) {
        this.validateData(data);
        this.id = data.id;
        this.name = data.name;
        this.city = data.city;
        this.country = data.country;
        this.tagline = data.tagline;
        this.price = data.price;
        this.portrait = data.portrait;
        this.media = data.media || [];
        this.totalLikes = this.calculateTotalLikes();
    }

    validateData(data) {
        const requiredFields = ['id', 'name', 'city', 'country', 'tagline', 'price', 'portrait'];
        const missingFields = requiredFields.filter(field => !data[field]);
        
        if (missingFields.length > 0) {
            throw new Error(`Données de photographe invalides. Champs manquants : ${missingFields.join(', ')}`);
        }
    }

    calculateTotalLikes() {
        return this.media.reduce((total, media) => total + (media.likes || 0), 0);
    }

    addLike(mediaId) {
        const media = this.media.find(m => m.id === mediaId);
        if (!media) {
            throw new Error(`Media avec l'ID ${mediaId} non trouvé`);
        }
        
        media.likes = (media.likes || 0) + 1;
        this.totalLikes = this.calculateTotalLikes();
        return true;
    }

    removeLike(mediaId) {
        const media = this.media.find(m => m.id === mediaId);
        if (!media) {
            throw new Error(`Media avec l'ID ${mediaId} non trouvé`);
        }

        if (media.likes > 0) {
            media.likes--;
            this.totalLikes = this.calculateTotalLikes();
            return true;
        }
        return false;
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            city: this.city,
            country: this.country,
            tagline: this.tagline,
            price: this.price,
            portrait: this.portrait,
            totalLikes: this.totalLikes
        };
    }
}

export default PhotographerModel; 