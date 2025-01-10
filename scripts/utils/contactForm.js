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
    document.body.classList.add('body-no-scroll');
    const focusableElements = modal.querySelectorAll(
        'button, [href], input, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    // Gestionnaire d'événements pour la navigation au clavier
    function handleKeydown(event) {
        const first = focusableElements[0];
        const last = focusableElements[focusableElements.length - 1];

        if (event.key === 'Tab') {
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        } else if (event.key === 'Escape') {
            closeModal();
        }
    }

    modal.addEventListener('keydown', handleKeydown);
    focusableElements[0].focus();
}

// Fonction pour fermer la modale
function closeModal() {
    modal.setAttribute('hidden', '');
    document.body.classList.remove('body-no-scroll');
    document.querySelector('.contact_button').focus();
}

// Validation des champs
function validateField(field, regex, errorMessage) {
    const errorElement = document.getElementById(`${field.id}-error`);
    let isValid = true;

    if (!field.value.trim()) {
        errorElement.textContent = 'Ce champ est requis';
        field.setAttribute('aria-invalid', 'true');
        isValid = false;
    } else if (regex && !regex.test(field.value)) {
        errorElement.textContent = errorMessage;
        field.setAttribute('aria-invalid', 'true');
        isValid = false;
    } else {
        errorElement.textContent = '';
        field.setAttribute('aria-invalid', 'false');
    }

    return isValid;
}

function validateForm() {
    const prenom = document.getElementById('prenom');
    const nom = document.getElementById('nom');
    const email = document.getElementById('email');
    const message = document.getElementById('message');

    const nameRegex = /^[a-zA-ZÀ-ÿ\s]{2,}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const isValidPrenom = validateField(prenom, nameRegex, 'Prénom invalide (minimum 2 caractères, lettres uniquement)');
    const isValidNom = validateField(nom, nameRegex, 'Nom invalide (minimum 2 caractères, lettres uniquement)');
    const isValidEmail = validateField(email, emailRegex, 'Email invalide');
    const isValidMessage = validateField(message, null, '');

    return isValidPrenom && isValidNom && isValidEmail && isValidMessage;
}

// Gestionnaire de soumission du formulaire
form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (validateForm()) {
        // Si le formulaire est valide, afficher les données dans la console
        const formData = {
            photographe: photographerName,
            prenom: document.getElementById('prenom').value,
            nom: document.getElementById('nom').value,
            email: document.getElementById('email').value,
            message: document.getElementById('message').value
        };
        console.log('Données du formulaire :', formData);
        closeModal();
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

// Ajout des gestionnaires d'événements pour le bouton de contact
contactButton.addEventListener('click', displayModal);

// Support clavier pour le bouton de contact
contactButton.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        displayModal();
    }
});
