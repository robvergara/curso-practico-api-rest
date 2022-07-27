const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3/',
    headers: {
        'Content-Type': 'application/json;charset=utf-8',
    },
    params: {
        'api_key': API_KEY,
    }
});

//Utils

const lazyLoader = new IntersectionObserver((entries)=>{
    entries.forEach((entry)=>{
        if(entry.isIntersecting){
            const url = entry.target.getAttribute('data-img');
            entry.target.setAttribute('src',url);
        }

    })
});

const createMovies = (movies, container, lazyload = false) =>{
    container.innerHTML = "";
    movies.forEach(movie => {

        const movieContainer = document.createElement("div");
        movieContainer.classList.add('movie-container');
        movieContainer.addEventListener('click', ()=>{
            location.hash = `#movie=${movie.id}`
        })

        const movieImg = document.createElement('img');
        movieImg.classList.add('movie-img');
        movieImg.setAttribute('alt', movie.title);
        movieImg.setAttribute(
            lazyload ? 'data-img' : 'src',
            `https://image.tmdb.org/t/p/w300${movie.poster_path}`);
        //Colocar imagen por defecto en el SRC cuando no cargue por error 400   
        movieImg.addEventListener('error',()=>{
            movieImg.setAttribute(
                'src',
                 'https://static.platzi.com/static/images/error/img404.png'
                 );
        });

        if(lazyload){
            lazyLoader.observe(movieImg);
        }

        movieContainer.appendChild(movieImg);
        container.appendChild(movieContainer);
    });
}

const createCategories = (categories, container)=>{
    container.innerHTML = "";
    categories.forEach(category => {
        const categoryContainer = document.createElement("div");
        categoryContainer.classList.add('category-container');

        const categoryTitle = document.createElement('h3');
        categoryTitle.classList.add('category-title');
        categoryTitle.addEventListener('click', ()=>{
            location.hash = `#category=${category.id}-${category.name}`
        })
        categoryTitle.setAttribute('id', `id${category.id}`);

        const categoryTitleText = document.createTextNode(category.name);
        
        categoryTitle.appendChild(categoryTitleText);
        categoryContainer.appendChild(categoryTitle);
        container.appendChild(categoryContainer);
    
    });
}

const getTrendingMoviesPreview = async()=>{
    const { data } = await api(`trending/movie/day`);
    const movies = data.results;
    console.log({data, movies})

    createMovies(movies,TrendingMoviesPreviewList, true);
}

const getCategoriesPreview = async()=>{
    const { data } = await api(`genre/movie/list`);
    const categories = data.genres;

    //console.log({data, categories})
    createCategories(categories, categoriesPreviewList)

}

const getMoviesByCategory = async(id)=>{
    const { data } = await api(`discover/movie`, {
        params: {
            with_genres: id,
        },
    });
    const movies = data.results;
    //console.log({data, movies})

    createMovies(movies, genericSection, true);
}

const getMoviesBySearch = async(query)=>{
    const { data } = await api('search/movie', {
        params: {
            query,
        },
    });
    const movies = data.results;
    //console.log({data, movies})

    createMovies(movies, genericSection);
}

const getTrendingMovies = async () =>{
        const { data } = await api(`trending/movie/day`);
        const movies = data.results;
        //console.log({data, movies})
    
        createMovies(movies,genericSection);
}

const getMovieById = async (id) =>{
    const {data: movie} = await api(`movie/${id}`);

    const movieImgUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

    headerSection.style.background = `
    linear-gradient(
        180deg, 
        rgba(0, 0, 0, 0.35) 19.27%, 
        rgba(0, 0, 0, 0) 29.17%
    ),
    url(${movieImgUrl})`;

    movieDetailTitle.textContent = movie.title;
    movieDetailDescription.textContent = movie.overview;
    movieDetailScore.textContent = movie.vote_average;

    createCategories(movie.genres, movieDetailCategoriesList)
    getRelatedMoviesById(id)

}

const getRelatedMoviesById = async(id) =>{
    const {data} = await api(`movie/${id}/similar`);
    const movies = data.results;

    createMovies(movies,relatedMoviesContainer);    
}