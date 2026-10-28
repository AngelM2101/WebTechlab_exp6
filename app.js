
let books = JSON.parse(localStorage.getItem("books")) || [];
let currentFilter = "all";

const form = document.getElementById("bookForm");
const titleInput = document.getElementById("bookTitle");
const authorInput = document.getElementById("bookAuthor");
const priceInput = document.getElementById("bookPrice");
const list = document.getElementById("bookList");
const counter = document.getElementById("counter");

// 1. Create a new book
function createBook(title, author, price) {
    return {
        id: Date.now() + Math.random(),
        title: title,
        author: author,
        price: Number(price),
        sold: false
    };
}

// 2. Add a book
function addBook(title, author, price) {
    books.push(createBook(title, author, price));
    saveAndRender();
}

// 3. Mark a book as sold or available
function toggleBook(id) {
    books = books.map(book =>
        book.id === id
            ? { ...book, sold: !book.sold }
            : book
    );

    saveAndRender();
}

// 4. Delete a book
function deleteBook(id) {
    books = books.filter(book => book.id !== id);
    saveAndRender();
}

// 5. Filter the books
function getVisible() {
    if (currentFilter === "available") {
        return books.filter(book => !book.sold);
    }

    if (currentFilter === "sold") {
        return books.filter(book => book.sold);
    }

    return books;
}

// 6. Count available books
function countAvailable() {
    return books.filter(book => !book.sold).length;
}

// 7. Create one book card
function bookItem(book) {
    const item = document.createElement("li");
    item.className = "book-card";

    if (book.sold) {
        item.classList.add("sold");
    }

    const details = document.createElement("div");

    const title = document.createElement("h3");
    title.textContent = book.title;

    const author = document.createElement("p");
    author.textContent = "Author: " + book.author;

    const price = document.createElement("p");
    price.textContent = "Price: ₹" + book.price;

    const status = document.createElement("p");
    status.textContent = book.sold ? "Status: Sold" : "Status: Available";

    details.append(title, author, price, status);

    const actions = document.createElement("div");

    const toggleButton = document.createElement("button");
    toggleButton.textContent = book.sold ? "Mark Available" : "Mark Sold";
    toggleButton.addEventListener("click", () => toggleBook(book.id));

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.className = "delete-btn";
    deleteButton.addEventListener("click", () => deleteBook(book.id));

    actions.append(toggleButton, deleteButton);
    item.append(details, actions);

    return item;
}

// 8. Display the books
function renderBooks() {
    list.innerHTML = "";

    getVisible().forEach(book => {
        list.appendChild(bookItem(book));
    });

    counter.textContent =
        books.length + " total books | " +
        countAvailable() + " available";
}

// 9. Save data and refresh the screen
function saveAndRender() {
    localStorage.setItem("books", JSON.stringify(books));
    renderBooks();
}

// 10. Handle form submission
function handleSubmit(event) {
    event.preventDefault();

    const title = titleInput.value.trim();
    const author = authorInput.value.trim();
    const price = Number(priceInput.value);

    if (title !== "" && author !== "" && price > 0) {
        addBook(title, author, price);
        form.reset();
        titleInput.focus();
    }
}

form.addEventListener("submit", handleSubmit);

// 11. Handle filters
document.querySelectorAll("[data-filter]").forEach(button => {
    button.addEventListener("click", () => {
        currentFilter = button.dataset.filter;
        renderBooks();
    });
});

// Display saved books when the page opens
renderBooks();
