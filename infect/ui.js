//{{{  fold marker

//}}}

//{{{  handle console.log

//if (typeof console == "undefined") {
//  if (typeof console.log == "undefined")
//    var console = { log: function() {} };
//}

//}}}

//{{{  prototypes

Array.prototype.has = function(value) {
  var i;
  for (i=0; i<this.length; i++) {
    if (this[i] === value)
      return true;
  }
  return false;
}

//}}}
//{{{  init

var S = {};
var P = [];
var C = {};
var G = [];

C.reset   = false;
C.playing = 0;

//}}}
//{{{  funcs

//{{{  doStep

function doStep() {

  if (!C.playing)
    return;

  doWalk();
  doBehave();
  doRender();

  if (C.age % S.control.plotsample == 0)
    doStats();

  if (C.age % S.control.plotrender == 0)
    doPlot();

  doAge();

  C.age++;
  doFeedback();

  if (C.age % S.control.pause == 0) {
    doPause()
    return;
  }

  if (C.playing)
    setTimeout(doStep,S.control.speed);
}


//}}}
//{{{  doPause

function doPause () {
  $("#bplay").button({
    icons: {
      primary: "ui-icon-play"
    }
  });
  doPlot();
  C.playing = 0;
  $("#bstep").button("enable");
}

//}}}

//{{{  doWalk

function doWalk() {

  var start = randN(P.length);

  for (var i=start; i >= 0; i=nextN(i,start,P.length)) {
    var per     = P[i];
    var typedef = S[per.type];
    if (typeof typedef.walk == "function")
      typedef.walk(per);
  }
}

//}}}
//{{{  doBehave

function doBehave() {

  var start = randN(P.length);
  for (var i=start; i >= 0; i=nextN(i,start,P.length)) {
    var per      = P[i];
    var typedef  = S[per.type];

    per.newstate = per.state;

    var start2 = randN(P.length);
    for (var i2=start2; i2 >= 0; i2=nextN(i2,start2,P.length)) {
      var per2 = P[i2];
      typedef.interact(per,per2);
    }
  }

  for (var i=0; i<P.length; i++) {
    var per = P[i];
    if (per.state != per.newstate) {
      per.state    = per.newstate;
      per.stateage = 0;
    }
  }
}

//{{{  old
    //var h = [];
    //for (var dir=1; dir<=8; dir++) {
    //  var at = applyDir(per,dir);
    //  var p = somebodyAt(at);
    //  if (p >= 0)
    //    h.push(P[p]);
    //}

//}}}

//}}}
//{{{  doRender

function doRender() {

  var c = S.canvas;
  var x = c.cols;
  var y = c.rows;
  var z = c.zoom;

  $('#canvas').hide().attr('width', x*z).attr('height', y*z).show();

  var canvas = document.getElementById("canvas");
  var cxy    = canvas.getContext("2d");

  cxy.clearRect(0,0,x*z,y*z);

  var start = randN(P.length);
  for (var i=start; i >= 0; i=nextN(i,start,P.length)) {

    var per     = P[i];
    var typedef = S[per.type];

    var h = {};
    h.z  = S.canvas.zoom;
    h.x  = per.x * z;
    h.y  = per.y * z;
    h.x1 = h.x + z - 1;
    h.y1 = h.y + z - 1;

    typedef.render(per,cxy,h);
  }
}

//}}}
//{{{  doAge

function doAge() {

  var start = randN(P.length);

  for (var i=start; i >= 0; i=nextN(i,start,P.length)) {
    var per = P[i];
    per.age++;
    per.atage++;
    per.stateage++;
  }
}

//}}}
//{{{  doStats

function doStats() {

  for (var i=0; i<S.states.length; i++) {
    var state = S.states[i];
    if (typeof S.statecache[state] != "object") {
      S.statecache[state] = {};
      S.statecache[state].history  = [];
      S.statecache[state].count    = 0;
    }
  }

  for (var key in S.statecache) {
    S.statecache[key].count = 0;
  }

  for (var i=0; i<P.length; i++) {
    var per = P[i];
    var state = per.state;
    S.statecache[state].count++;
  }

  for (var key in S.statecache) {
    S.statecache[key].history.push([C.age,S.statecache[key].count]);
  }

  C.doplot = true;
}

//}}}
//{{{  doPlot

