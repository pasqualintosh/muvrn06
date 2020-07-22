import React from "react";
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  ImageBackground,
  Platform,
  NativeModules,
  TouchableWithoutFeedback,
  Alert,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { BoxShadow } from "react-native-shadow";
import { connect } from "react-redux";
import WavyArea from "./../../components/WavyArea/WavyArea";
import OwnIcon from "./../../components/OwnIcon/OwnIcon";
import AlertListChoose from "./../../components/AlertListChoose/AlertListChoose";
import AlertAcceptOrDecline from "./../../components/AlertAcceptOrDecline/AlertAcceptOrDecline";

import LinearGradient from "react-native-linear-gradient";
import {
  updateState,
  getMobilityCarValues,
  getMobilityMotoValues,
} from "./../../domains/register/ActionCreators";
import Emoji from "@ardentlabs/react-native-emoji";
import Icon from "react-native-vector-icons/Ionicons";

import { strings } from "../../config/i18n";
import { getStringValuesGarage } from "../../helpers/translateLabelDB";

class AllGarageScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      car_fuel: "", // 0 ... 5
      car_fuel_possibilities: [
        "petrol",
        "diesel",
        "petrol_hybrids",
        "LPG",
        "CNG",
        "electric",
      ],
      isModalVisible: false,
      isModalVisibleClose: false,
      listOption: [],
      imageAlert: require("../../assets/images/car_icn.png"),
      titleAlert: "",
      valueAlert: "",
      ordered_car_fuel_possibilities: [],
      car_year_possibilities: [],
      car_segment_possibilities: [],
      car_owning_answer: 0, // 0 || 1 || 2 calcolo prima se ho messo auto nel modal split
      temp_car_year: "", // oppure strings("id_0_67"),
      car_segment_answer: "", // "medium" || "large" || "mini" || "small"
      car: 0, // id dell'auta scelta tra tutti
      moto_engine_possibilities: [],
      moto_cc_possibilities: [],
      moto_year_possibilities: [],
      moto_engine_answer: "",
      moto_owning_answer: 0, // 0 || 1 || 2,
      moto_cc_answer: "",
      temp_moto_year: "",
      moto: 0,
      bike: "",
      bike_id: 0,
      bike_owning_answer: 0,
      bike_possibilities: [
        strings("id_0_53"),
        strings("id_0_54"),
        strings("id_0_55"),
        strings("id_0_56"),
        strings("id_0_64"),
        strings("id_0_67"),
      ],
      type: "car_owning_answer",
    };
  }

  static navigationOptions = {
    header: null,
  };

  arr_diff = (a1, a2) => {
    var a = [],
      diff = [];

    for (var i = 0; i < a1.length; i++) {
      a[a1[i]] = true;
    }

    for (var i = 0; i < a2.length; i++) {
      if (a[a2[i]]) {
        delete a[a2[i]];
      } else {
        a[a2[i]] = true;
      }
    }

    for (var k in a) {
      diff.push(k);
    }

    return diff;
  };

  componentWillMount() {
    // get navigate
    const moto_owning_answer = this.props.navigation.getParam(
      "moto_owning_answer",
      0
    );
    const car_owning_answer = this.props.navigation.getParam(
      "car_owning_answer",
      0
    );
    const bike_owning_answer = this.props.navigation.getParam(
      "bike_owning_answer",
      0
    );

    this.setState({
      moto_owning_answer,
      car_owning_answer,
      bike_owning_answer,
    });

    if (car_owning_answer) {
      this.props.dispatch(getMobilityCarValues());
    }
    if (moto_owning_answer) {
      this.props.dispatch(getMobilityMotoValues());
    }

    // const filtered_car_m_v = this.props.registerState.get_mobility_car_values.filter(
    //   e => {
    //     return (
    //       e.year == this.props.registerState.car_year &&
    //       (e.segment == this.props.registerState.car_segment_answer ||
    //         e.segment == null)
    //     );
    //   }
    // );
    // let car_fuel_possibilities = [];
    // filtered_car_m_v.forEach((item, index) => {
    //   // if (item.segment != null)
    //   if (car_fuel_possibilities.length > 0) {
    //     if (!car_fuel_possibilities.includes(item.fuel))
    //       car_fuel_possibilities.push(item.fuel);
    //   } else {
    //     car_fuel_possibilities.push(item.fuel);
    //   }
    // });
    // // console.log(car_fuel_possibilities);
    // let not_selectable_fuel = this.arr_diff(
    //   this.state.car_fuel_possibilities,
    //   car_fuel_possibilities
    // );
    // this.setState({
    //   car_fuel_possibilities,
    //   car_fuel: "",
    //   ordered_car_fuel_possibilities: [
    //     ...car_fuel_possibilities,
    //     ...not_selectable_fuel
    //   ]
    // });
  }

  componentWillUpdate(props, state) {
    if (
      !state.moto_owning_answer &&
      !state.car_owning_answer &&
      !state.bike_owning_answer
    ) {
      this.skipScreen();
    }
  }

  componentWillReceiveProps(props) {
    if (
      !this.state.ordered_car_fuel_possibilities.length &&
      props.registerState &&
      props.registerState.get_mobility_car_values &&
      props.registerState.get_mobility_car_values.length
    ) {
      let ordered_car_fuel_possibilities = [];
      console.log(props.registerState.get_mobility_car_values);
      ordered_car_fuel_possibilities = props.registerState.get_mobility_car_values.reduce(
        (total, elem, index, array) => {
          if (!total.includes(elem.fuel)) {
            return [...total, elem.fuel];
          } else {
            return total;
          }
        },
        []
      );
      console.log(ordered_car_fuel_possibilities);

      this.setState({ ordered_car_fuel_possibilities });
    } else if (
      !this.state.moto_engine_possibilities.length &&
      props.registerState &&
      props.registerState.get_mobility_moto_values &&
      props.registerState.get_mobility_moto_values.length
    ) {
      let moto_engine_possibilities = [];
      console.log(props.registerState.get_mobility_moto_values);
      moto_engine_possibilities = props.registerState.get_mobility_moto_values.reduce(
        (total, elem, index, array) => {
          if (!total.includes(elem.engine)) {
            return [...total, elem.engine];
          } else {
            return total;
          }
        },
        []
      );
      console.log(moto_engine_possibilities);

      this.setState({ moto_engine_possibilities });
    }
  }

  handleCarFuelChange = (val) => {
    // if (this.props.registerState.car_segment_answer != "") {
    //   const filtered_car_m_v = this.props.registerState.get_mobility_car_values.filter(
    //     e => {
    //       return (
    //         e.year == this.props.registerState.car_year &&
    //         (e.segment == this.props.registerState.car_segment_answer ||
    //           e.segment == null) &&
    //         e.fuel == val
    //       );
    //     }
    //   );

    //   console.log(filtered_car_m_v[0].id);

    //   if (this.props.registerState.car_segment_answer != "")
    //     this.setState(
    //       {
    //         car_fuel: val,
    //         car_id: filtered_car_m_v.length > 0 ? filtered_car_m_v[0].id : null
    //       },
    //       () => {
    //         this.props.dispatch(updateState({ car: this.state.car_id }));
    //       }
    //     );
    // }
    this.setState(
      {
        car_fuel: val,
      },
      () => {
        this.props.dispatch(updateState({ car_fuel: val }));
      }
    );
  };

  handleCarOwningAnswer = (val) => {
    this.setState({
      car_owning_answer: val,
    });
    if (val == 0)
      this.setState(
        {
          car_fuel: "",
        },
        () => {
          this.props.dispatch(
            updateState({
              car: null,
            })
          );
        }
      );
  };

  closeTutorialCarPooling = () => {
    this.setState({
      isModalVisible: false,
    });
  };

  closeModalVisibleTransport = () => {
    this.setState({
      isModalVisibleTransport: false,
    });
  };

  calcolateSegment = () => {
    let car_segment_possibilities = [];

    car_segment_possibilities = this.props.registerState.get_mobility_car_values.filter(
      (item) => {
        return (
          item.fuel == this.state.car_fuel &&
          item.year == this.state.temp_car_year
        );
      }
    );

    console.log(car_segment_possibilities);
    // se ho un unico risultato allora non ho bisogno di specificarlo
    if (car_segment_possibilities.length == 1) {
      const id = car_segment_possibilities[0].id;
      this.setState({
        car: id,
      });
    } else {
      car_segment_possibilities = car_segment_possibilities.map(
        (elem) => elem.segment
      );
      console.log(car_segment_possibilities);

      this.setState({ car_segment_possibilities });
    }
  };

  calcolateIdCar = () => {
    let id_possibilities = [];

    id_possibilities = this.props.registerState.get_mobility_car_values.filter(
      (item) => {
        return (
          item.fuel == this.state.car_fuel &&
          item.year == this.state.temp_car_year &&
          item.segment == this.state.car_segment_answer
        );
      }
    );

    console.log(id_possibilities);
    // se ho un unico risultato allora non ho bisogno di specificarlo
    if (id_possibilities.length == 1) {
      const id = id_possibilities[0].id;
      this.setState({
        car: id,
      });
    } else {
      // id non trovato, quindi cancello tutto

      this.setState({
        car_year_possibilities: [],
        car_segment_possibilities: [],
        car_fuel: "",
        temp_car_year: "", // oppure strings("id_0_67"),
        car_segment_answer: "", // "medium" || "large" || "mini" || "small"
        car: 0, // id dell'auta scelta tra tutti })
      });
    }
  };

  calcolateYears = () => {
    let car_year_possibilities = [];
    let car_possibilities = [];

    car_possibilities = this.props.registerState.get_mobility_car_values.filter(
      (item) => {
        return item.fuel == this.state.car_fuel;
      }
    );

    car_possibilities.forEach((item, index) => {
      if (item.year != null)
        if (car_year_possibilities.length > 0) {
          if (!car_year_possibilities.includes(item.year))
            car_year_possibilities.push(item.year);
        } else {
          car_year_possibilities.push(item.year);
        }
    });

    console.log(car_possibilities);

    this.setState({ car_year_possibilities }, () => {
      if (car_year_possibilities.length == 0) {
        let car_segment_possibilities = [];

        car_possibilities.forEach((item, index) => {
          if (item.segment != null)
            if (car_segment_possibilities.length > 0) {
              if (!car_segment_possibilities.includes(item.segment))
                car_segment_possibilities.push(item.segment);
            } else {
              car_segment_possibilities.push(item.segment);
            }
        });

        // console.log(props.registerState.get_mobility_car_values);
        // console.log(car_possibilities);
        // console.log(car_year_possibilities);
        // console.log(car_segment_possibilities);

        this.setState({ car_segment_possibilities }, () => {
          if (car_possibilities.length > 0) {
            this.setState({
              car: car_possibilities[0].id,
            });
            // this.props.dispatch(
            //   updateState({
            //     car: car_possibilities ? car_possibilities[0].id : null
            //   })
            // );
            // console.log(this.props.registerState["motorbike_flag"]);

            // if (this.props.registerState["motorbike_flag"] == true) {
            //   this.props.navigation.navigate("SurveyMotoSegment");
            // } else {
            //   this.props.navigation.navigate("GDPRScreen");
            // }
          }
        });
      }
    });
  };

  calcolateCapacity = () => {
    let moto_cc_possibilities = [];
    let moto_possibilities = [];

    moto_possibilities = this.props.registerState.get_mobility_moto_values.filter(
      (element) => {
        return element.engine == this.state.moto_engine_answer;
      }
    );

    moto_possibilities.forEach((item, index) => {
      if (item.type != null)
        if (moto_cc_possibilities.length > 0) {
          if (!moto_cc_possibilities.includes(item.type))
            moto_cc_possibilities.push(item.type);
        } else {
          moto_cc_possibilities.push(item.type);
        }
    });

    console.log(moto_possibilities);
    console.log(moto_cc_possibilities);

    this.setState({ moto_cc_possibilities });
  };

  calcolateYearsMoto = () => {
    let moto_year_possibilities = [];
    let filtered_moto_m_v = [];

    filtered_moto_m_v = this.props.registerState.get_mobility_moto_values.filter(
      (element) => {
        return (
          element.engine == this.state.moto_engine_answer &&
          element.type == this.state.moto_cc_answer
        );
      }
    );

    filtered_moto_m_v.forEach((item, index) => {
      if (moto_year_possibilities.length > 0) {
        if (!moto_year_possibilities.includes(item.year))
          moto_year_possibilities.push(item.year);
      } else {
        moto_year_possibilities.push(item.year);
      }
    });

    console.log(moto_year_possibilities);
    console.log(filtered_moto_m_v);

    this.setState({ moto_year_possibilities });
  };

  calcolateIdMoto = () => {
    let id_possibilities = [];

    id_possibilities = this.props.registerState.get_mobility_moto_values.filter(
      (element) => {
        return (
          element.engine == this.state.moto_engine_answer &&
          element.type == this.state.moto_cc_answer &&
          element.year == this.state.temp_moto_year
        );
      }
    );

    console.log(id_possibilities);
    // se ho un unico risultato allora non ho bisogno di specificarlo
    if (id_possibilities.length == 1) {
      const id = id_possibilities[0].id;
      this.setState({
        moto: id,
      });
    } else {
      // id non trovato, quindi cancello tutto

      this.setState({
        moto_cc_answer: [],
        moto_year_possibilities: [],
        moto_engine_answer: "",
        moto_cc_answer: "",
        temp_moto_year: "",
        moto: 0,
      });
    }
  };

  saveChoose = (data, type, index) => {
    this.setState(
      {
        [type]: data,
      },
      () => {
        // a seconda il type calcolo i valori successivi e in caso cancello eventuali valori futuri
        if (type == "car_fuel") {
          this.setState(
            {
              car_year_possibilities: [],
              car_segment_possibilities: [],
              temp_car_year: "", // oppure strings("id_0_67"),
              car_segment_answer: "", // "medium" || "large" || "mini" || "small"
              car: 0, // id dell'auta scelta tra tutti
            },
            () => this.calcolateYears()
          );
        } else if (type == "temp_car_year") {
          this.setState(
            {
              car_segment_possibilities: [],
              car_segment_answer: "", // "medium" || "large" || "mini" || "small"
              car: 0, // id dell'auta scelta tra tutti
            },
            () => this.calcolateSegment()
          );
        } else if (type == "car_segment_answer") {
          this.setState(
            {
              car: 0, // id dell'auta scelta tra tutti
            },
            () => this.calcolateIdCar()
          );
        } else if (type == "moto_engine_answer") {
          this.setState(
            {
              moto_cc_answer: [],
              moto_year_possibilities: [],
              moto_cc_answer: "",
              temp_moto_year: "",
              moto: 0,
            },
            () => this.calcolateCapacity()
          );
        } else if (type == "moto_cc_answer") {
          this.setState(
            {
              moto_year_possibilities: [],

              temp_moto_year: "",
              moto: 0,
            },
            () => this.calcolateYearsMoto()
          );
        } else if (type == "temp_moto_year") {
          this.setState(
            {
              moto: 0,
            },
            () => this.calcolateIdMoto()
          );
        } else if (type == "bike") {
          this.setState({
            bike_id: index + 1, // + 1 dato che la prima opzione disponibile nella posizione zero in realta è la seconda dato che la prima risposta no
          });
        }

        this.closeTutorialCarPooling();
      }
    );
  };

  showAlertCarPooling = (listOption, imageAlert, titleAlert, valueSave) => {
    this.setState({
      isModalVisible: true,
      listOption,
      imageAlert,
      titleAlert,
      paramAlert: valueSave,
      valueAlert: this.state[valueSave],
    });
  };

  boxAutoSelect = () => {
    return (
      <View style={styles.Box}>
        <ImageBackground
          style={styles.imageBox}
          source={require("../../assets/images/onboardingImage/wave_icn_onboarding.png")}
        >
          <Image
            source={require("../../assets/images/onboardingImage/car_icn_onboarding.png")}
            style={styles.imageBox}
          />
        </ImageBackground>
        <View style={styles.viewBoxDelete}>
          <View style={styles.viewBox}>
            <TouchableOpacity
              disabled={!this.state.ordered_car_fuel_possibilities.length}
              onPress={() =>
                this.showAlertCarPooling(
                  this.state.ordered_car_fuel_possibilities,
                  require("../../assets/images/onboardingImage/car_icn_onboarding.png"),
                  strings("id_0_57"),
                  "car_fuel"
                )
              }
            >
              <View
                style={[
                  styles.singleBox,
                  {
                    opacity: this.state.ordered_car_fuel_possibilities.length
                      ? 1
                      : 0.37,
                  },
                ]}
              >
                <Text style={styles.textBox}>{strings("id_0_57")}</Text>
                <Text style={styles.textBox}>
                  {this.state.car_fuel
                    ? getStringValuesGarage(this.state.car_fuel)
                    : "-"}
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              disabled={!this.state.car_year_possibilities.length}
              onPress={() =>
                this.showAlertCarPooling(
                  this.state.car_year_possibilities,
                  require("../../assets/images/onboardingImage/car_icn_onboarding.png"),
                  strings("id_0_66"),
                  "temp_car_year"
                )
              }
            >
              <View
                style={[
                  styles.singleBox,
                  {
                    opacity: this.state.car_year_possibilities.length
                      ? 1
                      : 0.37,
                  },
                ]}
              >
                <Text style={styles.textBox}>{strings("id_0_66")}</Text>
                <Text style={styles.textBox}>
                  {this.state.temp_car_year
                    ? getStringValuesGarage(this.state.temp_car_year)
                    : "-"}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={!this.state.car_segment_possibilities.length}
              onPress={() =>
                this.showAlertCarPooling(
                  this.state.car_segment_possibilities,
                  require("../../assets/images/onboardingImage/car_icn_onboarding.png"),
                  strings("id_0_78"),
                  "car_segment_answer"
                )
              }
            >
              <View
                style={[
                  styles.singleBox,
                  {
                    opacity: this.state.car_segment_possibilities.length
                      ? 1
                      : 0.37,
                  },
                ]}
              >
                <Text style={styles.textBox}>{strings("id_0_78")}</Text>
                <Text style={styles.textBox}>
                  {this.state.car_segment_answer
                    ? getStringValuesGarage(this.state.car_segment_answer)
                    : "-"}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          {this.deleteBox(
            "car_owning_answer",
            require("../../assets/images/onboardingImage/car_icn_onboarding.png"),
            strings("id_0_69"),
            this.state.car
          )}
        </View>
      </View>
    );
  };

  boxMotoSelect = () => {
    return (
      <View style={styles.Box}>
        <ImageBackground
          style={styles.imageBox}
          source={require("../../assets/images/onboardingImage/wave_icn_onboarding.png")}
        >
          <Image
            source={require("../../assets/images/onboardingImage/moto_icn_onboarding.png")}
            style={styles.imageBox}
          />
        </ImageBackground>
        <View style={styles.viewBoxDelete}>
          <View style={styles.viewBox}>
            <TouchableOpacity
              disabled={!this.state.moto_engine_possibilities.length}
              onPress={() =>
                this.showAlertCarPooling(
                  this.state.moto_engine_possibilities,
                  require("../../assets/images/onboardingImage/moto_icn_onboarding.png"),
                  strings("id_0_84"),
                  "moto_engine_answer"
                )
              }
            >
              <View
                style={[
                  styles.singleBox,
                  {
                    opacity: this.state.moto_engine_possibilities.length
                      ? 1
                      : 0.37,
                  },
                ]}
              >
                <Text style={styles.textBox}>{strings("id_0_84")}</Text>
                <Text style={styles.textBox}>
                  {this.state.moto_engine_answer
                    ? getStringValuesGarage(this.state.moto_engine_answer)
                    : "-"}
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              disabled={!this.state.moto_cc_possibilities.length}
              onPress={() =>
                this.showAlertCarPooling(
                  this.state.moto_cc_possibilities,
                  require("../../assets/images/onboardingImage/moto_icn_onboarding.png"),
                  strings("id_0_78"),
                  "moto_cc_answer"
                )
              }
            >
              <View
                style={[
                  styles.singleBox,
                  {
                    opacity: this.state.moto_cc_possibilities.length ? 1 : 0.37,
                  },
                ]}
              >
                <Text style={styles.textBox}>{strings("id_0_78")}</Text>
                <Text style={styles.textBox}>
                  {this.state.moto_cc_answer
                    ? getStringValuesGarage(this.state.moto_cc_answer)
                    : "-"}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={!this.state.moto_year_possibilities.length}
              onPress={() =>
                this.showAlertCarPooling(
                  this.state.moto_year_possibilities,
                  require("../../assets/images/onboardingImage/moto_icn_onboarding.png"),
                  strings("id_0_66"),
                  "temp_moto_year"
                )
              }
            >
              <View
                style={[
                  styles.singleBox,
                  {
                    opacity: this.state.moto_year_possibilities.length
                      ? 1
                      : 0.37,
                  },
                ]}
              >
                <Text style={styles.textBox}>{strings("id_0_66")}</Text>
                <Text style={styles.textBox}>
                  {this.state.temp_moto_year
                    ? getStringValuesGarage(this.state.temp_moto_year)
                    : "-"}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          {this.deleteBox(
            "moto_owning_answer",
            require("../../assets/images/onboardingImage/moto_icn_onboarding.png"),
            strings("id_0_83"),
            this.state.moto
          )}
        </View>
      </View>
    );
  };

  boxBikeSelect = () => {
    return (
      <View style={styles.Box}>
        <ImageBackground
          style={styles.imageBox}
          source={require("../../assets/images/onboardingImage/wave_icn_onboarding.png")}
        >
          <Image
            source={require("../../assets/images/onboardingImage/bike_icn_onboarding.png")}
            style={styles.imageBox}
          />
        </ImageBackground>
        <View style={styles.viewBoxDelete}>
          <View style={styles.viewBox}>
            <TouchableOpacity
              disabled={!this.state.bike_possibilities.length}
              onPress={() =>
                this.showAlertCarPooling(
                  this.state.bike_possibilities,
                  require("../../assets/images/onboardingImage/bike_icn_onboarding.png"),
                  strings("id_0_52"),
                  "bike"
                )
              }
            >
              <View
                style={[
                  styles.singleBox,
                  {
                    opacity: this.state.bike_possibilities.length ? 1 : 0.37,
                  },
                ]}
              >
                <Text style={styles.textBox}>{strings("id_0_52")}</Text>
                <Text style={styles.textBox}>
                  {this.state.bike
                    ? getStringValuesGarage(this.state.bike)
                    : "-"}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          {this.deleteBox(
            "bike_owning_answer",
            require("../../assets/images/onboardingImage/bike_icn_onboarding.png"),
            strings("id_0_91"),
            this.state.bike
          )}
        </View>
      </View>
    );
  };

  openModalTransport = (type, imageAlert, valueAlert) => {
    this.setState({
      type,
      isModalVisibleTransport: true,
      imageAlert,
      valueAlert,
    });
  };

  deleteOwningAnswer = (type) => {
    this.setState({
      [type]: false,
      isModalVisibleTransport: false,
    });
  };

  deleteBox = (type, imageAlert, valueAlert, check) => {
    if (check) {
      return (
        <View style={{ position: "absolute", top: 0, right: 0 }}>
          <Image
            source={require("./../../assets/images/check_green_icn.png")}
            style={{
              width: 24,
              height: 24,
            }}
          />
        </View>
      );
    } else {
      return (
        <TouchableOpacity
          onPress={() => this.openModalTransport(type, imageAlert, valueAlert)}
          style={{ position: "absolute", top: 0, right: 0 }}
        >
          <Image
            source={require("./../../assets/images/cancel_icn.png")}
            style={{
              width: 24,
              height: 24,
            }}
          />
        </TouchableOpacity>
      );
    }
  };

  borderTop = () => {
    return <View style={styles.borderTopView}></View>;
  };

  nextScreen = () => {
    this.props.dispatch(
      updateState({
        car_owning_answer: this.state.car_owning_answer,
        moto_owning_answer: this.state.moto_owning_answer,
        car: this.state.car_owning_answer ? this.state.car : 0,
        moto: this.state.moto_owning_answer ? this.state.moto : 0,
        bike: this.state.bike_owning_answer ? this.state.bike_id : 0,
      })
    );
    this.props.navigation.navigate("ChooseRandomAvatarScreen");
  };

  skipScreen = () => {
    this.props.dispatch(
      updateState({
        car_owning_answer: 0,
        moto_owning_answer: 0,
        car: 0,
        moto: 0,
        bike: 0, // oppure this.state.bike_owning_answer
      })
    );
    this.props.navigation.navigate("ChooseRandomAvatarScreen");
  };

  render() {
    const nextEnable =
      (!this.state.car_owning_answer || this.state.car) &&
      (!this.state.moto_owning_answer || this.state.moto) &&
      (!this.state.bike_owning_answer || this.state.bike);
    return (
      <View>
        <AlertListChoose
          isModalVisible={this.state.isModalVisible}
          closeModal={this.closeTutorialCarPooling}
          confermModal={this.saveChoose}
          paramAlert={this.state.paramAlert}
          listOption={this.state.listOption}
          imageAlert={this.state.imageAlert}
          titleAlert={this.state.titleAlert}
          valueAlert={this.state.valueAlert}
        />
        <AlertAcceptOrDecline
          isModalVisible={this.state.isModalVisibleTransport}
          closeModal={this.closeModalVisibleTransport}
          confermModal={this.deleteOwningAnswer}
          type={this.state.type}
          imageAlert={this.state.imageAlert}
          valueAlert={this.state.valueAlert}
        />
        <LinearGradient
          start={{ x: 0.0, y: 0.0 }}
          end={{ x: 0.0, y: 1.0 }}
          locations={[0, 1.0]}
          colors={["#62357C", "#6497CC"]}
          style={{
            width: Dimensions.get("window").width,
            height: Dimensions.get("window").height,
          }}
        >
          <ImageBackground
            source={require("./../../assets/images/profile_card_bg_muver.png")}
            style={styles.backgroundImage}
          >
            <SafeAreaView style={{ flex: 1 }}>
              <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingBottom: 100 }}
              >
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.goBack(null);
                  }}
                >
                  <View style={{ width: 30, height: 30, marginLeft: 20 }}>
                    <Icon
                      name="md-arrow-forward"
                      size={18}
                      color="#ffffff"
                      style={{ transform: [{ rotateZ: "180deg" }] }}
                    />
                  </View>
                </TouchableOpacity>
                <View style={{ padding: 10 }}>
                  <Text style={styles.title}>{strings("id_0_68")}</Text>
                </View>

                {this.state.car_owning_answer ? (
                  this.boxAutoSelect()
                ) : (
                  <View></View>
                )}

                {this.state.car_owning_answer &&
                this.state.moto_owning_answer ? (
                  this.borderTop()
                ) : (
                  <View />
                )}
                {this.state.moto_owning_answer ? (
                  this.boxMotoSelect()
                ) : (
                  <View></View>
                )}

                {(this.state.bike_owning_answer &&
                  this.state.moto_owning_answer) ||
                (this.state.car_owning_answer &&
                  this.state.bike_owning_answer) ? (
                  this.borderTop()
                ) : (
                  <View />
                )}

                {this.state.bike_owning_answer ? (
                  this.boxBikeSelect()
                ) : (
                  <View></View>
                )}
                <View style={{}}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      top: 50,
                    }}
                  >
                    <View style={styles.buttonContainer}>
                      <View>
                        <TouchableOpacity
                          disabled={!nextEnable}
                          onPress={this.nextScreen}
                          style={[
                            styles.buttonRegister,
                            { opacity: nextEnable ? 1 : 0.6 },
                          ]}
                        >
                          <Text
                            style={{
                              // margin: 10,
                              color: "#FFFFFF",
                              fontFamily: "OpenSans-Regular",
                              fontWeight: "400",
                              fontSize: 15,
                              textAlignVertical: "center",
                              textAlign: "center",
                            }}
                          >
                            {strings("id_0_118")}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              </ScrollView>
            </SafeAreaView>
          </ImageBackground>
        </LinearGradient>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  borderTopView: {
    width: Dimensions.get("window").width * 0.85,
    alignContent: "center",
    alignItems: "center",
    alignSelf: "center",
    height: 1,
    backgroundColor: "#ffffff",
  },
  paddingCalories: {
    paddingTop: 10,
    width: Dimensions.get("window").width * 0.85,
    flexDirection: "column",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  paddingInput: {
    paddingTop: 30,
    width: Dimensions.get("window").width * 0.85,
    flexDirection: "column",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  LeftTitle: {
    alignSelf: "center",

    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    fontSize: 16,
    color: "#FFFFFF",
  },
  titleCalories: {
    textAlign: "left",

    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    fontSize: 11,
    color: "#FFFFFF",
  },
  inputView: {
    width: Dimensions.get("window").width * 0.85,
    height: 44,
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    alignItems: "center",
  },
  borderInput: {
    width: Dimensions.get("window").width * 0.85 - 5,
    height: 1,
    backgroundColor: "#FFFFFF",
    alignSelf: "flex-end",
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    alignItems: "center",
  },
  title: {
    fontFamily: "Montserrat-ExtraBold",
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "bold",
    textAlign: "center",
  },
  buttonRegister: {
    width: Dimensions.get("window").width * 0.35,
    height: 44,
    borderRadius: 22,
    borderColor: "#FFFFFF",
    borderWidth: 1,

    justifyContent: "center",
    alignSelf: "center",
    alignContent: "center",
    flexDirection: "column",
    alignItems: "center",
  },
  backgroundImage: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  topOverlayWave: {
    position: "absolute",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.2,
    top: Platform.OS == "ios" ? 0 : -30,
  },
  bottomOverlayWave: {
    position: "absolute",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.2,
    top: Dimensions.get("window").height * 0.8,
  },
  textHeaderContainer: {
    marginTop: Platform.OS == "ios" ? 30 : 15,
    marginLeft: 20,
    flexDirection: "row",
    width: Dimensions.get("window").width * 0.85,
  },
  textHeader: {
    fontFamily: "OpenSans-ExtraBold",
    color: "#3d3d3d",
    fontSize: 15,
    fontWeight: "bold",
  },
  textFooterContainer: {
    padding: 5,
    width: Dimensions.get("window").width * 0.7,
    justifyContent: "center",
    alignItems: "flex-start",
    alignSelf: "flex-start",
    marginBottom: Platform.OS == "ios" ? 20 : 30,
  },
  textFooter: {
    fontFamily: "OpenSans-Regular",
    color: "#fff",
    fontSize: 12,
    fontWeight: "400",
    textAlign: "left",
  },
  buttonContainer: {
    width: Dimensions.get("window").width,
    height: 64,
    flexDirection: "row",
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  buttonBox: {
    width: Dimensions.get("window").width * 0.2,
    height: 40,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    shadowRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    elevation: 1,
  },
  buttonGoOnText: {
    color: "#3363AD",
    fontFamily: "OpenSans-Regular",
    fontSize: 14,
  },
  sliderSubText: {
    color: "#fff",
    fontFamily: "OpenSans-Regular",
    fontSize: 8,
  },
  textBox: {
    padding: 4,
    fontFamily: "OpenSans-Regular",
    color: "#fff",
    fontSize: 12,
    fontWeight: "400",
  },
  viewBoxDelete: {
    padding: 10,
    width: Dimensions.get("window").width * 0.95 - 140,
    flexDirection: "column",
    justifyContent: "center",
    alignContent: "center",
  },
  Box: {
    width: Dimensions.get("window").width * 0.95,

    padding: 8,
    alignSelf: "center",
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "space-between",
  },
  imageBox: {
    width: 120,
    height: 120,
    alignSelf: "center",
    justifyContent: "center",
  },
  viewBox: {
    width: Dimensions.get("window").width * 0.95 - 160,
    borderColor: "#FFFFFF",
    borderWidth: 2,
    padding: 8,
    flexDirection: "column",
    justifyContent: "center",
  },
  singleBox: {
    width: Dimensions.get("window").width * 0.95 - 180,
    borderColor: "#FFFFFF",
    borderWidth: 2,
    padding: 8,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
  },
  backgroundImage: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  topOverlayWave: {
    position: "absolute",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.2,
    top: Platform.OS == "ios" ? 0 : -30,
  },
  backgroundImageWave: {
    height: 100,
    width: Dimensions.get("window").width,
    position: "absolute",
    // top: Dimensions.get("window").height * 0.04 + 14
  },
  bottomOverlayWave: {
    position: "absolute",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.2,
    top: Dimensions.get("window").height * 0.8,
  },
  textHeaderContainer: {
    marginLeft: 20,
    flexDirection: "row",
    width: Dimensions.get("window").width * 0.85,
  },
  textHeader: {
    fontFamily: "OpenSans-ExtraBold",
    color: "#3d3d3d",
    fontSize: 15,
    fontWeight: "bold",
  },
  textFooterContainer: {
    width: Dimensions.get("window").width * 0.6,
    justifyContent: "flex-start",
    alignItems: "center",
    alignSelf: "center",
  },
  textFooter: {
    fontFamily: "OpenSans-Regular",
    color: "#fff",
    fontSize: 12,
    fontWeight: "400",
    textAlign: "left",
  },
  buttonBox: {
    width: Dimensions.get("window").width * 0.2,
    height: 40,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    shadowRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    elevation: 1,
  },
  buttonGoOnText: {
    color: "#3363AD",
    fontFamily: "OpenSans-Regular",
    fontSize: 14,
  },
  fuelContainer: {
    height: Dimensions.get("window").height * 0.2,
    width: 70,
    // marginHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  fuelText: {
    // marginHorizontal: 10,
    fontFamily: "OpenSans-Regular",
    fontWeight: "bold",
    color: "#3d3d3d",
    fontSize: 13,
  },
  answerBoxes: {
    height: 80,
    marginVertical: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxes: {
    height: 35,
    width: 35,
    borderRadius: 20,
    backgroundColor: "#F7F8F9",
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxesGradient: {
    height: 18,
    width: 18,
    borderRadius: 10,
    backgroundColor: "#F7F8F9",
  },
  checkboxesText: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    color: "#fff",
    fontSize: 11,
    textAlign: "center",
  },
  checkboxesContainer: {
    height: 90,
    width: Dimensions.get("window").width * 0.2,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  textSection: {
    fontFamily: "OpenSans-ExtraBold",
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export const positiveData = [
  {
    value: 60,
  },
  {
    value: 40,
  },
  {
    value: 50,
  },
  {
    value: 40,
  },
  {
    value: 50,
  },
];

export const negativeData = [
  {
    value: -60,
  },
  {
    value: -40,
  },
  {
    value: -50,
  },
  {
    value: -40,
  },
  {
    value: -50,
  },
];

const withData = connect((state) => {
  return {
    registerState: state.register,
  };
});

export default withData(AllGarageScreen);
