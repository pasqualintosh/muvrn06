/**
 * funzione generica per fare una chiamata al backend
 * method get o post
 * api il tipo di servizio tipo profile con api/v1/
 * access_token se si usa nella richiesta o valore d'autenticazione al server
 * data , dati da inviare come oggetto
 * ContentType tipo di dati inviati, se non specificato è il formato standard
 * header tipo di header nella richiesta come Bearer o Basic
 */
import axios from "axios";
import qs from "qs";

export async function requestBackend(
  method,
  api,
  access_token,
  data,
  ContentType,
  header
) {
  console.log(api);
  // altri dati che cambiano a seconda della richiesta
  // se passo dei dati allora li devo inserire altrimenti no
  let anotherData = data
    ? {
        data: ContentType ? data : qs.stringify(data),
        async: true,
        crossDomain: true
      }
    : {
        async: true,
        crossDomain: true
      };

  try {
    const response = await axios({
      method,
      // url: "https://www.muvapp.eu/" + api,
      url: "http://23.97.216.36:8000/" + api,
      headers: {
        "content-type": ContentType
          ? ContentType
          : "application/x-www-form-urlencoded",
        Authorization: `${header} ${access_token}`,
        "Cache-Control": "no-cache"
      },
      ...anotherData
    });

    return response;
  } catch (error) {
    if (error.response) {
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
      return error.response;

      // if (error.response.status === 403) {
    } else if (error.request) {
      console.log(error.request);
      return error.request;
    } else {
      console.log(error.message);
      return error.message;
    }
    console.log(error.config);
  }
}
