let books = [];

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

// filter book code

const filterBooks = () => {
  const subjectValue = document.getElementById("subject-filter").value;
  const bookShelfValue = document.getElementById("bookshelf-filter").value;
};

const allProductFetch = async () => {
  try {
    const resp = await fetch(`https://gutendex.com/books/`);
    const data = await resp.json();
    books = data?.results;
    // console.log(data?.results);
    ShowBooks(data?.results);
  } catch (error) {
    console.log(error);
  }
};

const ShowBooks = (book) => {
  const bookParent = document.getElementById("productParent");
  bookParent.innerHTML = "";
  bookParent.className = "grid grid-cols-1 md:grid-cols-3 gap-6 ";
  book.forEach((item) => {
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
};

window.onload = allProductFetch;
