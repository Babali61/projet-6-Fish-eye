const urlParams = new URLSearchParams(window.location.search);
const id = Number(urlParams.get("id"));

let filledHeartSVGBlack = `
<svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="likes">
<path d="M12 5.881C12.981 4.729 14.484 4 16.05 4C18.822 4 21 6.178 21 8.95C21 12.3492 17.945 15.1195 13.3164 19.3167L13.305 19.327L12 20.515L10.695 19.336L10.6595 19.3037C6.04437 15.1098 3 12.3433 3 8.95C3 6.178 5.178 4 7.95 4C9.516 4 11.019 4.729 12 5.881Z" fill="#000000"/>
</svg>
`;

let filledHeartSVGRed = `
<svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="likes">
<path d="M12 5.881C12.981 4.729 14.484 4 16.05 4C18.822 4 21 6.178 21 8.95C21 12.3492 17.945 15.1195 13.3164 19.3167L13.305 19.327L12 20.515L10.695 19.336L10.6595 19.3037C6.04437 15.1098 3 12.3433 3 8.95C3 6.178 5.178 4 7.95 4C9.516 4 11.019 4.729 12 5.881Z" fill="#901C1C"/>
</svg>
`;

const likedMediaItems = new Map();

async function getPhotographerById(id) {
  const response = await fetch("./data/photographers.json");
  const data = await response.json();

  const photographers = data.photographers;
  const photographer = photographers.find(
    (photographer) => photographer.id === id
  );

  // Ajout des médias correspondants au photographe
  photographer.media = data.media.filter(
    (media) => media.photographerId === id
  );

  //  Ajout restauration des likes stockés dans la Map si le media est liké
  photographer.media.forEach((media) => {
    if (likedMediaItems.has(media.id)) {
      media.likes = likedMediaItems.get(media.id);
    }
  });

  // Calcul du total des likes
  photographer.totalLikes = photographer.media.reduce(
    (total, image) => total + image.likes,
    0
  );

  // Ajouter le prix du photographe
  photographer.price = photographers.find(
    (photographer) => photographer.id === id
  ).price;

  // Ajouter le nom du photographe à chaque image
  photographer.media.forEach((image) => {
    image.photographerName = photographer.name;
  });

  return photographer;
}

// Fonction de trie pour les images qui prend en argument les données du photographe dans le json et les options dans la liste de triage
function sortMedia(photographer, option) {
  switch (option) {
    case "Popularité":
      // Trier le tableau de média du photographe en fonction de leur date.
      // La fonction de comparaison prend deux medias (a et b) et retourne la différence entre leurs likes.
      // Si la différence est négative, a est classé avant b. Si elle est positive, b est classé avant a.
      // En d'autres termes, cela trie les medias par likes décroissante.
      // Exemple : let numbers = [1, 3, 2];
      // numbers.sort((a, b) => b - a);
      // console.log(numbers); // affiche [3, 2, 1]
      photographer.media.sort((a, b) => b.likes - a.likes);
      break;
    // Cas de tri par Date
    case "Date":
      // Trier le tableau de média du photographe en fonction de leur date.
      // La fonction de comparaison prend deux medias (a et b) et retourne la différence entre leurs dates.
      // Si la différence est négative, a est classé avant b. Si elle est positive, b est classé avant a.
      // En d'autres termes, cela trie les medias par date décroissante.
      photographer.media.sort((a, b) => new Date(b.date) - new Date(a.date));
      break;
    // Cas de tri par Type
    case "Type":
      // Trier le tableau d'medias du photographe en fonction de leur type (image ou vidéo).
      // Pour chaque medias, on vérifie si l'attribut 'image' est présent. Si c'est le cas, le type est défini sur 'image'.
      // Sinon, le type est défini sur 'video'.
      // Ensuite, on utilise la méthode localeCompare() pour comparer les types.
      // Cette méthode retourne un nombre négatif si typeA doit être classé avant typeB,
      // un nombre positif si typeB doit être classé avant typeA, ou 0 s'ils sont égaux.
      // En d'autres termes, cela trie les medias de manière à ce que toutes les images soient classées avant les vidéos.
      photographer.media.sort((a, b) => {
        let typeA = a.image ? "image" : "video";
        let typeB = b.image ? "image" : "video";
        return typeA.localeCompare(typeB);
      });
      break;
  }
}

