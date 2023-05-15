var cityInput = document.getElementById("cityInput");
var searchButton = document.getElementById("searchButton");
var clearHistory = document.getElementById("clearHistory");
var historyValue = document.getElementById("history");
var todaysWeather = document.getElementById("todaysWeather");
var cityHeader = document.getElementById("cityHeader");
var todaysweatherPic = document.getElementById("todaysweatherPic");
var temp = document.getElementById("temp");
var humidity = document.getElementById("humidity");
var wind = document.getElementById("wind");
var thisweekHeader = document.getElementById("thisweekHeader");

let searchHistory = JSON.parse(localStorage.getItem("search")) || [];

var apiKey = "e5bf85953bc5760b5cc33f6a872e9fd2";

function weatherPrompt(cityName) {

    var weatherUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + apiKey;
        fetch(weatherUrl)

    .then(function (data){
        todaysWeather.classList.remove("d-none");
        thisweekHeader.classList.remove("d-none");
        var currentDate = new Date(data.dt * 1000);
        var day = currentDate.getDate();
        var month = currentDate.getMonth() + 1;
        var year = currentDate.getFullYear();
        cityHeader.innerHTML = data.name + " (" + month + "/" + day + "/" + year + ") ";
        let weatherPic = data.weather[0].icon;
        todaysweatherPic.setAttribute("src", "https://openweathermap.org/img/wn/" + weatherPic + "@2x.png");
        todaysweatherPic.setAttribute("alt", data.weather[0].description);
        temp.innerHTML = "Temp: " + k2f(data.main.temp) + " &#176F";
        wind.innerHTML = "Wind: " + data.wind.speed + " MPH";
        humidity.innerHTML = "Humidity: " + data.main.humidity + "%";

        let cityID = data.id;
        let forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?id=" + cityID + "&appid=" + apiKey;
            
        return fetch(forecastUrl)
    })

    .then(function (response) {
        return response.json();
    })

    .then(function (data) {
        const forecastEls = document.querySelectorAll(".forecast");
        for (i = 0; i < forecastEls.length; i++) {
        forecastEls[i].innerHTML = "";
        const forecastIndex = i * 8 + 4;
        const forecastDate = new Date(data.list[forecastIndex].dt * 1000);
        const forecastDay = forecastDate.getDate();
        const forecastMonth = forecastDate.getMonth() + 1;
        const forecastYear = forecastDate.getFullYear();
        const dateRender = document.createElement("p");

        dateRender.setAttribute("class", "mt-3 mb-0 forecast-date");
        dateRender.innerHTML = forecastMonth + "/" + forecastDay + "/" + forecastYear;
        forecastEls[i].append((dateRender));
                

        const forecastweatherEl = document.createElement("img");
        forecastweatherEl.setAttribute("src", "https://openweathermap.org/img/wn/" + data.list[forecastIndex].weather[0].icon + "@2x.png");
        forecastweatherEl.setAttribute("alt", data.list[forecastIndex].weather[0].description);
        forecastEls[i].append(forecastweatherEl);
    
        const forecasttempEl = document.createElement("p");
        forecasttempEl.innerHTML = "Temp: " + k2f(data.list[forecastIndex].main.temp) + " &#176F";
        forecastEls[i].append(forecasttempEl);
    
        const forecastwindEl = document.createElement("p");
        forecastwindEl.innerHTML = "Wind: " + data.list[forecastIndex].wind.speed + " MPH";
        forecastEls[i].append(forecastwindEl);
    
        const forecasthumidityEl = document.createElement("p");
        forecasthumidityEl.innerHTML = "Humidity: " + data.list[forecastIndex].main.humidity + "%";
        forecastEls[i].append(forecasthumidityEl);
        }
    })
}

function k2f(K) {
    return Math.floor((K - 273.15) * 1.8 + 32);
}

searchButton.addEventListener("click", function () {
    var searchValue = cityInput.value;
    weatherPrompt(searchValue);
    searchHistory.push(searchValue);
    localStorage.setItem("search", JSON.stringify(searchHistory));
    renderHistory();
})

function renderHistory() {
    historyValue.innerHTML = "";
    for (let i = 0; i < searchHistory.length; i++) {
        const historyEl = document.createElement("input");
        historyEl.setAttribute("type", "text");
        historyEl.setAttribute("readonly", true);
        historyEl.setAttribute("class", "form-control d-block bg-white");
        historyEl.setAttribute("value", searchHistory[i]);
        historyEl.addEventListener("click", function () {
            weatherPrompt(historyEl.value);
        })
        historyValue.append(historyEl);
    }
}

clearHistory.addEventListener("click", function () {
    localStorage.clear();
    searchHistory = [];
    renderHistory();
})


