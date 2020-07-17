// componente per visualizzare lo sponsor del torneo

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
  TouchableHighlight,
  ActivityIndicator
} from "react-native";

import { strings } from "../../config/i18n";

import LinearGradient from "react-native-linear-gradient";
import Aux from "./../../helpers/Aux";
import { styles } from "./Style";

class SponsorTournament extends React.PureComponent {
  //  {/* +"!\n" */}

  detailSponsor = () => {
    this.props.navigation.navigate('DetailSponsorTournamentScreenBlur')
    
  }
  render() {
    return (
      <View>
        <ImageBackground
          source={require("../../assets/images/wave/sponsor_tournament_bg.png")}
          style={styles.backgroundImage}
        >
        <View style={{ width: Dimensions.get("window").width * 0.9, height: 90,  flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between" }}>
          <Text style={styles.globalSponsor}>GLOBAL SPONSOR</Text>
          <Image
                  style={{
                    width: 59,
                    height: 35,
                    marginBottom: 15
                   
                    
                  }}
                  
                  source={require("../../assets/images/sponsor_crown.png")}
                />
        </View>
        </ImageBackground>

        <LinearGradient
          start={{ x: 0.0, y: 0.0 }}
          end={{ x: 0.0, y: 1.0 }}
          locations={[0, 1.0]}
          colors={["#0370BA", "#014fa0"]}
          style={styles.linearGradient}
        >
          <View style={styles.sponsorContainer}>
          <View style={{ flexDirection: "column", alignContent: "center", justifyContent: 'center', alignSelf: "center"}}>
          <Image
                  style={{
                    width: 60,
                    height: 60,
                    marginLeft: 15,
                    marginRight: 15,
                    alignItems: "center",
                    alignContent: "center",
                   
                   
                    
                  }}
                  
                  source={require("../../assets/images/rewards/art.png")}
                />
                </View>
                
            <View style={{ width: Dimensions.get("window").width * 0.9 - 100 - Dimensions.get("window").width * 0.2, flexDirection: "column", alignContent: "center", justifyContent: 'center' }}>
            <Text
                    style={{
                      fontFamily: "Montserrat-ExtraBold",
    marginVertical: 5,
                      color: "#FFFFFF",
                      fontSize: 15,
                      textAlign: "left"
                    }}
                  >
                   AIRLITE
                  </Text>
                  <Text
                    style={{
                      fontFamily: "OpenSans-Bold",
                      marginVertical: 5,
                      color: "#FFFFFF",
                      fontSize: 13,
                      textAlign: "left"
                    }}
                  >
                   {strings('we_want_to_rewa')}
                  </Text>
             
                
              
            </View>
            <View style={{ width:  Dimensions.get("window").width * 0.2, flexDirection: "row", alignContent: "center", justifyContent: 'flex-end', alignItems: "center"}}>
            
            <LinearGradient
                    start={{ x: 0.0, y: 0.0 }}
                    end={{ x: 0.0, y: 1.0 }}
                    locations={[0, 1.0]}
                    colors={["#F8B126", "#FFCB03"]}
                    style={styles.button}
                  >
                    <TouchableHighlight
                      onPress={this.detailSponsor}
                      style={{
                        width: Dimensions.get("window").width * 0.17,
                        height: 30,
                        borderRadius: 5,
                        alignItems: "center"
                      }}

                      // disabled={this.props.status === "Inviting" ? true : false}
                    >
                      <View
                        style={{
                          flex: 1,
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                      >
                        <Text
                          style={{
                            // margin: 10,
                            color: "#0A55A1",
                            fontFamily: "OpenSans-Regular",
                            fontWeight: "400",
                            fontSize: 14
                          }}
                        >
                          {strings('show')}
                        </Text>
                      </View>
                    </TouchableHighlight>
                  </LinearGradient>
                  </View>
          </View>
          

          
                </LinearGradient>
                  <ImageBackground
          source={require("../../assets/images/wave/sponsor_tournament_bg_bottom_wave.png")}
          style={styles.backgroundImage}
        />
      </View>
    );
  }
}

export default SponsorTournament;
