//{{{  fold marker

//}}}

//{{{  globals

//args
var us                   = '';
var umaxX                = 80;    //geographical area X
var umaxY                = 80;    //geographical area Y
var uzoom                = 5;      //zoom
var upopFrac             = 0.2;    //population density
var uvaxFrac             = 0.96;   //fraction of vaccinated
var unovaxinf            = 1;      //number of unvaccinated that are infected
var uvaxinf              = 0;      //number of vaccinated that are infected
var uwalkProb            = 1;      //probability of walking
var uinterval            = 150;    //refresh speed mS
var uwalks               = 20;      //tries at walking in random direction per iteration
var uhealVax             = 50;    //length of vaccinated infection in iterations
var uhealNoVax           = 50;    //length of unvaccinated infection in iterations
var uVaxTransNoVaxProb   = 1;   //vaccinated transmission to unvaccinated probability
var uNoVaxTransNoVaxProb = 1    //vaccinated transmission to unvaccinated probability
var uVaxTransVaxProb     = 1;  //vaccinated transmission to unvaccinated probability
var uNoVaxTransVaxProb   = 1;  //vaccinated transmission to unvaccinated probability

//fixed
var upop      = 0;
var un        = 1;
var up        = [];
var ug        = [];
var ui        = 0;
var ustate    = "";

var udeltaN  = 8;
var udelta   = [];
udelta[0]    = {};
udelta[1]    = {};
udelta[2]    = {};
udelta[3]    = {};
udelta[4]    = {};
udelta[5]    = {};
udelta[6]    = {};
udelta[7]    = {};
udelta[0].x  = 0;
udelta[0].y  = 1;
udelta[1].x  = 1;
udelta[1].y  = 1;
udelta[2].x  = 1;
udelta[2].y  = 0;
udelta[3].x  = 1;
udelta[3].y  = -1;
udelta[4].x  = 0;
udelta[4].y  = -1;
udelta[5].x  = -1;
udelta[5].y  = -1;
udelta[6].x  = -1;
udelta[6].y  = 0;
udelta[7].x  = -1;
udelta[7].y  = 1;

//}}}
//{{{  funcs

function tune() {
  var smooth = 1;
  var res = [];
  var nres = 0;
  for(var q=0.01; q<1.0; q+=0.01) {
    res[nres] = 0;
    for(var ww=0; ww<smooth; ww++) {
      var nstart = 0;
      var nend   = 0;
      //{{{  init
      
      ug   = [];
      up   = [];
      upop = 0;
      un   = 1;
      ui   = 0;
      for (var i=0; i<umaxX; i++) {
        ug[i] = [];
        for (var j=0; j<umaxY; j++) {
          ug[i][j] = -1;
          if (!eventProb(0.01))
            continue;
          up[upop] = {};
          ug[i][j] = upop;
          up[upop].x = i;
          up[upop].y = j;
          up[upop].vaccinated = false;
          up[upop].infected   = 0;
          up[upop].immune     = false;
          up[upop].flag       = false;
          up[upop].freeloader = false;
          upop++;
        }
      }
      
      uvaxFrac = q;
      
      for (i=0; i<upop; i++) {
        if (eventProb(uvaxFrac)) {
          up[i].vaccinated = true;
          up[i].immune     = true;
        }
      }
      
      up[0].vaccinated=false;
      up[0].infected=1;
      up[0].immune=false;
      up[0].flag=false;
      
      //}}}
      //{{{  count at start
      
      for(var qq=0; qq<upop; qq++) {
        if (!up[qq].infected && !up[qq].immune)
          nstart++;
      }
      
      //}}}
      //alert('nstart=' + nstart)
      //{{{  run
      
      for(var qq=0; qq<5000; qq++) {
        un++;
        healP();
        walkP();
        infectP();
        var done = true
        for (var ii=0; ii<upop; ii++) {
          if (up[ii].infected) {
            done = false;
            break;
          }
        }
        if (done)
          break;
      }
      
      //}}}
      //{{{  count at end
      
      for(var qq=0; qq<upop; qq++) {
        if (!up[qq].infected && !up[qq].immune)
          nend++;
      }
      
      //}}}
      res[nres] += (nend * 100) / nstart;
    }
    res[nres] = res[nres] / smooth;
    nres++;
  }
  //{{{  display
  
  var canvas  = document.getElementById("herd");
  var cx      = canvas.getContext("2d");
  var z       = 4;
  cx.clearRect(0,0,umaxX*z,umaxY*z);
  
  for (var i=0; i<nres; i++) {
    var x = i*z;
    var y = 100*z - res[i]*z - z;
    //alert(x);
    //alert(y);
    cx.fillStyle   = "rgb(255,0,0)";
    cx.strokeStyle = "rgb(255,0,0)";
    cx.fillRect(x,y,z,z);
  }
  
  //}}}
}

