const currencies = "https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies.json";
const selectFromCurrency = document.getElementById("fromCurrencies");
const selectToCurrency = document.getElementById("toCurrencies");

async function populateDropDown() {
    try {
        const response = await fetch(currencies);
        const currenciesData = await response.json();

        selectFromCurrency.innerHTML = "";
        selectToCurrency.innerHTML = "";

        for (const key in currenciesData) {
            if (currenciesData.hasOwnProperty(key)) {
                const optionFrom = document.createElement("option");
                optionFrom.value = currenciesData[key];
                optionFrom.text = `${key} (${currenciesData[key]})`;
                selectFromCurrency.appendChild(optionFrom);

                const optionTo = document.createElement("option");
                optionTo.value = currenciesData[key];
                optionTo.text = `${key} (${currenciesData[key]})`;
                selectToCurrency.appendChild(optionTo);
            }
        }
    } catch (error) {
        console.error('Issue with fetching JSON data: ', error)
    }
}

populateDropDown();