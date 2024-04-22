("use strict");

const search = document.querySelector(".input-group input"),
  table_rows = document.querySelectorAll("tbody tr");
table_headings = document.querySelectorAll("thead th");

/**
 * NAVBAR TOGGLE FOR MOBILE
 */

const navbar = document.querySelector("[data-navbar]");
const navToggler = document.querySelector("[data-nav-toggler]");

navToggler.addEventListener("click", function () {
  navbar.classList.toggle("active");
  this.classList.toggle("active");
});

/**
 * HEADER & BACK TOP BTN
 * header and back top btn visible when window scroll down to 200px
 */

const header = document.querySelector("[data-header]");
const backTopBtn = document.querySelector("[data-back-top-btn]");

const activeElementOnScroll = function () {
  if (window.scrollY > 200) {
    header.classList.add("active");
    backTopBtn.classList.add("active");
  } else {
    header.classList.remove("active");
    backTopBtn.classList.remove("active");
  }
};

window.addEventListener("scroll", activeElementOnScroll);

/**
 * SLIDER
 */

const sliders = document.querySelectorAll("[data-slider]");

const sliderInit = function (currentSlider) {
  const sliderContainer = currentSlider.querySelector(
    "[data-slider-container]"
  );
  const sliderPrevBtn = currentSlider.querySelector("[data-slider-prev]");
  const sliderNextBtn = currentSlider.querySelector("[data-slider-next]");

  const totalSliderVisibleItems = Number(
    getComputedStyle(currentSlider).getPropertyValue("--slider-item")
  );
  const totalSliderItems =
    sliderContainer.childElementCount - totalSliderVisibleItems;

  let currentSlidePos = 0;

  const moveSliderItem = function () {
    sliderContainer.style.transform = `translateX(-${sliderContainer.children[currentSlidePos].offsetLeft}px)`;
  };

  /**
   * NEXT SLIDE
   */
  const slideNext = function () {
    const slideEnd = currentSlidePos >= totalSliderItems;

    if (slideEnd) {
      currentSlidePos = 0;
    } else {
      currentSlidePos++;
    }

    moveSliderItem();
  };

  sliderNextBtn.addEventListener("click", slideNext);

  /**
   * PREVIOUS SLIDE
   */
  const slidePrev = function () {
    if (currentSlidePos <= 0) {
      currentSlidePos = totalSliderItems;
    } else {
      currentSlidePos--;
    }

    moveSliderItem();
  };

  sliderPrevBtn.addEventListener("click", slidePrev);

  const dontHaveExtraItem = totalSliderItems <= 0;
  if (dontHaveExtraItem) {
    sliderNextBtn.setAttribute("disabled", "");
    sliderPrevBtn.setAttribute("disabled", "");
  }

  /**
   * AUTO SLIDE
   */

  let autoSlideInterval;

  const startAutoSlide = () =>
    (autoSlideInterval = setInterval(slideNext, 3000));
  startAutoSlide();
  const stopAutoSlide = () => clearInterval(autoSlideInterval);

  currentSlider.addEventListener("mouseover", stopAutoSlide);

  currentSlider.addEventListener("mouseout", startAutoSlide);

  /**
   * RESPONSIVE
   */

  window.addEventListener("resize", moveSliderItem);
};

for (let i = 0, len = sliders.length; i < len; i++) {
  sliderInit(sliders[i]);
}

/**
 * ACCORDION
 */

const accordions = document.querySelectorAll("[data-accordion]");

let lastActiveAccordion;

const accordionInit = function (currentAccordion) {
  const accordionBtn = currentAccordion.querySelector("[data-accordion-btn]");

  accordionBtn.addEventListener("click", function () {
    if (currentAccordion.classList.contains("active")) {
      currentAccordion.classList.toggle("active");
    } else {
      if (lastActiveAccordion) lastActiveAccordion.classList.remove("active");
      currentAccordion.classList.add("active");
    }

    lastActiveAccordion = currentAccordion;
  });
};

for (let i = 0, len = accordions.length; i < len; i++) {
  accordionInit(accordions[i]);
}

//------------------------------------------Searching for specific data of HTML table
search.addEventListener("input", searchTable);

function searchTable() {
  table_rows.forEach((row, i) => {
    let table_data = row.textContent.toLowerCase(),
      search_data = search.value.toLowerCase();

    row.classList.toggle("hide", table_data.indexOf(search_data) < 0);
    row.style.setProperty("--delay", i / 25 + "s");
  });

  document.querySelectorAll("tbody tr:not(.hide)").forEach((visible_row, i) => {
    visible_row.style.backgroundColor =
      i % 2 == 0 ? "transparent" : "#0000000b";
  });
}

//------------------------------------------Sorting | Ordering data of HTML table

table_headings.forEach((head, i) => {
  let sort_asc = true;
  head.onclick = () => {
    table_headings.forEach((head) => head.classList.remove("active"));
    head.classList.add("active");

    document
      .querySelectorAll("td")
      .forEach((td) => td.classList.remove("active"));
    table_rows.forEach((row) => {
      row.querySelectorAll("td")[i].classList.add("active");
    });

    head.classList.toggle("asc", sort_asc);
    sort_asc = head.classList.contains("asc") ? false : true;

    sortTable(i, sort_asc);
  };
});

