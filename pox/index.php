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

echo("<!DOCTYPE html>\n");
echo("<html>\n");
echo("<head>\n");

//{{{  meta

echo("<meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge,chrome=1\" />\n");

echo("<title>Agent based infection model</title>\n");

echo("<meta http-equiv=\"content-type\" content=\"text/html; charset=UTF-8\" />\n");
echo("<meta name=\"title\"       content=\"Agent based infection model\" />\n");
echo("<meta name=\"description\" content=\"Agent based infection model\" />\n");
echo("<meta name=\"keywords\"    content=\"epidemic, endemic, infection, epidemiology, computational science, infection model, sir, seir, reproduction number\" />\n");

echo("<meta name=\"viewport\" content=\"width=device-width, initial-scale=1, maximum-scale=1\">\n");

//}}}
//{{{  css

echo("<link rel=\"stylesheet\" type=\"text/css\" media=\"screen\" href=\"../assets/bootstrap3/css/bootstrap.min.css\" />\n");
echo("<link rel=\"stylesheet\" type=\"text/css\" media=\"screen\" href=\"../assets/jqplot/jquery.jqplot.css\" />\n");

echo("<style>\n");

echo("* {padding: 0; margin: 0;}\n");
echo("html, body {width: 100%; height: 100%;}\n");
echo("canvas {display: block;}\n");
echo("#canvas2 {display: none;}\n");
echo(".modal-dialog {width: 90%;}\n");

echo("</style>\n");

//}}}
//{{{  js

incJS ("../assets/jquery-ui-1.8.24/js/jquery-1.8.2.min.js");
incJS ("../assets/bootstrap3/js/bootstrap.min.js");
//incJS ("../assets/slider/js/bootstrap-slider.js");
//incJS ("../assets/modernizr.js");
//incJS ("../assets/rule/rule-min.js");
incJS ("../assets/jqplot/jquery.jqplot.min.js");
incJS ("../assets/jqplot/plugins/jqplot.dateAxisRenderer.min.js");
incJS ("../assets/jqplot/plugins/jqplot.canvasTextRenderer.min.js");
incJS ("../assets/jqplot/plugins/jqplot.canvasAxisTickRenderer.min.js");
incJS ("../assets/jqplot/plugins/jqplot.canvasAxisLabelRenderer.min.js");
incJS ("../assets/jqplot/plugins/jqplot.highlighter.min.js");
incJS ("../assets/jqplot/plugins/jqplot.cursor.min.js");
incJS ("pox.js");

//}}}

//{{{  params

$scen = "exp";

if (isset($_REQUEST['scenario'])) {
  $scen = $_REQUEST['scenario'];
}

$model = file_get_contents("saved/$scen.js");

$model_a = explode('**********',$model);

$model_label = trim($model_a[0]);
$model_title = trim($model_a[1]);
$model_desc  = trim($model_a[2]);
$model_def   = trim($model_a[3]);

//}}}

echo("</head>\n");
echo("<body>\n");
?>

<nav id="nav" class="navbar navbar-default navbar-fixed-top navbar-inverse" role="navigation">
  <!-- Brand and toggle get grouped for better mobile display -->
  <div class="navbar-header">
    <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-ex1-collapse">
      <span class="sr-only">Toggle navigation</span>
      <span class="icon-bar"></span>
      <span class="icon-bar"></span>
      <span class="icon-bar"></span>
    </button>
