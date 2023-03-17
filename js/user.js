"use strict";

// global to hold the User instance of the currently-logged-in user
let currentUser;

/******************************************************************************
 * User login/signup/login
 */

/** Handle login form submission. If login ok, sets up the user instance */

async function login(evt) {
  console.debug("login", evt);
  evt.preventDefault();

  // grab the username and password
  const username = $("#login-username").val();
  const password = $("#login-password").val();

  // User.login retrieves user info from API and returns User instance
  // which we'll make the globally-available, logged-in user.
  currentUser = await User.login(username, password);

  $loginForm.trigger("reset");

  saveUserCredentialsInLocalStorage();
  updateUIOnUserLogin();
}

$loginForm.on("submit", login);

/** Handle signup form submission. */

async function signup(evt) {
  console.debug("signup", evt);
  evt.preventDefault();

  const name = $("#signup-name").val();
  const username = $("#signup-username").val();
  const password = $("#signup-password").val();

  // User.signup retrieves user info from API and returns User instance
  // which we'll make the globally-available, logged-in user.
  currentUser = await User.signup(username, password, name);

  saveUserCredentialsInLocalStorage();
  updateUIOnUserLogin();

  $signupForm.trigger("reset");
}

$signupForm.on("submit", signup);

/** Handle click of logout button
 *
 * Remove their credentials from localStorage and refresh page
 */

function logout(evt) {
  console.debug("logout", evt);
  localStorage.clear();
  location.reload();
}

$navLogOut.on("click", logout);

/******************************************************************************
 * Storing/recalling previously-logged-in-user with localStorage
 */

/** If there are user credentials in local storage, use those to log in
 * that user. This is meant to be called on page load, just once.
 */

async function checkForRememberedUser() {
  console.debug("checkForRememberedUser");
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  if (!token || !username) return false;

  // try to log in with these credentials (will be null if login failed)
  currentUser = await User.loginViaStoredCredentials(token, username);
}

/** Sync current user information to localStorage.
 *
 * We store the username/token in localStorage so when the page is refreshed
 * (or the user revisits the site later), they will still be logged in.
 */

function saveUserCredentialsInLocalStorage() {
  console.debug("saveUserCredentialsInLocalStorage");
  if (currentUser) {
    localStorage.setItem("token", currentUser.loginToken);
    localStorage.setItem("username", currentUser.username);
  }
}

/******************************************************************************
 * General UI stuff about users
 */

/** When a user signs up or registers, we want to set up the UI for them:
 *
 * - show the stories list
 * - update nav bar options for logged-in user
 * - generate the user profile part of the page
 */

function updateUIOnUserLogin() {
  console.debug("updateUIOnUserLogin");

  $allStoriesList.show();

  updateNavOnLogin();
}

async function addFavoriteToUser(star) {
  console.debug("addFavoriteToUser");
  //Change the star
  $(star).removeClass("far").addClass("fas");

  //Declaration
  const $li = $(star).closest("li");
  const userFavs = currentUser.favorites;
  const story = $li.data();
  const storyId = story.storyId;
  const token = currentUser.loginToken;
  const username = currentUser.username;

  //Send the favorite to the API
  const response = await axios.post(`${BASE_URL}/users/${username}/favorites/${storyId}`, {
    token: token
  })


  //Added to user's favorites
  $li.attr("favorite", true);
  userFavs.push(story);
}

async function removeFavoriteFromUser(star) {
  console.debug("removeFavoriteFromUser");

  //Change the star
  $(star).removeClass("fas").addClass("far");
  
  //Declaration
  const $li = $(star).closest("li");
  const story = $li.data();
  const userFavs = currentUser.favorites;
  const storyId = story.storyId;
  const token = currentUser.loginToken;
  const username = currentUser.username;

  //Delete favorite from API
  const response = await axios.delete(`${BASE_URL}/users/${username}/favorites/${storyId}`, {
    data: {
      token: token
    }
  });

  //Remove story from user's favorites
  $li.attr("favorite", false);
  const index = userFavs.indexOf(story);
  if (index >= -1) {
    userFavs.splice(index, 1);
  }
}

$("ol").on("click", "#star", function(e){
  const $li = $(this).closest("li");
  if ($li.attr("favorite") === "false") {
    addFavoriteToUser(this);
  } else if ($li.attr("favorite") === "true") {
    removeFavoriteFromUser(this);
  }
});

async function removeUserStory(myStory) {
  console.debug("removeUserStory");
  
  //Declaration
  const $li = $(myStory).closest("li");
  const story = $li.data();
  const storyId = story.storyId;
  const token = currentUser.loginToken;

  //Delete story from API
  const response = await axios.delete(`${BASE_URL}/stories/${storyId}`, {
    data: {
      token: token
    }
  });
  console.log(response);

  //Remove story in the HTML
  $li.remove();
}

$("ol").on("click", "li button", function(e){
  removeUserStory(this);
});