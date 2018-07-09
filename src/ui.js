import { conf } from "./config";

class UI {
  constructor() {
    this.posts = document.querySelector(conf.ui.selectors.posts);
    this.titleInput = document.querySelector(conf.ui.selectors.titleInput);
    this.bodyInput = document.querySelector(conf.ui.selectors.bodyInput);
    this.idInput = document.querySelector(conf.ui.selectors.idInput);
    this.postSubmit = document.querySelector(conf.ui.selectors.postSubmit);
    this.formEnd = document.querySelector(conf.ui.selectors.formEnd);
    this.formState = 'add';
  }

  showPosts(posts) {
    let output = '';

    posts.forEach(post => {
      output += `
        <div class="card mb-3">
          <div class="card-body">
            <h4 class="card-title">${post.title}</h4>
            <p class="card-text">${post.body}</p>
            <a href="#" class="edit card-link" data-id=${post.id}><i class="fa fa-pencil"></i></a>
            <a href="#" class="delete card-link" data-id=${post.id}><i class="fa fa-remove"></i></a>
          </div>
        </div>
      `;

      this.posts.innerHTML = output;
    });
  }

  showAlert(msg, classNames) {
    // Clear existing alert
    if (document.querySelector('.alert')) {
      document.querySelector('.alert').remove();
    }

    const alert = document.createElement('p');
    alert.className = classNames;
    alert.textContent = msg;

    document.querySelector('.posts-container').insertAdjacentElement('afterbegin', alert);

    this.clearAlert = setTimeout(() => alert.remove(), 3000);
  }

  clearFields() {
    this.titleInput.value = '';
    this.bodyInput.value = '';
    this.idInput.value = '';
    this.titleInput.focus();
  }

  showEditState(target) {
    // Set formState to edit
    this.formState = 'edit';

    // Highlight current post card
    if (document.querySelector('.edit-card')) {
      document.querySelector('.edit-card').classList.remove('edit-card');
    }

    target.parentElement.parentElement.classList.add('edit-card');
    // Set idField to current post id
    this.idInput.value = target.dataset.id;
    // Change post button text & color
    this.postSubmit.classList.remove('btn-primary');
    this.postSubmit.classList.add('btn-info');
    this.postSubmit.textContent = 'Edit it!';

    // Get title + body texts and set to form fields' values
    this.titleInput.value = target.parentElement.querySelector('.card-title').textContent;
    this.bodyInput.value = target.parentElement.querySelector('.card-text').textContent;

    // Add cancel button if not exist
    if (!document.querySelector('.post-cancel')) {
      const cancel = document.createElement('button');
      cancel.className = 'post-cancel btn btn-secondary btn-block';
      cancel.textContent = 'Cancel edit';

      // Insert before end of form
      document.querySelector('.card-form').insertBefore(cancel, this.formEnd);
  
      // Add event handler to cancel button
      cancel.addEventListener('click', () => this.showAddState());
    }

    // Focus titleInput
    this.titleInput.focus();
  }

  showAddState() {
    if (document.querySelector('.edit-card')) {
      document.querySelector('.edit-card').classList.remove('edit-card');
    }

    if (document.querySelector('.post-cancel')) {
      document.querySelector('.post-cancel').remove();
    }

    if (this.postSubmit.classList.contains('btn-info')) {
      this.postSubmit.classList.remove('btn-info');
      this.postSubmit.classList.add('btn-primary');
    }

    // Clear form fields + focus
    this.clearFields();
    this.postSubmit.textContent = 'Post it!';
    this.formState = 'add';
  }
}

export const ui = new UI();