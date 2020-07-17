/**
 * ArrowImageMatch è il componente per visualizzare l'immagine con le frecce per indicare chi vince 
 * @push
 */

import React from "react";
import {
    View,
    Dimensions,
    StyleSheet,
    Image,
    Platform
} from "react-native";

import { connect } from "react-redux";

import { citiesImage, imagesCity } from "./../../components/FriendItem/FriendItem";
import Svg, {

    Polygon
} from 'react-native-svg';


import { getCurrentMatchState } from "./../../domains/screen/Selectors";

class ArrowImageMatch extends React.PureComponent {
    constructor(props) {
        super(props);
    }






    render() {

        id = citiesImage(this.props.city);
        let colorWin = "rgba(255, 255, 255, 0.4)"
        let colorLose = "rgba(255, 255, 255, 0.4)"
        // rgba(255, 255, 255, 1)
        if (this.props.match) {
            const Home = this.props.match.season_match.city_home.city_name == this.props.city
            if (this.props.match.total_point_home == this.props.match.total_point_away) {
                // punteggio uguale, non cambia nulla 
            }
            else if (Home) {
                // se sono dentro casa 
                const HomeWin = this.props.match.total_point_home >
                    this.props.match.total_point_away

                colorWin = HomeWin ? "rgba(255, 255, 255, 1)" : "rgba(255, 255, 255, 0.4)"
                colorLose = !HomeWin ? "rgba(255, 255, 255, 1)" : "rgba(255, 255, 255, 0.4)"

            } else {
                // se sono fuori casa 
                const HomeWin = this.props.match.total_point_home >
                    this.props.match.total_point_away

                colorWin = !HomeWin ? "rgba(255, 255, 255, 1)" : "rgba(255, 255, 255, 0.4)"
                colorLose = HomeWin ? "rgba(255, 255, 255, 1)" : "rgba(255, 255, 255, 0.4)"
            }




        }

        return (


            <View
                style={{
                    width: 90,
                    height: 72,
                    paddingTop: 8,


                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center"
                }}
            >


                <Image
                    source={imagesCity[id]}
                    style={{
                        width: 45,
                        height: 45
                    }}
                />
                <Svg
                   height="70"
                    width="45"
                >
                    <Polygon
                        // points="8,0 16,18 0,18"
                        // points="8,12 16,30 0,30"
                        // points="13,12 21,30 5,30"
                        points="13,21 18,33 8,33"
                        fill={colorWin}
                    />
                    <Polygon
                        // points="12,46 22,30 2,30"
                        // points="13,58 21,40 5,40"
                        // points="13,52 18,40 8,40"
                        points="13,49 18,37 8,37"
                        fill={colorLose}
                    />
                </Svg>


            </View>
        );
    }
}


const tournament = connect(state => {

    // prendo le info del match corrente
    return {
        match: getCurrentMatchState(state)
    };

});

export default tournament(ArrowImageMatch);

export const styles = StyleSheet.create({
    Container: {
        height: 140,
        width: Dimensions.get("window").width,
        backgroundColor: "transparent",
        position: "absolute",
        flexDirection: "column",
        justifyContent: "space-around",
        alignItems: "center"
    },
    gradientContainer: {
        zIndex: -2,
        position: "absolute",
        top: 0,
        width: Dimensions.get("window").width,
        height:
            Platform.OS === "ios"
                ? Dimensions.get("window").height * 0.25 + 86
                : Dimensions.get("window").height * 0.25 +
                Dimensions.get("window").height * 0.1
    },
    gradientContainerResult: {
        position: "absolute",
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height * 0.25,
        backgroundColor: "transparent",
        top: 0
    },
    gradientContainerCurve: {
        position: "absolute",
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height * 0.1,
        backgroundColor: "transparent",
        top: Dimensions.get("window").height * 0.25
    },
    gradientContainerImageSun: {
        position: "absolute",
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height * 0.1,
        backgroundColor: "#fff",
        top:
            Platform.OS === "ios"
                ? Dimensions.get("window").height * 0.25 + 86
                : Dimensions.get("window").height * 0.25 +
                Dimensions.get("window").height * 0.1
    },
    gradientContainerImageBicycle: {
        position: "absolute",
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height * 0.2,
        backgroundColor: "#fff",
        top: Dimensions.get("window").height * 0.45
    },
    gradientContainerListActivity: {
        position: "absolute",
        zIndex: 1,
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,
        top: Dimensions.get("window").height * 0.3
    },
    gradientContainerTextContainer: {
        position: "absolute",
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height * 0.25,
        backgroundColor: "#fff",
        top: Dimensions.get("window").height * 0.65
    },
    sunContainer: {
        position: "absolute",
        width: 50,
        height: 50,
        backgroundColor: "transparent"
    },
    centerContainer: {
        alignItems: "center",
        paddingTop: 10,
        height: 40,
        width: Dimensions.get("window").width * 0.9,
        justifyContent: "space-between",
        flexDirection: "row"
    },
    ThreeContainer: {
        width: Dimensions.get("window").width,
        height: 90,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    circle: {
        width: 16,
        height: 16,
        borderColor: "#fff",
        borderWidth: 1,
        borderRadius: 10,
        marginTop: 15
    },
    leftContainer: {
        width: Dimensions.get("window").width * 0.35,
        height: Dimensions.get("window").height * 0.23,
        backgroundColor: "transparent",
        position: "absolute",
        left: Dimensions.get("window").width * 0.65,
        justifyContent: "center",
        alignItems: "flex-start"
    },
    line: {
        width: "100%",
        height: 2,
        backgroundColor: "#fff",
        marginTop: 45
    }
});
