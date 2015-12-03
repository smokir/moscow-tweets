(function (vm) {

    vm.Map = function (options) {
        this.selector = options.selector;

        var mapStylesOptions = [
            {
                "featureType": "water",
                "elementType": "geometry.fill",
                "stylers": [{ "color": "#d3d3d3" }]
            },
            {
                "featureType": "transit",
                "stylers": [{ "color": "#808080" }, { "visibility": "off" }]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry.stroke",
                "stylers": [{ "visibility": "on" }, { "color": "#b3b3b3" }]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry.fill",
                "stylers": [{ "color": "#ffffff" }]
            },
            {
                "featureType": "road.local",
                "elementType": "geometry.fill",
                "stylers": [{ "visibility": "on" }, { "color": "#ffffff" }, { "weight": 1.8 }]
            },
            {
                "featureType": "road.local",
                "elementType": "geometry.stroke",
                "stylers": [{ "color": "#d7d7d7" }]
            },
            {
                "featureType": "poi",
                "elementType": "geometry.fill",
                "stylers": [{ "visibility": "on" }, { "color": "#ebebeb" }]
            },
            {
                "featureType": "administrative",
                "elementType": "geometry",
                "stylers": [{ "color": "#a7a7a7" }]
            },
            {
                "featureType": "road.arterial",
                "elementType": "geometry.fill",
                "stylers": [{ "color": "#ffffff" }]
            },
            {
                "featureType": "road.arterial",
                "elementType": "geometry.fill",
                "stylers": [{ "color": "#ffffff" }]
            },
            {
                "featureType": "landscape",
                "elementType": "geometry.fill",
                "stylers": [{ "visibility": "on" }, { "color": "#efefef" }]
            },
            {
                "featureType": "road",
                "elementType": "labels.text.fill",
                "stylers": [{ "color": "#696969" }
                ]
            },
            {
                "featureType": "administrative",
                "elementType": "labels.text.fill",
                "stylers": [{ "visibility": "on" }, { "color": "#737373" }]
            },
            {
                "featureType": "poi",
                "elementType": "labels.icon",
                "stylers": [{ "visibility": "off" }]
            },
            {
                "featureType": "poi",
                "elementType": "labels",
                "stylers": [{ "visibility": "off" }]
            },
            {
                "featureType": "road.arterial",
                "elementType": "geometry.stroke",
                "stylers": [{ "color": "#d6d6d6" }]
            },
            {
                "featureType": "road",
                "elementType": "labels.icon",
                "stylers": [{ "visibility": "off" }]
            },
            {},
            {
                "featureType": "poi",
                "elementType": "geometry.fill",
                "stylers": [{ "color": "#dadada" }]
            }
        ]

        var mapCenter = new google.maps.LatLng(55.7, 37.65);

        var mapOptions = {
            zoom: 10,
            minZoom: 8,
            center: mapCenter,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            zoomControl: true,
            zoomControlOptions: {
                style: google.maps.ZoomControlStyle.SMALL
            },
            mapTypeControl: false,
            scaleControl: false,
            streetViewControl: false,
            draggable: true,
            styles: mapStylesOptions
        }

        this.mapBlock = document.querySelector(this.selector.mapBlock);
        this.map = new google.maps.Map(this.mapBlock, mapOptions);
    };

})(window.app.vm);
