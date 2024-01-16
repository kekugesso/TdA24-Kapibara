function filterLecturers() {
    var input, filter, lecturers, lecturer, i, txtValue;
    var searchSelector = document.getElementById("searchSelector");
    input = document.getElementById("searchInput");
    filter = input.value.toUpperCase();
    lecturers = document.getElementsByClassName("lecturer");

    var startIndex = (currentPage - 1) * lecturersPerPage;
    var endIndex = startIndex + lecturersPerPage;

    for (i = 0; i < lecturers.length; i++) {
        lecturer = lecturers[i];
        txtValue = getSearchValue(lecturer, searchSelector.value).toUpperCase();

        if (txtValue.indexOf(filter) > -1 && i >= startIndex && i < endIndex) {
            lecturer.style.display = "";
        } else {
            lecturer.style.display = "none";
        }
    }

    updatePagination();
}

function getSearchValue(lecturer, searchType) {
    switch (searchType) {
        case "name":
            return lecturer.querySelector(".name").textContent || lecturer.querySelector(".name").innerText;
        case "location":
            return lecturer.querySelector(".lokace").textContent || lecturer.querySelector(".lokace").innerText;
        case "tags":
            // You may need to modify this part based on your actual structure
            return lecturer.querySelector(".tagy").textContent || lecturer.querySelector(".tagy").innerText;
        default:
            return "";
    }
}

function updateSearchPlaceholder() {
    var searchSelector = document.getElementById("searchSelector");
    var searchInput = document.getElementById("searchInput");

    switch (searchSelector.value) {
        case "name":
            searchInput.placeholder = "Search by name";
            break;
        case "location":
            searchInput.placeholder = "Search by location";
            break;
        case "tags":
            searchInput.placeholder = "Search by tags";
            break;
        default:
            searchInput.placeholder = "Search...";
            break;
    }
}

function searchByTag(tagName) {
    var searchInput = document.getElementById("searchInput");
    searchInput.value = tagName;
    filterLecturers();
}
