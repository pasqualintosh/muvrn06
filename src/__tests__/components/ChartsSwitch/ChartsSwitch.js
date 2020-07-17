import { View, Text, Image } from "react-native";
import React from "react";
import ChartsSwitch from "../../../components/ChartsSwitch/ChartsSwitch";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });
// Note: test renderer must be required after react-native.

describe("rendering", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<ChartsSwitch />);
  });
  it("should render 1 <View/>", () => {
    expect(wrapper.find("View")).toHaveLength(1);
  });
  it("should render 1 <Text/>", () => {
    expect(wrapper.find("Text")).toHaveLength(1);
  });
});
