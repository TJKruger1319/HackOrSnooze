"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  //console.debug("generateStoryMarkup", story);
  const storyObj = new Story(story);
  const hostName = storyObj.getHostName(story.url);
  return $(`
      <li id="${story.storyId}">
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
    let userFavs;
    let ownStories;
    let $star = '<i class="far fa-star" id="star" aria-hidden="true"></i>';
    let favBool = false;
  if(currentUser) {
    userFavs = currentUser.favorites;
    ownStories = currentUser.ownStories;
  }
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    if (currentUser) {
      for (let fav of userFavs) {
        if(fav.storyId === story.storyId) {
          favBool = true;
          $star = '<i class="fas fa-star" id="star" aria-hidden="true"></i>';
          break;
        } else {
          favBool = false;
          $star = '<i class="far fa-star" id="star" aria-hidden="true"></i>';
        }
      }
      for (let own of ownStories) {
        if(own.storyId === story.storyId) {
          const $deleteBtn = document.createElement("button");
          const $minus = "<i class='fas fa-minus-circle'></i>";
          $($deleteBtn).append($minus).addClass("deleteBtn");
          const $storyAuthor = $story.children("small.story-author");
          $storyAuthor.append($deleteBtn);
        }
      }
    $story.prepend($star).attr("favorite", favBool).data(story);
    }
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

async function submitStory(evt) {
  console.debug("submitStory", evt);
  evt.preventDefault();

  // grab the title, author, and url
  const title = $("#submit-title").val();
  const author = $("#submit-author").val();
  const url = $("#submit-url").val();
  
  await storyList.addStory(currentUser,
    {title, author, url});

  $submitForm.trigger("reset");

}

$submitForm.on("submit", submitStory);

