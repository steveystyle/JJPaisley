exports.initMap = function() {
    //logic gate for geolocation
    if ("geolocation" in navigator) {

        var watchId = navigator.geolocation.watchPosition(function (position) {
            document.getElementById('currentLat').innerHTML = position.coords.latitude;
            document.getElementById('currentLon').innerHTML = position.coords.longitude;
          });

          
        //setting current position options
        let options = {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 150000
        };
        //getting current position
        navigator.geolocation.getCurrentPosition(
            //if successful starts a function to pass coordinates to google map direction service
            function success(position) {
                //creating new map renderer and direction service
                var directionsService = new google.maps.DirectionsService();
                var directionsRenderer = new google.maps.DirectionsRenderer();
                //sets coordinates of resturant
                var jjLatLng = { lat: 55.8430878, lng: -4.4255639 }

                //look at custom map options in google map api to add more style to map

                var mapOptions = {
                    disableDefaultUI: true
                }
                //assigns map to div in map tempatlate with id map
                var map = new google.maps.Map(document.getElementById('map'), mapOptions);
                //binds new map to renderer
                directionsRenderer.setMap(map);
                //calls function to draw route on new map base on user location 
                calcRoute(directionsService, directionsRenderer, position.coords.latitude, position.coords.longitude, jjLatLng);
            },
            //if there is an error calls function to delete map div and create a default embedded map
            function error(error_message) {
                console.error('An error has occured while retrieving location', error_message)
                createIframe();
            }, options
        );
        //if no geolocation support in browser calls function to delete map div and create a default embedded map
    } else {
        console.log('geolocation is not enabled on this browser')
        createIframe();
    }
};
//route calculation function
function calcRoute(directionsService, directionsRenderer, userLat, userLng, destLatLng) {
    //set directions parameters 
    var request = {
        origin: { lat: userLat, lng: userLng },
        destination: destLatLng,
        travelMode: 'DRIVING'
    };
    //attemps to formulate route and if successful renderer draws it on map
    directionsService.route(request, function (result, status) {
        if (status == 'OK') {
            directionsRenderer.setDirections(result);
        }
    });
}
//function to delete unused map div on error and creates an embeded iframe with map and resturant marker
exports.createIframe = function(){
    document.getElementById('dirMapContain').removeChild(document.getElementById('map'));
    var iframe = document.createElement("iframe");
    iframe.width = "100%";
    iframe.height = "100%";
    iframe.src = "https://www.google.com/maps/embed/v1/place?key=AIzaSyAKgHc8KWCR-KLDCjZKQwnG_Z5TjxWmwIw&q=Jam+Jar+Paisley,Shuttle+Street,Paisley,UK";
    iframe.style = "border:0;";
    iframe.loading = "lazy";
    iframe.referrerpolicy = "no-referrer-when-downgrade";
    document.getElementById('dirMapContain').appendChild(iframe);
}