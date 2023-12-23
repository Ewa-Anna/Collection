const currencies = "https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies.json";
const exchangeRatesApi = "https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/";

const selectFromCurrency = document.getElementById("fromCurrencies");
const selectToCurrency = document.getElementById("toCurrencies");
const displayElement = document.getElementById("display");

async function populateDropDown() {
    try {
        const response = await fetch(currencies);
        const currenciesData = await response.json();

        selectFromCurrency.innerHTML = "";
        selectToCurrency.innerHTML = "";

        for (const key in currenciesData) {
            if (currenciesData.hasOwnProperty(key)) {
                const optionFrom = document.createElement("option");
                optionFrom.value = key;
                optionFrom.text = `${key} (${currenciesData[key]})`;
                selectFromCurrency.appendChild(optionFrom);

                const optionTo = document.createElement("option");
                optionTo.value = key
                optionTo.text = `${key} (${currenciesData[key]})`;
                selectToCurrency.appendChild(optionTo);
            }
        }
        
        selectFromCurrency.addEventListener("change", updateDisplay);
        selectToCurrency.addEventListener("change", updateDisplay);

        updateDisplay();

    } catch (error) {
        console.error("Issue with fetching data: ", error)
    }
}

async function fetchExchangeRates(baseCurrency) {
    try {
        const response = await fetch(`${exchangeRatesApi}/${baseCurrency.toLowerCase()}.json`);
        const exchangeRatesData = await response.json();
        return exchangeRatesData;
    } catch (error) {
        console.error("Issue with fetching exchange rates: ", error);
    }
}

async function updateDisplay() {
    const fromCurrency = selectFromCurrency.value;
    const toCurrency = selectToCurrency.value;
    const exchangeRatesData = await fetchExchangeRates(fromCurrency);
    console.log(exchangeRatesData[fromCurrency])

    if (exchangeRatesData) {
        const conversionRate = exchangeRatesData[toCurrency];
        const amount = 1;
        const convertedAmount = amount * conversionRate;
        displayElement.textContent = `${amount} ${fromCurrency} is ${convertedAmount.toFixed(2)} ${toCurrency}`;
    }
}


populateDropDown();