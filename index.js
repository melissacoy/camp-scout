/* ----- LANDING PAGE -----*/
'use strict'
let geoKey = (config.GEO_KEY);
let hikeKey = (config.HIKE_KEY);
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
fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=${geoKey}`)
    .then(response => response.json())
    .then(responseJson =>{
     if(responseJson.status !=='OK'){
        throw new Error(responseJson.statusText);
     } else {
        const lat = (responseJson.results[0].geometry.location.lat);
        const lng = (responseJson.results[0].geometry.location.lng);
        getCamps(lat, lng);
     };
    })
    .catch(Error => {
    $('form').append(`<h2 class="error">Please review the instructions and submit a valid address.</h2>`)
    });
 }
//insert lat/long into CAMPGROUND api url default 50mile radius
function getCamps(lat, lng){
    fetch(`https://www.hikingproject.com/data/get-campgrounds?lat=${lat}&lon=${lng}&maxDistance=30&key=${hikeKey}`)
    .then(response => {
        if(response.ok){
            return response.json();
        }
        throw new Error(response.statusText);
    })
    .then(responseJson => {
        displayCamps(responseJson);
    })
    .catch(Error => {
        $('form').append(`<h2 class="error">Something went wrong getting your campgrounds.</h2>`)
    });
}
//display CAMPGROUND search results        
function displayCamps(responseJson){
    $('p').addClass('hidden');
    let campArray = (responseJson.campgrounds);
    if (responseJson.campgrounds.length === 0) {
        $('form').append(`<h2 class='error'>We couldn't find any campgrounds in that area. Try 
        Searching in a different location.</h2>`);
    }
    else { 
        $('#results').removeClass('hidden')
        for (let i = 0; i < responseJson.campgrounds.length; i++){
        $(`#results`).append(`<div class='park-box' id='camp-container-${i}'><h3 class="js-park-name" id='park-${i}'>${responseJson.campgrounds[i].name}</h3>
        <a href="${responseJson.campgrounds[i].url}" target="_blank">Camp Website</a>
        <button type="submit" class="js-details trl-btn js-trails" id='get-trl-btn-${i}'>Get Trails</button>
        </div>`);
    };
};
   return getCampNameOnClick();
};         
//listen for Get Trails selection
function getCampNameOnClick(){
    $('.js-trails').on('click', function(){
        let campName = $(this).siblings('.js-park-name').text();
        let campId = $(this).closest('.park-box').attr('id');
        getCampLatLng(campName, campId);
    });
}
//get the lat and lng for the clicked camp
function getCampLatLng(campName, campId){
fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${campName}&key=${geoKey}`)
    .then(response => response.json())
    .then(responseJson =>{
     if(responseJson.status !=='OK'){
        throw new Error(responseJson.statusText);
     } else {
        const campLat = (responseJson.results[0].geometry.location.lat);
        const campLng = (responseJson.results[0].geometry.location.lng);
        getTrails(campLat, campLng, campId);
     };
    })
    .catch(Error => {
    $('form').append(`<h2 class="error">There was a problem finding your trails.</h2>`)
    });
}
//listen for campground GETTRAILS selection
function getTrails(campLat, campLng, campId){
    fetch(`https://www.hikingproject.com/data/get-trails?lat=${campLat}&lon=${campLng}&maxDistance=20&key=200636231-2cd9c0c730ff93b084c384abe865ca3c`)
    .then(response => {
        if(response.ok){
            return response.json();
        }
        throw Error(response.statusText);
    })
    .then(responseJson => {
        $('#'+ campId).append(`<ul class='js-trail-list'id='js-trail-ul'></ul>`);
        return displayTrails(responseJson);
    })
    .catch(Error => {
        $('p').html(`Something went wrong getting your trails.`)
    })
};
//render trail details (name, length, rating)
function displayTrails(responseJson){
    for (let i = 0; i < responseJson.trails.length; i++){
        $('#js-trail-ul').append(`<li class="trail-box"><h3 class="js-trail-name">${responseJson.trails[i].name}</h3>
        <p class="js-trail-summary">${responseJson.trails[i].summary}</p>
        <p class="js-trail-location">Location: ${responseJson.trails[i].location}</p>
        <p class="js-trail-length">Distance: ${responseJson.trails[i].length} miles</p>
        <p class="js-trail-difficulty">Difficulty: ${responseJson.trails[i].difficulty}</p>
        <p class="js-trail-stars">Rating: ${responseJson.trails[i].stars} stars</p>
        </li>`);
    };
}       
//clear values for new search
function clearValues(){
    $('#results').html('');
    $('.error').remove('');
}
$(onSubmit);