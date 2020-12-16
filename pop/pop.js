
var maxpop = 250000;

var popslider     = null;
var rateslider    = null;
var vratslider    = null;
var uratslider    = null;
//var vaxedslider   = null;
//var unvaxedslider = null;
var nvslider      = null;
var nuslider      = null;
var effslider     = null;

var pop     = 0; //control
var rate    = 0;
var nv      = 0;
var nu      = 0;

var vaxed   = 0; //results
var unvaxed = 0;
var vrat    = 0;
var urat    = 0;
var eff     = 0;

function updateui() {

  var xwarn = 0;
  warn('');

  vaxed   = Math.round(pop * rate / 100.0);
  unvaxed = pop - vaxed;

  if (nv > vaxed) {
    xwarn = 1;
    warn('Infected vaccinated greated than number vaccinated.');
  }

  if (!xwarn && nu > unvaxed) {
    xwarn = 1;
    warn('Infected unvaccinated greated than number unvaccinated.');
  }

  if (!xwarn && nv + nu > pop) {
    xwarn = 1;
    warn('Infections greater than population.');
  }

  if (vaxed)
    vrat = (nv / vaxed) * 100.0;
  else
    vrat = 0;

  if (unvaxed)
    urat = (nu / unvaxed) * 100.0;
  else
    urat = 0;

  if (urat <= vrat)
    eff = 0;
  else
    eff = (1.0 - (vrat/urat)) * 100.0;

  vrat = Math.round(vrat*1000.)/1000.0;
  urat = Math.round(urat*1000.)/1000.0;
  eff  = Math.round(eff*1000.)/1000.0;

  if (!xwarn && eff <= 0) {
    xwarn = 1;
    warn('The vaccine is not effective.');
  }

  if (!xwarn && nv > nu && vrat < urat && eff > 0.0)
    $('#good').show();
  else if (!xwarn && eff > 0.0)
    $('#good2').show();

  maxanno(popslider,'pop',maxpop,maxpop);
  //maxanno(vaxedslider,'vaxed',pop);
  //maxanno(unvaxedslider,'unvaxed',pop);
  maxanno(nvslider,'nv',vaxed,pop);
  maxanno(nuslider,'nu',unvaxed,pop);

  valanno(popslider,'pop',pop,'');
  valanno(rateslider,'rate',rate,'%');
  valanno(vratslider,'vrat',vrat,'%');
  valanno(uratslider,'urat',urat,'%');
  //valanno(vaxedslider,'vaxed',vaxed,'');
  //valanno(unvaxedslider,'unvaxed',unvaxed,'');
  valanno(nvslider,'nv',nv,'');
  valanno(nuslider,'nu',nu,'');
  valanno(effslider,'eff',eff,'%');
}

function warn(s) {
  $('#good').hide();
  $('#good2').hide();
  $('#warn').hide();
  if (s) {
    $('#warn').show();
    $('#warn').text(s);
  }
}

function maxanno(slider,id,v,range) {
  $('#'+id+'max').text(v);
  slider.slider("option","max",range);
}

function valanno (slider,id,v,suff) {
  $('#'+id+'val').text(' = ' + v + suff);
  slider.slider("option","value",v);
}

$(function() {

  pop     = parseInt($('#a_pop').val());
  rate    = parseInt($('#a_rate').val());
  nv      = parseInt($('#a_nv').val());
  nu      = parseInt($('#a_nu').val());

  //control

  popslider = $("#pop").slider({
    range: "min",
    min: 0,
    max: maxpop,
    value: pop,
    slide: function( event, ui ) {
      pop = parseInt(ui.value);
      updateui();
    }
  });

  rateslider = $("#rate").slider({
    range: "min",
    min: 0,
    max: 100,
    value: rate,
    slide: function( event, ui ) {
      rate = parseInt(ui.value);
      updateui();
    }
  });

  nvslider = $("#nv").slider({
    range: "min",
    min: 0,
    max: pop,
    value: nv,
    slide: function( event, ui ) {
      nv = parseInt(ui.value);
      updateui();
    }
  });

  nuslider = $("#nu").slider({
    range: "min",
    min: 0,
    max: pop,
    value: nu,
    slide: function( event, ui ) {
      nu = parseInt(ui.value);
      updateui();
    }
  });


  //results

  //vaxedslider = $("#vaxed").slider({
  //  range: "min",
  //  min: 0,
  //  max: 0,
  //  value: 0,
  //});
  //vaxedslider.slider("disable");

  //unvaxedslider = $("#unvaxed").slider({
  //  range: "min",
  //  min: 0,
  //  max: 0,
  //  value: 0,
  //});
  //unvaxedslider.slider("disable");

  vratslider = $("#vrat").slider({
    range: "min",
    min: 0,
    max: 100,
    value: vrat
  });
  //vratslider.slider("disable");

  uratslider = $("#urat").slider({
    range: "min",
    min: 0,
    max: 100,
    value: urat
  });
  //uratslider.slider("disable");

  effslider = $("#eff").slider({
    range: "min",
    min: 0,
    max: 100,
    value: 0
  });
  //effslider.slider("disable");

  $('#getlink').button({
  });
  $('#getlink').click(function() {
    window.location = 'http://op12no2.me/toys/pop.php?pop=' + pop + '&rate=' + rate + '&nv=' + nv + '&nu=' + nu + '&txt=' + $('#gettext').val();
  });
  $('#reset').button({
  });
  $('#reset').click(function() {
    window.location = 'http://op12no2.me/toys/pop.php';
  });


  updateui();
});

