import Notiflix from 'notiflix';
import axios from 'axios';
// import { fetchPhotoes } from "./photo-api";

const refs = {
    form: document.querySelector('.search-form'),
    gallery: document.querySelector('.gallery')
}

refs.form.addEventListener('submit', handleSubmit)


function showError() {
  Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
}


async function handleSubmit(event) {
     
      event.preventDefault();
      const inputValue = event.target.elements.searchQuery.value;

      try {
        const response = await axios.get('https://pixabay.com/api/', {
          params: {
            key: '37256076-94134e98c6f84438055c7da20',
            q: inputValue,
            image_type: 'photo',
            orientation: 'horizontal',
            safesearch: true,
          },
        });

        const result = response.data.hits;
          
          checkResponse(result);
          createGallery(result);

      } catch (error) {
        Notiflix.Notify.failure('An error occurred while fetching the images. Please try again.');
      }
}
    
function checkResponse(arr) {
    if (arr.length === 0) {
        showError();
        refs.form.reset();
          return;
        }
}

function createGallery(result) {
  let  markup = result
        .map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
            return `<div class="photo-card">
              <img src="${webformatURL}" alt="${tags}" loading="lazy" />
              <div class="info">
                <p class="info-item">
                  <b>Likes ${likes}</b>
                </p>
                <p class="info-item">
                  <b>Views ${views}</b>
                </p>
                <p class="info-item">
                  <b>Comments ${comments}</b>
                </p>
                <p class="info-item">
                  <b>Downloads ${downloads}</b>
                </p>
              </div>
            </div>`;
        })
        .join('');
    refs.gallery.innerHTML = '';
    refs.gallery.insertAdjacentHTML('beforeend', markup);
}