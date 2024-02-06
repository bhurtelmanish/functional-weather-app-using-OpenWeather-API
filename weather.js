const searchBar = document.querySelectorAll('.search-bar')[0];
const searchButton = document.querySelectorAll('.search-btn')[0];
const cityDisplay = document.querySelectorAll('.city-name')[0];
const descriptionDisplay = document.querySelectorAll('.city-description-display')[0];
const temperatureDisplay = document.querySelectorAll('.city-temperature')[0];
const imageDisplay = document.querySelectorAll('.image-current-weather')[0];
const windSpeedDisplay = document.querySelectorAll('.wind-speed')[0];
const windDegreeDisplay = document.querySelectorAll('.wind-degree')[0];
const humidityDisplay = document.querySelectorAll('.humidity')[0];
const pressureDisplay = document.querySelectorAll('.pressure')[0];
const rainDisplay = document.querySelectorAll('.rain')[0];
const realFeelDisplay = document.querySelectorAll('.real-feel')[0];

const loader = document.querySelectorAll('.loader')[0];
const home_section = document.querySelectorAll('.home-content-header')[0];
const bottom_section = document.querySelectorAll('.air-condition-container')[0];

//Initializing the variables for image routes(Routes are created with respect to weather.html file)
const sunny_weather_img_url = './images/weather-images/sunny-weather.png'
const cloudy_weather_img_url = './images/weather-images/cloudy-weather.png'
const rainy_weather_img_url = './images/weather-images/rainy-weather.png'
const thunderstorm_weather_img_url = './images/weather-images/thunderstorm.png'
const broken_clouds_weather_img_url = './images/weather-images/broken-clouds.png'
const ice_img_url = './images/weather-images/ice.png';

//Initializing the current city to be displayed on screen
let currentCity = `Pokhara`;

let loading= false;

//Open Weather API Key
const api_key = `635fe4af6579b7d25efcd816868f2dca`;

//Funtion to convert the provided city name into latitude and longitude first and then providing that details to another function to finally fetch the weather data
const convertCityToCoordinates = async (city) => {
        const url = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${api_key}`;
        const response = await fetch(url);
        const data  =  await response.json();

        if(!data.length == 0){
            let latitude = data[0].lat;
            let longitude = data[0].lon;
            //Show loading = true while fetching data 
            const showLoading = () => {
                loading = true;
                if(loading == true){
                    loader.style.display = 'block';
                    home_section.style.display = 'none'; 
                    bottom_section.style.display = 'none'; 
                }
                console.log(loading);
            }
            showLoading();

            const fetchData = async (lat , lon) => {
                const final_url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}&units=standard`;
                const final_response = await fetch(final_url);
                const final_data = await final_response.json();
        
                let api_desc = final_data.weather[0].description;
                cityDisplay.innerHTML = final_data.name;
                descriptionDisplay.innerHTML = api_desc;
        
                //Conditionally rendering the images locally on the basis of description provided
                const imageRendering = (sunny , thunderstorm , rainy , broken_clouds , ice) => {
                    if (api_desc.includes('clouds') || api_desc.includes('cloud') || api_desc.includes('fog')) {
                        imageDisplay.innerHTML = `<img src="${broken_clouds}" alt="Weather Icon" class="weather-current-image">`;
                    }
                    else if(api_desc.includes('clear sky')){
                        imageDisplay.innerHTML = `<img src="${sunny}" alt="Weather Icon" class="weather-current-image">`;
                    }     
                    else if(api_desc.includes('thunderstorm') || api_desc.includes('lightning')){
                        imageDisplay.innerHTML = `<img src="${thunderstorm}" alt="Weather Icon" class="weather-current-image">`;
                    } 
                    else if(api_desc.includes('raining') || api_desc.includes('rain') || api_desc.includes('shower rain')){
                        imageDisplay.innerHTML = `<img src="${rainy}" alt="Weather Icon" class="weather-current-image">`;
                    }      
                    else if(api_desc.includes('snow') || api_desc.includes('ice')){
                        imageDisplay.innerHTML = `<img src="${ice}" alt="Weather Icon" class="weather-current-image">`;
                    }             
                }
                imageRendering(sunny_weather_img_url  , thunderstorm_weather_img_url , rainy_weather_img_url , broken_clouds_weather_img_url , ice_img_url);
                
        
                //Converting temperature in kelvin to degree celcius
                let temperature_in_kelvin = final_data.main.temp;
                let temperature_in_celcius =  temperature_in_kelvin - 273.15
                temperatureDisplay.innerHTML = `${Math.floor(temperature_in_celcius)}°`;
                windSpeedDisplay.innerHTML = `${final_data.wind.speed}m/s`;
                windDegreeDisplay.innerHTML = `${final_data.wind.deg}deg`;
                humidityDisplay.innerHTML = `${final_data.main.humidity}%`;
                pressureDisplay.innerHTML = `${final_data.main.pressure}hPa`;
                //Condition
                if(final_data.rain){
                    rainDisplay.innerHTML = `${final_data.rain['1h']}mm`;
                }else{
                    rainDisplay.innerHTML = `0mm`;
                }
                let realFeelTemp = (final_data.main.feels_like - 273.15);
                realFeelDisplay.innerHTML = `${Math.floor(realFeelTemp)}°`;
        
                // console.log(final_data)
        
                //Show loading=false when data fetching is completed
                const hideLoading = () => {
                    loading = false;
                    if(loading == false){
                        loader.style.display = 'none';
                        home_section.style.display = 'flex';
                        bottom_section.style.display = 'flex'; 
                    }
                    console.log(loading);
                }
                hideLoading();
            }
            //This function fetched the weather data based on the latitude and longitude provided
            fetchData(latitude , longitude);
        }
        else{
            alert('No cities found!!!');
        }
}
       
convertCityToCoordinates(currentCity);



const conditionalFetchData = () => {
    currentCity = searchBar.value;
    convertCityToCoordinates(currentCity);
}

// const regEx = /[^a-zA-Z\s]/g;

searchBar.addEventListener('keyup' ,  (e) =>{
    if(e.key == 'Enter') {
        if(!searchBar.value.trim() == ''){
            conditionalFetchData();
        }else{
            alert('Provide valid city name');
        }
    }
})

searchButton.addEventListener('click' ,  () =>{
    if(!searchBar.value.trim() == ''){
        conditionalFetchData();
    }else{
        alert('Provide valid city name');
    }
})