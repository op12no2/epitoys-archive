<?php
//{{{  fold marker

//}}}

//include('../phplib.php');

//{{{  functions

//{{{  incJS

function incJS($js,$ie=0) {
  if (!$ie)
    echo("<script type=\"text/javascript\" src=\"$js\"></script>\n");
  else
    echo("<!--[if lt IE 9]><script type=\"text/javascript\" src=\"$js\"></script><![endif]-->\n");
}

//}}}

//}}}
//{{{  get args

if (isset($_REQUEST['nobox']))
  $a_nobox = $_REQUEST['nobox'];
else
  $a_nobox = 'no';

if (isset($_REQUEST['pop']))
  $a_pop = $_REQUEST['pop'];
else
  $a_pop = 1000;

if (isset($_REQUEST['rate']))
  $a_rate = $_REQUEST['rate'];
else
  $a_rate = 95;

if (isset($_REQUEST['nv']))
  $a_nv = $_REQUEST['nv'];
else
  $a_nv = 80;

if (isset($_REQUEST['nu']))
  $a_nu = $_REQUEST['nu'];
else
  $a_nu = 40;

if (isset($_REQUEST['txt'])) {
  $a_txt = $_REQUEST['txt'];
  if (!$a_txt)
    $a_txt = 'x';
}
else
  $a_txt = '';

//}}}

$t_title = 'Number versus Percentage of Infections';

echo("<!DOCTYPE html>\n");
echo("<html>\n");
echo("<head>\n");
//{{{  meta

echo("<meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge,chrome=1\" />\n");

echo("<title>$t_title</title>\n");

//}}}
//{{{  css

echo("<link rel=\"stylesheet\" type=\"text/css\" media=\"screen\" href=\"../assets/jquery-ui/css/start/jquery-ui-1.8.13.custom.css\" />\n");

echo("<style>\n");

//l_disqus_style();
echo("body      {margin: 0px 0px 0px 0px; font-size: 80%; font-family: arial, \"sans serif\";}\n");
echo("img       {border: 0;}\n");
echo("#flags    {margin-top: 5px; float: right;}\n");
echo("#logo     {margin-top: 5px;}\n");
echo("#contain  {margin: 10px auto 10px auto; width: 700px;}\n");
echo("#banner   {text-align: center; clear: both; font-size: 12pt; margin: 20px 0px 0px 0px; padding: 10px 0px 10px 0px; }\n");
echo("#warn     {padding: 20px; margin: 20px 0px 0px 0px; background-color: #ff4444; text-align: center; font-size: 12pt; font-weight: bold; color: white;}\n");
echo("#good     {padding: 20px; margin: 20px 0px 0px 0px; background-color: #448844; text-align: center; font-size: 12pt; font-weight: bold; color: white;}\n");
echo("#good2    {padding: 20px; margin: 20px 0px 0px 0px; background-color: #448844; text-align: center; font-size: 12pt; font-weight: bold; color: white;}\n");
echo("#foot     {margin: 60px 0px 0px 0px;}\n");
echo("#explain  {margin-bottom: 30px; padding: 15px; border: 2px solid #808080;}\n");
echo("#user     {margin-top: 30px;}\n");

//echo(".header   {margin: 25px 0px 0px 0px; padding: 0px; font-weight: bold;}\n");
echo(".anno     {margin: 15px 0px 3px 0px; padding: 0px; }\n");
echo(".valanno  {}\n");
echo(".maxanno  {font-size: 8pt; color: #aaaacc; float: right;}\n");
echo(".txtanno  {}\n");
echo(".percent  {width: 500px;}\n");
echo(".vaxer   .ui-slider-range  {background: #448844;}\n");
echo(".vaxer   .ui-slider-handle {border-color: #448844;}\n");
echo(".unvaxer .ui-slider-range  {background: #ff4444;}\n");
echo(".unvaxer .ui-slider-handle {border-color: #ff4444;}\n");
echo(".ro      .ui-slider-handle {display: none;}\n");

$linkBlue = "#6666cc";

echo("a          {text-decoration: none;      color: $linkBlue;}\n");
echo("a:link     {text-decoration: none;      color: $linkBlue;}\n");
echo("a:visited  {text-decoration: none;      color: $linkBlue;}\n");
echo("a:active   {text-decoration: underline; color: $linkBlue;}\n");
echo("a:hover    {text-decoration: underline; color: $linkBlue;}\n");

echo("</style>\n");

//}}}
//{{{  js

