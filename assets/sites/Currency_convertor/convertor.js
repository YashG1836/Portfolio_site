const BASE_URL = "https://api.frankfurter.app/latest?";
const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

const updateExchangeRate = async () => {
    const amount = document.querySelector(".amount input");
    let amtVal = amount.value;

    if (amtVal === "" || amtVal < 1) {
        amtVal = 1;
        amount.value = "1";
    }

    if (fromCurr.value === toCurr.value) {
        msg.innerText = `${amtVal} ${fromCurr.value} = ${amtVal} ${toCurr.value}`;
        return;
    }

    const URL = `${BASE_URL}amount=${amtVal}&from=${fromCurr.value}&to=${toCurr.value}`;
    try {
        const response = await fetch(URL);
        const data = await response.json();
        const rate = data.rates[toCurr.value];
        const finalAmt = (amtVal * rate).toFixed(2);
        msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmt} ${toCurr.value}`;
    } catch (error) {
        msg.innerText = "Failed to fetch exchange rate.";
        console.error(error);
    }
};

const updateFlag = (element) => {
    const currCode = element.value;
    const countryCode = countryList[currCode];
    const newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
    const img = element.parentElement.querySelector("img");
    img.src = newSrc;
};

for (let select of dropdowns) {
    for (let currCode in countryList) {
        const newOption = document.createElement("option");
        newOption.innerText = currCode;
        newOption.value = currCode;

        if (select.name === "from" && currCode === "USD") {
            newOption.selected = true;
        } else if (select.name === "to" && currCode === "INR") {
            newOption.selected = true;
        }

        select.append(newOption);
    }

    updateFlag(select);

    select.addEventListener("change", (evt) => {
        updateFlag(evt.target);
        updateExchangeRate();
    });
}

window.addEventListener("load", updateExchangeRate);

btn.addEventListener("click", (evt) => {
    evt.preventDefault();
    updateExchangeRate();
});