// Récupération des éléments du DOM
let button = document.getElementById("sortOrder_button"); // Bouton pour afficher/masquer la liste déroulante
let sortOrderLabel = document.getElementById("sortOrder_label"); // Étiquette pour le libellé actuel de l'option sélectionnée
let sortOrderValue = document.getElementById("sortOrder_value"); // Valeur de l'option sélectionnée
let sortOrderListbox = document.getElementById("sortOrder_listbox"); // Liste déroulante
let options = Array.from(sortOrderListbox.children); // Options de tri dans la liste déroulante

// Ajouter la navigation au clavier
button.addEventListener("keydown", function (event) {
  switch (event.key) {
    case "Enter":
    case " ":
      // Empêcher le défilement de la page avec la touche espace
      event.preventDefault();
      // Simuler un clic sur le bouton
      this.click();
      break;
    case "Escape":
      if (button.getAttribute("aria-expanded") === "true") {
        button.setAttribute("aria-expanded", "false");
        sortOrderListbox.style.display = "none";
        button.classList.remove("open");
      }
      break;
  }
});


// Ajouter la navigation au clavier pour les options
options.forEach(function (option) {
  option.addEventListener("keydown", function (event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      this.click();
    }
  });
});


// Gestionnaire de clic sur le bouton
button.addEventListener("click", function (event) {
  // Vérifier si la liste déroulante est actuellement ouverte ou fermée
  let isExpanded = button.getAttribute("aria-expanded") === "true";

  // Inverser l'état de la liste déroulante (ouvrir/fermer)
  button.setAttribute("aria-expanded", !isExpanded);
  sortOrderListbox.style.display = isExpanded ? "none" : "block";

  // Mettre à jour la classe du bouton pour refléter l'état de la liste déroulante
  if (isExpanded) {
    button.classList.remove("open");
  } else {
    button.classList.add("open");
  }
});

options.forEach(function (option) {
  option.addEventListener("click", function (event) {
    // Réinitialiser l'état de toutes les options
    options.forEach(function (otherOption) {
      otherOption.setAttribute("aria-selected", "false");
      otherOption.classList.remove("hidden");
    });

    // Mettre à jour l'état de l'option sélectionnée
    option.setAttribute("aria-selected", "true");
    option.classList.add("hidden");

    // Mettre à jour le libellé et la valeur de l'option sélectionnée
    sortOrderValue.textContent = option.textContent;

    // Fermer la liste déroulante et réinitialiser l'état du bouton
    button.setAttribute("aria-expanded", "false");
    sortOrderListbox.style.display = "none";
    button.classList.remove("open");

    getPhotographerById(id)
      .then((photographer) => {
        // Suppression des anciennes images
        const photos = document.getElementById("photos");
        photos.innerHTML = "";

        // Trier les images
        sortMedia(photographer, option.dataset.value);

        // Réafficher les images
        displayImages(photographer.media);
      })
      .catch((error) => console.error(error));
  });
});

// Fonction pour afficher les informations d'un photographe dans le DOM
async function displayPhotographerInfo(photographer) {
  try {
    const headerInfoDiv = createHeaderInfoDiv(photographer);
    const imgProfilDiv = createImageProfilDiv(photographer);

    const mainTag = await getMainElement();
    mainTag.insertBefore(headerInfoDiv, mainTag.firstChild);

    if (await getContactButton()) {
      mainTag.insertBefore(await getContactButton(), headerInfoDiv.nextSibling);
    }

    mainTag.appendChild(imgProfilDiv);

    const totalLikesP = createTotalLikesP(photographer);
    const priceP = createPriceP(photographer);

    const infoPhotographeDiv = await getInfoPhotographeDiv();
    infoPhotographeDiv.appendChild(totalLikesP);
    infoPhotographeDiv.appendChild(priceP);
  } catch (error) {
    console.error(error);
  }
}

