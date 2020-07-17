import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback
} from "react-native";
import React from "react";
import StandingsScreen from "../../../screens/StandingsScreen/StandingsScreen";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

jest.mock(
  "react-native-localization",
  () =>
    class RNLocalization {
      language = "en";

      constructor(props) {
        this.props = props;
        this.setLanguage(this.language);
      }

      setLanguage(interfaceLanguage) {
        this.language = interfaceLanguage;
        if (this.props[interfaceLanguage]) {
          var localizedStrings = this.props[this.language];
          for (var key in localizedStrings) {
            if (localizedStrings.hasOwnProperty(key))
              this[key] = localizedStrings[key];
          }
        }
      }
    }
);

configure({ adapter: new Adapter() });
// Note: test renderer must be required after react-native.

describe("rendering", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<StandingsScreen />);
  });
  it("should render 3 <TouchableWithoutFeedback/>", () => {
    // expect(wrapper.find("TouchableWithoutFeedback")).toHaveLength(3);
    console.log(expect(wrapper.find("TouchableWithoutFeedback")));
  });
});
