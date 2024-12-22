// Gestion de la modale
const modal = document.getElementById('contact_modal');
const closeBtn = document.querySelector('.close-modal-btn');
const form = document.getElementById('contact-form');
const contactButton = document.querySelector('.contact_button');

// Vérification que les éléments sont bien trouvés
console.log('Modal trouvée:', modal);
console.log('Bouton de fermeture trouvé:', closeBtn);
console.log('Formulaire trouvé:', form);
console.log('Bouton de contact trouvé:', contactButton);

let photographerName = '';

// Fonction pour ouvrir la modale
function displayModal() {
    modal.removeAttribute('hidden');
    // Mettre le focus sur le premier champ
    document.getElementById('prenom').focus();
    // Piéger le focus dans la modale
    trapFocus();
}

// Fonction pour fermer la modale
function closeModal() {
    modal.setAttribute('hidden', '');
    // Remettre le focus sur le bouton qui a ouvert la modale
    contactButton.focus();
}

// Gestion du focus dans la modale
function trapFocus() {
    const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    modal.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstFocusable) {
                    e.preventDefault();
                    lastFocusable.focus();
                }
            } else {
                if (document.activeElement === lastFocusable) {
                    e.preventDefault();
                    firstFocusable.focus();
                }
            }
        }
    });
}

// Ajout des gestionnaires d'événements pour le bouton de contact
contactButton.addEventListener('click', displayModal);
contactButton.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        displayModal();
    }
});

// Validation des champs
function validateField(input) {
    const field = input.id;
    const value = input.value.trim();
    let isValid = true;
    const errorElement = document.getElementById(`${field}-error`);

    // Réinitialiser l'état
    input.removeAttribute('aria-invalid');
    errorElement.textContent = '';

    // Validation spécifique pour chaque champ
    switch (field) {
        case 'prenom':
        case 'nom':
            if (value.length < 2) {
                errorElement.textContent = 'Ce champ doit contenir au moins 2 caractères';
                isValid = false;
            }
            break;
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                errorElement.textContent = 'Veuillez entrer une adresse email valide';
                isValid = false;
            }
            break;
        case 'message':
            if (value.length < 10) {
                errorElement.textContent = 'Le message doit contenir au moins 10 caractères';
                isValid = false;
            }
            break;
    }

    if (!isValid) {
        input.setAttribute('aria-invalid', 'true');
    }

    return isValid;
}

// Gestionnaire de soumission du formulaire
form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isFormValid = true;

    // Valider tous les champs
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        if (!validateField(input)) {
            isFormValid = false;
        }
    });

    if (isFormValid) {
        // Récupérer les données du formulaire
        const formData = {
            prenom: document.getElementById('prenom').value,
            nom: document.getElementById('nom').value,
            email: document.getElementById('email').value,
            message: document.getElementById('message').value,
            photographe: photographerName
        };

        // Afficher les données dans la console
        console.log('Données du formulaire :', formData);

        // Fermer la modale
        closeModal();
        
        // Réinitialiser le formulaire
        form.reset();
    }
});

// Validation en temps réel
form.querySelectorAll('input, textarea').forEach(input => {
    input.addEventListener('blur', () => validateField(input));
});

// Gestionnaire pour le bouton de fermeture
closeBtn.addEventListener('click', closeModal);

// Gestionnaire pour fermer la modale en cliquant à l'extérieur
modal.addEventListener('click', (e) => {
    // Si on clique sur la modale elle-même (pas sur son contenu)
    if (e.target === modal) {
        closeModal();
    }
});
