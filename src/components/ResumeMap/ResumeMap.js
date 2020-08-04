import React from "react";
import { View, Text, Button, Dimensions } from "react-native";
import MapView from "react-native-maps";
import { styles } from "./Style";
import InteractionManager from "../../helpers/loadingComponent";

// aggiungere l'attributo cacheEnabled per renderla definitiva, ovvero non si puo cambiare zoom o posizione, diventa un immagine
class ResumeMap extends React.Component {
  constructor(props) {
    super(props);

    this.mapRef = null;
    this.state = {
      load: false,
      MaxLatitude: 0,
      MaxLongitude: 0,
      MinLatitude: 0,
      MinLongitude: 0
    };
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        load: true
      });
    });
  }

  componentWillUnmount() {
    this.setState({
      load: false
    });
  }

  PolyLinePrevious = props => {
    // calcolo la base per la linee precedenti e distanza massima e minima

    const { LastrouteAnalyzed, Lastroute, NumSegment, activity } = props;

    if (NumSegment) {
      let latitude;

      let longitude;

      console.log(NumSegment);
      for (i = 1; i <= NumSegment; i++) {
        const latitudeNew = [
          ...LastrouteAnalyzed[i].route,
          ...Lastroute[i].route
        ].map(element => element.latitude);

        console.log(latitudeNew);
        let longitudeNew = [
          ...LastrouteAnalyzed[i].route,
          ...Lastroute[i].route
        ].map(element => element.longitude);
        console.log(longitudeNew);

        if (i === 1) {
          latitude = latitudeNew;
          longitude = longitudeNew;
        } else {
          latitude = [...latitude, ...latitudeNew];
          longitude = [...longitude, ...longitudeNew];
        }
      }
      console.log(this.props);
      console.log(latitude);
      console.log(longitude);

      let MaxLatitude = Math.max.apply(null, latitude);
      let MaxLongitude = Math.max.apply(null, longitude);
      let MinLatitude = Math.min.apply(null, latitude);
      let MinLongitude = Math.min.apply(null, longitude);

      this.setState({
        MaxLatitude,
        MaxLongitude,
        MinLatitude,
        MinLongitude
      });
    }
  };

  Polyline = (LastrouteAnalyzed, Lastroute, NumSegment, activity) => {
    const listItems = LastrouteAnalyzed.map((elem, index) => {
      let color;
      let color1;
      switch (activity[index].activityChoice) {
        case "Biking":
          {
            color = "#E83475";
            color1 = "#FC6EA1";
          }
          break;
        case "Walking":
          {
            color = "#6CBA7E";
            color1 = "#43C160";
          }
          break;
        case "Public":
          {
            color = "#F9B224";
            color1 = "#FFCC00";
          }
          break;
          case "Carpooling":
          {
            color = "#3363AD";
            color1 = "#3363AD";
           
          }
          break
          case "Car":
          {
            color = "#3363AD";
            color1 = "#3363AD";
           
          }
          break
        default:
          {
            color = "rgba(108, 186, 126, 1)";
            color1 = "rgba(108, 186, 126, 1)";
          }
          break;
      }

      return (
        <MapView.Polyline
          key={index}
          coordinates={[
            ...LastrouteAnalyzed[index].route,
            ...Lastroute[index].route
          ].filter(item => item.latitude != "START")}
          strokeColor={color}
          strokeWidth={3}
        />
      );
    });
    return listItems;
  };

  componentWillMount() {
    this.PolyLinePrevious(this.props);
  }
  componentWillReceiveProps(props) {
    const { NumSegment } = props;
    if (this.props.NumSegment != NumSegment) {
      // this.animation.play();
      // this.props.navigation.goBack();

      // se cambio mezzo, ricalcolo tutte le informazioni
      this.PolyLinePrevious(props);
    }
  }

  render() {
    // prendo tutte le latitudini e longitudini, le uso per torvare i massimi e i minimi
    // cosi la mappa e la tratta la visualizzo completamente sapendo massimo e minimo
    /* const latitude = this.props.trackingState.map(element => element.latitude);
    const longitude = this.props.trackingState.map(
      element => element.longitude
    ); */

    const { LastrouteAnalyzed, Lastroute, NumSegment, activity } = this.props;

    const allStartRoute = [
      ...LastrouteAnalyzed[0].route,
      ...Lastroute[0].route
    ];

    let latitude = allStartRoute.map(element => element.latitude);

    let longitude = allStartRoute.map(element => element.longitude);

    console.log(NumSegment);
    if (NumSegment) {
      latitude = [...latitude, this.state.MaxLatitude, this.state.MinLatitude];
      longitude = [
        ...longitude,
        this.state.MaxLongitude,
        this.state.MinLongitude
      ];
    }
    console.log(this.props);
    console.log(latitude);
    console.log(longitude);

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
    // adatto la mappa alle dimensioni massime e minimi solo dopo aver caricato la mappa per funzionare correttamente
    // onMapReady
    if (this.state.load)
      return (
        <MapView
          ref={ref => {
            this.mapRef = ref;
          }}
          style={styles.map}
          onMapReady={() => {
            this.mapRef.fitToCoordinates(
              [
                {
                  latitude: MinLatitude - 0.0005,
                  longitude: MinLongitude - 0.0005,
                  title: "Min",
                  key: 1
                },
                {
                  latitude: MaxLatitude + 0.0005,
                  longitude: MaxLongitude + 0.0005,
                  title: "Max",
                  key: 2
                }
              ],
              {
                edgePadding: { top: 40, right: 20, bottom: 120, left: 20 },
                animated: false
              }
            );
          }}
          loadingEnabled
        >
          {this.Polyline(LastrouteAnalyzed, Lastroute, NumSegment, activity)}

          <MapView.Marker
            coordinate={
              Lastroute
                ? LastrouteAnalyzed[0].route.length
                  ? LastrouteAnalyzed[0].route[0]
                  : Lastroute[0].route[0]
                : {
                    latitude: 32.0,
                    longitude: 32.0
                  }
            }
          />
          {!OnlyOne ? (
            <MapView.Marker
              coordinate={
                Lastroute[NumSegment]
                  ? Lastroute[NumSegment].route.length
                    ? Lastroute[NumSegment].route[
                        Lastroute[NumSegment].route.length - 1
                      ]
                    : LastrouteAnalyzed[NumSegment]
                    ? LastrouteAnalyzed[NumSegment].route.length
                      ? LastrouteAnalyzed[NumSegment].route[
                          LastrouteAnalyzed[NumSegment].route.length - 1
                        ]
                      : {
                          latitude: 32.0,
                          longitude: 32.0
                        }
                    : {
                        latitude: 32.0,
                        longitude: 32.0
                      }
                  : {
                      latitude: 32.0,
                      longitude: 32.0
                    }
              }
              image={require("./../../assets/images/Map_pin_2.png")}
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

export default ResumeMap;

// versione vecchia non funzionante
{
  /* <MapView
        ref={ref => {
          this.mapRef = ref;
        }}
        minZoomLevel={13}
        rotateEnabled={false}
        style={styles.map}
        onLayout={() =>
          this.mapRef.fitToCoordinates(
            [
              {
                latitude: this.props.trackingState[0].latitude,
                longitude: this.props.trackingState[0].longitude
              },

              {
                latitude: this.props.trackingState[
                  this.props.trackingState.length - 1
                ].latitude,
                longitude: this.props.trackingState[
                  this.props.trackingState.length - 1
                ].longitude
              }
            ],
            {
              edgePadding: { top: 20, right: 20, bottom: 20, left: 20 },
              animated: false
            }
          )
        }
        loadingEnabled
      >
        <MapView.Polyline
          coordinates={this.props.trackingState.filter(
            item => item.latitude != "START"
          )}
          strokeColor="#6FB981"
          strokeWidth={3}
        />
        {/* <MapView.Marker coordinate={this.props.trackingState[1]} /> */
}
{
  /* <MapView.Marker
          coordinate={
            this.props.trackingState[this.props.trackingState.length - 1]
          }
        />r }
      </MapView> */
}
