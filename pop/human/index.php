<?php
//{{{  fold marker

//}}}

include('../phplib.php');

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

echo("<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">\n");
echo("<html xmlns=\"http://www.w3.org/1999/xhtml\" xml:lang=\"en\" lang=\"en\">\n");
echo("<head>\n");
echo("<meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge,chrome=1\" />\n");
//{{{  css

echo("<link rel=\"stylesheet\" type=\"text/css\" media=\"screen\" href=\"../assets/jquery-ui/css/start/jquery-ui-1.8.13.custom.css\" />\n");

echo("<style>\n");

echo("body  {margin: 20px 20px 20px 20px; font-size: 80%; font-family: arial, \"sans serif\";}\n");

echo("</style>\n");

//}}}
//{{{  js

incJS ("../assets/jquery-ui/js/jquery-1.5.1.min.js");
incJS ("../assets/jquery-ui/js/jquery-ui-1.8.13.custom.min.js");
incJS ("human.js");

//}}}
echo("</head>\n");
echo("<body>\n");
l_contact();
//{{{  body

echo("<h3>How much human diploid cell content is there in a vaccine?</h3>\n");

echo("<p>Cell origin<br>\n");
echo("<select>");
echo("<option>Lung</option>");
echo("<option>Throat</option>");
echo("<option>Heel</option>");
echo("</select>");

echo("<p>Sex of donor<br>\n");
echo("<select>");
echo("<option>Male</option>");
echo("<option>Female</option>");
echo("</select>");

echo("<p>Age at harvesting<br>\n");
echo("<select>");
echo("<option>Before birth</option>");
echo("<option>0-1 years</option>");
echo("<option>1-10 years</option>");
echo("</select>");

echo("<p>State of cell culture when obtained from cell bank<br>\n");
echo("<select>");
echo("<option>Frozen</option>");
echo("<option>Unknown</option>");
echo("</select>");

echo("<p>Method used to avoid Hayflick Limit<br>\n");
echo("<select>");
echo("<option>None</option>");
echo("<option>Vitimin E</option>");
echo("</select>");

echo("<p>Cell line divisions from seed cells (across all passages) when obtained from cell bank<br>\n");
echo("<select>");
echo("<option>4</option>");
echo("<option>5</option>");
echo("<option>6</option>");
echo("<option>7</option>");
echo("<option selected=selected>8</option>");
echo("<option>9</option>");
echo("<option>10</option>");
echo("<option>more than 10</option>");
echo("</select>");

echo("<p>Passage platform<br>\n");
echo("<select>");
echo("<option>Flask</option>");
echo("<option>Slide</option>");
echo("</select>");

echo("<p>Extra divisions performed by vaccine manufacturer<br>\n");
echo("<select>");
echo("<option>None</option>");
echo("<option>1</option>");
echo("<option>2</option>");
echo("<option>3</option>");
echo("<option>4</option>");
echo("</select>");

echo("<p>Virus grown in cells<br>\n");
echo("<select>");
echo("<option>Rubella</option>");
echo("<option>Varicella</option>");
echo("<option>Hep A</option>");
echo("<option>Rabies</option>");
echo("</select>");

echo("<h3>Answer</h3>\n");
echo("<h2 id=\"x\">. . . . . . . . . . . . . . .</h2>\n");
echo("<p><button id=\"calc\">Calculate</button><br><br></p>\n");

//}}}
echo("</body>\n");
echo("</html>\n");

?>

