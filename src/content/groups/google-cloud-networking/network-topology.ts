import type { Reference, Subject } from '../../../types/content';

// Reference helpers. URLs included only where verified; concept-level questions
// cite the topic without a (potentially stale) link.
const VIRGO = (section: string): Reference => ({
  sourceTitle: 'Introducing Virgo: Google’s megascale AI data center fabric (Google Cloud, 2026)',
  url: 'https://cloud.google.com/blog/products/networking/introducing-virgo-megascale-data-center-fabric',
  locator: { kind: 'section', section },
});
const JUPITER = (section: string): Reference => ({
  sourceTitle: 'The evolution of Google’s Jupiter data center network (Google Cloud)',
  url: 'https://cloud.google.com/blog/topics/systems/the-evolution-of-googles-jupiter-data-center-network',
  locator: { kind: 'section', section },
});
const META = (section: string): Reference => ({
  sourceTitle: 'Meta Engineering — data center fabric & network planes',
  url: 'https://engineering.fb.com/2014/11/14/production-engineering/introducing-data-center-fabric-the-next-generation-facebook-data-center-network/',
  locator: { kind: 'section', section },
});
const META_DSF = (section: string): Reference => ({
  sourceTitle: 'Meta Engineering — Disaggregated Scheduled Fabric (2025)',
  url: 'https://engineering.fb.com/2025/10/20/data-center-engineering/disaggregated-scheduled-fabric-scaling-metas-ai-journey/',
  locator: { kind: 'section', section },
});
const TOPO = (section: string): Reference => ({
  sourceTitle: 'Datacenter & AI fabric topologies (Clos, fat-tree, leaf-spine, rail, Dragonfly)',
  locator: { kind: 'section', section },
});