function setFeedback() {
  $('#fpop').val(upop);
  var sus = 0;
  var inf = 0;
  var rec = 0;
  for(var i=0; i<upop; i++) {
    if (up[i].infected)
      inf++;
    if (up[i].immune)
      rec++;
  }
  sus = upop - inf - rec;
  $('#fsus').val(sus);
  $('#finf').val(inf);
  $('#frec').val(rec);
}

function setGlobals() {
  us = $('#us').val();
  $('#herd').attr('width',umaxX*uzoom).attr('height',umaxY*uzoom).show();
}

function eventProb(p) {
  if (p >= 1.0) return true;
  if (p <= 0.0) return false;
  if ((Math.random()) <= p)
    return true;
  else
    return false;
}

function rand(n) {  // 0 to n-1
  var r = Math.random();
  r = r * n;
  r = Math.floor(r);
  if (r == n)
    r = n-1;
  return r;
}

function seedP() {
  stop();
  ug   = [];
  up   = [];
  upop = 0;
  un   = 1;
  ui   = 0;
  for (var i=0; i<umaxX; i++) {
    ug[i] = [];
    for (var j=0; j<umaxY; j++) {
      ug[i][j] = -1;
      if (!eventProb(upopFrac))
        continue;
      up[upop] = {};
      ug[i][j] = upop;
      up[upop].x = i;
      up[upop].y = j;
      up[upop].vaccinated = false;
      up[upop].infected   = 0;
      up[upop].immune     = false;
      up[upop].flag       = false;
      up[upop].freeloader = false;
      upop++;
    }
  }

  uvaxFrac = 0;

  if (us == 'vax')
    uvaxFrac = 0.97;
  if (us == 'herd')
    uvaxFrac = 0.97;
  if (us == 'pocket')
    uvaxFrac = 0.97;
  if (us == 'freeload')
    uvaxFrac = 0.97;
  if (us == 'cocoon')
    uvaxFrac = 0.97;
  if (us == 'luck')
    uvaxFrac = 0.99;

  for (i=0; i<upop; i++) {
    if (us == 'luck' && i==1)
      continue;
    if (eventProb(uvaxFrac)) {
      up[i].vaccinated = true;
      up[i].immune     = true;
    }
  }

  if (us == 'luck') {
    up[0].x  = 0;
    up[0].y  = 0;
    up[1].x  = 0;
    up[1].y  = 1;
  }

  if (us == 'herd') {
    for (i=0; i<upop; i++) {
      if (eventProb(0.006)) {
        if (up[i].vaccinated) {
          up[i].freeloader = true;
          up[i].vaccinated = false;
          up[i].immune     = false;
        }
      }
    }
  }

  if (us == 'freeload') {
    uhealNoVax=85;
    for (i=0; i<upop; i++) {
      if (eventProb(0.2)) {
        if (up[i].vaccinated) {
          up[i].freeloader = true;
          up[i].vaccinated = false;
          up[i].immune     = false;
        }
      }
    }
  }

  if (us == 'cocoon') {
    uhealNoVax=85;
    for (i=0; i<upop; i++) {
      if (eventProb(0.2)) {
        if (up[i].vaccinated) {
          up[i].freeloader = true;
          up[i].vaccinated = false;
          up[i].immune     = false;
        }
      }
    }
  }

  if (us == 'pocket') {
    for (i=1; i<4; i++) {
      for (j=1; j<4; j++) {
        var xx =  i*80 + j;
        up[xx].freeloader = true;
        up[xx].vaccinated = false;
        up[xx].immune = false;
        up[xx].x = i*2-1;
        up[xx].y = j*2-1;
      }
    }
  }

  if (us != 'intro') {
    up[0].vaccinated=false;
    up[0].infected=1;
    up[0].immune=false;
    up[0].flag=false;
    if (us == 'pocket') {
      up[0].x=0;
      up[0].y=0;
    }
  }

  /*
  var a = [];               //set infected unvax
  j = 0;
  for (i=0; i<upop; i++) {
    if (!up[i].vaccinated) {
      a[j] = i;
      j++;
    }
  }
  a.sort(function() {return 0.5 - Math.random()});
  if (a.length < unovaxinf)
    unovaxinf = a.length;
  for (i=0; i<unovaxinf; i++) {
    up[a[i]].infected = un;
  }

  var a = [];
  j = 0;
  for (i=0; i<upop; i++) {
    if (up[i].vaccinated) {
      a[j] = i;
      j++;
    }
  }
  a.sort(function() {return 0.5 - Math.random()});
  if (a.length < uvaxinf)
    uvaxinf = a.length;
  for (i=0; i<uvaxinf; i++) {
    up[a[i]].infected = un;
  }
  */
}

