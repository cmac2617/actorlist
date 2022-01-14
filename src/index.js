import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// Primary variable declarations.
var allActors;  // All actors/actresses in the dataset.
var actorCount; // Length of the allActors array.
var movies; // All movies in the dataset.
var movieCount; // Length of the movies array.
var ncActorIds = []; // Actors/actresses who played in movies starring Nicolas Cage.
var krActorIds = []; // Actors/actresses who played in movies starring Keanu Reeves.
var actors = []; // Actors/actresses who played in movies starring bother Keanua Reeves and Nicolas Cage.
var numActors; // Used to cycle through the actors/actresses in each movie when determining if Keanu Reeves or Nicolas Cage was a co-actor.
var krId; // Actor ID of Keanu Reeves.
var ncId; // Actor ID of Nicolas Cage.
var tracker = 0; // A variable to assist in determining if I have checked all pre-determined co-actors against the one currently being checked.
var finalList = []; // The final array of co-actors of both Keana Reeves and Nicolas Cage, containing their ID's, names, and titles of movies for which they were co-actors.
var valResponse; // Variable to hold the validation response.

// First HTTP request to obtain list of actors/actresses and their id's. The "allActors" array and it's length will be populated from this data. 
var url1 = "https://switch-yam-equator.azurewebsites.net/api/actors";
var req1 = new XMLHttpRequest();

req1.open("GET", url1);
req1.setRequestHeader("x-chmura-cors", "56431e0c-4f48-4c27-8f33-09016e672a68");
req1.onreadystatechange = function () {
  if (req1.readyState === 4) {
    console.log(req1.status);
    allActors = JSON.parse(req1.responseText);
    actorCount = allActors.length;
  }
};
req1.send();

// Second HTTP request to obtain list of movies. The "movies" array, and it's length is populated with this data.
var url2 = "https://switch-yam-equator.azurewebsites.net/api/movies";
var req2 = new XMLHttpRequest();
req2.open("GET", url2);
req2.setRequestHeader("x-chmura-cors", "56431e0c-4f48-4c27-8f33-09016e672a68");
req2.onreadystatechange = function () {
  if (req2.readyState === 4) {
    console.log(req2.status);
    movies = JSON.parse(req2.responseText);
    movieCount = movies.length;
  }
};
req2.send();

// Here I define a function with a "for" loop (ids), to run through the array of "allActors" and pull the id's of Nicolas Cage and Keanu Reeves,
// and store those values in their appropriate variables, ncId and krId, respectively.
function ids() {
  for (let i = 0; i <= actorCount; i++) {
    for (let i = 0; i <= actorCount; i++) {
      if (allActors[i].name === "Nicolas Cage") {
        ncId = allActors[i].actorId;
      }
      else if (allActors[i].name === "Keanu Reeves") {
        krId = allActors[i].actorId;
      }
    }
  }
}

// Here I define a function with a "for" loop to run through the array of "movies", using an "if" condition to identify
// whether Keanu Reeves was an actor, and if so, push any co-actors who also played in the movie to the "krActorIds" array. 
// The second half of the function does the same thing, but from the perspective of Nicolas Cage, pushing co-actors to the "ncActorIds" array.
function gatheringIds() {

  // I first define an intial loop, to go through each individual movie and to determine how many actors/actresses are in the movie.
  for (let i = 0; i <= movieCount; i++) {
    numActors = movies[i].actors.length;

    // At this point I define a second loop, to check the indivial actors/actresses of the current movie
    // and determine if Keanu Reeves was one of the actors.
    for (let c = 0; c <= numActors; c++) {
      if (movies[i].actors[c] === krId) {

        // The third loop is entered if it is determined Keanu Reeves was an actor in the current movie. If he was, the third loop is used
        // to run through the entire list of actors/actresses in the current movie again, and determine if they need to be added to the krActorIds
        // array if they haven't been already. The tracker variable is set to "0" at the outset of this loop. This will ensure I keep checking
        // each actor/actress in the krActorIds array, as long as I don't find a match, in the fourth and final loop.
        for (let a = 0; a < numActors; a++) {
          tracker = 0;

          // I need to check the current actor/actress' ID, against any co-actor ID's I've already gathered, so this requires one more final 
          // (4th) loop. An If condition will determine whether I add the current ID to the "krActorIds" array, or continue to the next actor/actress.
          // Once again, this is where the tracker variable is used to make sure I keep checking each actor/actress in the current movie,
          // as long as I'm not finding a match, or the ID of Keanu Reeves, until I would check every actor/actress in krActorIds array.
          for (let check = 0; check <= krActorIds.length; check++) {
            if (movies[i].actors[a] === krActorIds[check] || movies[i].actors[a] === krId) {
              break
            }
            else if (tracker < krActorIds.length - 1) {
              tracker = tracker + 1;
              continue
            }
            else {
              krActorIds.push(movies[i].actors[a])
              break
            }
          }
        }
        break;
      }

      // Here I use the same logic to build an array of co-actors of Nicolas Cage (ncActorIds) with an "if" condition as before. I don't use an "else-if",
      // because that would leave the possibility of only adding co-actors and co-actresses to the krActorIds array for a movie that Keanu Reeves
      // and Nicolas Cage both played in. Later, when I cross reference both arrays (krActorIds & ncActorIds),
      // the actors/actresses from such movies could be excluded, if co-actors from such movies didn't appear in the krActorIds or ncActorIds arrays
      // from other movies. In summary, if an actor or actress played in a movie that starred both Nicolas Cage, and Keanu Reeves, I need their actor ID's
      // to show up in both the krActorIds array and ncActorIds array.
      if (movies[i].actors[c] === ncId) {
        tracker = 0;
        for (let a = 0; a < numActors; a++) {
          for (let check = 0; check <= ncActorIds.length; check++) {
            if (movies[i].actors[a] === ncActorIds[check] || movies[i].actors[a] === ncId) {
              break
            }
            else if (tracker < ncActorIds.length - 1) {
              tracker = tracker + 1;
              continue
            }
            else {
              ncActorIds.push(movies[i].actors[a])
              break
            }
          }
        }
        break;
      }
    }
  }

}

