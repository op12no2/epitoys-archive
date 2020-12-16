<?php
//{{{  fold marker

//}}}

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

//include('../phplib.php');
include("english.txt");

if (isset($_REQUEST['locale']))
  $locale = $_REQUEST['locale'];
else
  $locale = "";

if ($locale)
  include("$locale.txt");

//{{{  scenarios

$p = array(
  'intro' => array(
  'title' => $t_introtitle,
  'text' => $t_introtext
  ),
  'novax' => array(
  'title' => $t_novaxtitle,
  'text' => $t_novaxtext
  ),
  'vax' => array(
  'title' => $t_vaxtitle,
  'text' => $t_vaxtext
  ),
  'herd' => array(
  'title' => $t_herdtitle,
  'text' => $t_herdtext
  ),
  'freeload' => array(
  'title' => $t_freeloadtitle,
  'text' => $t_freeloadtext
  ),
  'pocket' => array(
  'title' => $t_pockettitle,
  'text' => $t_pockettext
  ),
  'luck' => array(
  'title' => $t_lucktitle,
  'text' => $t_lucktext
  ),
  'cocoon' => array(
  'title' => $t_cocoontitle,
  'text' => $t_cocoontext
  )
);

//}}}

echo("<!DOCTYPE html>\n");
echo("<html>\n");
echo("<head>\n");
//{{{  meta

echo("<title>epidemic sir model to reveal herd immunity</title>\n");

echo("<meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge,chrome=1\" />\n");

//echo("<meta http-equiv=\"content-type\" content=\"text/html; charset=UTF-8\" />\n");
if ($locale == 'german')
  echo("<meta charset=\"utf-8\">\n");
echo("<meta name=\"title\"       content=\"stochastic monte-carlo epidemic sir model\" />\n");
echo("<meta name=\"description\" content=\"stochastic monte-carlo epidemic sir model to reveal herd immunity\" />\n");
echo("<meta name=\"keywords\"    content=\"herd immunity, sir model, epidemic, endemic, vaccination, freeloader, anti-vaccination, anti-vax\" />\n");

//}}}
//{{{  css

echo("<link rel=\"stylesheet\" type=\"text/css\" media=\"screen\" href=\"../assets/jquery-ui/css/start/jquery-ui-1.8.13.custom.css\" />\n");

echo("<style>\n");

//l_disqus_style();
echo("img       {border: 0;}\n");
echo(".flags    {margin-left: 5px; float: right;}\n");
echo("#logo     {}\n");
echo("#banner   {text-align: center; clear: both; font-size: 12pt; margin: 0px 0px 10px 0px; padding: 10px 0px 10px 0px; }\n");
echo("#intro    {text-align: center; margin: 5px 0px 5px 0px; padding: 12px; border: 1px solid #ccccff; }\n");
echo("#nextlink {text-align: right; width: 100px; float: right; font-weight: bold;}\n");
echo("#backlink {text-align: left;  width: 100px; float: left;  font-weight: bold;}\n");
echo("#title    {color: #666666; font-weight: bold; }\n");
echo("#comments {margin: 20px auto 0px auto; width: 880px;}\n");
echo("#contain  {margin: 10px auto 10px auto; width: 889px;}\n");
echo("#foot     {clear: both; margin: 5px 0px 0px 0px; text-align: left; padding: 8px; border: 1px solid #ccccff; }\n");
echo("#locale   {clear: both; margin: 5px 0px 0px 0px; text-align: left; padding: 8px; border: 0px solid #ccccff; }\n");
echo("#speed    {clear: both; margin: 5px 0px 0px 0px; text-align: left; padding: 8px; border: 0px solid #ccccff; }\n");
echo("#control  {width: 111px; overflow: hidden; height: 400px; float: left; padding: 0px; border: 1px solid #ddddff; margin-right: 0px;}\n");
echo("#display  {overflow: hidden; height: 400px; float: left; padding: 5px; border: 1px solid #ddddff; margin-right: 5px;}\n");
echo("#text     {overflow: hidden; height: 390px; float: left; padding: 10px; border: 1px solid #ddddff; margin: 0px 5px 5px 0px; width: 331px;}\n");

echo("body  {margin: 0; font-size: 80%; font-family: arial, \"sans serif\";}\n");
echo("label {display: block; margin: 10px 10px 1px 10px; }\n");
echo("input {width: 70px; padding: 5px; color: #999999; margin: 3px 10px 0px 10px; }\n");
echo("button {margin: 0px 0px 3px 10px; }\n");

echo("#fsus     {font-weight: bold; color: #ff4444;}\n");
echo("#finf     {font-weight: bold; color: #444444;}\n");
echo("#frec     {font-weight: bold; color: #4444ff;}\n");

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
incJS ("herd.js");

//}}}
echo("</head>\n");
echo("<body>\n");
//l_contact();
//{{{  body

if (isset ($_REQUEST['scenario']))
  $s = $_REQUEST['scenario'];
else
  $s = '';

if (!$s)
  $s = 'intro';
$s = strtolower($s);
if (!key_exists($s,$p))
  $s = 'intro';

$total = count($p);

$found = false;
$i     = 0;
$back  = 'intro';

foreach($p as $k => $v) {
  $i++;
  if (!$found && $s != $k) {
    $back = $k;
    continue;
  }
  if (!$found && $s == $k) {
    $index = $i;
    $found = true;
    $next  = $k;
    continue;
  }
  if ($found && $s != $k)
    $next = $k;
    break;
}

if ($s == $next)
  $next = 'intro';

echo("<div id=\"contain\">\n");