function createHeaderInfoDiv(photographer) {
  const headerInfoDiv = document.createElement("div");
  headerInfoDiv.className = "divInfoHeader";

  const nameH1 = document.createElement("h1");
  const locationDiv = document.createElement("div");
  const locationP = document.createElement("p");
  locationP.className = "paraVillePays";
  const descriptionP = document.createElement("p");
  descriptionP.className = "descriptionInfo";

  nameH1.textContent = photographer.name;
  locationP.textContent = `${photographer.city}, ${photographer.country}`;
  descriptionP.textContent = photographer.tagline;

  locationDiv.appendChild(locationP);

  headerInfoDiv.appendChild(nameH1);
  headerInfoDiv.appendChild(locationDiv);
  headerInfoDiv.appendChild(descriptionP);

  return headerInfoDiv;
}

function createImageProfilDiv(photographer) {
  const imgProfilDiv = document.createElement("div");
  imgProfilDiv.className = "container-image-profil";
  const imgTag = document.createElement("img");
  imgTag.className = "image-profil";

  imgTag.src = `assets/photographers/${photographer.portrait}`;
  imgTag.setAttribute("alt", photographer.name);

  imgProfilDiv.appendChild(imgTag);
  return imgProfilDiv;
}

function createTotalLikesP(photographer) {
  const totalLikesP = document.createElement("p");
  totalLikesP.className = "total-likes";
  totalLikesP.innerHTML = `${photographer.totalLikes} ${filledHeartSVGBlack}`;
  return totalLikesP;
}

function createPriceP(photographer) {
  const priceP = document.createElement("p");
  priceP.textContent = `${photographer.price} € / jour`;
  return priceP;
}

