//{{{  fold marker

//}}}

//{{{  globals

var par    = {};
var soln   = {};
var best   = {};
var looper = {};

//}}}
//{{{  models

//{{{  sir

var SIR = {};

//{{{  .next

SIR.next = function () {

  var t      = pVal(par.modelData.t);
  var s      = pVal(par.modelData.s);
  var i      = pVal(par.modelData.i);
  var k      = pVal(par.modelData.k);
  var b      = pVal(par.modelData.b);

  soln.solution = [t,s,i,k,b];
}

//}}}
//{{{  .solve

SIR.solve = function () {

  var t  = soln.solution[0];
  var s0 = soln.solution[1];
  var i0 = soln.solution[2];
  var k  = soln.solution[3];
  var b  = soln.solution[4];

  var sx = s0;
  var ix = i0;
  var rx = t-s0-i0;

  soln.incidence  = [];
  soln.prevalence = [];

  soln.prevalence.push(i0);

  if (looper.done) {
    soln.ern = [];
    soln.ern.push((b / k) * (s0 / t));
    soln.sa = [];
    soln.sa.push(sx);
    soln.ia = [];
    soln.ia.push(ix);
    soln.ra = [];
    soln.ra.push(rx);
  }

  for (var l=1; l < par.length; l++) {

    var inci = b * ix * (sx / t);
    var well = ix * k;

    soln.incidence.push(inci);

    var sx = sx - inci;
    var ix = ix + inci - well;
    var rx = rx        + well;

    soln.prevalence.push(ix);

    if (looper.done) {
      soln.ern.push((b / k) * (sx / t));
      soln.sa.push(sx);
      soln.ia.push(ix);
      soln.ra.push(rx);
    }
  }

  inci = b * ix * (sx / t);
  soln.incidence.push(inci);
}


//}}}
//{{{  .plotStates

SIR.plotStates = function () {
  $.jqplot('states',[soln.sa,soln.ia,soln.ra],{
    legend: {show:true},
    title: 'SIR',
    axes:{
      xaxis:{
        labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
        label: par.frequency,
        min: 0,
        autoscale: true
      },
      yaxis:{
        labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
        label:'people',
        min: 0,
        autoscale: true
      }
    },
    highlighter: {sizeAdjust: 7.5},
    cursor: {tooltipLocation:'sw',zoom:true},
    series: [
      {color: "#9999cc", label:'susceptible', pointLabels: {show: false}},
      {color: "#cc9999", label:'infected',    pointLabels: {show: false}},
      {color: "#99cc99", label:'recovered',   pointLabels: {show: false}}
    ]
  }).replot({resetAxes: false});
}

//}}}
//{{{  .log

SIR.log = function () {

  var t  = best.solution[0];
  var s0 = best.solution[1];
  var i0 = best.solution[2];
  var k  = best.solution[3];
  var b  = best.solution[4];
  var r0 = b/k;

  looper.log += 't='+t;
  looper.log += ', s0='+s0;
  looper.log += ', i0='+i0;
  looper.log += ', b='+b;
  looper.log += ', k='+k;
  looper.log += ', r0='+r0;
  looper.log += ', offset='+best.offset;
  looper.log += ', score='+best.score;
  looper.log += '<br>';
}


//}}}

//}}}
//{{{  sir2

var SIR2 = {};

//{{{  .next

SIR2.next = function () {

  var t      = pVal(par.modelData.t);
  var s      = pVal(par.modelData.s);
  var i      = pVal(par.modelData.i);
  var k      = pVal(par.modelData.k);
  var r0     = pVal(par.modelData.r0);

  soln.solution = [t,s,i,k,r0*k];
}

//}}}
//{{{  .solve

SIR2.solve = function () {

  SIR.solve();

}


//}}}
//{{{  .plotStates

SIR2.plotStates = function () {

  SIR.plotStates();

}

//}}}
//{{{  .log

SIR2.log = function () {

  SIR.log();

}


//}}}

//}}}
//{{{  seir

var SEIR = {};

//{{{  .next

