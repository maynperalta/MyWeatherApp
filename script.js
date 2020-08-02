var cities = [];
var lonEl;
var latEl;

const searchWeather = (city) => {
  var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=0e9028207cc5ec14308ab8e988b32412";

  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    console.log(response);
    $("#current-body").empty();

    cities.push(city);

    var cityList = $(".city-list ul");
    cityList.empty();

    for (var i = 0; i < cities.length; i++) {
      var li = $("<li>").addClass("list-group-item").text(cities[i]);
      cityList.append(li);
    }
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

    $("#current-body").append(h3, date, temp, humidity, windSpeed, iconHolder);

    console.log(cities);

    var queryURL2 = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latEl + "&lon=" + lonEl + "&units=imperial&appid=0e9028207cc5ec14308ab8e988b32412";
    $.ajax({
        url: queryURL2,
        method: "GET"
    }).then(function(response){
        console.log(response);
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
            //
        
        $("#current-body").append(UVI);

        $("#forecast-body").empty();
        for (var j=0; j< 5; j ++){
          var colEl = $("<div>").addClass("col-md-2");
            var cardEl = $("<div>").addClass("card fore");
            colEl.append(cardEl);

            $("#forecast-body").append(colEl);
            // var daily = $("<h4>").addClass("card-title").text(moment().format(l[j]));
            // var imgURLEL = "http://openweathermap.org/img/wn/" + response.daily[j].weather[0].icon + "@2png";
            var iconEl = $("<img>").attr("src", "http://openweathermap.org/img/wn/" + response.daily[j].weather[0].icon + "@2x.png");
            // var iconHolderEl = $("<p>").addClass("card-body").text().append(iconEl);
            // var tempToFEl = ((parseInt(response.daily[j].temp) - 273.15) * 9) / 5 + 32;
            var tempEL = $("<p>").addClass("card-body").text("Temp: " + response.daily[j].temp.day + "°F");
            var humidityEl = $("<p>").addClass("card-body").text("Humidity: " + response.daily[j].humidity + "%");

            cardEl.append(iconEl, tempEL, humidityEl);
            // var cardBodyEl = $("<div>").addClass("card-body");
          }
          //
    });

  });
};

$(document).ready(function () {
  $("#submit-button").on("click", function (event) {
    event.preventDefault();
    var city = $("#city").val().trim();
    searchWeather(city);
    $("#city").val("");
  });

  $(document).on("click", ".city-list li", function () {
    var chosenCity = $(this).text();
    searchWeather(chosenCity);
  });

  console.log(city);
});