incJS ("../assets/jquery-ui/js/jquery-1.5.1.min.js");
incJS ("../assets/jquery-ui/js/jquery-ui-1.8.13.custom.min.js");
incJS ("pop.js");

//}}}
echo("</head>\n");
echo("<body>\n");
//l_contact();
//{{{  body

function slider($txt,$id,$cla) {
  $idmax = $id . 'max';
  $idval = $id . 'val';
  echo("<div class=\"anno $cla\">\n");
  echo("<span class=\"maxanno\" id=\"$idmax\"></span>\n");
  echo("<span class=\"txtanno\">$txt</span>\n");
  echo("<span class=\"valanno\" id=\"$idval\"></span>\n");
  echo("</div>\n");
  echo("<div class=\"slider $cla\" id=\"$id\"></div>\n");
}

echo("<div id=\"contain\">\n");

echo("<div id=\"banner\" class=\"ui-corner-all ui-widget\">\n");
echo("<b>$t_title</b>\n");
echo("</div>\n");

if ($a_txt != 'x') {
  echo("<div id=\"explain\" class=\"ui-corner-all\">\n");
  if ($a_txt)
    echo("$a_txt\n");
  else {
    echo("It is often argued that because the number of infections is greater in the vaccinated\n");
    echo("fraction of a population, compared to the unvaccinated fraction, the corresponding vaccine is not effective.  But this is a simple logical error.\n");
    echo("The point being that while the <i>number</i> of infections in the vaccinated can be greater, because of a high vaccinate rate,\n");
    echo("the <i>percentage</i> will be lower unless the vaccine really is ineffective.<p>Another way to think about it, is to consider that a small percentage of a large fraction of a population can easily be greater than a large percentage of a small fraction of a population.\n");
    echo("<p>In the default scenario, the number of infections in the vaccinated is twice that of the unvaccinated, but the vaccine is still 90% effective; i.e. it reduces infections by 90%.\n");
    echo("<p>Use the sliders to set up your own scenario.  Use the \"Get Link\" button to get a URL to your scenario.\n");
  }
  echo("</div>\n");
}

slider("Number of people in population",'pop','');
slider("Background vaccination rate",'rate','percent');
slider("Number of people infected who are vaccinated",'nv','vaxer');
slider("Number of people infected who are unvaccinated",'nu','unvaxer');

echo("<div class=\"ui-corner-all\" id=\"warn\">\n");
echo("</div>\n");

echo("<div class=\"ui-corner-all\" id=\"good\">\n");
echo("The NUMBER of infections is greater in the vaccinated<br>but the PERCENTAGE of infections is lower<br>and the vaccine is effective.\n");
echo("</div>\n");

echo("<div class=\"ui-corner-all\" id=\"good2\">\n");
echo("The vaccine is effective.\n");
echo("</div>\n");

//slider("vaccinated population",'vaxed','');
//slider("unvaccinated population",'unvaxed','');
slider("Percentage of those vaccinated who are infected",'vrat','vaxer percent ro');
slider("Percentage of those unvaccinated who are infected",'urat','unvaxer percent ro');
slider("Vaccine effectiveness",'eff','percent ro');

if ($a_txt)
  $boxt = $a_txt;
else
  $boxt = "Describe your scenario here.  It replaces the standard text at the top of the page.  Use just a single x character to display no text at all.  You can add &nobox=yes to your URL to hide this box and the buttons below.";

if ($a_nobox == 'no') {
  echo("<div id=\"user\">\n");
  echo("<p><textarea class=\"ui-corner-all\" cols=85 rows=5 id=\"gettext\">$boxt</textarea>\n");
  echo("<p><button title=\"this will reload the page with the relevant url - copy the url to link to your scenario\" id=\"getlink\">Get Link</button>&nbsp;<button title=\"reset to the default scenario\" id=\"reset\">Reset</button></p>\n");
  echo("</div>\n");
}

//l_comments('pop');

echo("</div>\n");

//}}}
//{{{  hidden args got JS

echo("<input id=\"a_pop\"  type=\"hidden\" value=\"$a_pop\">\n");
echo("<input id=\"a_rate\" type=\"hidden\" value=\"$a_rate\">\n");
echo("<input id=\"a_nv\"   type=\"hidden\" value=\"$a_nv\">\n");
echo("<input id=\"a_nu\"   type=\"hidden\" value=\"$a_nu\">\n");
echo("<input id=\"a_txt\"  type=\"hidden\" value=\"$a_txt\">\n");

//}}}
echo("</body>\n");
echo("</html>\n");

?>

