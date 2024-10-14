let books = [];
let currentPage = 1;
const bookPerPage = 6;

document.addEventListener("DOMContentLoaded", function () {
  const currentPath = window.location.pathname;
  const homeLink = document.getElementById("homeLink");
  const wishList = document.getElementById("wishList");
  if (currentPath === "/wishlist.html") {
    wishList.classList.add("active");
  }
  if (currentPath === "/index.html") {
    homeLink.classList.add("active");
  }
});

const filterBooks = () => {
  const subjectValue = document
    .getElementById("subject-filter")
    .value.toLowerCase();
  const bookShelfValue = document
    .getElementById("bookshelf-filter")
    .value.toLowerCase();

  const filterProduct = books.filter((book) => {
    const subjectMatch = book.subjects.some((subject) =>
      subject.toLowerCase().includes(subjectValue)
    );
    const bookShelfMatch = book.bookshelves.some((bookShelf) =>
      bookShelf.toLowerCase().includes(bookShelfValue)
    );
    return subjectMatch || bookShelfMatch;
  });
  currentPage = 1;
  ShowBooks(filterProduct);
};

const allProductFetch = async () => {
  try {
    const resp = await fetch(`https://gutendex.com/books/`);
    const data = await resp.json();
    books = data?.results;
    ShowBooks(data?.results);
  } catch (error) {
    console.log(error);
  }
};

const ShowBooks = (book) => {
  const bookParent = document.getElementById("productParent");
  bookParent.innerHTML = "";

  const startIndex = (currentPage - 1) * bookPerPage;
  const endIndex = startIndex + bookPerPage;
  const paginatedBooks = book.slice(startIndex, endIndex);

  bookParent.className = "grid grid-cols-1 md:grid-cols-3 gap-6 ";
  paginatedBooks.forEach((item) => {
    const bookItem = document.createElement("div");
    bookItem.className = "";
    bookItem.innerHTML = `<div class="rounded-md shadow-md dark:bg-gray-50 dark:text-gray-800">
    <img src="${item.formats["image/jpeg"]}" alt="" class="object-cover object-center w-full rounded-t-md md:h-72 dark:bg-gray-500">
    <div class="flex flex-col justify-between p-6 space-y-8">
      <div class="space-y-2">
      <span>Product Id : ${item.id}</span>
      <p class="dark:text-gray-800">${item?.authors[0]?.name}</p>
        <h2 class="text-xl font-semibold tracking-wide">${item.title}</h2>
        <h2>${item.subjects[2]}</h2>
        <h2>${item.bookshelves[2]}</h2>
      </div>
      <button type="button" class="flex items-center justify-center md:w-full p-3 font-semibold tracking-wide rounded-md dark:bg-violet-600 dark:text-gray-50">Show Details</button>
    </div>
  </div>`;
    bookParent.appendChild(bookItem);
  });
  ProductPagination(book?.length);
};

const ProductPagination = (totalBooks) => {
  const paginationParent = document.querySelector(".paginationParent");
  paginationParent.innerHTML = "";
  const totalPages = Math.ceil(totalBooks / bookPerPage);
  for (let i = 1; i <= totalPages; i++) {
    const button = document.createElement("button");
    button.innerText = i;
    button.className = `pagination-button bg-[#162649] px-4 py-2 rounded-md ${
      i === currentPage ? "active" : "text-white"
    }`;
    button.onclick = () => {
      currentPage = i;
      ShowBooks(books);
    };
    paginationParent.appendChild(button);
  }
};

window.onload = allProductFetch;
