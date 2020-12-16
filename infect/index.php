<?php
//{{{  fold marker

//}}}

//{{{  functions

include('../phplib.php');

//{{{  incJS

function incJS($js,$ie=0) {
  if (!$ie)
    echo("<script type=\"text/javascript\" src=\"$js\"></script>\n");
  else
    echo("<!--[if lt IE 9]><script type=\"text/javascript\" src=\"$js\"></script><![endif]-->\n");
}

//}}}

//{{{  parseScenario

function parseScenario($s) {
  $a = explode('////',$s);
  return $a;
}

//}}}

//}}}
//{{{  locale

if (isset($_REQUEST['locale']))
  $locale = $_REQUEST['locale'];
else
  $locale = "";

if ($locale)
  include("$locale.txt");

//}}}
//{{{  scenario

if (isset($_REQUEST['scenario']))
  $sc = $_REQUEST['scenario'];
else
  $sc = "";

if ($sc) {
  $scenario = file_get_contents("scenarios/$sc");
  if (!$scenario) {
    die("<p>problem loading scenario\n");
    exit;
  }
}

//}}}

echo("<!DOCTYPE html>\n");
echo("<html>\n");
echo("<head>\n");
//{{{  meta

echo("<meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge,chrome=1\" />\n");

echo("<title>infection model</title>\n");

echo("<meta name=\"title\"       content=\"infection model\" />\n");
echo("<meta name=\"description\" content=\"stochastic monte-carlo infection model\" />\n");
echo("<meta name=\"keywords\"    content=\"herd immunity, sir model, epidemic, endemic, vaccination, freeloader, anti-vaccination, anti-vax\" />\n");

//}}}
//{{{  css

echo("<link rel=\"stylesheet\" type=\"text/css\" media=\"screen\" href=\"../assets/jquery-ui-1.8.24/css/ui-lightness/jquery-ui-1.8.24.css\" />\n");
echo("<link rel=\"stylesheet\" type=\"text/css\" media=\"screen\" href=\"../assets/jqplot/jquery.jqplot.css\" />\n");

echo("<style>\n");

l_disqus_style();

echo(".ui-widget {font-size: 0.9em;}\n");
echo("#define textarea {width: 100%; height: 30em; font-size: 12pt; font-family: monospace;}\n");
echo("#banner {margin: 1em;}\n");
echo("#feedback {font-weight: bold; margin: 1em;float: right;}\n");
echo("#disqus_thread {max-width: 700px;}\n");
echo("#desc   {margin: 1em;}\n");
echo("#canvas {margin: 1em;float: left; border: 1px solid #666666;}\n");
echo("#g1  {margin: 0em;float: left;}\n");
echo("#g2 {margin: 0em;float: left;}\n");
echo("#g3   {margin: 0em;float: left;}\n");
echo("#toolbar {margin: 1em;}\n");
echo("#select table {border-collapse: collapse;}\n");
echo("#select th,td {border: 1px solid #cccccc; padding: 0.5em;}\n");

echo("</style>\n");

//}}}
//{{{  js

incJS ("../assets/jquery-ui-1.8.24/js/jquery-1.8.2.min.js");
incJS ("../assets/jquery-ui-1.8.24/js/jquery-ui-1.8.24.min.js");
incJS ("../assets/jqplot/excanvas.js",1);
incJS ("../assets/jqplot/jquery.jqplot.min.js");
incJS ("../assets/jqplot/plugins/jqplot.barRenderer.min.js");
//incJS ("../assets/jqplot/plugins/jqplot.pointLabels.min.js");
incJS ("../assets/jqplot/plugins/jqplot.canvasTextRenderer.min.js");
incJS ("../assets/jqplot/plugins/jqplot.canvasAxisTickRenderer.min.js");
incJS ("../assets/jqplot/plugins/jqplot.canvasAxisLabelRenderer.min.js");
incJS ("../assets/jqplot/plugins/jqplot.categoryAxisRenderer.min.js");
incJS ("../assets/jqplot/plugins/jqplot.highlighter.min.js");
incJS ("../assets/jqplot/plugins/jqplot.cursor.min.js");
incJS ("ui.js");

