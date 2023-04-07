const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

//initially vairables need????

let oldTab = userTab;
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
oldTab.classList.add("current-tab");
// agar coordinates pehle se present hai tho show kar dega varna rehne dega
getfromSessionStorage();


function switchTab(newTab) {
    if (newTab != oldTab) {
        // oldTab=current tab
        // newTab=clicked tab

        // adding and removing background color from button as per clicked or not
        oldTab.classList.remove("current-tab");
        oldTab = newTab;
        oldTab.classList.add("current-tab");

        //main pehle your weather wale tab pr tha, ab search tab visible karna h 
        if(!searchForm.classList.contains("active")) {
            //kya search form wala container is invisible, if yes then make it visible
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else {
            //main pehle search wale tab pr tha, ab your weather tab visible karna h 
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            //ab main your weather tab me aagya hu, toh weather bhi display karna poadega, so let's check local storage first
            //for current location coordinates, if we haved saved them there.
            getfromSessionStorage();
        }
    }
}
// jeb bhi "user weather" ya "search weather" pe click karege tho switch operation hoga
userTab.addEventListener("click", () => {
    //pass clicked tab as input paramter
    switchTab(userTab);
});

searchTab.addEventListener("click", () => {
    //pass clicked tab as input paramter
    switchTab(searchTab);
});

//check if cordinates are already present in session storage
function getfromSessionStorage() {
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates) {
        //agar local coordinates nahi mile
        grantAccessContainer.classList.add("active");
    }
    else {
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }

}
// iss function mei api call hogi tho function ko async banana hoga
async function fetchUserWeatherInfo(coordinates) {
    const {lat, lon} = coordinates;
    // make grantcontainer invisible
    grantAccessContainer.classList.remove("active");
    //make loader visible
    loadingScreen.classList.add("active");

    //API CALL
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
          );
        const  data = await response.json();
// api call/fetch kari and hamara data aa gaya tho aab hum loader ko remove kar sakte hai 
        loadingScreen.classList.remove("active");
        // and userInfoContainer wale tab ko visible kara do 
        userInfoContainer.classList.add("active");
        // printing/rendering weather info from API into UI
        renderWeatherInfo(data);
    }
    catch(err) {
        loadingScreen.classList.remove("active");
        //HW

    }

}
// API ne weather ka data de diya , aab hume usme se useful data ko render karna hai 
function renderWeatherInfo(weatherInfo) {
    //fistly, we have to fethc the elements from API
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    console.log(weatherInfo);

    //fetch values from weatherINfo object and put it UI elements
    // mei weatherInfo ke andar name mei gaya aur vaha se name ko cityName mei store kar diya
    cityName.innerText = weatherInfo?.name;
    // weatherInfo se sys mei gaya fir country mei fir uske output ko lowerCase mei convert kar diya 
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    // weather ke array hai tho weather ke 1st element mei jane ke liye [0] use kiya
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;


}

function getLocation() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else {
        //show an alert for no gelolocation support available
        console.log("No geoLocation Support");}
}

function showPosition(position) {

    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }
// coordinates ko sessionStorage mei store kar lo and userCordinates ko JSON string format ke convert kar diya 
    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);

}
// jeb "grantAccess" button pe click kare tho getLocation function ko call karo 
const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation);

const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let cityName = searchInput.value;

    if(cityName === "")
        return;
    else 
        fetchSearchWeatherInfo(cityName);
})

async function fetchSearchWeatherInfo(city) {
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
          );
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err) {
        //hW
    }
}










// console.log('hell')

// const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";

// // jho data hamne API ke through fetch kiya tha , usko iss function ke through show kareyge on UI
// function renderWeatherInfo(data) {
    
//         let newPara = document.createElement('p');
//         newPara.textContent = `${data?.main?.temp.toFixed(2)} °C`
    
//         document.body.appendChild(newPara);
// }

// async function fetchWeatherDetails() {

//     try {
//         let city = "goa";
//         // api of weather of city goa is fetched and stored in response and await ensures that we have to wait until we get response from api
//         const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
//         // response ko json format mei convert kar diya
//         const data = await response.json();
    
//         console.log("Weather data:-> " , data);

//         renderWeatherInfo(data);
//     }
//     catch(err) {
//         //handle the error here
//         console.log("Errror Found" , err);
//     }
//     //https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric

// }

// // function for retreiving data from latitude and longitude API 
// async function getCustomWeatherDetails() {
//     try{
//         let latitude = 17.6333;
//         let longitude = 18.3333;
//     // API of latitude and longitude fetch kar li and result mei store kara diya
//         let result = await fetch(`https://api.openweathermap.org/data/2.5/weather?
//                                 lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`);
//     // result ko json format mei convert kara diya
//         let data = await result.json();
    
//         console.log(data);
//     }
//     catch(err) {
//         console.log("Errror Found" , err);
//     }

// }

// // switching between 2 tabs on clicking "your weather" and "search"
// function switchTab(clickedTab) {

//   apiErrorContainer.classList.remove("active");

//   if (clickedTab !== currentTab) {
//     currentTab.classList.remove("current-tab");
//     currentTab = clickedTab;
//     currentTab.classList.add("current-tab");

//     if (!searchForm.classList.contains("active")) {
//       userInfoContainer.classList.remove("active");
//       grantAccessContainer.classList.remove("active");
//       searchForm.classList.add("active");
//     } 
//     else {
//       searchForm.classList.remove("active");
//       userInfoContainer.classList.remove("active");
//       //getFromSessionStorage();
//     }

//     // console.log("Current Tab", currentTab);
//   }
// }
// // function that gets longitude and latitude of user/me using "geolocation" which gives exact locarion of user that is good for devices conatining gps like smartphones and geolocation first requests for permission for user's location
// function getLocation() {
//     // if our devise supports geoLocation
//     if(navigator.geolocation) {
//         navigator.geolocation.getCurrentPosition(showPosition);
//     }
//     else {
//         console.log("No geoLocation Support");
//     }
// }
// // function to show user's location
// function showPosition(position) {
//     let lat = position.coords.latitude;
//     let longi = position.coords.longitude;

//     console.log(lat);
//     console.log(longi);
// }