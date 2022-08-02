//Data

const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3/',
    headers: {
        'Content-Type': 'application/json;charset=utf-8',
    },
    params: {
        'api_key': API_KEY,
    }
});

const likedMoviesList = ()=>{
    const item = JSON.parse(localStorage.getItem('liked_movies'));
    let movies;
    if(item){
        movies = item;
    } else{
        movies= {};
    }

    return movies;
}

const likeMovie = (movie)=>{
        const likedMovies = likedMoviesList();

        if(likedMovies[movie.id]){
            likedMovies[movie.id] = undefined;
        } else{
            //console.log('la pelicula no estaba en localStorage');
            likedMovies[movie.id] = movie;
        }

        localStorage.setItem('liked_movies',JSON.stringify(likedMovies));
     }
//Utils
//cargar los poster de las peliculas cuando estan siendo observadas en pantalla
const lazyLoader = new IntersectionObserver((entries)=>{
    entries.forEach((entry)=>{
        if(entry.isIntersecting){
            const url = entry.target.getAttribute('data-img');
            entry.target.setAttribute('src',url);
        }

    })
});

const createMovies = (
    movies,
    container,
    {
        lazyload = true,
        clean = true
    } = {}) =>{

    if(clean){
    container.innerHTML = "";
    }

    movies.forEach(movie => {

        const movieContainer = document.createElement("div");
        movieContainer.classList.add('movie-container');

        const movieImg = document.createElement('img');
        movieImg.classList.add('movie-img');
        movieImg.setAttribute('alt', movie.title);
        movieImg.setAttribute(
            lazyload ? 'data-img' : 'src',
            `https://image.tmdb.org/t/p/w300${movie.poster_path}`);
        movieImg.addEventListener('click', ()=>{
            location.hash = `#movie=${movie.id}`
        })
        //Colocar imagen por defecto en el SRC cuando no cargue por error 400   
        movieImg.addEventListener('error',()=>{
            movieImg.setAttribute(
                'src',
                 'https://static.platzi.com/static/images/error/img404.png'
                 );
        });

        const movieBtn = document.createElement('button');
        movieBtn.classList.add('movie-btn');
        likedMoviesList()[movie.id] && movieBtn.classList.add('movie-btn--liked');
        movieBtn.addEventListener('click', ()=>{
            movieBtn.classList.toggle('movie-btn--liked');
            likeMovie(movie);
        });

        if(lazyload){
            lazyLoader.observe(movieImg);
        }

        movieContainer.appendChild(movieImg);
        movieContainer.appendChild(movieBtn);
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

//Llamados a la API

const getTrendingMoviesPreview = async()=>{
    const { data } = await api(`trending/movie/day`);
    const movies = data.results;
    console.log({data, movies})

    createMovies(movies,TrendingMoviesPreviewList, {lazyload:true, clean: true});
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
    maxPage = data.total_pages
    const movies = data.results;
    //console.log({data, movies})

    createMovies(movies, genericSection, true);
}

//funcion de paginacion de scroll infinito en la seccion de categorias
const getPaginatedMoviesByCategories = (id)=>{
    return async()=>{
        const {scrollTop, scrollHeight, clientHeight } = document.documentElement;

        const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15);
        const pageIsNotMax = page < maxPage;
    
        if(scrollIsBottom && pageIsNotMax){
            page++;
            const { data } = await api(`discover/movie`,{
                params:{
                    page,
                    with_genres: id,
                },
            });
            const movies = data.results;
            //console.log({data, movies})
            
            createMovies(movies,genericSection, {lazyload: true, clean: false});
    }
    }
}

const getMoviesBySearch = async(query)=>{
    const { data } = await api('search/movie', {
        params: {
            query,
        },
    });
    maxPage = data.total_pages;
    const movies = data.results;
    //console.log({data, movies})

    createMovies(movies, genericSection);
}

//Funcion de paginacion de scroll infinito en la seccion de busquedas
const getPaginatedMoviesBySearch = (query)=>{
    return async()=>{
        const {scrollTop, scrollHeight, clientHeight } = document.documentElement;

        const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15);
        const pageIsNotMax = page < maxPage;
    
        if(scrollIsBottom && pageIsNotMax){
            page++;
            const { data } = await api(`search/movie`,{
                params:{
                    page,
                    query,
                },
            });
            const movies = data.results;
            //console.log({data, movies})
            
            createMovies(movies,genericSection, {lazyload: true, clean: false});
    }
    }
}

const getTrendingMovies = async () =>{
        const { data } = await api(`trending/movie/day`);
        const movies = data.results;
        maxPage = data.total_pages;
        //console.log({data, movies})
    
        createMovies(movies,genericSection, {lazyload: true, clean: true});

        //const btnLoadMore = document.createElement('button');
        //btnLoadMore.innerText = 'Cargar más';
        //btnLoadMore.addEventListener('click', getPaginatedTrendingMovies)
        //genericSection.appendChild(btnLoadMore);
}

//funcion de paginacion scroll infinito en la seccion de tendencias
const getPaginatedTrendingMovies = async()=>{
    const {scrollTop, scrollHeight, clientHeight } = document.documentElement;

    const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15);
    const pageIsNotMax = page < maxPage;

    if(scrollIsBottom && pageIsNotMax){
        page++;
        const { data } = await api(`trending/movie/day`,{
            params:{
                page,
            },
        });
        const movies = data.results;
        //console.log({data, movies})
        
        createMovies(movies,genericSection, {lazyload: true, clean: false});
    }
    //const btnLoadMore = document.createElement('button');
    //btnLoadMore.innerText = 'Cargar más';
    //btnLoadMore.addEventListener('click', getPaginatedTrendingMovies)
    //genericSection.appendChild(btnLoadMore);
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

const getLikedMovies = () =>{
    const likedMovies = likedMoviesList();

    const moviesArray = Object.values(likedMovies);
    createMovies(moviesArray, likedMovieList , {lazyload: true, clean: true})
}