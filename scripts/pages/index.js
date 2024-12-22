import PhotographerModel from '../models/PhotographerModel.js';
import PhotographerView from '../views/PhotographerView.js';
import PhotographerController from '../controllers/PhotographerController.js';

// Pattern Module
const App = (function() {
    let instance;

    function createInstance() {
        const model = PhotographerModel;
        const view = new PhotographerView();
        const controller = new PhotographerController(model, view);

        return {
            initialize: async function() {
                await controller.initialize();
            }
        };
    }

    return {
        getInstance: function() {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
})();

// Initialisation de l'application
document.addEventListener('DOMContentLoaded', () => {
    const app = App.getInstance();
    app.initialize();
});

// Gestion du loader
window.addEventListener('DOMContentLoaded', () => {
    const loader = document.querySelector('.loader-container');
    const pageContent = document.querySelector('main');
    let isLoaderRemoved = false;
    
    if (!loader || !pageContent) return;

    // Ajouter la classe page-content au main
    pageContent.classList.add('page-content');
    
    // Cacher le loader avec une transition
    setTimeout(() => {
        if (loader && !isLoaderRemoved) {
            loader.classList.add('loader-hidden');
            pageContent.classList.add('visible');
            
            // Supprimer le loader après la transition
            const handleTransitionEnd = () => {
                if (!isLoaderRemoved && loader.parentNode) {
                    document.body.removeChild(loader);
                    isLoaderRemoved = true;
                }
                loader.removeEventListener('transitionend', handleTransitionEnd);
            };
            
            loader.addEventListener('transitionend', handleTransitionEnd);
        }
    }, 1000);
});
