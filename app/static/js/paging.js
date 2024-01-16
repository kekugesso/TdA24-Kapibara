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

// Add event listeners to tags for click
document.addEventListener('DOMContentLoaded', function () {
    var tags = document.querySelectorAll('.tag');
    tags.forEach(function (tag) {
        tag.addEventListener('click', function () {
            // Get the tag text content and populate the search input
            var tagText = this.innerText;
            document.getElementById('searchInput').value = tagText;
            // Trigger the search
            filterLecturers();
        });
    });
});