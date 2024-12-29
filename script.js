import { countryList } from './countryCodes.js';
const baseurl = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/";

//variables
let fromcountry = document.querySelector('.from select')
let tocountry = document.querySelector('.to select')
const button = document.querySelector('#exchange')
const dropdowns = document.querySelectorAll('.dropdown select')
let output_message = document.querySelector('#message')
let update_message = document.querySelector('.note p')
let swap_icon = document.querySelector('#swap')


//select option brings from the country list
let select;
for (select of dropdowns) {
  for (let countryCurrency in countryList) {
    let newoption = document.createElement('option')
    newoption.innerText = countryCurrency;
    newoption.value = countryCurrency;
    if (select.name === "from" && countryCurrency === "PKR") {
      newoption.selected = true;
    }
    else if (select.name === "to" && countryCurrency === "USD") {
      newoption.selected = true;
    }
    select.append(newoption)
  }
  // change the flag with the selected country
  select.addEventListener("change", (evt) => {
    updateFlag(evt.target)

  })
}


// ============================================================================================
// main function
let updateExchangeRate = async () => {
  let amount = document.querySelector('.amount input')
  const amountvalue = getAmountValue()

  try {
    const url = `${baseurl}${fromcountry.value.toLowerCase()}.json`;
    let response = await fetch(url)
    let data = await response.json();
    let up_to_Date = Object.values(data)[0]
    update_message.innerText = `last updated on  : ${up_to_Date}`
    let all_rates = Object.values(data)[1]
    let exchangeRate = all_rates[tocountry.value.toLowerCase()];

    // formula for amount to output
    output(exchangeRate)
    // let output = exchangeRate * (amountvalue)
    // output_message.innerText = `${amountvalue} ${fromcountry.value} = ${output.toFixed(3)} ${tocountry.value}`
  }
  catch (error) {
    console.error("Error fetching exchange rate:", error);
    output_message.innerText = "Error fetching exchange rate. Please try again.";
  }
};

const output = (exchangeRate) => {
  let output = exchangeRate * getAmountValue()
  output_message.innerText = `Output : ${getAmountValue()} ${fromcountry.value} = ${output.toFixed(3)} ${tocountry.value}`
}

swap_icon.addEventListener('click', (event) => {
  event.preventDefault()
  swapCurrencies()
})

// swap values function
const swapCurrencies = () => {
  const temp = fromcountry.value;
  fromcountry.value = tocountry.value;
  tocountry.value = temp;

  // Update flags and exchange rate
  updateFlag(fromcountry);
  updateFlag(tocountry);
  updateExchangeRate();
};



button.addEventListener('click', (evt) => {
  evt.preventDefault();
  updateExchangeRate()
})
// update flag function

const updateFlag = (element) => {
  let countryCurrency = element.value;
  let countryCode = countryList[countryCurrency];

  let newsrc = `https://flagsapi.com/${countryCode}/shiny/64.png `
  let img = element.parentElement.querySelector("img")
  img.src = newsrc;
}
const getAmountValue = () => {
  let amountValue = parseFloat(amount.value);
  if (isNaN(amountValue) || amountValue < 1) {
    amountValue = 1;
    amountInput.value = "1";
  }
  return amountValue;
};


window.addEventListener("load", () => {
  updateExchangeRate();
});