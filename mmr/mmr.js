
var us           = 1;    //scenario number
var un           = 0;    //baby count
var uc           = 0;    //correlations
var ucanvasx      = 780;
var ucanvasy      = 100;

var uhighlightlinewidth = 5;
var uhighlightstyle     = "yellow";

var ustatsstyle  = '#404040';
var ustatsfont   = 'bold 14px sans-serif';
var ustatsalign  = 'top';
var ustatsy      = 79;
var ustatsx      = 9;

var uannostyle  = '#404040';
var uannofont   = '9px sans-serif';
var uannoalign  = 'top';

var uyearstyle  = '#808080';
var uyearrow    = 0;
var uyearfont   = '9px sans-serif';
var uyearalign  = 'top';

var uagestyle   = '#6666cc';
var uagerow     = 2;

var uvaxrow        = 6;
var uvaxrangestyle = '#bbeebb';
var uvaxstyle      = '#446644';

var uautrow        = 4;
var uautrangestyle = '#eebbbb';
var uautstyle      = '#664444';

var ui          = 0;    //interval handle
var uinterval   = 100;  //0-1000 speed

var umaxslot = 71;   //slot = month

var uautmin = 2;
var uautmax = 71;
var uvax1min = 12;
var uvax1max = 15;
var uvax2min = 36;
var uvax2max = 59;

var umaxx    = 72;  //geographical area X
var umaxy    = 8;   //geographical area Y

var uzoomx   = 10;   //for display
var uzoomy   = 10;

var uannox   = umaxslot * uzoomx + 20;

var uage     = 0;
var uvax1    = 0;
var uvax2    = 0;
var uaut    = 0;

function rand(min,max) {
  var r = Math.random();
  var n = max-min;
  r = r * n;
  var i = min + Math.floor(r);
  return i;
}

function seed() {
  while (1) {
    un++;
    uage  = 0;
    uvax1 = rand(uvax1min,uvax1max);
    uvax2 = rand(uvax2min,uvax2max);
    uaut  = rand(uautmin,uautmax);
    if (uvax1 == uaut-1)
      uc++;
    if (uvax2 == uaut-1)
      uc++;
    if (us < 5)
      break;
    if (uvax1 == uaut-1 || uvax2 == uaut-1)
      break;
  }
}

function walk() {
  uage += 1;
  if (uage > umaxslot) {
    seed();
  }
}

function draw() {
  var canvas  = document.getElementById("mmr");
  var cx      = canvas.getContext("2d");
  cx.clearRect(0,0,ucanvasx,ucanvasy);

  //col anno
  cx.fillStyle    = uannostyle;
  cx.font         = uannofont;
  cx.textBaseline = uannoalign;
  cx.fillText('AGE',uannox,uagerow*uzoomy);

  if (us > 5)
    cx.fillText('AUTISM',uannox,uautrow*uzoomy);
  else if (us > 1)
    cx.fillText('DRUM',uannox,uautrow*uzoomy);

  if (us > 5)
    cx.fillText('MMR',uannox,uvaxrow*uzoomy);
  else if (us > 2)
    cx.fillText('STICKS',uannox,uvaxrow*uzoomy);

  cx.fillStyle    = ustatsstyle;
  cx.font         = ustatsfont;
  cx.textBaseline = ustatsalign;
  if (us > 3) {
    var percent = Math.round((uc/un) * 1000) / 10;
    cx.fillText(uc + ' / ' + un + ' (' + percent + '%)',ustatsx,ustatsy);
  }
  else
    cx.fillText(un,ustatsx,ustatsy);

  //year anno row
  for (var i = 0; i < umaxslot/12+1; i++) {
    var x = i * 12 * uzoomx;
    var y = uyearrow * uzoomy + 5;
    cx.fillStyle    = uyearstyle;
    cx.font         = uyearfont;
    cx.textBaseline = uyearalign;
    if (i == 0)
      cx.fillText('B',x+5,y);
    else
      cx.fillText(i,x,y);
  }

  //age
  var x = uage;
  var y = uagerow;
  box(cx,x,y,uagestyle);

  //vax
  if (us > 2) {
    for (i = uvax1min; i <= uvax1max; i++) {
      var x = i;
      var y = uvaxrow;
      box(cx,x,y,uvaxrangestyle);
    }
    for (i = uvax2min; i <= uvax2max; i++) {
      var x = i;
      var y = uvaxrow;
      box(cx,x,y,uvaxrangestyle);
    }
    if (uage >= uvax1) {
      x = uvax1;
      y = uvaxrow;
      box(cx,x,y,uvaxstyle);
    }
    if (uage >= uvax2) {
      x = uvax2;
      y = uvaxrow;
      box(cx,x,y,uvaxstyle);
    }
  }

  //autism
  if (us > 1) {
    for (i = uautmin; i <= uautmax; i++) {
      var x = i;
      var y = uautrow;
      box(cx,x,y,uautrangestyle);
    }
    if (uage >= uaut) {
      x = uaut;
      y = uautrow;
      box(cx,x,y,uautstyle);
    }
  }

  //highlight
  if (us > 2) {
    if (uvax1 == uaut-1 || uvax2 == uaut-1) {
      cx.lineWidth   = uhighlightlinewidth;
      cx.strokeStyle = uhighlightstyle;
      cx.strokeRect(0,0,ucanvasx+1,ucanvasy+1);
    }
  }
}

function box(cx,x,y,style) {
  cx.fillStyle = style;
  cx.fillRect(x*uzoomx,y*uzoomy,uzoomx,uzoomy);
}

function step() {
  walk();
  draw();
}

function start() {
  ui = setInterval("step()",uinterval);
}

function stop() {
  clearInterval(ui);
  ui = 0;
}

$(function() {

  $('#mmr').attr('width',ucanvasx).attr('height',ucanvasy).show();

  us = parseInt($('#us').val());
  //if (us > 4)
    //uinterval = 1;

  $("#slider" ).slider({
    range: "min",
    min: 1,
    max: 1000,
    value: 1001 - uinterval,
    slide: function( event, ui ) {
      uinterval = 1001 - ui.value;
      stop();
      start();
    }
  });

  seed();
  start();

});

