// componente che riassume le info sulla tratta precedente effettuata ma ancora da validare come punti, tipo se è stata validata , tempo,  testo

import React from "react";
import {
  View,
  Text,
  Dimensions,
  ActivityIndicator,
  Image,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import ProgressBar from "react-native-progress/Bar";
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

class RecapActivityLoading extends React.Component {
  getImagePath = (label, coef) => {
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
        if (coef === 800) {
          return (
            <Image
              source={require("../../assets/images/bus_icn.png")}
              style={{ width: 60, height: 60 }}
            />
          );
        } else if (coef === 400) {
          return (
            <Image
              source={require("../../assets/images/train_icn.png")}
              style={{ width: 60, height: 60 }}
            />
          );
        } else if (coef === 1200) {
          return (
            <Image
              source={require("../../assets/images/metro_icn.png")}
              style={{ width: 60, height: 60 }}
            />
          );
        }
        return (
          <Image
            source={require("../../assets/images/bus_icn.png")}
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

  loadingStart;
  loading;

  componentWillMount() {
    this.setState({ status: true });

    loadingStart = setTimeout(() => {
      this.setState({ status: false });
    }, 10000);
  }

  componentWillReceiveProps(props) {}

  componentWillUnmount() {}

  getImageReload = () => {
    return (
      <TouchableOpacity activeOpacity={0.7} onPress={() => this.reloadStatus()}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            width: Dimensions.get("window").width * 0.05,
            // height: 55
          }}
        >
          <ImageBackground
            style={{ width: "100%", height: "100%" }}
            source={require("../../assets/images/feed_reload_icn.png")}
          />
        </View>
      </TouchableOpacity>
    );
  };

  getEndImagePath = (label) => {
    switch (label) {
      case "Biking":
        {
          return (
            <ImageBackground
              style={{ width: "100%", height: "100%" }}
              source={require("../../assets/images/bike_loading_track.png")}
            />
          );
        }
        break;
      case "Walking":
        {
          return (
            <ImageBackground
              style={{ width: "100%", height: "100%" }}
              source={require("../../assets/images/walk_loading_track.png")}
            />
          );
        }
        break;
      case "Public":
      case "Bus":
      case "Train":
      case "Metro":
        {
          return (
            <ImageBackground
              style={{ width: "100%", height: "100%" }}
              source={require("../../assets/images/public_transport_loading_track.png")}
            />
          );
        }
        break;
      case "Multiple":
        {
          return (
            <ImageBackground
              style={{ width: "100%", height: "100%" }}
              source={require("../../assets/images/multi_loading_track.png")}
            />
          );
        }
        break;
      case "Carpooling": {
        return (
          <ImageBackground
            style={{ width: "100%", height: "100%" }}
            source={require("../../assets/images/multi_loading_track.png")}
          />
        );
      }
      break;
      default:
        {
          return (
            <ImageBackground
              style={{ width: "100%", height: "100%" }}
              source={require("../../assets/images/walk_loading_track.png")}
            />
          );
        }
        break;
    }
  };

  render() {
    // vedo il tipo di attivita scelta e metto il colore corrispodente
    color = "#3d3d3d";
    // se valida cambio il colore del pannello

    switch (this.props.modal_type.type) {
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
        case "Carpooling":
          {
            color = "#3363AD";
           
           
          }
          break
      default:
        {
          color = "rgba(108, 186, 126, 1)";
        }
        break;
    }

    let label = timeAgo(this.props.DataNow, this.props.Data);

    return (
      <View>
        <View
          style={styles.view}
          // activeOpacity={0.7}
          // onPress={this.moveMapRecap}
        >
          <View style={styles.viewStyle}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                width: Dimensions.get("window").width * 0.15,
                // height: 55
                // backgroundColor: "#ffa",
                // borderLeftColor: "#9D9B9C80",
                // borderLeftWidth: 1.5
              }}
            >
              {this.getImagePath(
                this.props.modal_type.type.toLowerCase(),
                this.props.modal_type.coef
              )}
            </View>
            <View
              style={{
                width: Dimensions.get("window").width * 0.55,
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Text style={styles.textTitle}>
                <Text style={styles.textModalSplit}>{strings("id_18_26")}</Text>
                {label}
              </Text>
              <Text style={styles.textDescr}>{strings("id_18_27")}</Text>
            </View>
            <View />

            <View
              style={{
                width: Dimensions.get("window").width * 0.05,

                // height: 55
              }}
            >
              {this.getEndImagePath(this.props.modal_type.type)}
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const styles = {
  view: {
    width: Dimensions.get("window").width * 0.9,
    elevation: 3,
    flex: 1,
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
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    alignSelf: "center",
  },
  textTitle: {
    fontSize: 11,
    fontFamily: "OpenSans-Regular",
    marginVertical: 6,
    marginTop: 15,
  },
  textPoints: {
    fontSize: 30,
    fontFamily: "OpenSans-Regular",
    fontWeight: "bold",
  },
  textDescr: {
    fontSize: 11,
    fontFamily: "OpenSans-Regular",
    marginVertical: 6,
    marginBottom: 15,
  },
  textModalSplit: {
    fontSize: 11,
    fontFamily: "OpenSans-Regular",
    marginVertical: 6,
    fontWeight: "bold",
  },
  points: {
    fontSize: 20,
    color: "white",
    fontFamily: "OpenSans-Regular",
  },
  pt: {
    fontSize: 10,
    marginTop: 5,
    fontFamily: "OpenSans-Regular",
  },
  circle: {
    width: Dimensions.get("window").width / 50 + 10,
    height: Dimensions.get("window").width / 50 + 10,
    borderRadius: Dimensions.get("window").width / 50 + 10,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    borderWidth: 5,
  },
};

export default RecapActivityLoading;
