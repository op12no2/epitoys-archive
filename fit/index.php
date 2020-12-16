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

$inp = "";
$inp = $inp . "data : [10,14,28,25,33,33,55,68,-1,-1,-1,-1,81,68,63,40,39,21,15,11],\n";
$inp = $inp . "frequency : 'days',\n";
$inp = $inp . "type : 'incidence',\n";
$inp = $inp . "solutions : 100000,\n";
$inp = $inp . "match : leastSquares,\n";
$inp = $inp . "offset : function () {return randi(0,20);},\n";
$inp = $inp . "model : SIR2,\n";
$inp = $inp . "length : 65,\n";
$inp = $inp . "modelData : {\n";
$inp = $inp . "  t : 1000,\n";
$inp = $inp . "  s : 999,\n";
$inp = $inp . "  i : 1,\n";
$inp = $inp . "  r0: function () {return rand(1,20);},\n";
$inp = $inp . "  k : 0.1,\n";
$inp = $inp . "},\n";
$inp = $inp . "end : 0";

if (isset($_REQUEST['p'])) {
  $inp = $_REQUEST['p'];
  //echo($inp);
}

//}}}

echo("<!DOCTYPE html>\n");
echo("<html>\n");
echo("<head>\n");

//{{{  meta

echo("<meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge,chrome=1\" />\n");

echo("<title>epidemic curve fit</title>\n");

echo("<meta http-equiv=\"content-type\" content=\"text/html; charset=UTF-8\" />\n");
echo("<meta name=\"title\"       content=\"epidemic curve fit\" />\n");
echo("<meta name=\"description\" content=\"epidemic and endemic sir infection model vaccination\" />\n");
echo("<meta name=\"keywords\"    content=\"sir model, vaccination, infection model, epidemic, endemic, measles\" />\n");

//}}}
//{{{  css

echo("<link rel=\"stylesheet\" type=\"text/css\" media=\"screen\" href=\"../assets/jquery-ui/css/start/jquery-ui-1.8.13.custom.css\" />\n");
echo("<link rel=\"stylesheet\" type=\"text/css\" media=\"screen\" href=\"../assets/jqplot/jquery.jqplot.css\" />\n");

echo("<style>\n");

//l_disqus_style();
echo("#disqus_thread {max-width: 700px;}\n");

echo("body {padding: 1em;}\n");

echo ("#control textarea {width: 100%;}\n");

echo("</style>\n");

//}}}
//{{{  js

incJS ("../assets/jquery-ui/js/jquery-1.5.1.min.js");
incJS ("../assets/jquery-ui/js/jquery-ui-1.8.13.custom.min.js");
incJS ("../assets/jqplot/excanvas.js",1);
incJS ("../assets/jqplot/jquery.jqplot.min.js");
incJS ("../assets/jqplot/plugins/jqplot.dateAxisRenderer.min.js");
incJS ("../assets/jqplot/plugins/jqplot.logAxisRenderer.js");
incJS ("../assets/jqplot/plugins/jqplot.barRenderer.min.js");
incJS ("../assets/jqplot/plugins/jqplot.pointLabels.min.js");
incJS ("../assets/jqplot/plugins/jqplot.canvasTextRenderer.min.js");
incJS ("../assets/jqplot/plugins/jqplot.canvasAxisTickRenderer.min.js");
incJS ("../assets/jqplot/plugins/jqplot.canvasAxisLabelRenderer.min.js");
incJS ("../assets/jqplot/plugins/jqplot.highlighter.min.js");
incJS ("../assets/jqplot/plugins/jqplot.cursor.min.js");

incJS ("fit.js");

//}}}

echo("</head>\n");
echo("<body>\n");

//l_contact();

//{{{  banner

echo("<div class=\"ui-widget\" id=\"banner\">\n");

echo("<a title=\"home - to clear settings\" href=\"http://op12no2.me/toys/fit\"><b>epidemic curve fit</b></a>");
//echo(" | <a href=\"http://op12no2.me/posts/1009\">documentation</a>\n");
//echo(" | <a href=\"#disqus_thread\">comments</a>\n");

echo("</div><br>\n");

//}}}
//{{{  control

echo("<div class=\"ui-widget\" id=\"control\">\n");

echo("<p>\n");
echo("INPUT\n");
echo("<textarea rows=10 id=\"inp\">$inp</textarea>\n");
echo("</p>\n");

echo("<p>\n");
echo("<button id=\"go\">Fit</button>&nbsp;");
echo("<span><a href=\"#\" id=\"abort\">abort</a>&nbsp;</span>");
echo("<span id=\"feedback\"></span>");
echo("</p>\n");

echo("</div>\n");

//}}}
//{{{  graphs

echo("<div id=graphs>\n");
echo("<div id=\"act\"></div>\n");
echo("<div id=\"actest\"></div>\n");
echo("<div id=\"ern\"></div>\n");
echo("<div id=\"ip\"></div>\n");
echo("<div id=\"states\"></div>\n");
echo("<div id=\"scores\"></div>\n");
echo("</div>\n");

//}}}
//{{{  log

echo("<div id=log>\n");
echo("</div>\n");

//}}}

//l_comments('fit');

echo("</body>\n");
echo("</html>\n");

