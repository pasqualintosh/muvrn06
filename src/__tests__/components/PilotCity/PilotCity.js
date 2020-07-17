import { View, Text, Image } from "react-native";
import React from "react";
import PilotCity from "../../../components/PilotCity/PilotCity";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });
// Note: test renderer must be required after react-native.

describe("rendering", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<PilotCity />);
  });
  it("should render 2 <View/>", () => {
    expect(wrapper.find("View")).toHaveLength(2);
  });
  it("should render 1 <Text/>", () => {
    expect(wrapper.find("Text")).toHaveLength(1);
  });
});
