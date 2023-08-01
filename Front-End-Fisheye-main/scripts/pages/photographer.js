const urlParams = new URLSearchParams(window.location.search);
const id = Number(urlParams.get('id'));

const filledHeartSVG = `
<svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12 5.881C12.981 4.729 14.484 4 16.05 4C18.822 4 21 6.178 21 8.95C21 12.3492 17.945 15.1195 13.3164 19.3167L13.305 19.327L12 20.515L10.695 19.336L10.6595 19.3037C6.04437 15.1098 3 12.3433 3 8.95C3 6.178 5.178 4 7.95 4C9.516 4 11.019 4.729 12 5.881Z" fill="#000000"/>
</svg>
`;

console.log(id); // affiche l'ID du photographe

async function getPhotographerById(id) {
  const response = await fetch('./data/photographers.json');
  const data = await response.json();

  const photographers = data.photographers;
  const photographer = photographers.find(photographer => photographer.id === id);

  // Ajout des médias correspondants au photographe
  photographer.media = data.media.filter(media => media.photographerId === id);

  // Calcul du total des likes
  photographer.totalLikes = photographer.media.reduce((total, image) => total + image.likes, 0);

  // Ajouter le prix du photographe
  photographer.price = photographers.find(photographer => photographer.id === id).price;

  // Ajouter le nom du photographe à chaque image
  photographer.media.forEach(image => {
    image.photographerName = photographer.name;
  });

  return photographer;
}

// Fonction de trie pour les images qui prend en argument les données du photographe dans le json et les options dans la liste de triage
function sortMedia(photographer, option) {
  switch(option) {
    case 'Popularité':
      photographer.media.sort((a, b) => b.likes - a.likes);
      break;
    // Cas de tri par Date
    case 'Date':
      // Trier le tableau d'images du photographe en fonction de leur date.
      // La fonction de comparaison prend deux medias (a et b) et retourne la différence entre leurs dates.
      // Si la différence est négative, a est classé avant b. Si elle est positive, b est classé avant a.
      // En d'autres termes, cela trie les medias par date décroissante.
      photographer.media.sort((a, b) => new Date(b.date) - new Date(a.date));
      break;
    // Cas de tri par Type
    case 'Type':
      // Trier le tableau d'medias du photographe en fonction de leur type (image ou vidéo).
      // Pour chaque medias, on vérifie si l'attribut 'image' est présent. Si c'est le cas, le type est défini sur 'image'.
      // Sinon, le type est défini sur 'video'.
      // Ensuite, on utilise la méthode localeCompare() pour comparer les types.
      // Cette méthode retourne un nombre négatif si typeA doit être classé avant typeB,
      // un nombre positif si typeB doit être classé avant typeA, ou 0 s'ils sont égaux.
      // En d'autres termes, cela trie les medias de manière à ce que toutes les images soient classées avant les vidéos.
      photographer.media.sort((a, b) => {
        let typeA = a.image ? 'image' : 'video';
        let typeB = b.image ? 'image' : 'video';
        return typeA.localeCompare(typeB);
      });
      break;
  }
}


// Récupération des éléments du DOM
let button = document.getElementById('sortOrder_button'); // Bouton pour afficher/masquer la liste déroulante
let sortOrderLabel = document.getElementById('sortOrder_label'); // Étiquette pour le libellé actuel de l'option sélectionnée
let sortOrderValue = document.getElementById('sortOrder_value'); // Valeur de l'option sélectionnée
let sortOrderListbox = document.getElementById('sortOrder_listbox'); // Liste déroulante
let options = Array.from(sortOrderListbox.children); // Options de tri dans la liste déroulante

// Gestionnaire de clic sur le bouton
button.addEventListener('click', function (event) {
  // Vérifier si la liste déroulante est actuellement ouverte ou fermée
  let isExpanded = button.getAttribute('aria-expanded') === 'true';

  // Inverser l'état de la liste déroulante (ouvrir/fermer)
  button.setAttribute('aria-expanded', !isExpanded);
  sortOrderListbox.style.display = isExpanded ? 'none' : 'block';

  // Mettre à jour la classe du bouton pour refléter l'état de la liste déroulante
  if (isExpanded) {
    button.classList.remove('open');
  } else {
    button.classList.add('open');
  }
});

options.forEach(function (option) {
  option.addEventListener('click', function (event) {
    // Réinitialiser l'état de toutes les options
    options.forEach(function (otherOption) {
      otherOption.setAttribute('aria-selected', 'false');
      otherOption.classList.remove('hidden');
    });

    // Mettre à jour l'état de l'option sélectionnée
    option.setAttribute('aria-selected', 'true');
    option.classList.add('hidden');

    // Mettre à jour le libellé et la valeur de l'option sélectionnée
    sortOrderValue.textContent = option.textContent;

    // Fermer la liste déroulante et réinitialiser l'état du bouton
    button.setAttribute('aria-expanded', 'false');
    sortOrderListbox.style.display = 'none';
    button.classList.remove('open');
    
    getPhotographerById(id)
    .then(photographer => {
      // Suppression des anciennes images
      const photos = document.getElementById('photos');
      photos.innerHTML = '';
  
      // Trier les images
      sortMedia(photographer, option.dataset.value);
  
      // Réafficher les images
      displayImages(photographer.media);
    })
    .catch(error => console.error(error));
  });
});

