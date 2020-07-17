import { View, Text } from "react-native";
import React from "react";
import LatestMatch from "../../../components/LatestMatch/LatestMatch";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });
// Note: test renderer must be required after react-native.

describe("rendering", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<LatestMatch />);
  });
  it("should render 6 <View/>", () => {
    expect(wrapper.find("View")).toHaveLength(6);
  });
  it("should render 5 <Text/>", () => {
    expect(wrapper.find("Text")).toHaveLength(5);
  });
});
