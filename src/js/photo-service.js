import axios from "axios";

export const APIService = {
    API_KEY: '32675629-6d03a52af7160c0ed7727c460',
    BASE_URL: 'https://pixabay.com/api/',
    searchQuery: '',
    page: 1,

    async getArticles() {
        const url = `${this.BASE_URL}?key=${this.API_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=40`;
        this.incrementPage();
        const response = await axios.get(url);
        const { data } = response;
        return data;
    },

    incrementPage() {
        this.page += 1;
    },

    resetPage() {
        this.page = 1;
    },

    set query(newQuery) {
        this.searchQuery = newQuery;
    },

    get query() {
        return this.searchQuery;
    },
}


