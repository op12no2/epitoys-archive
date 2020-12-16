<a href="http://op12no2.me/wp-content/uploads/2012/10/Clip11.jpg"><img class="alignnone size-full wp-image-1578" src="http://op12no2.me/wp-content/uploads/2012/10/Clip11.jpg" alt="Clip1" width="1035" height="365" /></a>

A simple epidemic and endemic compartmental SIR (Susceptible, Infected, Recovered) infectious disease model using javascript and HTML5.

<strong>Link:-</strong>

<a href="http://op12no2.me/toys/sir">http://op12no2.me/toys/sir</a>

The model implements these fairly standard iterative equations for S, I and R:-
<p style="padding-left: 30px;">s' = s - cis/t - bs + bt - vbt + wi
i' = i + cis/t - ki -bi
r' = r + ki - br + vbt - wi</p>
All the usual constraints hold, like homogeneous mixing and vaccination at birth.

Note that the total population is constant.

Essentially:-
<p style="padding-left: 30px;">s' = s - new cases - susceptible deaths + births - vaxed + waned
i' = i + new cases - recovered cases - infected deaths
r' = r + recovered cases - recovered deaths + vaxed - waned</p>
Where:-
<p style="padding-left: 30px;">t = Total population. This is always constant.</p>
<p style="padding-left: 30px;">s,i,r = Number of susceptible, infected and recovered individuals at any one time.</p>
<p style="padding-left: 30px;">c = Contact rate.  The way to interpret this is to this of a totally susceptible population and a single infection.  If on average the infective infects one person every other iteration then c=0.5.</p>
<p style="padding-left: 30px;">k = Recovery rate.  If it takes on average 10 days to recover then k = 0.1.</p>
<p style="padding-left: 30px;">b = Birth and death rate.  This is a fraction of the total population per iteration.</p>
<p style="padding-left: 30px;">v = Vaccination rate.  The fraction of newborns vaccinated at birth.</p>
<p style="padding-left: 30px;">w = Wane rate after being immune from natural infection or vaccination.  This of this like k.  If it takes 100 iterations for immunity to wane then w=0.01.</p>
The initial values of s and i are input as fields s0 and i0.  The initial value of r is then t-s0-i0.

The following metrics are calculated along with the graphs and tables:-
<p style="padding-left: 30px;">R0 = Basic reproduction number = c / (k+b).</p>
<p style="padding-left: 30px;">Se = Epidemic threshold of susceptibles = t / R0.</p>
<p style="padding-left: 30px;">H = Herd immunity threshold = 1 - 1/R0.</p>
The input parameters are integers, reals or strings as required.

c,k,b,v and w can be defined based on the current iteration using javascript functions.

For example in the <a href="http://op12no2.me/toys/sir/?scenario=measles2.php" target="_blank">measles2.php</a> scenario, the contact rate c is defined with a function to add seasonal variation:-
<pre style="padding-left: 30px;">function (iter) {
  return 3.6*(1.0 + 0.036*Math.sin(iter*0.0172141));
}</pre>
0.0172141 being 2*pi/365 - i.e. every 365 iterations is a 'season' with a sin() shaped curve.

c,k,b,v and w can also be entered as expressions; e.g. 1/3 instead of 0.333333.

You can click on the model home page or one of the scenario links to see some predefined setups.  If you tweak any of the value and click the Plot button, the graphs and outputs will be updated.  You can also copy the resulting URL in the browser to link to your model.

References

Johnson, T. <a href="http://op12no2.me/stuff/tjsir.pdf" target="_blank">Susceptible-Infected-Recovered (SIR) Model</a>. 2009.

Fine PE. <a href="http://op12no2.me/stuff/herdhis.pdf">Herd immunity: history, theory, practice</a>. Epidemiol Rev. 1993. 15(2):265-302.

Fine PE. <a href="http://op12no2.me/stuff/rough.pdf" target="_blank">Herd Immunity: a rough guide</a>. Clin Infect Dis. 2011. 52(7):911-916.