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

console.log(id); // affiche l'ID du photographe

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
  const headerInfoDiv = document.createElement("div");
  headerInfoDiv.className = "divInfoHeader";
  const nameH1 = document.createElement("h1");
  const locationDiv = document.createElement("div");
  const locationP = document.createElement("p");
  locationP.className = "paraVillePays";
  const descriptionP = document.createElement("p");
  descriptionP.className = "descriptionInfo";
  const imgProfilDiv = document.createElement("div");
  imgProfilDiv.className = "container-image-profil";
  const imgTag = document.createElement("img");
  imgTag.className = "image-profil";

  nameH1.textContent = photographer.name;
  locationP.textContent = `${photographer.city}, ${photographer.country}`;
  descriptionP.textContent = photographer.tagline;
  imgTag.src = `assets/photographers/${photographer.portrait}`;
  imgTag.setAttribute("alt", photographer.name);

  locationDiv.appendChild(locationP);

  headerInfoDiv.appendChild(nameH1);
  headerInfoDiv.appendChild(locationDiv);
  headerInfoDiv.appendChild(descriptionP);

  const mainTag = document.querySelector("#main .photograph-header");
  mainTag.insertBefore(headerInfoDiv, mainTag.firstChild);

  let contactButton = document.querySelector(".contact_button");
  if (contactButton) {
    mainTag.insertBefore(contactButton, headerInfoDiv.nextSibling);
  }

  imgProfilDiv.appendChild(imgTag);
  mainTag.appendChild(imgProfilDiv);

  const totalLikesP = document.createElement("p");
  totalLikesP.className = "total-likes";
  totalLikesP.innerHTML = `${photographer.totalLikes} ${filledHeartSVGBlack}`;

  const priceP = document.createElement("p");
  priceP.textContent = `${photographer.price} € / jour`;

  const infoPhotographeDiv = document.querySelector(".info-photographe");
  infoPhotographeDiv.appendChild(totalLikesP);
  infoPhotographeDiv.appendChild(priceP);
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
      const altText = `${mediaItem.title}, closeup view`;
      mediaElement.setAttribute("alt", altText);
    } else if (mediaItem.video) {
      mediaElement = document.createElement("video");
      mediaElement.setAttribute("autoplay", "");
      mediaElement.setAttribute("loop", "");
      mediaElement.setAttribute("muted", "");
      mediaElement.className = "media";

      let source = document.createElement("source");
      source.src = `assets/images/${mediaItem.photographerName}/${mediaItem.video}`;
      source.type = "video/mp4";
      const altText = `${mediaItem.title}, closeup view`;
      source.setAttribute("alt", altText);

      mediaElement.appendChild(source);
    }

    if (mediaElement) {
      mediaElement.addEventListener("click", function () {
        currentIndex = index;

        document.getElementById("main").style.filter = "blur(5px)";
        const modal = document.createElement("div");
        modal.className = "modal-photo";
        modal.setAttribute("aria-label", "image closeup view");

        const closeButton = document.createElement("span");
        closeButton.className = "close";
        closeButton.innerHTML = "&times;";
        closeButton.setAttribute("alt", "Close dialog");
        closeButton.addEventListener("click", function (event) {
          event.stopPropagation();
          document.getElementById("main").style.filter = "none";
          document.body.removeChild(modal);
        });
        modal.appendChild(closeButton);

        const nextButton = document.createElement("button");
        nextButton.id = "next";
        nextButton.className = "nav-button";
        nextButton.setAttribute("alt", "Next image");
        nextButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="50px" viewBox="0 0 24 24" width="50px" fill="#901C1C"><g><path d="M0,0h24v24H0V0z" fill="none"/></g><g><polygon points="6.23,20.23 8,22 18,12 8,2 6.23,3.77 14.46,12"/></g></svg>`;
        nextButton.addEventListener("click", function (event) {
          event.stopPropagation();
          currentIndex = (currentIndex + 1) % media.length;
          updateSliderModal(modal, media[currentIndex]);
        });

        const prevButton = document.createElement("button");
        prevButton.id = "prev";
        prevButton.className = "nav-button";
        prevButton.setAttribute("alt", "Previous image");
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
      let isLiked = false;
      likes.innerHTML = `${mediaItem.likes} ${filledHeartSVGRed}`;

      // Ajout de l'événement click
      likes.addEventListener("click", function (event) {
        event.stopPropagation(); // Empêche le déclenchement de la modal
        if (!isLiked) {
          mediaItem.likes++;
          isLiked = true;
        } else {
          mediaItem.likes--;
          isLiked = false;
        }
        likes.innerHTML = `${mediaItem.likes} ${filledHeartSVGRed}`;
        updateTotalLikes();
      });

      // Ajouts pour l'accessibilité
      likes.style.cursor = "pointer";
      likes.setAttribute("aria-label", `Like ${mediaItem.title}`);
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
    mediaElement.setAttribute("alt", mediaItem.title);
  } else if (mediaItem.video) {
    mediaElement = document.createElement("video");
    mediaElement.setAttribute("autoplay", "");
    mediaElement.setAttribute("loop", "");
    mediaElement.setAttribute("muted", "");
    mediaElement.className = "media-modal";

    let source = document.createElement("source");
    source.src = `assets/images/${mediaItem.photographerName}/${mediaItem.video}`;
    source.type = "video/mp4";
    source.setAttribute("alt", mediaItem.title);

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
