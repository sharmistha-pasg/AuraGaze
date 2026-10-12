export interface SampleFixture {
  title: string;
  byline: string;
  siteName: string;
  contentHtml: string;
  textLength: number;
}

export const sampleFixture: SampleFixture = {
  title: 'The Living Air Conditioners: How Honeybees Keep Their Hives Cool in Summer',
  byline: 'By Dr. Eleanor Vance',
  siteName: 'Daily Science Dispatch',
  contentHtml: `<p>While a blistering summer afternoon can easily push ambient temperatures well past 38 degrees Celsius (100 degrees Fahrenheit), the interior of a healthy honeybee colony remains remarkably stable between 32 and 35 degrees Celsius. If the temperature climbs even a degree or two higher, the delicate wax comb begins to soften and slump, and the vulnerable developing brood risks irreversible damage. Without electrical air conditioners or computerized thermostats, an insect colony achieves this extraordinary feat of microclimate regulation entirely through collective behavioral thermodynamics.</p>

<p>The cooling operation begins the moment internal temperature scouts detect heat spikes along the core comb chambers. Rather than continuing their normal foraging for floral nectar or pollen, designated worker bees abruptly transition into emergency water foragers. These bees make rapid round trips to nearby puddles, ponds, and damp moss beds, loading their honey crops with cool liquid.</p>

<p>Once back inside the dark hive, the water carriers do not simply unload the liquid at random. Instead, receiver bees accept the moisture via trophallaxis—mouth-to-mouth liquid exchange—and carefully spread thin, glistening films of water across the open cell rims and over the wax cappings of the brood nest.</p>

<h2>Wing-Fanning and Forced Convection</h2>

<p>Spreading moisture across comb surfaces is only the initial stage of the cooling cycle. To drive rapid evaporation, hundreds of worker bees assemble in synchronized rows near the hive entrance and along internal ventilation corridors. Orienting their bodies toward the interior and anchoring firmly with their claws, they beat their wings at rapid frequencies to generate steady, directional air currents.</p>

<blockquote>A single bee's wing produces only a whisper of air, but thousands of bees fanning in coordinated harmony create a forced-air convection system that rivals modern industrial ventilation.</blockquote>

<p>Some bees draw fresh air inward across the damp combs, while teams stationed on the opposite side exhaust warm, moisture-laden air through the hive entrance. In severe heat, workers employ droplet manipulation: a bee regurgitates a tiny drop of water onto her proboscis, exposing it to air currents. As the water evaporates, it cools the fluid, which the bee swallows back into her body, using her own physiology as a biological heat exchanger.</p>

<h2>Thermal Absorption and Colony Bearding</h2>

<figure>
  <svg viewBox="0 0 600 300" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Honeybees regulating hive temperature on honeycomb">
    <rect width="600" height="300" fill="#fef3c7"/>
    <g fill="#fde68a" stroke="#d97706" stroke-width="2">
      <polygon points="100,50 140,50 160,85 140,120 100,120 80,85"/>
      <polygon points="180,50 220,50 240,85 220,120 180,120 160,85"/>
      <polygon points="260,50 300,50 320,85 300,120 260,120 240,85"/>
      <polygon points="340,50 380,50 400,85 380,120 340,120 320,85"/>
      <polygon points="420,50 460,50 480,85 460,120 420,120 400,85"/>
      <polygon points="140,120 180,120 200,155 180,190 140,190 120,155"/>
      <polygon points="220,120 260,120 280,155 260,190 220,190 200,155"/>
      <polygon points="300,120 340,120 360,155 340,190 300,190 280,155"/>
      <polygon points="380,120 420,120 440,155 420,190 380,190 360,155"/>
      <polygon points="180,190 220,190 240,225 220,260 180,260 160,225"/>
      <polygon points="260,190 300,190 320,225 300,260 260,260 240,225"/>
      <polygon points="340,190 380,190 400,225 380,260 340,260 320,225"/>
    </g>
    <text x="300" y="275" font-family="sans-serif" font-size="14" fill="#78350f" text-anchor="middle">Worker honeybees maintaining optimal thermal homeostasis</text>
  </svg>
  <figcaption>Thermal equilibrium across honeycomb cells during peak summer afternoon.</figcaption>
</figure>

<p>When atmospheric heat reaches unbearable extremes, bees deploy behavioural evacuation known as "bearding." Thousands of worker bees leave the central nursery and cluster densely outside the entrance, hanging in quiet beard-like masses under the hive floor. By vacating the interior, they immediately remove thousands of metabolic heat sources from the nursery.</p>

<p>Concurrently, specialized nurse bees press their bodies directly against the hottest comb sections. Their circulatory systems absorb excess heat, which they carry away to cooler peripheral walls. Through this combination of evaporative cooling, active ventilation, and selfless behavioral shielding, honeybee colonies master severe heat waves that would otherwise destroy their colony.</p>`,
  textLength: 530,
};

export default sampleFixture;
