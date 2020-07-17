import { View, Text, Image } from "react-native";
import React from "react";
import ChartsStats from "../../../components/ChartsStats/ChartsStats";
import { styles } from "../../../components/ChartsStats/Style";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });
// Note: test renderer must be required after react-native.

describe("rendering", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<ChartsStats />);
  });
  it("should render 4 <View/>", () => {
    expect(wrapper.find("View")).toHaveLength(4);
  });
  it("should render 6 <Text/>", () => {
    expect(wrapper.find("Text")).toHaveLength(6);
  });
});
