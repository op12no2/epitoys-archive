//{{{  fold marker

//}}}

//{{{  globals

  var gNew     = 0.0;

  var gt       = 0.0;
  var gs0      = 0.0;
  var gi0      = 0.0;

  var gs       = 0.0;
  var gi       = 0.0;
  var gr       = 0.0;

  var gs1      = 0.0;
  var gi1      = 0.0;
  var gr1      = 0.0;

  var gsp      = [];
  var gip      = [];
  var grp      = [];
  var gcp      = [];  //incidence
  var gnp      = [];  //effecctive repro number
  var gpp      = [];  //phase

  var gc       = 0.0;
  var gk       = 0.0;
  var gv       = 0.0;
  var gw       = 0.0;
  var gb       = 0.0;

  var ga       = '';
  var gz       = 0;

  var gplotr   = '';
  var gplotx   = '';

  var or0      = 0.0;
  var ose      = 0.0;
  var oh       = 0.0;

//}}}
//{{{  funcs

//{{{  get

function get() {

  gt     = parseFloat($('#t').val());
  gs0    = parseFloat($('#s0').val());
  gi0    = parseFloat($('#i0').val());
  gz     = parseFloat($('#z').val());

  eval('gc=' + $('#c').val());
  eval('gk=' + $('#k').val());
  eval('gv=' + $('#v').val());
  eval('gw=' + $('#w').val());
  eval('gb=' + $('#b').val());

  ga     = $('#a').val();
  gplotr = $('#plotr').val();
  gplotx = $('#plotx').val();

  if (!ga) {
    if (gplotr == 'y')
      ga = "S + I + R";
    else
      ga = "S + I";
  }

}

//}}}
//{{{  calc_out

function calc_out() {

  var ic = v(gc,0);
  var ik = v(gk,0);
  var ib = v(gb,0);

  or0 = R0(ic,ik,ib);
  ose = gt / or0;
  oh  = 1.0 - 1 / or0;

  $('#or0').val(dp(or0,3));
  $('#ose').val(dp(ose,3))
  $('#oh').val(dp(oh,3))

}

//}}}
//{{{  plot

