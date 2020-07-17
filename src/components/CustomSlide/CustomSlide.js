import React from "react";
import { View, Text, Dimensions, Image, ImageBackground } from "react-native";
import SelectableFrequency from "./../SelectableFrequency/SelectableFrequency";
import ProgressSurveyQuery from "./../ProgressSurveyQuery/ProgressSurveyQuery";
import EndWelcomeSlide from "./../EndWelcomeSlide/EndWelcomeSlide";
import Welcome from "./../../screens/Welcome/Welcome";
import { styles } from "./Style";
import round from "round";

class CustomSlide extends React.Component {
  static navigationOptions = {
    header: null
  };
  constructor(props) {
    super(props);

    this.state = {
      progress: [
        {
          label: "walk",
          value: 0.2,
          color: "#6CBA7E"
        },
        {
          label: "bicycle",
          value: 0.2,
          color: "#E83475"
        },
        {
          label: "bus",
          value: 0.03,
          color: "#FAB21E"
        },
        {
          label: "car",
          value: 0.03,
          color: "#60368C"
        },
        {
          label: "motorbike",
          value: 0.03,
          color: "#5FC4E2"
        },
        {
          label: "carpooling",
          value: 0.03,
          color: "#3363AD"
        }
      ]
    };
  }
  _handleProgressTap = (positionX, width, index) => {
    const progress = round((100 / width) * positionX, 10, "up");

    let progressState = this.state.progress;
    progressState[index].value = progress / 100;

    this.setState({ progress: [...progressState] });
  };
  // metodo se clicco mi rimanda alla scene con etichetta Home, specificata dentro StackNavigation
  ClickSurvey = () => {
    this.props.navigation.navigate("Home");
  };
  renderSelectable() {
    if (this.props.selectable)
      return (
        <View style={styles.containerSurveySelect}>
          <SelectableFrequency
            startLabel={this.props.startLabel}
            endLabel={this.props.endLabel}
            selectableItems={this.props.selectableItems}
          />
        </View>
      );
  }
  renderImage() {
    if (this.props.image) {
      return (
        <View style={styles.center}>
          <Image source={this.props.imageSource} style={styles.image} />
        </View>
      );
    }
  }
  renderProgressQuery(index) {
    return (
      <ProgressSurveyQuery
        key={index}
        progress={this.state.progress[index].value}
        height={25}
        fillColor="#fff"
        barColor={this.state.progress[index].color}
        // borderColor="#DDD"
        // borderRadius={5}
        width={Dimensions.get("window").width * 0.6}
        handleClick={evt =>
          this._handleProgressTap(
            evt.nativeEvent.locationX,
            Dimensions.get("window").width * 0.6,
            index
          )
        }
      />
    );
  }
  renderSurveySlide() {
    return (
      <View style={{}}>
        {this.state.progress.map((item, index) =>
          this.renderProgressQuery(index)
        )}
      </View>
    );
  }
  renderEndWelcomeSlide() {
    return <EndWelcomeSlide {...this.props} />;
  }
  render() {
    if (this.props.renderWelcomeSlide) {
      return <Welcome {...this.props} />;
    } else if (this.props.endWelcomeSlide) {
      return this.renderEndWelcomeSlide();
    } else {
      // condizione che attualmente non si verifica MAI
      return this.renderSurveySlide();
    }
  }
}

export default CustomSlide;
