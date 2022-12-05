// this is the base url of ipify
const baseUrl =
  "https://geo.ipify.org/api/v2/country?apiKey=at_ITQLdztEHRd2PCgVssP0VrNel2f15";

// the function that will fetch the ipAddress and return all the data in an object
const fetchIpAddress = async (ipAdderss = "") => {
  const response = await fetch(`${baseUrl}&ipAddress=${ipAdderss}`);
  if (!response.ok) {
    throw new Error("Not Valid IP Address");
  }
  const data = await response.json();
  return data;
};

// the function that will get the longitude and latitude of a specific country and city
const getLocationByCountryAndCity = async (country, city) => {
  const response = await fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${country},${city}.json?proximity=-74.70850,40.78375&access_token=pk.eyJ1IjoibW9hdGhlbG1hcm1vcmkiLCJhIjoiY2wzMDA1cWJyMDhnODNkcHNvdDViM2Q3cyJ9._K-EYN_vO_TaDPiepCFxyA`
  );
  const data = await response.json();
  return data.features[0].center;
};

// function that will set the status text
const setStatusText = async (dataObject) => {
  const {
    ip,
    location: { timezone, country, region },
    isp,
  } = dataObject;
  // setting the inner text of the status container's elements
  ipText.innerText = `${ip}`;
  loactionText.innerText = `${country} - ${region}`;
  timezoneText.innerText = `${timezone}`;
  ispText.innerText = `${isp}`;
};

// the function that will set the initial centered map by calling the [fetchIpAddress, getLocationByCountryAndCity]
const setInitialMapCenter = async () => {
  const responseObject = await fetchIpAddress();
  setStatusText(responseObject);
  const {
    location: { country, region },
  } = responseObject;
  const langAndLad = await getLocationByCountryAndCity(country, region);
  map.setCenter(langAndLad);
  marker.setLngLat(langAndLad);
};
// calling it initially
setInitialMapCenter();

// selecting the working with element
const theForm = document.getElementById("the-form");
const ipInput = document.getElementById("ip-input");
const ipText = document.getElementById("ip-text");
const loactionText = document.getElementById("location-text");
const timezoneText = document.getElementById("timezone-text");
const ispText = document.getElementById("isp-text");

// handling the form submition
theForm.addEventListener("submit", async function (e) {
  e.preventDefault();
  let responseObject;
  // this block will run if the response from calling
  try {
    // the object we will get if the response returned the data
    responseObject = await fetchIpAddress(ipInput.value);
    // setting the status text
    setStatusText(responseObject);
    // destructring the country and region 
    const {location: {country, region}} = responseObject;
    // reseting the input value
    ipInput.value = "";
    // reseting the placholder of the input
    ipInput.placeholder = "Search for an IP Address";
    // setting new longitude and latitude
    const newLongAndLat = await getLocationByCountryAndCity(country, region);
    // setting the center of the map by the new longitude and latitude
    map.setCenter(newLongAndLat);
    // setting the marker of the map by the new longitude and latitude
    marker.setLngLat(newLongAndLat);
    // in case of (response is not ok)
  } catch (e) {
    ipInput.value = "";
    ipInput.placeholder = e.message;
    responseObject = e.message;
  }
});

// the map initialization
mapboxgl.accessToken =
  "pk.eyJ1IjoibW9hdGhlbG1hcm1vcmkiLCJhIjoiY2wzMDA1cWJyMDhnODNkcHNvdDViM2Q3cyJ9._K-EYN_vO_TaDPiepCFxyA";
const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/streets-v11", // style URL
  center: [-74.5, 40], // starting position [lng, lat]
  zoom: 9, // starting zoom
});

// Create a new marker.
const marker = new mapboxgl.Marker().setLngLat([-74.5, 40]).addTo(map);
mapboxgl.baseApiUrl = "https://api.mapbox.com";