function plot() {

  var hack = '1,';

  get();
  calc_out();

  gs = gs0;
  gi = gi0;
  gr = gt - gs0 - gi0

  var gsf = gs/gt; //fraction susceptible

  var ic = v(gc,0);
  var ik = v(gk,0);
  var ib = v(gb,0);
  var iv = v(gv,0);
  var iw = v(gw,0);

  gsp.push([0,gs]);
  gip.push([0,gi]);
  grp.push([0,gr]);
  gcp.push([0,0]);
  gnp.push([0,gsf*R0(ic,ik,ib)]);
  gpp.push([gs/gt,gi/gt]);

  for (var i=1; i<gz; i++) {

    ic = v(gc,i);
    ik = v(gk,i);
    ib = v(gb,i);
    iv = v(gv,i);
    iw = v(gw,i);

    gsf = gs/gt;

    var infected = ic*gsf*gi;

    gs1 = gs - infected              - gs*ib   + gt*ib   - gt*ib*iv + iw*gi;

    gi1 = gi + infected    - ik*gi   - gi*ib;

    gr1 = gr               + ik*gi   - gr*ib             + gt*ib*iv - iw*gi;

    gNew += infected;
    hack += infected + ',';

    if (i % (Math.floor(gz/1000)+1) == 0) {
      gcp.push([i,infected]);
      gnp.push([i,gsf*R0(ic,ik,ib)]);
      gsp.push([i,gs1]);
      gip.push([i,gi1]);
      grp.push([i,gr1]);
    }
    gpp.push([gs1/gt,gi1/gt]);

    gs = gs1;
    gi = gi1;
    gr = gr1;

  }

  //console.log(hack);

  var tit = ga;

  $.jqplot.config.enablePlugins = true;

  if (gplotr == 'y')
    var plotlist = [gsp,gip,grp];
  else
    var plotlist = [gsp,gip];

  if (gplotx == 'y')
    var plotpoints = true;
  else
    var plotpoints = false;

  $.jqplot('herd',plotlist,{
    legend: {show:true},
    title: tit,
    axes:{
      xaxis:{
        min: 0,
        labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
        label: 'iterations',
        autoscale: true
      },
      yaxis:{
        min: 0,
        labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
        label:'people',
        autoscale: true
      }
    },
    highlighter: {sizeAdjust: 7.5},
    cursor: {tooltipLocation:'sw',zoom:true},
    series: [
        {label:'susceptible',  color: 'blue',  shadowDepth: 0, lineWidth: 1, showLine:true, showMarker:plotpoints},
        {label:'infected',     color: 'red',   shadowDepth: 0, lineWidth: 1, showLine:true, showMarker:plotpoints},
        {label:'recovered',    color: 'green', shadowDepth: 0, lineWidth: 1, showLine:true, showMarker:plotpoints}
    ]
  });

  if (ga == 'SIR')
    gip[0][1]=2000000;

  $.jqplot('case',[gip],{
    legend: {show:true},
    title: 'prevalence',
    axes:{
      xaxis:{
        min: 0,
        labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
        label: 'iterations',
        autoscale: true
      },
      yaxis:{
        min: 0,
        labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
        label:'cases',
        autoscale: true
      }
    },
    highlighter: {sizeAdjust: 7.5},
    cursor: {tooltipLocation:'sw',zoom:true},
    series: [
        {label:'infections',  color: 'red', shadowDepth: 2, lineWidth: 1, showLine:true, showMarker:plotpoints}
    ]
  });

  $.jqplot('inci',[gcp],{
    legend: {show:true},
    title: 'incidence',
    axes:{
      xaxis:{
        min: 0,
        labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
        label: 'iterations',
        autoscale: true
      },
      yaxis:{
        labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
        label:'new cases',
        autoscale: true
      }
    },
    highlighter: {sizeAdjust: 7.5},
    cursor: {tooltipLocation:'sw',zoom:true},
    series: [
        {label:'incidence',  color: 'black', shadowDepth: 0, lineWidth: 1, showLine:true, showMarker:plotpoints}
    ]
  });

  $.jqplot('phase',[gpp],{
    legend: {show:true},
    title: 'phase',
    sortData: false,
    axes:{
      xaxis:{
        min: 0,
        labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
        label: 'susceptibles',
        autoscale: true
      },
      yaxis:{
        labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
        label:'infected',
        autoscale: true
      }
    },
    highlighter: {sizeAdjust: 7.5},
    cursor: {tooltipLocation:'sw',zoom:true},
    series: [
        {label:'phase',  color: '#444444', shadowDepth: 0, lineWidth: 1, showLine:true, showMarker:plotpoints}
    ]
  });

  $.jqplot('rrn',[gnp],{
    legend: {show:true},
    title: 'effective reproduction number',
    axes:{
      xaxis:{
        min: 0,
        labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
        label: 'iterations',
        autoscale: true
      },
      yaxis:{
        labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
        label:'',
        autoscale: true
      }
    },
    highlighter: {sizeAdjust: 7.5},
    cursor: {tooltipLocation:'sw',zoom:true},
    series: [
        {label:'Re',  color: '#666699', shadowDepth: 0, lineWidth: 1, showLine:true, showMarker:plotpoints}
    ]
  });


  //var tab = '<tr><th>' + 'i' + '</th><th>' + 's' + '</th><th>' + 'i' + '</th><th>' + 'r' + '</th></tr>';
  //for (var i=0; i<gz; i++) {
  //  var row = '<tr><td>' + i + '</td><td>' + dp(gsp[i][1],5) + '</td><td>' + dp(gip[i][1],5) + '</td><td>' + dp(grp[i][1],5) + '</td></tr>';
  //  tab = tab + row;
  //}
  //$('#tab').html(tab);

  $('#gnew').text(Math.round(gNew));


}

//}}}
//{{{  dp

function dp (x,n) {
  return Math.round(x*Math.pow(10,n))/Math.pow(10,n);
}

//}}}
//{{{  v

function v (o,iter) {

  if (typeof o == "number") {
    return o;
  }

  if (typeof o == "string") {
    return parseFloat(o);
  }

  if (typeof o == "function") {
    return o(iter);
  }

  //console.log('no ' + ' value at ' + iter);
  return 0.0;
}

//}}}
//{{{  R0

function R0 (c,k,b) {
  return c / (k + b);
}

//}}}

//}}}

$(function() {

  $('input,select').blur(function() {
    get();
    calc_out();
  });

  plot();

  $('#go').button({
    icons: {
      primary: 'ui-icon-play'
    }
  });

  $('#go').click(function() {

    get();

    var args = '';
    args = args + '?t='  + encodeURIComponent($('#t').val());
    args = args + '&s0=' + encodeURIComponent($('#s0').val());
    args = args + '&i0=' + encodeURIComponent($('#i0').val());
    args = args + '&c='  + encodeURIComponent($('#c').val());
    args = args + '&k='  + encodeURIComponent($('#k').val());
    args = args + '&v='  + encodeURIComponent($('#v').val());
    args = args + '&w='  + encodeURIComponent($('#w').val());
    args = args + '&b='  + encodeURIComponent($('#b').val());
    args = args + '&z='  + encodeURIComponent($('#z').val());
    args = args + '&a='  + encodeURIComponent($('#a').val());

    if ($('#plotr').is(':checked'))
      args = args + '&plotr=y';
    else
      args = args + '&plotr=n';

    if ($('#plotx').is(':checked'))
      args = args + '&plotx=y';
    else
      args = args + '&plotx=n';

    window.location = 'index.php' + args;
    return false;
  });

});



