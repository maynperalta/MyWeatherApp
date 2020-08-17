//Global variables for empty city array, and longitude/latitude coordinates for 2nd API pull
var cities = [];
var lonEl;
var latEl;
//function for searchWeather command which initiates first API pull
const searchWeather = (city) => {
  var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=0e9028207cc5ec14308ab8e988b32412";

  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    cities.push(city);
    localStorage.setItem("cities", JSON.stringify(cities));
    console.log(response);
    $("#current-body").empty();
//call for dispBtn function which shows new generated buttons in local storage
    dispBtn();
//variables for HTML elements generated via jQuery to display current weather conditions from API call
    var lonEl = response.coord.lon
    var latEl = response.coord.lat
    var h3 = $("<h3>").addClass("card-title").text("Current conditions for " + city + ":");
    var date = $("<p>").addClass("card-body").text(moment().format("LLLL"));
    var tempToF = ((parseInt(response.main.temp) - 273.15) * 9) / 5 + 32;
    var temp = $("<p>").addClass("card-body").text("Temperature: " + tempToF.toFixed(2) + "°F");
    var humidity = $("<p>").addClass("card-body").text("Humidity: " + response.main.humidity + "%");
    var meterToMile = (parseInt(response.wind.speed) * 2.237);
    var windSpeed = $("<p>").addClass("card-body").text("Wind Speed: " + meterToMile.toFixed(1) + " MPH");
    var imgURL ="http://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png";
    var icon = $("<img>").attr("src", imgURL);
    var iconHolder = $("<p>").addClass("card-body").text("Currently: ").append(icon);
//append data to HTML document by ID
    $("#current-body").append(h3, date, temp, humidity, windSpeed, iconHolder);

    console.log(cities);
//second API call for UV index, and 5-day forecast data.
    var queryURL2 = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latEl + "&lon=" + lonEl + "&units=imperial&appid=0e9028207cc5ec14308ab8e988b32412";
    $.ajax({
        url: queryURL2,
        method: "GET"
    }).then(function(response){
        console.log(response);
//UV index data with if/else statements to show color indication
        var UVIEL = parseInt(response.current.uvi)
        var UVI = $("<p>").addClass("card-body").text("UV Index: " + UVIEL);
        if (UVIEL <=2){
          UVI.addClass("low");
        }else if
            (UVIEL >2 && UVIEL <5){
              UVI.addClass("moderate");
            }else{
              UVI.addClass("severe");
            }
//append UVI to current weather data above        
        $("#current-body").append(UVI);
//for loop to generate 5-day forecast data onto Bootstrap cards. The loop is limited to 5 loops (the pull brings data for 8-days)
        $("#forecast-body").empty();
        for (var j=0; j< 5; j ++){
          var colEl = $("<div>").addClass("col-md-2");
            var cardEl = $("<div>").addClass("card fore");
            colEl.append(cardEl);
//HTML elements and variables generated via jQuery to hold data from second API pull
            $("#forecast-body").append(colEl);
            var daily = $("<h4>").addClass("card-title").text(moment().date(Number).add(1+j, "d").format("MM/DD/YY"));
            var iconEl = $("<img>").attr("src", "http://openweathermap.org/img/wn/" + response.daily[j].weather[0].icon + "@2x.png");
            var tempEL = $("<p>").addClass("card-body").text("Temp: " + response.daily[j].temp.day + "°F");
            var humidityEl = $("<p>").addClass("card-body").text("Humidity: " + response.daily[j].humidity + "%");
//append data to HTML document
            cardEl.append(daily, iconEl, tempEL, humidityEl);
          }
    });
  }).catch(function(){
    alert("Please enter a valid city.")
  });
};
//dispBtn function to generate buttons to hold previously searched cities. Also empties cityList array to prevent duplicating
function dispBtn(){
  var cityList = $(".city-list ul");
  cityList.empty();
//for loop for city button generation then appends to cityList array
  for (var i = 0; i < cities.length; i++) {
    var li = $("<li>").addClass("list-group-item").text(cities[i]);
    cityList.append(li);
  }
}
//function on page load to get local storage, retrieve local storage, push searched cities into array, and call for searchWeather function
$(document).ready(function () {
  cities = JSON.parse(localStorage.getItem("cities")) || [];
//event listener for submit button to search for city weather data and call for searchWeather function by city input
  $("#submit-button").on("click", function (event) {
    event.preventDefault();
    var city = $("#city").val().trim();
    if (!city){
      return alert("Please enter a city.");
    } 
    
    searchWeather(city);
    $("#city").val("");
    
  });
//call for dispBtn function to display generated buttons in local storage.
  dispBtn();
//event listener for recalling weather data from cities in dynamically generated list from search history and call for searchWeather function by clicking list item
  $(document).on("click", ".city-list li", function () {
    var chosenCity = $(this).text();
    searchWeather(chosenCity);
  });

  console.log(city);
});