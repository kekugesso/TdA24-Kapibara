function controlFromInput(fromSlider, fromInput, toInput, controlSlider, highestPrice) {
    const [from, to] = getParsed(fromInput, toInput);
    fillSlider(fromInput, toInput, '#C6C6C6', '#25daa5', controlSlider, highestPrice);
    if (from > to) {
        fromSlider.value = to;
        fromInput.value = to;
    } else {
        fromSlider.value = from;
    }
    UpdateMaxMin(fromInput.value, toInput.value);

}
    
function controlToInput(toSlider, fromInput, toInput, controlSlider, highestPrice) {
    const [from, to] = getParsed(fromInput, toInput);
    fillSlider(fromInput, toInput, '#C6C6C6', '#25daa5', controlSlider, highestPrice);
    setToggleAccessible(toInput);
    if (from <= to) {
        toSlider.value = to;
        toInput.value = to;
    } else {
        toInput.value = from;
    }
    UpdateMaxMin(fromInput.value, toInput.value);

}

function controlFromSlider(fromSlider, toSlider, fromInput, highestPrice) {
    const [from, to] = getParsed(fromSlider, toSlider);
    fillSlider(fromSlider, toSlider, '#C6C6C6', '#25daa5', toSlider, highestPrice);
    if (from > to) {
        fromSlider.value = to;
        fromInput.value = to;
    } else {
        fromInput.value = from;
    }
    UpdateMaxMin(fromSlider.value, toSlider.value);
}

function controlToSlider(fromSlider, toSlider, toInput, highestPrice) {
    const [from, to] = getParsed(fromSlider, toSlider);
    fillSlider(fromSlider, toSlider, '#C6C6C6', '#25daa5', toSlider, highestPrice);
    setToggleAccessible(toSlider);
    if (from <= to) {
        toSlider.value = to;
        toInput.value = to;
    } else {
        toInput.value = from;
        toSlider.value = from;
    }
    UpdateMaxMin(fromSlider.value, toSlider.value);
}

function getParsed(currentFrom, currentTo) {
    const from = parseInt((currentFrom && currentFrom.value) || 0, 10);
    const to = parseInt((currentTo && currentTo.value) || 0, 10);
    return [from, to];
}

function fillSlider(from, to, sliderColor, rangeColor, controlSlider, highestPrice) {
    if (to && to.min !== undefined && to.max !== undefined && highestPrice !== undefined) {
        const rangeDistance = highestPrice - to.min;
        const fromPosition = (from.value || 0) - to.min;
        const toPosition = (to.value || 0) - to.min;
        controlSlider.style.background = `linear-gradient(
            to right,
            ${sliderColor} 0%,
            ${sliderColor} ${(fromPosition) / rangeDistance * 100}%,
            ${rangeColor} ${((fromPosition) / rangeDistance) * 100}%,
            ${rangeColor} ${(toPosition) / rangeDistance * 100}%, 
            ${sliderColor} ${(toPosition) / rangeDistance * 100}%, 
            ${sliderColor} 100%)`;
    } else {
        console.error("Invalid 'to' parameter in fillSlider function");
    }
}

function setToggleAccessible(currentTarget) {
    const toSlider = document.querySelector('#toSlider');
    if (currentTarget && Number(currentTarget.value) <= 0) {
        toSlider.style.zIndex = 2;
    } else {
        toSlider.style.zIndex = 0;
    }
}

const fromSlider = document.querySelector('#fromSlider');
const toSlider = document.querySelector('#toSlider');
const fromInput = document.querySelector('#fromInput');
const toInput = document.querySelector('#toInput');


toSlider.max = highestPrice;
toInput.max = highestPrice;
fromInput.value = 0;
fromSlider.value = 0;
toSlider.value = highestPrice;
toInput.value = highestPrice;
fromSlider.max = highestPrice;
fromInput.max = highestPrice;

fillSlider(fromSlider, toSlider, '#C6C6C6', '#25daa5', toSlider, highestPrice);
setToggleAccessible(toSlider);

fromSlider.oninput = () => controlFromSlider(fromSlider, toSlider, fromInput, highestPrice);
toSlider.oninput = () => controlToSlider(fromSlider, toSlider, toInput, highestPrice);
fromInput.oninput = () => controlFromInput(fromSlider, fromInput, toInput, toSlider, highestPrice);
toInput.oninput = () => controlToInput(toSlider, fromInput, toInput, toSlider, highestPrice);
