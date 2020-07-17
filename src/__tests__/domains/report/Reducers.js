import reportReducer from "./../../../domains/report/Reducers";
import { ADD_REPORT } from "./../../../domains/report/ActionTypes";
import DefaultState from "./../../../domains/report/DefaultState";

describe("test of reportReducer", () => {
  it("adds an element", () => {
    const item = {
      start: "via vattelapesca",
      finish: "via lhopescata",
      distance: 100,
      points: 5,
      experience: 2,
      duration: 15
    };

    const state = reportReducer(DefaultState, {
      type: ADD_REPORT,
      report: item
    });
    expect(state).not.toBe(DefaultState);
    expect(state).toHaveProperty("report.start", "via vattelapesca");
    expect(state).toHaveProperty("report.finish", "via lhopescata");
  });
});
