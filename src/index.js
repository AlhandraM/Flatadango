let allMovies = [];
let currentMovie = null;

document.getElementById("buy-ticket").addEventListener("click", function (e) {
  e.preventDefault();
  //console.log("Buy movie");
  let result = currentMovie;
  let remainingTickets = result.capacity - result.tickets_sold;
  const ticket = document.getElementById("ticket-num");

  if (remainingTickets > 0) {
    makeASale(result);
  } else {
    ticket.innerText = " !!! Sold OUT";
  }
});

function getMovies() {
 
  const requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  fetch("http://localhost:3000/films", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      //console.log(result);
      allMovies = result;
      console.log(result)
      ListMovies(result);
    })
    .catch((error) => console.error(error));
}

function ListMovies(movies) {
  const movieList = document.getElementById("films");
  movieList.innerHTML=""
  let html = "";

  for (let i = 0; i < movies.length; i++) {
    let movie = movies[i];

    html =
      html +
      `
        <li class="film item" onclick="clickedMovieBtn(${i})">
          ${movie.title}
        </li>
      `;
  }
  movieList.innerHTML = html;
}
getMovies();

function clickedMovieBtn(i) {
  let poster = document.getElementById("poster");
  let clickedMovie = allMovies[i];
  poster.src = clickedMovie.poster;
  poster.alt = clickedMovie.title;
  movieInfo(clickedMovie.id);
}

function movieInfo(id) {
  const title = document.getElementById("title");
  const runtime = document.getElementById("runtime");
  const info = document.getElementById("film-info");
  const showtime = document.getElementById("showtime");
  const ticket = document.getElementById("ticket-num");

  const requestoptions = {
    method: "GET"
  };

  fetch(`http://localhost:3000/films/${id}`, requestoptions)
    .then((response) => response.json())
    .then((result) => {
      //console.log(result);
      title.innerText = result.title;
      runtime.innerText = `${result.runtime} minutes`;
      info.innerText = result.description;
      showtime.innerText = result.showtime;
      ticket.innerText = `remaining tickets ${
        result.capacity - result.tickets_sold
      }`;
      console.log(result);
      currentMovie = result;
    })
    .catch((error) => console.error(error));
}

function makeASale(movie) {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    title: movie.title,
    runtime: movie.runtime,
    capacity: movie.capacity,
    showtime: movie.showtime,
    tickets_sold: movie.tickets_sold + 1,
    description: movie.description,
    poster: movie.poster,
  });

  //console.log("RAW," ,raw);

  //return;
  const requestOptions = {
    method: "PUT",
    headers: myHeaders,
    body: raw,
  };

  //return

  fetch(`http://localhost:3000/films/${movie.id}`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      //console.log(result)
      //allMovies = result;
      getMovies()
      movieInfo(movie.id)
    })
    .catch((error) => console.error(error));
}
