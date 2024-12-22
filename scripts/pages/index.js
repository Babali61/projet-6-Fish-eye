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
