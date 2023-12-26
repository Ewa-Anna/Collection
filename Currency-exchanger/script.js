const currencies = "https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies.json";
const exchangeRatesApi = "https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/";

const selectFromCurrency = document.getElementById("fromCurrencies");
const selectToCurrency = document.getElementById("toCurrencies");
const displayElement = document.getElementById("display");

// Drop-down to choose the currency
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

        selectFromCurrency.addEventListener("change", handleCurrencyChange);
        selectToCurrency.addEventListener("change", handleCurrencyChange);

        updateDisplay();

        fetchHistoricalExchangeRates()
        .then(data => {
            drawExchangeRateChart(data);
        });


    } catch (error) {
        console.error("Issue with fetching data: ", error)
    }
}


async function handleCurrencyChange() {
    updateDisplay();
    const historicalData = await fetchHistoricalExchangeRates();
    drawExchangeRateChart(historicalData);
}

async function updateDisplay() {
    const amount = 1;
    const { convertedAmount } = await converRates();

    const fromCurrency = selectFromCurrency.value;
    const toCurrency = selectToCurrency.value;

    displayElement.textContent = `${amount} ${fromCurrency} is ${convertedAmount.toFixed(2)} ${toCurrency}`;
}

async function fetchExchangeRates(fromCurrency, toCurrency) {
    try {
        const response = await fetch(`${exchangeRatesApi}latest/currencies/${fromCurrency}/${toCurrency}.json`);
        const exchangeRatesData = await response.json();
        const rate = parseFloat(exchangeRatesData[toCurrency]);
        return rate;
    } catch (error) {
        console.error("Issue with fetching exchange rates: ", error);
    }
}

async function converRates() {
    const fromCurrency = selectFromCurrency.value;
    const toCurrency = selectToCurrency.value;

    const conversionRate = await fetchExchangeRates(fromCurrency, toCurrency);
    const amount = 1;

    return { convertedAmount: amount * conversionRate };
}


// Historical data for the chart
async function fetchHistoricalExchangeRates() {
    const fromCurrency = selectFromCurrency.value;
    const toCurrency = selectToCurrency.value;
    
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 2)
    const endDate = formatDate(currentDate);
    const startDate = formatDate(new Date(currentDate.setDate(currentDate.getDate() - 10)));

    const historicalData = [];

    let currentDateIterator = new Date(startDate);
    while (currentDateIterator <= new Date(endDate)) {
        const currentDateFormatted = formatDate(currentDateIterator);
        const url = `${exchangeRatesApi}${currentDateFormatted}/currencies/${fromCurrency}/${toCurrency}.json`;

        try {
            const response = await fetch(url);
            const exchangeRateData = await response.json();
            
            historicalData.push({
                date: currentDateFormatted,
                exchangeRate: exchangeRateData,
            });
        } catch (error) {
            console.error(`Error fetching historical exchange rates for ${currentDateFormatted}: `, error);
        }
        currentDateIterator.setDate(currentDateIterator.getDate() + 1);
    }
    console.log(historicalData)
    return historicalData;
   
}

// Format date as "YYYY-MM-DD"
function formatDate(today) {
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Draw the exchange rate chart
function drawExchangeRateChart(historicalData) {
    const fromCurrency = selectFromCurrency.value;

    const dates = historicalData.map(entry => entry.date);
    const exchangeRates = historicalData.map(entry => ({
        x: entry.exchangeRate.date,
        y: entry.exchangeRate[Object.keys(entry.exchangeRate)[1]]
    }));

    const ctx = document.getElementById("exchangeRateChart").getContext("2d");
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: `from ${fromCurrency}`,
                data: exchangeRates,
                borderColor: 'rgba(0, 0, 0, 1)',
                borderWidth: 1,
                fill: false
            }]
        },
        options: {
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'day',
                        tooltipFormat: 'YYYY-MM-DD',
                    },
                    title: {
                        display: true,
                        text: 'Date'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Exchange Rate'
                    }
                }
            },
            responsive: true,
        }
    });
}


populateDropDown();