function sortTable(column, sort_asc) {
  const table_rows = Array.from(document.querySelectorAll("tbody tr"));

  table_rows.sort((a, b) => {
    let firstRowContent = a.querySelectorAll("td")[column].textContent.trim();
    let secondRowContent = b.querySelectorAll("td")[column].textContent.trim();

    // Check if the content is numeric or string
    const firstRowNumeric = !isNaN(parseFloat(firstRowContent));
    const secondRowNumeric = !isNaN(parseFloat(secondRowContent));

    if (firstRowNumeric && secondRowNumeric) {
      // If both are numeric, compare them as numbers
      return sort_asc
        ? parseFloat(firstRowContent) - parseFloat(secondRowContent)
        : parseFloat(secondRowContent) - parseFloat(firstRowContent);
    } else {
      // Otherwise, compare them as strings
      return sort_asc
        ? firstRowContent.localeCompare(secondRowContent)
        : secondRowContent.localeCompare(firstRowContent);
    }
  });

  // Clear the existing tbody content
  const tbody = document.querySelector("tbody");
  tbody.innerHTML = "";

  // Append sorted rows to tbody
  table_rows.forEach((row) => {
    tbody.appendChild(row);
  });
}

//------------------------------------------ Converting HTML table to JSON

function downloadAsJson() {
  // Get the table element
  const table = document.querySelector("#customers_table");

  // Get all the table rows
  const rows = table.querySelectorAll("tbody tr");

  // Define an array to store the data
  const data = [];

  // Iterate over each row
  rows.forEach((row) => {
    // Get the columns in the current row
    const columns = row.querySelectorAll("td");

    // Extract data from each column
    const rowData = {
      "#": columns[0].textContent.trim(),
      COLLECTION: columns[1].textContent.trim(),
      "FLOOR PRICE": columns[2].textContent.trim(),
      "FLOOR CHANGE": columns[3].textContent.trim(),
      VOLUME: columns[4].textContent.trim(),
      "VOLUME CHANGE": columns[5].textContent.trim(),
      ITEMS: columns[6].textContent.trim(),
      OWNER: columns[7].textContent.trim(),
    };

    // Add the extracted data to the array
    data.push(rowData);
  });

  // Convert the data array to JSON format
  const jsonData = JSON.stringify(data, null, 2);

  // Create a blob containing the JSON data
  const blob = new Blob([jsonData], { type: "application/json" });

  // Create a temporary anchor element to trigger the download
  const anchor = document.createElement("a");
  anchor.href = URL.createObjectURL(blob);
  anchor.download = "collection_table.json";

  // Programmatically click the anchor element to trigger the download
  anchor.click();
}

// Attach the function to the click event of the JSON button
const jsonBtn = document.querySelector("#toJSON");
jsonBtn.addEventListener("click", downloadAsJson);

//------------------------------------------Converting HTML table to CSV File

// Function to convert table data to CSV format
function convertTableToCSV() {
  const table = document.querySelector("#customers_table table");
  const rows = table.querySelectorAll("tr");

  let csv = [];

  // Iterate over rows and cells to construct CSV data
  rows.forEach((row) => {
    const rowData = [];
    row.querySelectorAll("td, th").forEach((cell) => {
      rowData.push(cell.textContent.trim());
    });
    csv.push(rowData.join(","));
  });

  // Convert CSV array to string
  return csv.join("\n");
}

// Function to initiate CSV download
function downloadCSV(csvData, filename) {
  const blob = new Blob([csvData], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.setAttribute("href", url);
  a.setAttribute("download", filename);
  a.style.display = "none";
  document.body.appendChild(a);

  a.click();

  // Cleanup
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}

// Event listener for JSON export button
const json_btn = document.querySelector("#toCSV");
json_btn.addEventListener("click", () => {
  const csvData = convertTableToCSV();
  downloadCSV(csvData, "collection_data.csv");
});

/**  ADD TO CART QUERY */

document.addEventListener("DOMContentLoaded", function () {
  const navbarLoginLogoutButton = document.getElementById(
    "navbar-login-logout"
  );

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (currentUser) {
    // Changing to Logout if a user is found
    navbarLoginLogoutButton.setAttribute("href", "#");
    navbarLoginLogoutButton.innerText = "Logout";
    navbarLoginLogoutButton.addEventListener("click", function (e) {
      e.preventDefault();
      logout();
    });
  } else {
    // Keeping as Login if no user is found
    navbarLoginLogoutButton.setAttribute("href", "./login.html");
    navbarLoginLogoutButton.innerText = "Login";
  }

  // Select all buttons with the class "btn-primary"
  var addToCartButtons = document.querySelectorAll(".btn-primary");

  // Add click event listener to each button
  addToCartButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      // Handle the click event for each button here
      console.log("Add to cart button clicked");
      // You can perform additional actions here, such as adding the item to the shopping cart
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const navbarLoginLogoutButton = document.getElementById(
    "navbar-login-logout"
  );
  const footerLogin = document.getElementById("footer-login");

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (currentUser) {
    // Changing to Logout if a user is found
    navbarLoginLogoutButton.setAttribute("href", "#");
    navbarLoginLogoutButton.innerText = "Logout";
    footerLogin.innerText = "Logout";
    navbarLoginLogoutButton.addEventListener("click", function (e) {
      e.preventDefault();
      logout();
    });
    footerLogin.addEventListener("click", function (e) {
      e.preventDefault();
      logout();
    });
  } else {
    // Keeping as Login if no user is found
    navbarLoginLogoutButton.setAttribute("href", "./login.html");
    navbarLoginLogoutButton.innerText = "Login";
    footerLogin.innerText = "Login";
  }
});

function logout() {
  console.log("Logging out...");
  localStorage.removeItem("currentUser"); // Remove user from storage
  window.location.href = "./index.html"; // Redirect to the homepage
}