// The finalIds funcion will be used compare actor ID's from krActorIds and ncActorsIds. ID's which appear in both arrays
// will be populated into the "actors" array, and this will be the list of actors and actresses who played in movies with both
// Keanu Reeves and Nicolas Cage.
function finalIds() {

  // I use a For loop, nested within another For loop to compare each actor ID in the krActorIds array, 
  // with each actor ID in the ncActorIds array.
  for (let i = 0; i < krActorIds.length; i++) {
    for (let j = 0; j < ncActorIds.length; j++)
      if (krActorIds[i] === ncActorIds[j]) {
        actors.push(krActorIds[i])
        break
      }
  }
}

// Here, I use a For loop to check each actor ID in "actors" against the original allActors array, and populate a final array of objects
// (finalList), which contains the ID's and names of actors and actresses who played in movies starring both Keanu Reeves and Nicolas Cage.
// This will give me an array of objects that contains both the names and the ID's of the actors/actresses, instead of just their ID's.
function final() {
  for (let i = 0; i < actors.length; i++) {
    for (let j = 0; j < allActors.length; j++) {
      if (actors[i] === allActors[j].actorId) {
        finalList.push(allActors[j]);
        break
      }
    }
  }
}

// In order to have enough data to make a successful validation request, I need to also include, for each actor/actress in the finalList array,
// which movies they starred in featuring Nicolas Cage, and which movies they starred in featuring Keanu Reeves. I declare two arrays, KRMovies
// and NCMovies, that will be populated uniquely for each of the actors/actresses, and added to their appropriate object in the finalList array.
var KRMovies = [];
var NCMovies = [];

// This is the movieCheck function to determine the "Keana Reeves" movies, and "Nicolas Cage" movies for each actor/actress in finalList.
function movieCheck() {

  // The first loop is used to ensure we are only checking the movies, for the actors/actresses who made it into our finalList array.
  for (let m = 0; m < finalList.length; m++) {

    // The second loop is used to check every movie from our original "movies" array.
    for (let i = 0; i < movies.length; i++)

      // The third loop is used to check the current actor/actresses against all movies and determine if they were an actor/actress.
      for (let j = 0; j < movies[i].actors.length; j++) {
        if (finalList[m].actorId === movies[i].actors[j]) {

          // The fourth loop is used only if it is determined that the current actor/actress from finalList was determined to be in the
          // current movie. If they were, we then check for whether Keanu Reeves or Nicolas Cage was also an actor, and populate 
          // either the KRMovies, NCMovies, or both arrays if necessary.
          for (let c = 0; c < movies[i].actors.length; c++) {
            if (movies[i].actors[c] === krId) {
              KRMovies.push(movies[i].title);
            }
            if (movies[i].actors[c] === ncId) {
              NCMovies.push(movies[i].title)
            }

          }
        }
      }
    finalList[m].KRMovies = KRMovies;
    finalList[m].NCMovies = NCMovies;
    KRMovies = [];
    NCMovies = [];
  }
}

// The array of actors (finalList), and their movies, needs to be verified by sending a Post request and obtaining a 200 status code.
// I make a function that can be called with "setTimeout" to make the validation request, since it relies on data that was gathered
// from the previous HTTP requests.
function finalRequest() {
  console.log(finalList) // The array containing the data to make the validation request.
  var url3 = "https://switch-yam-equator.azurewebsites.net/api/validation";
  var req3 = new XMLHttpRequest();

  req3.open("POST", url3);
  req3.setRequestHeader("Content-Type", "application/json");
  req3.setRequestHeader("x-chmura-cors", "56431e0c-4f48-4c27-8f33-09016e672a68");
  req3.onreadystatechange = function () {
    if (req3.readyState === 4) {
      console.log(req3.status);
      valResponse = req3.status;
    }
  };

  var data; // Declaring a variable "data", which will be used to hold the JSON for the validation request. 
  data = JSON.stringify(finalList);
  console.log(data);
  req3.send(data);
}

// This is the order of function calls to run the code, using setTimeout functions because of the dependency on data with the HTTP requests.
setTimeout(ids, 500);
setTimeout(gatheringIds, 500);
setTimeout(finalIds, 500);
setTimeout(final, 500);
setTimeout(movieCheck, 500)
setTimeout(finalRequest, 500);

// This function (display) will be used to render and display the necessary information inside the "root" div of index.html document.
function display() {
  const element = (
    <div>
      <h1 className="center">Actors and Actresses who Played in Movies with Both Keanu Reeves and Nicolas Cage</h1>
      <h2 className="center">{finalList.map(element => <li>{element.name}</li>)}</h2>
      <p>Data is verified by making a Post request and receiving an HTTP 200 status response from the validation endpoint. Status: {valResponse}</p>
    </div>
  );
  ReactDOM.render(element, document.getElementById('root'));
}

// Lastly, I call the display function with setTimeout to ensure the dependent data (such as valResponse and finalList), has been gathered.
setTimeout(display, 1000);