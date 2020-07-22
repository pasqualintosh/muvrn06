import React from "react";
import { Text, Dimensions, Platform, View, ScrollView } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import OwnIcon from "../../components/OwnIcon/OwnIcon";
import { connect } from "react-redux";
import { createSelector } from "reselect";
import { getMostFrequentRoute } from "./../../domains/login/ActionCreators";
import CityScreenCards from "./..//CityScreenCards/CityScreenCards";
import CO2Wave from "../../components/CO2Wave/CO2Wave";
import UserItemCommunity from "../../components/UserItemCommunity/UserItemCommunity";


import { strings } from "../../config/i18n";

class CommunityDetailScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
     
    };
  }
  


  componentWillMount() {
    // this.props.dispatch(getStats());
  }

  render() {
   
        const city = this.props.navigation.getParam("city", 0);
        const cityName = this.props.navigation.getParam("communutyName", "Eni");
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
          <View style={{ position: 'absolute', top: Dimensions.get("window").height * 0.55 - 140}}>
            <CO2Wave CO2={1234} type={'Community'}></CO2Wave>
            
          
           <UserItemCommunity 
             navigation={this.props.navigation}
                   
                    user={{
                      referred_route__user__avatar: 1,
                      position: 1,
                      id: 1,
                      referred_route__user__first_name: 'a',
                      referred_route__user__last_name: 'b',
                      points: 1000
                    }}
                    
                   
           />
           <UserItemCommunity 
             navigation={this.props.navigation}
                   
                    user={{
                      referred_route__user__avatar: 2,
                      position: 2,
                      id: 2,
                      referred_route__user__first_name: 'afdgreg',
                      referred_route__user__last_name: 'bdgergreg',
                      points: 1000
                    }}
                    
                   
           />
           <UserItemCommunity 
             navigation={this.props.navigation}
                   
                    user={{
                      referred_route__user__avatar: 3,
                      position: 3,
                      id: 3,
                      referred_route__user__first_name: 'dfhgrthtrhergerg',
                      referred_route__user__last_name: 'begrergergrg',
                      points: 1000
                    }}
                    
                   
           />
           
            </View>

            <CityScreenCards
              city={cityName.toUpperCase()}
              cityId={city}
              city_id={city_id}
            />
            
            <View
              style={{
                height: 264 + 200 + 300,
                backgroundColor: "trasparent",
              }}
            />
          </ScrollView>
        </LinearGradient>
      </View>
    );
  }
}




export default CommunityDetailScreen;
