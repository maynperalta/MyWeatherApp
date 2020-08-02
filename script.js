var cities = [];
var lonEl;
var latEl;

const searchWeather = (city) => {
  var queryURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=0e9028207cc5ec14308ab8e988b32412";

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
    var h3 = $("<h3>").addClass("card-title").text("Current conditions for " + city);
    var date = $("<p>").addClass("card-body").text(moment().format("LLLL"));
    var tempToF = ((parseInt(response.main.temp) - 273.15) * 9) / 5 + 32;
    var temp = $("<p>").addClass("card-body").text("Temperature: " + tempToF.toFixed(2) + "°F");
    var humidity = $("<p>").addClass("card-body").text("Humidity: " + response.main.humidity + "%");
    var windSpeed = $("<p>").addClass("card-body").text("Wind Speed: " + response.wind.speed + " MPH");
    var imgURL ="http://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png";
    var icon = $("<img>").attr("src", imgURL);
    var iconHolder = $("<p>").addClass("card-body").text("Currently: ").append(icon);

    $("#current-body").append(h3, date, temp, humidity, windSpeed, iconHolder);

    console.log(cities);

    var queryURL2 = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latEl + "&lon=" + lonEl + "&appid=0e9028207cc5ec14308ab8e988b32412";
    $.ajax({
        url: queryURL2,
        method: "GET"
    }).then(function(response){
        console.log(response);

        var UVI = $("<p>").addClass("card-body").text("UV Index: " + response.current.uvi);
        if (response.current.uvi <=2){
            $(UVI).addClass(".low");
        }else if
            (response.current.uvi >2 && response.current.uvi <5){
                $(UVI).addClass(".moderate");
            }else{
                $(UVI).addClass(".severe");
            }
        
        $("#current-body").append(UVI);
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

//     var forecast = (city) => {
//     
//     $.ajax({
//         url: queryURL2,
//         method: "GET"
//     }).then(function(response){
//         console.log(response);
//         $(".weather-forecast").empty();
//         for (var j=0; j< 5; j ++){
//             var cardEl = $("<div>").addClass("card")

//             $(".weather-forecast").append(cardEl);
//         }

//     })

// }
