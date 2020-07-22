// componente per visualizzare un onda che permette di invitare degli amici

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
  TouchableOpacity,
  ActivityIndicator
} from "react-native";

import { strings } from "../../config/i18n";
import AutoAnimation from "./../../components/AutoAnimation/AutoAnimation";
import SVGFrequentTripIcon from "./../../components/SVGFrequentTripIcon/SVGFrequentTripIcon";
import {
  citiesImage,
  imagesCity
} from "../../components/FriendItem/FriendItem";
import { styles } from "./Style";
import Aux from "./../../helpers/Aux";
import OwnIcon from "./../../components/OwnIcon/OwnIcon";
import { frequentTripsHomeWork } from "../../domains/login/Selectors";
import { connect } from "react-redux";
import { getProfile } from "./../../domains/login/Selectors";

function roundOf(n, p) {
  const n1 = n * Math.pow(10, p + 1);
  const n2 = Math.floor(n1 / 10);
  if (n1 >= n2 * 10 + 5) {
    return (n2 + 1) / Math.pow(10, p);
  }
  return n2 / Math.pow(10, p);
}

function round(value, decimals) {
  return Number(Math.round(value + "e" + decimals) + "e-" + decimals);
}

function roundUsing(func, number, prec) {
  var tempnumber = number * Math.pow(10, prec);
  tempnumber = func(tempnumber);
  return tempnumber / Math.pow(10, prec);
}

class CO2Wave extends React.PureComponent {
  componentWillMount() {
    // this.generateShortUrl();
  }

  constructor() {
    super();

    this.state = {};
  }

