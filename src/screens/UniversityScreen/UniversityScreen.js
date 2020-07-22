import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  ImageBackground,
  Image,
  ScrollView
} from "react-native";
import { strings } from "../../config/i18n";
import { getUniversityImg } from "./../ChooseTeamScreen/ChooseTeamScreen";

class TeamScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.university = null;
    this.tournament_qualification_id = null;
    this.tournament = null;
    this.tournament_qualification = null;
  }

  componentWillMount() {
    try {
      this.university = this.props.navigation.state.params.university;
      this.tournament_qualification_id = this.props.navigation.state.params.tournament_qualification_id;
      this.tournament_qualification = this.props.navigation.state.params.tournament_qualification;
      this.tournament = this.props.navigation.state.params.tournament;
    } catch (error) {
      this.university = this.props.university;
    }
  }

  renderLogo() {
    return (
      <View style={{ marginTop: 15 }}>
        <ImageBackground
          style={{
            width: Dimensions.get("window").width * 0.7,
            height: Dimensions.get("window").width * 0.7,
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row"
          }}
          source={require("./../../assets/images/cities/team_live_bg_sx.png")}
        >
          <Image
            style={{
              width: Dimensions.get("window").width * 0.7 - 60,
              height: Dimensions.get("window").width * 0.7 - 60
            }}
            source={getUniversityImg(this.university.logo)}
          />
        </ImageBackground>
      </View>
    );
  }

  renderText() {
    return (
      <View
        style={{
          width: Dimensions.get("window").width * 0.85,

          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <Text
          style={{
            marginTop: 11,
            fontFamily: "Montserrat-ExtraBold",
            fontWeight: "bold",
            color: "#fff",
            fontSize: 26,
            textAlign: "center"
          }}
        >
          {this.university.name.toLocaleUpperCase()}
        </Text>
        <Text
          style={{
            marginTop: 3,
            fontFamily: "Montserrat-Regular",
            fontWeight: "400",
            color: "#fff",
            fontSize: 14,
            textAlign: "center"
          }}
        >
          {this.university.description}
        </Text>
        <Text
          style={{
            marginTop: 16,
            fontFamily: "OpenSans-Regular",
            fontWeight: "400",
            color: "#fff",
            fontSize: 14,
            textAlign: "center"
          }}
        >
          {/* {"Maecenas sed diam Eget risus varius blandit sit amet non magna."} */}
          {strings("id_2_09")}
        </Text>
      </View>
    );
  }

  renderBtn() {
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          this.props.navigation.navigate("WaitingUniversityScreen", {
            university: this.university,
            tournament_qualification_id: this.tournament_qualification.id,
            tournament_qualification: this.tournament_qualification,
            tournament: this.tournament
          });
        }}
      >
        <View
          style={{
            width: Dimensions.get("window").width * 0.4,
            height: 45,
            borderWidth: 1,
            borderColor: "#fff",
            borderRadius: 25,
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <Text
            style={{
              fontFamily: "OpenSans-Regular",
              fontWeight: "bold",
              color: "#fff",
              fontSize: 13
            }}
          >
            {strings("id_2_10").toLocaleUpperCase()}
          </Text>
        </View>
      </TouchableWithoutFeedback>
    );
  }

  render() {
    let backgroundColor = this.university.color;
    return (
      <ImageBackground
        source={require("./../../assets/images/cities/city_page_bg.png")}
        style={{
          width: Dimensions.get("window").width,
          height: Dimensions.get("window").height,
          backgroundColor,
          justifyContent: "flex-start",
          alignItems: "center"
        }}
      >
        <ScrollView
          contentContainerStyle={{
            width: Dimensions.get("window").width,
            height: Dimensions.get("window").height + 200,

            justifyContent: "flex-start",
            alignItems: "center"
          }}
        >
          <View
            style={{
              width: Dimensions.get("window").width,
              height: Dimensions.get("window").height * 0.7,
              justifyContent: "space-around",
              alignItems: "center"
            }}
          >
            {this.renderLogo()}
            {this.renderText()}
            {this.renderBtn()}
          </View>
          <View
            style={{
              width: Dimensions.get("window").width,
              height: Dimensions.get("window").height * 0.3 + 200
            }}
          ></View>
        </ScrollView>
      </ImageBackground>
    );
  }
}

export default TeamScreen;
