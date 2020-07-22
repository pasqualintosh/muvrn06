import {
  checkModalTypeDispatch,
  checkCounterRouteInSeriesEvent,
  checkFrequentTripEvent,
  checkHomeWorkFrequentTripEvent,
  toggleStTeatro,
  toggleStBallarak,
  toggleStMuvtoget,
  toggleStKalsa
} from "./../domains/trainings/ActionCreators";

import haversine from "./haversine";
import { checkFrequentTrip } from "../domains/tracking/ActionCreators";

export class SpecialTrainings {
  constructor(
    available_st,
    route_to_check,
    st_redux_state,
    updateStatus,
    s_point,
    e_point,
    dispatch,
    most_frequent_routes
  ) {
    this.available_st = available_st;
    this.route_to_check = route_to_check;
    // this.route_to_check = fake_route;
    this.st_redux_state = st_redux_state;
    this.updateStatus = updateStatus;
    this.completed_special_training = []; // [{id: INT, reward_id: INT, status: 1}]
    this.s_point = s_point;
    this.e_point = e_point;
    this.dispatch = dispatch;
    this.most_frequent_routes = most_frequent_routes;

    this.log =
      "\neventi da controllare " +
      this.available_st.filter(e => {
        let expiration_date = +new Date(
          e.special_training.end_special_training
        );
        let now = +new Date();
        return e.status == 0 && now < expiration_date;
      }).length;

    this.letsmuv = "Let's MUV!!";
    this.burnit = "BURN IT";
    this.mayday = "Walk for the May-Day concert";
    this.wakeup = "From Dusk till Dawn";
    this.food = "Food for thoughts";
    this.muvtoread = "MUV to read";
    this.uusisauna = "Time to go to sauna!";
    this.kickstart = "Kick start your day!";
    this.chiavetteri = "Sustainable nighlife, happy hour guaranteed";
    this.insula = "Explore the  Historic Center";
    this.teatromassimo = "Go to the MASSIMO ";
    this.barcelona = "Enjoy the best Fitness at the CNSA";
    this.santandreu = "Keep MUVing for Sant Andreu";
    this.mrpecas = "MR Peças Challenge";
    this.insigpol = "Be healthy and MUVe yourself safe!";
    this.ballarak = "Too hot during the day? Go to the brewer at night! ";
    this.gota = "Calorias da Gota";
    this.espresso = "Tomar café eu vou, café não costuma faiá.";
    this.anacardi = "Cajuíne-se!";
    this.soLove = "Só Love, só Love!";
    this.walktoget = "MUV to new opportunities";
    this.takecare = "Take care of yourself!";
    this.fundao = "It's Mobility Week!";
    this.giretto = "Giretto d'Italia 2019";
    this.agrodolce = "Mobilità Agrodolce 2019";
    this.streetparade = "Street Parade";
    this.bikeweek = "Milano Bike Week";
    this.bikepmpi = "Passeio Ciclístico CAIS-PM-PI";
    this.mercato = "Al mercato per una mattonella (che non si mangia)!";
    this.ciwara = "Movimento a ritmo africano";
    this.workshop = "Take part and you will be rewarded!";
    this.workshop_2 = "Take part at the workshop to be rewarded!";
    this.stunning = "Stunning Sant Andreu";
    this.kalsa = "Alla scoperta della Kalsa";
    this.muvimento = "Il MUVimento ti fa bello!";
    this.ridemybike = "I want to ride my bike!";
    this.airlite = "Love is in the not polluted air";
    this.hflows = "Human Flows";
    this.muvmusic = "MUV & MUSIC";
    this.santelia = "Stay Active: be happy!";
    this.forest = "5000 pts = 1 tree for Gardunha forest";
    this.freschette = "Scopri il centro storico nei weekend festivi";
    this.glifo = "Il movimento è cultura";
    this.barmus8 = "Sustainability is Culture!";
    this.barmus9 = "Culturize yourself!";

    this.st_burnit = false; // valorizzo un flag per ogni st
    this.st_letsmuv = false; // valorizzo un flag per ogni st
    this.st_mayday = false; // valorizzo un flag per ogni st
    this.st_wakeup = false; // valorizzo un flag per ogni st
    this.st_food = false; // valorizzo un flag per ogni st
    this.st_muvtoread = false; // valorizzo un flag per ogni st
    this.st_uusisauna = false; // valorizzo un flag per ogni st
    this.st_kickstart = false; // valorizzo un flag per ogni st
    this.st_chiavetteri = false; // valorizzo un flag per ogni st
    this.st_insula = false; // valorizzo un flag per ogni st
    this.st_teatromassimo = false; // valorizzo un flag per ogni st
    this.st_barcelona = false; // valorizzo un flag per ogni st
    this.st_santandreu = false; // valorizzo un flag per ogni st
    this.st_pecas = false; // valorizzo un flag per ogni st
    this.st_insigpol = false; // valorizzo un flag per ogni st
    this.st_ballarak = false; // valorizzo un flag per ogni st
    this.st_gota = false; // valorizzo un flag per ogni st
    this.st_espresso = false; // valorizzo un flag per ogni st
    this.st_anacardi = false; // valorizzo un flag per ogni st
    this.st_soLove = false; // valorizzo un flag per ogni st
    this.st_walktoget = false; // valorizzo un flag per ogni st
    this.st_takecare = false; // valorizzo un flag per ogni st
    this.st_fundao = false; // valorizzo un flag per ogni st
    this.st_giretto = false; // valorizzo un flag per ogni st
    this.st_agrodolce = false; // valorizzo un flag per ogni st
    this.st_streetparade = false; // valorizzo un flag per ogni st
    this.st_bikeweek = false; // valorizzo un flag per ogni st
    this.st_bikepmpi = false; // valorizzo un flag per ogni st
    this.st_mercato = false; // valorizzo un flag per ogni st
    this.st_ciwara = false; // valorizzo un flag per ogni st
    this.st_workshop = false; // valorizzo un flag per ogni st
    this.st_stunning = false; // valorizzo un flag per ogni st
    this.st_kalsa = false; // valorizzo un flag per ogni st
    this.st_muvimento = false; // valorizzo un flag per ogni st
    this.st_ridemybike = false; // valorizzo un flag per ogni st
    this.st_airlite = false; // valorizzo un flag per ogni st
    this.st_hflows = false; // valorizzo un flag per ogni st
    this.st_muvmusic = false; // valorizzo un flag per ogni st
    this.st_santelia = false; // valorizzo un flag per ogni st
    this.st_forest = false; // valorizzo un flag per ogni st
    this.st_freschette = false; // valorizzo un flag per ogni st
    this.st_glifo = false; // valorizzo un flag per ogni st
    this.st_barmus8 = false; // valorizzo un flag per ogni st
    this.st_barmus9 = false; // valorizzo un flag per ogni st

    this.calcAllST();
  }

  calcAllST() {
    // if (true) {
    if (
      this.available_st.filter(e => {
        let expiration_date = +new Date(
          e.special_training.end_special_training
        );
        let now = +new Date();
        return e.status == 0 && now < expiration_date;
      }).length > 0
    ) {
      this.available_st.forEach((el, index) => {
        let expiration_date = +new Date(
          el.special_training.end_special_training
        );
        let now = +new Date();

        console.log("calcAllST");

        if (now < expiration_date && el.status == 0) {
          // if (true) {
          this.log += "\n " + el.text_description;
          // if (el.text_description.includes(this.letsmuv)) {
          //   this.calcSTLetsmuv(el);
          // }
          // if (el.text_description.includes(this.burnit)) {
          //   this.calcSTBurnit(el);
          // }
          // if (el.text_description.includes(this.mayday)) {
          //   this.calcSTMayday(el);
          // }
          // if (el.text_description.includes(this.wakeup)) {
          //   this.calcSTWakeup(el);
          // }
          // if (el.text_description.includes(this.food)) {
          //   this.calcSTFood(el);
          // }
          // if (el.text_description.includes(this.muvtoread)) {
          //   this.calcSTMuv2Read(el);
          // }
          // if (el.text_description.includes(this.uusisauna)) {
          //   this.calcSTUUsiSauna(el);
          // }
          // if (el.text_description.includes(this.kickstart)) {
          //   this.calcSTKickStart(el);
          // }
          // if (el.text_description.includes(this.chiavetteri)) {
          //   this.calcSTChiavetteri(el);
          // }
          // if (el.text_description.includes(this.insula)) {
          //   this.calcSTInsula(el);
          // }
          // if (el.text_description.includes(this.teatromassimo)) {
          //   this.calcSTTeatromassimo(el);
          // }
          // if (el.text_description.includes(this.barcelona)) {
          //   if (el.status === 0) this.calcSTBarcelona(el);
          // }
          // if (el.text_description.includes(this.santandreu)) {
          //   if (el.status === 0) this.calcSTSantandreu(el);
          // }
          // if (el.text_description.includes(this.mrpecas)) {
          //   if (el.status === 0) this.calcSTMRPecas(el);
          // }
          // if (el.text_description.includes(this.insigpol)) {
          //   if (el.status === 0) this.calcSTInsigpol(el);
          // }
          // if (el.text_description.includes(this.ballarak)) {
          //   if (el.status === 0) this.calcSTBallarak(el);
          // }
          // if (el.text_description.includes(this.gota)) {
          //   if (el.status === 0) this.calcSTGota(el);
          // }
          // if (el.text_description.includes(this.espresso)) {
          //   if (el.status === 0) this.calcSTEspresso(el);
          // }
          // if (el.text_description.includes(this.anacardi)) {
          //   if (el.status === 0) this.calcSTAnacardi(el);
          // }
          // if (el.text_description.includes(this.soLove)) {
          //   if (el.status === 0) this.calcSTSoLove(el);
          // }
          // if (el.text_description.includes(this.walktoget)) {
          //   if (el.status === 0) this.calcSTWalktoget(el);
          // }
          // if (el.text_description.includes(this.takecare)) {
          //   if (el.status === 0) this.calcSTTakecare(el);
          // }
          // if (el.text_description.includes(this.fundao)) {
          //   if (el.status === 0) this.calcSTFundao(el);
          // }
          // if (el.text_description.includes(this.giretto)) {
          //   if (el.status === 0) this.calcSTGiretto(el);
          // }
          // if (el.text_description.includes(this.agrodolce)) {
          //   if (el.status === 0) this.calcSTAgrodolce(el);
          // }
          // if (el.text_description.includes(this.streetparade)) {
          //   if (el.status === 0) this.calcSTStreetparade(el);
          // }
          // if (el.text_description.includes(this.bikeweek)) {
          //   if (el.status === 0) this.calcSTBikeweek(el);
          // }
          // if (el.text_description.includes(this.bikepmpi)) {
          //   if (el.status === 0) this.calcSTBikePmpi(el);
          // }
          if (el.text_description.includes(this.mercato)) {
            if (el.status === 0) this.calcSTMercato(el);
          }
          if (el.text_description.includes(this.ciwara)) {
            if (el.status === 0) this.calcSTCiwara(el);
          }
          if (el.text_description.includes(this.workshop)) {
            if (el.status === 0) this.calcSTWorkshop(el);
          }
          if (el.text_description.includes(this.workshop_2)) {
            if (el.status === 0) this.calcSTWorkshop(el);
          }
          if (el.text_description.includes(this.stunning)) {
            if (el.status === 0) this.calcSTStunning(el);
          }
          if (el.text_description.includes(this.kalsa)) {
            if (el.status === 0) this.calcSTKalsa(el);
          }
          if (el.text_description.includes(this.muvimento)) {
            if (el.status === 0) this.calcSTMuvimento(el);
          }
          if (el.text_description.includes(this.ridemybike)) {
            if (el.status === 0) this.calcSTRidemyBike(el);
          }
          if (el.text_description.includes(this.airlite)) {
            if (el.status === 0) this.calcSTAirlite(el);
          }
          if (el.text_description.includes(this.hflows)) {
            if (el.status === 0) this.calcSTHFlows(el);
          }
          if (el.text_description.includes(this.muvmusic)) {
            if (el.status === 0) this.calcSTMuvMusic(el);
          }
          if (el.text_description.includes(this.santelia)) {
            if (el.status === 0) this.calcSTSantelia(el);
          }
          if (el.text_description.includes(this.forest)) {
            this.calcSTForest(el);
          }
          if (el.text_description.includes(this.freschette)) {
            if (el.status === 0) this.calcSTFreschette(el);
          }
          if (el.text_description.includes(this.glifo)) {
            if (el.status === 0) this.calcSTGlifo(el);
          }
          if (el.text_description.includes(this.barmus8)) {
            if (el.status === 0) this.calcSTBarc8(el);
          }
          if (el.text_description.includes(this.barmus9)) {
            if (el.status === 0) this.calcSTBarc9(el);
          }
        }
      });
    }
  }