function doPlot() {

  if (!C.doplot)
    return;

  //{{{  states graph
  
  $('#g1').width(S.plot.width);
  $('#g1').height(S.plot.height);
  
  var legends = [];
  for (var i=0; i<S.plot.states.length; i++)
    legends.push({label : S.plot.states[i], color : S.styles[S.plot.states[i]], shadowDepth : 0, lineWidth : 1, showLine : true, showMarker : false});
  
  var plots = [];
  if (C.reset) {
    for (var i=0; i<S.plot.states.length; i++)
      plots.push(S.statecache[S.plot.states[i]].history);
  }
  else {
    plots.push([[0,0]]);
  }
  
  $.jqplot('g1',plots,{
    legend      : {show : true},
    title       : S.plot.title,
    highlighter : {sizeAdjust : 7.5},
    cursor      : {tooltipLocation : 'sw',zoom:true},
    series      : legends,
    axes : {
      xaxis : {
        min           : 0,
        labelRenderer : $.jqplot.CanvasAxisLabelRenderer,
        label         : S.plot.xaxis,
        autoscale     : true
      },
      yaxis : {
        min           : 0,
        labelRenderer : $.jqplot.CanvasAxisLabelRenderer,
        label         : S.plot.yaxis,
        autoscale     : true
      }
    }
  }).replot();
  
  //}}}
  //{{{  state graph
  
  if (S.plot.state) {
  
    $('#g2').width(S.plot.width);
    $('#g2').height(S.plot.height);
  
    var legends = [];
    legends.push({label : S.plot.state, color : S.styles[S.plot.state], shadowDepth : 0, lineWidth : 1, showLine : true, showMarker : false});
  
    var plots = [];
    if (C.reset) {
      plots.push(S.statecache[S.plot.state].history);
    }
    else {
      plots.push([[0,0]]);
    }
  
    $.jqplot('g2',plots,{
      legend      : {show : true},
      title       : S.plot.state,
      highlighter : {sizeAdjust : 7.5},
      cursor      : {tooltipLocation : 'sw',zoom:true},
      series      : legends,
      axes : {
        xaxis : {
          min           : 0,
          labelRenderer : $.jqplot.CanvasAxisLabelRenderer,
          label         : S.plot.xaxis,
          autoscale     : true
        },
        yaxis : {
          min           : 0,
          labelRenderer : $.jqplot.CanvasAxisLabelRenderer,
          label         : S.plot.yaxis,
          autoscale     : true
        }
      }
    }).replot();
  
  }
  
  //}}}
  //{{{  ern
  
  if (S.plot.infect) {
  
    $('#g3').width(S.plot.width);
    $('#g3').height(S.plot.height);
  
    var plot = [];
  
    if (C.reset) {
      for (var a=0; a<=C.age; a++) {
        var et=0;
        var en=0;
        for (var i=0; i<P.length; i++) {
          var per = P[i];
          if (per.infectage == a) {
            en++;
            et += per.infectees;
          }
        }
        if (en == 0)
          var ave = 0;
        else
          var ave = et/en;
        plot.push([a,ave]);
      }
    }
    else
      plot.push([0,0]);
  
    var legends = [];
    legends.push({label : S.plot.infect,  color : S.styles[S.plot.infect], shadowDepth : 0, lineWidth : 1, showLine : true, showMarker : false});
  
    $.jqplot('g3',[plot],{
      legend      : {show : true},
      title       : S.plot.infecttitle,
      highlighter : {sizeAdjust : 7.5},
      cursor      : {tooltipLocation : 'sw',zoom:true},
      series      : legends,
      axes : {
        xaxis : {
          min           : 0,
          labelRenderer : $.jqplot.CanvasAxisLabelRenderer,
          label         : S.plot.infectxaxis,
          autoscale     : true
        },
        yaxis : {
          min           : 0,
          labelRenderer : $.jqplot.CanvasAxisLabelRenderer,
          label         : S.plot.infectyaxis,
          autoscale     : true
        }
      }
    }).replot();
  
  }
  
  //}}}

  C.doplot = false;

}

//}}}
//{{{  doFeedback

function doFeedback () {
  $('#feedback').html('iterations=' + C.age + '<br>');
}

//}}}

//{{{  clonePerson

function clonePerson(p) {

  return ({state : p.state, type : p.type, x : p.x, y : p.y, age : p.age});

}

//}}}
//{{{  setSomebodyAt

function setSomebodyAt(x,y,i) {
  if (!G[x])
    G[x] = [];
  G[x][y] = i;
}

//}}}

//user funcs

//{{{  changeState

function changeState (per,state,who) {
  if (per.state != state) {
    per.newstate = state;
    if (state == S.plot.infect) {
      per.infectage = C.age;
      who.infectees++;
    }
    if (typeof S[per.type].onchangestate == "function")
      S[per.type].onchangestate(per,state);

  }
}