SEIR.next = function () {

  var t      = pVal(par.modelData.t);
  var s      = pVal(par.modelData.s);
  var e      = pVal(par.modelData.e);
  var i      = pVal(par.modelData.i);
  var k      = pVal(par.modelData.k);
  var b      = pVal(par.modelData.b);
  var m      = pVal(par.modelData.m);

  soln.solution = [t,s,e,i,k,b,m];
}

//}}}
//{{{  .solve

SEIR.solve = function () {

  var t  = soln.solution[0];
  var s0 = soln.solution[1];
  var e0 = soln.solution[2];
  var i0 = soln.solution[3];
  var k  = soln.solution[4];
  var b  = soln.solution[5];
  var m  = soln.solution[6];

  var sx = s0;
  var ex = e0;
  var ix = i0;
  var rx = t-s0-e0-i0;

  soln.incidence  = [];
  soln.prevalence = [];

  soln.prevalence.push(i0);

  if (looper.done) {
    soln.ern = [];
    soln.ern.push((b / k) * (s0 / t));
    soln.sa = [];
    soln.sa.push(sx);
    soln.ea = [];
    soln.ea.push(ex);
    soln.ia = [];
    soln.ia.push(ix);
    soln.ra = [];
    soln.ra.push(rx);
  }

  for (var l=1; l < par.length; l++) {

    var expo = ex * m;
    var inci = b * ix * (sx / t);
    var well = ix * k;

    soln.incidence.push(inci);

    var sx = sx - inci;
    var ex = ex + inci - expo;
    var ix = ix + expo - well;
    var rx = rx        + well;

    soln.prevalence.push(ix);

    if (looper.done) {
      soln.ern.push((b / k) * (sx / t));
      soln.sa.push(sx);
      soln.ea.push(ex);
      soln.ia.push(ix);
      soln.ra.push(rx);
    }
  }

  inci = b * ix * (sx / t);
  soln.incidence.push(inci);
}


//}}}
//{{{  .plotStates

SEIR.plotStates = function () {
  $.jqplot('states',[soln.sa,soln.ea,soln.ia,soln.ra],{
    legend: {show:true},
    title: 'SIR',
    axes:{
      xaxis:{
        labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
        label: par.frequency,
        min: 0,
        autoscale: true
      },
      yaxis:{
        labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
        label:'people',
        min: 0,
        autoscale: true
      }
    },
    highlighter: {sizeAdjust: 7.5},
    cursor: {tooltipLocation:'sw',zoom:true},
    series: [
      {color: "#9999cc", label:'susceptible', pointLabels: {show: false}},
      {color: "#cc99cc", label:'exposed',     pointLabels: {show: false}},
      {color: "#cc9999", label:'infected',    pointLabels: {show: false}},
      {color: "#99cc99", label:'recovered',   pointLabels: {show: false}}
    ]
  }).replot({resetAxes: false});
}

//}}}
//{{{  .log

SEIR.log = function () {

  var t  = best.solution[0];
  var s0 = best.solution[1];
  var e0 = best.solution[2];
  var i0 = best.solution[3];
  var k  = best.solution[4];
  var b  = best.solution[5];
  var m  = best.solution[6];
  var r0 = b/k;

  looper.log += 't='+t;
  looper.log += ', s0='+s0;
  looper.log += ', e0='+e0;
  looper.log += ', i0='+i0;
  looper.log += ', b='+b;
  looper.log += ', k='+k;
  looper.log += ', m='+m;
  looper.log += ', r0='+r0;
  looper.log += ', offset='+best.offset;
  looper.log += ', score='+best.score;
  looper.log += '<br>';
}


//}}}

//}}}

//}}}
//{{{  funcs

//{{{  dp

function dp (x,n) {
  return Math.round(x*Math.pow(10,n))/Math.pow(10,n);
}

//}}}
//{{{  rand

function rand(min,max) {
  var r = Math.random() * (max-min) + min;
  //console.log(r)
  return r;
}

function randi(min,max) {
  var r = Math.random() * (max-min) + min;
  r = Math.round(r);
  //console.log(r)
  return r;
}

//}}}
//{{{  pVal

function pVal (x) {
  if (typeof x == typeof function (){})
    return x();
  else
    return x;
}

//}}}
//{{{  getInput

function getInput () {

  eval('par = {' + $('#inp').val() + '}');
  //console.log(par);
}

