// NOTE: Prices are approximate demo values. Replace with actual prices from the client.
export const categories = [
  {
    slug: "borewell-submersible",
    name: "Borewell Submersible Pumps",
    image: "/images/borewell-submersible-pumps.jpg",
    tagline: "Reliable water supply from deep borewells",
    description:
      "Borewell submersible pumpsets sit deep inside the borewell and push water up to your tank. They are built for continuous use and are available for 75 mm and 100 mm borewells, in water-filled and oil-filled motor versions.",
    price: "₹ 12,000 - 25,000",
    highlights: [
      "Motor range from 0.5 HP to 3 HP",
      "Suitable for 75 mm and 100 mm borewells",
      "Water-filled and oil-filled motor options",
      "ISI marked and star rated models available",
      "Supplied with 3 metre cable and non-return valve (NRV)",
    ],
    applications: ["Homes and bungalows", "Apartments and societies", "Farms and small irrigation"],
    series: [
      { name: "CORA 75 + UMAI", hp: "0.5 – 1.5 HP", info: "For 75 mm borewells, 210V single phase" },
      { name: "CORA + LX PLUS", hp: "0.5 – 2.0 HP", info: "For 100 mm borewells, 220V, star rated models available" },
      { name: "CORA + XUMA DX", hp: "0.5 – 2.0 HP", info: "For 100 mm borewells, 220V single phase" },
      { name: "CORA + RLX", hp: "0.5 – 2.0 HP", info: "For 100 mm borewells, 220V single phase" },
      { name: "CORA + UMN (Oil Filled)", hp: "0.5 – 3.0 HP", info: "For 100 mm borewells, oil filled motor" },
    ],
  },
  {
    slug: "self-priming-monobloc",
    name: "Monobloc & Domestic Pumps",
    image: "/images/monobloc-domestic-pumps.jpg",
    tagline: "Everyday water supply for your home",
    description:
      "Monobloc pumps are compact surface pumps that lift water from a sump, tank or ground-level source to your overhead tank. Self-priming models start easily and are ideal for daily domestic use.",
    price: "₹ 4,500 – 9,000",
    highlights: [
      "Self-priming design for easy start-up",
      "0.5 HP to 1.5 HP for domestic models",
      "Compact and easy to install",
      "Durable body options: aluminium, die cast and cast iron",
      "Heavy-duty AGRIBLOC range available for farm use",
    ],
    applications: ["Overhead tank filling", "Garden and lawn watering", "Small farm and plantation use"],
    series: [
      { name: "AQUA", hp: "0.5 – 1.5 HP", info: "Self-priming monobloc, 25x25 mm, 220V" },
      { name: "CUTE PLUS", hp: "0.5 – 1.0 HP", info: "Compact mini monobloc, 240V" },
      { name: "PERISTAR", hp: "0.5 – 1.5 HP", info: "Self-priming monobloc (V, SZX, GS, ZDX models)" },
      { name: "PERIJET", hp: "0.5 – 1.5 HP", info: "Self-priming jet pump, 230V" },
      { name: "TSJ", hp: "1.0 HP", info: "Two-stage jet pump" },
      { name: "AGRIBLOC", hp: "0.5 – 3.0 HP", info: "Centrifugal monobloc for farm and heavy-duty use" },
    ],
  },
  {
    slug: "booster",
    name: "Booster & Pressure Systems",
    image: "/images/booster-pressure-systems.jpg",
    tagline: "Strong, steady water pressure at every tap",
    description:
      "Booster systems raise the pressure of your existing water supply so showers, taps and upper floors get a strong, steady flow. Multistage models come with a pressure tank for smooth, quiet operation.",
    price: "₹ 8,000 – 16,000",
    highlights: [
      "Automatic start and stop with pressure control",
      "Multistage models with pressure tank",
      "0.5 HP to 2 HP options",
      "Suitable for multiple shower heads",
      "Quiet and energy-efficient operation",
    ],
    applications: ["Bathrooms and showers", "Upper floors and duplexes", "Hotels, hostels and small buildings"],
    series: [
      { name: "MULTIBOOST", hp: "0.5 – 2.0 HP", info: "Multistage pressure booster system, 220V" },
      { name: "PERIBOOST PLUS", hp: "0.5 – 1.0 HP", info: "Compact pressure booster, 220V" },
    ],
  },
  {
    slug: "openwell-submersible",
    name: "Openwell & Vertical Pumps",
    image: "/images/openwell-vertical-pumps.jpg",
    tagline: "Powerful pumping from open wells and tanks",
    description:
      "Openwell submersible pumps work inside open wells, tanks and ponds. Horizontal monobloc and vertical multistage models are available, covering both high-flow irrigation needs and high-head domestic supply.",
    price: "₹ 9,000 – 18,000",
    highlights: [
      "Horizontal monobloc and vertical multistage designs",
      "0.5 HP to 2 HP options",
      "Single phase and three phase models",
      "Star rated and ISI marked models available",
      "Stainless steel models for long life",
    ],
    applications: ["Open well water supply", "Irrigation and sprinklers", "Tank and pond pumping"],
    series: [
      { name: "OPAL i", hp: "0.5 – 2.0 HP", info: "Openwell submersible monobloc, star rated, 220V" },
      { name: "MONOSUB R", hp: "0.5 – 2.0 HP", info: "Openwell submersible, single and three phase" },
      { name: "MULTISUB", hp: "1.0 – 1.5 HP", info: "Vertical multistage openwell submersible, 240V" },
    ],
  },
  {
    slug: "dewatering-sewage",
    name: "Dewatering & Sewage Pumps",
    image: "/images/dewatering-sewage-pumps.jpg",
    tagline: "Tough pumps for drainage and wastewater",
    description:
      "Dewatering and sewage pumps remove water from basements, pits and drains, and handle wastewater containing solids. Built with strong casings and large free passage to resist clogging.",
    price: "₹ 10,000 – 22,000",
    highlights: [
      "Handles dirty water and wastewater with solids",
      "Free passage from 10 mm up to 100 mm",
      "Float switch models for automatic operation",
      "Single phase and three phase options",
      "Strong, corrosion-resistant construction",
    ],
    applications: ["Basement and parking drainage", "Sewage and drain pits", "Construction sites and sumps"],
    series: [
      { name: "AMA PORTER", hp: "1.0 – 2.0 HP", info: "Vertical dewatering pump, single and three phase" },
      { name: "AMA DRAINER", hp: "Not specified", info: "Vertical dewatering pump, 230V" },
      { name: "KSTP", hp: "1.0 – 3.0 HP", info: "Sewage submersible pump, 50 mm outlet" },
      { name: "AMAREX IN", hp: "1.1 – 5.6 HP", info: "Wastewater submersible pump, three phase" },
      { name: "KRTU", hp: "1.5 – 12.7 HP", info: "Non-clog submersible sewage pump" },
    ],
  },
];