async function getMainElement() {
  try {
    return await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(document.querySelector("#main .photograph-header"));
      }, 100);
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function getInfoPhotographeDiv() {
  try {
    return await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(document.querySelector(".info-photographe"));
      }, 100);
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function getContactButton() {
  try {
    return await new Promise((resolve, reject) => {
      setTimeout(() => {
        const button = document.querySelector(".contact_button");
        if (button) resolve(button);
        else resolve(null);
      }, 100);
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}


async function displayImages(media) {
  const photos = document.getElementById("photos");
  const imagesDiv = document.createElement("div");
  imagesDiv.className = "photographer-images";
  let currentIndex = 0;

  // Fonction pour mettre à jour le total des likes
  const updateTotalLikes = () => {
    const totalLikesElement = document.querySelector(".total-likes");
    const newTotal = media.reduce((total, image) => total + image.likes, 0);
    totalLikesElement.innerHTML = `${newTotal} ${filledHeartSVGBlack}`;
  };

  media.forEach((mediaItem, index) => {
    const imageDiv = document.createElement("div");
    imageDiv.className = "image-div";

    let mediaElement;
    if (mediaItem.image) {
      mediaElement = document.createElement("img");
      mediaElement.src = `assets/images/${mediaItem.photographerName}/${mediaItem.image}`;
      mediaElement.className = "media";
      const altText = `${mediaItem.title} par ${mediaItem.photographerName}. Cliquez pour agrandir`;
      mediaElement.setAttribute("alt", altText);
      mediaElement.setAttribute("role", "button");
      mediaElement.setAttribute("aria-label", `Ouvrir ${mediaItem.title} en grand format`);
    } else if (mediaItem.video) {
      mediaElement = document.createElement("video");
      mediaElement.setAttribute("autoplay", "");
      mediaElement.setAttribute("loop", "");
      mediaElement.setAttribute("muted", "");
      mediaElement.className = "media";
      mediaElement.setAttribute("role", "button");
      mediaElement.setAttribute("aria-label", `Ouvrir la vidéo ${mediaItem.title} en grand format`);

      let source = document.createElement("source");
      source.src = `assets/images/${mediaItem.photographerName}/${mediaItem.video}`;
      source.type = "video/mp4";

      mediaElement.appendChild(source);
    }

    if (mediaElement) {
      mediaElement.setAttribute("tabindex", "0");
      // Support clavier
      mediaElement.addEventListener("keypress", function (event) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          mediaElement.click();
        }
      });
      mediaElement.addEventListener("click", function () {
        currentIndex = index;

        document.getElementById("main").style.filter = "blur(5px)";
        const modal = document.createElement("div");
        modal.className = "modal-photo";

        modal.setAttribute("role", "dialog");
        modal.setAttribute("aria-modal", "true");
        modal.setAttribute("aria-label", "Image closeup view");

        const closeButton = document.createElement("span");
        closeButton.className = "close";
        closeButton.innerHTML = "&times;";
        closeButton.setAttribute("role", "button");
        closeButton.setAttribute("aria-label", "Fermer la vue agrandie");
        closeButton.setAttribute("tabindex", "0");
        closeButton.addEventListener("click", function (event) {
          event.stopPropagation();
          document.getElementById("main").style.filter = "none";
          document.body.removeChild(modal);
        });
        modal.appendChild(closeButton);

        const nextButton = document.createElement("button");
        nextButton.id = "next";
        nextButton.className = "nav-button";
        nextButton.setAttribute("aria-label", "Image suivante");
        nextButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="50px" viewBox="0 0 24 24" width="50px" fill="#901C1C"><g><path d="M0,0h24v24H0V0z" fill="none"/></g><g><polygon points="6.23,20.23 8,22 18,12 8,2 6.23,3.77 14.46,12"/></g></svg>`;
        nextButton.addEventListener("click", function (event) {
          event.stopPropagation();
          currentIndex = (currentIndex + 1) % media.length;
          updateSliderModal(modal, media[currentIndex]);
          if (event.key === "ArrowRight") {
            // Next slide
            currentIndex = (currentIndex + 1) % media.length;
            updateSliderModal(modal, media[currentIndex]);
          }
        });

        // listener pour clavier before, after

        document.addEventListener("keydown", function (event) {
          if (event.key === "ArrowRight") {
            currentIndex = (currentIndex + 1) % media.length;
            updateSliderModal(modal, media[currentIndex]);
          } else if (event.key === "ArrowLeft") {
            // Previous slide
            currentIndex = (currentIndex - 1 + media.length) % media.length;
            updateSliderModal(modal, media[currentIndex]);
          }
        });

        // Ajout de la gestion de la touche Escape pour fermer la modal
        document.addEventListener("keydown", function (event) {
          const modal = document.querySelector(".modal-photo");
          if (event.key === "Escape" && modal) {
            document.getElementById("main").style.filter = "none";
            document.body.removeChild(modal);
          }
        });

        const prevButton = document.createElement("button");
        prevButton.id = "prev";
        prevButton.className = "nav-button";
        prevButton.setAttribute("aria-label", "Image précédente");
        prevButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" height="50px" viewBox="0 0 24 24" width="50px" fill="#901C1C"><path d="M0 0h24v24H0z" fill="none"/><path d="M11.67 3.87L9.9 2.1 0 12l9.9 9.9 1.77-1.77L3.54 12z"/></svg>`;
        prevButton.addEventListener("click", function (event) {
          event.stopPropagation();
          currentIndex = (currentIndex - 1 + media.length) % media.length;
          updateSliderModal(modal, media[currentIndex]);
        });

        const photoContainer = document.createElement("div");
        photoContainer.id = "photo-container";

        modal.appendChild(prevButton);
        modal.appendChild(photoContainer);
        modal.appendChild(nextButton);
        document.body.appendChild(modal);

        updateSliderModal(modal, mediaItem);
      });

      mediaElement.className = "images-photographer";

      const infoImage = document.createElement("div");
      infoImage.className = "info-image";

      const titleImage = document.createElement("p");
      titleImage.className = "title-image";
      titleImage.innerHTML = ` ${mediaItem.title} `;

      const likes = document.createElement("p");
      likes.className = "likes-images";
      let isLiked = likedMediaItems.has(mediaItem.id);
      likes.innerHTML = `${mediaItem.likes} ${filledHeartSVGRed}`;

      // Ajout de l'événement click pour l'incrémentation du like

      likes.addEventListener("click", function (event) {
        event.stopPropagation();
        if (!isLiked) {
          mediaItem.likes++;
          likedMediaItems.set(mediaItem.id, mediaItem.likes);
          isLiked = true;
        } else {
          mediaItem.likes--;
          likedMediaItems.delete(mediaItem.id);
          isLiked = false;
        }
        likes.innerHTML = `${mediaItem.likes} ${filledHeartSVGRed}`;
        updateTotalLikes();
      });

      // Ajouts pour l'accessibilité
      likes.style.cursor = "pointer";
      likes.setAttribute("aria-label", `${isLiked ? "Retirer le like de" : "Aimer"} ${mediaItem.title}`);
      likes.setAttribute("aria-pressed", isLiked ? "true" : "false");
      likes.setAttribute("role", "button");
      likes.setAttribute("tabindex", "0");

      // Support clavier
      likes.addEventListener("keypress", function (event) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          likes.click();
        }
      });

      infoImage.appendChild(titleImage);
      infoImage.appendChild(likes);
      imageDiv.appendChild(mediaElement);
      imageDiv.appendChild(infoImage);
      imagesDiv.appendChild(imageDiv);
    }
  });

  photos.appendChild(imagesDiv);
}

