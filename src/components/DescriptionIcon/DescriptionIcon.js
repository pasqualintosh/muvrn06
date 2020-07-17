// DescriptionIcon

import React from "react";
import { View, Text, Dimensions, StyleSheet } from "react-native";

import { Input } from "react-native-elements";

import Modal from "react-native-modal";

import { strings } from "../../config/i18n";

class DescriptionIcon extends React.Component {
  constructor() {
    super();
    this.state = {
      active: false
    };
  }

  _renderModalContent = () => {
    let title = "";
    let text = "If the weather sucks, your points raise up!";

    if (this.props.icon === "series_icn") {
      title = strings("dedication_mult");
      text = strings("play_muv_many_d");
    } else if (this.props.icon === "rush_hour_icn") {
      title = strings("traffic_multipl");
      text = strings("if_traffic_is_a");
    } else if (this.props.icon === "infoCityTournament") {
      title = strings("just_train_now_");
      text = strings("just_imagine_to");
    } else if (this.props.icon === "info_walk") {
      title = strings("that_s_the_best");
      text = strings("the_whole_plane");
    } else if (this.props.icon === "info_public") {
      title = strings("mass_transport_");
      text = strings("getting_around_");
    } else if (this.props.icon === "info_bike") {
      title = strings("cyclist___geniu");
      text = strings("speeding_around");
    } else if (this.props.icon === "trainingOne") {
      title = strings("welcome__newbie");
      text = strings("and_the_old_mas");
    } else if (this.props.icon === "trainingTwo") {
      title = strings("rookies_know_ho");
      text = strings("and_the_old_mas");
    } else if (this.props.icon === "trainingThree") {
      title = strings("muv_is_a_profes");
      text = strings("and_the_old_mas");
    } else if (this.props.icon === "trainingFour") {
      title = strings("now_you_shine");
      text = strings("and_the_old_mas");
    } else if (this.props.icon === "trainingActive") {
      title = strings("yes_you_can_");
      text = strings("and_the_old_mas");
    } else if (this.props.icon === "infoTrophies") {
      // title =  strings("descinfoTrophiesTitle;
      // text =  strings("descinfoTrophies;
      title = strings("this_is_your_pe");
      text = strings("here_the_collec");
    } else if (this.props.icon === "infoNoTrophies") {
      // title =  strings("descinfoNoTrophiesTitle;
      // text =  strings("descinfoNoTrophies;
      title = strings("this_is_your_pe");
      text = strings("if_you_want_to_");
    } else if (this.props.icon === "infoCoins") {
      title = strings("total_amount_of");
      text = strings("some_accomplish");
    } else if (this.props.icon === "infoPoints") {
      title = strings("total_amount_of");
      text = strings("this_number_is_");
    } else if (this.props.icon === "infoWeek") {
      title = strings("the_best_challe");
      text = strings("with_muv_you_ha");
    } else if (this.props.icon === "tournamentInfo") {
      title = "The match rules are simple (and fair!).";
      text = "The City's score is the sum of the 3 best players points plus the avarege points made by all the other City members. And remember: Greater numbers of MUVers means larger bonus!";
    } else {
      title = strings("weather_multipl");
      text = strings("if_the_weather_");
    }
    

    return (
      <View
        style={[
          styles.modalContent,
          {
            flexDirection: "column",
            alignContent: "space-between",
            alignItems: "center",
            justifyContent: "space-around"
          }
        ]}
      >
        <View style={{ width: Dimensions.get("window").width * 0.9 }}>
          <Text style={styles.title}>{title}</Text>
        </View>
        <View style={{ paddingTop: 20, paddingBottom: 20 }}>
          <Text style={styles.text}>{text}</Text>
        </View>
      </View>
    );
  };

  render() {
    return (
      <View
        style={{
          alignContent: "center",
          justifyContent: "center"
        }}
      >
        <Modal
          isVisible={this.props.active}
          onBackdropPress={() => this.props.DeleteDescriptionIconModal()}
          onBackButtonPress={() => this.props.DeleteDescriptionIconModal()}
        >
          {this._renderModalContent()}
        </Modal>
      </View>
    );
  }
}

export default DescriptionIcon;

const styles = StyleSheet.create({
  title: {
    textAlign: "center",
    fontWeight: "bold"
  },
  text: {
    textAlign: "left"
  },
  other: {
    flex: 1,
    height: Dimensions.get("window").height * 0.1,
    flexDirection: "row",
    borderBottomColor: "#5F5F5F",
    borderBottomWidth: 0.3,
    backgroundColor: "#fff"
  },

  Right: {
    alignSelf: "center",
    right: 20,
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    fontSize: 13,
    color: "#3D3D3D"
  },
  RightAndroid: {
    alignSelf: "center",
    right: 10
  },
  rightText: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    fontSize: 13,
    color: "#3D3D3D"
  },

  modalContent: {
    backgroundColor: "white",
    padding: 22,

    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)"
  },
  modalContentAndroid: {
    width: 120,
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)"
  },
  buttonConferm: {
    backgroundColor: "lightblue",
    padding: 12,
    margin: 16,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)"
  },
  buttonConfermWhite: {
    padding: 12,
    margin: 16,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4
  },
  sfondo: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height
  },
  buttonText: {
    fontSize: 18,
    fontFamily: "Gill Sans",
    textAlign: "center",
    margin: 10,
    color: "#ffffff",
    backgroundColor: "transparent"
  },
  image: {
    width: Dimensions.get("window").width / 2,
    height: Dimensions.get("window").height / 3
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around"
  },
  button: {
    width: Dimensions.get("window").width / 1.5,
    height: Dimensions.get("window").height / 20,
    borderRadius: 5,
    alignItems: "center",
    shadowRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    elevation: 2
  },
  buttonConfermClick: {
    width: Dimensions.get("window").width / 1.5,
    height: Dimensions.get("window").height / 20,
    borderRadius: 5,
    alignItems: "center",
    shadowRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    elevation: 2
  },
  buttonLoginSocial: {
    width: Dimensions.get("window").width / 2.3,
    height: Dimensions.get("window").height / 20,
    borderRadius: 5,
    shadowRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    elevation: 2
  },
  login: {
    alignItems: "center",

    borderColor: "#f7f8f9",
    borderWidth: 1
  },
  buttonPrecedente: {
    width: Dimensions.get("window").width / 1.5,
    height: Dimensions.get("window").height / 20,
    alignItems: "center",
    margin: 10
  },
  icon: {
    margin: 10,
    width: Dimensions.get("window").width / 13,
    height: Dimensions.get("window").height / 40
  }
});
