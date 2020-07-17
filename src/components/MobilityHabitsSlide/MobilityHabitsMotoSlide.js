import React from "react";
import { View, ScrollView, Dimensions, Alert } from "react-native";
import CarOwning from "./../../components/CarOwning/CarOwning";
import CarSegment from "./../../components/CarSegment/CarSegment";
import CarFuel from "./../../components/CarFuel/CarFuel";
import MotoOwning from "./../../components/MotoOwning/MotoOwning";
import MotoEngine from "./../../components/MotoEngine/MotoEngine";
import MotoCC from "./../../components/MotoCC/MotoCC";
import GoOnButton from "./../GoOnButton/GoOnButton";
import { connect } from "react-redux";
import {
  getMobilityCarValues,
  getMobilityMotoValues
} from "./../../domains/register/ActionCreators";

import { strings } from "../../config/i18n";

class MobilityHabitsMotoSlide extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scrollEnabled: true,
      animate_segment: false,
      animate_engine: false,
      car_id: null,
      car_owning_answer: 1, // 0 || 1 || 2
      car_year: "yyyy", // -> number
      car_segment_answer: "", // "medium" || "large" || "mini" || "small"
      car_fuel: "", // 0 ... 5
      moto_owning_answer: 0, // 0 || 1 || 2
      moto_id: null,
      moto_year: "yyyy", // -> number
      moto_engine_answer: 0, // 0 || 1 || 2
      moto_cc_answer: "", // 0 || 1 || 2 || 3
      car_year_possibilities: ["-"],
      moto_year_possibilities: ["-"],
      car_segment_possibilities: ["medium", "large", "mini", "small"],
      car_fuel_possibilities: [
        "petrol",
        "diesel",
        "petrol_hybrids",
        "LPG",
        "CNG",
        "electric"
      ],
      moto_engine_possibilities: ["2_stroke", "4_stroke"],
      moto_cc_possibilities: [
        "less_50cm3",
        "51_250cm3",
        "251_750cm3",
        "more_751cm3",
        "more_51cm3"
      ]
    };
  }

  handleCarOwningAnswer = val => {
    if (val != 0) {
      this.setState({
        car_owning_answer: val
      });
    } else {
      this.setState({
        car_owning_answer: val,
        car_year: "yyyy",
        car_segment_answer: "",
        car_fuel: 0
      });
    }
  };

  /**
   * replace(/\s/g, "_") toglie gli spazi e mette un _
   */
  handleCarYearChange = val => {
    this.setState({
      car_year: val.replace(/\s/g, "_")
    });

    const filtered_car_m_v = this.props.registerState.get_mobility_car_values.filter(
      e => {
        return e.year == val.replace(/\s/g, "_");
      }
    );

    let car_segment_possibilities = [];

    filtered_car_m_v.forEach((item, index) => {
      if (item.segment != null)
        if (car_segment_possibilities.length > 0) {
          if (!car_segment_possibilities.includes(item.segment))
            car_segment_possibilities.push(item.segment);
        } else {
          car_segment_possibilities.push(item.segment);
        }
    });

    this.setState({ car_segment_possibilities });
  };

  handleMotoOwningAnswer = val => {
    if (val != 0) {
      this.setState({
        moto_owning_answer: val
      });
    } else {
      this.setState({
        moto_owning_answer: val,
        moto_year: "yyyy",
        moto_engine_answer: "",
        moto_cc_answer: 0
      });
    }
  };

  handleMotoYearChange = val => {
    if (val == "2013-2019") val = "2007-2019"; // errore boella ?

    this.setState({
      moto_year: val
    });

    const filtered_moto_m_v = this.props.registerState.get_mobility_moto_values.filter(
      e => {
        return e.year == val;
      }
    );

    let moto_engine_possibilities = [];

    filtered_moto_m_v.forEach((item, index) => {
      if (item.engine != null)
        if (moto_engine_possibilities.length > 0) {
          if (!moto_engine_possibilities.includes(item.engine))
            moto_engine_possibilities.push(item.engine);
        } else {
          moto_engine_possibilities.push(item.engine);
        }
    });

    this.setState({ moto_engine_possibilities });
  };

  handleCarSegmentChange = val => {
    if (this.state.car_year != "yyyy") {
      this.setState({
        car_segment_answer: val
      });

      const filtered_car_m_v = this.props.registerState.get_mobility_car_values.filter(
        e => {
          return (
            e.year == this.state.car_year &&
            (e.segment == val || e.segment == null)
          );
        }
      );

      let car_fuel_possibilities = [];

      filtered_car_m_v.forEach((item, index) => {
        // if (item.segment != null)
        if (car_fuel_possibilities.length > 0) {
          if (!car_fuel_possibilities.includes(item.fuel))
            car_fuel_possibilities.push(item.fuel);
        } else {
          car_fuel_possibilities.push(item.fuel);
        }
      });

      this.setState({ car_fuel_possibilities });
    }
  };

  handleMotoEngineChange = val => {
    if (this.state.moto_year != "yyyy") {
      this.setState({
        moto_engine_answer: val
      });

      const filtered_moto_m_v = this.props.registerState.get_mobility_moto_values.filter(
        e => {
          return e.year == this.state.moto_year && e.engine == val;
        }
      );

      let moto_cc_possibilities = [];

      filtered_moto_m_v.forEach((item, index) => {
        if (moto_cc_possibilities.length > 0) {
          if (!moto_cc_possibilities.includes(item.type))
            moto_cc_possibilities.push(item.type);
        } else {
          moto_cc_possibilities.push(item.type);
        }
      });

      console.log(moto_cc_possibilities);

      this.setState({ moto_cc_possibilities });
    }
  };

  handleMotoCCChange = val => {
    if (this.state.moto_engine_answer != 0) {
      const filtered_moto_m_v = this.props.registerState.get_mobility_moto_values.filter(
        e => {
          return (
            e.year == this.state.moto_year &&
            e.engine == this.state.moto_engine_answer &&
            e.type == val
          );
        }
      );

      console.log(filtered_moto_m_v[0].id);

      if (this.state.moto_engine_answer != "") {
        this.setState({
          moto_id:
            filtered_moto_m_v.length > 0 ? filtered_moto_m_v[0].id : null,
          moto_cc_answer: val
        });
      }
    }
  };

  handleCarFuelChange = val => {
    if (this.state.car_segment_answer != "") {
      const filtered_car_m_v = this.props.registerState.get_mobility_car_values.filter(
        e => {
          return (
            e.year == this.state.car_year &&
            (e.segment == this.state.car_segment_answer || e.segment == null) &&
            e.fuel == val
          );
        }
      );

      console.log(filtered_car_m_v[0].id);

      if (this.state.car_segment_answer != "")
        this.setState({
          car_fuel: val,
          car_id: filtered_car_m_v.length > 0 ? filtered_car_m_v[0].id : null
        });
    }
  };

  /**
   * utile per gestire uno scroll per volta
   */
  handleOnTouchStart = ev => {
    this.setState({ scrollEnabled: false });
  };

  /**
   * utile per gestire uno scroll per volta
   */
  handleOnMomentumScrollEnd = e => {
    this.setState({ scrollEnabled: true });
  };

  /**
   * utile per gestire uno scroll per volta
   */
  handleOnScrollEndDrag = e => {
    this.setState({ scrollEnabled: true });
  };

  /**
   * utile per animare il box segment muovendolo verso il basso/alto
   */
  handleAnimateSegment = () => {
    let animate_segment = this.state.animate_segment;
    this.setState({ animate_segment: !animate_segment });
  };

  /**
   * utile per animare il box segment muovendolo verso il basso/alto
   */
  handleAnimateEngine = () => {
    let animate_engine = this.state.animate_engine;
    this.setState({ animate_engine: !animate_engine });
  };

  goOn = () => {
    let carFlag = false;
    let motoFlag = false;

    // if (this.state.car_owning_answer == 0) carFlag = true;
    // else {
    //   const carCondition =
    //     this.state.car_year != "yyyy" &&
    //     this.state.car_segment_answer != "" &&
    //     this.state.car_fuel != "";
    //   if (carCondition) carFlag = true;
    // }

    if (this.state.moto_owning_answer == 0) motoFlag = true;
    else {
      const motoCondition =
        this.state.moto_year != "yyyy" &&
        this.state.moto_cc_answer != "" &&
        this.state.moto_engine_answer != "";
      if (motoCondition) motoFlag = true;
    }

    if (motoFlag)
      this.props.hanldeGoOnTap({
        car_owning_answer: this.state.car_owning_answer,
        car: this.state.car_id
        // car_year: this.state.car_year,
        // car_segment_answer: this.state.car_segment_answer,
        // car_fuel: this.state.car_fuel,
        // moto_owning_answer: this.state.moto_owning_answer,
        // moto: this.state.moto_id
        // moto_year: this.state.moto_year,
        // moto_engine_answer: this.state.moto_engine_answer,
        // moto_cc_answer: this.state.moto_cc_answer
      });
    else Alert.alert("Oops", strings("seems_like_you_"));
  };

  componentWillMount() {
    this.props.dispatch(getMobilityCarValues());
    this.props.dispatch(getMobilityMotoValues());
  }

  componentWillReceiveProps(props) {
    if (
      this.props.registerState.get_mobility_car_values !=
      props.registerState.get_mobility_car_values
    ) {
      let car_year_possibilities = [];

      props.registerState.get_mobility_car_values.forEach((item, index) => {
        if (item.year != null)
          if (car_year_possibilities.length > 0) {
            if (!car_year_possibilities.includes(item.year))
              car_year_possibilities.push(item.year);
          } else {
            car_year_possibilities.push(item.year);
          }
      });

      this.setState({ car_year_possibilities });
    }
    if (
      this.props.registerState.get_mobility_moto_values !=
      props.registerState.get_mobility_moto_values
    ) {
      let moto_year_possibilities = [];

      props.registerState.get_mobility_moto_values.forEach((item, index) => {
        if (item.year != null)
          if (moto_year_possibilities.length > 0) {
            if (!moto_year_possibilities.includes(item.year))
              moto_year_possibilities.push(item.year);
          } else {
            moto_year_possibilities.push(item.year);
          }
      });

      this.setState({ moto_year_possibilities });
    }
  }

  render() {
    return (
      <View
        style={{
          height: 360,
          width: Dimensions.get("window").width * 0.8,
          alignSelf: "center",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        {/* moto own */}
        <MotoOwning
          handleMotoOwningAnswer={this.handleMotoOwningAnswer}
          handleMotoYearChange={this.handleMotoYearChange}
          motoOwningAnswer={this.state.moto_owning_answer}
          selectedMotoYear={this.state.moto_year}
          handleOnTouchStart={this.handleOnTouchStart}
          handleOnMomentumScrollEnd={this.handleOnMomentumScrollEnd}
          handleOnScrollEndDrag={this.handleOnScrollEndDrag}
          handleAnimateEngine={this.handleAnimateEngine}
          animateEngine={this.state.animate_engine}
          motoYearPossibilities={this.state.moto_year_possibilities}
          checkboxColor={"#fff"}
        />
        {/* moto engine */}
        <MotoEngine
          handleMotoEngineChange={this.handleMotoEngineChange}
          motoEngineAnswer={this.state.moto_engine_answer}
          animateEngine={this.state.animate_engine}
          motoEnginePossibilities={this.state.moto_engine_possibilities}
          checkboxColor={"#fff"}
        />
        {/* moto cc */}
        <MotoCC
          handleMotoCCChange={this.handleMotoCCChange}
          motoCCAnswer={this.state.moto_cc_answer}
          motoCCPossibilities={this.state.moto_cc_possibilities}
          checkboxColor={"#fff"}
        />
        <GoOnButton
          handleNextTap={() => {
            this.goOn();
          }}
        />
      </View>
    );
  }
}

// export default MobilityHabitsSlide;

const withRegister = connect(state => {
  return {
    registerState: state.register
  };
});

export default withRegister(MobilityHabitsMotoSlide);
