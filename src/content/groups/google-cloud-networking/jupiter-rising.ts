import type { Reference, Subject } from '../../../types/content';

const JR = (section: string): Reference => ({
  sourceTitle: 'Jupiter Rising: A Decade of Clos Topologies and Centralized Control (SIGCOMM 2015)',
  url: 'https://research.google/pubs/jupiter-rising-a-decade-of-clos-topologies-and-centralized-control-in-googles-datacenter-network/',
  locator: { kind: 'section', section },
});

export const jupiterRising: Subject = {
  id: 'jr',
  name: 'Jupiter Rising (SIGCOMM 2015) (TPM III Prep)',
  description:
    'Five generations of Google datacenter fabrics (Firehose → Jupiter) using Clos, merchant silicon, and Firepath centralized control. TPM III emphasis: generational migration programs, cost/performance trade-offs, vendor strategy, incremental scaling risk, and how fabric properties directly support Workspace latency and availability SLOs. Balanced answer options.',
  questions: [
    {
      id: 'jr-themes',
      prompt:
        'Jupiter Rising attributes Google’s datacenter networking success to three principles. Which trio is correct?',
      correct: {
        id: 'a',
        text: 'Clos topologies, merchant silicon, and centralized control',
      },
      incorrect: [
        { id: 'b', text: 'Optical circuit switching, BGP on every switch, and chassis routers' },
        { id: 'c', text: 'MPLS label switching, RSVP-TE tunnels, and spanning-tree bridging' },
        { id: 'd', text: 'Per-host overlay tunnels, edge NAT gateways, and stateful firewalls' },
        { id: 'e', text: 'Token-ring rings, FDDI dual counter-rotating loops, and ATM cells' },
      ],
      explanation:
        'The paper unifies a decade and five generations under three ideas: (1) multi-stage Clos topologies built from (2) commodity merchant silicon, controlled by (3) a centralized mechanism (Firepath) rather than complex decentralized protocols.',
      reference: JR('Introduction — three themes'),
      tags: ['themes'],
    },
    {
      id: 'jr-generations',
      prompt: 'Which sequence lists Google’s datacenter fabric generations in order?',
      correct: { id: 'a', text: 'Firehose → Watchtower → Saturn → Jupiter' },
      incorrect: [
        { id: 'b', text: 'Jupiter → Saturn → Watchtower → Firehose' },
        { id: 'c', text: 'Saturn → Jupiter → Firehose → Watchtower' },
        { id: 'd', text: 'B2 → B4 → Andromeda → Jupiter' },
        { id: 'e', text: 'Firehose → Saturn → Jupiter → Watchtower' },
      ],
      explanation:
        'The lineage is Firehose 1.0/1.1 (the first custom Clos attempts), then Watchtower, then Saturn, then Jupiter — each adding bandwidth and scale using newer merchant silicon.',
      reference: JR('Network evolution — generations'),
      tags: ['generations', 'history'],
    },
    {
      id: 'jr-firepath',
      prompt: 'What is Firepath in Jupiter-era fabrics?',
      correct: {
        id: 'a',
        text: 'Centralized routing: switches report link state to a replicated master that computes and pushes forwarding tables',
      },
      incorrect: [
        { id: 'b', text: 'An optical circuit switch that physically steers light beams between aggregation blocks across the whole fabric core' },
        { id: 'c', text: 'The Top-of-Rack switch hardware platform used for attaching individual servers to the datacenter fabric access edge' },
        { id: 'd', text: 'A distributed congestion-control algorithm running on each switch CPU per flow' },
        { id: 'e', text: 'The WAN traffic-engineering controller also deployed in the B4 backbone network' },
      ],
      explanation:
        'Rather than running a full distributed routing protocol on every switch, Jupiter switches run a Firepath client that reports link state over a separate Control-Plane Network to a centralized (replicated) Firepath master, which computes routes globally and pushes them down.',
      reference: JR('Routing — Firepath'),
      tags: ['control-plane', 'firepath'],
    },
    {
      id: 'jr-blocks',
      prompt: 'What are the main building blocks of the Jupiter fabric?',
      correct: {
        id: 'a',
        text: 'ToR switches, aggregation blocks, and spine blocks',
      },
      incorrect: [
        { id: 'b', text: 'Optical circuit switches, WDM wavelength multiplexers, and circulators' },
        { id: 'c', text: 'Carrier core routers, customer premises equipment, and access modems' },
        { id: 'd', text: 'Dedicated leaf routers, root routers, and inter-rack trunk routers' },
        { id: 'e', text: 'Inline firewalls, hardware load balancers, and edge caching proxies' },
      ],
      explanation:
        'Jupiter is a multi-tier Clos: servers attach to ToRs; ToRs connect into aggregation blocks (middle blocks); aggregation blocks connect through spine blocks at the top of the fabric.',
      reference: JR('Jupiter — building blocks'),
      tags: ['architecture', 'building-blocks'],
    },
    {
      id: 'jr-bisection',
      prompt: 'Roughly how much bisection bandwidth did the Jupiter generation deliver?',
      correct: { id: 'a', text: 'About 1.3 Pbps (petabits per second)' },
      incorrect: [
        { id: 'b', text: 'About 1.3 Tbps (terabits per second)' },
        { id: 'c', text: 'About 1.3 Gbps (gigabits per second)' },
        { id: 'd', text: 'About 130 Tbps (terabits per second)' },
        { id: 'e', text: 'About 13 Ebps (exabits per second)' },
      ],
      explanation:
        'Jupiter scaled to ~1.3 Pbps of bisection bandwidth across a building — enough for tens of thousands of servers to communicate at high rate, roughly a 100x increase over the earliest generations.',
      reference: JR('Jupiter — scale'),
      tags: ['capacity', 'bisection'],
    },
    {
      id: 'jr-why-central',
      prompt:
        'Why did Google favor centralized control over standard distributed routing protocols inside the datacenter?',
      correct: {
        id: 'a',
        text: 'In a single-operator, known topology, distributed protocols add needless complexity; centralized control simplifies management',
      },
      incorrect: [
        { id: 'b', text: 'Distributed routing protocols are strictly banned inside Google production datacenters for security and regulatory compliance reasons' },
        { id: 'c', text: 'Merchant-silicon switches lack the CPU and memory resources to run any standard routing protocol at all' },
        { id: 'd', text: 'BGP and OSPF are fundamentally incompatible with the merchant-silicon forwarding ASICs used in the fabric' },
        { id: 'e', text: 'The OpenFlow standard formally mandates fully centralized control for every single standards-compliant production network deployment' },
      ],
      explanation:
        'Decentralized protocols are built for arbitrary, multi-operator topologies. Inside a known, single-owner datacenter that generality is overkill, so Google pushed a global configuration and used Firepath’s centralized computation for simpler, faster, more predictable behavior.',
      reference: JR('Themes — centralized control'),
      tags: ['control-plane', 'design'],
    },
    {
      id: 'jr-cpn',
      prompt: 'What is the Control-Plane Network (CPN) in Jupiter?',
      correct: {
        id: 'a',
        text: 'A separate out-of-band network linking switches to the Firepath master(s)',
      },
      incorrect: [
        { id: 'b', text: 'The wavelength assignment plan governing the optical OCS circuit-switching layer' },
        { id: 'c', text: 'The in-band data-plane links that carry production user and server traffic' },
        { id: 'd', text: 'The wide-area WAN connection bridging this fabric to other datacenters' },
        { id: 'e', text: 'The dedicated management VLAN used to reach server BMCs and IPMI ports' },
      ],
      explanation:
        'Jupiter separates control from data: the CPN is an out-of-band network used by Firepath clients/master and other control functions, so control traffic doesn’t compete with — or depend on — the data plane it manages.',
      reference: JR('Control-plane network'),
      tags: ['control-plane', 'cpn'],
    },
    {
      id: 'jr-radix',
      prompt: 'How did newer fabric generations mainly increase capacity?',
      correct: {
        id: 'a',
        text: 'By using faster, higher-radix merchant-silicon chips and scaling out the Clos',
      },
      incorrect: [
        { id: 'b', text: 'By replacing the entire multi-stage Clos fabric with one single massive high-radix proprietary chassis router' },
        { id: 'c', text: 'By introducing optical circuit switching everywhere in place of all the existing electronic packet switches' },
        { id: 'd', text: 'By aggressively overclocking the very same existing merchant-silicon chips year after year after year' },
        { id: 'e', text: 'By adding line-rate hardware packet compression and deduplication inside every single switch ASIC' },
      ],
      explanation:
        'Each generation rode a new merchant-silicon chip (higher-speed ports) and scaled the Clos out, multiplying bisection bandwidth while keeping the commodity-building-block approach.',
      reference: JR('Network evolution — generations'),
      tags: ['hardware', 'scaling'],
    },
    {
      id: 'jr-cbr',
      prompt: 'How does a Jupiter fabric connect to the WAN / outside world?',
      correct: {
        id: 'a',
        text: 'Through Cluster Border Routers that speak BGP to external networks like B4/B2',
      },
      incorrect: [
        { id: 'b', text: 'Each individual Top-of-Rack switch has its own dedicated public internet uplink port' },
        { id: 'c', text: 'The spine blocks plug straight into the public internet and peer externally over BGP' },
        { id: 'd', text: 'Only through the optical OCS circuit-switching layer at the top' },
        { id: 'e', text: 'It cannot connect outside the building and is fully air-gapped' },
      ],
      explanation:
        'Cluster Border Routers (CBRs) bridge the centrally-controlled fabric to the BGP-speaking WAN, keeping the internal fabric’s special control model isolated from external routing.',
      reference: JR('External connectivity'),
      tags: ['routing', 'wan'],
    },
    {
      id: 'jr-limitation',
      prompt: 'What structural limitation of the Clos-with-spine design later motivated Jupiter Evolving?',
      correct: {
        id: 'a',
        text: 'Upgrading capacity required spine changes, forcing disruptive fabric-wide work and complicating mixed-generation blocks',
      },
      incorrect: [
        { id: 'b', text: 'Clos fabrics are fundamentally unable to use ECMP for multi-path load balancing across any redundant parallel uplinks at all' },
        { id: 'c', text: 'Merchant-silicon ASICs reached a hard performance ceiling several years ago and have now simply stopped improving in speed' },
        { id: 'd', text: 'Centralized Firepath control could not scale beyond roughly ten switches per fabric' },
        { id: 'e', text: 'The internal fabric had no mechanism whatsoever to run BGP toward external networks' },
      ],
      explanation:
        'A fixed spine layer ties the whole fabric to one generation/speed: growing or refreshing capacity means rebuilding the spine. That rigidity (plus the spine’s cost and power) is what Jupiter Evolving removes with an OCS direct-connect layer.',
      reference: JR('Lessons & future work'),
      tags: ['limitations', 'evolution'],
    },
    {
      id: 'jr-costtheme',
      prompt: 'According to Jupiter Rising, building-scale networks became cost-effective primarily because…',
      correct: {
        id: 'a',
        text: 'Multi-stage Clos topologies let inexpensive commodity switch silicon replace costly, hard-to-scale high-radix chassis routers',
      },
      incorrect: [
        { id: 'b', text: 'Optical circuit switching eliminated all the electronic packet switches' },
        { id: 'c', text: 'Long-haul fiber and optical transceivers became essentially free at scale' },
        { id: 'd', text: 'They stopped using redundancy and over-provisioning to cut hardware costs' },
        { id: 'e', text: 'They moved nearly all networking functions onto rented public-cloud capacity' },
      ],
      explanation:
        'The first unifying theme: Clos + merchant silicon delivers building-scale bandwidth at commodity prices, avoiding the cost and scaling ceiling of big proprietary routers.',
      reference: JR('Themes — cost effectiveness'),
      tags: ['themes', 'cost'],
    },
    {
      id: 'jr-fabric',
      prompt: "A goal of treating the datacenter network as a 'fabric' is to…",
      correct: {
        id: 'a',
        text: 'Make tens of thousands of servers behave as one giant high-bandwidth switch with uniform any-to-any capacity',
      },
      incorrect: [
        { id: 'b', text: 'Allow every individual rack to run a completely different routing protocol of its own for maximum flexibility' },
        { id: 'c', text: 'Give each application or tenant its own physically isolated and separately cabled dedicated network infrastructure' },
        { id: 'd', text: 'Completely eliminate the need for any Top-of-Rack switches anywhere in the architecture' },
        { id: 'e', text: 'Replace Ethernet entirely with InfiniBand fabrics for lower latency inside the building' },
      ],
      explanation:
        'The fabric abstraction hides the multi-stage Clos behind the illusion of a single huge switch with near-uniform any-to-any bandwidth — exactly what distributed datacenter workloads need.',
      reference: JR('Introduction — fabric abstraction'),
      tags: ['concepts', 'fabric'],
    },
    {
      id: 'jr-migration-tpm',
      prompt: 'When a TPM is leading a multi-year program to migrate an existing Firehose/Watchtower fabric to Jupiter generation hardware while the building remains in production, what is the primary risk-mitigation benefit of the Clos + merchant-silicon approach?',
      correct: {
        id: 'a',
        text: 'New blocks deploy and validate in parallel with live traffic on old blocks, using ECMP and Firepath for gradual shifts and rollback',
      },
      incorrect: [
        { id: 'b', text: 'The entire fabric must be fully powered down and recabled in a single weekend change window' },
        { id: 'c', text: 'All servers must first be migrated onto brand-new ToRs before any spine upgrades can begin' },
        { id: 'd', text: 'Centralized Firepath control makes it strictly impossible to ever run any single mixed-generation switch hardware in the same fabric' },
        { id: 'e', text: 'Migration requires a full forklift replacement of every single switch simultaneously in order to maintain the non-blocking fabric properties' },
      ],
      explanation:
        'Clos fabrics are inherently incremental. A TPM can stand up new Jupiter blocks, drain traffic from older paths via ECMP weights or Firepath policy, validate stability, then expand — all without a big-bang cutover. This dramatically lowers program schedule risk and lets you maintain availability SLOs for Workspace services throughout the refresh.',
      reference: JR('Network evolution — generations'),
      tags: ['migration', 'deployment', 'tpm'],
    },
    {
      id: 'jr-cost-tpm',
      prompt: 'How does the merchant-silicon + Clos design philosophy in Jupiter Rising influence a TPM’s approach to vendor selection and long-term procurement strategy for Cloud Networking hardware programs?',
      correct: {
        id: 'a',
        text: 'It cuts dependence on any single chassis vendor and speeds adoption of new ASICs',
      },
      incorrect: [
        { id: 'b', text: 'It locks the entire program into one single proprietary merchant-silicon vendor for the full multi-year operational lifetime of the fabric' },
        { id: 'c', text: 'It raises overall capital expenditure because cheap commodity switches end up requiring far more expensive optical transceivers and cabling' },
        { id: 'd', text: 'It forces every single hardware purchase to go through one chosen systems integrator that builds fully custom in-house ASICs for the program' },
        { id: 'e', text: 'It removes the need for almost any vendor management at all because the cheap commodity switches are now entirely fully interchangeable' },
      ],
      explanation:
        'By building from commodity chips rather than proprietary big-iron routers, Google gained leverage in negotiations, could qualify multiple ODMs, and could ride the merchant silicon roadmap (new speeds, features) without waiting for one vendor’s chassis refresh cycle. TPMs use this to build resilient supply chains and accelerate generational upgrades.',
      reference: JR('Themes — merchant silicon'),
      tags: ['procurement', 'cost', 'tpm'],
    },
  ],
};
