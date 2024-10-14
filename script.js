document.addEventListener("DOMContentLoaded", function () {
  const currentPath = window.location.pathname;
  const homeLink = document.getElementById("homeLink");
  const wishList = document.getElementById("wishList");
  if (currentPath === "/wishlist.html") {
    wishList.classList.add("active");
  }
  if (currentPath === "/") {
    homeLink.classList.add("active");
  }
});