  calcSTSoLove(el) {
    this.log += "\nhai sottoscritto So love";

    // vedo se è una frequent trips
    const frequent_trip = this.route_to_check.referred_most_freq_route;

    // se lo è

    if (frequent_trip) {
      const check_if_event_status_exist =
        this.st_redux_state["SoLoveInST_" + el.st_event[0].reward_id] &&
        this.st_redux_state["SoLoveInST_" + el.st_event[0].reward_id] != {}
          ? true
          : false;

      this.log +=
        "\ncheck_if_event_status_exist " + check_if_event_status_exist;

      // se ho gia il contatore
      if (check_if_event_status_exist) {
        const start = this.route_to_check.segment[0].end_time;
        // prendo i contatori
        let counter = this.st_redux_state[
          "SoLoveInST_" + el.st_event[0].reward_id
        ].counter;
        let date = this.st_redux_state["SoLoveInST_" + el.st_event[0].reward_id]
          .date;
        let points = this.st_redux_state[
          "SoLoveInST_" + el.st_event[0].reward_id
        ].points;
        this.log += "\npoints " + points;

        // vedi se hai gia' il counter a 1 significa che ho fatto una settimana di 3 tratte

        // vedo se è una nuova settimana
        const Now = new Date(start);
        const millisecond = Now.getTime();

        const dateNow = new Date(millisecond).toDateString();
        const dateSave = new Date(date).toDateString();
        console.log(dateNow);
        console.log(dateSave);

        let DayNowFromMon = new Date(date).getDay();

        DayNowFromMon = DayNowFromMon ? DayNowFromMon - 1 : 6;

        // inizio settimana
        const startWeek = date - DayNowFromMon * 86400000;
        // fine settimana
        const endWeek = startWeek + 6 * 86400000;
        // inizio prossima settimana
        const nextStartWeek = endWeek + 86400000;
        // fine prossima settimana
        const nextEndWeek = nextStartWeek + 6 * 86400000;

        const startWeekString = new Date(startWeek).toDateString();
        const endWeekString = new Date(endWeek).toDateString();
        const nextStartWeekString = new Date(nextStartWeek).toDateString();
        const nextEndWeekString = new Date(nextEndWeek).toDateString();
        this.log += "\nsettimana" + endWeekString;

        if (dateNow >= nextStartWeekString && dateNow <= nextEndWeekString) {
          // prossima settimana
          // se ho fatto gia due tratte e considero quello corrente quindi 3 allora ho fatto una settimana
          if (points > 2) {
            // SE HO 3 TRATTE E SONO NELLA SECONDA SETTIMANA SONO A 1 E 1
            this.updateStatus("SoLoveInST_" + el.st_event[0].reward_id, {
              points: 1,
              date: new Date(),
              counter: counter + 1
            });
          } else {
            // ricomincio
            this.updateStatus("SoLoveInST_" + el.st_event[0].reward_id, {
              points: 1,
              date: new Date(),
              counter: 0
            });
          }
        } else if (dateNow <= endWeekString) {
          this.log += "\nstessa settimana";
          // settimana corrente
          // se ho fatto gia due tratte e considero quello corrente quindi 3 allora ho fatto una settimana
          if (points > 1 && counter > 0) {
            // ho finito, ho fatto due settimane con 3 tratte
            // hai completato lo special training
            this.st_soLove = true;
            this.log += "\ncondizioni st soddisfatte";
            this.completed_special_training.push({
              id: el.special_training.id,
              reward_id: el.st_event[0].reward_id,
              status: 1,
              text_description: el.text_description
            });
          } else {
            this.log += "\npoints = 1 ";
            this.updateStatus("SoLoveInST_" + el.st_event[0].reward_id, {
              points: points + 1,
              date: new Date(),
              counter: counter
            });
          }
        } else {
          // altra settimana
          //ricomincio da 1
          this.log += "\npoints = 1 ";
          this.updateStatus("SoLoveInST_" + el.st_event[0].reward_id, {
            points: 1,
            date: new Date(),
            counter: 0
          });
        }
      } else {
        // ho fatto una tratta nella prima settimana
        this.updateStatus("SoLoveInST_" + el.st_event[0].reward_id, {
          points: 1,
          date: new Date(),
          counter: 0
        });
      }
    }

    // Alert.alert(this.log);
  }

  calcSTAnacardi(el) {
    this.log += "\nhai sottoscritto Cajuíne-se!";

    const r_points = this.route_to_check.segment.reduce(
      (total, elem) => total + elem.points,
      0
    );

    // se ho fatto 600 punti minimo incremento il contatore

    if (r_points > 599) {
      const check_if_event_status_exist =
        this.st_redux_state["PointsInST_" + el.st_event[0].reward_id] &&
        this.st_redux_state["PointsInST_" + el.st_event[0].reward_id] != {}
          ? true
          : false;

      this.log += "\npunti tratta " + r_points;
      this.log +=
        "\ncheck_if_event_status_exist " + check_if_event_status_exist;

      // se ho gia il contatore
      if (check_if_event_status_exist) {
        // prendo il contatore
        let counter = this.st_redux_state[
          "PointsInST_" + el.st_event[0].reward_id
        ].counter;

        // vedi se hai gia' il counter di 5 tratte

        // ovvero 4 > 3 piu quella corrente quindi 5

        if (counter > 3) {
          // hai completato lo special training
          this.st_anacardi = true;
          this.log += "\ncondizioni st soddisfatte";
          this.completed_special_training.push({
            id: el.special_training.id,
            reward_id: el.st_event[0].reward_id,
            status: 1,
            text_description: el.text_description
          });
        } else {
          this.updateStatus("PointsInST_" + el.st_event[0].reward_id, {
            points: r_points,
            date: new Date(),
            counter: counter + 1
          });
        }
      } else {
        // ho fatto una tratta di 600
        this.updateStatus("PointsInST_" + el.st_event[0].reward_id, {
          points: r_points,
          date: new Date(),
          counter: 1
        });
      }
    }

    // Alert.alert(this.log);
  }

  calcSTLetsmuv(el) {
    this.log += "\nhai sottoscritto let's muv";

    const r_points = this.route_to_check.segment.reduce(
      (total, elem) => total + elem.points,
      0
    );

    const check_if_event_status_exist =
      this.st_redux_state["PointsInST_" + el.st_event[0].reward_id] &&
      this.st_redux_state["PointsInST_" + el.st_event[0].reward_id] != {}
        ? true
        : false;

    this.log += "\npunti tratta " + r_points;
    this.log += "\ncheck_if_event_status_exist " + check_if_event_status_exist;

    if (check_if_event_status_exist) {
      let last_date = new Date(
        this.st_redux_state["PointsInST_" + el.st_event[0].reward_id].date
      );
      let counter = this.st_redux_state[
        "PointsInST_" + el.st_event[0].reward_id
      ].counter;
      let points = this.st_redux_state["PointsInST_" + el.st_event[0].reward_id]
        .points;
      let today = new Date();

      let msec = today - last_date;
      let mins = Math.floor(msec / 60000);
      let hrs = Math.floor(mins / 60);
      let days = Math.floor(hrs / 24);

      this.log += "\ndays " + days;
      this.log += "\ncounter " + counter;

      if (days == 0) {
        // vedi se hai gia' superato i 300 pti

        if (points < 300) {
          let tot_points = r_points + points;
          this.log += "\npunteggio accumulato " + tot_points;

          if (counter + 1 == 5 && tot_points >= 300) {
            // hai completato lo special training
            this.st_letsmuv = true;
            this.log += "\ncondizioni st soddisfatte";
            this.completed_special_training.push({
              id: el.special_training.id,
              reward_id: el.st_event[0].reward_id,
              status: 1,
              text_description: el.text_description
            });
          }

          this.updateStatus("PointsInST_" + el.st_event[0].reward_id, {
            points: tot_points,
            date: new Date(),
            counter: tot_points >= 300 ? counter + 1 : counter
          });
        }
      } else {
        if (days > 1) {
          this.updateStatus("PointsInST_" + el.st_event[0].reward_id, {
            points: r_points,
            date: new Date(),
            counter: r_points >= 300 ? 1 : 0
          });
        } else {
          // days == 1
          if (points < 300) {
            this.updateStatus("PointsInST_" + el.st_event[0].reward_id, {
              points: r_points,
              date: new Date(),
              counter: r_points >= 300 ? 1 : 0
            });
          } else {
            if (counter + 1 == 5 && r_points >= 300) {
              // hai completato lo special training
              this.st_letsmuv = true;
              this.log += "\ncondizioni st soddisfatte";
              this.completed_special_training.push({
                id: el.special_training.id,
                reward_id: el.st_event[0].reward_id,
                status: 1,
                text_description: el.text_description
              });
            }

            this.updateStatus("PointsInST_" + el.st_event[0].reward_id, {
              points: r_points,
              date: new Date(),
              counter: r_points >= 300 ? counter + 1 : counter
            });
          }
        }
      }
    } else {
      this.updateStatus("PointsInST_" + el.st_event[0].reward_id, {
        points: r_points,
        date: new Date(),
        counter: r_points >= 300 ? 1 : 0
      });
    }
    // alert(this.log);
  }

  calcSTBurnit(el) {
    this.log += "\nhai sottoscritto burn it";

    const r_calories = this.route_to_check.segment.reduce(
      (total, elem) => total + elem.calories,
      0
    );

    const check_if_event_status_exist =
      this.st_redux_state["CaloriesInST_" + el.st_event[0].reward_id] &&
      this.st_redux_state["CaloriesInST_" + el.st_event[0].reward_id] != {}
        ? true
        : false;

    this.log += "\ncalorie tratta " + r_calories;
    this.log += "\ncheck_if_event_status_exist " + check_if_event_status_exist;

    if (check_if_event_status_exist) {
      let counter = this.st_redux_state[
        "CaloriesInST_" + el.st_event[0].reward_id
      ].counter;
      let date = new Date(
        this.st_redux_state["CaloriesInST_" + el.st_event[0].reward_id].date
      );
      let now = new Date();
      let s_msec = now - date;
      let s_mins = Math.floor(s_msec / 60000);

      if (s_mins > 1) {
        if (counter + r_calories >= 1000) {
          // evento completato
          this.log += "\nevento completato";

          this.st_burnit = true;
          this.log += "\ncondizioni st soddisfatte";
          this.completed_special_training.push({
            id: el.special_training.id,
            reward_id: el.st_event[0].reward_id,
            status: 1,
            text_description: el.text_description
          });
        }

        this.updateStatus("CaloriesInST_" + el.st_event[0].reward_id, {
          date: new Date(),
          counter: counter + r_calories
        });
      }
    } else {
      if (r_calories >= 1000) {
        // evento completato
        this.log += "\nevento completato";

        this.st_burnit = true;
        this.log += "\ncondizioni st soddisfatte";
        this.completed_special_training.push({
          id: el.special_training.id,
          reward_id: el.st_event[0].reward_id,
          status: 1,
          text_description: el.text_description
        });
      }

      this.updateStatus("CaloriesInST_" + el.st_event[0].reward_id, {
        date: new Date(),
        counter: r_calories
      });
    }
    // alert(this.log);
  }

  calcDistFromCentroStoricoMayDay() {
    // circa 1225 metri
    const thresholdGPS = 2.25;
    const distance = haversine(
      this.s_point.latitude,
      this.s_point.longitude,
      38.1156342,
      13.3593773
    );

    const distance_from_centro = distance <= thresholdGPS ? true : false;
    let flag = checkModalTypeDispatch(this.route_to_check, {
      event: { modal_type: "1" }
    });

    if (distance_from_centro) return true;
    else return false;
  }

  calcDistFromOrtoBotanico() {
    // circa 60 metri
    const thresholdGPS = 0.125;
    const distance = haversine(
      this.e_point.latitude,
      this.e_point.longitude,
      38.1136622,
      13.370933
    );

    const distance_from_orto = distance <= thresholdGPS ? true : false;

    if (distance_from_orto) return true;
    else return false;
  }

  calcDistFromUusiSauna() {
    // circa 60 metri
    const thresholdGPS = 0.125;
    const distance = haversine(
      this.e_point.latitude,
      this.e_point.longitude,
      60.1592772,
      24.918093
    );

    const distance_from_sauna = distance <= thresholdGPS ? true : false;

    if (distance_from_sauna) return true;
    else return false;
  }

