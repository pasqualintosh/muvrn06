import React from "react";
import {
  View,
  Text,
  Dimensions,
  Image,
  TouchableWithoutFeedback,
  ImageBackground,
  ActivityIndicator,
  TouchableHighlight,
  TouchableOpacity,
  Animated,
  Platform,
  Linking,
  ScrollView,
} from "react-native";
import { StackedAreaChart } from "react-native-svg-charts";
import * as shape from "d3-shape";
import MapView from "react-native-maps";

import { styles, filledCurve, opaqueCurve } from "./Style";
import InteractionManager from "../../helpers/loadingComponent";

import pointsDecimal from "../../helpers/pointsDecimal";
import OwnIcon from "../../components/OwnIcon/OwnIcon";

import AlertFeedback from "../../components/AlertFeedback/AlertFeedback";
import ViewFeedback from "../../components/ViewFeedback/ViewFeedback";
import LinearGradient from "react-native-linear-gradient";
import Aux from "./../../helpers/Aux";
import Svg, { Circle } from "react-native-svg";
import { BoxShadow } from "react-native-shadow";

import {
  getDetailRouteNew,
  getFeedbackForRoute,
  postFeedbackForRoute,
} from "./../../domains/login/ActionCreators";
import { connect } from "react-redux";
import { createSelector } from "reselect";
import { getDevice } from "../../helpers/deviceInfo";

import { strings } from "../../config/i18n";
import {
  getLanguageI18n,
  convertLanguagesIndexForBackend,
} from "../../config/i18n";
import moment from "moment";
import haversine from "./../../helpers/haversine";
import {
  getIdModalTypeFromBackend,
  getImageUrl,
} from "./../../domains/tracking/Support";

class RecapRouteNotValidScreen extends React.Component {
  constructor(props) {
    super(props);

    const languageSet = getLanguageI18n();
    const indexLanguage = convertLanguagesIndexForBackend(
      languageSet.substring(0, 2)
    );

    this.state = {
      load: false,
      animated: false,
      route: [],
      typology: [],
      firstLat: 0,
      firstLon: 0,
      frequent_trip: false,
      startP: null,
      finalP: null,
      add_frequent_trip: false,
      route_start_date: "",
      route_time_travelled: "",
      dist_from_massimo: null,
      day_series_points: 0,
      weather_points: 0,
      peak_hours_points: 0,
      routinary_points: 0,
      avg_speed: [], //  le velocità media delle varie sottotratte
      indexLanguage,
      feedback: null,
      feedbackAnswer: null,
      feedbackAnswerInfo: null,
      Alert: false,
      modalTypeImageUrl: require("../../assets/images/walk_icn_recap.png"),
      color: "#6BBA7E",
    };
  }

  closeAlert = () => {
    this.setState({
      Alert: false,
    });
  };

  openAlert = () => {
    this.setState({
      Alert: true,
    });
  };

  // cancella la tratta che sto vedendo, in caso metto un caricamento e dopo che la tratta è stata eliminata e le tratte aggiornate sono state prese, ritorno indietro
  deleteRoute = () => {
    this.props.navigation.goBack();
  };

  setResponseAnswer = (feedbackAnswer) => {
    if (feedbackAnswer.length) {
      // se ho almeno una risposta, allora ho mandato le mie risposte
      this.setState({
        feedbackAnswer: feedbackAnswer[0].id,
        feedbackAnswerInfo: feedbackAnswer[0],
      });
    }
  };

  sendRequest = (data) => {
    const referred_route_id = this.props.navigation.getParam(
      "referred_route_id",
      0
    );

    this.props.dispatch(
      postFeedbackForRoute({
        question: data.question,
        answer: data.arrayResponse,
        trip: referred_route_id,
        callback: this.setResponseAnswer,
      })
    );
    this.closeAlert();
  };

  sendRequestInput = (data) => {
    const referred_route_id = this.props.navigation.getParam(
      "referred_route_id",
      0
    );

    this.props.dispatch(
      postFeedbackForRoute({
        question: data.question,
        answer_text: data.inputValue,
        trip: referred_route_id,
        callback: this.setResponseAnswer,
      })
    );
  };

  showAlert = () => {
    this.setState({
      Alert: true,
    });
  };

  heightDetail = new Animated.Value(0);

  // click relativo all'avvio dell'animazione
  onClickAnimated = () => {
    // unisco tre animazioni relative a
    // x , y e opacita
    // in 350 ms il valore corrente nello stato deve diventare 100 nel corso del tempo
    this.setState((prevState) => {
      return { animated: true };
    });
    this.heightDetail.setValue(0);

    Animated.spring(this.heightDetail, {
      toValue: 1,
      duration: 250,

      isInteraction: true,
    }).start();
    // poi setto che ho fatto l'animazione di apertura nello stato, utile per poi fare quella di chiusura
  };

  // relativa all'animazione di chiusura
  // metodo dopo l'animazionez
  onClickAnimatedClose = () => {
    // cambia il valore dì animated dello stato per dire che ho chiuso il menu con l'animazione di chiusura
    this.setState((prevState) => {
      return { animated: false };
    });
    this.heightDetail.setValue(1);
    Animated.spring(this.heightDetail, {
      toValue: 0,
      duration: 250,

      isInteraction: true,
    }).start();
  };

