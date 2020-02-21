var earthquakeJson = "earthquake.json";

console.log(earthquakeJson)
// Get data and send to function
d3.json(earthquakeJson, function(data) {
    createFeatures(data.earthquakeData);
  });
  
  function createFeatures(earthquakeData) {
  
    // Define map layers
    var lightMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.light",
      accessToken: API_KEY
    });
  
    var darkMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetMap.org/\">OpenstreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.dark",
      accessToken: API_KEY
    });

  
  //Create cirle array
  // Initialize an array to hold murder markers
  var earthquakeMarkers = [];

    // Loop through the homcicides array
    for (var i = 0; i < earthquakeData.length; i++) {

        coordinates = [earthquakeData[i].lat, earthquakeData[i].lon];
        properties = earthquakeData[i].properties;
        type = earthquakeData[i].type;
        mag = earthquakeData[i].mag;
        place = earthquakeData[i].place;

        if (mag <.5) {
        color = 'yellowgreen';
        }
        else if (mag <1) {
        color = 'green'
        }
        else if (mag <1.5) {
        color = 'yellow'
        }
        else if (mag <2) {
        color = 'orange'
        }
        else if (mag <2.5) {
        color = 'red'
        }
        else {
        color = "darkred"
        }  

        var earthquakeMarker = L.circle(coordinates, {
            fillOpacity: 0.75,
            color: color,
            fillColor: color,
            radius: (mag * 10)
        }).bindPopup("<h3>" + title + "<h3><h3>This earthquake had a magnitude of  "
         + mag + " here!");
        // Add the marker to the murderMarkers array
        earthquakeMarkers.push(earthquakeMarker);
        console.log(earthquakeMarkers)
    }
    
    //Murder layer
    var earthquakeLayer= L.layerGroup(earthquakeMarkers);
    
    // Define a baseMaps object
    var baseMaps = {
      "Light Map": lightMap,
      "Dark Map": darkMap,
    };
  
    // Create overlay object to hold overlay layer
    var overlayMaps = {
      "Earthquakes": earthquakeLayer
    };
  
    var myMap = L.map("map", {
      center: [36.5323, -116.9325],
      zoom: 7,
      layers: [lightMap, earthquakeLayer]
    });
  
    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);


    // // Add legend to the map
    var legend = L.control({
        position: "bottomright"
      });
    
    
      legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");
    
        var earthquakes = [0, 5, 10, 15, 20, 25];

        var colors = [
          "yellowgreen",
          "green",
          "yellow",
          "orange",
          "red",
          "darkred"
        ];
    
    
        for (var i = 0; i < earthquakes.length; i++) {
          div.innerHTML += "<i style='background: " + colors[i] + "'></i> " +
            earthquakes[i] + (earthquakes[i + 1] ? "&ndash;" + earthquakes[i + 1] + "<br>" : "+");
        }
        return div;
      };
    
      legend.addTo(myMap);
  }