  calcSTMayday(el) {
    this.log += "\nhai sottoscritto may day";

    if (this.calcDistFromCentroStoricoMayDay()) {
      this.log += "\nsei in centro e a piedi";
      const r_distance = this.route_to_check.segment.reduce(
        (total, elem) => total + elem.distance_travelled,
        0
      );

      const check_if_event_status_exist =
        this.st_redux_state["KmInST_" + el.st_event[0].reward_id] &&
        this.st_redux_state["KmInST_" + el.st_event[0].reward_id] != {}
          ? true
          : false;

      this.log += "km tratta " + r_distance;
      this.log +=
        "\ncheck_if_event_status_exist " + check_if_event_status_exist;

      if (check_if_event_status_exist) {
        let distance = this.st_redux_state["KmInST_" + el.st_event[0].reward_id]
          .counter;
        let date = new Date(
          this.st_redux_state["KmInST_" + el.st_event[0].reward_id].date
        );
        let now = new Date();
        let s_msec = now - date;
        let s_mins = Math.floor(s_msec / 60000);

        if (s_mins > 1) {
          if (distance + r_distance >= 1.6) {
            // evento completato
            this.log += "\nevento completato";

            this.st_mayday = true;
            this.log += "\ncondizioni st soddisfatte";
            this.completed_special_training.push({
              id: el.special_training.id,
              reward_id: el.st_event[0].reward_id,
              status: 1,
              text_description: el.text_description
            });
          }

          this.updateStatus("KmInST_" + el.st_event[0].reward_id, {
            date: new Date(),
            counter: distance + r_distance
          });
        }
      } else {
        if (r_distance >= 1.6) {
          // evento completato
          this.log += "\nevento completato";

          this.st_mayday = true;
          this.log += "\ncondizioni st soddisfatte";
          this.completed_special_training.push({
            id: el.special_training.id,
            reward_id: el.st_event[0].reward_id,
            status: 1,
            text_description: el.text_description
          });
        }

        this.updateStatus("KmInST_" + el.st_event[0].reward_id, {
          date: new Date(),
          counter: r_distance
        });
      }
      // alert(this.log);
    }
  }

  calcSTWakeup(el) {
    this.log += "\nhai sottoscritto wake up";

    const r_points = this.route_to_check.segment.reduce(
      (total, elem) => total + elem.points,
      0
    );

    const check_if_event_status_exist =
      this.st_redux_state["WakeupInST_" + el.st_event[0].reward_id] &&
      this.st_redux_state["WakeupInST_" + el.st_event[0].reward_id] != {}
        ? true
        : false;

    this.log += "\npunti tratta " + r_points;
    this.log += "\ncheck_if_event_status_exist " + check_if_event_status_exist;

    let flag = checkModalTypeDispatch(this.route_to_check, {
      event: { modal_type: "1" }
    });

    this.log += "\ntratta fatta a piedi " + flag;

    if (check_if_event_status_exist) {
      let last_date = new Date(
        this.st_redux_state["WakeupInST_" + el.st_event[0].reward_id].date
      );
      let counter = this.st_redux_state[
        "WakeupInST_" + el.st_event[0].reward_id
      ].counter;
      let points = this.st_redux_state["WakeupInST_" + el.st_event[0].reward_id]
        .points;
      let ts = new Date();
      let h = ts.getHours();
      // let h = 23;

      if (h <= 9 || h >= 21) {
        this.log += "\ncounter " + counter;

        if (r_points >= 150)
          this.updateStatus("WakeupInST_" + el.st_event[0].reward_id, {
            points: r_points,
            date: new Date(),
            counter: counter + 1
          });
        if (counter + 1 == 3) {
          // evento completato
          this.log += "\nevento completato";

          this.st_wakeup = true;
          this.log += "\ncondizioni st soddisfatte";
          this.completed_special_training.push({
            id: el.special_training.id,
            reward_id: el.st_event[0].reward_id,
            status: 1,
            text_description: el.text_description
          });
        }
      }
    } else {
      let ts = new Date();
      let h = ts.getHours();
      // let h = 23;
      if (h <= 9 || h >= 21)
        if (r_points >= 150)
          this.updateStatus("WakeupInST_" + el.st_event[0].reward_id, {
            points: r_points,
            date: new Date(),
            counter: 1
          });
    }
    // alert(this.log);
  }

  calcSTFood(el) {
    this.log += "\nhai sottoscritto food for thoughts";
    console.log("hai sottoscritto food for thoughts");

    const r_points = this.route_to_check.segment.reduce(
      (total, elem) => total + elem.points,
      0
    );

    const check_if_event_status_exist =
      this.st_redux_state["Food4ThoughtsInST_" + el.st_event[0].reward_id] &&
      this.st_redux_state["Food4ThoughtsInST_" + el.st_event[0].reward_id] != {}
        ? true
        : false;

    this.log += "\npunti tratta " + r_points;
    this.log += "\ncheck_if_event_status_exist " + check_if_event_status_exist;

    if (check_if_event_status_exist) {
      let last_date = new Date(
        this.st_redux_state[
          "Food4ThoughtsInST_" + el.st_event[0].reward_id
        ].date
      );
      let counter = this.st_redux_state[
        "Food4ThoughtsInST_" + el.st_event[0].reward_id
      ].counter;
      let points = this.st_redux_state[
        "Food4ThoughtsInST_" + el.st_event[0].reward_id
      ].points;
      let today = new Date();

      let msec = today - last_date;
      let mins = Math.floor(msec / 60000);
      let hrs = Math.floor(mins / 60);
      let days = Math.floor(hrs / 24);

      this.log += "\ndays " + days;
      this.log += "\ncounter " + counter;

      if (days == 0) {
        // vedi se hai gia' superato i 300 pti

        if (points < 300) {
          let tot_points = r_points + points;
          this.log += "\npunteggio accumulato " + tot_points;

          if (counter + 1 == 5 && tot_points >= 300) {
            // hai completato lo special training
            this.st_food = true;
            this.log += "\ncondizioni st soddisfatte";
            this.completed_special_training.push({
              id: el.special_training.id,
              reward_id: el.st_event[0].reward_id,
              status: 1,
              text_description: el.text_description
            });
          }

          this.updateStatus("Food4ThoughtsInST_" + el.st_event[0].reward_id, {
            points: tot_points,
            date: new Date(),
            counter: tot_points >= 300 ? counter + 1 : counter
          });
        }
      } else {
        if (days > 1) {
          this.updateStatus("Food4ThoughtsInST_" + el.st_event[0].reward_id, {
            points: r_points,
            date: new Date(),
            counter: r_points >= 300 ? 1 : 0
          });
        } else {
          // days == 1
          if (points < 300) {
            this.updateStatus("Food4ThoughtsInST_" + el.st_event[0].reward_id, {
              points: r_points,
              date: new Date(),
              counter: r_points >= 300 ? 1 : 0
            });
          } else {
            if (counter + 1 == 5 && r_points >= 300) {
              // hai completato lo special training
              this.st_food = true;
              this.log += "\ncondizioni st soddisfatte";
              this.completed_special_training.push({
                id: el.special_training.id,
                reward_id: el.st_event[0].reward_id,
                status: 1,
                text_description: el.text_description
              });
            }

            this.updateStatus("Food4ThoughtsInST_" + el.st_event[0].reward_id, {
              points: r_points,
              date: new Date(),
              counter: r_points >= 300 ? counter + 1 : counter
            });
          }
        }
      }
    } else {
      this.updateStatus("Food4ThoughtsInST_" + el.st_event[0].reward_id, {
        points: r_points,
        date: new Date(),
        counter: r_points >= 300 ? 1 : 0
      });
    }
    // alert(this.log);
  }

  calcSTMuv2Read(el) {
    this.log += "\nhai sottoscritto muv 2 read";

    if (this.calcDistFromOrtoBotanico()) {
      this.log += "\nevento completato";

      this.st_muvtoread = true;
      this.log += "\ncondizioni st soddisfatte";
      this.completed_special_training.push({
        id: el.special_training.id,
        reward_id: el.st_event[0].reward_id,
        status: 1,
        text_description: el.text_description
      });
    } else {
    }
    // alert(this.log);
  }

  calcSTUUsiSauna(el) {
    this.log += "\nhai sottoscritto uusi sauna";

    const r_points = this.route_to_check.segment.reduce(
      (total, elem) => total + elem.points,
      0
    );

    if (this.calcDistFromUusiSauna() && r_points > 200) {
      this.log += "\nevento completato";

      this.st_uusisauna = true;
      this.log += "\ncondizioni st soddisfatte";
      this.completed_special_training.push({
        id: el.special_training.id,
        reward_id: el.st_event[0].reward_id,
        status: 1,
        text_description: el.text_description
      });
    }

    // alert(this.log);
  }