function protected(i) {
  if (!up[i].vaccinated && !up[i].immune && !up[i].infected && !up[i].freeloader)
    return true;
  else
    return false;
}

function nogo(x,y) {
  for (var j=0; j<udeltaN; j++) {
    var dx = udelta[j].x;
    var dy = udelta[j].y;
    var nx = x + dx;
    var ny = y + dy;
    if (nx >= umaxX) continue;
    if (ny >= umaxY) continue;
    if (nx < 0)      continue;
    if (ny < 0)      continue;
    var n = ug[nx][ny];
    if (n >= 0) {
      if (protected(n))
        return true;
    }
  }
  return false;
}

function walkP() {

  for (var i=0; i<upop; i++) {
    if (us == 'cocoon' && protected(i))
      continue;
    //if (!eventProb(uwalkProb))
      //continue;
    var oldx = up[i].x;
    var oldy = up[i].y;
    up[i].flag = false;
    for (var j=0; j<uwalks; j++) {
      var r = rand(udeltaN);
      var dx = udelta[r].x;
      var dy = udelta[r].y;
      var x = oldx + dx;
      var y = oldy + dy;
      if (x >= umaxX) x = umaxX - 2;
      if (y >= umaxY) y = umaxY - 2;
      if (x < 0)      x = 1;
      if (y < 0)      y = 1;
      if (ug[x][y] == -1) {
        if (us == 'cocoon' && (up[i].infected || !up[i].vaccinated) && nogo(x,y))
          continue;
        ug[x][y] = -2;
        up[i].nx = x;
        up[i].ny = y;
        up[i].flag = true;
        break;
      }
    }
  }
  for (var i=0; i<upop; i++) {
    if (up[i].flag === true) {
      ug[up[i].x][up[i].y] = -1;
      up[i].x = up[i].nx;
      up[i].y = up[i].ny;
      up[i].flag = false;
      ug[up[i].x][up[i].y] = i;
    }
  }
}

function healP() {
  for (var i=0; i<upop; i++) {
    if (up[i].vaccinated)
      var heal = uhealVax;
    else
      var heal = uhealNoVax;
    if (!up[i].infected)
      continue;
    if ((un - up[i].infected) > heal) {
      up[i].infected   = 0;
      up[i].immune = true;
    }
  }
}

function stopP() {
  if (us != 'intro') {
  //if (unovaxinf) {
    for (var i=0; i<upop; i++) {
      if (up[i].infected)
        return;
    }
    stop();
  }
}

function infectMe(i,n) {

  //if (!up[n].immune && !up[i].infected)
  //  return true;
  //else
  //  return false;

  /*
  if (up[n].immune)
    return false;
  if (up[n].vaccinated && up[i].vaccinated)
    return eventProb(uVaxTransVaxProb);
  else if (up[n].vaccinated && !up[i].vaccinated)
    return eventProb(uVaxTransNoVaxProb);
  else if (!up[n].vaccinated && up[i].vaccinated)
    return eventProb(uNoVaxTransVaxProb);
  else //(!up[n].vaccinated && up[i].vaccinated)
    return eventProb(uNoVaxTransNoVaxProb);
  */
}

