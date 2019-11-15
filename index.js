/* ----- LANDING PAGE -----*/
'use strict'
//listen for user address submit
function onSubmit(){
    $('.js-search').click(event => {
        event.preventDefault();
        clearValues();
        const location = $('.js-address-search').val();
        emptySubmitErrMsg(location);    
        getLatLong(location);
    });
}
//empty submission error message display
function emptySubmitErrMsg(){
    if(location === '') {
        alert('Please enter a valid address.');
    }
}
//get lat/long of user address submit from GEOCODE
function getLatLong(location){
fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=AIzaSyARRomQEmDY_dVU6GdCuP_1K2rfyVSjs7I
`)
    .then(response => response.json())
    .then(responseJson =>{
     console.log(responseJson);
     if(responseJson.status !=='OK'){
        throw new Error(responseJson.statusText);
     } else {
        const lat = (responseJson.results[0].geometry.location.lat);
        const lng = (responseJson.results[0].geometry.location.lng);
        console.log(lat);
        console.log(lng);
        getCamps(lat, lng);
     };
    })
    .catch(Error => {
    $('form').append(`<h2 class="error">Please review the instructions and submit a valid address.</h2>`)
    });
 }
//insert lat/long into CAMPGROUND api url default 50mile radius
function getCamps(lat, lng){
    fetch(`https://www.hikingproject.com/data/get-campgrounds?lat=${lat}&lon=${lng}&maxDistance=30&key=200633003-a5fff20872e4b167772002afa37f3068`)
    .then(response => {
        if(response.ok){
            return response.json();
        }
        throw new Error(response.statusText);
    })
    .then(responseJson => {
        console.log(responseJson)
        displayCamps(responseJson)
        getTrails(lat,lng);
    })
    .catch(Error => {
        $('form').append(`<h2 class="error">Something went wrong getting your campsites.</h2>`)
    });
}
//display CAMPGROUND search results        
function displayCamps(responseJson){
    $('ul').eq(0).removeClass('hidden')
    for (let i = 0; i < responseJson.campgrounds.length; i++){
        $(`.js-park-list`).append(`<li><h3 class="js-park-name">${responseJson.campgrounds[i].name}</h3>
        <button type="submit" class="js-details js-trails">Get Trails</button>
        <a href="${responseJson.campgrounds[i].url}" target="_blank">Camp Website</a>
        </li>`);
    };
}         
//listen for campground GETTRAILS selection
function getTrails(lat, lng){
$('.js-trails').click(event => {
    event.preventDefault();
    fetch(`https://www.hikingproject.com/data/get-trails?lat=${lat}&lon=${lng}&maxDistance=20&key=200636231-2cd9c0c730ff93b084c384abe865ca3c`)
    .then(response => {
        if(response.ok){
            return response.json();
        }
        throw Error(response.statusText);
    })
    .then(responseJson => {
        console.log(responseJson)
       return displayTrails(responseJson);
    })
    .catch(Error => {
        $('p').html(`Something went wrong getting your trails.`)
    });
});
}
//render trail details (name, length, rating)
function displayTrails(responseJson){
    for (let i = 0; i < responseJson.trails.length; i++){
        $('ul').eq(1).removeClass('hidden')
        $(`.js-trail-list`).append(`<li><h3 class="js-trail-name">${responseJson.trails[i].name}</h3>
        <p class="js-trail-length">${responseJson.trails[i].length}</p>
        <p class="js-trail-difficulty">${responseJson.trails[i].difficulty}</p>
        <p class="js-trail-stars">${responseJson.trails[i].stars}</p>
        </li>`);
    };
}       
//render campground detail description and links upon selection







//clear values for another search
function clearValues(){
    $('.js-results').html('');
    $('.error').html('');
}
$(onSubmit);