<?php
echo("<a title=\"click to see scenario description\" id=\"desc\" class=\"navbar-brand\" href=\"#\">$model_label</a>\n");
?>
  </div>

  <!-- Collect the nav links, forms, and other content for toggling -->
  <div class="collapse navbar-collapse navbar-ex1-collapse">
    <ul class="nav navbar-nav">

      <li class="dropdown">
        <a href="#" class="dropdown-toggle" data-toggle="dropdown">Scenario <b class="caret"></b></a>
        <ul class="dropdown-menu">
          <li><a href="http://op12no2.me/toys/pox?scenario=exp">exp</a></li>
          <li><a href="http://op12no2.me/toys/pox?scenario=gauss">gauss</a></li>
        </ul>
      </li>

      <li class="dropdown">
        <a href="#" class="dropdown-toggle" data-toggle="dropdown">Edit <b class="caret"></b></a>
        <ul class="dropdown-menu">
          <li><a id="editdesc" href="#">Description</a></li>
          <li><a id="editdef"  href="#">Definition</a></li>
        </ul>
      </li>

      <li><a id="start"   href="#">Start</a></li>
      <li><a id="step"    href="#">Step</a></li>

      <li class="dropdown">
        <a href="#" class="dropdown-toggle" data-toggle="dropdown">Graphs <b class="caret"></b></a>
        <ul class="dropdown-menu">
          <li><a id="graphstatehistory" href="#">State history</a></li>
          <li><a id="graphphase" href="#">Phase</a></li>
          <li><a id="graphr0" href="#">Reproduction numbers</a></li>
        </ul>
      </li>

      <li><a id="reset" href="#">Reset</a></li>
      <li><a title="toggle drawing lines between who infected who" id="trace" href="#"></a></li>
    </ul>

    <ul class="nav navbar-nav navbar-right">
      <li><a id="perf" href="#"></a></li>
      <li class="dropdown">
        <a href="#" class="dropdown-toggle" data-toggle="dropdown">About <b class="caret"></b></a>
        <ul class="dropdown-menu">
          <li><a target="_blank" href="http://op12no2.me/posts/1515">Help</a></li>
        </ul>
      </li>
    </ul>
  </div><!-- /.navbar-collapse -->
</nav>

<?php
echo("<canvas id=\"canvas\"></canvas>\n");
echo("<canvas id=\"canvas2\"></canvas>\n");

?>

<div class="modal fade" id="modalgraph" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
        <h4 id="modalgraphtitle" class="modal-title">&nbsp;</h4>
      </div>
      <div class="modal-body">
        <p id="modalgraphtext">&nbsp;</p>
        <div id="modalgraphplot"></div>
        <p><br>Click and drag to zoom.  Double-click to reset.</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
      </div>
    </div><!-- /.modal-content -->
  </div><!-- /.modal-dialog -->
</div><!-- /.modal -->

<div class="modal fade" id="modalhtml" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
        <h4 id="modalhtmltitle" class="modal-title"></h4>
      </div>
      <div id="modalhtmltext" class="modal-body">
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
      </div>
    </div><!-- /.modal-content -->
  </div><!-- /.modal-dialog -->
</div><!-- /.modal -->

<div class="modal fade" id="modaleditdesc" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
        <h4 class="modal-title">Edit scenario description</h4>
      </div>
      <div class="modal-body">
  <form role="form">
  <div class="form-group">
    <label for="modaleditdesclabel">Label</label>
    <input type="text" class="form-control" id="modaleditdesclabel" placeholder="Model label" disabled value="<?php echo $model_label; ?>">
  </div>
  <div class="form-group">
    <label for="modaleditdesctitle">Title</label>
    <input type="text" class="form-control" id="modaleditdesctitle" placeholder="Model title" value="<?php echo $model_title; ?>">
  </div>
  <div class="form-group">
    <label for="modaleditdescdesc">Description</label>
<textarea class="form-control" rows="10" id="modaleditdescdesc" placeholder="Model description">
<?php
echo $model_desc;
?>
</textarea>
  </div>
  </form>
  <p>
  The formatted descripiton is diplayed when the scenario label, top left in the nav bar, is clicked.
    </div><!-- /.modal-body -->
      <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">OK</button>
      </div>
    </div><!-- /.modal-content -->
  </div><!-- /.modal-dialog -->
</div><!-- /.modal -->

<div class="modal fade" id="modaleditdef" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
        <h4 class="modal-title">Edit scenario definition</h4>
      </div>
      <div class="modal-body">
  <form role="form">
  <div class="form-group">
    <label for="modaleditdefdef">Definition</label>
<textarea class="form-control" style="font-family:monospace;" rows="20" id="modaleditdefdef" placeholder="Model definition">
<?php
echo $model_def;
$comment = false;
foreach($_REQUEST as $key => $val){
  if ($key == 'scenario')
    continue;
  if (strpos($key,'user_') !== 0 && strpos($key,'work_') !== 0 && strpos($key,'states_') !== 0)
    continue;
  $key = str_replace('_','.',$key);
  $val = str_replace('`','#',$val);
  if (!$comment) {
    echo("\n\n//from URL...\n");
    $comment = true;
  }
  echo("\n$key = $val;");
}
echo("\n");
?>
</textarea>
  </div>
  </form>
  <p>
  Reset the scenario to activate the edits.
    </div><!-- /.modal-body -->
      <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">OK</button>
      </div>
    </div><!-- /.modal-content -->
  </div><!-- /.modal-dialog -->
</div><!-- /.modal -->

<?php

echo("</body>\n");
echo("</html>\n");

?>

