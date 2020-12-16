
gauss

**********

Iterative SEIR replication with Gaussian state lengths

**********

<p>
The
<a href="http://op12no2.me/toys/pox?scenario=exp">exp</a>
scenario shows how a classic iterative
model can be replicated in an agent based framework.
Inherrent in such models is that latent (E) and infectious (I)
periods are exponentially distributed; i.e. while the
periods operate around a mean value, there will be some
very large and unrealistic values.
<p>
This scenario is similar, but the exponential state
lengths for E and I have been replaced with
<a href="http://rsif.royalsocietypublishing.org/content/10/84/20130098.short">more representative</a>
Gaussian ones by simply calling a different random number
generator.  Specifically this:-
<p>
<pre>
states.e.Len = {func: randE, args: {mean: 10}};
states.i.Len = {func: randE, args: {mean: 30}};
</pre>
<p>
Has become:-
<p>
<pre>
states.e.Len = {func: randG, args: {mean: 10, sd: 3}};
states.i.Len = {func: randG, args: {mean: 30, sd: 9}};
</pre>
<p>
This is one of the advantages of agent
based models; it is very easy to explore different
distributions - much harder in iterative ones.
<p>
The comparative state history graphs are interesting.
<p>
<b>Click Start to run the model...</b

**********

user.endLoops  = 300;
user.endStates = [];
user.autoDesc  = false;
user.autoStart = false;
user.autoHis   = false;
user.autoGraph = '';

work.Size     = Math.max(glob.minHW / 50,2);
work.Infinity = 10000000;
work.Colour   = '#f7d17a';
work.sText    = 'Susceptible';
work.eText    = 'Exposed';
work.iText    = 'Infected';
work.rText    = 'Recovered';
work.uText    = 'Unvaccinated';
work.vText    = 'Vaccinated';
work.fText    = 'Freeloader';

states.s = {
  Label: work.sText,
  dirFarX: {func: randUMM, args: {min: -2, max: 2}},
  dirFarY: {func: randUMM, args: {min: -2, max: 2}},
  dirSwap: {func: randUMM, args: {min: 1,  max: 100}},
  Colour: work.Colour,
  Size: work.Size,
  Prob: 0.0005
};

work.Colour = '#f2861d';

states.e = {
  Label: work.eText,
  dirFarX: {func: randUMM, args: {min: -2, max: 2}},
  dirFarY: {func: randUMM, args: {min: -2, max: 2}},
  dirSwap: {func: randUMM, args: {min: 1,  max: 100}},
  Colour: work.Colour,
  Size: work.Size,
  Len: {func: randG, args: {mean: 10, sd: 3}}
};

work.Colour = '#669c41';

states.i = {
  Label: work.iText,
  dirFarX: {func: randUMM, args: {min: -2, max: 2}},
  dirFarY: {func: randUMM, args: {min: -2, max: 2}},
  dirSwap: {func: randUMM, args: {min: 1,  max: 100}},
  Colour: work.Colour,
  Size: work.Size,
  Len: {func: randG, args: {mean: 30, sd: 9}},
  Dist: work.Infinity,
  Prob: 1.0
};

work.Colour = '#9999ff';

states.r = {
  Label: work.rText,
  dirFarX: {func: randUMM, args: {min: -2, max: 2}},
  dirFarY: {func: randUMM, args: {min: -2, max: 2}},
  dirSwap: {func: randUMM, args: {min: 1,  max: 100}},
  Colour: work.Colour,
  Size: work.Size
};

init.push({
  Pop:   999,
  State: sState,
  Age: 0,
  Left:  {func: randUMM, args: {min: glob.minLeft, max: glob.maxRight}},
  Top:   {func: randUMM, args: {min: glob.minTop,  max: glob.maxBottom}}
});

init.push({
  Pop:   1,
  State: eState,
  Age: 0,
  Left:  {func: randUMM, args: {min: glob.minLeft, max: glob.maxRight}},
  Top:   {func: randUMM, args: {min: glob.minTop,  max: glob.maxBottom}}
});

scenarioCallback = function (p) {
}

drawCallback = function () {
}

