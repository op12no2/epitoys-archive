<?php

$t     = 9000000;
$s0    = 8999999;
$i0    = 1;

$c     = 'function (iter) {
var s1 = 92;
var s2 = 200;
var d1 = 10;
var d2 = 10;
var e1 = s1 + d1;
var e2 = s2 + d2;
var r0 = 0.25;
var r1 = 0.11;
var rd = r0 - r1;
if (iter < s1) return r0;
if (iter <= e1) return r1 + rd * ((e1-iter)/d1);
if (iter < s2) return r1;
if (iter <= e2) return r1 + rd * (1-((e2-iter)/d2));
if (iter > e2) return r0
}';
$k     = 0.1;
$d     = 0.0;
$b     = 0.0;
$v     = 0.0;
$w     = 0.0;
$a     = 'SIR';
$z     = 500;

$plotr = 'y';
$plotx = 'n';

$desc = <<< xyzzy
A novel viral infection with R0=2.5 hits a poopulation the size of London. After some time aggressive social distancing 
measures are introduced by the government. When the measures are
lifted there are inevitably still susceptibles and so there is a second epidemic.
The effect of the social distancing has been to stretch out the load on the 
healthcare services. It also allows time for a vaccine to be developed that could possibly prevent the second epidemic. In this
demo the total number of cases is also lower than <a href="http://op12no2.me/toys/sir?scenario=novel25.php">without social distancing measures</a> but it probably depends on the social distancing dynamics and need not necessarily be the case. 
<a href="https://www.thelancet.com/pb-assets/Lancet/pdfs/S0140673620305675.pdf">Further reading</a>.  
xyzzy;
?>


