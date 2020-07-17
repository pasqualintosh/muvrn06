import { View, Text, Image } from "react-native";
import React from "react";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import renderer from "react-test-renderer";

import CityItem from "../../../components/CityItem/CityItem";

configure({ adapter: new Adapter() });
// Note: test renderer must be required after react-native.

describe("rendering", () => {
  let wrapper;
  let props;
  beforeEach(() => {
    props = {
      city: {
        position: 1,
        name: "San Francisco",
        won: 51,
        lost: 24,
        won_percentage: 88
      },
      stylesCityItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignContent: "center",
        alignItems: "center",
        height: 40
      },
      rowID: 2,
      key: 2
    };
    wrapper = shallow(<CityItem {...props} />);
  });
  it("should render 6 <View/>", () => {
    expect(wrapper.find("View")).toHaveLength(6);
  });
});
