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
include("en.txt");

if (isset($_REQUEST['locale']))
  $locale = $_REQUEST['locale'];
else
  $locale = '';

if ($locale)
  include("$locale.txt");

//{{{  scenarios

$p = array(
  'intro' => array(
   'index' => 1,
   'title' => $t_introtitle,
   'text' => $t_introtext
  ),
  'drum' => array(
   'index' => 2,
   'title' => $t_drumtitle,
   'text' => $t_drumtext
  ),
  'sticks' => array(
   'index' => 3,
   'title' => $t_stickstitle,
   'text' => $t_stickstext
  ),
  'play' => array(
   'index' => 4,
   'title' => $t_playtitle,
   'text' => $t_playtext
  ),
  'count' => array(
   'index' => 5,
   'title' => $t_counttitle,
   'text' => $t_counttext
  ),
  'mmr' => array(
   'index' => 6,
   'title' => $t_mmrtitle,
   'text' => $t_mmrtext
  )
);

//}}}

echo("<!DOCTYPE html>\n");
echo("<html>\n");
echo("<head>\n");
//{{{  meta

echo("<meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge,chrome=1\" />\n");

echo("<title>$t_title | mmr cause autism vaccine vaccination immunisation</title>\n");

//}}}
//{{{  css

echo("<link rel=\"stylesheet\" type=\"text/css\" media=\"screen\" href=\"../assets/jquery-ui/css/start/jquery-ui-1.8.13.custom.css\" />\n");

echo("<style>\n");

//l_disqus_style();
echo("img       {border: 0;}\n");
echo(".flags    {margin-left: 5px; margin-top: 5px; float: right;}\n");
echo("#logo     {margin-top: 5px;}\n");
echo("#contain  {margin: 10px auto 10px auto; width: 800px;}\n");
echo("#banner   {text-align: center; clear: both; font-size: 12pt; margin: 20px 0px 10px 0px; padding: 10px 0px 10px 0px; }\n");
echo("#intro    {text-align: center; margin: 0px 0px 5px 0px; padding: 10px; border: 1px solid #ccccff; }\n");
echo("#nextlink {text-align: right; width: 100px; float: right; font-weight: bold;}\n");
echo("#backlink {text-align: left;  width: 100px; float: left;  font-weight: bold;}\n");
echo("#title    {color: #666666; font-weight: bold; }\n");
echo("#display  {height: 100px; padding: 10px; border: 1px solid #ddddff; margin: 0px 0px 0px 0px;}\n");
echo("#foot     {margin: 5px 0px 0px 0px; text-align: left; padding: 10px; border: 1px solid #ccccff; }\n");
echo("#locale   {margin: 0px 0px 0px 0px; text-align: left; padding: 10px; border: 0px solid #ccccff; }\n");
echo("#speed    {margin: 0px 0px 0px 0px; text-align: left; padding: 10px; border: 0px solid #ccccff; }\n");
echo("#text     {height: 280px; padding: 10px; border: 1px solid #ddddff; margin: 0px 0px 0px 0px; }\n");
echo("#comments {margin: 20px auto 0px auto; width: 800px;}\n");

echo("body  {margin: 0px 0px 0px 0px; font-size: 80%; font-family: arial, \"sans serif\";}\n");

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
incJS ("mmr.js");

//}}}
echo("</head>\n");
echo("<body>\n");
//l_contact();
//{{{  body

if (isset($_REQUEST['scenario']))
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

echo("<div id=\"banner\" class=\"ui-corner-all ui-widget\">\n");
echo("<b>$t_title</b>\n");
echo("</div>\n");

$title = $p[$s]['title'];
$us    = $p[$s]['index'];

$backtxt = "$t_back";
$nexttxt = "$t_next";

echo("<div class=\"ui-corner-all\" id=\"intro\">\n");
echo("<span id=\"backlink\" class=\"ui-corner-all\"><a href=\"index.php?scenario=$back&locale=$locale\">< $backtxt</a></span>\n");
echo("<span id=\"nextlink\" class=\"ui-corner-all\"><a href=\"index.php?scenario=$next&locale=$locale\">$nexttxt ></a></span>\n");
echo("<span id=\"title\"    class=\"ui-corner-all\">$index $t_of $total - $title</span>\n");
echo("</div>\n");

echo("<div class=\"ui-corner-all\" id=\"display\"><canvas id=\"mmr\" width=\"1\" height=\"1\">Your browser does not<br>support the CANVAS tag.<br>Use a modern browser<br>like Firefox, Google<br>Chrome or Apple Safari.<br>Microsoft IE9 will<br>support CANVAS too.</canvas></div>\n");

echo("<div class=\"ui-corner-all\" id=\"speed\">\n");
echo("<div id=\"slider\"></div>\n");
echo("</div>\n");

echo("<div class=\"ui-corner-all\" id=\"text\">\n");
echo($p[$s]['text']);
echo("</div>\n");

if ($locale) {
  echo("<div class=\"ui-corner-all\" id=\"foot\">\n");
  echo("<span style=\"float:right;\"><a href=\"$locale.txt\">$a_locale</a> translation by <a target=\"_blank\" href=\"$a_website\">$a_author</a>, $a_date.</span>\n");
  echo("</div>\n");
}

echo("<input id=\"us\" type=\"hidden\" value=\"$us\">\n");

//l_comments('mmr');

echo("</div>\n");

//}}}
echo("</body>\n");
echo("</html>\n");

?>


