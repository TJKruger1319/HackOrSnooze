"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navBrand.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

function navSubmitClick() {
console.debug("navSubmitClick");
hidePageComponents();
$submitForm.show();
}

$navSubmit.on("click", navSubmitClick);

function navFavoritesClick() {
  console.debug("navFavoritesClick");
  hidePageComponents();
  $favStoriesList.empty();
  for (let favs of currentUser.favorites) {
    const $fav = generateStoryMarkup(favs);
    $favStoriesList.append($fav);
  }
  $favStoriesList.show();
}

$navFavorites.on("click", navFavoritesClick);

function navMyStoriesClick() {
  console.debug("navMyStoriesClick");
  hidePageComponents();
  $myStoriesList.empty();
  for (let story of currentUser.ownStories) {
    const $story = generateStoryMarkup(story);
    $myStoriesList.append($story);
  }
  $myStoriesList.show();
}

$navMyStories.on("click", navMyStoriesClick);
