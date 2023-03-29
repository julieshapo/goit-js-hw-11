import './css/styles.css';
import axios from "axios";
import Notiflix from "notiflix";
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';



const refs = {
    form: document.querySelector('.search-form'),
    input: document.querySelector('input'),
    gallery: document.querySelector('.gallery'),
    loadMoreBtn: document.querySelector('.load-more'),
}

let page = 1;

refs.loadMoreBtn.style.display = 'none';

refs.form.addEventListener('submit', onSearchBtnClick);
refs.loadMoreBtn.addEventListener('click', onBtnLoadMore);



function onSearchBtnClick(e) {
    e.preventDefault();
  
    page = 1;
    refs.gallery.innerHTML = '';
    const inputSearch = refs.input.value.trim();
  console.log(inputSearch)

        if (inputSearch !== '') {
        pixabay(inputSearch);
    } else {
        refs.loadMoreBtn.style.display = 'none';
        return Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
  
  
}

async function pixabay (inputSearch) {
    try {
        const API_URL = 'https://pixabay.com/api/';
        const API_KEY = '34748847-3ccb4c25ceedd5b939786b2e8';
        const params = {
            key: API_KEY,
            q: inputSearch,
            image_type: 'photo',
            orientation: 'horizontal',
            safesearch: true,
            per_page: 40,
            page: page,
        }
        const response = await axios.get(API_URL, { params });
        notification(
        response.data.hits.length, 
        response.data.total 
        );

        createMarkup(response.data)

        console.log(response);
  } catch (error) {
        console.error(error);
  }
  
}

function onBtnLoadMore() {
  const input = refs.input.value.trim();
  smoothScroll();
  page += 1; 
  pixabay(input, page); 
}

function createMarkup(arr) {
    const markup = arr.hits.map( ({largeImageURL, webformatURL, tags, likes, views, comments, downloads }) =>
        `<a class="photo-link" href="${largeImageURL}">
            <div class="photo-card">
            <div class="photo">
            <img src="${webformatURL}" alt="${tags}" loading="lazy"/>
            </div>
                    <div class="info">
                        <p class="info-item">
                            <b>Likes</b>
                            ${likes}
                        </p>
                        <p class="info-item">
                            <b>Views</b>
                            ${views}
                        </p>
                        <p class="info-item">
                            <b>Comments</b>
                            ${comments}
                        </p>
                        <p class="info-item">
                            <b>Downloads</b>
                            ${downloads}
                        </p>
                    </div>
            </div>
        </a>`
    )
    .join(''); 
  refs.gallery.insertAdjacentHTML('beforeend', markup); 
  simpleLightBox.refresh(); 
  
   if (page > 1) {
    smoothScroll();
  }
}

const simpleLightBox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});


function notification(length = 20, totalHits) {
    if (length === 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }

  if (page === 1) {
    refs.loadMoreBtn.style.display = 'flex'; 
    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
  }

  if (length < 40) {
    refs.loadMoreBtn.style.display = 'none';
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
  }
}

function smoothScroll() {
    const { height: cardHeight } = document
  .querySelector(".gallery")
  .firstElementChild.getBoundingClientRect();

window.scrollBy({
  top: cardHeight * 2,
  behavior: "smooth",
});
}

