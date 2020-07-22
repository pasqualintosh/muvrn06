// componente per gli inviti social

import React from "react";
import {
  View,
  Text,
  Dimensions,
  Image,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Platform,
  ImageBackground,
  Linking
} from "react-native";

import { images } from "../../components/InfoUserHome/InfoUserHome";

import {
  addOpenPeriodicFeed,
  addCompletePeriodicFeed
} from "../../domains/login/ActionCreators";

import { strings, getLanguageI18n } from "../../config/i18n";

import { limitAvatar } from "./../UserItem/UserItem";

// componente per visualizzare i punti che ho guadagnato in questo preciso momento

// props
// title titolo della notifica
// descr descrizione della notifica
// point punti ottenuti
// color colore della view
// click azione collegata all'icona della notifica

// color lo passa allo stile inline di view

class RecapSocial extends React.PureComponent {
  constructor() {
    super();

    // let languagesList = [indexLanguage];
    // for (i = 0; i < 8; i++) {
    //   if (indexLanguage !== i) {
    //     languagesList = [...languagesList, i];
    //   }
    // }

    state = {
      color: "#3d3d3d"
    };
  }

  moveFacebook = facebook => {
    // Platform.OS === 'ios' ? 'fb://profile/139996222323553360774' : 'fb://page/139996232323232553360774/
    // const FANPAGE_URL_FOR_APP = `fb://page/${FANPAGE_ID}`
    Linking.canOpenURL(
      Platform.OS !== "android"
        ? "fb://profile/" + facebook
        : "fb://page/" + facebook
    ).then(supported => {
      if (supported) {
        Linking.openURL(
          Platform.OS !== "android"
            ? "fb://profile/" + facebook
            : "fb://page/" + facebook
        );
      } else {
        Linking.openURL("https://www.facebook.com/n/?" + facebook);
      }
    });
  };

  moveInstagram = instagram => {
    Linking.canOpenURL("instagram://user?username=" + instagram).then(
      supported => {
        if (supported) {
          Linking.openURL("instagram://user?username=" + instagram);
        } else {
          console.log(
            "Don't know how to open URI: " +
              "instagram://user?username=" +
              instagram
          );
        }
      }
    );
  };

  getImagePath = label => {
    let userAvatar = 1;
    switch (label) {
      case "facebookLike":
        return (
          <Image
            source={require("../../assets/images/trainings/facebook_icn_round.png")}
            style={{ width: 50, height: 50 }}
          />
        );
      case "instagramLike":
        return (
          <Image
            source={require("../../assets/images/trainings/instagram_icn_round.png")}
            style={{ width: 50, height: 50 }}
          />
        );

      default: {
        userAvatar = limitAvatar(this.props.avatar);

        return (
          <Image
            source={images[userAvatar]}
            style={{ width: 60, height: 60 }}
          />
        );
      }
    }
  };

  getEndImagePath = label => {
    switch (label) {
      case "facebookLike":
      case "instagramLike":
        return (
          <ImageBackground
            style={{ width: "100%", height: "100%" }}
            source={require("../../assets/images/trainings/like_feed_icn.png")}
          />
        );

      default:
        return (
          <ImageBackground
            style={{ width: "100%", height: "100%" }}
            source={require("../../assets/images/trainings/phone_feed_icn.png")}
          />
        );
    }
  };

