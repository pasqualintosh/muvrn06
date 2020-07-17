import React from "react";
import { Text, Dimensions, Platform, View, ScrollView } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import OwnIcon from "../../components/OwnIcon/OwnIcon";
import { connect } from "react-redux";
import { createSelector } from "reselect";
import { getMostFrequentRoute } from "./../../domains/login/ActionCreators";
import CityScreenCards from "./..//CityScreenCards/CityScreenCards";

import { strings } from "../../config/i18n";

class CityDetailScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
     
    };
  }
  
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: (
        <Text
          style={{
            left: Platform.OS == "android" ? 20 : 0
          }}
        >
          {strings("profile")}
        </Text>
      )
    };
  };

  componentWillMount() {
    // this.props.dispatch(getStats());
  }

  render() {
   
        const city = this.props.navigation.getParam("city", 6);
        const cityName = this.props.navigation.getParam("cityName", "palermo");
        const city_id = this.props.navigation.getParam("cityId", 0);
        
    
    return (
      <View
        style={{
          width: Dimensions.get("window").width,
          height: Dimensions.get("window").height,
          backgroundColor: "transparent"
        }}
      >
        <LinearGradient
          start={{ x: 0.0, y: 0.0 }}
          end={{ x: 0.0, y: 1.0 }}
          locations={[0, 1.0]}
          colors={["#6C6C6C", "#3D3D3D"]}
          style={{
            width: Dimensions.get("window").width,
            height: Dimensions.get("window").height
          }}
        >
          <ScrollView
            style={{
              width: Dimensions.get("window").width,
              height: Dimensions.get("window").height
            }}
            showsVerticalScrollIndicator={false}
            ref={ref => (this.ref = ref)}
          >
            

            <CityScreenCards
              city={cityName.toUpperCase()}
              cityId={city}
              city_id={city_id}
            />
            <View
              style={{
                height: 200,
                backgroundColor: "transparent"
              }}
            />
          </ScrollView>
        </LinearGradient>
      </View>
    );
  }
}


export default CityDetailScreen;