  checkKickStartHoursAndModal() {
    let ts = new Date();
    let h = ts.getHours();
    let m = ts.getMinutes();

    if (h > 6 && h <= 11 && m <= 30) {
      let flag_walk = checkModalTypeDispatch(this.route_to_check, {
        event: { modal_type: "1" }
      });
      let flag_bike = checkModalTypeDispatch(this.route_to_check, {
        event: { modal_type: "2" }
      });

      if (flag_walk && flag_bike) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  calcSTKickStart(el) {
    // check su orario
    // check su modalita (walk o bike)
    if (this.checkKickStartHoursAndModal()) {
      this.log += "\nhai sottoscritto kick start";

      const check_if_event_status_exist =
        this.st_redux_state["KickStartInST_" + el.st_event[0].reward_id] &&
        this.st_redux_state["KickStartInST_" + el.st_event[0].reward_id] != {}
          ? true
          : false;

      this.log +=
        "\ncheck_if_event_status_exist " + check_if_event_status_exist;

      if (check_if_event_status_exist) {
        let last_date = new Date(
          this.st_redux_state["KickStartInST_" + el.st_event[0].reward_id].date
        );
        let counter = this.st_redux_state[
          "KickStartInST_" + el.st_event[0].reward_id
        ].counter;

        let today = new Date();

        let msec = today - last_date;
        let mins = Math.floor(msec / 60000);
        let hrs = Math.floor(mins / 60);
        let days = Math.floor(hrs / 24);

        this.log += "\ndays " + days;
        this.log += "\ncounter " + counter;

        if (days == 0) {
          // non fare un caiser
        } else {
          if (days > 1) {
            this.updateStatus("KickStartInST_" + el.st_event[0].reward_id, {
              date: new Date(),
              counter: 1
            });
          } else {
            // days == 1

            if (counter + 1 == 4) {
              // hai completato lo special training
              this.st_kickstart = true;
              this.log += "\ncondizioni st soddisfatte";
              this.completed_special_training.push({
                id: el.special_training.id,
                reward_id: el.st_event[0].reward_id,
                status: 1,
                text_description: el.text_description
              });
            }

            this.updateStatus("KickStartInST_" + el.st_event[0].reward_id, {
              date: new Date(),
              counter: counter + 1
            });
          }
        }
      } else {
        this.updateStatus("KickStartInST_" + el.st_event[0].reward_id, {
          date: new Date(),
          counter: 1
        });
      }
      // alert(this.log);
    }
  }

  calcSTChiavetteri(el) {
    // calc giorno
    this.log += "\nhai sottoscritto chiavettieri";

    const r_points = this.route_to_check.segment.reduce(
      (total, elem) => total + elem.points,
      0
    );

    const check_if_event_status_exist =
      this.st_redux_state["ChiavetteriInST_" + el.st_event[0].reward_id] &&
      this.st_redux_state["ChiavetteriInST_" + el.st_event[0].reward_id] != {}
        ? true
        : false;

    this.log += "\npunti tratta " + r_points;
    this.log += "\ncheck_if_event_status_exist " + check_if_event_status_exist;

    if (check_if_event_status_exist) {
      let last_date = new Date(
        this.st_redux_state["ChiavetteriInST_" + el.st_event[0].reward_id].date
      );
      let counter = this.st_redux_state[
        "ChiavetteriInST_" + el.st_event[0].reward_id
      ].counter;
      let points = this.st_redux_state[
        "ChiavetteriInST_" + el.st_event[0].reward_id
      ].points;
      let today = new Date();
      let day = today.getDay();

      let msec = today - last_date;
      let mins = Math.floor(msec / 60000);
      let hrs = Math.floor(mins / 60);
      let days = Math.floor(hrs / 24);

      this.log += "\ndays " + days;
      this.log += "\ncounter " + counter;

      let tot_points = r_points + points;
      this.log += "\npunteggio accumulato " + tot_points;

      // hai fatto piu' di 1000 punti
      // se sono passati al massimo due giorni
      // se oggi e' o venerdi sabato o domenica
      if (
        tot_points >= 1000 &&
        days <= 2 &&
        (day == 0 || day == 6 || day == 5)
      ) {
        // hai completato lo special training
        this.st_chiavetteri = true;
        this.log += "\ncondizioni st soddisfatte";
        this.completed_special_training.push({
          id: el.special_training.id,
          reward_id: el.st_event[0].reward_id,
          status: 1,
          text_description: el.text_description
        });
      }

      // se oggi e' un finesettimana
      // e sono passati al massimo due giorni
      // sommo i punteggi altrimenti riparto da 0
      if ((day == 0 || day == 6 || day == 5) && days <= 2)
        this.updateStatus("ChiavetteriInST_" + el.st_event[0].reward_id, {
          points: tot_points,
          date: new Date(),
          counter: tot_points >= 1000 && days > 1 ? counter + 1 : counter
        });
      else
        this.updateStatus("ChiavetteriInST_" + el.st_event[0].reward_id, {
          points: r_points,
          date: new Date(),
          counter: r_points >= 1000 ? 1 : 0
        });
    } else {
      let today = new Date();
      let day = today.getDay();
      // se e' o ven o sabato o domenica
      if (day == 0 || day == 6 || day == 5)
        this.updateStatus("ChiavetteriInST_" + el.st_event[0].reward_id, {
          points: r_points,
          date: new Date(),
          counter: r_points >= 1000 ? 1 : 0
        });
    }
    // alert(this.log);
  }

  calcSTInsula(el) {
    this.log += "\nhai sottoscritto st insula";

    if (this.calcDistFromCentroStoricoMayDay()) {
      this.log += "\nsei in centro e a piedi";

      const check_if_event_status_exist =
        this.st_redux_state["InsulaInST_" + el.st_event[0].reward_id] &&
        this.st_redux_state["InsulaInST_" + el.st_event[0].reward_id] != {}
          ? true
          : false;

      this.log +=
        "\ncheck_if_event_status_exist " + check_if_event_status_exist;

      if (check_if_event_status_exist) {
        let distance = this.st_redux_state[
          "InsulaInST_" + el.st_event[0].reward_id
        ].counter;
        let counter = this.st_redux_state[
          "InsulaInST_" + el.st_event[0].reward_id
        ].counter;
        let date = new Date(
          this.st_redux_state["InsulaInST_" + el.st_event[0].reward_id].date
        );
        let now = new Date();
        let s_msec = now - date;
        let s_mins = Math.floor(s_msec / 60000);
        let s_hrs = Math.floor(s_mins / 60);
        let s_days = Math.floor(s_hrs / 24);

        if (s_days < 8) {
          if (counter + 1 >= 3) {
            // evento completato
            this.log += "\nevento completato";
            this.st_insula = true;
            this.log += "\ncondizioni st soddisfatte";
            this.completed_special_training.push({
              id: el.special_training.id,
              reward_id: el.st_event[0].reward_id,
              status: 1,
              text_description: el.text_description
            });
          }

          this.updateStatus("InsulaInST_" + el.st_event[0].reward_id, {
            date,
            counter: counter + 1
          });
        } else {
          this.updateStatus("InsulaInST_" + el.st_event[0].reward_id, {
            date: new Date(),
            counter: 1
          });
        }
      } else {
        this.updateStatus("InsulaInST_" + el.st_event[0].reward_id, {
          date: new Date(),
          counter: 1
        });
      }
      // alert(this.log);
    }
  }

  calcDistFromTeatroMassimo() {
    // circa 60 metri
    const thresholdGPS = 0.125;
    const distance = haversine(
      this.s_point.latitude,
      this.s_point.longitude,
      38.1201924,
      13.3550415
    );

    const distance_from_centro = distance <= thresholdGPS ? true : false;
    if (distance_from_centro) return true;
    else return false;
  }

  calcSTTeatromassimo(el) {
    let log = "\nhai sottoscritto teatro massimo";

    const r_points = this.route_to_check.segment.reduce(
      (total, elem) => total + elem.points,
      0
    );

    const check_if_event_status_exist =
      this.st_redux_state["TeatromassimoInST_" + el.st_event[0].reward_id] &&
      this.st_redux_state["TeatromassimoInST_" + el.st_event[0].reward_id] != {}
        ? true
        : false;

    log += "\npunti tratta " + r_points;
    log += "\ncheck_if_event_status_exist " + check_if_event_status_exist;
    log += "\nsei vicino? " + this.calcDistFromTeatroMassimo();

    if (check_if_event_status_exist) {
      let last_date = new Date(
        this.st_redux_state[
          "TeatromassimoInST_" + el.st_event[0].reward_id
        ].date
      );

      this.log += "\nsei vicino? " + this.calcDistFromTeatroMassimo();

      if (this.calcDistFromTeatroMassimo() && r_points >= 200) {
        // hai completato lo st
        this.st_teatromassimo = true;
        this.log += "\ncondizioni st soddisfatte";
        // this.completed_special_training.push({
        //   id: el.special_training.id,
        //   reward_id: el.st_event[0].reward_id,
        //   status: 1,
        //   text_description: el.text_description
        // });
        toggleStTeatro(this.dispatch, {
          id: el.special_training.id,
          reward_id: el.st_event[0].reward_id,
          status: 1,
          text_description: el.text_description
        });
        this.updateStatus("TeatromassimoInST_" + el.st_event[0].reward_id, {
          date: new Date()
        });
      }
    } else {
      if (this.calcDistFromTeatroMassimo() && r_points >= 200) {
        this.updateStatus("TeatromassimoInST_" + el.st_event[0].reward_id, {
          date: new Date()
        });
        this.st_teatromassimo = true;
        // this.completed_special_training.push({
        //   id: el.special_training.id,
        //   reward_id: el.st_event[0].reward_id,
        //   status: 1,
        //   text_description: el.text_description
        // });
        toggleStTeatro(this.dispatch, {
          id: el.special_training.id,
          reward_id: el.st_event[0].reward_id,
          status: 1,
          text_description: el.text_description
        });
      }
    }
    // alert(log);
  }

  calcSTBarcelona(el) {
    this.log += "\nhai sottoscritto barcelona";

    const r_calories = this.route_to_check.segment.reduce(
      (total, elem) => total + elem.calories,
      0
    );

    const check_if_event_status_exist =
      this.st_redux_state[
        "BarcelonaCaloriesInST_" + el.st_event[0].reward_id
      ] &&
      this.st_redux_state[
        "BarcelonaCaloriesInST_" + el.st_event[0].reward_id
      ] != {}
        ? true
        : false;

    this.log += "\ncalorie tratta " + r_calories;
    this.log += "\ncheck_if_event_status_exist " + check_if_event_status_exist;

    if (check_if_event_status_exist) {
      let counter = this.st_redux_state[
        "BarcelonaCaloriesInST_" + el.st_event[0].reward_id
      ].counter;
      let date = new Date(
        this.st_redux_state[
          "BarcelonaCaloriesInST_" + el.st_event[0].reward_id
        ].date
      );
      let now = new Date();
      let s_msec = now - date;
      let s_mins = Math.floor(s_msec / 60000);

      if (s_mins > 1) {
        if (counter + r_calories >= 4000) {
          // evento completato
          this.log += "\nevento completato";

          this.st_barcelona = true;
          this.log += "\ncondizioni st soddisfatte";
          this.completed_special_training.push({
            id: el.special_training.id,
            reward_id: el.st_event[0].reward_id,
            status: 1,
            text_description: el.text_description
          });
        }

        this.updateStatus("BarcelonaCaloriesInST_" + el.st_event[0].reward_id, {
          date: new Date(),
          counter: counter + r_calories
        });
      }
    } else {
      if (r_calories >= 4000) {
        // evento completato
        this.log += "\nevento completato";

        this.st_barcelona = true;
        this.log += "\ncondizioni st soddisfatte";
        this.completed_special_training.push({
          id: el.special_training.id,
          reward_id: el.st_event[0].reward_id,
          status: 1,
          text_description: el.text_description
        });
      }

      this.updateStatus("BarcelonaCaloriesInST_" + el.st_event[0].reward_id, {
        date: new Date(),
        counter: r_calories
      });
    }
    // alert(this.log);
  }

  calcSTSantandreu(el) {
    this.log += "\nhai sottoscritto sant andreu";

    const r_distance = this.route_to_check.segment.reduce(
      (total, elem) => total + elem.distance_travelled,
      0
    );

    const check_if_event_status_exist =
      this.st_redux_state["SantandreuInST_" + el.st_event[0].reward_id] &&
      this.st_redux_state["SantandreuInST_" + el.st_event[0].reward_id] != {}
        ? true
        : false;

    this.log += "\ndistanza tratta " + r_distance;
    this.log += "\ncheck_if_event_status_exist " + check_if_event_status_exist;

    let modal_flag = checkModalTypeDispatch(this.route_to_check, {
      event: { modal_type: "1" }
    });

    if (modal_flag) {
      if (check_if_event_status_exist) {
        let counter = this.st_redux_state[
          "SantandreuInST_" + el.st_event[0].reward_id
        ].counter;
        let date = new Date(
          this.st_redux_state["SantandreuInST_" + el.st_event[0].reward_id].date
        );
        let now = new Date();
        let s_msec = now - date;
        let s_mins = Math.floor(s_msec / 60000);

        if (s_mins > 1) {
          if (counter + r_distance >= 20) {
            // evento completato
            this.log += "\nevento completato";

            this.st_santandreu = true;
            this.log += "\ncondizioni st soddisfatte";
            this.completed_special_training.push({
              id: el.special_training.id,
              reward_id: el.st_event[0].reward_id,
              status: 1,
              text_description: el.text_description
            });
          }

          this.updateStatus("SantandreuInST_" + el.st_event[0].reward_id, {
            date: new Date(),
            counter: counter + r_distance
          });
        }
      } else {
        if (r_distance >= 20) {
          // evento completato
          this.log += "\nevento completato";

          this.st_santandreu = true;
          this.log += "\ncondizioni st soddisfatte";
          this.completed_special_training.push({
            id: el.special_training.id,
            reward_id: el.st_event[0].reward_id,
            status: 1,
            text_description: el.text_description
          });
        }

        this.updateStatus("SantandreuInST_" + el.st_event[0].reward_id, {
          date: new Date(),
          counter: r_distance
        });
      }
    }
    // alert(this.log);
  }

  calcSTMRPecas(el) {
    this.log += "\nhai sottoscritto mr pecas";

    const r_points = this.route_to_check.segment.reduce(
      (total, elem) => total + elem.points,
      0
    );

    const check_if_event_status_exist =
      this.st_redux_state["MRPecasInST_" + el.st_event[0].reward_id] &&
      this.st_redux_state["MRPecasInST_" + el.st_event[0].reward_id] != {}
        ? true
        : false;

    this.log += "\ndistanza tratta " + r_points;
    this.log += "\ncheck_if_event_status_exist " + check_if_event_status_exist;

    let modal_flag = checkModalTypeDispatch(this.route_to_check, {
      event: { modal_type: "2" }
    });

    this.log += "\ntratta in bici " + modal_flag;
    if (modal_flag) {
      if (check_if_event_status_exist) {
        let counter = this.st_redux_state[
          "MRPecasInST_" + el.st_event[0].reward_id
        ].counter;
        let date = new Date(
          this.st_redux_state["MRPecasInST_" + el.st_event[0].reward_id].date
        );
        let now = new Date();
        let s_msec = now - date;
        let s_mins = Math.floor(s_msec / 60000);

        if (s_mins > 1) {
          if (counter + r_points >= 10000) {
            // evento completato
            this.log += "\nevento completato";

            this.st_pecas = true;
            this.log += "\ncondizioni st soddisfatte";
            this.completed_special_training.push({
              id: el.special_training.id,
              reward_id: el.st_event[0].reward_id,
              status: 1,
              text_description: el.text_description
            });
          }

          this.updateStatus("MRPecasInST_" + el.st_event[0].reward_id, {
            date: new Date(),
            counter: counter + r_points
          });
        }
      } else {
        if (r_points >= 10000) {
          // evento completato
          this.log += "\nevento completato";

          this.st_pecas = true;
          this.log += "\ncondizioni st soddisfatte";
          this.completed_special_training.push({
            id: el.special_training.id,
            reward_id: el.st_event[0].reward_id,
            status: 1,
            text_description: el.text_description
          });
        }

        this.updateStatus("MRPecasInST_" + el.st_event[0].reward_id, {
          date: new Date(),
          counter: r_points
        });
      }
    }
    // alert(this.log);
  }

  calcSTInsigpol(el) {
    this.log += "\nhai sottoscritto insigpol";

    const r_points = this.route_to_check.segment.reduce(
      (total, elem) => total + elem.points,
      0
    );

    const check_if_event_status_exist =
      this.st_redux_state["InsigpolInST_" + el.st_event[0].reward_id] &&
      this.st_redux_state["InsigpolInST_" + el.st_event[0].reward_id] != {}
        ? true
        : false;

    this.log += "\ndistanza tratta " + r_points;
    this.log += "\ncheck_if_event_status_exist " + check_if_event_status_exist;

    let modal_flag_walk = checkModalTypeDispatch(this.route_to_check, {
      event: { modal_type: "1" }
    });

    let modal_flag_bike = checkModalTypeDispatch(this.route_to_check, {
      event: { modal_type: "2" }
    });

    this.log += "\ntratta a piedi" + modal_flag_walk;
    this.log += "\ntratta in bici" + modal_flag_bike;

    if (modal_flag_walk || modal_flag_bike) {
      if (check_if_event_status_exist) {
        let counter = this.st_redux_state[
          "InsigpolInST_" + el.st_event[0].reward_id
        ].counter;
        let date = new Date(
          this.st_redux_state["InsigpolInST_" + el.st_event[0].reward_id].date
        );
        let now = new Date();
        let s_msec = now - date;
        let s_mins = Math.floor(s_msec / 60000);

        if (s_mins > 1) {
          if (counter + r_points >= 1200) {
            // evento completato
            this.log += "\nevento completato";

            this.st_insigpol = true;
            this.log += "\ncondizioni st soddisfatte";
            this.completed_special_training.push({
              id: el.special_training.id,
              reward_id: el.st_event[0].reward_id,
              status: 1,
              text_description: el.text_description
            });
          }

          this.updateStatus("InsigpolInST_" + el.st_event[0].reward_id, {
            date: new Date(),
            counter: counter + r_points
          });
        }
      } else {
        if (r_points >= 1200) {
          // evento completato
          this.log += "\nevento completato";

          this.st_insigpol = true;
          this.log += "\ncondizioni st soddisfatte";
          this.completed_special_training.push({
            id: el.special_training.id,
            reward_id: el.st_event[0].reward_id,
            status: 1,
            text_description: el.text_description
          });
        }

        this.updateStatus("InsigpolInST_" + el.st_event[0].reward_id, {
          date: new Date(),
          counter: r_points
        });
      }
    }
    // alert(this.log);
  }

  calcSTBallarak(el) {
    this.log += "\nhai sottoscritto ballarak";

    const r_points = this.route_to_check.segment.reduce(
      (total, elem) => total + elem.points,
      0
    );

    this.log += "\npunti tratta " + r_points;

    let now = new Date();
    let h = now.getHours();
    // let h = 21;
    this.log += "\nora tratta " + h;

    if (h > 20 || h < 6)
      if (this.calcDistFromCentroStoricoMayDay())
        if (r_points >= 400) {
          // evento completato
          this.log += "\nevento completato";

          this.st_ballarak = true;
          this.log += "\ncondizioni st soddisfatte";
          // this.completed_special_training.push({
          //   id: el.special_training.id,
          //   reward_id: el.st_event[0].reward_id,
          //   status: 1,
          //   text_description: el.text_description
          // });

          toggleStBallarak(this.dispatch, {
            id: el.special_training.id,
            reward_id: el.st_event[0].reward_id,
            status: 1,
            text_description: el.text_description
          });

          this.updateStatus("BallarakInST_" + el.st_event[0].reward_id, {
            date: new Date(),
            counter: r_points
          });
        }

    // alert(this.log);
  }

  calcSTGota(el) {
    this.log += "\nhai sottoscritto burn it";

    const r_calories = this.route_to_check.segment.reduce(
      (total, elem) => total + elem.calories,
      0
    );

    const check_if_event_status_exist =
      this.st_redux_state["GotaInST_" + el.st_event[0].reward_id] &&
      this.st_redux_state["GotaInST_" + el.st_event[0].reward_id] != {}
        ? true
        : false;

    this.log += "\ncalorie tratta " + r_calories;
    this.log += "\ncheck_if_event_status_exist " + check_if_event_status_exist;

    if (check_if_event_status_exist) {
      let counter = this.st_redux_state["GotaInST_" + el.st_event[0].reward_id]
        .counter;
      let date = new Date(
        this.st_redux_state["GotaInST_" + el.st_event[0].reward_id].date
      );
      let now = new Date();
      let s_msec = now - date;
      let s_mins = Math.floor(s_msec / 60000);

      if (s_mins > 1) {
        if (counter + r_calories >= 2000) {
          // evento completato
          this.log += "\nevento completato";

          this.st_gota = true;
          this.log += "\ncondizioni st soddisfatte";
          this.completed_special_training.push({
            id: el.special_training.id,
            reward_id: el.st_event[0].reward_id,
            status: 1,
            text_description: el.text_description
          });
        }

        this.updateStatus("GotaInST_" + el.st_event[0].reward_id, {
          date: new Date(),
          counter: counter + r_calories
        });
      }
    } else {
      if (r_calories >= 2000) {
        // evento completato
        this.log += "\nevento completato";

        this.st_gota = true;
        this.log += "\ncondizioni st soddisfatte";
        this.completed_special_training.push({
          id: el.special_training.id,
          reward_id: el.st_event[0].reward_id,
          status: 1,
          text_description: el.text_description
        });
      }

      this.updateStatus("GotaInST_" + el.st_event[0].reward_id, {
        date: new Date(),
        counter: r_calories
      });
    }
    // alert(this.log);
  }

  calcSTEspresso(el) {
    this.log += "\nhai sottoscritto burn it";

    const r_points = this.route_to_check.segment.reduce(
      (total, elem) => total + elem.points,
      0
    );

    const check_if_event_status_exist =
      this.st_redux_state["EspressoInST_" + el.st_event[0].reward_id] &&
      this.st_redux_state["EspressoInST_" + el.st_event[0].reward_id] != {}
        ? true
        : false;

    this.log += "\npunti tratta " + r_points;
    this.log += "\ncheck_if_event_status_exist " + check_if_event_status_exist;

    if (check_if_event_status_exist) {
      let counter = this.st_redux_state[
        "EspressoInST_" + el.st_event[0].reward_id
      ].counter;
      let date = new Date(
        this.st_redux_state["EspressoInST_" + el.st_event[0].reward_id].date
      );
      let now = new Date();
      let s_msec = now - date;
      let s_mins = Math.floor(s_msec / 60000);

      if (s_mins > 1) {
        if (counter + r_points >= 5000) {
          // evento completato
          this.log += "\nevento completato";

          this.st_espresso = true;
          this.log += "\ncondizioni st soddisfatte";
          this.completed_special_training.push({
            id: el.special_training.id,
            reward_id: el.st_event[0].reward_id,
            status: 1,
            text_description: el.text_description
          });
        }

        this.updateStatus("EspressoInST_" + el.st_event[0].reward_id, {
          date: new Date(),
          counter: counter + r_points
        });
      }
    } else {
      if (r_points >= 5000) {
        // evento completato
        this.log += "\nevento completato";

        this.st_espresso = true;
        this.log += "\ncondizioni st soddisfatte";
        this.completed_special_training.push({
          id: el.special_training.id,
          reward_id: el.st_event[0].reward_id,
          status: 1,
          text_description: el.text_description
        });
      }

      this.updateStatus("EspressoInST_" + el.st_event[0].reward_id, {
        date: new Date(),
        counter: r_points
      });
    }
    // alert(this.log);
  }

  calcSTWalktoget(el) {
    this.log += "\nhai sottoscritto walk to get";
    console.log("hai sottoscritto walk to get");

    const r_points = this.route_to_check.segment.reduce(
      (total, elem) => total + elem.points,
      0
    );

    const check_if_event_status_exist =
      this.st_redux_state["WalktogetInST_" + el.st_event[0].reward_id] &&
      this.st_redux_state["WalktogetInST_" + el.st_event[0].reward_id] != {}
        ? true
        : false;

    this.log += "\npunti tratta " + r_points;
    this.log += "\ncheck_if_event_status_exist " + check_if_event_status_exist;

    if (check_if_event_status_exist) {
      let last_date = new Date(
        this.st_redux_state["WalktogetInST_" + el.st_event[0].reward_id].date
      );
      let counter = this.st_redux_state[
        "WalktogetInST_" + el.st_event[0].reward_id
      ].counter;
      let today = new Date();

      let msec = today - last_date;
      let mins = Math.floor(msec / 60000);
      let hrs = Math.floor(mins / 60);
      let days = Math.floor(hrs / 24);

      this.log += "\ndays " + days;
      this.log += "\ncounter " + counter;

      if (days == 0) {
        //
      } else {
        if (days > 1) {
          if (r_points > 200)
            this.updateStatus("WalktogetInST_" + el.st_event[0].reward_id, {
              date: new Date(),
              counter: 1
            });
        } else {
          // days == 1
          if (r_points > 200) {
            if (counter + 1 == 5) {
              // hai completato lo special training
              this.st_walktoget = true;
              this.log += "\ncondizioni st soddisfatte";
              // this.completed_special_training.push({
              //   id: el.special_training.id,
              //   reward_id: el.st_event[0].reward_id,
              //   status: 1,
              //   text_description: el.text_description
              // });
              toggleStMuvtoget(this.dispatch, {
                id: el.special_training.id,
                reward_id: el.st_event[0].reward_id,
                status: 1,
                text_description: el.text_description
              });
            }

            this.updateStatus("WalktogetInST_" + el.st_event[0].reward_id, {
              date: new Date(),
              counter: counter + 1
            });
          }
        }
      }
    } else {
      if (r_points > 200)
        this.updateStatus("WalktogetInST_" + el.st_event[0].reward_id, {
          date: new Date(),
          counter: r_points >= 200 ? 1 : 0
        });
    }
    // alert(this.log);
  }

  calcSTTakecare(el) {
    this.log += "\nhai sottoscritto barcelona";

    const points = this.route_to_check.segment.reduce(
      (total, elem) => total + elem.points,
      0
    );

    const check_if_event_status_exist =
      this.st_redux_state["TakecareInST_" + el.st_event[0].reward_id] &&
      this.st_redux_state["TakecareInST_" + el.st_event[0].reward_id] != {}
        ? true
        : false;

    this.log += "\ncalorie tratta " + points;
    this.log += "\ncheck_if_event_status_exist " + check_if_event_status_exist;

    if (check_if_event_status_exist) {
      let counter = this.st_redux_state[
        "TakecareInST_" + el.st_event[0].reward_id
      ].counter;
      let date = new Date(
        this.st_redux_state["TakecareInST_" + el.st_event[0].reward_id].date
      );
      let now = new Date();
      let s_msec = now - date;
      let s_mins = Math.floor(s_msec / 60000);

      if (s_mins > 1) {
        if (counter + points >= 800) {
          // evento completato
          this.log += "\nevento completato";

          this.st_takecare = true;
          this.log += "\ncondizioni st soddisfatte";
          this.completed_special_training.push({
            id: el.special_training.id,
            reward_id: el.st_event[0].reward_id,
            status: 1,
            text_description: el.text_description
          });
        }

        this.updateStatus("TakecareInST_" + el.st_event[0].reward_id, {
          date: new Date(),
          counter: counter + points
        });
      }
    } else {
      if (points >= 800) {
        // evento completato
        this.log += "\nevento completato";

        this.st_barcelona = true;
        this.log += "\ncondizioni st soddisfatte";
        this.completed_special_training.push({
          id: el.special_training.id,
          reward_id: el.st_event[0].reward_id,
          status: 1,
          text_description: el.text_description
        });
      }

      this.updateStatus("TakecareInST_" + el.st_event[0].reward_id, {
        date: new Date(),
        counter: points
      });
    }
    // alert(this.log);
  }

  calcSTFundao(el) {
    this.log += "\nhai sottoscritto fundao";
    console.log("hai sottoscritto fundao");

    const r_points = this.route_to_check.segment.reduce(
      (total, elem) => total + elem.points,
      0
    );

    const check_if_event_status_exist =
      this.st_redux_state["FundaoInST_" + el.st_event[0].reward_id] &&
      this.st_redux_state["FundaoInST_" + el.st_event[0].reward_id] != {}
        ? true
        : false;

    this.log += "\npunti tratta " + r_points;
    this.log += "\ncheck_if_event_status_exist " + check_if_event_status_exist;

    if (check_if_event_status_exist) {
      let last_date = new Date(
        this.st_redux_state["FundaoInST_" + el.st_event[0].reward_id].date
      );
      let counter = this.st_redux_state[
        "FundaoInST_" + el.st_event[0].reward_id
      ].counter;
      let today = new Date();

      let msec = today - last_date;
      let mins = Math.floor(msec / 60000);
      let hrs = Math.floor(mins / 60);
      let days = Math.floor(hrs / 24);

      this.log += "\ndays " + days;
      this.log += "\ncounter " + counter;

      if (days == 0) {
        //
      } else {
        if (days >= 1) {
          if (counter + 1 >= 3) {
            // hai completato lo special training
            this.st_fundao = true;
            this.log += "\ncondizioni st soddisfatte";
            this.completed_special_training.push({
              id: el.special_training.id,
              reward_id: el.st_event[0].reward_id,
              status: 1,
              text_description: el.text_description
            });
          }

          this.updateStatus("FundaoInST_" + el.st_event[0].reward_id, {
            date: new Date(),
            counter: counter + 1
          });
        }
        //  else {
        //   // days == 1
        //   if (counter + 1 >= 3) {
        //     // hai completato lo special training
        //     this.st_fundao = true;
        //     this.log += "\ncondizioni st soddisfatte";
        //     this.completed_special_training.push({
        //       id: el.special_training.id,
        //       reward_id: el.st_event[0].reward_id,
        //       status: 1,
        //       text_description: el.text_description
        //     });
        //   }

        //   this.updateStatus("FundaoInST_" + el.st_event[0].reward_id, {
        //     date: new Date(),
        //     counter: counter + 1
        //   });
        // }
      }
    } else {
      this.updateStatus("FundaoInST_" + el.st_event[0].reward_id, {
        date: new Date(),
        counter: 1
      });
    }
    // alert(this.log);
  }

  calcSTGiretto(el) {
    this.log += "\nhai sottoscritto giretto in citta";

    const r_points = this.route_to_check.segment.reduce(
      (total, elem) => total + elem.points,
      0
    );

    this.log += "\npunti tratta " + r_points;

    let now = new Date();
    let d = now.getDate();
    let m = now.getMonth();
    let h = now.getHours();
    // let h = 21;
    this.log += "\nmese tratta " + m;
    this.log += "\ngiorno tratta " + d;
    this.log += "\nora tratta " + h;

    // if (true) {
    // if (true) {
    if (d == 19 && m == 9) {
      if (h >= 7 && h <= 10) {
        let flag = checkFrequentTripEvent(this.route_to_check);
        this.log += "\nfreq trip " + flag;
        if (flag) {
          // evento completato
          this.log += "\nevento completato";

          this.st_giretto = true;
          this.log += "\ncondizioni st soddisfatte";
          this.completed_special_training.push({
            id: el.special_training.id,
            reward_id: el.st_event[0].reward_id,
            status: 1,
            text_description: el.text_description
          });

          this.updateStatus("GirettoInST_" + el.st_event[0].reward_id, {
            date: new Date(),
            counter: r_points
          });
        }
      }
    }

    // alert(this.log);
  }

  calcSTAgrodolce(el) {
    this.log += "\nhai sottoscritto giretto in citta";

    const r_points = this.route_to_check.segment.reduce(
      (total, elem) => total + elem.points,
      0
    );

    this.log += "\npunti tratta " + r_points;

    let now = new Date();
    let d = now.getDate();
    let m = now.getMonth();
    let h = now.getHours();
    // let h = 21;
    this.log += "\nmese tratta " + m;
    this.log += "\ngiorno tratta " + d;
    this.log += "\nora tratta " + h;

    // if (true) {
    // if (true) {
    if (d == 21 && m == 9) {
      if (h >= 10 && h <= 14) {
        const check_if_event_status_exist =
          this.st_redux_state["AgrodolceInST_" + el.st_event[0].reward_id] &&
          this.st_redux_state["AgrodolceInST_" + el.st_event[0].reward_id] != {}
            ? true
            : false;

        this.log += "\npunti tratta " + r_points;
        this.log +=
          "\ncheck_if_event_status_exist " + check_if_event_status_exist;

        if (check_if_event_status_exist) {
          let counter = this.st_redux_state[
            "AgrodolceInST_" + el.st_event[0].reward_id
          ].counter;
          if (counter + r_points >= 1500) {
            // hai completato lo special training
            this.st_agrodolce = true;
            this.log += "\ncondizioni st soddisfatte";
            this.completed_special_training.push({
              id: el.special_training.id,
              reward_id: el.st_event[0].reward_id,
              status: 1,
              text_description: el.text_description
            });
          }
          this.updateStatus("AgrodolceInST_" + el.st_event[0].reward_id, {
            date: new Date(),
            counter: counter + r_points
          });
        } else {
          if (r_points >= 1500) {
            // hai completato lo special training
            this.st_agrodolce = true;
            this.log += "\ncondizioni st soddisfatte";
            this.completed_special_training.push({
              id: el.special_training.id,
              reward_id: el.st_event[0].reward_id,
              status: 1,
              text_description: el.text_description
            });
          }
          this.updateStatus("AgrodolceInST_" + el.st_event[0].reward_id, {
            date: new Date(),
            counter: r_points
          });
        }
      }
    }

    // alert(this.log);
  }

  calcSTStreetparade(el) {
    this.log += "\nhai sottoscritto street parade";
    console.log("hai sottoscritto street parade");

    const r_points = this.route_to_check.segment.reduce(
      (total, elem) => total + elem.points,
      0
    );

    const check_if_event_status_exist =
      this.st_redux_state["StreetparadeInST_" + el.st_event[0].reward_id] &&
      this.st_redux_state["StreetparadeInST_" + el.st_event[0].reward_id] != {}
        ? true
        : false;

    this.log += "\npunti tratta " + r_points;
    this.log += "\ncheck_if_event_status_exist " + check_if_event_status_exist;

    if (check_if_event_status_exist) {
      let last_date = new Date(
        this.st_redux_state["StreetparadeInST_" + el.st_event[0].reward_id].date
      );
      let counter = this.st_redux_state[
        "StreetparadeInST_" + el.st_event[0].reward_id
      ].counter;
      let today = new Date();

      let msec = today - last_date;
      let mins = Math.floor(msec / 60000);
      let hrs = Math.floor(mins / 60);
      let days = Math.floor(hrs / 24);

      this.log += "\ndays " + days;
      this.log += "\ncounter " + counter;

      if (r_points > 150) {
        if (counter + 1 >= 3) {
          // hai completato lo special training
          this.st_streetparade = true;
          this.log += "\ncondizioni st soddisfatte";
          this.completed_special_training.push({
            id: el.special_training.id,
            reward_id: el.st_event[0].reward_id,
            status: 1,
            text_description: el.text_description
          });
        }

        this.updateStatus("StreetparadeInST_" + el.st_event[0].reward_id, {
          date: new Date(),
          counter: counter + 1
        });
      }
    } else {
      if (r_points >= 150)
        this.updateStatus("StreetparadeInST_" + el.st_event[0].reward_id, {
          date: new Date(),
          counter: 1
        });
    }
    // alert(this.log);
  }

  calcSTBikeweek(el) {
    this.log += "\nhai sottoscritto bike week";
    console.log("hai sottoscritto bike week");

    const r_points = this.route_to_check.segment.reduce(
      (total, elem) => total + elem.points,
      0
    );

    const check_if_event_status_exist =
      this.st_redux_state["BikeweekInST_" + el.st_event[0].reward_id] &&
      this.st_redux_state["BikeweekInST_" + el.st_event[0].reward_id] != {}
        ? true
        : false;

    this.log += "\npunti tratta " + r_points;
    this.log += "\ncheck_if_event_status_exist " + check_if_event_status_exist;

    let flag = checkModalTypeDispatch(this.route_to_check, {
      event: { modal_type: "2" }
    });
    if (flag)
      if (check_if_event_status_exist) {
        let last_date = new Date(
          this.st_redux_state["BikeweekInST_" + el.st_event[0].reward_id].date
        );
        let counter = this.st_redux_state[
          "BikeweekInST_" + el.st_event[0].reward_id
        ].counter;
        let today = new Date();

        // let msec = today - last_date;
        // let mins = Math.floor(msec / 60000);
        // let hrs = Math.floor(mins / 60);
        // let days = Math.floor(hrs / 24);

        // this.log += "\ndays " + days;
        // this.log += "\ncounter " + counter;

        let now = new Date();
        let s_msec = now - last_date;
        let s_mins = Math.floor(s_msec / 60000);

        if (s_mins > 1)
          if (r_points >= 500) {
            if (counter + 1 >= 5) {
              // hai completato lo special training
              this.st_bikeweek = true;
              this.log += "\ncondizioni st soddisfatte";
              this.completed_special_training.push({
                id: el.special_training.id,
                reward_id: el.st_event[0].reward_id,
                status: 1,
                text_description: el.text_description
              });
            }

            this.updateStatus("BikeweekInST_" + el.st_event[0].reward_id, {
              date: new Date(),
              counter: counter + 1
            });
          }
      } else {
        if (r_points >= 500) {
          this.updateStatus("BikeweekInST_" + el.st_event[0].reward_id, {
            date: new Date(),
            counter: 1
          });
        }
      }
    // alert(this.log);
  }

  calcSTBikePmpi(el) {
    this.log += "\nhai sottoscritto giretto in citta";

    const r_points = this.route_to_check.segment.reduce(
      (total, elem) => total + elem.points,
      0
    );

    this.log += "\npunti tratta " + r_points;

    let now = new Date();
    let d = now.getDate();
    let m = now.getMonth();
    let h = now.getHours();
    // let h = 21;
    this.log += "\nmese tratta " + m;
    this.log += "\ngiorno tratta " + d;
    this.log += "\nora tratta " + h;

    // if (true) {
    // if (true) {
    if (d == 22 && m == 9) {
      let flag = checkModalTypeDispatch(this.route_to_check, {
        event: { modal_type: "2" }
      });
      if (flag) {
        // evento completato
        this.log += "\nevento completato";

        this.st_bikepmpi = true;
        this.log += "\ncondizioni st soddisfatte";
        this.completed_special_training.push({
          id: el.special_training.id,
          reward_id: el.st_event[0].reward_id,
          status: 1,
          text_description: el.text_description
        });

        this.updateStatus("BikepmpiInST_" + el.st_event[0].reward_id, {
          date: new Date(),
          counter: r_points
        });
      }
    }

    // alert(this.log);
  }

  calcSTMercato(el) {
    this.log += "\nhai sottoscritto giretto in MERCATO";

    let flag = checkModalTypeDispatch(this.route_to_check, {
      event: { modal_type: "1" }
    });
    console.log(flag);
    if (flag) {
      let segments = this.route_to_check.segment[0].route.replace("(", "");
      segments = segments.replace(")", "");
      segments = segments.replace("LINESTRING ", "");
      let splitted_segments = segments.split(",");
      let lat_lon_alt_array = splitted_segments.map(e => {
        return e.split(" ");
      });

      // console.log(segments);
      // console.log(splitted_segments);
      // console.log(lat_lon_alt_array);

      console.log(this.route_to_check.segment[0].route);
      let in_mercato = this.checkLatLonArrayInCoord(
        lat_lon_alt_array,
        38.1111816,
        13.3598044
      );

      if (in_mercato) {
        // evento completato
        this.log += "\nevento completato";

        this.st_mercato = true;
        this.log += "\ncondizioni st soddisfatte";
        this.completed_special_training.push({
          id: el.special_training.id,
          reward_id: el.st_event[0].reward_id,
          status: 1,
          text_description: el.text_description
        });

        this.updateStatus("MercatoInST_" + el.st_event[0].reward_id, {
          date: new Date()
        });
      }
    }

    // alert(this.log);
  }

  checkLatLonArrayInCoord(
    lat_lon_alt_array = new Array(),
    latitude = null,
    longitude = null
  ) {
    let flag = false;

    lat_lon_alt_array.forEach(e => {
      let lat = null,
        lon = null;
      if (e[0] == "") {
        lat = e[1];
        lon = e[2];
      } else {
        lat = e[0];
        lon = e[1];
      }

      const thresholdGPS = 75; // circa 37km
      // const thresholdGPS = 0.3; // circa 150mt
      const distance = haversine(lat, lon, latitude, longitude);

      console.log(distance);

      if (distance <= thresholdGPS) {
        flag = true;
      }
    });

    return flag;
  }

  calcSTCiwara(el) {
    this.log += "\nhai sottoscritto ciwara";

    const r_points = this.route_to_check.segment.reduce(
      (total, elem) => total + elem.points,
      0
    );

    const check_if_event_status_exist =
      this.st_redux_state["CiwaraInST_" + el.st_event[0].reward_id] &&
      this.st_redux_state["CiwaraInST_" + el.st_event[0].reward_id] != {}
        ? true
        : false;

    this.log += "\npunti tratta " + r_points;
    this.log += "\ncheck_if_event_status_exist " + check_if_event_status_exist;

    let now = new Date();
    let h = now.getHours();
    if (h >= 8 && h <= 10)
      if (check_if_event_status_exist) {
        let last_date = new Date(
          this.st_redux_state["CiwaraInST_" + el.st_event[0].reward_id].date
        );
        let counter = this.st_redux_state[
          "CiwaraInST_" + el.st_event[0].reward_id
        ].counter;
        let today = new Date();

        let msec = today - last_date;
        let mins = Math.floor(msec / 60000);
        let hrs = Math.floor(mins / 60);
        let days = Math.floor(hrs / 24);

        this.log += "\ndays " + days;
        this.log += "\ncounter " + counter;

        let d = today.getDate();
        let m = today.getMonth();
        let h = today.getHours();
        if (days == 0) {
        } else {
          if (days > 1) {
          } else {
            days == 1;
            if (r_points > 250) {
              if (counter + 1 >= 3) {
                // hai completato lo special training
                this.st_ciwara = true;
                this.log += "\ncondizioni st soddisfatte";
                this.completed_special_training.push({
                  id: el.special_training.id,
                  reward_id: el.st_event[0].reward_id,
                  status: 1,
                  text_description: el.text_description
                });
              }
              this.updateStatus("CiwaraInST_" + el.st_event[0].reward_id, {
                date: new Date(),
                counter: counter + 1
              });
            }
          }
        }
      } else {
        if (r_points > 250)
          this.updateStatus("CiwaraInST_" + el.st_event[0].reward_id, {
            date: new Date(),
            counter: r_points >= 250 ? 1 : 0
          });
      }
    // alert(this.log);
  }

  calcDistFromI2CatWorkshop() {
    // circa 120 metri
    const thresholdGPS = 0.225;
    const distance = haversine(
      this.e_point.latitude,
      this.e_point.longitude,
      41.4237792,
      2.1920454
    );

    console.log(distance);

    const distance_from_centro = distance <= thresholdGPS ? true : false;

    if (distance_from_centro) return true;
    else return false;
  }

  calcSTWorkshop(el) {
    this.log += "\nhai sottoscritto workshop i2cat";

    let flag = this.calcDistFromI2CatWorkshop();
    console.log(flag);
    if (flag) {
      // evento completato
      this.log += "\nevento completato";

      this.st_workshop = true;
      this.log += "\ncondizioni st soddisfatte";
      this.completed_special_training.push({
        id: el.special_training.id,
        reward_id: el.st_event[0].reward_id,
        status: 1,
        text_description: el.text_description
      });

      this.updateStatus("WorkshopInST_" + el.st_event[0].reward_id, {
        date: new Date()
      });
    }

    // alert(this.log);
  }

  calcDistFromI2CatOpenDay() {
    // circa 120 metri
    const thresholdGPS = 0.225;
    const distance = haversine(
      this.e_point.latitude,
      this.e_point.longitude,
      41.4352391,
      2.1876502
    );

    console.log(distance);
    this.log += "\ndistance " + distance;

    const distance_from_centro = distance <= thresholdGPS ? true : false;
    // const distance_from_centro = true;

    if (distance_from_centro) return true;
    else return false;
  }

  calcSTStunning(el) {
    this.log += "\nhai sottoscritto i2cat open day";

    let flag = this.calcDistFromI2CatOpenDay();
    console.log(flag);
    if (flag) {
      // evento completato
      this.log += "\nevento completato";

      this.st_workshop = true;
      this.log += "\ncondizioni st soddisfatte";
      this.completed_special_training.push({
        id: el.special_training.id,
        reward_id: el.st_event[0].reward_id,
        status: 1,
        text_description: el.text_description
      });

      this.updateStatus("StunningInST_" + el.st_event[0].reward_id, {
        date: new Date()
      });
    }

    // alert(this.log);
  }

  calcDistFromMuseoPasqualino() {
    // circa 120 metri
    const thresholdGPS = 0.225;
    const distance = haversine(
      this.e_point.latitude,
      this.e_point.longitude,
      38.1185967,
      13.3705798
    );

    console.log(distance);
    this.log += "\ndistance " + distance;

    const distance_from_centro = distance <= thresholdGPS ? true : false;
    // const distance_from_centro = true;

    if (distance_from_centro) return true;
    else return false;
  }

  calcSTKalsa(el) {
    this.log += "\nhai sottoscritto sts kalsa";

    let flag = this.calcDistFromMuseoPasqualino();
    console.log(flag);

    const r_points = this.route_to_check.segment.reduce(
      (total, elem) => total + elem.points,
      0
    );

    if (r_points > 300)
      if (flag) {
        // evento completato
        this.log += "\nevento completato";

        this.st_kalsa = true;
        this.log += "\ncondizioni st soddisfatte";

        // this.completed_special_training.push({
        //   id: el.special_training.id,
        //   reward_id: el.st_event[0].reward_id,
        //   status: 1,
        //   text_description: el.text_description
        // });

        toggleStKalsa(this.dispatch, {
          id: el.special_training.id,
          reward_id: el.st_event[0].reward_id,
          status: 1,
          text_description: el.text_description
        });

        this.updateStatus("KalsaInST_" + el.st_event[0].reward_id, {
          date: new Date()
        });
      }

    // alert(this.log);
  }

  calcSTRidemyBike(el) {
    this.log += "\nhai sottoscritto giretto in MERCATO";

    let segments = this.route_to_check.segment[0].route.replace("(", "");
    segments = segments.replace(")", "");
    segments = segments.replace("LINESTRING ", "");
    let splitted_segments = segments.split(",");
    let lat_lon_alt_array = splitted_segments.map(e => {
      return e.split(" ");
    });

    // console.log(segments);
    // console.log(splitted_segments);
    // console.log(lat_lon_alt_array);

    console.log(this.route_to_check.segment[0].route);
    let in_mercato = this.checkLatLonArrayInCoord(
      lat_lon_alt_array,
      38119690,
      13367642
    );

    if (in_mercato) {
      // evento completato
      this.log += "\nevento completato";

      this.st_ridemybike = true;
      this.log += "\ncondizioni st soddisfatte";
      this.completed_special_training.push({
        id: el.special_training.id,
        reward_id: el.st_event[0].reward_id,
        status: 1,
        text_description: el.text_description
      });

      this.updateStatus("MercatoInST_" + el.st_event[0].reward_id, {
        date: new Date()
      });
    }

    // alert(this.log);
  }

  calcSTMuvimento(el) {
    this.log += "\nhai sottoscritto muvimento";

    const r_points = this.route_to_check.segment.reduce(
      (total, elem) => total + elem.points,
      0
    );

    const check_if_event_status_exist =
      this.st_redux_state["MuvimentoInST_" + el.st_event[0].reward_id] &&
      this.st_redux_state["MuvimentoInST_" + el.st_event[0].reward_id] != {}
        ? true
        : false;

    this.log += "\npunti tratta " + r_points;
    this.log += "\ncheck_if_event_status_exist " + check_if_event_status_exist;

    if (check_if_event_status_exist) {
      let last_date = new Date(
        this.st_redux_state["MuvimentoInST_" + el.st_event[0].reward_id].date
      );
      let counter = this.st_redux_state[
        "MuvimentoInST_" + el.st_event[0].reward_id
      ].counter;
      let today = new Date();

      let msec = today - last_date;
      let mins = Math.floor(msec / 60000);
      let hrs = Math.floor(mins / 60);
      let days = Math.floor(hrs / 24);

      this.log += "\ndays " + days;
      this.log += "\ncounter " + counter;

      if (days == 0) {
      } else {
        if (days > 1) {
          this.updateStatus("MuvimentoInST_" + el.st_event[0].reward_id, {
            points: r_points,
            date: new Date(),
            counter: r_points >= 300 ? 1 : 0
          });
        } else {
          // days == 1

          if (counter + 1 == 5 && r_points >= 300) {
            // hai completato lo special training
            this.st_muvimento = true;
            this.log += "\ncondizioni st soddisfatte";
            this.completed_special_training.push({
              id: el.special_training.id,
              reward_id: el.st_event[0].reward_id,
              status: 1,
              text_description: el.text_description
            });
          }

          this.updateStatus("MuvimentoInST_" + el.st_event[0].reward_id, {
            points: r_points,
            date: new Date(),
            counter: r_points >= 300 ? counter + 1 : counter
          });
        }
      }
    } else {
      this.updateStatus("MuvimentoInST_" + el.st_event[0].reward_id, {
        points: r_points,
        date: new Date(),
        counter: r_points >= 300 ? 1 : 0
      });
    }
    // alert(this.log);
  }

  calcSTAirlite(el) {
    this.log += "\nhai sottoscritto airlite";

    const r_points = this.route_to_check.segment.reduce(
      (total, elem) => total + elem.points,
      0
    );

    const check_if_event_status_exist =
      this.st_redux_state["AirliteInST_" + el.st_event[0].reward_id] &&
      this.st_redux_state["AirliteInST_" + el.st_event[0].reward_id] != {}
        ? true
        : false;

    this.log += "\npunti tratta " + r_points;
    this.log += "\ncheck_if_event_status_exist " + check_if_event_status_exist;

    if (check_if_event_status_exist) {
      let last_date = new Date(
        this.st_redux_state["AirliteInST_" + el.st_event[0].reward_id].date
      );
      let week_counter = this.st_redux_state[
        "AirliteInST_" + el.st_event[0].reward_id
      ].week_counter;
      let counter = this.st_redux_state[
        "AirliteInST_" + el.st_event[0].reward_id
      ].counter;
      let today = new Date();

      let msec = today - last_date;
      let mins = Math.floor(msec / 60000);
      let hrs = Math.floor(mins / 60);
      let days = Math.floor(hrs / 24);

      this.log += "\ndays " + days;
      this.log += "\ncounter " + counter;

      if (days == 1) {
        let flag = checkHomeWorkFrequentTripEvent(
          this.route_to_check,
          this.most_frequent_routes
        );
        this.log += "\nflag " + flag;

        if (flag) {
          if (counter + 1 >= 4) {
            // hai completato lo special training
            this.st_airlite = true;
            this.log += "\ncondizioni st soddisfatte";
            this.completed_special_training.push({
              id: el.special_training.id,
              reward_id: el.st_event[0].reward_id,
              status: 1,
              text_description: el.text_description
            });
          }
          this.updateStatus("AirliteInST_" + el.st_event[0].reward_id, {
            date: new Date(),
            counter: counter + 1
          });
        }
      } else {
        let flag = checkHomeWorkFrequentTripEvent(
          this.route_to_check,
          this.most_frequent_routes
        );
        this.log += "\nflag " + flag;
        if (flag)
          this.updateStatus("AirliteInST_" + el.st_event[0].reward_id, {
            counter: 1,
            date: new Date()
          });
      }
    } else {
      let flag = checkHomeWorkFrequentTripEvent(
        this.route_to_check,
        this.most_frequent_routes
      );
      this.log += "\nflag " + flag;
      if (flag)
        this.updateStatus("AirliteInST_" + el.st_event[0].reward_id, {
          counter: 1,
          date: new Date()
        });
    }
    // alert(this.log);
  }

  calcSTHFlows(el) {
    this.log += "\nhai sottoscritto h flows";

    let flag = this.calcDistFromHFlows();
    console.log(flag);
    this.log += "\n flag " + flag;
    if (flag) {
      // evento completato
      this.log += "\nevento completato";

      this.st_hflows = true;
      this.log += "\ncondizioni st soddisfatte";
      this.completed_special_training.push({
        id: el.special_training.id,
        reward_id: el.st_event[0].reward_id,
        status: 1,
        text_description: el.text_description
      });

      this.updateStatus("HFlowsInST_" + el.st_event[0].reward_id, {
        date: new Date()
      });
    }

    // alert(this.log);
  }

  calcDistFromHFlows() {
    // circa 6000 metri
    const thresholdGPS = 11.25;
    const distance = haversine(
      this.e_point.latitude,
      this.e_point.longitude,
      38.1823062,
      13.0984117
    );

    console.log(distance);
    this.log += "\ndistance " + distance;

    const distance_from_centro = distance <= thresholdGPS ? true : false;
    // const distance_from_centro = true;

    if (distance_from_centro) return true;
    else return false;
  }

  calcSTMuvMusic(el) {
    this.log += "\nhai sottoscritto muv music";

    const r_points = this.route_to_check.segment.reduce(
      (total, elem) => total + elem.points,
      0
    );

    const check_if_event_status_exist =
      this.st_redux_state["MuvMusicInST_" + el.st_event[0].reward_id] &&
      this.st_redux_state["MuvMusicInST_" + el.st_event[0].reward_id] != {}
        ? true
        : false;

    this.log += "\npunti tratta " + r_points;
    this.log += "\ncheck_if_event_status_exist " + check_if_event_status_exist;

    if (check_if_event_status_exist) {
      let last_date = new Date(
        this.st_redux_state["MuvMusicInST_" + el.st_event[0].reward_id].date
      );
      let week_counter = this.st_redux_state[
        "MuvMusicInST_" + el.st_event[0].reward_id
      ].week_counter;
      let counter = this.st_redux_state[
        "MuvMusicInST_" + el.st_event[0].reward_id
      ].counter;
      let today = new Date();

      let msec = today - last_date;
      let mins = Math.floor(msec / 60000);
      let hrs = Math.floor(mins / 60);
      let days = Math.floor(hrs / 24);

      this.log += "\ndays " + days;
      this.log += "\ncounter " + counter;

      if (days >= 1 && days <= 7) {
        let flag = checkHomeWorkFrequentTripEvent(
          this.route_to_check,
          this.most_frequent_routes
        );
        this.log += "\nflag " + flag;

        if (flag) {
          if (counter + 1 >= 3) {
            // hai completato lo special training
            this.st_muvmusic = true;
            this.log += "\ncondizioni st soddisfatte";
            this.completed_special_training.push({
              id: el.special_training.id,
              reward_id: el.st_event[0].reward_id,
              status: 1,
              text_description: el.text_description
            });
          }
          this.updateStatus("MuvMusicInST_" + el.st_event[0].reward_id, {
            date: new Date(),
            counter: counter + 1
          });
        }
      } else {
        let flag = checkHomeWorkFrequentTripEvent(
          this.route_to_check,
          this.most_frequent_routes
        );
        this.log += "\nflag " + flag;
        if (flag)
          this.updateStatus("MuvMusicInST_" + el.st_event[0].reward_id, {
            counter: 1,
            date: new Date()
          });
      }
    } else {
      let flag = checkHomeWorkFrequentTripEvent(
        this.route_to_check,
        this.most_frequent_routes
      );
      this.log += "\nflag " + flag;
      if (flag)
        this.updateStatus("MuvMusicInST_" + el.st_event[0].reward_id, {
          counter: 1,
          date: new Date()
        });
    }
    // alert(this.log);
  }

  calcSTSantelia(el) {
    this.log += "\nhai sottoscritto sant elia";

    const r_points = this.route_to_check.segment.reduce(
      (total, elem) => total + elem.points,
      0
    );

    let flag_walk = checkModalTypeDispatch(this.route_to_check, {
      event: { modal_type: "1" }
    });
    let flag_bike = checkModalTypeDispatch(this.route_to_check, {
      event: { modal_type: "2" }
    });

    const check_if_event_status_exist =
      this.st_redux_state["SanteliaInST_" + el.st_event[0].reward_id] &&
      this.st_redux_state["SanteliaInST_" + el.st_event[0].reward_id] != {}
        ? true
        : false;

    this.log += "\npunti tratta " + r_points;
    this.log += "\ncheck_if_event_status_exist " + check_if_event_status_exist;

    if (check_if_event_status_exist) {
      let last_date = new Date(
        this.st_redux_state["SanteliaInST_" + el.st_event[0].reward_id].date
      );

      let counter = this.st_redux_state[
        "SanteliaInST_" + el.st_event[0].reward_id
      ].counter;
      let today = new Date();

      let msec = today - last_date;
      let mins = Math.floor(msec / 60000);
      let hrs = Math.floor(mins / 60);
      let days = Math.floor(hrs / 24);

      this.log += "\ndays " + days;
      this.log += "\ncounter " + counter;

      if (days <= 7) {
        let code = 0;
        if (flag_walk) {
          code = this.addWalkCode(counter);
        } else if (flag_bike) {
          code = this.addBikeCode(counter);
        } else {
          code = this.addTplCode(counter);
        }

        if (r_points > 250) {
          if (code == 7) {
            // hai completato lo special training
            this.st_santelia = true;
            this.log += "\ncondizioni st soddisfatte";
            this.completed_special_training.push({
              id: el.special_training.id,
              reward_id: el.st_event[0].reward_id,
              status: 1,
              text_description: el.text_description
            });
          }

          this.updateStatus("SanteliaInST_" + el.st_event[0].reward_id, {
            counter: code,
            date: new Date()
          });
        }
      } else {
      }
    } else {
      if (r_points > 250) {
        if (flag_walk) {
          this.updateStatus("SanteliaInST_" + el.st_event[0].reward_id, {
            counter: 1,
            date: new Date()
          });
        } else if (flag_bike) {
          this.updateStatus("SanteliaInST_" + el.st_event[0].reward_id, {
            counter: 2,
            date: new Date()
          });
        } else {
          this.updateStatus("SanteliaInST_" + el.st_event[0].reward_id, {
            counter: 3,
            date: new Date()
          });
        }
      }
    }
  }

  addWalkCode(code) {
    switch (code) {
      case 2:
        return 4;
      case 3:
        return 5;
      case 6:
        return 7;
      default:
        return code;
    }
  }

  addBikeCode(code) {
    switch (code) {
      case 1:
        return 4;
      case 3:
        return 6;
      case 5:
        return 7;
      default:
        return code;
    }
  }

  addTplCode(code) {
    switch (code) {
      case 1:
        return 5;
      case 2:
        return 6;
      case 4:
        return 7;
      default:
        return code;
    }
  }

  calcSTForest(el) {
    this.log += "\nhai sottoscritto garunha forest";

    const r_points = this.route_to_check.segment.reduce(
      (total, elem) => total + elem.points,
      0
    );

    const check_if_event_status_exist =
      this.st_redux_state["ForestInST_" + el.st_event[0].reward_id] &&
      this.st_redux_state["ForestInST_" + el.st_event[0].reward_id] != {}
        ? true
        : false;

    this.log += "\npunti tratta " + r_points;
    this.log += "\ncheck_if_event_status_exist " + check_if_event_status_exist;

    if (check_if_event_status_exist) {
      let last_date = new Date(
        this.st_redux_state["ForestInST_" + el.st_event[0].reward_id].date
      );

      let counter = this.st_redux_state[
        "ForestInST_" + el.st_event[0].reward_id
      ].counter;
      let tree = this.st_redux_state["ForestInST_" + el.st_event[0].reward_id]
        .tree
        ? this.st_redux_state["ForestInST_" + el.st_event[0].reward_id].tree
        : 0;
      let today = new Date();

      let msec = today - last_date;
      let mins = Math.floor(msec / 60000);
      let hrs = Math.floor(mins / 60);
      let days = Math.floor(hrs / 24);

      this.updateStatus("ForestInST_" + el.st_event[0].reward_id, {
        counter: counter + r_points,
        date: new Date(),
        tree
      });

      if (counter + r_points > 5000) {
        // hai completato lo special training
        this.st_forest = true;
        this.log += "\ncondizioni st soddisfatte";
        this.completed_special_training.push({
          id: el.special_training.id,
          reward_id: el.st_event[0].reward_id,
          status: 1,
          text_description: el.text_description
        });
        this.updateStatus("ForestInST_" + el.st_event[0].reward_id, {
          counter: 0,
          date: new Date(),
          tree: tree + 1
        });
      }
    } else {
      this.updateStatus("ForestInST_" + el.st_event[0].reward_id, {
        counter: r_points,
        date: new Date(),
        tree: 0
      });
    }
  }

  calcSTFreschette(el) {
    this.log += "\nhai sottoscritto calcSTFreschette";

    const r_points = this.route_to_check.segment.reduce(
      (total, elem) => total + elem.points,
      0
    );

    const check_if_event_status_exist =
      this.st_redux_state["FreschetteInST_" + el.st_event[0].reward_id] &&
      this.st_redux_state["FreschetteInST_" + el.st_event[0].reward_id] != {}
        ? true
        : false;

    this.log += "\npunti tratta " + r_points;
    this.log += "\ncheck_if_event_status_exist " + check_if_event_status_exist;

    let segments = this.route_to_check.segment[0].route.replace("(", "");
    segments = segments.replace(")", "");
    segments = segments.replace("LINESTRING ", "");
    let splitted_segments = segments.split(",");
    let lat_lon_alt_array = splitted_segments.map(e => {
      return e.split(" ");
    });

    // console.log(segments);
    // console.log(splitted_segments);
    // console.log(lat_lon_alt_array);

    console.log(this.route_to_check.segment[0].route);
    let in_mercato = this.checkLatLonArrayInCoord(
      lat_lon_alt_array,
      38.1196797,
      13.3567223
    );

    if (in_mercato) {
      // evento completato
      this.log += "\nevento completato";

      this.st_freschette = true;
      this.log += "\ncondizioni st soddisfatte";
      this.completed_special_training.push({
        id: el.special_training.id,
        reward_id: el.st_event[0].reward_id,
        status: 1,
        text_description: el.text_description
      });

      this.updateStatus("FreschetteInST_" + el.st_event[0].reward_id, {
        date: new Date()
      });
    }

    if (check_if_event_status_exist) {
    } else {
    }
    // alert(this.log);
  }

  calcSTGlifo(el) {
    // calc giorno
    this.log += "\nhai sottoscritto glifo";

    const r_points = this.route_to_check.segment.reduce(
      (total, elem) => total + elem.points,
      0
    );

    const check_if_event_status_exist =
      this.st_redux_state["GlifoInST_" + el.st_event[0].reward_id] &&
      this.st_redux_state["GlifoInST_" + el.st_event[0].reward_id] != {}
        ? true
        : false;

    this.log += "\npunti tratta " + r_points;
    this.log += "\ncheck_if_event_status_exist " + check_if_event_status_exist;

    if (check_if_event_status_exist) {
      let last_date = new Date(
        this.st_redux_state["GlifoInST_" + el.st_event[0].reward_id].date
      );

      let points = this.st_redux_state["GlifoInST_" + el.st_event[0].reward_id]
        .points;
      let today = new Date();

      let msec = today - last_date;
      let mins = Math.floor(msec / 60000);
      let hrs = Math.floor(mins / 60);
      let days = Math.floor(hrs / 24);

      this.log += "\ndays " + days;

      let tot_points = r_points + points;
      this.log += "\npunteggio accumulato " + tot_points;

      // hai fatto piu' di 1000 punti
      // se sono passati al massimo due giorni
      // se oggi e' o venerdi sabato o domenica
      if (tot_points >= 2000) {
        // hai completato lo special training
        this.st_chiavetteri = true;
        this.log += "\ncondizioni st soddisfatte";
        this.completed_special_training.push({
          id: el.special_training.id,
          reward_id: el.st_event[0].reward_id,
          status: 1,
          text_description: el.text_description
        });
      }

      this.updateStatus("GlifoInST_" + el.st_event[0].reward_id, {
        points: tot_points,
        date: new Date()
      });
    } else {
      this.updateStatus("GlifoInST_" + el.st_event[0].reward_id, {
        points: r_points,
        date: new Date()
      });
    }
    // alert(this.log);
  }

  calcSTBarc8(el) {
    this.log += "\nhai sottoscritto STBarc8";

    const r_calories = this.route_to_check.segment.reduce(
      (total, elem) => total + elem.calories,
      0
    );

    const check_if_event_status_exist =
      this.st_redux_state["STSBar8InST_" + el.st_event[0].reward_id] &&
      this.st_redux_state["STSBar8InST_" + el.st_event[0].reward_id] != {}
        ? true
        : false;

    this.log += "\ncheck_if_event_status_exist " + check_if_event_status_exist;

    let now = new Date();
    let h = now.getHours();
    if (h >= 9 && h <= 15)
      if (check_if_event_status_exist) {
        let last_date = new Date(
          this.st_redux_state["STSBar8InST_" + el.st_event[0].reward_id].date
        );
        let counter = this.st_redux_state[
          "STSBar8InST_" + el.st_event[0].reward_id
        ].counter;
        // this.log += "\ndays " + days;
        this.log += "\ncounter " + counter;

        if (counter + r_calories >= 1000) {
          // hai completato lo special training
          this.st_barmus9 = true;
          this.log += "\ncondizioni st soddisfatte";
          this.completed_special_training.push({
            id: el.special_training.id,
            reward_id: el.st_event[0].reward_id,
            status: 1,
            text_description: el.text_description
          });
        }
        this.updateStatus("STSBar8InST_" + el.st_event[0].reward_id, {
          date: new Date(),
          counter: r_calories
        });
      } else {
        if (r_calories >= 1000)
          this.updateStatus("STSBar8InST_" + el.st_event[0].reward_id, {
            date: new Date(),
            counter: r_calories
          });
      }
    // alert(this.log);
  }

  calcDistFromPiazzaEspana() {
    // circa 600 metri
    const thresholdGPS = 1.125;
    const distance = haversine(
      this.s_point.latitude,
      this.s_point.longitude,
      41.3745,
      2.1495
    );

    const distance_from_centro = distance <= thresholdGPS ? true : false;
    let flag = checkModalTypeDispatch(this.route_to_check, {
      event: { modal_type: "1" }
    });

    if (distance_from_centro) return true;
    else return false;
  }

  calcDistFromCarrerCastel() {
    // circa 600 metri
    const thresholdGPS = 1.125;
    const distance = haversine(
      this.e_point.latitude,
      this.e_point.longitude,
      41.36663,
      2.16499
    );

    const distance_from_centro = distance <= thresholdGPS ? true : false;
    let flag = checkModalTypeDispatch(this.route_to_check, {
      event: { modal_type: "1" }
    });

    if (distance_from_centro) return true;
    else return false;
  }

  calcSTBarc9(el) {
    this.log += "\nhai sottoscritto STBarc9";

    const r_calories = this.route_to_check.segment.reduce(
      (total, elem) => total + elem.calories,
      0
    );

    const check_if_event_status_exist =
      this.st_redux_state["STSBar9InST_" + el.st_event[0].reward_id] &&
      this.st_redux_state["STSBar9InST_" + el.st_event[0].reward_id] != {}
        ? true
        : false;

    this.log += "\ncheck_if_event_status_exist " + check_if_event_status_exist;

    let now = new Date();
    let h = now.getHours();

    if (false) {
      // hai completato lo special training
      this.st_barmus9 = true;
      this.log += "\ncondizioni st soddisfatte";
      this.completed_special_training.push({
        id: el.special_training.id,
        reward_id: el.st_event[0].reward_id,
        status: 1,
        text_description: el.text_description
      });
    }
    this.updateStatus("STSBar9InST_" + el.st_event[0].reward_id, {
      date: new Date(),
      counter: r_calories
    });

    // alert(this.log);
  }

  completedST() {
    return this.completed_special_training;
  }
}

/**
 * **********
 *
 * TEST ROUTE
 *
 * **********
 */
const fake_weather = "Rain";
const fake_route = {
  validated: true,
  distance_travelled: 8.105,
  calories: 350,
  coins: 0,
  points: 2250,
  time_travelled: 50,
  referred_most_freq_route: 3940,
  segment: [
    {
      modal_type: 1,
      validated: true,
      distance_travelled: 8.105,
      calories: 350,
      coins: 0,
      points: 2250,
      time_travelled: 50,
      route:
        "LINESTRING (38.1111816 13.3598044 0, 38.1111816 13.3598044 0, 38.1111816 13.3598044 0)",
      route_positions_info: [
        {
          pos_index: 0,
          time: 1542259015,
          modality: "Biking",
          speed: 3.61,
          calories: 50
        },
        {
          pos_index: 1,
          time: 1542206772,
          modality: "Biking",
          speed: 3.43,
          calories: 50
        },
        {
          pos_index: 1,
          time: 1542206787,
          modality: "Biking",
          speed: 3.26,
          calories: 50
        }
      ],
      end_time: "2019-04-01T06:50:27.092Z"
    }
  ]
};
