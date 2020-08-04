import React from "react";
import { View, Text, Button, Dimensions } from "react-native";
import MapView from "react-native-maps";
import { styles } from "./Style";

import InteractionManager from "../../helpers/loadingComponent";

// aggiungere l'attributo cacheEnabled per renderla definitiva, ovvero non si puo cambiare zoom o posizione, diventa un immagine
class MapFeedRecapScreen extends React.Component {
  constructor(props) {
    super(props);

    this.mapRef = null;
    this.state = {
      load: false,
    };
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        load: true,
      });
    });
  }

  componentWillUnmount() {
    this.setState({
      load: false,
    });
  }

  getActivityColor = (activity) => {
    let color;

    switch (activity) {
      case 2:
      case "Biking":
        {
          color = "#E83475";
        }
        break;
      case 1:
      case "Walking":
        {
          color = "#6CBA7E";
        }
        break;
      case 3:
      case 4:
      case 5:
      case "Public":
      case "Bus":
      case "Train":
      case "Metro":
        {
          // (5, ‘Train’)
          // (6, ‘Metro’)
          // (7, ‘Bus_Tram’)
          color = "#F9B224";
        }
        break;
        case 6:
      case 7:
      case "Carpooling":
      case "Car":
        {
          color = "#3363AD";
        }
        break;
      default:
        {
          color = "rgba(108, 186, 126, 1)";
        }
        break;
    }

    return color;
  };

  renderMultiPolyline = (route, modalTypeArray, fromDb) => {
    let coordinates = [];
    let modalTypes = modalTypeArray;

    if (fromDb) {
      route.forEach((el, index) => {
        let latitude = el.map((element) => element[1]);
        let longitude = el.map((element) => element[0]);
        coordinates.push(
          latitude.map((elem, index) => {
            return {
              latitude: elem,
              longitude: longitude[index],
            };
          })
        );
      });

      /* let linee;
      for (index = coordinates.length - 1; index => 0; index--) {
        linee += (
          <MapView.Polyline
            key={index}
            coordinates={coordinates[index]}
            strokeColor={this.getActivityColor(modalTypes[index])}
            strokeWidth={3}
          />
        );
      }

      return linee; */

      return route.map((item, index) => (
        <MapView.Polyline
          key={index}
          coordinates={coordinates[index]}
          strokeColor={this.getActivityColor(
            modalTypes[route.length - index - 1]
          )}
          strokeWidth={3}
        />
      ));
    } else {
      // se è offline
      console.log(route);
      console.log(modalTypeArray);
      console.log(fromDb);

      return route.map((item, index) => (
        <MapView.Polyline
          key={index}
          coordinates={route[index]}
          strokeColor={this.getActivityColor(
            modalTypes[route.length - index - 1]
          )}
          strokeWidth={3}
        />
      ));
    }
  };

  flatten = (a, shallow, r) => {
    if (!r) {
      r = [];
    }

    if (shallow) {
      return r.concat.apply(r, a);
    }

    for (var i = 0; i < a.length; i++) {
      if (a[i].constructor == Array) {
        this.flatten(a[i], shallow, r);
      } else {
        r.push(a[i]);
      }
    }
    return r;
  };

  render() {
    const { navigation } = this.props;
    const routeGet = navigation.getParam("route", []);
    const fromDb = navigation.getParam("fromDb", []);
    const activity = navigation.getParam("activity", "Walking");
    const modalTypeArrayGet = navigation.getParam("modalTypeArray", []);
    const route = routeGet;
    const modalTypeArray = modalTypeArrayGet;

    let firstTripLatitude,
      firstTripLongitude,
      lastTripLatitude,
      lastTripLongitude;

    let latitude, longitude;

    if (fromDb) {
      /* firstTripLatitude = route[route.length - 1].map(
        element => element[1]
      );
      firstTripLongitude = route[route.length - 1].map(
        element => element[0]
      );
      console.log(route)

      lastTripLatitude = route[0].map(element => element[1]);
      lastTripLongitude = route[0].map(element => element[0]); */
      console.log(route);

      latitude = route.map((element) => element.map((elem) => elem[1]));
      longitude = route.map((element) => element.map((elem) => elem[0]));
      latitude = this.flatten(latitude);
      longitude = this.flatten(longitude);
    } else {
      latitude = route.map((element) => element.map((elem) => elem.latitude));
      longitude = route.map((element) => element.map((elem) => elem.longitude));
      latitude = this.flatten(latitude);
      longitude = this.flatten(longitude);
    }

    /*  let MinLatitude = Math.min.apply(null, firstTripLatitude);
    let MinLongitude = Math.min.apply(null, firstTripLongitude);
    let MaxLatitude = Math.max.apply(null, lastTripLatitude);
    let MaxLongitude = Math.max.apply(null, lastTripLongitude);
 */

    let MaxLatitude = Math.max.apply(null, latitude);
    let MaxLongitude = Math.max.apply(null, longitude);
    let MinLatitude = Math.min.apply(null, latitude);
    let MinLongitude = Math.min.apply(null, longitude);
    // se per caso alla fine ho un unica posizione gps ovvero
    const OnlyOne = MaxLatitude == MinLatitude && MaxLongitude == MinLongitude;
    if (OnlyOne) {
      // vario un po le coordinate cosi do un po di spazio per visualizzare la mia posizione al centro
      MinLatitude -= 0.005;
      MinLongitude -= 0.005;
      MaxLatitude += 0.005;
      MaxLongitude += 0.005;
    }

    // li uso per settare fitToCoordinates
    if (this.state.load)
      return (
        <MapView
          ref={(ref) => {
            this.mapRef = ref;
          }}
          style={styles.map}
          onMapReady={() =>
            this.mapRef.fitToCoordinates(
              [
                {
                  latitude: MinLatitude - 0.0005,
                  longitude: MinLongitude - 0.0005,
                },
                {
                  latitude: MaxLatitude + 0.0005,
                  longitude: MaxLongitude + 0.0005,
                },
              ],
              {
                edgePadding: { top: 40, right: 20, bottom: 80, left: 20 },
                animated: false,
              }
            )
          }
          loadingEnabled={true}
          zoomEnabled={true}
        >
          {this.renderMultiPolyline(route, modalTypeArray, fromDb)}

          <MapView.Marker
            coordinate={{ latitude: latitude[0], longitude: longitude[0] }}
            image={require("./../../assets/images/map_pin_start.png")}
            anchor={{ x: 0.5, y: 0.5 }}
          />
          {!OnlyOne ? (
            <MapView.Marker
              image={require("./../../assets/images/map_pin_end.png")}
              coordinate={{
                latitude: latitude[latitude.length - 1],
                longitude: longitude[longitude.length - 1],
              }}
              anchor={{ x: 0.5, y: 0.5 }}
            />
          ) : (
            <View />
          )}
        </MapView>
      );
    else {
      return <View />;
    }
  }
}

export default MapFeedRecapScreen;
