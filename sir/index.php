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

$t     = 1000;
$s0    = 999;
$i0    = 1;
$c     = 0.5;
$k     = 0.1;
$b     = 0.0;
$v     = 0.0;
$w     = 0.0;
$a     = '';
$z     = 100;
$plotr = 'y';
$plotx = 'n';
$desc  = "";

if (isset($_REQUEST['a']))
  $a = $_REQUEST['a'];
if (isset($_REQUEST['t']))
  $t = $_REQUEST['t'];
if (isset($_REQUEST['s0']))
  $s0 = $_REQUEST['s0'];
if (isset($_REQUEST['i0']))
  $i0 = $_REQUEST['i0'];
if (isset($_REQUEST['k']))
  $k = $_REQUEST['k'];
if (isset($_REQUEST['v']))
  $v = $_REQUEST['v'];
if (isset($_REQUEST['w']))
  $w = $_REQUEST['w'];
if (isset($_REQUEST['c']))
  $c = $_REQUEST['c'];
if (isset($_REQUEST['b']))
  $b = $_REQUEST['b'];
if (isset($_REQUEST['z']))
  $z = $_REQUEST['z'];

if (isset($_REQUEST['plotr']))
  $plotr = $_REQUEST['plotr'];

if (isset($_REQUEST['plotx']))
  $plotx = $_REQUEST['plotx'];

if ($plotr != 'n') $plotr = 'y';
if ($plotx != 'n') $plotx = 'y';

//}}}
//{{{  load scenario

$scenario = '';

if (isset($_REQUEST['scenario'])) {
  $scenario = $_REQUEST['scenario'];
  include("scenarios/$scenario");
}

//}}}

echo("<!DOCTYPE html>\n");
echo("<html>\n");
echo("<head>\n");

//{{{  meta

echo("<meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge,chrome=1\" />\n");

echo("<title>sir infection model</title>\n");

echo("<meta http-equiv=\"content-type\" content=\"text/html; charset=UTF-8\" />\n");
echo("<meta name=\"title\"       content=\"sir infection model\" />\n");
echo("<meta name=\"description\" content=\"epidemic and endemic sir infection model vaccination\" />\n");
echo("<meta name=\"keywords\"    content=\"sir model, vaccination, infection model, epidemic, endemic, measles\" />\n");

//}}}
//{{{  css

echo("<link rel=\"stylesheet\" type=\"text/css\" media=\"screen\" href=\"../assets/jquery-ui/css/start/jquery-ui-1.8.13.custom.css\" />\n");
echo("<link rel=\"stylesheet\" type=\"text/css\" media=\"screen\" href=\"../assets/jqplot/jquery.jqplot.css\" />\n");

echo("<style>\n");

//l_disqus_style();
echo("#disqus_thread {max-width: 700px;}\n");

echo("body        {margin: 0 0 0 1em; font-size: 1.0em; font-family: sans-serif;}\n");
echo(".ui-widget  {font-size: 0.8em;}\n");
echo("hr          {padding: 0; margin: 10px 0px 10px 0px; border: 0; height: 1px; background-color: #dddddd; color: #dddddd;}\n");

echo ("table {border-collapse: collapse; margin: 0;}\n");
echo ("td,th {margin: 0; padding: 0.5em; border: 1px solid #dddddd;}\n");

echo("#banner  {margin: 0.5em;}\n");
echo("#desc    {margin: 0.5em; color: #666666;}\n");
echo("label    {width: 3em; float: left;}\n");
echo("#control {float: left; margin: 0.5em;}\n");
echo("#disp    {float: left; margin: 0.5em;}\n");
echo("#herd    {float: left; margin: 0.5em;}\n");
echo("#case    {float: left; margin: 0.5em;}\n");
echo("#inci    {float: left; margin: 0.5em;}\n");
echo("#rrn     {float: left; margin: 0.5em;}\n");
echo("#phase   {float: left; margin: 0.5em;}\n");
echo("#tab     {float: left; margin: 0.5em;}\n");

echo("</style>\n");

//}}}
//{{{  js

incJS ("../assets/jquery-ui/js/jquery-1.5.1.min.js");
incJS ("../assets/jquery-ui/js/jquery-ui-1.8.13.custom.min.js");
incJS ("../assets/jqplot/excanvas.js",1);
incJS ("../assets/jqplot/jquery.jqplot.min.js");
incJS ("../assets/jqplot/plugins/jqplot.dateAxisRenderer.min.js");
incJS ("../assets/jqplot/plugins/jqplot.canvasTextRenderer.min.js");
incJS ("../assets/jqplot/plugins/jqplot.canvasAxisTickRenderer.min.js");
incJS ("../assets/jqplot/plugins/jqplot.canvasAxisLabelRenderer.min.js");
incJS ("../assets/jqplot/plugins/jqplot.highlighter.min.js");
incJS ("../assets/jqplot/plugins/jqplot.cursor.min.js");
incJS ("sir.js");

//}}}

echo("</head>\n");
echo("<body>\n");

//l_contact();

//{{{  banner

echo("<div class=\"ui-widget\" id=\"banner\">\n");

echo("<a title=\"home\" href=\"http://op12no2.me\"><b>Home</b></a> | ");
echo("<a title=\"reset to defaults\" href=\"http://op12no2.me/toys/sir\"><b>Reset</b></a>");
//echo(" | <a href=\"https://plus.google.com/u/0/116152397191796971056/posts/izwUbLQSbhN\">documentation, feedback and comments</a>\n");

