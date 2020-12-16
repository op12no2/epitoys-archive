
<a href="http://op12no2.me">op12no2</a>

////

19/10/12

////

A discrete SIR model

////

A discrete version of an <a href="http://op12no2.me/toys/sir">ODE based SIR model</a>.
Notice that the epidemic curves are very similar but the effective reproduction numbers are not.
This is  expected.  The discrete model is tracking actual individuals and who-infects-who.  R0 for
the ODE model is 5 (c=0.5, k=0.1).  It varies widely for the discrate model with an average of 5.  <i>Note that
clicking Play does not always result in the expected epidemic curve because of the inherrent randomness
involved - sometimes the epidemic never gets going.  Click Reset then Play to try again.</i>  The model auto-pauses after 100
iterations and updates the graphs every 10 iterations.

////

S.control = {
  speed      : 100,
  pause      : 100,
  plotsample : 1,
  plotrender : 10
};

S.canvas = {
  cols       : 55,
  rows       : 55,
  zoom       : 3,
  wrapCols   : true,
  wrapRows   : true,
};

S.states = ["susceptible","infected","recovered"];

S.styles = {"infected" : "rgb(0,110,0)", "susceptible" : "red", "recovered" : "#6666ff"};

S.plot = {
  states     : ["susceptible","infected","recovered"],
  state      : "infected",
  width      : 400,
  height     : 250,
  title      : "sir epidemic",
  xaxis      : "iterations",
  yaxis      : "people",
  infect       : "infected",
  infecttitle  : 'effective reproduction #',
  infectxaxis  : "iterations",
  infectyaxis  : ""
};

S.A = {
  interact : function (p,q) {
    if (p==q && p.state == "infected" && rand() < 0.1) {
      changeState(p,"recovered",p);
      return;
    }
    if (p.state == "susceptible" && q.state == "infected" && rand() < 0.0005) {
      changeState(p,"infected",q);
    }
  },

  render : function (p,c,h) {
    if (p.state != "infected") {
      c.strokeStyle = S.styles[p.state];
      c.strokeRect(h.x,h.y,h.z,h.z);
    }
    else {
      c.fillStyle = S.styles[p.state];
      c.fillRect(h.x,h.y,h.z,h.z);
    }
  }
};

var pop = 1;
for (var p=0; p<pop; p++)
  createPerson({type : "A", state : "infected", at : randAt(), age : 0});

var pop = 999;
for (var p=0; p<pop; p++)
  createPerson({type : "A", state : "susceptible", at : randAt(), age : 0});

