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
  Linking,
  TouchableOpacity,
} from "react-native";

import { withNavigation } from "react-navigation";
import { BoxShadow } from "react-native-shadow";

import { images } from "../../components/InfoUserHome/InfoUserHome";
import { data } from "./../../assets/ListCities";
import { getDevice } from "../../helpers/deviceInfo";
import OwnIcon from "../../components/OwnIcon/OwnIcon";

import { checkTypeformFeed } from "../../domains/login/ActionCreators";

import {
  addOpenPeriodicFeed,
  addCompletePeriodicFeed,
} from "../../domains/login/ActionCreators";

import { strings, switchLanguage, getLanguageI18n } from "../../config/i18n";

import { limitAvatar } from "./../UserItem/UserItem";
import { translateEvent } from "./../../helpers/translateEvent";
import { translateSpecialEvent } from "./../../helpers/translateSpecialEvent";
import { getUniversityImg } from "./../../screens/ChooseTeamScreen/ChooseTeamScreen";

import Settings from "./../../config/Settings";
import {
  GoogleAnalyticsTracker,
  GoogleTagManager,
  GoogleAnalyticsSettings,
} from "react-native-google-analytics-bridge";
import { responseRequestFriend } from "../../domains/follow/ActionCreators";

let Tracker = new GoogleAnalyticsTracker(Settings.analyticsCode);
// componente per visualizzare i punti che ho guadagnato in questo preciso momento

// props
// title titolo della notifica
// descr descrizione della notifica
// point punti ottenuti
// color colore della view
// click azione collegata all'icona della notifica

// color lo passa allo stile inline di view

class RecapFriendRequestReceived extends React.PureComponent {
  constructor() {
    super();

    // let languagesList = [indexLanguage];
    // for (i = 0; i < 8; i++) {
    //   if (indexLanguage !== i) {
    //     languagesList = [...languagesList, i];
    //   }
    // }

    this.state = {
      color: "#3d3d3d",
      status: 100,
    };
  }

  componentWillMount() {}

  getImagePath = () => {
    let userAvatar = 1;

    userAvatar = limitAvatar(this.props.avatar);

    return (
      <Image source={images[userAvatar]} style={{ width: 60, height: 60 }} />
    );
  };



  getEndImagePath = () => {

        return (
          <View
            style={{
              flexDirection: "row",
              alignContent: "center",
              justifyContent: "center",
              width: "200%",
              height: "100%",
              alignSelf: "center",
              alignItems: "center",
              // top: -2,
            }}
          >
            <OwnIcon
              name="follower_icn_bottom"
              size={28}
              style={{ position: "relative", left: 14 }}
              color="#3D3D3D"
            />
            <OwnIcon
              name="follower_icn_top"
              size={28}
              style={{ position: "relative", left: -14 }}
              color="#FAB21E"
            />
          </View>
        );

      
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
    if (this.state.status == 201) {
      return this.getFeedContentFromString(
        strings("id_18_49"),
        this.props.username
      );
    }  else if  (this.state.status == 201) {
      return this.getFeedContentFromString(
        "declino"
      );
    }  else {
      return this.getFeedContentFromString(
        strings("id_18_45"),
       this.props.username
      );
    }
      
   
  };

  descriptionTitle = () => {
  
      return (
        <Text style={styles.textModalSplit}>
          {/* {ex_strings("descrFeedEventTitle} */}
          {strings("id_18_44")}
        </Text>
      );
   
  };

  afterResponseRequestFriend = (response) => {
    this.setState({
      status: response && response.status ? response.status : 100
    })
    // if (response.status === 201) {
    //   // accetto la richiesta

    // } else if (response.status === 200) {
    //   // rifiuto la richiesta

    // }
  }

  render() {
   
    // se ho passato la data
    let label = timeAgo(this.props.DataNow, this.props.Data);

    return (
      <View>
        <View
          style={styles.view}
          // activeOpacity={0.7}
          // onPress={this.moveTraining}
        >
          <View style={styles.viewStyle}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                width: Dimensions.get("window").width * 0.15,

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
                justifyContent: "space-between",
              }}
            >
              <Text style={styles.textTitle}>
                {this.descriptionTitle()}
                {label}
              </Text>
              {this.descriptionFeed()}
              <View
              style={{
                width: Dimensions.get("window").width * 0.55,
                height: 1,
                backgroundColor: '#D5D5D5'
              
              }}
            ></View>
              <View
              style={{
                width: Dimensions.get("window").width * 0.55,
                flexDirection: "row",
                justifyContent: "space-between",
              
              }}
            >
                 <TouchableOpacity
            onPress={() => responseRequestFriend({ other_user: this.props.id, accept: true}, this.afterResponseRequestFriend)}
            style={styles.viewResponse}
          >
        <Image
          source={require("../../assets/images/check_green_icn.png")}
          style={{
            width: 24,
            height: 24,
            padding: 10,
           
            alignSelf: "center",
          }}
        />
          <Text style={styles.textResponse}>
         {strings('id_18_46')}
                </Text>
        </TouchableOpacity>
        <TouchableOpacity
            onPress={() => responseRequestFriend({ other_user: this.props.id, accept: false}, this.afterResponseRequestFriend)}
            style={styles.viewResponse}
          >
            
        <Image
          source={require("../../assets/images/cancel_icn.png")}
          style={{
            width: 24,
                height: 24,
                padding: 10,
            alignSelf: "center",
          }}
        />
         <Text style={styles.textResponse}>
         {strings('id_18_47')}
                </Text>
        </TouchableOpacity>
            </View>
            </View>
            <View
              style={{
                width: Dimensions.get("window").width * 0.05,
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
        </View>
      </View>
    );
  }
}

export function timeAgo(DataNow, Data) {
  // console.log(DataNow);
  // console.log(Data);

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
  viewResponse: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  textResponse: {
    fontSize: 11,
    fontFamily: "OpenSans-Regular",
    marginVertical: 6,
    fontWeight: "bold",
    // marginTop: 15,
    padding: 5
  },
  textTitle: {
    fontSize: 11,
    fontFamily: "OpenSans-Regular",
    fontWeight: "bold",
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
  textDescrBold: {
    fontSize: 11,
    fontFamily: "OpenSans-Regular",
    marginVertical: 6,
    fontWeight: "bold",
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
    // justifyContent: "center",
    // alignItems: "center",
    // alignSelf: "center",
    borderWidth: 5,
  },
};

export default withNavigation(RecapFriendRequestReceived);