echo("</div>\n");

echo("<div class=\"ui-widget\" id=\"desc\">\n");

echo("<hr>\n");
echo("scenarios\n");
if ($handle = opendir('scenarios')) {
  while (false !== ($entry = readdir($handle))) {
    if ($entry != "." && $entry != "..") {
      echo("|\n");
      echo("<a href=\"http://op12no2.me/toys/sir?scenario=$entry\">$entry</a>\n");
    }
  }
}
closedir($handle);
echo("<hr>\n");

if ($scenario) {
  echo("$scenario: $desc\n");
  echo("<hr>\n");
}

echo("</div>\n");

//}}}
//{{{  control

echo("<div class=\"ui-widget\" id=\"control\">\n");

$size=7;

echo("<b>INPUTS</b><br><br>\n");

echo("<label for=\"#t\">t</label><input id=\"t\"  value=\"$t\"  size=$size type=\"input\" class=\"ui-widget-content ui-corner-all\" title=\"total population size (fixed)\"/><br>\n");
echo("<label for=\"#s0\">s0</label><input id=\"s0\" value=\"$s0\" size=$size type=\"input\" class=\"ui-widget-content ui-corner-all\" title=\"initial number of susceptibles\"/><br>\n");
echo("<label for=\"#i0\">i0</label><input id=\"i0\" value=\"$i0\" size=$size type=\"input\" class=\"ui-widget-content ui-corner-all\" title=\"initial number of infected\"/><br>\n");
echo("<label for=\"#c\">c</label><input id=\"c\"  value=\"$c\"  size=$size type=\"input\" class=\"ui-widget-content ui-corner-all\"/ title=\"contact rate\"><br>\n");
echo("<label for=\"#k\">k</label><input id=\"k\"  value=\"$k\"  size=$size type=\"input\" class=\"ui-widget-content ui-corner-all\"/ title=\"recovery rate\"><br>\n");
echo("<label for=\"#b\">b</label><input id=\"b\"  value=\"$b\"  size=$size type=\"input\" class=\"ui-widget-content ui-corner-all\"/ title=\"birth rate\"><br>\n");
echo("<label for=\"#v\">v</label><input id=\"v\"  value=\"$v\"  size=$size type=\"input\" class=\"ui-widget-content ui-corner-all\"/ title=\"vaccination rate\"><br>\n");
echo("<label for=\"#w\">w</label><input id=\"w\"  value=\"$w\"  size=$size type=\"input\" class=\"ui-widget-content ui-corner-all\"/ title=\"waning rate\"><br>\n");
echo("<label for=\"#z\">z</label><input id=\"z\"  value=\"$z\"  size=$size type=\"input\" class=\"ui-widget-content ui-corner-all\"/ title=\"number of iterations to run model\"><br>\n");
echo("<label for=\"#a\">a</label><input id=\"a\"  value=\"$a\"  size=$size type=\"input\" class=\"ui-widget-content ui-corner-all\"/ title=\"first graph annotation\"><br>\n");

echo("<br>\n");

$sel = '';
if ($plotr == 'y')
  $sel = "checked=\"checked\"";
echo("<label for=\"#plotr\"></label><input $sel id=\"plotr\" value=\"$plotr\" type=\"checkbox\" class=\"ui-widget-content ui-corner-all\"/ title=\"plot R on first graph\"> plot R<br>\n");

$sel = '';
if ($plotx == 'y')
  $sel = "checked=\"checked\"";
echo("<label for=\"#plotx\"></label><input $sel id=\"plotx\" value=\"$plotx\" type=\"checkbox\" class=\"ui-widget-content ui-corner-all\"/ title=\"mark data points on graphs - useful when you are going to zoom in\"> mark data\n");

echo("<br>\n");

echo("<button title=\"nb: click and drag graphs to zoom, reset zoom with double-click on graph\" id=\"go\">Plot</button>\n");

echo("<br><br><br><b>OUTPUTS</b><br><br>\n");

echo("<label for=\"#or0\">R0</label><input readonly=readonly id=\"or0\" value=\"\" size=$size type=\"input\" class=\"ui-widget-content ui-corner-all\" title=\"basic reproduction number\"/><br>\n");
echo("<label for=\"#ose\">Se</sub></label><input readonly=readonly id=\"ose\" value=\"\" size=$size type=\"input\" class=\"ui-widget-content ui-corner-all\" title=\"epidemic threshold of susceptibles\"/><br>\n");
echo("<label for=\"#oh\">H</sub></label><input readonly=readonly id=\"oh\" value=\"\" size=$size type=\"input\" class=\"ui-widget-content ui-corner-all\" title=\"herd immunity threshold for vaccination\"/><br>\n");

echo("<br><br>Total cases<br><span id=\"gnew\"></span>\n");

echo("</div>\n");

//}}}

echo("<div class=\"ui-widget\" id=\"herd\"></div>\n");
echo("<div class=\"ui-widget\" id=\"case\"></div>\n");
echo("<div class=\"ui-widget\" id=\"inci\"></div>\n");
echo("<div class=\"ui-widget\" id=\"phase\"></div>\n");
echo("<div class=\"ui-widget\" id=\"rrn\"></div>\n");
echo("<div class=\"ui-widget\" id=\"tab\"></div>\n");

//l_comments('sir');

echo("</body>\n");
echo("</html>\n");

