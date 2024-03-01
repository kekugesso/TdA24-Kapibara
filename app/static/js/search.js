var debug = false;
// Function to filter lecturers based on selected tags, locations, and price range
function filterLecturers() {
    // Get selected tags
    var selectedTags = getSelectedItems("validationTags");

    // Get selected locations
    var selectedLocations = getSelectedItems("validationLocations");

    // Get price range
    var minPrice = parseFloat(document.getElementById("fromInput").value);
    var maxPrice = parseFloat(document.getElementById("toInput").value);
    
    if (debug) {
        console.log("Selected Tags:", selectedTags);
        console.log("Selected Locations:", selectedLocations);
    }
    
    // Iterate through each lecturer
    var lecturers = document.getElementsByClassName("lecturer");
    for (let i = 0; i < lecturers.length; i++) {
        var lecturer = lecturers[i];

        // Check if any filters are selected
        var filtersSelected = selectedTags.length > 0 || selectedLocations.length > 0 || !isNaN(minPrice) || !isNaN(maxPrice);
        
        if (debug) {
            console.log("Check alegeble:",filtersSelected);
        }

        if (filtersSelected) {
            
            // Check if lecturer matches the selected tags, locations, and price range
            var tagsMatch = checkArrayIntersection(selectedTags, getLecturerTags(lecturer));
            var locationsMatch = checkArrayIntersection(selectedLocations, getLecturerLocation(lecturer));
            var priceMatch = checkPriceRange(getLecturerPrice(lecturer), minPrice, maxPrice);
            
            if (debug) {
            console.log("Display:",tagsMatch || locationsMatch || priceMatch)
            console.log(`tagsMatch: ${tagsMatch}, locationsMatch: ${locationsMatch}, priceMatch: ${priceMatch}`)
            }

            // Show or hide the lecturer based on the filter criteria
            if ((tagsMatch || locationsMatch) && priceMatch) {
                lecturer.style.display = "";
                
                if (debug) {console.log("Displaying filtr criteria")}
            
            } else if (priceMatch && (selectedTags.length === 0 && selectedLocations.length === 0)) {
                lecturer.style.display = "";
                
                if (debug) {console.log("Displaying price match")}
            }
             else {
                lecturer.style.display = "none";
            }
        } else {
            // Show all lecturers when no filters are selected
            lecturer.style.display = "";
        }
        if (debug) {
            console.log(`Lecturer ${i + 1}: Tags Match - ${tagsMatch}, Locations Match - ${locationsMatch}, Price Match - ${priceMatch}`);
        }
    }

    // Show "No lecturers found" message if no lecturers match the criteria
    var noResultsMessage = document.getElementById("noResultsMessage");
    var lecturersVisible = Array.from(lecturers).some(lecturer => lecturer.style.display === "");
    noResultsMessage.style.display = lecturersVisible ? "none" : "";
}

// Function to check if there is an intersection between two arrays
function checkArrayIntersection(arr1, arr2) {
    return arr1.some(item => arr2.includes(item));
}

// Function to check if price is within the specified range
function checkPriceRange(price, minPrice, maxPrice) {
    return price >= minPrice && price <= maxPrice;
}

// Function to get selected items from a dropdown
function getSelectedItems(selectId) {
    var selectBox = document.getElementById(selectId);
    var selectedItems = [];

    for (var i = 0; i < selectBox.options.length; i++) {
        if (selectBox.options[i].selected) {
            selectedItems.push(selectBox.options[i].textContent);
        }
    }

    return selectedItems;
}

// Function to get lecturer tags
function getLecturerTags(lecturer) {
    var tags = [];
    var tagElements = lecturer.getElementsByClassName("tag");
    for (var i = 0; i < tagElements.length; i++) {
        tags.push(tagElements[i].getAttribute("name"));
    }
    return tags;
}

// Function to get lecturer location
function getLecturerLocation(lecturer) {
    return lecturer.querySelector(".lokace").textContent.replace("Lokace: ", "").trim();
}

// Function to get lecturer price
function getLecturerPrice(lecturer) {
    var priceText = lecturer.querySelector(".cena").textContent.replace("Cena na hodinu: ", "").trim();
    return parseFloat(priceText.split(" ")[0]); // Assuming the price is the first word in the text
}

// Example: Attach event listeners after the window has loaded
window.onload = function () {
    document.getElementById("validationTags").addEventListener("change", filterLecturers);
    document.getElementById("validationLocations").addEventListener("change", filterLecturers);
    document.getElementById("fromInput").addEventListener("input", filterLecturers);
    document.getElementById("toInput").addEventListener("input", filterLecturers);
};

function UpdateMaxMin(min, max) {
    minPrice = min;
    maxPrice = max;
    filterLecturers();
}

// Get the highest price for setting the slider's max value
var highestPrice = Math.max.apply(Math, Array.from(document.querySelectorAll('.lecturer')).map(function (lecturerElement) {
    return parseFloat(lecturerElement.querySelector('.cena').textContent.replace('Cena na hodinu: ', '').replace(' Kč', '')) || 0;
}));

var minPrice = 0;
var maxPrice = highestPrice;

// Initial setup
document.addEventListener('DOMContentLoaded', function () {
    UpdateMaxMin(0, highestPrice)
    // Filter and show lecturers on page load
    filterLecturers();
});