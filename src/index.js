import { Notify } from "notiflix";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { Spinner } from 'spin.js';
import { APIService } from "./partials/js/photo-service";

var optsForSpinner = {
    lines: 13, // The number of lines to draw
    length: 38, // The length of each line
    width: 18, // The line thickness
    radius: 24, // The radius of the inner circle
    scale: 0.4, // Scales overall size of the spinner
    corners: 0.2, // Corner roundness (0..1)
    speed: 1, // Rounds per second
    rotate: 0, // The rotation offset
    animation: 'spinner-line-shrink', // The CSS animation name for the lines
    direction: 1, // 1: clockwise, -1: counterclockwise
    color: '#000000', // CSS color or array of colors
    fadeColor: 'transparent', // CSS color or array of colors
    top: '100%', // Top position relative to parent
    left: '50%', // Left position relative to parent
    shadow: '0 0 1px transparent', // Box-shadow for the lines
    zIndex: 2000000000, // The z-index (defaults to 2e9)
    className: 'spinner', // The CSS class to assign to the spinner
    position: 'absolute', // Element positioning
};

const gallery = document.querySelector('.gallery');
const formEl = document.querySelector('.search-form');
const loadMoreButton = document.querySelector('.load-more');  
const submitButton = document.querySelector('.search-btn')
const body = document.querySelector('body')

loadMoreButton.classList.add('is-hidden');
let amountOfImages = 0;
let lightbox = new SimpleLightbox('.gallery a');
let spinner = new Spinner(optsForSpinner).spin();


formEl.addEventListener('submit', onFormSubmit);
formEl.addEventListener('input', onFormInput);
loadMoreButton.addEventListener('click', onLoadMore);

Notify.init({
    width: '400px',
    position: 'left-top',
    clickToClose: true,
});

function onFormSubmit(e) {
    e.preventDefault();
    setTimeout(() => {submitButton.blur();}, 250)
    loadMoreButton.classList.add('is-hidden');
    gallery.innerHTML = '';

    if (APIService.query === '') {
        return Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    }
    
    APIService.resetPage();
    amountOfImages = 0;
    spinner.spin();
    body.appendChild(spinner.el);
    createMarkUp();
}

function onFormInput(e) {
    APIService.query = e.target.value.trim();
}

function onLoadMore() {
    loadMoreButton.classList.add('is-hidden');
    spinner.spin();
    body.appendChild(spinner.el);
    createMarkUp();
}

async function createMarkUp() {
    try {
        const data = await APIService.getArticles();
        const { hits, totalHits } = data;

        if (hits.length === 0) {
            return Notify.failure('Sorry, there are no images matching your search query. Please try again.');
        }

        if (amountOfImages === 0) {
            Notify.success(`Hooray! We found ${totalHits} images.`);
        }

        const markUp = hits.map(hit => {
            const { webformatURL, largeImageURL, tags, likes, views, comments, downloads } = hit;
            amountOfImages += 1;
        
            return`<div class="photo-card">
            <a href="${largeImageURL}">
            <img src="${webformatURL}" alt="${tags}" loading="lazy" />
            <div class="info">
            <p class="info-item"><b>Likes</b>
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
            </a>
            </div>`;
        });

        gallery.insertAdjacentHTML('beforeend', markUp.join(''));
        loadMoreButton.classList.remove('is-hidden');  

        lightbox.refresh();

        if (APIService.page > 2) {
            smoothScroll();
        }

        spinner.stop();

        if (amountOfImages >= totalHits) {
            loadMoreButton.classList.add('is-hidden');
            return Notify.info(`We're sorry, but you've reached the end of search results.`);
        }

    } catch (error) {
        console.log(error)
    }
}

function smoothScroll() {
    const { height: cardHeight } = gallery.firstElementChild.getBoundingClientRect();
    window.scrollBy({
        top: cardHeight*2,
        behavior: "smooth",});
}