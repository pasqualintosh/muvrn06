import React from "react";
import RecapActivityIndicator from "../../../components/RecapActivityIndicator/RecapActivityIndicator";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });
// Note: test renderer must be required after react-native.

describe("rendering", () => {
  let wrapper;
  const props = {
    DataNow: new Date(),
    Data: new Date().getTime(),
    time_travelled_second: 1000,
    totPoints: 50
  };
  beforeEach(() => {
    wrapper = shallow(<RecapActivityIndicator {...props} />);
  });
  it("should render 5 <View/>", () => {
    expect(wrapper.find("View")).toHaveLength(5);
  });
  it("should render 2 <Text/>", () => {
    expect(wrapper.find("Text")).toHaveLength(2);
  });
});