export const networkTopology: Subject = {
  id: 'topo',
  name: 'Network Topology — Hyperscale & AI Fabrics (TPM III Prep)',
  description:
    'Topology vocabulary for modern hyperscale and AI datacenters: leaf-spine/folded Clos, fat-tree, rail-optimized and multi-plane AI fabrics, flat high-radix designs, Google’s Jupiter and Virgo, Meta’s network planes, Dragonfly, and the metrics (bisection, diameter, oversubscription, blast radius) behind topology trade-offs. Answer lengths are deliberately mixed so length never signals the correct choice.',
  questions: [
    {
      id: 'topo-leafspine',
      prompt: 'In a two-tier leaf-spine fabric, how are leaves and spines connected?',
      correct: { id: 'a', text: 'Every leaf links to every spine; leaves never connect to each other' },
      incorrect: [
        { id: 'b', text: 'Each leaf connects to just one spine, and that spine is the only path between racks' },
        { id: 'c', text: 'Leaves are daisy-chained together and forward traffic upward to one root spine on top' },
        { id: 'd', text: 'Spines connect only to other spines while leaves hang beneath them in a strict tree' },
        { id: 'e', text: 'Each spine connects to a single dedicated leaf to guarantee one isolated path per rack' },
      ],
      explanation:
        'Leaf-spine is a folded Clos: every leaf (ToR/aggregation) uplinks to every spine in a full mesh, so any leaf-to-leaf path is two hops and there are as many equal-cost paths as spines. You scale bandwidth/ports by adding more spines or leaves.',
      reference: TOPO('Leaf-spine architecture'),
      tags: ['topology', 'leaf-spine'],
    },
    {
      id: 'topo-folded-clos',
      prompt: "What does 'folded Clos' mean?",
      correct: { id: 'a', text: 'A multi-stage Clos folded into fewer tiers for datacenter use' },
      incorrect: [
        { id: 'b', text: 'A Clos network physically bent so the ingress and egress stages share the same rack rows' },
        { id: 'c', text: 'A cabling pattern that folds fiber trunks back on themselves to fit dense patch panels' },
        { id: 'd', text: 'A routing mode that folds many equal-cost paths down into one logical link for simplicity' },
        { id: 'e', text: 'A scheme that folds every spine switch into the leaves so no spine tier exists at all' },
      ],
      explanation:
        'A classic 3-stage Clos has separate ingress, middle, and egress stages. "Folding" merges the ingress and egress stages into one set of edge switches (the leaves), with the middle stage as the spine — which is exactly the leaf-spine design used in datacenters.',
      reference: TOPO('Folded Clos'),
      tags: ['topology', 'clos'],
    },
    {
      id: 'topo-fattree',
      prompt: "A 'fat-tree' topology is best described as…",
      correct: {
        id: 'a',
        text: 'A folded Clos whose aggregate link bandwidth fattens toward the core to deliver full bisection from commodity switches',
      },
      incorrect: [
        { id: 'b', text: 'A tree where the single root switch is given far more capacity than the leaves' },
        { id: 'c', text: 'A spanning-tree variant that blocks redundant links to prevent forwarding loops' },
        { id: 'd', text: 'A cabling layout in which trunk bundles physically thicken as they near the core routers' },
        { id: 'e', text: 'A design that dedicates a separate high-radix core router to each rack in a row' },
      ],
      explanation:
        'In a fat-tree (Al-Fares et al., SIGCOMM 2008), "fatness" is constant aggregate bandwidth as you move up tiers — achieved with many parallel links among identical commodity switches, not fatter individual links. It targets full bisection bandwidth for east-west traffic.',
      reference: TOPO('Fat-tree (Al-Fares et al., 2008)'),
      tags: ['topology', 'fat-tree'],
    },
    {
      id: 'topo-3tier',
      prompt: 'What problem does leaf-spine solve versus a classic 3-tier (access/aggregation/core) design?',
      correct: {
        id: 'a',
        text: 'It removes the aggregation bottleneck and adds many equal-cost paths for far better east-west bandwidth',
      },
      incorrect: [
        { id: 'b', text: 'It removes the need for switches entirely by cabling all of the servers directly to one another in a full mesh' },
        { id: 'c', text: 'It moves every server uplink straight onto the WAN edge so internal traffic no longer crosses any local switch at all' },
        { id: 'd', text: 'It guarantees zero packet loss by giving each server its own private path to the core' },
        { id: 'e', text: 'It replaces Ethernet with InfiniBand to cut latency between the network tiers' },
      ],
      explanation:
        'Classic 3-tier designs funnel traffic up through an aggregation layer that bottlenecks growing east-west (server-to-server) traffic. Leaf-spine flattens this: full leaf-to-spine meshing yields many equal-cost paths, predictable two-hop latency, and graceful degradation.',
      reference: TOPO('3-tier vs leaf-spine'),
      tags: ['topology', 'leaf-spine', 'east-west'],
    },
    {
      id: 'topo-rail',
      prompt: "In a rail-optimized AI cluster, what is a 'rail'?",
      correct: {
        id: 'a',
        text: 'A slice that links the same GPU rank across all servers onto shared switches',
      },
      incorrect: [
        { id: 'b', text: 'A redundant power bus feeding each GPU shelf in the rack independently' },
        { id: 'c', text: 'A dedicated short fiber run wired directly between two physically adjacent GPUs inside a single server chassis' },
        { id: 'd', text: 'A scheduling lane that strictly serializes the collective operations so that no two of them ever overlap in time' },
        { id: 'e', text: 'A separate optical plane carrying only control traffic for the fabric' },
      ],
      explanation:
        'In multi-GPU servers each GPU has its own NIC. A rail groups the same GPU index (rank) across every server onto common switches, so rank-aligned traffic stays on direct, predictable paths.',
      reference: TOPO('Rail-optimized fabrics'),
      tags: ['ai', 'rail-optimized'],
    },
    {
      id: 'topo-rail-why',
      prompt: 'Why does a rail-optimized topology improve large-scale AI training efficiency?',
      correct: {
        id: 'a',
        text: 'Distributed-training collectives such as AllReduce are rank-aligned and predictable, so mapping each GPU rank to its own rail keeps that traffic on direct paths and largely off the spine, cutting contention and tail latency',
      },
      incorrect: [
        { id: 'b', text: 'It encrypts the gradient traffic exchanged between GPUs so that collectives can be run safely over fully shared, untrusted links' },
        { id: 'c', text: 'It replaces all of the separate NICs in each GPU server with a single shared high-bandwidth uplink to the top-of-rack switch' },
        { id: 'd', text: 'It deliberately forces every GPU flow up through the spine layer so that one central scheduler can globally order all of them' },
        { id: 'e', text: 'It converts the whole fabric over to optical circuit switching so that each running collective is granted its own private wavelength' },
      ],
      explanation:
        'Collectives like AllReduce/AllGather move data between matching ranks. Aligning the physical network to those patterns (rails) keeps the dominant traffic on short, uncongested paths, pushing scaling efficiency into the 90–95%+ range and minimizing spine load.',
      reference: TOPO('Rail-optimized fabrics — collectives'),
      tags: ['ai', 'rail-optimized', 'collectives'],
    },
    {
      id: 'topo-multiplane',
      prompt: 'What is a multi-plane (multi-planar) fabric?',
      correct: {
        id: 'a',
        text: 'Several parallel, independent planes that each carry a share of traffic, adding bandwidth and fault isolation',
      },
      incorrect: [
        { id: 'b', text: 'A single fabric carved into VLANs to separate tenants logically' },
        { id: 'c', text: 'A design that physically stacks multiple separate floors of switches joined together by vertical riser cabling between halls' },
        { id: 'd', text: 'A control scheme that runs several different routing protocols simultaneously on every single switch in the fabric' },
        { id: 'e', text: 'A layout that places the spine and leaf switches together on one physical board' },
      ],
      explanation:
        'Each endpoint/NIC connects to one of several independent planes (sometimes with their own control planes). This multiplies aggregate bandwidth and contains failures to a single plane. Google’s Virgo and Meta’s fabric both use multi-planar designs.',
      reference: TOPO('Multi-plane fabrics'),
      tags: ['topology', 'multi-plane', 'resilience'],
    },
    {
      id: 'topo-planes-meta',
      prompt: "In Meta’s data center fabric, what is a 'plane'?",
      correct: {
        id: 'a',
        text: 'One of several identical, independent spine fabrics; adding planes (4 → 8) scales capacity and isolation',
      },
      incorrect: [
        { id: 'b', text: 'The raised-floor section of the hall where Meta installs its spine switches' },
        { id: 'c', text: 'A single very large modular chassis switch that aggregates the traffic of an entire data center hall at once on its own' },
        { id: 'd', text: 'A dedicated control-plane server cluster that programs the forwarding tables of every switch across the whole region' },
        { id: 'e', text: 'A geographic tier that connects two Meta campuses across the long-haul backbone' },
      ],
      explanation:
        'Meta builds its fabric from multiple identical, independent spine planes. Pods connect into each plane, so capacity scales by adding planes (going from four to eight planes doubles capacity) while keeping the planes isolated for resilience.',
      reference: META('Spine planes'),
      tags: ['topology', 'multi-plane', 'meta'],
    },
    {
      id: 'topo-flat-highradix',
      prompt: 'Why are hyperscalers adopting flat, high-radix two-layer fabrics for AI?',
      correct: {
        id: 'a',
        text: 'High-radix switches collapse three or more tiers into two layers, cutting hop count and latency at scale',
      },
      incorrect: [
        { id: 'b', text: 'A two-layer fabric is now formally mandated by the Ethernet standard for any data center link running above 400G' },
        { id: 'c', text: 'Using fewer layers forces every switch to convert its optical signals to electrical and back again twice as often' },
        { id: 'd', text: 'Low-radix switches are cheaper, so stacking more tiers always lowers total cost' },
        { id: 'e', text: 'Flat fabrics remove the need for any routing protocol or traffic engineering' },
      ],
      explanation:
        'A switch’s radix (port count) sets how many devices a tier can fan out to. Higher radix means a non-blocking fabric needs fewer tiers — often just two — which lowers end-to-end hop count (latency and queuing) and simplifies operations. Google’s Virgo is a flat two-layer example.',
      reference: VIRGO('Flat two-layer, high-radix design'),
      tags: ['topology', 'high-radix', 'ai'],
    },
    {
      id: 'topo-virgo',
      prompt: 'What characterizes Google’s Virgo network fabric for the AI Hypercomputer?',
      correct: {
        id: 'a',
        text: 'A flat, two-layer non-blocking fabric on high-radix switches with a multi-planar design, connecting on the order of 134,000 accelerators at roughly 47 Pb/s bisection with much lower latency',
      },
      incorrect: [
        { id: 'b', text: 'A deeper three-layer Clos that deliberately adds an extra aggregation tier in order to maximize the total switch count' },
        { id: 'c', text: 'An optical-only fabric that completely removes every electronic packet switch sitting between the accelerator pods' },
        { id: 'd', text: 'A WAN overlay that connects accelerators spread across continents to one another using encrypted IP tunnels' },
        { id: 'e', text: 'A single giant chassis router that all of the accelerators plug into directly to keep latency low' },
      ],
      explanation:
        'Virgo (Google Cloud, 2026) is a megascale, AI-specific fabric: a flat two-layer non-blocking topology on high-radix switches, multi-planar for resilience, with a "campus-as-a-computer" reach — about 134K accelerators, ~47 Pb/s bisection, and ~40% lower latency than prior generations.',
      reference: VIRGO('Overview'),
      tags: ['google', 'virgo', 'ai'],
    },
    {
      id: 'topo-virgo-jupiter',
      prompt: 'How do Google’s Virgo and Jupiter fabrics divide responsibility?',
      correct: {
        id: 'a',
        text: 'Virgo carries the raw accelerator (AI) traffic, while Jupiter handles general, storage, and WAN connectivity',
      },
      incorrect: [
        { id: 'b', text: 'Jupiter is the brand-new fabric and Virgo is the legacy one now being retired' },
        { id: 'c', text: 'Virgo runs the WAN backbone between regions while Jupiter is strictly limited to interconnecting a single rack of TPUs' },
        { id: 'd', text: 'They are two fully identical fabrics deployed across different regions purely for redundancy and failover purposes' },
        { id: 'e', text: 'Virgo fully replaces Jupiter for every type of traffic inside the datacenter' },
      ],
      explanation:
        'They are complementary: Virgo is purpose-built for high-bandwidth accelerator-to-accelerator traffic, while Jupiter continues to provide general datacenter, storage, and WAN/Internet-facing connectivity. Understanding this split matters for capacity and reliability planning.',
      reference: VIRGO('Virgo and Jupiter'),
      tags: ['google', 'virgo', 'jupiter'],
    },
    {
      id: 'topo-direct-mesh-ocs',
      prompt: 'In Jupiter’s later generations, what replaced much of the rigid electrical spine?',
      correct: {
        id: 'a',
        text: 'A reconfigurable direct mesh between aggregation blocks using optical circuit switches plus SDN',
      },
      incorrect: [
        { id: 'b', text: 'A second, larger electrical spine layer stacked above the original spine' },
        { id: 'c', text: 'A ring of dedicated WAN routers that forwards all inter-block traffic the long way around the perimeter of the hall' },
        { id: 'd', text: 'A set of fixed point-to-point copper links that are hand-cabled directly between every possible pair of blocks' },
        { id: 'e', text: 'A wireless backplane that beams traffic between aggregation blocks over the air' },
      ],
      explanation:
        'Later Jupiter generations interconnect aggregation blocks through MEMS-based optical circuit switches, forming a software-reconfigurable direct mesh. This removes the fixed spine for many patterns, enabling heterogeneous refresh, lower power, and dynamic topology engineering.',
      reference: JUPITER('OCS direct mesh'),
      tags: ['google', 'jupiter', 'ocs'],
    },
    {
      id: 'topo-dragonfly',
      prompt: 'What defines a Dragonfly topology?',
      correct: {
        id: 'a',
        text: 'Dense links within each group plus sparse links between groups, giving low diameter with adaptive routing',
      },
      incorrect: [
        { id: 'b', text: 'A ring of switches that passes traffic hop by hop around a single loop' },
        { id: 'c', text: 'A strict three-tier tree in which every group must connect upward to one single shared global core switch at the top' },
        { id: 'd', text: 'A full mesh in which every individual switch links directly to every other switch present anywhere in the whole cluster' },
        { id: 'e', text: 'A star layout with one central high-radix switch and many small edge switches' },
      ],
      explanation:
        'Dragonfly (common in HPC/AI supercomputers) groups switches with dense intra-group links and a sparse set of inter-group links, achieving a very low network diameter with fewer switches than a fat-tree — at the cost of needing sophisticated adaptive routing to avoid congestion.',
      reference: TOPO('Dragonfly topology'),
      tags: ['topology', 'dragonfly', 'hpc'],
    },
    {
      id: 'topo-nvlink',
      prompt: 'What role do NVLink and NVSwitch play relative to the datacenter fabric?',
      correct: { id: 'a', text: 'A scale-up GPU interconnect inside a server or pod, complementing the scale-out fabric' },
      incorrect: [
        { id: 'b', text: 'A scale-out replacement for leaf-spine that wires every GPU across the whole cluster' },
        { id: 'c', text: 'An optical circuit switch layer that dynamically reconfigures the links between aggregation blocks' },
        { id: 'd', text: 'A WAN technology that links GPU pods between separate data center campuses' },
        { id: 'e', text: 'A congestion-control protocol that paces GPU traffic across the spine during collectives' },
      ],
      explanation:
        'NVLink/NVSwitch provide very high-bandwidth, low-latency GPU-to-GPU connectivity within a server or pod (scale-up). They complement — not replace — the scale-out rail/leaf-spine fabric that connects servers across the cluster.',
      reference: TOPO('NVLink / NVSwitch (scale-up)'),
      tags: ['ai', 'nvlink', 'scale-up'],
    },
    {
      id: 'topo-diameter',
      prompt: "What does a network's 'diameter' (maximum hop count) most directly affect?",
      correct: { id: 'a', text: 'Latency — fewer hops between endpoints means lower latency' },
      incorrect: [
        { id: 'b', text: 'The total number of switches needed to reach full bisection bandwidth' },
        { id: 'c', text: 'The maximum number of wavelengths a single fiber can carry before crosstalk' },
        { id: 'd', text: 'The amount of buffer memory each switch must hold to avoid dropping packets' },
        { id: 'e', text: 'The number of independent planes required to isolate faults across a cluster' },
      ],
      explanation:
        'Diameter is the worst-case number of hops between any two endpoints. Each hop adds switching and queuing delay, so low-diameter topologies (e.g., flat two-layer or Dragonfly) reduce latency — critical for tightly-synchronized AI training.',
      reference: TOPO('Network diameter / hop count'),
      tags: ['metrics', 'latency'],
    },
    {
      id: 'topo-blast-radius',
      prompt: "Why is 'blast radius' (fault domain) a central topology concern for large AI training clusters?",
      correct: {
        id: 'a',
        text: 'One failed switch or link can stall a synchronous job, so topologies shrink each fault domain',
      },
      incorrect: [
        { id: 'b', text: 'Larger clusters draw far more power overall, so the blast radius is simply a measure of the peak electrical load drawn per rack' },
        { id: 'c', text: 'It precisely measures the maximum distance an optical signal can travel down a fiber before it weakens and needs regeneration' },
        { id: 'd', text: 'It is the physical distance that a single cooling or thermal failure can realistically spread across the hot aisles of a hall' },
        { id: 'e', text: 'It sets how many separate wavelengths a single fiber strand can carry at once before optical crosstalk starts to appear' },
      ],
      explanation:
        'Synchronous training stalls if any participant is lost, so a small fault can waste a huge amount of GPU work (goodput). Topology choices — rails, planes, smaller fault domains, fast isolation/rerouting — limit how much of a job a single failure can disrupt.',
      reference: TOPO('Fault domains / blast radius'),
      tags: ['metrics', 'reliability', 'ai'],
    },
    {
      id: 'topo-dsf',
      prompt: 'What is Meta’s Disaggregated Scheduled Fabric (DSF) in its AI network?',
      correct: {
        id: 'a',
        text: 'A scheduled L2 fabric where traffic is centrally scheduled across disaggregated switching elements to avoid congestion, used alongside non-scheduled fabric to build Meta’s large AI zones',
      },
      incorrect: [
        { id: 'b', text: 'A dedicated WAN protocol that Meta uses to schedule large data backups between its regional data centers overnight' },
        { id: 'c', text: 'A hardware scheme that disaggregates the GPUs from their host servers so that any free GPU can join any training job' },
        { id: 'd', text: 'A storage fabric that schedules disk I/O completely separately from the regular network traffic for large AI jobs' },
        { id: 'e', text: 'A control plane that schedules the delivery of electrical power out to individual racks during periods of peak demand' },
      ],
      explanation:
        'DSF schedules traffic across an open, disaggregated set of switching elements (e.g., deep-buffer RDSW and FDSW switches) to keep the fabric congestion-free for collectives. Meta pairs DSF with non-scheduled fabric (NSF) to build its AI-zone L2 networks.',
      reference: META_DSF('Disaggregated Scheduled Fabric'),
      tags: ['meta', 'ai', 'fabric'],
    },
  ],
};