//}}}
echo("</head>\n");

echo("<body>THIS PROJECT IS RETIRED - IS HAS BEEN REPLACED WITH <a href=\"http://op12no2.me/toys/pox\">THIS ONE</a> <br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>\n");
l_contact();
//{{{  body

//{{{  banner

echo("<div class=\"ui-widget\" id=\"banner\">\n");

echo("<a title=\"home\" href=\"http://op12no2.me/toys/infect\"><b>Discrete infection model</b></a>\n");
echo("|");
//echo("<a href=\"\">documentation</a>\n");
//echo("|");
echo("<a href=\"#disqus_thread\">comments</a>\n");

echo("</div>\n");

//}}}

if (!$sc) {
  //{{{  select
  
  echo("<div id=\"select\" class=\"ui-widget\"><p>Select a scenario:-</p>\n");
  
  echo("<table>\n");
  echo("<tr><th>File</th><th>Title</th><th>Author</th><th>Date</th></tr>\n");
  
  if ($handle = opendir('scenarios')) {
    while (false !== ($entry = readdir($handle))) {
      if ($entry != "." && $entry != "..") {
        $def = file_get_contents("scenarios/$entry");
        $defa = parseScenario($def);
        $fil = "<a href=\"http://op12no2.me/toys/infect?scenario=$entry\">$entry</a>";
        $tit = $defa[2];
        $who = $defa[0];
        $dat = $defa[1];
        echo("<tr><td>$fil</td><td>$tit</td><td>$who</td><td>$dat</td></tr>\n");
      }
    }
    closedir($handle);
  }
  
  echo("</table>\n");
  
  echo("</div>\n");
  
  //}}}
}
else {
  //{{{  toolbar
  
  echo("<div class=\"ui-widget\" id=\"feedback\">\n");
  echo("</div>\n");
  
  echo("<div class=\"ui-widget\" id=\"toolbar\">\n");
  
  echo("<button title=\"reset\"      id=\"breset\">reset</button>\n");
  echo("<button title=\"play|pause\" id=\"bplay\">play|pause</button>\n");
  echo("<button title=\"step\"       id=\"bstep\">step</button>\n");
  
  echo("</div>\n");
  
  //}}}
  //{{{  desc
  
  echo("<div style=\"clear:both;\"></div>\n");
  
  echo("<div class=\"ui-widget\" id=\"desc\">\n");
  
  if ($sc) {
    $a    = parseScenario($scenario);
    $desc = $a[3];
  }
  
  echo("$desc\n");
  
  echo("</div>\n");
  
  //}}}
  //{{{  cells
  
  echo("<canvas id=\"canvas\" width=\"1\" height=\"1\">Your browser does not<br>support the CANVAS tag.<br>Use a modern browser<br>like Firefox, Google<br>Chrome or Apple Safari.<br>Microsoft IE9 will<br>support CANVAS too.</canvas>\n");
  
  //}}}
  //{{{  states
  
  echo("<div class=\"ui-widget\" id=\"g1\">\n");
  echo("</div>\n");
  
  //}}}
  //{{{  state
  
  echo("<div class=\"ui-widget\" id=\"g2\">\n");
  echo("</div>\n");
  
  //}}}
  //{{{  ern
  
  echo("<div class=\"ui-widget\" id=\"g3\">\n");
  echo("</div>\n");
  
  //}}}
  //{{{  define
  
  echo("<div style=\"clear:both;\"></div><hr>\n");
  
  echo("<div class=\"ui-widget\" id=\"define\">\n");
  
  echo("<p>Enter/edit scenario.  Click Reset then Play.  You can Pause, Step and Reset at any time.</p>\n");
  
  echo("<form><textarea id=\"scenario\">\n");
  if ($sc) {
    $scen = $a[4];
    echo("$scen");
  }
  echo("</textarea></form>\n");
  
  echo("</div><hr>\n");
  
  //}}}
}

l_comments('infect');

//}}}
echo("</body>\n");

echo("</html>\n");

?>

