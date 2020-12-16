//{{{  fold marker

//}}}

var DEBUG = true;

//{{{  funcs1

//can be used in init structures

//{{{  rand

// [0,1)

function rand() {
  var r = Math.random();
  return r;
}

//}}}
//{{{  randX

function randX (o) {
  if (typeof o == typeof {})
    return o.func(o.args);
  else
    return o;
}

//}}}

//{{{  randU0    0 to N-1

function randU0 (o) {
  return randU0a(o.max);
}

function randU0a (max) {
  return Math.floor(rand() * max);
}


//}}}
//{{{  randU1    1 to N

function randU1 (o) {
  return randU1a(o.max);
}

function randU1a (max) {
  return Math.ceil(rand() * max);
}


//}}}
//{{{  randG     normal dist (can go -ve)
//
// random normal dist (gaussian) integer with mean m and standard deviation s.
//
// http://www.protonfish.com/random.shtml
//
// s needs to be < m/3 otherwise the result can go -ve
//

function randG (o) {
  return randGa(o.mean,o.sd);
}

function randGa (mean,sd) {
  var x = (Math.random()*2-1) + (Math.random()*2-1) + (Math.random()*2-1);
  var g = mean + x * sd;
  var r = Math.round(g);
  return r;
}

//}}}
//{{{  randE     exp dist 1 based

function randE (o) {
  return randEa(o.mean);
}

function randEa (mean) {
  var r =  Math.ceil(Math.log(1-rand())/(-1/mean));
  return r;
}

//}}}
//{{{  randUMM   min max N

function randUMM (o) {
  return randUMMa(o.min,o.max);
}

