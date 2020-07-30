var cities = [];

$(function(){
    $("#add-city").on("click", function(event) {
        event.preventDefault();
        var cities = [];
        var city = $("#city-input").val().trim();
        cities.push(city);
        console.log(city);

        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=0e9028207cc5ec14308ab8e988b32412";

        $.ajax ({
            url: queryURL,
            method: "GET"
        }).then(function(response) {
            console.log(response)
        
            var $currentWeatherBlock = $(".current")
            var cityName = $("<p>").text(city);
            var date = $("<p>").text(moment().format('MMMM Do YYYY'));
            var tempToF = (parseInt(response.main.temp) - 273.15) * 9/5 + 32;
            var temp = $("<p>").text("Temperature: " + tempToF.toFixed(2) + "F");
            var imgURL = "http://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png"
            var icon = $("<img>").attr("src", imgURL);
            var iconHolder = $("<p>").text("Current Conditions: ").append(icon);

            $currentWeatherBlock.append(cityName, date, temp, iconHolder);

            console.log(cities)
        })
    })
});