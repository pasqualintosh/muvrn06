import WebService from "../../config/WebService";
export let ws = null;

console.log(
  "wss://" + WebService.socket + "/ws/tracking/point/?token=" + access_token
);
ws = new WebSocket(
  "wss://" + WebService.socket + "/ws/tracking/point/?token=" + access_token
);

ws.onopen = () => {
  // connection opened
  console.log("connection opened");
  // ws.send('something'); // send a message
};

ws.onmessage = e => {
  // a message was received
  console.log(e.data);
};

ws.onerror = e => {
  // an error occurred
  console.log(e.message);
};

ws.onclose = e => {
  // connection closed
  console.log(e.code, e.reason);
};

//       console.log(ws)
//   ws.send(position); // send a message
