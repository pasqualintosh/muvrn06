import { ADD_REPORT } from "./ActionTypes";
import axios from "axios";

export function addReport(start, finish, resume) {
  console.log(resume);

  return function(dispatch) {
    axios
      .all([
        reverseGeocoding(`${start.latitude},${start.longitude}`),
        reverseGeocoding(`${finish.latitude},${finish.longitude}`)
      ])
      .then(
        axios.spread(function(startResponse, finishResponse) {
          const startAddress = startResponse.data.results[0].formatted_address;
          const finishAddress =
            finishResponse.data.results[0].formatted_address;
          const report = {
            ...resume,
            start: startAddress,
            finish: finishAddress
          };
          alert(JSON.stringify(report));
          dispatch({
            type: ADD_REPORT,
            report
          });
        })
      );
  };
}
function reverseGeocoding(params) {
  return axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${params}&key=AIzaSyAXl9o2Ue_MKalb0_tgGATOOo5lQErM-Bo`
  );
}
