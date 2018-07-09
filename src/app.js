import { http } from './easyhttp';
import { conf } from './config';
import { ui } from './ui';

// Get posts on DOM load
document.addEventListener('DOMContentLoaded', getPosts);

// Listen for add posts
ui.postSubmit.addEventListener('click', submitPost);

// Listen for click on edit button
ui.posts.addEventListener('click', showEditState);

// Listen for click on delete button
ui.posts.addEventListener('click', deletePost);

// Get posts and show on page
function getPosts() {
  http.get(`${conf.apiURL}/posts`)
    .then(posts => ui.showPosts(posts))
    .catch(error => console.log(error));
}

// Submit post
function submitPost() {
  if (ui.titleInput.value !== '' && ui.bodyInput.value !== '') {
    // Get form input as data
    const data = {
      title: ui.titleInput.value,
      body: ui.bodyInput.value
    }

    let method = '';
    let url = `${conf.apiURL}/posts/`;
    let postStatus = '';

    if (ui.formState === 'add') {
      // POST new post
      method = 'post';
      postStatus = 'published';
    } else if (ui.formState === 'edit') {
      // PUT edit post
      method = 'put';
      data.id = parseInt(ui.idInput.value);
      url += data.id;
      postStatus = 'edited';
    } else {
      ui.showAlert('Something went wrong.', 'alert, alert-danger');
      clearTimeout(ui.clearAlert);
    }

    // Submit POST request
    http[method](url, data)
      .then(response => {
        ui.showAlert(`Post ${postStatus}.`, 'alert alert-success');
        ui.showAddState();
        getPosts();
      })
      .catch(error => console.log(error));
  } else {
    ui.showAlert('Both form fields must be filled out', 'alert alert-danger');
  }
}

// Clear add state + show edit state
function showEditState(e) {
  if (e.target.parentElement.classList.contains('edit')) {
    e.preventDefault();
    const editLink = e.target.parentElement;
    ui.showEditState(editLink);
  }
}

function deletePost(e) {
  if (e.target.parentElement.classList.contains('delete')) {
    e.preventDefault();

    if (confirm('Are you sure you want to delete this?')) {
      http.delete(`${conf.apiURL}/posts/${e.target.parentElement.dataset.id}`)
        .then(response => getPosts())
        .catch(error => console.log(error));
    }
  }
}