//}}}
//{{{  nextN

function nextN (n,start,max) {

  n += 1;
  if (n == max)
    n = 0;

  if (n == start)
    return -1;

  return n;
}

//}}}
//{{{  popPercent

function popPercent(percent) {

  if (percent > 100.0)
    percent = 100.0;

  if (percent < 0)
    percent = 0.0;

  return Math.round((percent * S.canvas.cols * S.canvas.rows) / 100.0);

}

//}}}
//{{{  applyDir

function applyDir(p,dir) {
  var x = p.x;
  var y = p.y;
  var w = false;
  switch (dir) {
    case 1:
      x += 0;
      y += -1;
      break;
    case 2:
      x += 1;
      y += -1;
      break;
    case 3:
      x += 1;
      y += 0;
      break;
    case 4:
      x += 1;
      y += 1;
      break;
    case 5:
      x += 0;
      y += 1;
      break;
    case 6:
      x += -1;
      y += 1;
      break;
    case 7:
      x += -1;
      y += 0;
      break;
    case 8:
      x += -1;
      y += -1;
      break;
    default:
      alert('Invalid direction: ' + dir);
  }

  if (x < 0 && S.canvas.wrapRows)
    x = x + S.canvas.cols;
  if (x >= S.canvas.cols && S.canvas.wrapRows)
    x = x - S.canvas.cols;
  if (y < 0 && S.canvas.wrapCols)
    y = y + S.canvas.rows;
  if (y >= S.canvas.cols && S.canvas.wrapCols)
    y = y - S.canvas.rows;

  return {x:x,y:y}; //possibly off canvas
}

//}}}
//{{{  createPerson

function createPerson(perdef) {

  var perobj = {};

  perobj.type   = perdef.type;
  perobj.age    = perdef.age;
  perobj.state  = perdef.state;

  if (perdef.at) {
    perobj.x = perdef.at.x;
    perobj.y = perdef.at.y;
  }
  else {
    perobj.x = perdef.x;
    perobj.y = perdef.y;
  }

  if (canMoveTo({x:perobj.x,y:perobj.y})) {
    P.push(clonePerson(perobj));
    var p = P[P.length-1];
    p.id         = P.length-1;
    p.atage      = 0;
    p.stateage   = 0;
    p.infectage  = -1;
    p.infectees  = 0;
    if (p.state == S.plot.infect)
      p.infectage  = 0;
    if (typeof S[p.type].oncreate == "function")
      S[p.type].oncreate(p);
    setSomebodyAt(p.x,p.y,p.id);
  }
}

//}}}
//{{{  walkTo

function walkTo(per,to) {

  if (!onCanvas(to))
    alert('cannot move off canvas: x=' + at.x + ', y=' + y);

  setSomebodyAt(per.x,per.y,-1);

  per.x = to.x;
  per.y = to.y;

  per.atage = 0;

  setSomebodyAt(per.x,per.y,per.id);
}

//}}}
//{{{  onCanvas

function onCanvas(at) {

  if (at.x < 0 || at.x >= S.canvas.cols || at.y < 0 || at.y >= S.canvas.rows)
    return false;
  else
    return true;
}

//}}}
//{{{  canMoveTo

function canMoveTo(at) {

  if (!onCanvas(at))
    return false;

  if (!G[at.x])
   G[at.x] = [];

  if (G[at.x][at.y] == -1 || G[at.x][at.y] == undefined)
    return true;

  if (G[at.x][at.y] >= 0)
    return false;

  alert('canMoveTo is confused');

}

//}}}
//{{{  somebodyAt

// -2 = off canvas
// -1 = free
// 0+ = id

function somebodyAt(at) {

  if (!onCanvas(at))
    return -2;

  if (!G[at.x])
   G[at.x] = [];

  if (G[at.x][at.y] == -1 || G[at.x][at.y] == undefined)
    return -1;

  if (G[at.x][at.y] >= 0)
    return G[at.x][at.y];

  alert('somebodyAt is confused');

}

//}}}
//{{{  rand

function rand() {
  do {
    var r = Math.random();
  }
  while (r >= 1.0)
  return r;
}

//}}}
//{{{  randAt

function randAt() {
  var x = 0;
  var y = 0;
  do {
    x = randN(S.canvas.cols);
    y = randN(S.canvas.rows);
  }
  while (somebodyAt({x:x,y:y}) >= 0)
  return {x:x,y:y};
}

//}}}
//{{{  randN

