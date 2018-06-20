// Class Book
class Book {
    constructor(title, author, id) {
        this.title = title;
        this.author = author;
        this.id = id;
    }
}

// Class UI
class UI {
    addBookToList(book) {
        // Get book list
        const list = document.querySelector('.book-list tbody');

        // Create markup
        const tr = `
        <tr>
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td class="ID">${book.id}</td>
            <td><div><i class="material-icons red-text right delete">clear</i></div></td>
        </tr>
        `;

        list.insertAdjacentHTML('afterbegin', tr);
    }

    showAlert(message, type) {
        // Create markup
        const alert = `
            <div class="alert card white-text ${type === 'error' ? 'red accent-2' : type === 'success' ? 'green lighten-2' : 'orange accent-2'}">
                <div class="card-content">
                    <p>${message}</p>
                </div>
             </div>
        `;

        // Get button
        const btn = document.querySelector('form button');

        // Disabled btn
        btn.disabled = true;

        // Insert alert
        btn.insertAdjacentHTML('afterend', alert);

        setTimeout(function () {
            document.querySelector('.alert').remove();
            btn.disabled = false;
        }, 1500);
    };
}

// Class Local Storage
class Store {
    getBooks() {
        let books;
        if (!localStorage.getItem('books')) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
    }

    addBook(book) {
        const books = this.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }

    deleteBook(bookId) {
        const books = this.getBooks();
        for (let i = 0; i < books.length; i++) {
            if (books[i].id.indexOf(bookId) >= 0) {
                books.splice([i], 1);
            }
        }
        localStorage.setItem('books', JSON.stringify(books));
    }
}

// Event DOMContentLoaded
document.addEventListener('DOMContentLoaded', function (e) {
    // Get Store
    const store = new Store();
    // Get UI
    const ui = new UI();
    const books = store.getBooks();

    books.forEach(book => ui.addBookToList(book));
});

// Event Submit
document.forms['addBookForm'].addEventListener('submit', function (e) {
    e.preventDefault();

    // Get form values
    const title = this.elements['book_title'].value,
          author = this.elements['book_author'].value,
          id = this.elements['book_id'].value;

    // Create book
    const book = new Book(title, author, id);
    // Get UI
    const ui = new UI();
    // Get store
    const store = new Store();

    // Validate
    if (!title || !author || !id) {
        //Show error
        ui.showAlert('Please fill in all fields', 'error');
    } else {
        // Add book to ui
        ui.addBookToList(book);
        // Add book to localstorage
        store.addBook(book);
        //Show success
        ui.showAlert('Book added!', 'success');
    }

    // Clear form
    this.elements['book_title'].value = '';
    this.elements['book_author'].value = '';
    this.elements['book_id'].value = '';


});

// Event delete
document.querySelector('tbody').addEventListener('click', function (e) {
    // Create UI
    const ui = new UI();
    // Get Store
    const store = new Store();

    // Delete parent
    if (e.target.classList.contains('delete')) {
        const tr = e.target.closest('tr');
        store.deleteBook(tr.cells[2].innerText);
        tr.remove();

        //Show message
        ui.showAlert('Book deleted', 'deleted');
    }
});