function infectP() {
  for (var i=0; i<upop; i++) {
    up[i].flag = false;
    if (up[i].infected)
      continue;
    if (up[i].immune)
      continue;
    var x = up[i].x;
    var y = up[i].y;
    var contact = 0;
    for (var j=0; j<udeltaN; j++) {
      var dx = udelta[j].x;
      var dy = udelta[j].y;
      var nx = x + dx;
      var ny = y + dy;
      if (nx >= umaxX) continue;
      if (ny >= umaxY) continue;
      if (nx < 0)      continue;
      if (ny < 0)      continue;
      var n = ug[nx][ny];
      if (n != -1) {
        if (up[n].infected) {
          if (eventProb(1)) {
            contact = true;
            break;         //got contact
          }
        }
      }
    }
    if (contact)
      up[i].flag = true;
  }
  for (var i=0; i<upop; i++) {
    if (up[i].flag === true) {
      up[i].infected = un;
      up[i].flag     = false;
    }
  }
}

function drawP() {

  var canvas  = document.getElementById("herd");
  var cx      = canvas.getContext("2d");
  var z       = uzoom;
  cx.clearRect(0,0,umaxX*z,umaxY*z);
  for (var i=0; i<upop; i++) {
    var x = up[i].x * z;
    var y = up[i].y * z;
    if (up[i].infected) {
      cx.fillStyle   = "rgb(0,110,0)";
      cx.strokeStyle = "rgb(0,110,0)";
    }
    else if (up[i].immune) {
      cx.fillStyle   = "rgb(180,180,255)";
      cx.strokeStyle = "rgb(180,180,255)";
    }
    else if (up[i].freeloader) {
      cx.fillStyle   = "rgb(255,0,0)";
      cx.strokeStyle = "rgb(255,0,0)";
    }
    else { //susceptable
      cx.fillStyle   = "rgb(255,0,0)";
      cx.strokeStyle = "rgb(255,0,0)";
    }
    if (up[i].freeloader && !up[i].immune && !up[i].infected)
      cx.strokeRect(x,y,z,z);
    else
      cx.fillRect(x,y,z,z);
  }
}

function step() {
  un++;
  healP();
  walkP();
  infectP();
  drawP();
  setFeedback();
  stopP();
}

function start() {
  ui = setInterval("step()",uinterval);
}

function stop() {
  clearInterval(ui);
  ui = 0;
}

function testrand() {
  for (var i=0; i<100; i++) {
    var x = rand(11);
    document.write(x + '<br>');
  }
}

//}}}

$(function() {

  //$('#herd').hide();

  setGlobals();

  if (us == 'tune') {
    tune();
    //alert('xxx');
  }
  else {

  if (us == 'cocoon' || us == 'freeload')
    uinterval = 40;

  seedP();
  if (us =='cocoon') {
    walkP();
    walkP();
    walkP();
  }
  drawP();
  setFeedback();
  ustate = "initialised";

  $("#slider" ).slider({
    range: "min",
    min: 1,
    max: 2000,
    value: 2000 - uinterval,
    slide: function( event, ui ) {
      uinterval = 2001 - ui.value;
      if (ustate == "playing") {
        stop();
        start();
      }
    }
  });

  //$('#next').button({
  //});

  $('#play').button({
    icons: {
      primary: 'ui-icon-play'
    }
  });
  $('#play').click(function() {
    if (ustate == "paused");
      $('#pause').removeClass('ui-state-highlight');
    if (ustate != "initialised" && ustate != "paused")
      alert("Pause or Reset the scenario first");
    else {
      ustate = "playing";
      start();
    }
  });

  $('#step').button({
    icons: {
      primary: 'ui-icon-seek-next'
    }
  });
  $('#step').click(function() {
    if (ustate == "paused" || ustate == "initialised")
      step();
    else
      alert('Pause or Reset the scenario first.');
  });

  $('#pause').button({
    icons: {
      primary: 'ui-icon-pause'
    }
  });
  $('#pause').click(function() {
    if (ustate == "paused") {
      $('#pause').removeClass('ui-state-highlight');
      ustate = "playing";
      start();
    }
    else {
      if (ustate != "playing")
        alert('The scenario is not playing.');
      else {
        $('#pause').addClass('ui-state-highlight');
        ustate = "paused";
        stop();
      }
    }
  });

  $('#preview').button({ //init
  });
  $('#preview').click(function() {
    $('#pause').removeClass('ui-state-highlight');
    if (ui)
      stop();
    setGlobals();
    seedP();
    if (us =='cocoon') {
      walkP();
      walkP();
      walkP();
    }
    drawP();
    setFeedback();
    ustate = "initialised";
  });
  }

});

