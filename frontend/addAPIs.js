
    const popularStories = "https://api.nytimes.com/svc/mostpopular/v2/viewed/7.json?api-key=YNyBF7yQJmZJIWoEKuCMhfE22xCZsS8I";
        const topStories = "https://api.nytimes.com/svc/topstories/v2/home.json?api-key=yYNyBF7yQJmZJIWoEKuCMhfE22xCZsS8I";
        
        axios.get(popularStories).then(
            data => renderNewsFeed(data)
        ).catch(err => console.log(err));

    renderNewsFeed = function(feed){
        let storiesArr = feed.data.results;
        let tr;
        let link;
        let table = $(".newsFeed")
        let storyURL;
        let title;
        len = storiesArr.length;
        for(let i = 0; i < (len/2)-2; i++)
        {
            id =storiesArr[i].asset_id;
            tr = $("<tr id = "+id+"></tr>");
            storyURL =  storiesArr[i].url;
            title = storiesArr[i].title;
            link = $("<a  class = 'news_link' href = "+storyURL+" target='_blank'>*&nbsp;&nbsp;"+title+"</a>");
            tr.append(link);
            table.append(tr);
        }
        table.css("display", "block");
    }

        let allCities;

        if (window.navigator.geolocation) {
            const success = location => {
                const {latitude, longitude} = location.coords;
                fetch(`https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=32be8080305b44fa84266dbf266f7b7f`).then(
                    response => response.json()).then( data => initiateWeatherAPI(data))
                };
            const failure = err => {console.log(err)};
            window.navigator.geolocation.getCurrentPosition(success, failure);
        } 

    initiateWeatherAPI = function(locationJSON){
        let root = $(".forecast")
        let location_parts = locationJSON.results[0].components;
        let myTown = location_parts.town;
        let myState = location_parts.state_code;
        let myCountry = location_parts["ISO_3166-1_alpha-2"];
        root.append("<h2 class = 'current_city'>"+myTown+"<h2>");
        let locationLink = "https://dataservice.accuweather.com/locations/v1/cities/"+myCountry+"/"+myState+"/search?apikey=jZKnL8MZP57vbiskVr3O40DiJmvsXC5n&q="+myTown;
        let weatherLink = "https://dataservice.accuweather.com/forecasts/v1/daily/1day/";
        axios.get(locationLink).then(
            dat => {
            axios.get("https://dataservice.accuweather.com/currentconditions/v1/"+dat.data[0].Key+"?apikey=jZKnL8MZP57vbiskVr3O40DiJmvsXC5n").then(
                weather => renderCurrentWeather(weather)
            )
            axios.get("https://dataservice.accuweather.com/forecasts/v1/daily/1day/"+dat.data[0].Key+"?apikey=jZKnL8MZP57vbiskVr3O40DiJmvsXC5n").then(
                weather => renderForecast(weather)
            )
        }).catch(err => console.log(err));
    }

    renderCurrentWeather = function(weather){
        let root = $(".forecast")
        let data = weather.data[0];
        let currentW = data.WeatherText;
        root.append("<h3 class = 'current_weather'>"+currentW+"<h3>");
        let currentTemp = data.Temperature.Imperial.Value;
        root.append("<h2 class = 'current_temp'>"+currentTemp+"<span>&#176;</span> F<h2>");
        let icon;
        let weatherIcon = data.WeatherIcon;
        let lightning = "fas fa-bolt";
        let rain = "fas-cloud-showers-heavy"
        let wind = "fas fa-wind";
        let cloud = "fas fa-cloud";
        let sun = "fas fa-sun";
        let cloud_sun = "fas fa-cloud-sun";
        let rain_sun = "fas fa-cloud-sun-rain";
        let snow = "fas fa-snowflake";
        let moon = "fas fa-moon";
        let cloud_moon = "fas fa-cloud-moon";
        let rain_moon = "fas fa-cloud-moon-rain";
        let color;

        if(!(data.IsDayTime)) //Night
        {
            if(weatherIcon === 33 ||  weatherIcon === 34 ||  weatherIcon === 35){
                icon = moon;
                color = "MidnightBlue";
            }
            else if(weatherIcon === 36 ||  weatherIcon === 37 ||  weatherIcon === 38){
                icon = cloud_moon;
                color = "MidnightBlue";
            }
            else if(weatherIcon === 39 ||  weatherIcon === 40){
                icon = rain_moon;
                color = "MidnightBlue";
            }
            else if(weatherIcon === 41 ||  weatherIcon === 42){
                icon = lightning;
                color = "Yellow";
            }
            else if(weatherIcon === 43 ||  weatherIcon === 44){
                icon = snow;
                color = "Azure";
            }   
        }
        else{
            if(weatherIcon === 1 ||  weatherIcon === 2 ||  weatherIcon === 3 || weatherIcon === 4){
                icon = sun;
                color = "Gold";
            }
            else if(weatherIcon === 5 ||  weatherIcon === 6 ||  weatherIcon === 7 ||  weatherIcon === 8 ||  weatherIcon === 11){
                icon = cloud_sun;
                color = "lightgray";
            }
            else if(weatherIcon === 13 ||  weatherIcon === 14){
                icon = rain_sun;
                color = "LightCyan";
            }
            else if(weatherIcon === 16 ||  weatherIcon === 17 ){
                icon = lightning;
                color = "Yellow";
            }
            else if(weatherIcon === 18 ||  weatherIcon === 12){
                icon = rain;
                color = "LightBlue";

            }
            else if(weatherIcon >= 19 && weatherIcon <= 29){
                icon = snow;
                color = "Azure";
            } 
        }
        let colorDiv = $("<span style = color:"+color+"><span>");
        image = $("<i "+color +" id = 'weather_icon' class = '"+icon+" fa-4x'></i>");
        colorDiv.append(image);
        root.append(colorDiv);
        root.css("display", "block")
    }

    renderForecast = function(weather){
        let day = weather.data.DailyForecasts[0].Day;
        let night = weather.data.DailyForecasts[0].Night;
        let temperature = weather.data.DailyForecasts[0].Temperature;
        
        // Temperature
        let min = temperature.Minimum.value;
        let max = temperature.Maximum.value;
        let unit = temperature.Maximum.Unit;  
    }


//weather.data.DailyForecasts[0].Day.Icon