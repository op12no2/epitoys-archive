
exp

**********

Iterative SEIR replication

**********

<p>
Standard iterative SEIR models remove people from E and I by
assuming an average rate, for example:-
<p>
<pre>
I<sub>n+1</sub> = I<sub>n</sub> - k<sub>1</sub>I + k<sub>2</sub>E
</pre>
<p>
This can be replicated in an agent based model by assigning
each person a length of time to stay in E and I based on an
exponential random number generator, with the means being the
inverse of k<sub>1</sub> and k<sub>2</sub>.
<p>
Incidence in a standard iterative model is based on an assumption
of homogeneous mixing and an average per capita contact rate.
For example:-
<p>
<pre>
S<sub>n+1</sub> = S<sub>n</sub> - bS<sub>n</sub>I<sub>n</sub>
</pre>
<p>
In this agent based model, an infectee has a radius of infection
(r), a probability of infecting a susceptible (q) and susceptibles
have a probability of becoming infected (p). The iterative model
can be replicated by setting r=infinity, q=1 and p=b.
<p>
The people are moving about in this scenario but it is irrelevant
because of the infinite radius of infection.
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
  Len: {func: randE, args: {mean: 10}}
};

work.Colour = '#669c41';

states.i = {
  Label: work.iText,
  dirFarX: {func: randUMM, args: {min: -2, max: 2}},
  dirFarY: {func: randUMM, args: {min: -2, max: 2}},
  dirSwap: {func: randUMM, args: {min: 1,  max: 100}},
  Colour: work.Colour,
  Size: work.Size,
  Len: {func: randE, args: {mean: 30}},
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

