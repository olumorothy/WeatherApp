const timeElement = document.getElementById("time");
const dateElement = document.getElementById("date");
const currentWeatherItem = document.getElementById("current-weather-items");
const timeZone = document.getElementById("time-zone");
const country = document.getElementById("country");
const weatherForecast = document.getElementById("weather-forecast");
const currentTemperature = document.getElementById("current-temp");

//array of days to handle the 0,1... returned by getDate and getDay
const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const API_KEY = "*******************"; //your api key here
//it will keep calling this function every 1sec
setInterval(() => {
  const time = new Date();
  const month = time.getMonth();
  const date = time.getDate();
  const day = time.getDay();
  const hour = time.getHours();
  const hoursin12HrFormat = hour >= 13 ? hour % 12 : hour;
  const minutes = time.getMinutes();
  const ampm = hour >= 12 ? "PM" : "AM";

  timeElement.innerHTML =
    (hoursin12HrFormat < 10 ? "0" + hoursin12HrFormat : hoursin12HrFormat) +
    ":" +
    (minutes < 10 ? "0" + minutes : minutes) +
    " " +
    `<span id="am-pm">${ampm}</span>`;

  dateElement.innerHTML = days[day] + ", " + date + " " + months[month];
}, 1000);

function getWeatherData() {
  navigator.geolocation.getCurrentPosition((success) => {
    console.log(success);

    let { latitude, longitude } = success.coords;
    console.log("latitude: ", latitude);
    console.log("longitude ", longitude);
    fetch(
      `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        showWeatherData(data);
      });
  });
}

getWeatherData();

function showWeatherData(data) {
  let { humidity, pressure, sunrise, sunset, wind_speed } = data.current;
  timeZone.innerHTML = data.timezone;

  country.innerHTML = data.lat + "N " + data.lon + "E";

  currentWeatherItem.innerHTML = `<div class="weather-item">
  <div>Humidity</div>
  <div>${humidity}%</div>
</div>
<div class="weather-item">
  <div>Pressure</div>
  <div>${pressure}</div>
</div>
<div class="weather-item">
  <div>Windspeed</div>
  <div>${wind_speed}</div>
</div>
<div class="weather-item">
  <div>Sunrise</div>
  <div>${window.moment(sunrise * 1000).format("HH:mm a")}</div>
</div>
<div class="weather-item">
  <div>Sunset</div>
  <div>${window.moment(sunset * 1000).format("HH:mm a")}</div>
</div>
`;

  let otherDayForecast = "";
  data.daily.forEach((day, index) => {
    if (index == 0) {
      currentTemperature.innerHTML = `
        <img
        src="http://openweathermap.org/img/wn/${day.weather[0].icon}@4x.png"
        alt="weather icon"
        class="w-icon"
      />
      <div class="other">
        <div class="day">${window.moment(day.dt * 1000).format("ddd")}</div>
        <div class="temp">Night - ${day.temp.night}&#176; C</div>
        <div class="temp">Day - ${day.temp.day}&#176; C</div>
      </div>
        `;
    } else {
      otherDayForecast += `
         <div class="weather-forecast-item">
            <div class="day">${window.moment(day.dt * 1000).format("ddd")}</div>
            <img
            src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png"
            alt="weather icon"
            class="w-icon"
            />
            <div class="temp">Night - ${day.temp.night}&#176; C</div>
            <div class="temp">Day - ${day.temp.day}&#176; C</div>
       </div>
         `;
    }
  });

  weatherForecast.innerHTML = otherDayForecast;
}