  moveTraining = () => {
    if (this.props.modal_type === "facebookLike") {
      this.props.dispatch(addOpenPeriodicFeed(6));
      this.props.dispatch(addCompletePeriodicFeed(6));
      // apri facebook
      this.moveFacebook("609617899449899");
    } else if (this.props.modal_type === "instagramLike") {
      this.props.dispatch(addOpenPeriodicFeed(7));
      this.props.dispatch(addCompletePeriodicFeed(7));
      // apri instagram
      this.moveInstagram("muv2020");
    } else {
      // in tutti gli altri casi vado in trainings

      this.props.navigation.navigate("Trainings");
    }
  };

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
    if (this.props.modal_type === "facebookLike") {
      return <Text style={styles.textDescr}>{strings("follow_us_on_fa")}</Text>;
    } else if (this.props.modal_type === "instagramLike") {
      return <Text style={styles.textDescr}>{strings("follow_us_on_in")}</Text>;
    } else {
      let NameLevel = "Newbie";
      switch (this.props.level) {
        case 1:
          // code block
          NameLevel = "Newbie";
          break;
        case 2:
          // code block
          NameLevel = "Rookie";
          break;
        case 3:
          // code block
          NameLevel = "Pro";
          break;
        case 4:
          // code block
          NameLevel = "Star";
          break;
        default:
          // code block
          NameLevel = "Newbie";
      }

      return this.getFeedContentFromString(
        strings("guess_what__you"),
        NameLevel
      );
    }
  };

  descriptionTitle = () => {
    return <Text style={styles.textModalSplit}>LIKE the way we MUV!</Text>;
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

    // se ho passato la data
    let label = timeAgo(this.props.DataNow, this.props.Data);

    return (
      <View>
        <TouchableOpacity
          style={styles.view}
          activeOpacity={0.7}
          onPress={this.moveTraining}
        >
          <View style={styles.viewStyle}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                width: Dimensions.get("window").width * 0.15

                // backgroundColor: "#ffa"
                // borderLeftColor: "#9D9B9C80",
                // borderLeftWidth: 1.5
              }}
            >
              {this.getImagePath(this.props.modal_type)}
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
            <View
              style={{
                width: Dimensions.get("window").width * 0.05
                // backgroundColor: 'red'

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
              {this.getEndImagePath(this.props.modal_type)}
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

export function timeAgo(DataNow, Data) {
  let label = "";
  if (DataNow && Data) {
    const TimeAgo = DataNow - Data;
    // ora prendo le info sulla data e vedo quale è l'info sul tempo piu grande

    // minuti
    let time = TimeAgo / 60000;
    let text = strings("id_4_06");
    let minute = true;
    let intTime = parseInt(time);

    if (intTime !== 0) {
      if (intTime === 1) {
        text = strings("id_4_07");
      }
      // ore
      let timeNew = time / 60;
      intTime = parseInt(timeNew);
      if (intTime !== 0) {
        if (intTime === 1) {
          text = strings("id_4_05");
        } else {
          text = strings("id_4_04");
        }
        time = timeNew;

        // non sono piu minuti
        minute = false;
        // giorni
        timeNew = time / 24;
        intTime = parseInt(timeNew);
        if (intTime !== 0) {
          if (intTime === 1) {
            text = strings("id_4_03");
          } else {
            text = strings("id_4_02");
          }
          time = timeNew;

          // mesi
          timeNew = time / 30;
          intTime = parseInt(timeNew);
          if (intTime !== 0) {
            if (intTime === 1) {
              text = strings("id_18_19");
            } else {
              text = strings("id_18_18");
            }
            time = timeNew;
          }
        }
      }
    }
    time = parseInt(time);

    const languageSet = getLanguageI18n();

    if (languageSet == "ct" || languageSet == "es") {
      if (time === 0 && minute) label = " | " + strings("id_1_22");
      else label = " | " + strings("id_1_21") + " " + time + " " + text;
    } else {
      if (time === 0 && minute) label = " | " + strings("id_1_22");
      else label = " | " + time + " " + text + " " + strings("id_1_21");
    }
  }
  return label;
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
    marginBottom: 20
  },
  viewStyle: {
    width: Dimensions.get("window").width * 0.9,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    alignSelf: "center"
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
    width: Dimensions.get("window").width / 50 + 10,
    height: Dimensions.get("window").width / 50 + 10,
    borderRadius: Dimensions.get("window").width / 50 + 10,
    // justifyContent: "center",
    // alignItems: "center",
    // alignSelf: "center",
    borderWidth: 5
  }
};

export default RecapSocial;