// Fonction pour afficher les informations d'un photographe dans le DOM
async function displayPhotographerInfo(photographer) {
  const headerInfoDiv = document.createElement('div');
  headerInfoDiv.className = 'divInfoHeader'
  const nameH1 = document.createElement('h1');
  const locationDiv = document.createElement('div');
  const locationP = document.createElement('p');
  locationP.className = 'paraVillePays'
  const descriptionP = document.createElement('p');
  descriptionP.className = 'descriptionInfo';
  const imgProfilDiv = document.createElement('div');
  imgProfilDiv.className = 'container-image-profil'
  const imgTag = document.createElement('img');
  imgTag.className = 'image-profil'

  nameH1.textContent = photographer.name;
  locationP.textContent = `${photographer.city}, ${photographer.country}`;
  descriptionP.textContent = photographer.tagline;
  imgTag.src = `assets/photographers/${photographer.portrait}`;

  locationDiv.appendChild(locationP);

  headerInfoDiv.appendChild(nameH1);
  headerInfoDiv.appendChild(locationDiv);
  headerInfoDiv.appendChild(descriptionP);

  const mainTag = document.querySelector('#main .photograph-header');
  mainTag.insertBefore(headerInfoDiv, mainTag.firstChild);

  let contactButton = document.querySelector('.contact_button');
  if (contactButton) {
      mainTag.insertBefore(contactButton, headerInfoDiv.nextSibling);
  }
  

  imgProfilDiv.appendChild(imgTag);
  mainTag.appendChild(imgProfilDiv);

  const totalLikesP = document.createElement('p');
  totalLikesP.className = 'total-likes'
  totalLikesP.innerHTML = `${photographer.totalLikes} ${filledHeartSVG}`;

  const priceP = document.createElement('p');
  priceP.textContent = `${photographer.price} € / jour`;

  const infoPhotographeDiv = document.querySelector('.info-photographe');
  infoPhotographeDiv.appendChild(totalLikesP);
  infoPhotographeDiv.appendChild(priceP);
}

// Fonction pour afficher les images d'un photographe dans le DOM
async function displayImages(media) {
  const photos = document.getElementById('photos');
  const imagesDiv = document.createElement('div');
  imagesDiv.className = 'photographer-images';

  media.forEach(media => {
      const imageDiv = document.createElement('div');
      imageDiv.className = 'image-div';
      
      let mediaElement;
      
      if(media.image) {
          mediaElement = document.createElement('img');
          mediaElement.src = `assets/images/${media.photographerName}/${media.image}`;
          mediaElement.className='media'
      } 
      else if(media.video) {
          mediaElement = document.createElement('video');
          mediaElement.setAttribute('autoplay', '');
          mediaElement.setAttribute('loop', '');
          mediaElement.setAttribute('muted', '');
          mediaElement.className='media'

          let source = document.createElement('source');
          source.src = `assets/images/${media.photographerName}/${media.video}`;
          source.type = "video/mp4";

          mediaElement.appendChild(source);
      }
      
      if (mediaElement) {
          mediaElement.addEventListener('click', function() {
              const modal = document.createElement('div');
              modal.className = 'modal-photo';
    
              let modalMediaElement;
              if(media.image) {
                  modalMediaElement = document.createElement('img');
                  modalMediaElement.className='media-modal';
                  modalMediaElement.src = `assets/images/${media.photographerName}/${media.image}`;
                  modalMediaElement.style.width = "1500px";
                  modalMediaElement.style.height = "750px";
              } else if(media.video) {
                  modalMediaElement = document.createElement('video');
                  modalMediaElement.className='media-modal'
                  modalMediaElement.controls = true;
                  modalMediaElement.style.width = "1500px";
                  modalMediaElement.style.height = "750px";

                  let source = document.createElement('source');
                  source.src = `assets/images/${media.photographerName}/${media.video}`;
                  source.type = "video/mp4";

                  modalMediaElement.appendChild(source);
              }

              modal.appendChild(modalMediaElement);
              document.body.appendChild(modal);

              modal.addEventListener('click', function() {
                  document.body.removeChild(modal);
              });
          });

          mediaElement.className = 'images-photographer';

          const infoImage = document.createElement('div');
          infoImage.className = 'info-image';

          const titleImage = document.createElement('p');
          titleImage.className='title-image';
          titleImage.innerHTML= ` ${media.title} `

          const likes = document.createElement('p');
          likes.className='likes-images'
          likes.innerHTML = `${media.likes} ${filledHeartSVG}`;

          infoImage.appendChild(titleImage);
          infoImage.appendChild(likes);
          imageDiv.appendChild(mediaElement);
          imageDiv.appendChild(infoImage);
          imagesDiv.appendChild(imageDiv);
      }
  });

  photos.appendChild(imagesDiv);
}


getPhotographerById(id)
  .then(photographer => {
    displayPhotographerInfo(photographer);
    displayImages(photographer.media);
  });
