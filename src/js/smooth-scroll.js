const gallery = document.querySelector('.gallery');

export function smoothScroll() {
    const { height: cardHeight } = gallery.firstElementChild.getBoundingClientRect();
    window.scrollBy({
        top: cardHeight*2,
        behavior: "smooth",
    });
}