//return rand between 0 and N-1

function randN (n) {
  return Math.floor(rand() * n);
}

//}}}
//{{{  randNormal

function randNormal (n) {
  var n2 = 2 * n;
  var heads = 0;
  for (var i=0; i<n2; i++) {
    if (rand() < 0.5)
      heads++;
  }
  return heads;
}

//}}}
//{{{  randBinom

function randBinom (n,p) {
  var x = 0;
  for (var i=0; i<n; i++) {
    if (Math.random() < p)
      x++;
  }
  return x;
}

//}}}
//{{{  randDir

function randDir () {
  return Math.floor(rand() * 8);
}

//}}}
//{{{  randomize

function randomize(array) {
    var tmp, current, top = array.length;
    if(top) while(--top) {
        current = Math.floor(Math.random() * (top + 1));
        tmp = array[current];
        array[current] = array[top];
        array[top] = tmp;
    }
    return array;
}

//}}}
//{{{  rgbStr

function rgbStr(r,g,b) {
  return 'rgb(' + r + ',' + g + ',' + b + ')';
}

//}}}
//{{{  isNeighbour

function isNeighbour(p,q,d) {

  var w = Math.abs(p.x - q.x);
  var h = Math.abs(p.y - q.y);

  var z = Math.floor(Math.sqrt(h*h+w*w));
  if (z <= d)
    return true;

  if (S.canvas.wrapCols) {
    var h2 = S.canvas.cols - h;
    var z = Math.floor(Math.sqrt(h2*h2+w*w));
    if (z <= d)
      return true;
  }

  if (S.canvas.wrapRows) {
    var w2 = S.canvas.rows - w;
    var z = Math.floor(Math.sqrt(h*h+w2*w2));
    if (z <= d)
      return true;
  }

  return false;
}

//}}}

//}}}

$(function() {

  //{{{  reset button
  
  $("#breset").button({
    text : false,
    icons: {
      primary: "ui-icon-gear"
    }
  });
  
  $("#breset").click(function() {
  
    if (C.playing) {
      C.playing = 0;
      clearInterval(C.playing);
    }
    $("#bplay").button({
      icons: {
        primary: "ui-icon-play"
      }
    });
  
    S = {};
    P = [];
    G = [];
  
    C.reset = false;
    $("#bplay").button("disable");
    $("#bstep").button("disable");
  
    try {
      var err = false;
      eval($('#scenario').val());
    }
    catch (e) {
      if (e instanceof SyntaxError) {
        var err = true;
        alert(e.message);
      }
    }
  
    if (!err) {
      if (S.canvas) {
        C.age = 0;
        doFeedback();
        doRender();
        C.doplot = true;
        doPlot();
        C.reset = true; //after plot
        S.statecache = {};
        $('#canvas').css("border","1px solid #666666");
        if (S.canvas.wrapTop)
          $('#canvas').css("border-top", "1px solid #dddddd");
        if (S.canvas.wrapBottom)
          $('#canvas').css("border-bottom", "1px solid #dddddd");
        if (S.canvas.wrapLeft)
          $('#canvas').css("border-left", "1px solid #dddddd");
        if (S.canvas.wrapRight)
          $('#canvas').css("border-right", "1px solid #dddddd");
        $("#bplay").button("enable");
        $("#bstep").button("enable");
      }
      else {
        if (!$.trim($('#scenario').val()))
          alert("no scenario definition");
        else
          alert("Error somewhere before the canvas definition");
      }
    }
  
  });
  
  //}}}
  //{{{  play button
  
  $("#bplay").button({
    text : false,
    icons: {
      primary: "ui-icon-play"
    }
  });
  
  $("#bplay").click(function() {
  
    if (!C.reset)
      return;
  
    if (C.playing == 0) {
      C.playing = setTimeout(doStep,S.control.speed);
      $("#bplay").button({
        icons: {
          primary: "ui-icon-pause"
        }
      });
      $("#bstep").button("disable");
    }
    else {
      doPause();
    }
  
  });
  
  //}}}
  //{{{  step button
  
  $("#bstep").button({
    text : false,
    icons: {
      primary: "ui-icon-seek-next"
    }
  });
  
  $("#bstep").click(function() {
  
    if (!C.reset)
      return;
    if (C.playing)
      return;
  
    doStep();
  
  });
  
  //}}}

  $("#bplay").button("disable");
  $("#bstep").button("disable");

  if (!C.reset && $.trim($('#scenario').val())) {
    $("#breset").trigger("click");
  }

  $.jqplot.config.enablePlugins = true;

});

