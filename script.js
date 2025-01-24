const locationElement = document.querySelector(".location");
const tempElement = document.querySelector(".temperature");
const boxElement = document.querySelector(".box-2");
const chanceOfRainElement = document.querySelector(".chance-of-rain");
const windSpeedElement = document.querySelector(".wind-speed-value");
const humidityElement = document.querySelector(".humidity-value");
const chanceOfRainElement2 = document.querySelector(".chance-of-rain-value");
const feelsLikeElement = document.querySelector(".feels-like-value");
const searchElement = document.querySelector(".search-bar");
const searchBox = document.querySelector(".search-box");
const dayElements = [
  document.querySelector(".s-one"),
  document.querySelector(".s-two"),
  document.querySelector(".s-three"),
  document.querySelector(".s-four"),
  document.querySelector(".s-five"),
];
const hourlyElements = [
  document.querySelector(".one"),
  document.querySelector(".two"),
  document.querySelector(".three"),
  document.querySelector(".four"),
  document.querySelector(".five"),
  document.querySelector(".six"),
];

let apiKey = "1c7d2b5419392bd608d5a14d1bf0ac20";
let city = "karachi";
let apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;
let apiUrl2 = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

searchBox.addEventListener("submit", (e) => {
  e.preventDefault();
  city = searchElement.value;
  apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;
  apiUrl2 = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
  getWeatherData();
  searchElement.value = "";
});
function getCustomIcon(weatherMain) {
  switch (weatherMain) {
    case "Clear":
      return '<img src="./PNG/sun.png" alt="sunny or clear weather png">';
    case "Clouds":
      return '<img src="./PNG/cloudy.png" alt="cloudy weather png">';
    case "Rain":
      return '<img src="./PNG/rainy-day.png" alt="rainy weather png">';
    case "Drizzle":
      return '<img src="./PNG/drizzle.png" alt="drizzle weather png">';
    case "Thunderstorm":
      return '<img src="./PNG/storm.png" alt="thunder weather png">';
    case "Snow":
      return '<img src="./PNG/cloudy2.png" alt="snow weather png">';
    case "Mist":
    case "Haze":
    case "Fog":
      return '<img src="./PNG/fog.png" alt="smoky weather png">';
    case "Smoke":
      return '<img src="./PNG/smoke.png" alt="smoky weather png">';
    case "Dust":
    case "Sand":
      return '<img src="./PNG/sandstorm.png" alt="dust weather png">';
    default:
      return "🌍";
  }
}

const countryName = (name) => {
  return new Intl.DisplayNames("en", { type: "region" }).of(name);
};
const windSpeed = (speed) => {
  let spd = speed * 3.6;
  return Math.round(spd);
};
const dateToDay = (date) => {
  let dt = date * 1000;
  return new Intl.DateTimeFormat("en", { weekday: "short" }).format(dt);
};
const sevenDaysWeather = async () => {
  try {
    let res = await fetch(apiUrl);
    let data = await res.json();
    let { list } = data;
    chanceOfRainElement.innerHTML = `Chance of Rain: ${list[0].pop}%`;
    chanceOfRainElement2.innerHTML = `${list[0].pop}%`;
    let result = list.filter((item) => item.dt_txt.includes("12:00:00"));

    dayElements.forEach((element, index) => {
      element.lastElementChild.innerHTML = `${result[index].main.temp}°C`;
      element.firstElementChild.innerHTML = `${dateToDay(result[index].dt)}`;
      element.lastElementChild.previousElementSibling.innerHTML = `${result[index].weather[0].main}`;
      element.firstElementChild.nextElementSibling.innerHTML = getCustomIcon(
        result[index].weather[0].main
      );
    });
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    const todayString = today.toISOString().split("T")[0];
    const tomorrowString = tomorrow.toISOString().split("T")[0];
    let hourlyData = list.filter(
      (item) =>
        item.dt_txt.includes(todayString) ||
        item.dt_txt.includes(tomorrowString)
    );
    hourlyElements.forEach((element, index) => {
      const date = new Date(hourlyData[index].dt * 1000);
      const hours = date.toLocaleString("en-US", {
        hour: "numeric",
        hourCycle: "h12",
      });
      element.firstElementChild.innerHTML = `${hours}`;
      element.lastElementChild.innerHTML = `${hourlyData[index].main.temp}°C`;
      element.firstElementChild.nextElementSibling.innerHTML = getCustomIcon(
        hourlyData[index].weather[0].main
      );
    });
  } catch (error) {}
};
const getWeatherData = async () => {
  try {
    let res = await fetch(apiUrl2);
    let data = await res.json();
    let { weather, main, sys, dt, name, wind } = data;
    let { temp, feels_like, humidity } = main;
    locationElement.innerHTML = `${name}, ${countryName(sys.country)}`;
    tempElement.innerHTML = `${temp}°C`;
    feelsLikeElement.innerHTML = `${feels_like}°C`;
    humidityElement.innerHTML = `${humidity}%`;
    windSpeedElement.innerHTML = `${windSpeed(wind.speed)} km/h`;
    boxElement.firstElementChild.innerHTML = getCustomIcon(weather[0].main);
    sevenDaysWeather();
  } catch (error) {}
};

window.addEventListener("load", getWeatherData);