function randUMMa (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

//}}}
//{{{  fixed     fixed anything

function fixed (o) {
  return o.val;
}

//}}}

//}}}
//{{{  load init

var sState = 's';
var eState = 'e';
var iState = 'i';
var rState = 'r';

var user     = {};
var glob     = {};
var per      = [];
var looper   = {};
var stats    = {};
var cache    = {};
var callback = {};
var work     = {};
var init     = [];

var states = {
    s: {
    },
    e: {
    },
    i: {
    },
    r: {
    }
}

//}}}
//{{{  funcs2

//{{{  debug

function debug (x) {
  if (DEBUG)
    console.log(x);
}

//}}}
//{{{  per*

//{{{  perCreate

function perCreate(data) {

  per[glob.perN] = {};

  var p = per[glob.perN];

  p.Id           = glob.perN;
  p.Age          = data.Age;
  p.Left         = randX(data.Left);  //they'll move if off sereen
  p.Top          = randX(data.Top);

  p.R0           = []; //list of people this person infected
  p.When         = []; //state change times

  p.State        = ''; //important
  perSetState(p,data.State);

  glob.perN++;
}

//}}}
//{{{  perSetState

function perSetState (p,State) {

  if (p.State == State)
    return;

  //update cache lists

  if (p.State) {
    var idx = cache.List[p.State].indexOf(p.Id);
    if (idx == -1)
      debug('missing cache element ' + i + ' for state ' + p.State);
    cache.List[p.State].splice(idx,1);
  }
  cache.List[State].push(p.Id);

  //update object

  p.State = State;
  p.When[p.State] = looper.loops; //when it happened

  var s = states[p.State];

  p.Size   = randX(s.Size);
  p.Colour = randX(s.Colour);

  if (p.State == sState) {
    p.Prob = randX(s.Prob);
  }
  if (p.State == eState) {
    p.Len  = randX(s.Len);
  }
  if (p.State == iState) {
    p.Len  = randX(s.Len);
    p.Prob = randX(s.Prob);
    p.Dist = randX(s.Dist);
  }
  if (p.State == rState) {
  }

  perRandDir(p); // depends on state

}

//}}}
//{{{  perRandDir

function perRandDir(p) {

  var s = states[p.State];

  p.dirFarX = randX(s.dirFarX);
  p.dirFarY = randX(s.dirFarY);

  p.dirSwap = randX(s.dirSwap);

}

//}}}
//{{{  perMove

function perMove(p) {

  p.dirSwap--;
  if (p.dirSwap <= 0)
    perRandDir(p);

  p.Left += p.dirFarX;

  if (p.Left < glob.minLeft) {
    p.Left = glob.minLeft;
    p.dirFarX = -p.dirFarX;
  }

  if (p.Left > glob.maxRight - p.Size + 1) {
    p.Left = glob.maxRight - p.Size + 1;
    p.dirFarX = -p.dirFarX;
  }

  p.Top += p.dirFarY;

  if (p.Top < glob.minTop) {
    p.Top = glob.minTop;
    p.dirFarY = -p.dirFarY;
  }

  if (p.Top > glob.maxBottom - p.Size + 1) {
    p.Top = glob.maxBottom - p.Size + 1;
    p.dirFarY = -p.dirFarY;
  }

}

//}}}
//{{{  perInteract

function perInteract (p) {

  if (p.State == sState) {
    //{{{  eState?
    
    var inf = cache.List[iState];
    
    for (var i=0; i<inf.length; i++) {
      var q = per[inf[i]];
      if (q.Prob > rand()) {
        if (p.Prob > rand()) {
          if (perDistance(p,q) < q.Dist) {
            perSetState(p,eState);                     //infection successful
            q.R0.push(p.Id);
            break;
          }
        }
      }
    }
    
    //}}}
    return;
  }

  if (p.State == eState) {
    //{{{  iState?
    
    p.Len--;
    if (p.Len <= 0) {
      perSetState(p,iState);
    }
    
    //}}}
    return;
  }

  if (p.State == iState) {
    //{{{  rState?
    
    p.Len--;
    if (p.Len <= 0) {
      perSetState(p,rState)
    }
    
    //}}}
    return;
  }

  if (p.State == rState) {
    return;
  }

}

//}}}
//{{{  perDistance

function perDistance (p,q) {

  var left = Math.abs(p.Left - q.Left);
  var top  = Math.abs(p.Top  - q.Top);

  var dist = Math.round(Math.sqrt(left*left + top*top));
  return dist;

}

//}}}

//}}}
//{{{  explore

function explore() {

  looper.start = new Date;

    for (var i=0; i<glob.perN; i++) {
      var p = per[i];
      p.Age++;
      perMove(p)
      perInteract(p)
      scenarioCallback(p);
    }

    for (var state in states)
      stats.His[state].push(cache.List[state].length);

    draw();
    drawCallback();

  looper.end = new Date;

  looper.delta = looper.end - looper.start;
  looper.timeTot += looper.delta;
  looper.loops++;
  looper.timeAve = Math.round(looper.timeTot / looper.loops);

  navFeedback();

  var ended = false;
  if (looper.loops >= user.endLoops) {
    ended = true;
  }
  else {
    if (user.endStates.length) {
      ended = true;
      for (var i=0; i<user.endStates.length; i++) {
        if (cache.List[user.endStates[i]].length > 0) {
          ended = false;
        }
      }
    }
  }

  if (ended) {
    controlStop();
    if (user.autoHis) {
      callback.func = graphStateHistory;
      $('#modalgraph').modal();
    }
    else if (user.autoGraph) {
      callback.func = user.autoGraph;
      $('#modalgraph').modal();
    }
    return;
  }

  if (looper.ui) {
    looper.ui    = clearInterval(looper.ui);
    looper.timer = looper.delta;
    looper.ui    = setInterval("explore()",looper.timer);
  }
}

//}}}
//{{{  draw

function draw () {

  var c = glob.ctx;

  c.clearRect(0,0,glob.Width,glob.Height);

  //c.lineWidth = glob.perBorder;

  for (var i=0; i<glob.perN; i++) {
    var p = per[i];
    c.fillStyle     = p.Colour;
    c.strokeStyle   = p.Colour;
    c.fillRect(p.Left,p.Top,p.Size,p.Size);
  }

  if (user.trace) {
    for (var i=0; i<glob.perN; i++) {
      var p = per[i];
      if (p.R0.length) { //has infected somebody
        c.strokeStyle = '#444444';
        c.beginPath();
        for (var j=0; j<p.R0.length; j++) {
          var q = per[p.R0[j]];
          c.moveTo(p.Left+p.Size/2, p.Top+p.Size/2);
          c.lineTo(q.Left+q.Size/2, q.Top+q.Size/2);
        }
        c.stroke();
      }
    }
  }


  //glob.ctx.drawImage(glob.canvas2,0,0);
}

//}}}
//{{{  graph*

//{{{  graphStd

function graphStd (title,text,data,specs,x,y,sortData) {

  $('#modalgraphtitle').text(title);
  $('#modalgraphtext').html(text);

  $.jqplot('modalgraphplot',data,{
    cursor: {
      show: true,
      zoom: true,
      showTooltip: false
    },
    legend: {
      show: true
    },
    title: '',
    sortData: sortData,
    axes: {
      xaxis: {
        min:           0,
        labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
        label:         x,
        autoscale:     true
      },
      yaxis: {
        min:           0,
        labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
        label:         y,
        autoscale:     true
      }
    },
    series: specs
  }).replot();
}

//}}}

//{{{  graphStateHistory

function graphStateHistory () {

  var data = [];
  for (var state in states) {
    data.push(stats.His[state]);
  }

  var specs = [];
  for (var state in states) {
    var spec = {};
    spec.label       = states[state].Label;
    spec.shadowDepth = 0;
    spec.lineWidth   = 2;
    spec.color       = randX(states[state].Colour);
    spec.showLine    = true;
    spec.showMarker  = false;
    specs.push(spec);
  }

  graphStd('State history','',data,specs,'Iterations','People',true);
}


//}}}
//{{{  graphPhase

function graphPhase () {

  var phase = [[sState,eState],[sState,iState],[sState,rState],[eState,iState],[eState,rState],[iState,rState]];

  var data = [];
  for (var i=0; i<phase.length; i++) {
    var data2 = [];
    for (var k=0; k<stats.His[phase[i][0]].length; k++) {
      data2.push([stats.His[phase[i][0]][k],stats.His[phase[i][1]][k]]);
    }
    data.push(data2);
  }

  var specs = [];
  for (var i=0; i<phase.length; i++) {
    var spec = {};
    spec.label       = '' + phase[i][0] + phase[i][1];
    spec.label       = spec.label.toUpperCase();
    spec.shadowDepth = 0;
    spec.lineWidth   = 2;
    spec.showLine    = true;
    spec.showMarker  = false;
    specs.push(spec);
  }

  graphStd('Phase','',data,specs,'S1','S2',false);
}

//}}}
//{{{  graphR0

function graphR0 () {

  var text = '<p>Each x represents a person who has become infected (in E) at some point in the model.  \
The X axis is the iteration the person became infected. The Y axis is the number of people they infected; their individual reproduction number. \
<p>The two horizontal lines represent average individual reproduction numbers; one including and one excluding those with \
an individual reproduction number of 0.\
';

  var data = [];
  var tot  = 0;
  var tot0 = 0;
  var n0   = 0
  for (var i=0; i<glob.perN; i++) {
    if (per[i].When[iState]) {
      var r0 = per[i].R0.length;
      data.push([per[i].When[iState],r0]);
      tot += r0;
      if (r0 > 0) {
        n0++;
        tot0 += r0;
      }
    }
  }
  var ave  = tot  / data.length;
  var ave0 = tot0 / n0;

  var data2= [];
  var data3= [];
  for (var i=0; i<data.length; i++) {
    data2.push([data[i][0],ave]);
    data3.push([data[i][0],ave0]);
  }

  var specs = [];

  var spec = {};
  spec.label         = 'Individual';
  spec.shadowDepth   = 0;
  spec.lineWidth     = 1;
  spec.showLine      = false;
  spec.markerOptions = {size: 5, style: "x"};
  spec.showMarker    = true;
  specs.push(spec);

  var spec = {};
  spec.label       = 'Average';
  spec.shadowDepth = 0;
  spec.lineWidth   = 2;
  spec.showLine    = true;
  spec.showMarker  = false;
  specs.push(spec);

  var spec = {};
  spec.label       = 'Average (exc 0)';
  spec.shadowDepth = 0;
  spec.lineWidth   = 2;
  spec.showLine    = true;
  spec.showMarker  = false;
  specs.push(spec);

  graphStd('Reproduction numbers',text,[data,data2,data3],specs,'Iterations','Reproduction number',true);
}

//}}}

//}}}
//{{{  control*

//{{{  controlInit

function controlInit () {

  controlStop();

  looper.loops   = 0;
  looper.timer   = 100;
  looper.timeTot = 0;
  looper.timeAve = 0;

  glob.Width      = $(window).innerWidth();
  glob.Height     = $(window).innerHeight();
  glob.Area       = glob.Width * glob.Height;
  glob.minLeft    = 0;
  glob.minTop     = 50;
  glob.maxRight   = glob.Width - 1;
  glob.maxBottom  = glob.Height - 1;

  glob.minHW = glob.Width;
  if (glob.minHW > glob.Height)
    glob.minHW = glob.Height;

  glob.canvas        = document.getElementById("canvas");
  glob.canvas.width  = glob.Width;
  glob.canvas.height = glob.Height;
  glob.ctx           = canvas.getContext("2d");

  //glob.canvas2        = document.getElementById("canvas2");
  //glob.canvas2.width  = glob.Width;
  //glob.canvas2.height = glob.Height;
  //glob.ctx2           = canvas.getContext("2d");

  stats.His = {};
  for (var state in states)
    stats.His[state] = [];

  cache.List = {};
  for (var state in states)
    cache.List[state] = [];

  per = [];
  glob.perN = 0;

  init = [];

  eval($('#modaleditdefdef').val());

  for (var i=0; i<init.length; i++) {
    for (var j=0; j < randX(init[i].Pop); j++) {
      perCreate(init[i]);
    }
  }

  draw();

  navFeedback();
}

//}}}
//{{{  controlStop

function controlStop () {

  $('#start').text('Start');

  looper.ui = clearInterval(looper.ui);
}

//}}}
//{{{  controlStart

function controlStart () {

  if (looper.loops == 0)
    //controlInit() // catch early edits

  $('#start').text('Stop');

  looper.ui = setInterval("explore()",looper.timer);
}

//}}}
//{{{  controlStep

function controlStep () {
  explore();
}

//}}}

//}}}
//{{{  bootstrap helpers

function poptit(tit,id) {
   return '<button type="button" id="close" class="close pull-right" onclick="$(&quot;' + id + '&quot;).popover(&quot;hide&quot;);">&times;</button>' + '<div style="cursor: pointer;" onclick="$(&quot;' + id + '&quot;).popover(&quot;hide&quot;);" class="text-info"><strong>' + tit + '</strong></div>';
}

//}}}

function navFeedback () {
  $('#perf').html('<span title="iterations" class="label label-primary">' + looper.loops + '</span>&nbsp;<span title="average iteration time" class="label label-primary">' + looper.timeAve + 'ms</span>'); //must be before ended stuff
}

//}}}

$(function() {

  //{{{  handlers
  
  //{{{  graphs
  
  $('#graphstatehistory').click(function() {
    callback.func = graphStateHistory;
    $('#modalgraph').modal();
    return false;
  });
  
  $('#graphphase').click(function() {
    callback.func = graphPhase;
    $('#modalgraph').modal();
    return false;
  });
  
  $('#graphr0').click(function() {
    callback.func = graphR0;
    $('#modalgraph').modal();
    return false;
  });
  
  
  $('#modalgraph').on('shown.bs.modal', function () {
    callback.func();
  })
  
  //}}}
  //{{{  edit
  
  $('#editdesc').click(function() {
    $('#modaleditdesc').modal();
    return false;
  });
  
  $('#editdef').click(function() {
    $('#modaleditdef').modal();
    return false;
  });
  
  $('#modaledit').on('shown.bs.modal', function () {
  })
  
  //}}}
  
  $('#trace').click(function() {
    user.trace = !user.trace;
    if (user.trace)
      $('#trace').html('Trace=On');
    else
      $('#trace').html('Trace=Off');
  });
  
  $('#desc').click(function() {
    $('#modalhtml').modal();
    return false;
  });
  
  $('#modalhtml').on('shown.bs.modal', function () {
    $('#modalhtmltitle').html($('#modaleditdesctitle').val());
    $('#modalhtmltext').html($('#modaleditdescdesc').val());
  })
  
  $('#start').click(function() {
    if (!looper.ui)
      controlStart();
    else
      controlStop();
    return false;
  });
  
  $('#reset').click(function() {
    if (!looper.ui)
      controlInit();
    else
      confirm('Stop the scenario first');
    return false;
  });
  
  $('#step').click(function() {
    if (!looper.ui)
      controlStep();
    else
      confirm('Stop the scenario first');
    return false;
  });
  
  //}}}

  $.jqplot.config.enablePlugins = true;

  looper.ui  = 0;
  user.trace = false;  //matches ui

  controlInit();

  if (user.autoDesc)
    $('#modalhtml').modal();

  if (user.trace)
    $('#trace').html('Trace=On');
  else
    $('#trace').html('Trace=Off');

  if (user.autoStart) {
    if (!looper.ui)
      controlStart();
  }

});

