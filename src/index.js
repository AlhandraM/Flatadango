// Initialize variables
let allMovies = []; // Array to store all movies
let currentMovie = null; // Variable to store the currently selected movie

// Event listener for "Buy Ticket" button
document.getElementById("buy-ticket").addEventListener("click", function (e) {
  e.preventDefault(); // Prevent default form submission behavior

  let result = currentMovie; // Get the currently selected movie
  let remainingTickets = result.capacity - result.tickets_sold; // Calculate remaining tickets
  const ticket = document.getElementById("ticket-num"); // Get the ticket element

  // Check if there are remaining tickets for the selected movie
  if (remainingTickets > 0) {
    makeASale(result); // If tickets are available, proceed with the sale
  } else {
    ticket.innerText = " !!! Sold OUT"; // If no tickets are available, display "Sold Out" message
  }
});

// Function to fetch movies from the server
function getMovies() {
  const requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  fetch("http://localhost:3000/films", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      allMovies = result; // Store the fetched movies in the allMovies array
      ListMovies(result); // Call the ListMovies function to display the movies
    })
    .catch((error) => console.error(error));
}

// Function to display the list of movies
function ListMovies(movies) {
  const movieList = document.getElementById("films");
  movieList.innerHTML = ""; // Clear the movie list
  let html = "";

  for (let i = 0; i < movies.length; i++) {
    let movie = movies[i];

    // Create list items for each movie and attach a click event
    html +=
      `
        <li class="film item" onclick="clickedMovieBtn(${i})">
          ${movie.title}
        </li>
      `;
  }
  movieList.innerHTML = html; // Add the movie list to the HTML
}

// Function to handle the click event on a movie
function clickedMovieBtn(i) {
  let poster = document.getElementById("poster");
  let clickedMovie = allMovies[i];
  poster.src = clickedMovie.poster; // Display the poster of the clicked movie
  poster.alt = clickedMovie.title;
  movieInfo(clickedMovie.id); // Fetch additional information about the clicked movie
}

// Function to fetch detailed information about a movie
function movieInfo(id) {
  // Get elements for displaying movie information
  const title = document.getElementById("title");
  const runtime = document.getElementById("runtime");
  const info = document.getElementById("film-info");
  const showtime = document.getElementById("showtime");
  const ticket = document.getElementById("ticket-num");

  const requestoptions = {
    method: "GET"
  };

  // Fetch movie details based on the provided ID
  fetch(`http://localhost:3000/films/${id}`, requestoptions)
    .then((response) => response.json())
    .then((result) => {
      title.innerText = result.title; // Display movie title
      runtime.innerText = `${result.runtime} minutes`; // Display movie runtime
      info.innerText = result.description; // Display movie description
      showtime.innerText = result.showtime; // Display movie showtime
      ticket.innerText = `remaining tickets ${result.capacity - result.tickets_sold}`; // Display remaining tickets
      currentMovie = result; // Store the fetched movie as the current movie
    })
    .catch((error) => console.error(error));
}

// Function to simulate a ticket sale and update movie details
function makeASale(movie) {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  // Prepare updated movie details with an additional ticket sold
  const raw = JSON.stringify({
    title: movie.title,
    runtime: movie.runtime,
    capacity: movie.capacity,
    showtime: movie.showtime,
    tickets_sold: movie.tickets_sold + 1,
    description: movie.description,
    poster: movie.poster,
  });

  const requestOptions = {
    method: "PUT",
    headers: myHeaders,
    body: raw,
  };

  // Update the movie details on the server
  fetch(`http://localhost:3000/films/${movie.id}`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      getMovies(); // Refresh the movie list after the sale
      movieInfo(movie.id); // Update the displayed movie information
    })
    .catch((error) => console.error(error));
}

// Initial fetch of movies when the page loads
getMovies();

