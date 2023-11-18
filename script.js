document.addEventListener("DOMContentLoaded", () => {
  const toBeReadList = document.getElementById("toBeList");
  const completedList = document.getElementById("completedList");
  const addBookModal = document.getElementById("modalForm");
  const addBookForm = document.getElementById("addBookForm");
  const totalBook = document.getElementById("totalBook");
  const totalToRead = document.getElementById("totalToRead");
  const totalCompleted = document.getElementById("totalCompleted");

  const addBookButton = document.getElementById("addBook");
  addBookButton.addEventListener("click", () => {
    addBookModal.classList.toggle("is-active");
  });

  const cancelBookSubmitButton = document.getElementById("cancelSubmit");
  cancelBookSubmitButton.addEventListener("click", (event) => {
    event.preventDefault();
    addBookModal.classList.toggle("is-active");
  });

  let books = [];

  addBookForm.addEventListener("submit", (event) => {
    event.preventDefault();
    addBook();
    addBookModal.classList.toggle("is-active");
  });

  loadBooks();

  function addBook() {
    const bookTitle = document.getElementById("bookTitle").value;
    const bookAuthor = document.getElementById("bookAuthor").value;
    const bookYear = parseInt(document.getElementById("bookYear").value);
    const isCompleted = document.getElementById("isCompleted").checked;

    const book = {
      id: Date.now(),
      title: bookTitle,
      author: bookAuthor,
      year: bookYear,
      isComplete: isCompleted,
    };

    books.push(book);
    saveBooks();
    loadBooks();
  }

  function saveBooks() {
    localStorage.setItem("books", JSON.stringify(books));
  }

  function loadBooks() {
    const savedBooks = JSON.parse(localStorage.getItem("books"));
    books = savedBooks ? savedBooks : [];

    renderBooks();
  }

  function renderBooks() {
    toBeReadList.innerHTML = "";
    completedList.innerHTML = "";

    let toBeReadCount = 0;
    let completedCount = 0;

    for (const book of books) {
      const bookElement = createBookElement(book);

      if (book.isComplete) {
        completedList.appendChild(bookElement);
        completedCount++;
      } else {
        toBeReadList.appendChild(bookElement);
        toBeReadCount++;
      }
    }

    totalBook.textContent = books.length;
    totalToRead.textContent = toBeReadCount;
    totalCompleted.textContent = completedCount;
  }

  function createBookElement(book) {
    const article = document.createElement("article");
    article.classList.add("tile", "is-child", "has-background-white", "box");
    article.dataset.bookId = book.id;

    const titleElement = document.createElement("p");
    titleElement.classList.add("is-size-4", "has-text-weight-bold");
    titleElement.textContent = book.title;
    article.appendChild(titleElement);

    const authorElement = document.createElement("p");
    authorElement.classList.add("is-size-6", "py-1");
    authorElement.textContent = book.author;
    article.appendChild(authorElement);

    const levelElement = document.createElement("div");
    levelElement.classList.add("level", "is-mobile");
    article.appendChild(levelElement);

    const levelLeftElement = document.createElement("div");
    levelLeftElement.classList.add("level-left");
    levelElement.appendChild(levelLeftElement);

    const yearElement = document.createElement("span");
    yearElement.classList.add("level-item", "tag", "is-link");
    yearElement.textContent = book.year;
    levelLeftElement.appendChild(yearElement);

    const levelRightElement = document.createElement("div");
    levelRightElement.classList.add("level-right");
    levelElement.appendChild(levelRightElement);

    if (book.isComplete) {
      const undoButton = document.createElement("button");
      undoButton.classList.add(
        "button",
        "level-item",
        "is-small",
        "is-warning",
        "is-light"
      );
      undoButton.textContent = "Undo";
      undoButton.addEventListener("click", () => {
        undoBookFromCompletedList(book.id);
      });
      levelRightElement.appendChild(undoButton);

      const deleteButton = document.createElement("button");
      deleteButton.classList.add(
        "button",
        "level-item",
        "is-small",
        "is-danger",
        "is-light"
      );
      deleteButton.textContent = "Delete";
      deleteButton.addEventListener("click", () => {
        deleteBookFromCompleted(book.id);
      });
      levelRightElement.appendChild(deleteButton);
    } else {
      const completeButton = document.createElement("button");
      completeButton.classList.add(
        "button",
        "level-item",
        "is-small",
        "is-success",
        "is-light"
      );
      completeButton.textContent = "Complete";
      completeButton.addEventListener("click", () => {
        addBookToCompletedList(book);
      });
      levelRightElement.appendChild(completeButton);

      const deleteButton = document.createElement("button");
      deleteButton.classList.add(
        "button",
        "level-item",
        "is-small",
        "is-danger",
        "is-light"
      );
      deleteButton.textContent = "Delete";
      deleteButton.addEventListener("click", () => {
        deleteBookFromCompleted(book.id);
      });
      levelRightElement.appendChild(deleteButton);
    }

    function undoBookFromCompletedList(bookId) {
      const bookToUndo = books.find((book) => book.id === bookId);
      bookToUndo.isComplete = !bookToUndo.isComplete;
      saveBooks();
      loadBooks();
    }

    function deleteBookFromCompleted(bookId) {
      const confirmDelete = confirm("Are you sure want to delete the book?");
      if (confirmDelete) {
        books = books.filter((book) => book.id !== bookId);
        saveBooks();
        loadBooks();
      }
    }

    function addBookToCompletedList(book) {
      book.isComplete = true;
      saveBooks();
      loadBooks();
    }

    return article;
  }
});
