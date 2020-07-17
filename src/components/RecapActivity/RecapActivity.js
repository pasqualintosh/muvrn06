// componente che riassume le info sulla tratta precedente effettuata come punti, tipo se è stata validata , tempo,  testo

import React from "react";
import {
  View,
  Text,
  Dimensions,
  Image,
  TouchableWithoutFeedback,
  Platform,
  ImageBackground,
  TouchableOpacity
} from "react-native";

import { withNavigation } from "react-navigation";
import { BoxShadow } from "react-native-shadow";

import { timeAgo } from "../RecapTraining/RecapTraining";

import { strings } from "../../config/i18n";

// componente per visualizzare i punti che ho guadagnato in questo preciso momento

// props
// title titolo della notifica
// descr descrizione della notifica
// point punti ottenuti
// color colore della view
// click azione collegata all'icona della notifica

// color lo passa allo stile inline di view

class RecapActivity extends React.PureComponent {
  constructor() {
    super();

    state = {
      color: "#3d3d3d"
    };
  }

  getImagePath = label => {
    switch (label) {
      case "walk":
        return (
          <Image
            source={require("../../assets/images/walk_icn.png")}
            style={{ width: 60, height: 60 }}
          />
        );
      case "biking":
        return (
          <Image
            source={require("../../assets/images/bike_icn.png")}
            style={{ width: 60, height: 60 }}
          />
        );

      case "public":
      case "bus":
        return (
          <Image
            source={require("../../assets/images/bus_icn.png")}
            style={{ width: 60, height: 60 }}
          />
        );
      case "train":
        return (
          <Image
            source={require("../../assets/images/train_icn.png")}
            style={{ width: 60, height: 60 }}
          />
        );
      case "metro":
        return (
          <Image
            source={require("../../assets/images/metro_icn.png")}
            style={{ width: 60, height: 60 }}
          />
        );
      case "carpooling":
        return (
          <Image
            source={require("../../assets/images/carpooling_icn.png")}
            style={{ width: 100, height: 100 }}
          />
        );
      case "multiple":
        return (
          <Image
            source={require("../../assets/images/multitrack_icn.png")}
            style={{ width: 80, height: 80 }}
          />
        );
      default:
        return (
          <Image
            source={require("../../assets/images/walk_icn.png")}
            style={{ width: 60, height: 60 }}
          />
        );
    }
  };

  moveMapRecap = () => {
    const timeAgo = this.props.DataNow - this.props.Data;
    // minuti
    let time = timeAgo / 60000;
    let text = strings("mins");

    if (parseInt(time) !== 0) {
      // ore
      let timeNew = time / 60;
      if (parseInt(timeNew) !== 0) {
        time = timeNew;
        text = strings("hours");
        // giorni
        timeNew = time / 24;
        if (parseInt(timeNew) !== 0) {
          time = timeNew;
          text = strings("day");
          // mesi
          timeNew = time / 30;
          if (parseInt(timeNew) !== 0) {
            time = timeNew;
            text = strings("months");
          }
        }
      }
    }
    time = parseInt(time);

    let Data = {};
    if (this.props.fromDb) {
      DataTrip = {
        // route: this.props.route,
        referred_route_id: this.props.referred_route_id,
        referred_route: this.props.referred_route,
        activity: this.props.modal_type,
        modalType: this.props.modal_type,
        modalTypeArray: this.props.modal_type_array
          ? this.props.modal_type_array
          : null,
        timeTavelled: this.props.time_travelled,
        timeAgo: time,
        textAgo: text,
        totPoints: this.props.totPoints,
        validated: this.props.validated,
        distanceTravelled: this.props.distance_travelled,
        calories: this.props.calories,
        // firstLat: this.props.firstLat,
        // firstLon: this.props.firstLon,
        data: this.props.Data,
        fromDb: this.props.fromDb,
        color: this.getModalColor()
      };
    } else {
      PreviousRouteMultiple = this.props.id.map(
        value => this.props.AllRoute[value]
      );
      console.log(PreviousRouteMultiple);

      try {
        let emptyTrip = {
          calories: 0,
          coins: 0,

          totPoints: 0,
          time_travelled: 0,

          modal_type: [],
          route: [],
          routeAnalyzed: [],
          totDistance: 0,

          validated: false
        };
        PreviousRouteMultiple.forEach(elem => {
          emptyTrip.calories += elem.calories;
          emptyTrip.coins += elem.coins;

          emptyTrip.totDistance += Number.parseFloat(elem.totDistance);
          emptyTrip.totPoints += elem.totPoints;
          emptyTrip.time_travelled += elem.time_travelled;
          PreviousRouteMultiple.length !== 1
            ? emptyTrip.modal_type.push(elem.modal_type)
            : (emptyTrip.modal_type = elem.modal_type);

          emptyTrip.route.push(elem.route);
          emptyTrip.routeAnalyzed.push([...elem.routeAnalyzed, ...elem.route]);

          if (elem.validated) emptyTrip.validated = true;
        });

        const firstLat = emptyTrip.routeAnalyzed[0][0].latitude;
        const firstLon = emptyTrip.routeAnalyzed[0][0].longitude;

        console.log(emptyTrip);

        DataTrip = {
          route: emptyTrip.routeAnalyzed,
          activity: emptyTrip.modal_type,
          modalType: this.props.modal_type,
          modalTypeArray: emptyTrip.modal_type ? emptyTrip.modal_type : null,
          timeTavelled: emptyTrip.time_travelled / 1000,
          timeAgo: time,
          textAgo: text,
          totPoints: emptyTrip.totPoints,
          validated: emptyTrip.validated,
          distanceTravelled: Number.parseFloat(emptyTrip.totDistance).toFixed(
            2
          ),
          calories: emptyTrip.calories,
          firstLat: firstLat,
          firstLon: firstLon,
          data: this.props.Data,
          fromDb: this.props.fromDb,
          color: this.getModalColor()
        };
        console.log(DataTrip);
      } catch (error) {
        console.error(error);
      }
    }

    this.props.navigation.navigate("FeedRecapScreen", DataTrip);
  };

