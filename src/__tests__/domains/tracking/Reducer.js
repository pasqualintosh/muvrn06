// import trackingReducer from "./../../../domains/tracking/Reducers";
import {
  ADD_TRACKING,
  RESET_TRACKING
} from "./../../../domains/tracking/ActionTypes";
import DefaultState from "./../../../domains/tracking/DefaultState";

describe("test of trackingReducer", () => {
  it("adds an element", () => {
    const item = {
      key: +new Date(),
      latitude: 12.3456,
      longitude: 78.89123,
      speed: 1,
      activity: "WALKING",
      time: new Date().toString(),
      distance: 10,
      points: 10,
      experience: 10,
      duration: 10
    };

    // const state = trackingReducer(DefaultState, { type: ADD_TRACKING, item });
    // expect(state).not.toBe(DefaultState);
    // expect(state.route).toHaveLength(2);
    // expect(state.route[1]).toHaveProperty("latitude", 12.3456);
  });
  it("removes all element except the first one", () => {
    // const state = trackingReducer(DefaultState, { type: RESET_TRACKING });
    // expect(state.route.latitude).toBe(DefaultState.route.latitude);
    // expect(state.route.longitude).toBe(DefaultState.route.longitude);
    // expect(state.route.speed).toBe(DefaultState.route.speed);
    // expect(state.route).toHaveLength(1);
  });
});
