import { View, Text, Image } from "react-native";
import React from "react";
import SurveySelectAvatar, {
  AvatarList
} from "../../../components/SurveySelectAvatar/SurveySelectAvatar";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });
// Note: test renderer must be required after react-native.

describe("rendering", () => {
  let wrapper;
  let props;
  beforeEach(() => {
    props = {
      avatarList: AvatarList()
    };
    wrapper = shallow(<SurveySelectAvatar />);
  });
  it("should render 1 <FlatList/>", () => {
    expect(wrapper.find("FlatList")).toHaveLength(1);
  });
});
