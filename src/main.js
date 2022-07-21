const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3/',
    headers: {
        'Content-Type': 'application/json;charset=utf-8',
    },
    params: {
        'api_key': API_KEY,
    }
});

const getTrendingMoviesPreview = async()=>{
    const { data } = await api(`trending/movie/day`);
    const movies = data.results;

    console.log({data, movies})

    TrendingMoviesPreviewList.innerHTML = "";
    movies.forEach(movie => {

        const movieContainer = document.createElement("div");
        movieContainer.classList.add('movie-container');

        const movieImg = document.createElement('img');
        movieImg.classList.add('movie-img');
        movieImg.setAttribute('alt', movie.title);
        movieImg.setAttribute('src',`https://image.tmdb.org/t/p/w300${movie.poster_path}`);

        movieContainer.appendChild(movieImg);
        TrendingMoviesPreviewList.appendChild(movieContainer);
    });
}

const getCategoriesPreview = async()=>{
    const { data } = await api(`genre/movie/list`);
    const categories = data.genres;

    console.log({data, categories})
    
    categoriesPreviewList.innerHTML = "";
    categories.forEach(category => {
        const categoryContainer = document.createElement("div");
        categoryContainer.classList.add('category-container');

        const categorytitle = document.createElement('h3');
        categorytitle.classList.add('category-title');
        categorytitle.setAttribute('id', `id${category.id}`);
        const categoryTitleText = document.createTextNode(category.name);
        
        categorytitle.appendChild(categoryTitleText);
        categoryContainer.appendChild(categorytitle);
        categoriesPreviewList.appendChild(categoryContainer);
    
    });
}

 