function updateSliderModal(modal, mediaItem) {
  const photoContainer = modal.querySelector("#photo-container");
  while (photoContainer.firstChild) {
    photoContainer.firstChild.remove();
  }

  let mediaElement;
  if (mediaItem.image) {
    mediaElement = document.createElement("img");
    mediaElement.src = `assets/images/${mediaItem.photographerName}/${mediaItem.image}`;
    mediaElement.className = "media-modal";
    mediaElement.setAttribute(
      "alt",
      `${mediaItem.title} par ${mediaItem.photographerName}`
    );
  } else if (mediaItem.video) {
    mediaElement = document.createElement("video");
    mediaElement.setAttribute("autoplay", "");
    mediaElement.setAttribute("loop", "");
    mediaElement.setAttribute("muted", "");
    mediaElement.className = "media-modal";

    let source = document.createElement("source");
    source.src = `assets/images/${mediaItem.photographerName}/${mediaItem.video}`;
    source.type = "video/mp4";
    source.setAttribute(
      "alt",
      `${mediaItem.title} par ${mediaItem.photographerName}`
    );

    mediaElement.appendChild(source);
  }

  photoContainer.appendChild(mediaElement);
}

document.querySelector(".submit-button").addEventListener("click", (event) => {
  // Empêche le rechargement de la page
  event.preventDefault();

  let prenom = document.querySelector("#prenom").value;
  let nom = document.querySelector("#nom").value;
  let email = document.querySelector("#email").value;
  let message = document.querySelector("#message").value;

  // Affiche les valeurs dans la console (pour le débogage)
  console.log(`Prénom : ${prenom}`);
  console.log(`Nom : ${nom}`);
  console.log(`Email : ${email}`);
  console.log(`Message : ${message}`);
});

getPhotographerById(id).then((photographer) => {
  displayPhotographerInfo(photographer);
  displayImages(photographer.media);
});