  moveMapRecap = (route, activity, modalType, data, fromDb) => {
    // if (!fromDb && modalType != "Multiple")
    //   this.props.navigation.navigate("MapFeedRecapScreen", {
    //     route: fromDb ? route[0].coordinates : route,
    //     activity,
    //     modalType,
    //     data,
    //     fromDb
    //   });
    // else
    {
      const modalTypeArray = this.props.navigation.getParam(
        "modalTypeArray",
        []
      );
      const modalTypeArrayNew = [...modalTypeArray];
      if (fromDb) {
        this.props.navigation.navigate("MapMultiRouteFeedRecapScreen", {
          route: route,
          activity: activity,
          modalType: modalType,
          data,
          fromDb,
          modalTypeArray: this.state.typology,
        });
      } else {
        // copio e poi inverto cosi ruoto un altro dato, altrimenti quello di base rimane ruotato e ruotandolo di nuovo rimane lo stesso di partenza
        this.props.navigation.navigate("MapMultiRouteFeedRecapScreen", {
          route,
          activity,
          modalType,
          data,
          fromDb,
          modalTypeArray: this.state.typology,
        });
      }
    }
  };

  moveRoutine = (route, activity, modalType, data, fromDb) => {
    if (modalType != "Multiple")
      this.props.navigation.navigate("Routine", {
        route: fromDb ? route[0].coordinates : route,
        activity,
        modalType,
        data,
        fromDb,
      });
    else {
      const modalTypeArray = this.props.navigation.getParam(
        "modalTypeArray",
        []
      );
      const modalTypeArrayNew = [...modalTypeArray];
      if (fromDb) {
        this.props.navigation.navigate("Routine", {
          route: route,
          activity: activity,
          modalType: modalType,
          data,
          fromDb,
          modalTypeArray: modalTypeArrayNew,
        });
      } else {
        // copio e poi inverto cosi ruoto un altro dato, altrimenti quello di base rimane ruotato e ruotandolo di nuovo rimane lo stesso di partenza
        this.props.navigation.navigate("Routine", {
          route,
          activity,
          modalType,
          data,
          fromDb,
          modalTypeArray: modalTypeArrayNew.reverse(),
        });
      }
    }
  };

  calcDistFromTeatroMassimo(point) {
    // circa 60 metri
    const thresholdGPS = 0.125;
    const distance = haversine(point[1], point[0], 38.1201924, 13.3550415);

    const distance_from_centro = distance <= thresholdGPS ? true : false;
    if (distance_from_centro) return true;
    else return false;
  }

  componentWillReceiveProps(props) {
    // se ho aggiunto una nuova frequent trip allora controllo se è coerente con quella corrente
    if (props.addFrequentTrips.length !== this.props.addFrequentTrips.length) {
      if (!this.state.frequent_trip) {
        let add_frequent_trip = false;
        for (i = 0; i < props.addFrequentTrips.length; i++) {
          const routine = props.addFrequentTrips[i];

          if (
            this.state.startP[0] === routine.start_point[0] &&
            this.state.startP[1] === routine.start_point[1] &&
            this.state.finalP[0] === routine.end_point[0] &&
            this.state.finalP[1] === routine.end_point[1]
          ) {
            add_frequent_trip = true;
            break;
          }
        }
        this.setState({
          add_frequent_trip,
        });
      }
    }
  }

  getImagePath = (label) => {
    switch (label) {
      case "Walking":
        return (
          <Image
            source={require("../../assets/images/walk_icn_recap.png")}
            style={{
              width: Dimensions.get("window").width / 3,
              height: Dimensions.get("window").width / 3,
            }}
          />
        );
      case "Biking":
        return (
          <Image
            source={require("../../assets/images/bike_icn_recap.png")}
            style={{
              width: Dimensions.get("window").width / 3,
              height: Dimensions.get("window").width / 3,
            }}
          />
        );
      case "Public":
      case "Bus":
        return (
          <Image
            source={require("../../assets/images/bus_icn.png")}
            style={{
              width: Dimensions.get("window").width / 3,
              height: Dimensions.get("window").width / 3,
            }}
          />
        );
      case "Train":
        return (
          <Image
            source={require("../../assets/images/train_icn.png")}
            style={{
              width: Dimensions.get("window").width / 3,
              height: Dimensions.get("window").width / 3,
            }}
          />
        );
      case "Metro":
        return (
          <Image
            source={require("../../assets/images/metro_icn.png")}
            style={{
              width: Dimensions.get("window").width / 3,
              height: Dimensions.get("window").width / 3,
            }}
          />
        );
      case "Carpooling":
        return (
          <Image
            source={require("../../assets/images/carpooling_icn.png")}
            style={{
              width: Dimensions.get("window").width / 3,
              height: Dimensions.get("window").width / 3,
            }}
          />
        );
      case "Multiple":
        return (
          <Image
            source={require("../../assets/images/multitrack_icn_recap.png")}
            style={{
              width: Dimensions.get("window").width / 3,
              height: Dimensions.get("window").width / 3,
            }}
          />
        );
      default:
        return (
          <Image
            source={require("../../assets/images/walk_icn_recap.png")}
            style={{
              width: Dimensions.get("window").width / 3,
              height: Dimensions.get("window").width / 3,
            }}
          />
        );
    }
  };

