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

const searchProduct = () => {
  const search = document.getElementById("search").value.toLowerCase();
  const searchProductFilter = books.filter((book) => {
    return book.title.toLowerCase().includes(search);
  });
  ShowBooks(searchProductFilter);
};

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

const addWishList = (prd) => {
  const existWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  existWishlist.push(prd);
  localStorage.setItem("wishlist", JSON.stringify(existWishlist));
  alert("Wishlist Add Success");
};

const showWishList = async () => {
  try {
    const wishList = JSON.parse(localStorage.getItem("wishlist"));
    if (wishList.length === 0) {
      console.log("no items in the wishlist");
      return;
    }
    wishList.forEach((wish) => {
      const tableTr = document.getElementById("tableTr");
      tableTr.innerHTML = "";

      const tr = document.createElement("tr");
      tr.className =
        "border-b border-opacity-20 dark:border-gray-300 dark:bg-gray-50";

      tr.innerHTML = ` <td class="p-3">
      <img src="${wish?.formats["image/jpeg"]}" class="w-[50px]"/>
    </td>
    <td class="p-3 text-base">
      <p>${wish.title}}</p>
    </td>
    <td class="p-3 text-base">
      <p>${wish?.authors[0].name}</p>
    </td>
    <td class="p-3 text-base">
      <p>${wish?.id}</p>
    </td>

    <td class="p-3 text-right text-base">
      <span
        class="px-3 py-2 font-semibold rounded-md bg-red-500 dark:text-gray-50"
      >
        <button class="remove-wishlist" dataId="${wish.id}">Delete</button>
      </span>
    </td>`;

      tableTr.appendChild(tr);
    });
    document.querySelectorAll(".remove-wishlist").forEach((button) => {
      button.addEventListener("click", (event) => {
        removeWishList(event.target.getAttribute("dataId"));
      });
    });
  } catch (error) {
    console.log(error);
  }
};

const removeWishList = (id) => {
  let wishList = JSON.parse(localStorage.getItem("wishlist")) || [];
  wishList = wishList.filter((item) => item.id !== parseInt(id));
  localStorage.setItem("wishlist", JSON.stringify(wishList));
  showWishList();
};
removeWishList();
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
      <div class="flex justify-between items-center">
      <span>Product Id : ${item.id}</span>
      <button class="add-to-wishlist flex gap-2 items-center"><img src="/heart.png" class="w-[18px]"/> Wishlist</button>
      </div>
      <p class="dark:text-gray-800">${item?.authors[0]?.name}</p>
        <h2 class="text-xl font-semibold tracking-wide">${item.title}</h2>
        <h2>${item.subjects[2]}</h2>
        <h2>${item.bookshelves[2]}</h2>
      </div>
      <button type="button" class="flex items-center justify-center md:w-full p-3 font-semibold tracking-wide rounded-md dark:bg-violet-600 dark:text-gray-50">Show Details</button>
    </div>
  </div>`;
    bookParent.appendChild(bookItem);
    bookItem.querySelector(".add-to-wishlist").addEventListener("click", () => {
      addWishList(item);
    });
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
showWishList();
window.onload = allProductFetch;