//}}}
//{{{  explore

function explore() {

  var t1 = new Date();

  for (var x = 0; x < looper.loops; x++) {

    nextSolution();
    solveSolution();
    testSolution();

    looper.iters++;

    if (looper.iters >= par.solutions) {
      looper.done = true;
      break;
    }
  }

  var progress = Math.round(looper.iters * 100 / par.solutions);
  $('#feedback').text(progress + '%' + ' : score=' + best.score);

  if (looper.done) {
    clearInterval(looper.ui);
    if (best.score == -1) {
      looper.log = '<p>No solutions';
    }
    else {
      soln.solution  = best.solution
      soln.offset    = best.offset;
      solveSolution();
      plotter();
      looper.log += '<br>performance=' + looper.loops + '<br>';
    }
    $('#log').html(looper.log);
  }

  var t2 = new Date() - t1;

  if (t2 < looper.timer) {
    if (looper.loops > looper.maxloops)
      looper.maxloops = looper.loops;
    if (!looper.turned)
      looper.loops *= 2;
    else
      looper.loops += looper.bump;
  }

  if (t2 > looper.timer) {
    looper.turned++;
    looper.loops -= looper.bump;
  }

}

//}}}
//{{{  plotter

function arrayify (a) {
  for (var i=0; i<a.length; i++)
    a[i] = [i+1,a[i]];
}

function plotter () {

  //{{{  normalise
  
  soln.obs = [];
  
  for (var i=0; i<best.offset; i++)
    soln.obs.push(0);
  
  for (var i=0; i<par.data.length; i++) {
    if (par.data[i] == -1)
      par.data[i] = 0;
    soln.obs.push(par.data[i]);
  }
  
  for (var i=0; i<par.length - best.offset - par.data.length; i++)
    soln.obs.push(0);
  
  //}}}

  //{{{  data      all models
  
  $.jqplot('act',[par.data],{
    legend: {show:true},
    title: par.type,
    axes:{
      xaxis:{
        min: 0,
        autoscale: true,
        labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
        label: par.frequency
      },
      yaxis:{
        min: 0,
        autoscale: true,
        labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
        label:par.type,
      }
    },
    highlighter: {sizeAdjust: 7.5},
    cursor: {tooltipLocation:'sw',zoom:true},
    series: [
      {renderer: $.jqplot.BarRenderer, label: 'actual', pointLabels: {show: true}, rendererOptions: {barWidth: 10, barPadding: 1}},{label:'fitted', pointLabels: {show: false}}
    ]
  }).replot({resetAxes: false});
  
  //}}}
  //{{{  data+fit  all models
  
  $.jqplot('actest',[soln.obs,soln[par.type]],{
    legend: {show:true},
    title: par.type + ' + fitted ' + par.type,
    axes:{
      xaxis:{
        min: 0,
        autoscale: true,
        labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
        label: par.frequency
      },
      yaxis:{
        min: 0,
        autoscale: true,
        labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
        label:par.type,
      }
    },
    highlighter: {sizeAdjust: 7.5},
    cursor: {tooltipLocation:'sw',zoom:true},
    series: [
      {renderer: $.jqplot.BarRenderer, label: 'data', pointLabels: {show: false}, rendererOptions: {barWidth: 7, barPadding: 1}},
      {label:'fitted', pointLabels: {show: false}}
    ]
  }).replot({resetAxes: false});
  
  //}}}
  //{{{  ern       all models
  
  $.jqplot('ern',[soln.ern],{
    legend: {show:true},
    title: 'effective reproduction number',
    axes:{
      xaxis:{
        min: 0,
        autoscale: true,
        labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
        label: par.frequency
      },
      yaxis:{
        min: 0,
        autoscale: true,
        labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
        label:'transmissions',
      }
    },
    highlighter: {sizeAdjust: 7.5},
    cursor: {tooltipLocation:'sw',zoom:true},
    series: [
      {color: "#8080cc", label:'ern', pointLabels: {show: false}}
    ]
  }).replot({resetAxes: false});
  
  //}}}
  //{{{  i+p       all models
  
  $.jqplot('ip',[soln.incidence,soln.prevalence],{
    legend: {show:true},
    title: 'fitted incidence + prevalence',
    axes:{
      xaxis:{
        min: 0,
        autoscale: true,
        labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
        label: par.frequency
      },
      yaxis:{
        min: 0,
        autoscale: true,
        labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
        label:'new cases, cases',
      }
    },
    highlighter: {sizeAdjust: 7.5},
    cursor: {tooltipLocation:'sw',zoom:true},
    series: [
      {label:'incidence',  pointLabels: {show: false}},
      {label:'prevalence', pointLabels: {show: false}}
    ]
  }).replot({resetAxes: false});
  
  //}}}
  //{{{  states
  
  par.model.plotStates();
  
  //}}}
  //{{{  scores    all models
  
  var xa = [];
  var done = false;
  
  for (var i=0; i < 10; i++) {
    j = Math.pow(10,i);
    if (j < par.solutions) {
      xa.push(j);
    }
    else if (!done && j >= par.solutions) {
      xa.push(j);
      done = true;
    }
  }
  
  var ya = [];
  var done = false;
  
  for (var i=0; i < 10; i++) {
    j = Math.pow(10,i);
    if (j < best.maxscore) {
      ya.push(j);
    }
    else if (!done && j >= best.maxscore) {
      ya.push(j);
      done = true;
    }
  }
  
  $.jqplot('scores',[best.scores],{
    legend: {show:true},
    title: 'scores',
    axes:{
      xaxis:{
        renderer:$.jqplot.LogAxisRenderer,
        labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
        label: 'solutions',
        autoscale: true,
        ticks: xa
      },
      yaxis:{
        renderer:$.jqplot.LogAxisRenderer,
        labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
        label:'score',
        autoscale: true,
        ticks: ya
      }
    },
    highlighter: {sizeAdjust: 7.5},
    cursor: {tooltipLocation:'sw',zoom:true},
    series: [
      {label:'scores',pointLabels: {show: false}},
    ]
  }).replot({resetAxes: false});
  
  //}}}

}