  getLangString() {
    const language = getLanguageI18n();

    try {
      switch (language) {
        case "en":
          return "en-GB";
          break;
        case "it":
          return "it-IT";
          break;

        default:
          return "it-IT";
          break;
      }
    } catch (error) {
      console.log(error);
    }
  }

  renderHeader(modalType, data, color, points, Day, timeHour, getData) {
    const language = getLanguageI18n();
    console.log(language);
    try {
      switch (language) {
        case "en":
          break;
        case "nl":
          require("moment/locale/nl");
          break;
        case "sv":
          require("moment/locale/sv");
          break;
        case "es":
          require("moment/locale/es");
          break;
        case "it":
          require("moment/locale/it");
          break;
        case "ca":
          require("moment/locale/ca");
          break;
        case "pt":
          require("moment/locale/pt");
          break;
        case "br":
          require("moment/locale/br");
        case "rs":
          break;
        case "pl":
          require("moment/locale/pl");
          break;
        default:
          break;
      }
    } catch (error) {}

    // console.log(moment.locale());
    // var options = {
    //   weekday: "long",
    //   day: "2-digit",
    //   month: "long",
    //   year: "numeric"
    // };
    // var date_ = new Date(data).toLocaleString("it-IT", options);
    // console.log(data);
    // console.log(date_);
    // console.log(
    //   new Date(data).toLocaleString("it-IT", {
    //     hour: "2-digit",
    //     minute: "2-digit"
    //   })
    // );

    return (
      <View style={styles.header}>
        <StackedAreaChart
          style={{
            height: 30,
            width: Dimensions.get("window").width,
          }}
          data={filledCurve}
          showGrid={false}
          keys={["value"]}
          colors={[color]}
          curve={shape.curveNatural}
        />
        <StackedAreaChart
          style={{
            height: 30,
            width: Dimensions.get("window").width,
            position: "absolute",
            top: 10,
          }}
          data={opaqueCurve}
          showGrid={false}
          keys={["value"]}
          colors={[color + "80"]}
          curve={shape.curveNatural}
        />
        <View style={styles.headerRow}>
          <View style={styles.headerdivideTree}>
            {this.getImagePath(modalType)}
          </View>
          <View style={styles.headerdivideTree}>
            <Text style={styles.headerText}>
              {moment(data).format("MMMM Do YYYY")}
            </Text>
            <Text style={styles.headerText}>{moment(data).format("LT")}</Text>
          </View>
          <View style={styles.headerdivideTree}>
            <Text style={styles.headerTextValuePoint}>{points}</Text>
            <Text style={styles.headerTexPoints}>{strings("id_1_24")}</Text>
          </View>
        </View>
      </View>
    );
  }
  renderRow(parameterName, value) {
    return (
      <View style={styles.rowContainer}>
        <View style={styles.row}>
          <Text style={styles.leftParameter}>{parameterName}</Text>
          <View style={styles.rightContainer}>
            <Text style={styles.rightElement}>{value}</Text>
          </View>
        </View>
      </View>
    );
  }

