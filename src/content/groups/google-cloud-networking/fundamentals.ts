import type { Reference, Subject } from '../../../types/content';

// Reference helpers — point at the papers where each concept is discussed.
const JR = (section: string): Reference => ({
  sourceTitle: 'Jupiter Rising: A Decade of Clos Topologies and Centralized Control (SIGCOMM 2015)',
  url: 'https://research.google/pubs/jupiter-rising-a-decade-of-clos-topologies-and-centralized-control-in-googles-datacenter-network/',
  locator: { kind: 'section', section },
});
const JE = (section: string): Reference => ({
  sourceTitle: 'Jupiter Evolving: Optical Circuit Switches and SDN (SIGCOMM 2022)',
  url: 'https://research.google/pubs/jupiter-evolving-transforming-googles-datacenter-network-via-optical-circuit-switches-and-software-defined-networking/',
  locator: { kind: 'section', section },
});

export const fundamentals: Subject = {
  id: 'fund',
  name: 'Datacenter Networking Fundamentals & Terms (TPM III Prep)',
  description:
    'Core vocabulary, Clos/spine-leaf design principles, and physical-layer concepts from Google’s Jupiter fabrics. TPM III focus: trade-offs in cost vs. reliability, incremental deployment risk, change management blast radius, and how these architectures enable scalable, low-latency delivery for services like Google Workspace. All answer choices are balanced in length and detail to avoid length-based guessing.',
  questions: [
    {
      id: 'fund-clos',
      prompt: 'What is a Clos network?',
      correct: {
        id: 'a',
        text: 'A multi-stage switching topology that builds one large logical fabric out of many small identical commodity switches',
      },
      incorrect: [
        { id: 'b', text: 'A single large chassis switch with a non-blocking internal crossbar backplane' },
        { id: 'c', text: 'A ring topology that passes a token between switches to arbitrate link access' },
        { id: 'd', text: 'A tunneling protocol that encrypts authenticated traffic between distant datacenters' },
        { id: 'e', text: 'A multiplexing scheme that shares aggregate capacity across optical fiber links' },
        { id: 'f', text: 'A TCP congestion-control algorithm tuned for throughput over high-latency links' },
      ],
      explanation:
        'A Clos network (Charles Clos, 1953) interconnects multiple stages of small commodity switches so the aggregate behaves like one huge switch. Google’s datacenter fabrics — like spine-leaf designs generally — are folded-Clos topologies, which is how they scale bisection bandwidth using cheap merchant silicon instead of giant chassis routers.',
      reference: JR('Introduction — Clos topologies'),
      tags: ['topology', 'clos'],
    },
    {
      id: 'fund-fattree',
      prompt: "A 'fat-tree' datacenter topology is best described as…",
      correct: {
        id: 'a',
        text: 'A folded-Clos of identical commodity switches keeping equal aggregate bandwidth at every tier',
      },
      incorrect: [
        { id: 'b', text: 'A tree topology where the single root switch holds far more capacity than the leaf switches' },
        { id: 'c', text: 'A physical tree-shaped cable run that all originates outward from one central high-radix core router' },
        { id: 'd', text: 'A spanning-tree protocol variant designed to prevent forwarding loops across bridged Ethernet segments' },
        { id: 'e', text: 'A topology where each individual rack is given its own dedicated high-radix core router' },
      ],
      explanation:
        "In a fat-tree (Al-Fares et al., 2008), 'fatness' refers to keeping constant aggregate bandwidth as you move up the tiers — achieved with many parallel links rather than fatter individual links. That lets identical, cheap switches deliver full bisection bandwidth.",
      reference: JR('Introduction — Clos topologies'),
      tags: ['topology', 'clos'],
    },
    {
      id: 'fund-tor',
      prompt: "What does a 'ToR' switch do?",
      correct: {
        id: 'a',
        text: 'It sits atop a rack and aggregates that rack’s server connections',
      },
      incorrect: [
        { id: 'b', text: 'It routes traffic between separate datacenter sites across the long-haul wide-area backbone network' },
        { id: 'c', text: 'It is the single topmost spine switch that sits at the very apex of the entire fabric hierarchy' },
        { id: 'd', text: 'It performs optical wavelength switching of whole circuits inside the OCS layer of the fabric core' },
        { id: 'e', text: 'It is the out-of-band management controller that oversees every single device within the entire rack' },
      ],
      explanation:
        'ToR (Top-of-Rack) is the first-hop switch for servers: each rack’s servers connect up to the ToR, which then connects into the aggregation/fabric tiers. In spine-leaf terms the ToR is the leaf.',
      reference: JR('Building blocks — Top of Rack'),
      tags: ['topology', 'tor'],
    },
    {
      id: 'fund-bisection',
      prompt: "What does 'bisection bandwidth' measure?",
      correct: {
        id: 'a',
        text: 'The worst-case bandwidth between two equal halves of the network split in the least favorable way',
      },
      incorrect: [
        { id: 'b', text: 'The total bandwidth of all of the server NICs across the whole fabric simply added together end to end' },
        { id: 'c', text: 'The bandwidth available on a single uplink from one individual ToR switch up to its spine' },
        { id: 'd', text: 'Exactly half of the peak WAN throughput measured across the entire datacenter site network' },
        { id: 'e', text: 'The bandwidth lost to framing and protocol overhead summed across each and every single link in the fabric' },
      ],
      explanation:
        "Bisection bandwidth captures how much traffic can cross between two halves of the fabric. 'Full' (non-oversubscribed) bisection bandwidth means any server can talk to any other at full line rate. Jupiter delivered ~1.3 Pbps of bisection bandwidth.",
      reference: JR('Performance — bisection bandwidth'),
      tags: ['capacity', 'bisection'],
    },
    {
      id: 'fund-oversub',
      prompt:
        'A ToR with 48 server-facing 10G ports and 4 uplink 40G ports has roughly what oversubscription ratio?',
      correct: { id: 'a', text: '3:1 (480 Gbps server-facing down versus 160 Gbps of uplink)' },
      incorrect: [
        { id: 'b', text: '1:1 (a non-oversubscribed full-bandwidth fabric)' },
        { id: 'c', text: '12:1 (very high oversubscription typical of older legacy designs)' },
        { id: 'd', text: '1:3 (provisioning more uplink than downlink)' },
        { id: 'e', text: '6:1 (moderate oversubscription tuned for storage-heavy workloads)' },
      ],
      explanation:
        'Oversubscription = server-facing bandwidth ÷ uplink bandwidth = 480G ÷ 160G = 3:1. A 1:1 ratio is full (non-blocking) bandwidth; higher ratios save cost on the assumption that not all servers burst at once.',
      reference: JR('Building blocks — oversubscription'),
      tags: ['capacity', 'oversubscription'],
    },
    {
      id: 'fund-merchant',
      prompt: "What is 'merchant silicon'?",
      correct: {
        id: 'a',
        text: 'Commodity off-the-shelf switching ASICs bought from chip vendors and used as cheap building blocks for the fabric',
      },
      incorrect: [
        { id: 'b', text: 'Custom switching ASICs that Google designs internally and fabricates only for its own fabrics' },
        { id: 'c', text: 'The pluggable optical transceiver modules inserted into the ports on an Optical Circuit Switch' },
        { id: 'd', text: 'Silicon-photonics technology for integrating optical components directly onto the switch die' },
        { id: 'e', text: 'Specialized hardware billing and usage-metering chips embedded inside Google Cloud servers' },
      ],
      explanation:
        'A central theme of Jupiter Rising is using merchant (commodity) switch silicon in Clos topologies to get building-scale networks cheaply, rather than relying on expensive high-radix vendor chassis.',
      reference: JR('Themes — merchant silicon'),
      tags: ['hardware', 'merchant-silicon'],
    },
    {
      id: 'fund-ecmp',
      prompt: 'What is ECMP used for in a Clos fabric?',
      correct: {
        id: 'a',
        text: 'Spreading flows across equal-cost parallel paths by hashing each flow onto one path',
      },
      incorrect: [
        { id: 'b', text: 'Encrypting in-band switch management traffic with rotating keys' },
        { id: 'c', text: 'Electing the master routing controller during a control-plane failover event in the fabric' },
        { id: 'd', text: 'Compressing IP and TCP headers on every hop to reclaim bandwidth' },
        { id: 'e', text: 'Reserving a dedicated end-to-end circuit through the whole fabric for each and every new flow' },
      ],
      explanation:
        'Equal-Cost Multi-Path (ECMP) load-balances traffic over the many redundant paths a Clos provides. It hashes flow tuples so each flow follows one path (avoiding reordering), and large numbers of flows spread the load. Imperfect hashing or elephant flows can still cause imbalance.',
      reference: JR('Routing — ECMP / load balancing'),
      tags: ['routing', 'ecmp'],
    },
    {
      id: 'fund-eastwest',
      prompt: "In a modern datacenter, 'east-west' traffic refers to…",
      correct: { id: 'a', text: 'Server-to-server traffic that stays inside the datacenter' },
      incorrect: [
        { id: 'b', text: 'Traffic arriving from and leaving toward external clients out on the internet, called north-south' },
        { id: 'c', text: 'Traffic flowing between separate datacenter sites across the long-haul wide-area backbone network' },
        { id: 'd', text: 'Backup and archival traffic that is being streamed and written out to offline tape libraries' },
        { id: 'e', text: 'Control-plane traffic that switches exchange with the centralized SDN routing controller' },
      ],
      explanation:
        'East-west = internal server-to-server traffic (the dominant pattern in distributed storage/compute/AI workloads); north-south = client traffic in and out of the DC. Clos fabrics exist precisely to provide huge east-west bisection bandwidth.',
      reference: JR('Motivation — traffic patterns'),
      tags: ['traffic', 'east-west'],
    },
    {
      id: 'fund-spineleaf',
      prompt: 'How is every leaf connected in a classic two-tier spine-leaf fabric?',
      correct: {
        id: 'a',
        text: 'Each leaf (ToR) uplinks to every spine switch, and leaves never connect directly to each other',
      },
      incorrect: [
        { id: 'b', text: 'Each leaf connects only to its two immediately adjacent neighbor leaves, forming one closed ring loop' },
        { id: 'c', text: 'Every leaf connects upward to a single shared central spine switch in the fabric core' },
        { id: 'd', text: 'The spines form a full mesh among themselves and each leaf hangs off just one of the spines' },
        { id: 'e', text: 'Each leaf connects to exactly one assigned primary spine, with a second spine kept for redundancy' },
      ],
      explanation:
        'Spine-leaf is a 2-stage folded Clos: every leaf uplinks to every spine, so any leaf-to-leaf path is exactly two hops (leaf→spine→leaf) and there are as many equal-cost paths as there are spines.',
      reference: JR('Introduction — Clos topologies'),
      tags: ['topology', 'spine-leaf'],
    },
    {
      id: 'fund-ocs',
      prompt: 'What does an Optical Circuit Switch (OCS) do?',
      correct: {
        id: 'a',
        text: 'Physically steers a beam of light from an input fiber across to an output fiber, switching whole circuits rather than individual packets',
      },
      incorrect: [
        { id: 'b', text: 'Inspects each packet header optically in flight and forwards it with no electronic conversion' },
        { id: 'c', text: 'Converts incoming optical signals to electrical, switches them in silicon, then converts back to light' },
        { id: 'd', text: 'Multiplexes many different optical wavelengths together onto one single shared strand of fiber' },
        { id: 'e', text: 'Amplifies weak optical signals inline using erbium-doped fiber amplifiers to extend the link reach' },
      ],
      explanation:
        'An OCS (in Google’s case, MEMS-mirror based) reflects light from one port to another, so it is data-rate and wavelength agnostic and does no optical-electrical-optical conversion. It changes the topology by rewiring fiber paths — like an automated patch panel. This is the core enabler in Jupiter Evolving.',
      reference: JE('Apollo OCS'),
      tags: ['optical', 'ocs'],
    },
    {
      id: 'fund-wdm',
      prompt: 'What does Wavelength-Division Multiplexing (WDM) accomplish on a fiber?',
      correct: {
        id: 'a',
        text: 'It carries many independent channels at once, each on a different wavelength of light',
      },
      incorrect: [
        { id: 'b', text: 'It splits a single signal across several parallel fiber strands to provide path redundancy' },
        { id: 'c', text: 'It converts outgoing electrical signals into optical signals for transmission on fiber' },
        { id: 'd', text: 'It compresses the payload data on the wire before it is transmitted across the link' },
        { id: 'e', text: 'It switches beams of light between fiber ports using tiny steerable MEMS mirrors' },
      ],
      explanation:
        'WDM puts many wavelengths on a single fiber, each an independent channel, multiplying capacity. DWDM (dense WDM) packs them closely. Jupiter Evolving uses WDM (with circulators) to raise the capacity carried across the OCS layer.',
      reference: JE('Optical layer — WDM'),
      tags: ['optical', 'wdm'],
    },
    {
      id: 'fund-scaleout',
      prompt:
        "Why did Google pursue a 'scale-out' fabric of many small switches instead of 'scale-up' chassis routers?",
      correct: {
        id: 'a',
        text: 'Many commodity switches give better cost, growth, and resilience than a few large boxes',
      },
      incorrect: [
        { id: 'b', text: 'Large chassis routers are fundamentally incapable of running the BGP routing protocol at all in production' },
        { id: 'c', text: 'Optical circuit switching of any kind is technically impossible whenever chassis routers are being used' },
        { id: 'd', text: 'Scale-up chassis boxes always consume substantially more fiber strands than equivalent scale-out fabrics do' },
        { id: 'e', text: 'Using many small switches is explicitly mandated by the OpenFlow standardization committee review process' },
      ],
      explanation:
        'Scale-out with merchant silicon was cheaper, let capacity grow incrementally, and removed the high-radix chassis as a single expensive bottleneck — a recurring theme across Jupiter Rising and Evolving.',
      reference: JR('Themes — scale-out design'),
      tags: ['design', 'scale-out'],
    },
    {
      id: 'fund-nonblocking',
      prompt: "A 'non-blocking' fabric means…",
      correct: {
        id: 'a',
        text: 'Any set of servers can communicate at once at full line rate without internal contention',
      },
      incorrect: [
        { id: 'b', text: 'No switch anywhere in the fabric will ever drop even a single packet under any offered load whatsoever' },
        { id: 'c', text: 'The Spanning Tree Protocol has been administratively disabled across every switch in the whole fabric' },
        { id: 'd', text: 'There exists only one single possible forwarding path between any given pair of servers' },
        { id: 'e', text: 'The network is engineered so that it never has to apply congestion control to any flow' },
      ],
      explanation:
        'Non-blocking / full-bisection means the fabric’s internal capacity matches the edge capacity, so traffic patterns don’t bottleneck inside the fabric. Oversubscribed fabrics relax this to save cost.',
      reference: JR('Performance — bisection bandwidth'),
      tags: ['capacity', 'non-blocking'],
    },
    {
      id: 'fund-central-control-tpm',
      prompt: 'Why did Google favor centralized control planes (Firepath in Jupiter, central TE in B4) over purely distributed routing protocols for its production fabrics and WAN?',
      correct: {
        id: 'a',
        text: 'A known single-operator topology lets central computation simplify hardware and speed global convergence',
      },
      incorrect: [
        { id: 'b', text: 'Distributed protocols like BGP simply cannot ever achieve sub-second convergence on merchant-silicon switches' },
        { id: 'c', text: 'Centralized control of the fabric was strictly mandated by the OpenFlow 1.0 specification for all deployments' },
        { id: 'd', text: 'It removes the need for any routing protocol at all and enables flat Layer-2 forwarding' },
        { id: 'e', text: 'Merchant-silicon ASICs lack the TCAM capacity to hold distributed-protocol forwarding tables' },
      ],
      explanation:
        'In a controlled environment Google owns end-to-end, centralization removes the need for protocols designed for arbitrary multi-party networks. This simplifies switch software, speeds convergence after failures or reconfigurations, and gives operators a single place to enforce policy and simulate changes — critical for TPMs planning maintenance windows and assessing blast radius.',
      reference: JR('Themes — centralized control'),
      tags: ['control-plane', 'design', 'tpm'],
    },
    {
      id: 'fund-incremental-deploy-tpm',
      prompt: 'From a program-management standpoint, what is the most significant operational advantage of a scale-out Clos fabric built from many identical merchant-silicon switches versus a scale-up design using a few large chassis routers?',
      correct: {
        id: 'a',
        text: 'Capacity can be added one aggregation block or hardware generation at a time, with minimal blast radius and phased turn-up',
      },
      incorrect: [
        { id: 'b', text: 'It guarantees absolutely zero packet loss during any upgrade because there are no shared backplanes' },
        { id: 'c', text: 'It cuts the total count of fiber strands required by roughly 40 percent versus chassis designs' },
        { id: 'd', text: 'It lets any single switch failure be fully masked without relying on ECMP or any traffic engineering' },
        { id: 'e', text: 'It removes the need for any out-of-band management network or serial console access to the switches' },
      ],
      explanation:
        'Scale-out lets TPMs stage deployments: build and validate new aggregation blocks while the existing fabric continues serving live Workspace and Cloud traffic. Failures or upgrades affect only a fraction of capacity, change windows are smaller, and heterogeneous generations can coexist — all of which reduce program risk and improve predictability of delivery timelines.',
      reference: JR('Themes — scale-out design'),
      tags: ['deployment', 'scale-out', 'tpm'],
    },
    {
      id: 'fund-oversub-tpm',
      prompt: 'When sizing a new ToR or aggregation block for a mix of steady Workspace collaboration traffic and bursty AI training workloads, why might a TPM accept a 3:1 or higher oversubscription ratio rather than insisting on 1:1 non-blocking?',
      correct: {
        id: 'a',
        text: 'Traffic is rarely all-to-all at full rate at once, so statistical multiplexing meets the SLOs',
      },
      incorrect: [
        { id: 'b', text: 'Oversubscription is strictly required by the IEEE 802.3 Ethernet standard for all datacenter switches above 100 Gbps' },
        { id: 'c', text: 'It is the only way to stay inside the optical power budget when using long-reach single-mode fiber up to the spine' },
        { id: 'd', text: 'Fully non-blocking fabrics are technically unable to run ECMP or any kind of centralized traffic engineering at all' },
        { id: 'e', text: 'Workspace traffic is always strictly low-priority bulk transfer that can be throttled completely and arbitrarily anytime' },
      ],
      explanation:
        'A TPM must balance capex/opex against risk. Full non-blocking is expensive and often over-provisioned. With good traffic engineering, classification, and the fact that not every server bursts at once, moderate oversubscription delivers the required tail latency and availability for Workspace users while freeing budget for more capacity elsewhere or faster refresh cycles.',
      reference: JR('Building blocks — oversubscription'),
      tags: ['capacity', 'oversubscription', 'tpm'],
    },
  ],
};
