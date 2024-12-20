function displayModal() {
    const modal = document.getElementById("contact_modal");
    const mainContent = document.getElementById("main");
    
    // Afficher le modal
    modal.style.display = "block";
    
    // Configurer ARIA et l'accessibilité
    modal.setAttribute("aria-hidden", "false");
    mainContent.setAttribute("aria-hidden", "true");
    
    // Désactiver le focus sur les éléments en arrière-plan
    mainContent.querySelectorAll('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])').forEach(el => {
        el.setAttribute('tabindex', '-1');
    });
    
    // Mettre le focus sur le premier champ du formulaire
    document.getElementById("prenom").focus();
    
    // Ajouter les écouteurs d'événements
    document.addEventListener('keydown', handleEscapeKey);
    modal.addEventListener('keydown', handleTabKey);
    
    // Sauvegarder l'élément qui avait le focus avant l'ouverture
    this.previouslyFocusedElement = document.activeElement;
}

function closeModal() {
    const modal = document.getElementById("contact_modal");
    const mainContent = document.getElementById("main");
    
    // Cacher le modal
    modal.style.display = "none";
    
    // Restaurer l'accessibilité du contenu principal
    modal.setAttribute("aria-hidden", "true");
    mainContent.setAttribute("aria-hidden", "false");
    
    // Réactiver le focus sur les éléments en arrière-plan
    mainContent.querySelectorAll('[tabindex="-1"]').forEach(el => {
        el.removeAttribute('tabindex');
    });
    
    // Retirer les écouteurs d'événements
    document.removeEventListener('keydown', handleEscapeKey);
    modal.removeEventListener('keydown', handleTabKey);
    
    // Remettre le focus sur l'élément précédent
    if (this.previouslyFocusedElement) {
        this.previouslyFocusedElement.focus();
    }
}

function handleTabKey(e) {
    const modal = document.getElementById("contact_modal");
    const focusableElements = modal.querySelectorAll(
        'button, input, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Si on appuie sur Shift + Tab et qu'on est sur le premier élément
    if (e.shiftKey && e.key === 'Tab' && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
    }
    // Si on appuie sur Tab et qu'on est sur le dernier élément
    else if (!e.shiftKey && e.key === 'Tab' && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
    }
}

function handleEscapeKey(e) {
    if (e.key === "Escape") {
        closeModal();
    }
}