echo("<div class=\"flags\">\n");
echo("<a title=\"English\" href=\"http://op12no2.me/toys/herd\"><img border=0 src=\"http://sailwave.com/flags/big/GBR.jpg\"></a>\n");
echo("<a title=\"Deutsch\" href=\"http://op12no2.me/toys/herd?locale=german\"><img border=0 src=\"http://sailwave.com/flags/big/GER.jpg\"></a>\n");
echo("<a title=\"Francais\" href=\"http://op12no2.me/toys/herd?locale=french\"><img border=0 src=\"http://sailwave.com/flags/big/FRA.jpg\"></a>\n");
echo("</div>\n");

echo("<div id=\"logo\">\n");
echo("<a style=\"padding-left: 0px; \" title=\"Please visit Lore Darche's memorial site\" target=\"_blank\" href=\"http://loredarche.be\"><img height=42 src=\"http://loredarche.be/pictures/day_48_(1)_listening_to_my_dad.jpg\"></a>\n");
echo("</div>\n");

echo("<div id=\"banner\" class=\"ui-widget\">\n");
echo("<b>$t_title</b>\n");
echo("</div>\n");

$title = $p[$s]['title'];

$backtxt = "$t_back";
$nexttxt = "$t_next";

echo("<div class=\"ui-corner-all\" id=\"intro\">\n");
echo("<span id=\"backlink\" class=\"ui-corner-all\"><a href=\"index.php?scenario=$back&locale=$locale\">< $backtxt</a></span>\n");
echo("<span id=\"nextlink\" class=\"ui-corner-all\"><a href=\"index.php?scenario=$next&locale=$locale\">$nexttxt ></a></span>\n");
echo("<span id=\"title\"    class=\"ui-corner-all\">$index $t_of $total - $title</span>\n");
echo("</div>\n");

echo("<div class=\"ui-corner-all\" id=\"text\">\n");
echo($p[$s]['text']);
echo("</div>\n");

echo("<div class=\"ui-corner-all\" id=\"display\"><canvas id=\"herd\" width=\"1\" height=\"1\">Your browser does not<br>support the CANVAS tag.<br>Use a modern browser<br>like Firefox, Google<br>Chrome or Apple Safari.<br>Microsoft IE9 will<br>support CANVAS too.</canvas></div>\n");

echo("<div class=\"ui-corner-all ui-widget\" id=\"control\">\n");

echo("<label for=\"#fpop\">$t_population</label>   <input size=10  value=\"\" type=\"input\" id=\"fpop\"  name=\"fpop\"   class=\"ui-widget-content ui-corner-all\"  />\n");
echo("<label for=\"#fsus\">$t_susceptible</label>  <input size=10  value=\"\" type=\"input\" id=\"fsus\"  name=\"fsus\"   class=\"ui-widget-content ui-corner-all\"  />\n");
echo("<label for=\"#finf\">$t_infected</label>     <input size=10  value=\"\" type=\"input\" id=\"finf\"  name=\"finf\"   class=\"ui-widget-content ui-corner-all\"  />\n");
echo("<label for=\"#frec\">$t_recovered</label>    <input size=10  value=\"\" type=\"input\" id=\"frec\"  name=\"frec\"   class=\"ui-widget-content ui-corner-all\"  />\n");

echo("<p>\n");
echo("<button title=\"$t_buttonplaytip\"  id=\"play\">$t_buttonplaytext</button><br>\n");
echo("<button title=\"$t_buttonpausetip\" id=\"pause\">$t_buttonpausetext</button><br>\n");
echo("<button title=\"$t_buttonsteptip\"  id=\"step\">$t_buttonsteptext</button><br>\n");
echo("<button title=\"$t_buttonresettip\" id=\"preview\">$t_buttonresettext</button><br>\n");

echo("<input type=hidden  size=5  value=\"$s\"   type=\"input\" id=\"us\"        name=\"usX\"        class=\"ui-widget-content ui-corner-all\" title=\"width of display in pixels\" />\n");
echo("</div>\n");

//echo("<div class=\"ui-corner-all ui-widget\" id=\"feedback\">\n");
//echo("<label for=\"#fpop\">$t_population</label>   <input size=10  value=\"\" type=\"input\" id=\"fpop\"  name=\"fpop\"   class=\"ui-widget-content ui-corner-all\"  />\n");
//echo("<label for=\"#fsus\">$t_susceptible</label>  <input size=10  value=\"\" type=\"input\" id=\"fsus\"  name=\"fsus\"   class=\"ui-widget-content ui-corner-all\"  />\n");
//echo("<label for=\"#finf\">$t_infected</label>     <input size=10  value=\"\" type=\"input\" id=\"finf\"  name=\"finf\"   class=\"ui-widget-content ui-corner-all\"  />\n");
//echo("<label for=\"#frec\">$t_recovered</label>    <input size=10  value=\"\" type=\"input\" id=\"frec\"  name=\"frec\"   class=\"ui-widget-content ui-corner-all\"  />\n");
//echo("</div>\n");

echo("<div class=\"ui-corner-all\" id=\"speed\">\n");
echo("<div id=\"slider\"></div>\n");
echo("</div>\n");

if ($locale) {
  echo("<div class=\"ui-corner-all\" id=\"foot\">\n");
  echo("<a href=\"$locale.txt\">$a_locale</a> translation by <a target=\"_blank\" href=\"$a_website\">$a_author</a>, $a_date.\n");
  echo("</div>\n");
}

//l_comments('herd');

echo("<p><a href=\"https://plus.google.com/u/0/116152397191796971056/posts/QFvWFbMpfJy\">feedback and comments</a>");
echo("</div>\n");

//}}}
echo("</body>\n");
echo("</html>\n");

?>