  //
  renderCircle(validated, color) {
    return <View style={[styles.circle, { borderColor: color }]} />;
  }

  getModalColor = () => {
    let color = "#B3B3B3";
    if (this.props.validated) {
      switch (this.props.modal_type) {
        case "Biking":
          {
            color = "#E83475";
          }
          break;
        case "Walking":
          {
            color = "#6CBA7E";
          }
          break;
        case "Public":
        case "Bus":
        case "Train":
        case "Metro":
          {
            color = "#FAB21E";
          }
          break;
        case "Multiple":
          {
            color = "#60368C";
          }
          break;
        default:
          {
            color = "#3d3d3d";
          }
          break;
      }
    }

    return color;
  };

  /**
   * per fare un doppio replace
   */
  getTripFeedContentFromString = (str, f_rplc_text, s_rplc_text) => {
    let first_perc = str.indexOf("%");
    let second_perc = str.indexOf("%", first_perc + 1);
    let third_perc = str.indexOf("%", second_perc + 1);
    let fourth_perc = str.indexOf("%", third_perc + 1);
    let first_part = str.substr(0, first_perc);
    let second_part = str.substr(second_perc + 1, third_perc - second_perc - 1);
    let third_part = str.substr(fourth_perc + 1, str.length);

    // console.log(first_part); // prima parte ok
    // console.log(second_part); // seconda parte ok
    // console.log(third_part); // terza parte ok

    return (
      <Text style={styles.textDescr}>
        {first_part}
        <Text style={styles.textDescrBold}>{f_rplc_text}</Text>
        {second_part}
        {s_rplc_text}
        {third_part}
      </Text>
    );
  };

  /**
   * per fare singolo replace
   */
  getFeedContentFromString = (str, rplc_text) => {
    let first_perc = str.indexOf("%");
    let last_perc = str.indexOf("%", first_perc + 1);
    let introduction = str.substr(0, first_perc);
    let ending = str.substr(last_perc + 1, str.lenght);

    return (
      <Text style={styles.textDescr}>
        {introduction}
        <Text style={styles.textDescrBold}>{rplc_text}</Text>
        {ending}
      </Text>
    );
  };

  descriptionFeed = () => {
    if (this.props.validated) {
      if (this.props.modal_type !== "Multiple") {
        return this.getFeedContentFromString(
          this.props.modal_type == "Walking"
            ? strings("_517_congrats__you_j")
            : this.props.modal_type == "Biking"
            ? strings("_518_congrats__you_j")
            : strings("_519_congrats__you_j"),
          this.props.totPoints.toFixed(0)
        );

        // return (
        //   <Text style={styles.textDescr}>
        //     {ex_strings.descrFeedMultiple}
        //     <Text style={styles.textDescrBold}>
        //       {this.props.totPoints.toFixed(0)}
        //     </Text>
        //     {ex_strings.descrFeedMultipleHalf}
        //     {this.props.modal_type.toLowerCase()}{" "}
        //     {ex_strings.descrFeedMultipleEnd}
        //   </Text>
        // );
      } else {
        return this.getFeedContentFromString(
          strings("this_looks_like"),
          this.props.totPoints.toFixed(0)
        );
      }
    } else {
      // se non è valida
      return <Text style={styles.textDescr}>{strings("something_got_w")}</Text>;
    }
  };

  descriptionTitle = () => {
    // se valida
    if (this.props.validated) {
      if (this.props.modal_type !== "Multiple") {
        return (
          <Text style={styles.textModalSplit}>
            {strings("trip_completed_")}
          </Text>
        );
      } else {
        return (
          <Text style={styles.textModalSplit}>
            {strings("multiple_trip_c")}
          </Text>
        );
      }
    } else {
      // se non è valida
      return (
        <Text style={styles.textModalSplit}>{strings("sorry__we_didn_")}</Text>
      );
    }
  };