  renderFrequentTrip(
    parameterName,
    value,
    route,
    activity,
    modalType,
    data,
    fromDb,
    load
  ) {
    return (
      <View style={styles.rowContainer}>
        <View style={styles.row}>
          <Text style={styles.leftParameter}>{parameterName}</Text>
          <View style={styles.rightContainer}>
            {load ? (
              value == true ? (
                <Text style={styles.rightElement}>Yes</Text>
              ) : this.state.add_frequent_trip ? (
                <Text style={styles.rightElement}>Added</Text>
              ) : (
                <TouchableOpacity
                  style={{
                    width: 18,
                    height: 18,
                    backgroundColor: "#87D99A",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 1,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 0.01 },
                    shadowOpacity: 0.2,
                  }}
                  onPress={() =>
                    // this.moveRoutine(route, activity, modalType, data, fromDb)
                    this.props.navigation.navigate(
                      "ChangeFrequentTripTypeFromRecapScreen",
                      {
                        start_point: {
                          latitude: this.state.startP[1],
                          longitude: this.state.startP[0],
                        },
                        end_point: {
                          latitude: this.state.finalP[1],
                          longitude: this.state.finalP[0],
                        },
                      }
                    )
                  }
                >
                  <Text style={styles.iconText}>+</Text>
                </TouchableOpacity>
              )
            ) : (
              <ActivityIndicator style={{}} size="small" color="#3D3D3D" />
            )}
          </View>
        </View>
      </View>
    );
  }

  // press sul tasto di  add della tratta
  onPressAdd = () => {
    // this.moveRoutine(route, activity, modalType, data, fromDb)
    this.props.navigation.navigate("ChangeFrequentTripTypeFromRecapScreen", {
      start_point: {
        latitude: this.state.startP[1],
        longitude: this.state.startP[0],
      },
      end_point: {
        latitude: this.state.finalP[1],
        longitude: this.state.finalP[0],
      },
      date: this.state.route_start_date,
      time_travelled: this.state.route_time_travelled,
    });
  };

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        load: true,
      });
    });

    let multipliers = this.props.navigation.getParam("multipliers", []);
    console.log(multipliers);
    console.log(multipliers instanceof Array);
    // se è un oggetto, lo converto in array
    if (!(multipliers instanceof Array)) {
      multipliers = Object.keys(multipliers);
    }
    console.log(multipliers);
    console.log(this.props.multipliersAll);
    let typeFound = [];
    for (i = 0; i < this.props.multipliersAll.length; i++) {
      console.log(elem);
      const elem = this.props.multipliersAll[i];
      console.log(elem);
      for (j = 0; j < elem.type.length; j++) {
        const singleType = elem.type[j];
        console.log(singleType);
        console.log(singleType.id);
        console.log(multipliers.includes(singleType.id));

        if (multipliers.includes(singleType.id)) {
          typeFound = [
            ...typeFound,
            {
              id: singleType.id,
              points: singleType.points,
              typeMultipliers: elem.id,
              nameMultipliers: elem.name,
            },
          ];
        }
      }
    }

    let bonus = typeFound.reduce((total, value) => {
      return total + value.points;
    }, 0);

    console.log(bonus);
    const totPoints = this.props.navigation.getParam("totPoints", 0);
    let pointStart = totPoints * ((100 - bonus) / 100);
    console.log(pointStart);

    for (i = 0; i < typeFound.length; i++) {
      const elem = typeFound[i];
      if (elem.typeMultipliers == 2) {
        // Peak hours
        this.setState({
          peak_hours_points: parseInt((elem.points / 100) * pointStart),
        });
      } else if (elem.typeMultipliers == 1) {
        // Weather
        this.setState({
          weather_points: parseInt((elem.points / 100) * pointStart),
        });
      } else if (elem.typeMultipliers == 3) {
        // Frequency
        this.setState({
          day_series_points: parseInt((elem.points / 100) * pointStart),
        });
      } else if (elem.typeMultipliers == 5) {
        // Frequency
        this.setState({
          routinary_points: parseInt((elem.points / 100) * pointStart),
        });
      }
    }

    // console.log(multipliersAllType)

    // const typeFound = multipliersAllType.filter( elem => multipliers.includes(elem.id))

    // console.log(typeFound)
  }

  componentWillUnmount() {
    this.setState({
      load: false,
    });
  }

  // ordino le tratte per id
  compare = (a, b) => {
    if (a.id < b.id) {
      return -1;
    } else {
      return 1;
    }
  };

  setFeedBack = (responseFeedback) => {
    if (responseFeedback.length) {
      if (
        responseFeedback[0].my_answer &&
        responseFeedback[0].my_answer.length
      ) {
        // ho la risposta, la salvo cosi so che ho gia risposto
        // mi basta l'id
        this.setState({
          feedback: responseFeedback,
          feedbackAnswer: responseFeedback[0].my_answer[0].id,
          feedbackAnswerInfo: responseFeedback[0].my_answer[0],
          // feedbackOldAnswer: true
        });
      } else {
        this.setState({
          feedback: responseFeedback,
        });
      }
    }
  };

  setRouteBackend = (response) => {
    console.log(response);

    try {
      let typology = [];
      // prendo soltanto i trip completi e li ordino per id per avere l'ordine corretto
      let routeComplet = response.filter((elem) => elem.linestring);
      console.log(routeComplet);
      routeComplet = routeComplet.sort(this.compare);
      console.log(routeComplet);

      const avg_speed = routeComplet.map((elem) => {
        return {
          avg_speed: elem.avg_speed,
          calculated_treshold: elem.calculated_treshold,
        };
      });

      // da linestring ottengo un array di lat e log
      let route = routeComplet.map((elem) => {
        typology = [...typology, elem.typology];
        const str = elem.linestring;
        if (str) {
          var i = str.indexOf("(");
          const j = str.indexOf(")");
          const res = str.slice(i + 1, j);
          const arrayString = res.split(",");
          const arrayCoord = arrayString.reduce((total, item) => {
            {
              const single = item.split(" ");
              const singleCheck = single.filter((elem) => elem.length);
              // converto in float
              const singleCheckFloat = singleCheck.map((elem) =>
                parseFloat(elem)
              );
              return [...total, singleCheckFloat];
            }
          }, []);
          console.log(arrayCoord);
          return arrayCoord;
        } else {
          return [];
        }
      });

      let firstLat = 0;
      let firstLon = 0;

      for (i = 0; i < route.length; i++) {
        console.log(route[i]);
        if (route[i].length) {
          firstLat = route[i][1];
          firstLon = route[i][0];
        }
      }

      // console.log(JSON.stringify(response));
      console.log(route);

      this.setState({
        route_start_date: response[0].start_time,
        route_time_travelled: response[0].duration,
        route: route,
        typology: typology.reverse(),
        firstLat,
        firstLon,
        avg_speed,
      });

      /* console.log("setRouteBackend");
      console.log(response);
      console.log(response.length);
      if (response.length >= 1) {
        let frequent_trip = false;
        let add_frequent_trip = false;

        response.forEach(r => {
          if (r.referred_route.referred_most_freq_route != null)
            frequent_trip = true;
        });

        let startP = response[0].route.coordinates[0]; // [lat, lon, alt]
        let finalP =
          response[response.length - 1].route.coordinates[
          response[response.length - 1].route.coordinates.length - 1
          ]; // [lat, lon, alt]

        // se non è una frequent trip vedo se lo aggiunta dopo
        if (!frequent_trip) {
          for (i = 0; i < this.props.addFrequentTrips.length; i++) {
            const routine = this.props.addFrequentTrips[i];
            if (
              startP[0] === routine.start_point.latitude &&
              startP[1] === routine.start_point.longitude &&
              finalP[0] === routine.end_point.latitude &&
              finalP[1] === routine.end_point.longitude
            ) {
              add_frequent_trip = true;
              break;
            }
          }
        }

        console.log("dist_from_massimo");

        let dist_from_massimo = false;
        if (this.props.st_teatro_massimo != false) {
          dist_from_massimo = this.calcDistFromTeatroMassimo(finalP)
            ? true
            : false;
        }

        this.setState(
          {
            route: route.reverse(),
            firstLat,
            firstLon,
            frequent_trip,
            add_frequent_trip,
            startP,
            finalP,
            dist_from_massimo
          },
          () => {
            console.log("recapstate", this.state);
          }
        );
      } else {
        let frequent_trip = false;
        let add_frequent_trip = false;

        if (response[0].referred_route.referred_most_freq_route != null)
          frequent_trip = true;

        let startP = response[0].route.coordinates[0]; // [lat, lon, alt]
        let finalP =
          response[0].route.coordinates[
          response[0].route.coordinates.length - 1
          ]; // [lat, lon, alt]

        // se non è una frequent trip vedo se lo aggiunta dopo
        if (!frequent_trip) {
          for (i = 0; i < this.props.addFrequentTrips.length; i++) {
            const routine = this.props.addFrequentTrips[i];
            console.log(routine);
            console.log(startP);
            if (
              startP[0] === routine.start_point[0] &&
              startP[1] === routine.start_point[1] &&
              finalP[0] === routine.end_point[0] &&
              finalP[1] === routine.end_point[1]
            ) {
              add_frequent_trip = true;
              break;
            }
          }
        }
        this.setState({
          route: route.reverse(),
          firstLat,
          firstLon,
          frequent_trip,
          add_frequent_trip,
          startP,
          finalP
        });
      } */
    } catch (error) {
      console.log(error);
    }
  };

  expandDetail = () => {
    if (this.state.animated) {
      this.onClickAnimatedClose();
    } else {
      this.onClickAnimated();
    }
  };

  componentWillMount() {
    const { navigation } = this.props;
    const fromDb = navigation.getParam("fromDb", []);

    const modalType = navigation.getParam("modalType", []);
    const modalTypeImageUrl = getImageUrl(modalType);
    const color = navigation.getParam("color", []);

    const trip_type_id = getIdModalTypeFromBackend(
      navigation.getParam("modalType", "Walking")
    );
    const validated = navigation.getParam("validated", 0);
    const referred_route_id = navigation.getParam("referred_route_id", 0);

    this.setState({
      modalTypeImageUrl,
      color,
    });
    this.props.dispatch(
      getDetailRouteNew({ referred_route_id, callback: this.setRouteBackend })
    );
    this.props.dispatch(
      getFeedbackForRoute({
        trip_type_id,
        validated,
        language: this.state.indexLanguage,
        trip_id: referred_route_id,
        callback: this.setFeedBack,
      })
    );
  }

  sendFeedBack = async () => {
    /* try {
        Linking.openURL(
          "mailto:support@domain.com?subject=Hey buddies, I’ve a feedback about MUV 🤓 📬&body=Ciao,\nit’s [your name]\nand since I don’t have much time, here is my very brief feedback about MUV:\n- 🤬 this didn’t work --> ...\n- 🤯 I didn’t get this --> ...\n- 🤔 you should work better on this --> ...\n- 🤩 this is pretty neat! --> ...\n\nI'm sure you'll apreciate this and I hope my feedback will improve my beloved app.\nLove you all,\n[your name] 💞"
        );
      } catch (error) {
        console.log(error);
        alert(JSON.stringify(error));
        try {
          Linking.openURL(
            "googlegmail://?subject=Hey buddies, I’ve a feedback about MUV 🤓 📬&body=Ciao,\nit’s [your name]\nand since I don’t have much time, here is my very brief feedback about MUV:\n- 🤬 this didn’t work --> ...\n- 🤯 I didn’t get this --> ...\n- 🤔 you should work better on this --> ...\n- 🤩 this is pretty neat! --> ...\n\nI'm sure you'll apreciate this and I hope my feedback will improve my beloved app.\nLove you all,\n[your name] 💞"
          );
        } catch (error) {
          console.log(error);
          alert(JSON.stringify(error));
        }
      } */

    const device = await getDevice();

    const referred_route_id = this.props.navigation.getParam(
      "referred_route_id",
      0
    );

    const url =
      "mailto:developers@wepush.org?subject=Hey buddies, I’ve a feedback about this [" +
      referred_route_id +
      "] trip 🤓 🛣" +
      "&body=Ciao,\nit’s [your name]\nI'm in a hurry, but you need to know this feedback about my last MUV trip:\n- 🤬 I didn't have any points but I traveled by --> [walking / byking / with the bus / multiple]\n- 🤯 I got different points than I was supposed to get --> [less / more]\n- 🤩 I cheated, and you didn't get it!! --> [awesome]\n\nI'm sure you'll apreciate this and I hope my feedback will improve my beloved app.\nLove you all,\n[your name] 💞\n" +
      device;

    // const url =
    //   "mailto:developers@wepush.org?subject=" +
    //   strings("_153_hey_buddies__i_") +
    //   " [" +
    //   referred_route_id +
    //   "] " +
    //   "&body=" +
    //   strings("_155_ciao__it_s__you") +
    //   device;

    const modalType = this.props.navigation.getParam("modalType", []);

    this.props.navigation.navigate("FeedbackWebView", {
      referred_route_id,
      device,
      modalType,
      report: false,
    });

    // Linking.canOpenURL(url)
    //   .then(supported => {
    //     if (!supported) {
    //       console.log("Can't handle url: " + url);
    //     } else {
    //       return Linking.openURL(url);
    //     }
    //   })
    //   .catch(err => console.error("An error occurred", err));
  };

  sendReport = async () => {
    const device = await getDevice();

    const referred_route_id = this.props.navigation.getParam(
      "referred_route_id",
      0
    );

    const modalType = this.props.navigation.getParam("modalType", []);

    this.props.navigation.navigate("FeedbackWebView", {
      referred_route_id,
      device,
      modalType,
      report: true,
    });
  };

  _renderButtonAdd = () => {
    return (
      <View style={{ paddingLeft: 5 }}>
        <LinearGradient
          start={{ x: 0.0, y: 0.0 }}
          end={{ x: 1.0, y: 0.0 }}
          locations={[0, 1.0]}
          colors={["#E82F73", "#F49658"]}
          style={styles.buttonConfermClick}
        >
          <TouchableHighlight
            onPress={() => this.onPressAdd()}
            style={styles.buttonConfermClickTouch}
          >
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                paddingLeft: 10,
                paddingRight: 10,
              }}
            >
              <Text style={styles.addButton}>Add</Text>
            </View>
          </TouchableHighlight>
        </LinearGradient>
      </View>
    );
  };

  componentWillUnmount() {
    this.props.navigation.setParams({ route: [] });
  }

  renderCelebrateIcon() {
    return (
      <View
        style={{
          justifyContent: "center",
          alignContent: "center",
          alignItems: "center",
          width: Dimensions.get("window").width / 3,
        }}
      >
        <TouchableWithoutFeedback
          onPress={() => {
            if (this.props.st_kalsa != false)
              this.props.navigation.navigate("CameraScreen", {
                validate_kalsa: true,
              });
            else this.props.navigation.navigate("CameraScreen");
          }}
        >
          <View
            style={{
              shadowRadius: 5,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 5 },
              shadowOpacity: 0.5,
              backgroundColor: "transparent",
              elevation: 2,
              borderRadius: 25,
              height: 50,
              width: 50,
              alignContent: "center",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "white",
            }}
          >
            {Platform.OS !== "android" ? (
              <Svg height="40" width="40">
                <Circle cx="20" cy="20" r="20" fill="white" />
                <OwnIcon name="celebrate_icn" size={40} color={"#E83475"} />
              </Svg>
            ) : (
              <OwnIcon
                style={{
                  position: "relative",
                  backgroundColor: "transparent",

                  top: 0,
                  left: 0,
                }}
                name="celebrate_icn"
                size={40}
                color={"#E83475"}
              />
            )}
          </View>
        </TouchableWithoutFeedback>
        <View style={{ height: 10 }} />
        <View
          style={{
            justifyContent: "center",
            alignContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={styles.Map}>{strings("id_1_34")}</Text>
        </View>
      </View>
    );
  }

  render() {
    // + 60 se voglio mettere le icone

    return (
      <Aux>
        <ScrollView style={styles.container}>
          <View>
            <View style={[styles.Rest, { backgroundColor: this.state.color }]}>
              <View style={styles.LigthUp}>
                <Text style={styles.trip}>TRATTA NON VALIDA</Text>
              </View>
              <View></View>
              <View
                style={{
                  width: Dimensions.get("window").width * 0.7,
                  height: Dimensions.get("window").width * 0.7,
                  justifyContent: "center",
                  flexDirection: "column",
                  alignContent: "center",
                  alignItems: "center",
                  // paddingTop: 15,s
                }}
              >
                <Image
                  source={require("../../assets/images/cities/team_live_bg_dx.png")}
                  style={{
                    width: Dimensions.get("window").width * 0.5,
                    height: Dimensions.get("window").width * 0.5,
                    position: "absolute",
                  }}
                />
                <Image
                  style={{
                    width: Dimensions.get("window").width * 0.7,
                    height: Dimensions.get("window").width * 0.7,
                    // paddingTop: 15,
                  }}
                  // source={require("../../assets/images/avatars/0Biker1xhdpi.png")}
                  source={this.state.modalTypeImageUrl}
                />
              </View>
              <Text style={styles.tripDetail}>
              {strings("id_1_49")}
              </Text>
              <ViewFeedback
                isModalVisible={this.state.Alert}
                closeModal={this.closeAlert}
                // dispatch={this.dispatch}
                confermModal={this.sendRequestInput}
                type={"Input"}
                infoAlert={this.state.feedback}
                infoSend={this.state.feedback}
                feedbackAnswer={this.state.feedbackAnswer}
              />
              <ImageBackground
                source={require("./../../assets/images/recap/white_wave_up.png")}
                style={styles.backgroundImageLigth}
              />
            </View>
            <View style={styles.iconBanner}>
              <View style={styles.end}>
                <View
                  style={{
                    justifyContent: "center",
                    alignContent: "center",
                    alignItems: "center",
                    width: Dimensions.get("window").width / 3,
                  }}
                >
                  <TouchableWithoutFeedback
                    disabled={!this.state.firstLat}
                    onPress={() =>
                      this.moveMapRecap(
                        this.state.route,
                        activity,
                        modalType,
                        data,
                        fromDb
                      )
                    }
                    style={
                      {
                        // backgroundColor: "white"
                      }
                    }
                  >
                    <View
                      style={{
                        shadowRadius: 5,
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 5 },
                        shadowOpacity: 0.5,
                        backgroundColor: "transparent",
                        elevation: 2,
                        borderRadius: 25,
                        height: 50,
                        width: 50,
                        alignContent: "center",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "white",
                      }}
                    >
                      {Platform.OS !== "android" ? (
                        <Svg height="40" width="40">
                          <Circle cx="20" cy="20" r="20" fill="white" />
                          <OwnIcon
                            name="map_icn"
                            size={40}
                            color={
                              this.state.firstLat
                                ? "rgba(61, 61, 61, 1)"
                                : "rgba(61, 61, 61, 0.5)"
                            }
                          />
                        </Svg>
                      ) : (
                        <OwnIcon
                          style={{
                            position: "relative",
                            backgroundColor: "transparent",

                            top: 0,
                            left: 0,
                          }}
                          name="map_icn"
                          size={40}
                          color={
                            this.state.firstLat
                              ? "rgba(61, 61, 61, 1)"
                              : "rgba(61, 61, 61, 0.5)"
                          }
                        />
                      )}
                    </View>
                  </TouchableWithoutFeedback>
                  <View style={{ height: 10 }} />
                  <View
                    style={{
                      justifyContent: "center",
                      alignContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text style={styles.Map}>{strings("id_1_32")}</Text>
                  </View>
                </View>

                <View
                  style={{
                    justifyContent: "center",
                    alignContent: "center",
                    alignItems: "center",
                    width: Dimensions.get("window").width / 3,
                  }}
                >
                  <TouchableWithoutFeedback
                    onPress={() => this.sendReport()}
                    style={
                      {
                        // backgroundColor: "white"
                      }
                    }
                  >
                    <View
                      style={{
                        shadowRadius: 5,
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 5 },
                        shadowOpacity: 0.5,
                        backgroundColor: "transparent",
                        elevation: 2,
                        borderRadius: 25,
                        height: 50,
                        width: 50,
                        alignContent: "center",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "white",
                      }}
                    >
                      {Platform.OS !== "android" ? (
                        <Svg height="40" width="40">
                          <Circle cx="20" cy="20" r="20" fill="white" />
                          <OwnIcon
                            name="feedback_icn"
                            size={40}
                            color={"rgba(61, 61, 61, 1)"}
                          />
                        </Svg>
                      ) : (
                        <OwnIcon
                          style={{
                            position: "relative",
                            backgroundColor: "transparent",

                            top: 0,
                            left: 0,
                          }}
                          name="feedback_icn"
                          size={40}
                          color={"rgba(61, 61, 61, 1)"}
                        />
                      )}
                    </View>
                  </TouchableWithoutFeedback>
                  <View style={{ height: 10 }} />
                  <View
                    style={{
                      justifyContent: "center",
                      alignContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text style={styles.Map}>Report</Text>
                  </View>
                </View>
                <View
                  style={{
                    justifyContent: "center",
                    alignContent: "center",
                    alignItems: "center",
                    width: Dimensions.get("window").width / 3,
                  }}
                >
                  <TouchableWithoutFeedback
                    onPress={() => this.deleteRoute()}
                    style={
                      {
                        // backgroundColor: "white"
                      }
                    }
                  >
                    <View
                      style={{
                        shadowRadius: 5,
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 5 },
                        shadowOpacity: 0.5,
                        backgroundColor: "transparent",
                        elevation: 2,
                        borderRadius: 25,
                        height: 50,
                        width: 50,
                        alignContent: "center",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "white",
                      }}
                    >
                      {Platform.OS !== "android" ? (
                        <Svg height="40" width="40">
                          <Circle cx="20" cy="20" r="20" fill="white" />
                          <OwnIcon
                            name="stop_icn"
                            size={40}
                            color={"rgba(61, 61, 61, 1)"}
                          />
                        </Svg>
                      ) : (
                        <OwnIcon
                          style={{
                            position: "relative",
                            backgroundColor: "transparent",

                            top: 0,
                            left: 0,
                          }}
                          name="stop_icn"
                          size={40}
                          color={"rgba(61, 61, 61, 1)"}
                        />
                      )}
                    </View>
                  </TouchableWithoutFeedback>
                  <View style={{ height: 10 }} />
                  <View
                    style={{
                      justifyContent: "center",
                      alignContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text style={styles.Map}>{strings("id_1_48")}</Text>
                  </View>
                </View>
              </View>
            </View>
            {/* </ImageBackground> */}
          </View>

          {/* {this.renderRow("Time", time + " " + text)}
        {this.renderRow("Points", totPoints.toFixed(0))}
        {this.renderRow(
          "Distance",
          distanceWithComma.substr(0, distanceWithComma.length) + " Km"
        )}
        {this.renderRow("Calories", calories)}
        {this.renderFrequentTrip(
          "Frequent Trip?",
          this.state.frequent_trip,
          this.state.route,
          activity,
          modalType,
          data,
          fromDb,
          this.state.firstLat
        )}
        <View style={styles.map}>
          {this.state.load && this.state.firstLat ? (
            <MapView
              style={{
                flex: 1,
                width: "100%",
                height: "100%",
                opacity: 0.6
              }}
              zoomEnabled={false}
              draggable={false}
              maxZoomLevel={15}
              initialRegion={{
                latitude: this.state.firstLat,
                longitude: this.state.firstLon,
                latitudeDelta: 0.0222,
                longitudeDelta: 0.0222
              }}
              cacheEnabled
              loadingEnabled
            />
          ) : (
            <View />
          )}
        </View>
        {this.state.load && this.state.firstLat ? (
          <TouchableWithoutFeedback
            onPress={() =>
              this.moveMapRecap(
                this.state.route,
                activity,
                modalType,
                data,
                fromDb
              )
            }
          >
            <TouchableWithoutFeedback
              onPress={() =>
                this.moveMapRecap(
                  this.state.route,
                  activity,
                  modalType,
                  data,
                  fromDb
                )
              }
            >
              <View style={styles.mapTextContainer}>
                <Text
                  onPress={() =>
                    this.moveMapRecap(
                      this.state.route,
                      activity,
                      modalType,
                      data,
                      fromDb
                    )
                  }
                  style={styles.mapText}
                >
                  CLICK TO OPEN
                </Text>
              </View>
            </TouchableWithoutFeedback>
          </TouchableWithoutFeedback>
        ) : (
          <View style={styles.mapTextContainer}>
            <ActivityIndicator
              style={{ paddingBottom: Dimensions.get("window").height * 0.22 }}
              size="large"
              color="#3D3D3D"
            />
          </View>
        )} */}
        </ScrollView>
      </Aux>
    );
  }
}

const getFrequentTrips = (state) => state.login.addFrequentTrips;
const getStTeatroMassimo = (state) =>
  state.trainings.st_teatro_massimo ? state.trainings.st_teatro_massimo : false;
const getStBallarak = (state) =>
  state.trainings.st_ballarak ? state.trainings.st_ballarak : false;
const getStMuvtoget = (state) =>
  state.trainings.st_muvtoget ? state.trainings.st_muvtoget : false;
const getStKalsa = (state) =>
  state.trainings.st_kalsa ? state.trainings.st_kalsa : false;

const getMultipliers = (state) => state.login.multipliers;

const getMultipliersState = createSelector([getMultipliers], (multipliers) =>
  multipliers ? multipliers.multipliers : []
);

const getFrequentTripsState = createSelector(
  [getFrequentTrips],
  (addFrequentTrips) => (addFrequentTrips ? addFrequentTrips : [])
);

const getStTeatroMassimoState = createSelector(
  [getStTeatroMassimo],
  (stTeatro) => (stTeatro ? stTeatro : false)
);

const getStBallarakState = createSelector([getStBallarak], (stBallarak) =>
  stBallarak ? stBallarak : false
);

const getStMuvtogetState = createSelector([getStMuvtoget], (stMuvtoget) =>
  stMuvtoget ? stMuvtoget : false
);

const getStKalsaState = createSelector([getStKalsa], (stKalsa) =>
  stKalsa ? stKalsa : false
);

const requestRoute = connect((state) => {
  return {
    addFrequentTrips: getFrequentTripsState(state),
    // st_teatro_massimo: getStTeatroMassimoState(state),
    // st_ballarak: getStBallarakState(state),
    // st_muvtoget: getStMuvtogetState(state),
    // st_kalsa: getStKalsaState(state),
    multipliersAll: getMultipliersState(state),
  };
});

export default requestRoute(RecapRouteNotValidScreen);