//}}}
//{{{  nextSolution

function nextSolution() {

  soln.offset = pVal(par.offset);

  par.model.next();
}

//}}}
//{{{  solveSolution

function solveSolution() {

  return par.model.solve();

}

//}}}
//{{{  testSolution

function pearsonLeastSquares (act,est) {
  var diff = act - est;
  if (act < 0)
    return (diff * diff);
  else
    return (diff * diff) / act;
}

function leastSquares (act,est) {
  var diff = act - est;
  return diff * diff;
}

function absDiff (act,est) {
  var diff = act - est;
  return Math.abs(diff);
}

function testSolution() {

  var score = 0;

  for (var y=0; y < par.data.length; y++) {
    var dat = par.data[y];
    if (dat != -1) {
      score += par.match(dat,soln[par.type][soln.offset+y]); //offset+y needs checking
      if (isNaN(score)) {
        //console.log('nan');
        return; //abort
      }
    }
  }

  if (score < best.score || best.score == -1) {
    best.score    = score;
    best.offset   = soln.offset;
    best.solution = soln.solution;
    best.scores.push([looper.iters+1,score]);
    par.model.log();
  }

  if (score > best.maxscore) {
    best.maxscore = score;
  }
}

//  for (var x=0; x <= par.length - par.data.length; x++) {

//}}}

//}}}

$(function() {

  $.jqplot.config.enablePlugins = true;
  $('#go').click(function() {
    //console.log($("#inp").val());
    window.location = "http://op12no2.me/toys/fit?p=" + encodeURI($("#inp").val());
  });

  $('#abort').click(function() {
    looper.done = true;
  });

  $('#go').button({
    icons: {
      primary: 'ui-icon-play'
    }
  });

  getInput();

  best.score     = -1;
  best.maxscore  = 0;
  best.scores    = [];

  looper.timer     = 100; //ms
  looper.loops     = 1000;  //conservative start
  looper.bump      = 1000;
  looper.done      = false;
  looper.iters     = 0;
  looper.turned    = 0;
  looper.maxloops  = 0;
  looper.log       = '<p>';

  looper.ui        = setInterval("explore()",looper.timer);

});