  render() {
    // calcola la durata prendendo l'intervallo e convertendolo in ore:minuti:secondi
    /* 
    const durate = new Date(
      this.props.time_travelled
        ? this.props.time_travelled
        : this.props.time_travelled_second * 1000
    )
      .toISOString()
      .substr(11, 8); 
    */

    let shadowOpt;
    if (Platform.OS == "ios")
      shadowOpt = {
        width: Dimensions.get("window").width * 0.9,
        flex: 1,
        color: "#888",
        border: 1,
        radius: 5,
        opacity: 0.25,
        x: 0,
        y: 1,
        style: {
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
          alignSelf: "center"
        }
      };
    else
      shadowOpt = {
        width: Dimensions.get("window").width * 0.9,
        flex: 1,
        color: "#888",
        border: 0.5,
        radius: 5,
        opacity: 0.15,
        x: 0,
        y: 1,
        style: {
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
          alignSelf: "center"
        }
      };

    let label = timeAgo(this.props.DataNow, this.props.Data);

    return (
      <View >
      <TouchableOpacity style={styles.view} activeOpacity={0.7} onPress={this.moveMapRecap}>
        <View style={styles.viewStyle}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              width: Dimensions.get("window").width * 0.15,
              // height: 55
              // backgroundColor: "#ffa"
              // borderLeftColor: "#9D9B9C80",
              // borderLeftWidth: 1.5
            }}
          >
            {this.getImagePath(this.props.modal_type.toLowerCase())}
          </View>
          <View
            style={{
              width: Dimensions.get("window").width * 0.55,
              flexDirection: "column",
              justifyContent: "space-between"
            }}
          >
            <Text style={styles.textTitle}>
              {this.descriptionTitle()}
              {label}
            </Text>
            {this.descriptionFeed()}
          </View>
          {this.props.validated ? (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                width: Dimensions.get("window").width * 0.05,
                // height: 85
                // borderLeftColor: "#9D9B9C80",
                // borderLeftWidth: 1.5
              }}
            >
              {/* 
                <Text style={styles.textPoints}>
                  {this.props.totPoints.toFixed(0)}
                </Text>
                <Text style={styles.pt}>pt</Text> 
              */}
              {this.renderCircle(this.props.validated, this.getModalColor())}
            </View>
          ) : (
            <View
              style={{
                width: Dimensions.get("window").width * 0.05

                // borderLeftColor: "#9D9B9C80",
                // borderLeftWidth: 1.5
              }}
            >
              {/* 
                <Text style={styles.textPoints}>
                  {this.props.totPoints.toFixed(0)}
                </Text>
                <Text style={styles.pt}>pt</Text> 
              */}
              {this.getEndImagePathNotValid()}
            </View>
          )}
        </View>
      </TouchableOpacity>
      </View>
    );
  }

  getEndImagePathNotValid = () => {
    return (
      <ImageBackground
        style={{ width: "100%", height: "100%" }}
        source={require("../../assets/images/attention_icn.png")}
      />
    );
  };
}

const styles = {
  view: {
    width: Dimensions.get("window").width * 0.9,
    flex: 1,
    elevation: 3,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    alignSelf: "center",
    borderWidth: 1,
    borderColor: "#B2B2B220",
    borderRadius: 5,
    backgroundColor: "#fff",
    shadowRadius: 2,
    shadowColor: "#B2B2B2",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    marginBottom: 20,
   
  },
  viewStyle: {
    width: Dimensions.get("window").width * 0.9,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    alignSelf: "center",
    
  },
  margin: {
    borderColor: 'transparent'
  },
  textTitle: {
    fontSize: 11,
    fontFamily: "OpenSans-Regular",
    marginVertical: 6,
    marginTop: 15
  },
  textPoints: {
    fontSize: 30,
    fontFamily: "OpenSans-Regular",
    fontWeight: "bold"
  },
  textDescr: {
    fontSize: 11,
    fontFamily: "OpenSans-Regular",
    marginVertical: 6,
    marginBottom: 15
  },
  textDescrBold: {
    fontSize: 11,
    fontFamily: "OpenSans-Regular",
    marginVertical: 6,
    fontWeight: "bold"
  },
  textModalSplit: {
    fontSize: 11,
    fontFamily: "OpenSans-Regular",
    marginVertical: 6,
    fontWeight: "bold"
  },
  points: {
    fontSize: 20,
    color: "white",
    fontFamily: "OpenSans-Regular"
  },
  pt: {
    fontSize: 10,
    marginTop: 5,
    fontFamily: "OpenSans-Regular"
  },
  circle: {
    // width:  18,
    // height:  18,
    // borderRadius: 9,
    // // justifyContent: "center",
    // // alignItems: "center",
    // // alignSelf: "center",
    // borderWidth: 4
    width: Dimensions.get("window").width / 50 + 10,
    height: Dimensions.get("window").width / 50 + 10,
    borderRadius: Dimensions.get("window").width / 50 + 10,
    borderWidth: 5
  }
};

export default withNavigation(RecapActivity);
