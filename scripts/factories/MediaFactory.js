// Classes abstraites pour les médias
class Media {
    constructor(data) {
        this.id = data.id;
        this.photographerId = data.photographerId;
        this.title = data.title;
        this.likes = data.likes;
        this.date = data.date;
        this.price = data.price;
    }

    render() {
        throw new Error("La méthode render() doit être implémentée");
    }

    getLightboxContent() {
        throw new Error("La méthode getLightboxContent() doit être implémentée");
    }

    createInfoDiv() {
        const infoDiv = document.createElement('div');
        infoDiv.className = 'info-image';

        const titleP = document.createElement('p');
        titleP.className = 'title-image';
        titleP.textContent = this.title;

        const likesP = document.createElement('p');
        likesP.className = 'likes-images';
        likesP.setAttribute('aria-label', `Aimer ${this.title}`);
        likesP.setAttribute('aria-pressed', 'false');
        likesP.setAttribute('role', 'button');
        likesP.setAttribute('tabindex', '0');
        likesP.style.cursor = 'pointer';

        const likesCount = document.createElement('span');
        likesCount.textContent = `${this.likes} `;
        
        const heartSvg = `
        <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="likes">
            <path d="M12 5.881C12.981 4.729 14.484 4 16.05 4C18.822 4 21 6.178 21 8.95C21 12.3492 17.945 15.1195 13.3164 19.3167L13.305 19.327L12 20.515L10.695 19.336L10.6595 19.3037C6.04437 15.1098 3 12.3433 3 8.95C3 6.178 5.178 4 7.95 4C9.516 4 11.019 4.729 12 5.881Z" fill="#901C1C"/>
        </svg>`;

        likesP.appendChild(likesCount);
        likesP.insertAdjacentHTML('beforeend', heartSvg);

        infoDiv.appendChild(titleP);
        infoDiv.appendChild(likesP);

        return infoDiv;
    }
}

class ImageMedia extends Media {
    constructor(data) {
        super(data);
        this.image = data.image;
    }

    render() {
        const article = document.createElement('div');
        article.className = 'image-div';

        const img = document.createElement('img');
        img.src = this.image;
        img.className = 'images-photographer';
        img.alt = `${this.title}. Cliquez pour agrandir`;
        img.setAttribute('role', 'button');
        img.setAttribute('aria-label', `Ouvrir ${this.title} en grand format`);
        img.setAttribute('tabindex', '0');

        const infoDiv = this.createInfoDiv();
        article.appendChild(img);
        article.appendChild(infoDiv);

        return article;
    }

    getLightboxContent() {
        const img = document.createElement('img');
        img.src = this.image;
        img.className = 'media-modal';
        img.alt = this.title;
        return img;
    }
}

class VideoMedia extends Media {
    constructor(data) {
        super(data);
        this.video = data.video;
    }

    render() {
        const article = document.createElement('div');
        article.className = 'image-div';

        const video = document.createElement('video');
        video.className = 'images-photographer';
        video.setAttribute('autoplay', '');
        video.setAttribute('loop', '');
        video.setAttribute('muted', '');
        video.setAttribute('role', 'button');
        video.setAttribute('aria-label', `Ouvrir la vidéo ${this.title} en grand format`);
        video.setAttribute('tabindex', '0');

        const source = document.createElement('source');
        source.src = this.video;
        source.type = 'video/mp4';

        video.appendChild(source);
        const infoDiv = this.createInfoDiv();
        article.appendChild(video);
        article.appendChild(infoDiv);

        return article;
    }

    getLightboxContent() {
        const video = document.createElement('video');
        video.className = 'media-modal';
        video.setAttribute('autoplay', '');
        video.setAttribute('loop', '');
        video.setAttribute('muted', '');

        const source = document.createElement('source');
        source.src = this.video;
        source.type = 'video/mp4';

        video.appendChild(source);
        return video;
    }
}

// Factory Method
class MediaFactory {
    static createMedia(data) {
        if (data.image) {
            return new ImageMedia(data);
        } else if (data.video) {
            return new VideoMedia(data);
        }
        throw new Error("Type de média non supporté");
    }
}

export default MediaFactory; 