  addFrequent() {
    return (
      <View
        style={{
          width: 18,
          height: 18,
          borderRadius: 15
        }}
      >
        <TouchableOpacity
          style={{
            backgroundColor: "#E83475",
            height: 18,
            width: 18,
            borderRadius: 15,
            alignItems: "center",
            shadowRadius: 5,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 5 },
            shadowOpacity: 0.5,
            elevation: 2,
            justifyContent: "center",
            alignItems: "center"
          }}
          onPress={() => {
            this.props.navigation.navigate("ChangeFrequentTripScreen");
          }}
        >
          {/* <Svg height="18" width="18" viewBox="0 0 100 100" fill="white">
            <Line
              x1="50"
              y1="25"
              x2="50"
              y2="75"
              stroke="white"
              strokeWidth="2"
            />
            <Line
              x1="25"
              y1="50"
              x2="75"
              y2="50"
              stroke="white"
              strokeWidth="2"
            />
          </Svg> */}
          <OwnIcon name="add_icn" size={18} color="#F7F8F9" />
        </TouchableOpacity>
      </View>
    );
  }

  testoC02 = testo => {
    const testoSplit = testo.split("CO2");
    let first_part = "";
    let second_part = "";
    for (index = 0; index < testoSplit.length; index++) {
      if (index) {
        second_part += testoSplit[index];
      } else {
        first_part += testoSplit[index];
      }
    }
    return (
      <Text
        style={{
          fontFamily: "OpenSans-Regular",
          fontWeight: "400",
          color: "#3D3D3D",
          fontSize: 12,
          textAlign: "left"
        }}
      >
        {first_part}
        <Text
          style={{
            fontFamily: "OpenSans-Regular",
            fontWeight: "400",
            color: "#3D3D3D",
            fontSize: 12,
            textAlign: "left"
          }}
        >
          {" CO"}
        </Text>
        <Text
          style={{
            fontFamily: "OpenSans-Regular",
            fontWeight: "400",
            color: "#3D3D3D",
            fontSize: 6,
            textAlign: "left"
          }}
        >
          {"2 "}
        </Text>
        {second_part}
      </Text>
    );
  };

  testoC02Certific = testo => {
    const testoSplit = testo.split("CO2");
    let first_part = "";
    let second_part = "";
    for (index = 0; index < testoSplit.length; index++) {
      if (index) {
        second_part += testoSplit[index];
      } else {
        first_part += testoSplit[index];
      }
    }
    return (
      <Text
        style={{
          fontFamily: "Montserrat-ExtraBold",
          color: "#3D3D3D",
          fontSize: 20,
          textAlign: "center"
        }}
      >
        {first_part}
        <Text
          style={{
            fontFamily: "Montserrat-ExtraBold",
            color: "#3D3D3D",
            fontSize: 20,
            textAlign: "center"
          }}
        >
          {" CO"}
        </Text>
        <Text
          style={{
            fontFamily: "Montserrat-ExtraBold",
            color: "#3D3D3D",
            fontSize: 8,
            textAlign: "center"
          }}
        >
          {"2 "}
        </Text>
        {second_part}
      </Text>
    );
  };

  goToCity = (id, city) => {
    this.props.navigation.navigate("CityDetailScreenBlurFromGlobal", {
      city: id,
      cityName: city,
      cityId: this.props.infoProfile.city ? this.props.infoProfile.city.id : 0
    });
  };

  //  {/* +"!\n" */}

  render() {
    let city = this.props.infoProfile
      ? this.props.infoProfile.city
        ? this.props.infoProfile.city.city_name
          ? this.props.infoProfile.city.city_name
          : ""
        : ""
      : "";
    let id = citiesImage(city);
    return (
      <View>
        <ImageBackground
          source={require("../../assets/images/wave/green_wave_top.png")}
          style={styles.backgroundImageTop}
        />
        <View style={styles.View}>
          <View style={styles.FirstView}>
            <Text
              style={{
                fontFamily: "Montserrat-ExtraBold",
                color: "#fff",
                fontSize: 20,
                textAlign: "center"
              }}
            >
              {strings("id_5_07").toUpperCase()}
            </Text>
          </View>

          <View style={styles.SecondView}>
            <View
              style={{
                width: Dimensions.get("window").width * 0.9,
                flexDirection: "row",
                alignContent: "center",
                alignItems: "center"
              }}
            >
              <View
                style={{
                  width: Dimensions.get("window").width * 0.9 - 90
                }}
              >
                <Text>
                  <Text
                    style={{
                      fontFamily: "OpenSans-Regular",
                      fontWeight: "700",
                      color: "#FFFFFF",
                      fontSize: 12,
                      textAlign: "left"
                    }}
                  >
                    {strings("id_5_08")}
                  </Text>
                  <Text
                    style={{
                      fontFamily: "OpenSans-Regular",
                      fontWeight: "400",
                      color: "#FFFFFF",
                      fontSize: 12,
                      textAlign: "left"
                    }}
                  >
                    {"\n" + strings("id_5_09")}
                  </Text>
                </Text>
              </View>
              <View
                style={{
                  width: 10,
                  height: 10
                }}
              />
              <View
                style={{
                  flexDirection: "column",
                  width: 80,
                  alignContent: "flex-end",
                  justifyContent: "center",
                  alignItems: "flex-end"
                }}
              >
                <View>
                  <Text>
                    <Text
                      style={{
                        fontFamily: "Montserrat-ExtraBold",
                        color: "#3D3D3D",
                        fontSize: 10,
                        textAlign: "left"
                      }}
                    >
                      CO
                    </Text>
                    <Text
                      style={{
                        fontFamily: "Montserrat-ExtraBold",
                        color: "#3D3D3D",
                        fontSize: 7,
                        textAlign: "left"
                      }}
                    >
                      2
                    </Text>
                  </Text>
                  <Text>
                    <Text
                      style={{
                        fontFamily: "Montserrat-ExtraBold",
                        color: "#FFFFFF",
                        fontSize: 25,
                        textAlign: "left"
                      }}
                    >
                      {roundUsing(Math.floor, this.props.CO2, 1)
                        .toString()
                        .replace(".", ",")}
                    </Text>
                    <Text
                      style={{
                        fontFamily: "OpenSans-Regular",
                        fontWeight: "400",
                        color: "#FFFFFF",
                        fontSize: 10,
                        textAlign: "left"
                      }}
                    >
                      Kg
                    </Text>
                  </Text>
                </View>
              </View>
            </View>

            <AutoAnimation />
          </View>
        </View>
        <ImageBackground
          source={require("../../assets/images/wave/green_wave_bottom.png")}
          style={styles.backgroundImageBottom}
        />
      </View>
    );
  }

  noRender() {
    if (this.props.type == "Community") {
      return (
        <View>
          <ImageBackground
            source={require("../../assets/images/wave/green_wave_top.png")}
            style={styles.backgroundImageTop}
          />
          <View style={styles.PaddingView}></View>
          <View style={styles.View}>
            <View style={styles.FirstView}>
              <Text
                style={{
                  fontFamily: "Montserrat-ExtraBold",
                  color: "#fff",
                  fontSize: 20,
                  textAlign: "center"
                }}
              >
                {strings("id_5_07").toUpperCase()}
              </Text>
            </View>

            <View style={styles.SecondView}>
              <View
                style={{
                  width: Dimensions.get("window").width * 0.9,
                  flexDirection: "row",

                  alignContent: "center",
                  alignItems: "center"
                }}
              >
                <View
                  style={{
                    width: Dimensions.get("window").width * 0.9 - 90
                  }}
                >
                  <Text>
                    <Text
                      style={{
                        fontFamily: "OpenSans-Regular",
                        fontWeight: "700",
                        color: "#FFFFFF",
                        fontSize: 12,
                        textAlign: "left"
                      }}
                    >
                      {strings("muvers__who_hav")}
                    </Text>
                  </Text>
                </View>
                <View
                  style={{
                    width: 10,
                    height: 10
                  }}
                />
                <View
                  style={{
                    flexDirection: "column",
                    width: 80,
                    alignContent: "flex-end",
                    justifyContent: "center",
                    alignItems: "flex-end"
                  }}
                >
                  <View>
                    <Text>
                      <Text
                        style={{
                          fontFamily: "Montserrat-ExtraBold",
                          color: "#3D3D3D",
                          fontSize: 10,
                          textAlign: "left"
                        }}
                      >
                        CO
                      </Text>
                      <Text
                        style={{
                          fontFamily: "Montserrat-ExtraBold",
                          color: "#3D3D3D",
                          fontSize: 7,
                          textAlign: "left"
                        }}
                      >
                        2
                      </Text>
                    </Text>
                    <Text>
                      <Text
                        style={{
                          fontFamily: "Montserrat-ExtraBold",
                          color: "#FFFFFF",
                          fontSize: 25,
                          textAlign: "left"
                        }}
                      >
                        {parseInt(this.props.CO2)}
                      </Text>
                      <Text
                        style={{
                          fontFamily: "OpenSans-Regular",
                          fontWeight: "400",
                          color: "#FFFFFF",
                          fontSize: 10,
                          textAlign: "left"
                        }}
                      >
                        g
                      </Text>
                    </Text>
                  </View>
                </View>
              </View>
              <AutoAnimation />
            </View>
          </View>

          {this.props.HomeWork ? (
            <ImageBackground
              source={require("../../assets/images/wave/green_wave_bottom.png")}
              style={styles.backgroundImageBottom}
            />
          ) : (
            <View>
              <View style={styles.backgroundWhiteImageBottom}>
                <ImageBackground
                  source={require("../../assets/images/wave/green_wave_bottom.png")}
                  style={styles.backgroundImageBottom}
                />
              </View>
              <View
                style={{
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  alignContent: "center",
                  backgroundColor: "#FFFFFF",

                  width: Dimensions.get("window").width
                }}
              >
                <View style={styles.OtherView}>
                  <Text>{this.testoC02Certific(strings("certified_co2"))}</Text>
                </View>
                <View>
                  <View
                    style={{
                      width: Dimensions.get("window").width * 0.9,
                      paddingBottom: 20,
                      paddingTop: 20,
                      flexDirection: "row",
                      alignContent: "center",
                      alignItems: "center"
                    }}
                  >
                    <SVGFrequentTripIcon />
                    <View
                      style={{
                        width: Dimensions.get("window").width * 0.9 - 90
                      }}
                    >
                      {this.testoC02(strings("share_your_home"))}
                    </View>
                    <View
                      style={{
                        width: 10,
                        height: 10
                      }}
                    />
                    {this.addFrequent()}
                  </View>
                </View>
              </View>
              <ImageBackground
                source={require("../../assets/images/wave/white_wave_bottom.png")}
                style={styles.backgroundImageBottom}
              />
            </View>
          )}
        </View>
      );
    }
    if (this.props.type == "City") {
      return (
        <View>
          <ImageBackground
            source={require("../../assets/images/wave/green_wave_top.png")}
            style={styles.backgroundImageTop}
          />
          <View style={styles.View}>
            <View style={styles.FirstView}>
              <Text
                style={{
                  fontFamily: "Montserrat-ExtraBold",
                  color: "#fff",
                  fontSize: 20,
                  textAlign: "center"
                }}
              >
                {strings("id_5_07").toUpperCase()}
              </Text>
            </View>

            <View style={styles.SecondView}>
              <View
                style={{
                  width: Dimensions.get("window").width * 0.9,
                  flexDirection: "row",

                  alignContent: "center",
                  alignItems: "center"
                }}
              >
                <View
                  style={{
                    width: Dimensions.get("window").width * 0.9 - 90
                  }}
                >
                  <Text>
                    <Text
                      style={{
                        fontFamily: "OpenSans-Regular",
                        fontWeight: "700",
                        color: "#FFFFFF",
                        fontSize: 12,
                        textAlign: "left"
                      }}
                    >
                      {strings("muvers__who_hav")}
                    </Text>
                  </Text>
                </View>
                <View
                  style={{
                    width: 10,
                    height: 10
                  }}
                />
                <View
                  style={{
                    flexDirection: "column",
                    width: 80,
                    alignContent: "flex-end",
                    justifyContent: "center",
                    alignItems: "flex-end"
                  }}
                >
                  <View>
                    <Text>
                      <Text
                        style={{
                          fontFamily: "Montserrat-ExtraBold",

                          color: "#3D3D3D",
                          fontSize: 10,
                          textAlign: "left"
                        }}
                      >
                        CO
                      </Text>
                      <Text
                        style={{
                          fontFamily: "Montserrat-ExtraBold",
                          color: "#3D3D3D",
                          fontSize: 7,
                          textAlign: "left"
                        }}
                      >
                        2
                      </Text>
                    </Text>
                    <Text>
                      <Text
                        style={{
                          fontFamily: "Montserrat-ExtraBold",
                          color: "#FFFFFF",
                          fontSize: 25,
                          textAlign: "left"
                        }}
                      >
                        {parseInt(this.props.CO2)}
                      </Text>
                      <Text
                        style={{
                          fontFamily: "OpenSans-Regular",
                          fontWeight: "400",
                          color: "#FFFFFF",
                          fontSize: 10,
                          textAlign: "left"
                        }}
                      >
                        g
                      </Text>
                    </Text>
                  </View>
                </View>
              </View>
              <AutoAnimation />
            </View>
          </View>

          {this.props.HomeWork ? (
            <ImageBackground
              source={require("../../assets/images/wave/green_wave_bottom.png")}
              style={styles.backgroundImageBottom}
            />
          ) : (
            <View>
              <View style={styles.backgroundWhiteImageBottom}>
                <ImageBackground
                  source={require("../../assets/images/wave/green_wave_bottom.png")}
                  style={styles.backgroundImageBottom}
                />
              </View>
              <View
                style={{
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  alignContent: "center",
                  backgroundColor: "#FFFFFF",

                  width: Dimensions.get("window").width
                }}
              >
                <View style={styles.OtherView}>
                  <Text>{this.testoC02Certific(strings("certified_co2"))}</Text>
                </View>
                <View>
                  <View
                    style={{
                      width: Dimensions.get("window").width * 0.9,
                      paddingBottom: 20,
                      paddingTop: 20,
                      flexDirection: "row",
                      alignContent: "center",
                      alignItems: "center"
                    }}
                  >
                    <SVGFrequentTripIcon />
                    <View
                      style={{
                        width: Dimensions.get("window").width * 0.9 - 90
                      }}
                    >
                      {this.testoC02(strings("share_your_home"))}
                    </View>
                    <View
                      style={{
                        width: 10,
                        height: 10
                      }}
                    />
                    {this.addFrequent()}
                  </View>
                </View>
              </View>
              <ImageBackground
                source={require("../../assets/images/wave/white_wave_bottom.png")}
                style={styles.backgroundImageBottom}
              />
            </View>
          )}
        </View>
      );
    } else {
      let city = this.props.infoProfile
        ? this.props.infoProfile.city
          ? this.props.infoProfile.city.city_name
            ? this.props.infoProfile.city.city_name
            : ""
          : ""
        : "";
      let id = citiesImage(city);
      return (
        <View>
          <ImageBackground
            source={require("../../assets/images/wave/green_wave_top.png")}
            style={styles.backgroundImageTop}
          />
          <View style={styles.View}>
            <View style={styles.FirstView}>
              <Text
                style={{
                  fontFamily: "Montserrat-ExtraBold",
                  color: "#fff",
                  fontSize: 20,
                  textAlign: "center"
                }}
              >
                {strings("id_5_07").toUpperCase()}
              </Text>
            </View>

            <View style={styles.SecondView}>
              <View
                style={{
                  width: Dimensions.get("window").width * 0.9,
                  flexDirection: "row",
                  alignContent: "center",
                  alignItems: "center"
                }}
              >
                <View
                  style={{
                    width: Dimensions.get("window").width * 0.9 - 90
                  }}
                >
                  <Text>
                    <Text
                      style={{
                        fontFamily: "OpenSans-Regular",
                        fontWeight: "700",
                        color: "#FFFFFF",
                        fontSize: 12,
                        textAlign: "left"
                      }}
                    >
                      {strings("id_5_08")}
                    </Text>
                    <Text
                      style={{
                        fontFamily: "OpenSans-Regular",
                        fontWeight: "400",
                        color: "#FFFFFF",
                        fontSize: 12,
                        textAlign: "left"
                      }}
                    >
                      {"\n" + strings("id_5_09")}
                    </Text>
                  </Text>
                </View>
                <View
                  style={{
                    width: 10,
                    height: 10
                  }}
                />
                <View
                  style={{
                    flexDirection: "column",
                    width: 80,
                    alignContent: "flex-end",
                    justifyContent: "center",
                    alignItems: "flex-end"
                  }}
                >
                  <View>
                    <Text>
                      <Text
                        style={{
                          fontFamily: "Montserrat-ExtraBold",
                          color: "#3D3D3D",
                          fontSize: 10,
                          textAlign: "left"
                        }}
                      >
                        CO
                      </Text>
                      <Text
                        style={{
                          fontFamily: "Montserrat-ExtraBold",
                          color: "#3D3D3D",
                          fontSize: 7,
                          textAlign: "left"
                        }}
                      >
                        2
                      </Text>
                    </Text>
                    <Text>
                      <Text
                        style={{
                          fontFamily: "Montserrat-ExtraBold",
                          color: "#FFFFFF",
                          fontSize: 25,
                          textAlign: "left"
                        }}
                      >
                        {roundUsing(Math.floor, this.props.CO2, 1)
                          .toString()
                          .replace(".", ",")}
                      </Text>
                      <Text
                        style={{
                          fontFamily: "OpenSans-Regular",
                          fontWeight: "400",
                          color: "#FFFFFF",
                          fontSize: 10,
                          textAlign: "left"
                        }}
                      >
                        Kg
                      </Text>
                    </Text>
                  </View>
                </View>
              </View>

              <AutoAnimation />
            </View>
          </View>

          {id && !this.props.HomeWork ? (
            <View>
              <View style={styles.backgroundWhiteImageBottom}>
                <ImageBackground
                  source={require("../../assets/images/wave/green_wave_bottom.png")}
                  style={styles.backgroundImageBottom}
                />
              </View>
              <View
                style={{
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  alignContent: "center",
                  backgroundColor: "#FFFFFF",

                  width: Dimensions.get("window").width
                }}
              >
                <View style={styles.OtherView}>
                  {this.testoC02Certific(strings("certified_co2"))}
                </View>
                {this.props.HomeWork ? (
                  <View>
                    <View
                      style={{
                        width: Dimensions.get("window").width * 0.9,
                        paddingBottom: 20,
                        paddingTop: 20,
                        flexDirection: "row",
                        justifyContent: "center",
                        alignContent: "center",
                        alignItems: "center"
                      }}
                    >
                      <View
                        style={{
                          width: Dimensions.get("window").width * 0.9 - 90
                        }}
                      >
                        {this.testoC02(strings("find_out_how_mu"))}
                      </View>
                      <View
                        style={{
                          width: 10,
                          height: 10
                        }}
                      />
                      {id ? (
                        <TouchableOpacity
                          onPress={() => this.goToCity(id, city)}
                          // disabled={true}
                        >
                          <Image
                            source={imagesCity[id]}
                            style={{
                              width: 30,
                              height: 30
                              // position: "absolute",
                              // right: Dimensions.get("window").width * 0.5 - 20
                            }}
                          />
                        </TouchableOpacity>
                      ) : (
                        <View
                          style={{
                            width: 30,
                            height: 30
                            // position: "absolute",
                            // right: Dimensions.get("window").width * 0.5 - 20
                          }}
                        />
                      )}
                    </View>
                  </View>
                ) : (
                  <View>
                    <View
                      style={{
                        width: Dimensions.get("window").width * 0.9,
                        paddingBottom: 20,
                        paddingTop: 20,
                        flexDirection: "row",
                        alignContent: "center",
                        alignItems: "center"
                      }}
                    >
                      <SVGFrequentTripIcon />
                      <View
                        style={{
                          width: Dimensions.get("window").width * 0.9 - 90
                        }}
                      >
                        {this.testoC02(strings("share_your_home"))}
                      </View>
                      <View
                        style={{
                          width: 10,
                          height: 10
                        }}
                      />
                      {this.addFrequent()}
                    </View>
                  </View>
                )}
              </View>
              <ImageBackground
                source={require("../../assets/images/wave/white_wave_bottom.png")}
                style={styles.backgroundImageBottom}
              />
            </View>
          ) : (
            <ImageBackground
              source={require("../../assets/images/wave/green_wave_bottom.png")}
              style={styles.backgroundImageBottom}
            />
          )}
        </View>
      );
    }
  }
}

CO2Wave.defaultProps = {
  C02: 1.0,
  type: "Stats"
};

const withFrequentTrips = connect(state => {
  // prendo solo le routine
  return {
    HomeWork: frequentTripsHomeWork(state),
    infoProfile: getProfile(state)
  };
});

export default withFrequentTrips(CO2Wave);
