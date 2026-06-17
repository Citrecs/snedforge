import type { Reference, Subject } from '../../../types/content';

const B4 = (section: string): Reference => ({
  sourceTitle: 'B4: Experience with a Globally-Deployed Software Defined WAN (SIGCOMM 2013)',
  url: 'https://dl.acm.org/doi/10.1145/2486001.2486019',
  locator: { kind: 'section', section },
});

export const b4: Subject = {
  id: 'b4',
  name: 'B4 — Google’s SDN WAN (2013) (TPM III Prep)',
  description:
    'Google’s software-defined inter-datacenter WAN with centralized TE achieving near-100% link utilization. TPM III lens: implications for global data placement, inter-DC sync SLAs, maintenance scheduling windows, failure modeling, and cost-efficiency programs that underpin reliable Workspace and Cloud service delivery. Answer options balanced for depth.',
  questions: [
    {
      id: 'b4-what',
      prompt: 'What is B4?',
      correct: {
        id: 'a',
        text: 'Google’s private software-defined WAN that interconnects its datacenters across the globe',
      },
      incorrect: [
        { id: 'b', text: 'Google’s public-facing internet backbone serving end-user web traffic worldwide' },
        { id: 'c', text: 'The intra-datacenter Clos switching fabric deployed inside a single building' },
        { id: 'd', text: 'Google’s in-house OpenFlow switch ASIC custom-built for the WAN project' },
        { id: 'e', text: 'A congestion-control protocol used for TCP traffic engineering' },
      ],
      explanation:
        'B4 is the SDN-controlled WAN interconnecting Google’s datacenters (data-center-to-data-center). It is distinct from B2, Google’s user-facing internet backbone. By 2013, B4 already carried more traffic than B2 and was growing faster.',
      reference: B4('Introduction'),
      tags: ['overview'],
    },
    {
      id: 'b4-motivation',
      prompt: 'What efficiency problem motivated B4’s design?',
      correct: {
        id: 'a',
        text: 'Classic WANs provisioned for peak load and failure sit at only 30-40% average utilization, wasting costly long-haul capacity',
      },
      incorrect: [
        { id: 'b', text: 'Datacenter switches simply could not forward inter-site traffic at the required long-haul line rates and sustained burst sizes' },
        { id: 'c', text: 'Dark fiber was largely unavailable or far too prohibitively expensive to lease between most of Google’s far-flung remote sites' },
        { id: 'd', text: 'BGP simply could not scale to the very large number of routes required across the global WAN topology' },
        { id: 'e', text: 'Optical amplifiers and transponders were too costly and far too unreliable to deploy on long-haul spans' },
      ],
      explanation:
        'WAN gear and long-haul links are extremely expensive, yet classic WANs run at 30–40% to absorb bursts and failures. B4’s centralized traffic engineering drives links to near 100% utilization, dramatically improving cost-efficiency.',
      reference: B4('Background — motivation'),
      tags: ['motivation', 'utilization'],
    },
    {
      id: 'b4-control',
      prompt: 'How does B4 control its switches?',
      correct: {
        id: 'a',
        text: 'Centralized SDN controllers program them via OpenFlow',
      },
      incorrect: [
        { id: 'b', text: 'Each switch runs fully autonomous distributed routing with no central control at all' },
        { id: 'c', text: 'Through a vendor-proprietary CLI running directly on each individual chassis router' },
        { id: 'd', text: 'By configuring static forwarding circuits by hand on every single device' },
        { id: 'e', text: 'Using MPLS-TE signaled hop-by-hop with per-path RSVP-TE reservations' },
      ],
      explanation:
        'B4 was one of the first and largest production SDN/OpenFlow deployments. Switches are simple (built from merchant silicon); the intelligence lives in centralized controllers and a global traffic-engineering service.',
      reference: B4('Design — SDN architecture'),
      tags: ['sdn', 'openflow'],
    },
    {
      id: 'b4-te',
      prompt: 'What is the job of B4’s centralized Traffic Engineering (TE) service?',
      correct: {
        id: 'a',
        text: 'Compute globally optimal paths and bandwidth shares across the WAN and program them into switches',
      },
      incorrect: [
        { id: 'b', text: 'To build and continuously run one spanning tree across every link in the entire global WAN topology' },
        { id: 'c', text: 'To dynamically assign and renumber the IP addresses for every switch and port across the whole WAN' },
        { id: 'd', text: 'To encrypt and authenticate all inter-datacenter traffic flowing across the WAN links' },
        { id: 'e', text: 'To balance load purely through local per-switch decisions with no global view' },
      ],
      explanation:
        'B4’s TE has a global view, so it can pack flows onto paths to maximize utilization while honoring application priorities — something hop-by-hop distributed protocols cannot do as well. It splits flows across multiple tunnels with weights.',
      reference: B4('Traffic Engineering'),
      tags: ['traffic-engineering'],
    },
    {
      id: 'b4-switches',
      prompt: 'What were B4’s WAN switches built from?',
      correct: {
        id: 'a',
        text: 'Custom in-house switches built from cheap commodity merchant-silicon chips, not vendor chassis routers',
      },
      incorrect: [
        { id: 'b', text: 'High-end proprietary core routers purchased exclusively from one traditional networking vendor' },
        { id: 'c', text: 'Pure optical circuit switches doing wavelength switching with no electronic packet processing' },
        { id: 'd', text: 'General-purpose x86 servers running software-based packet forwarding in the Linux kernel' },
        { id: 'e', text: 'FPGAs dynamically reprogrammed on a per-flow basis to implement forwarding logic' },
      ],
      explanation:
        'Like the datacenter fabrics, B4’s switches were built in-house from merchant silicon — cheap, simple hardware whose control was lifted into central SDN controllers.',
      reference: B4('Switch design'),
      tags: ['hardware', 'merchant-silicon'],
    },
    {
      id: 'b4-elastic',
      prompt: "Why is much of B4’s traffic considered 'elastic,' and why does that matter?",
      correct: {
        id: 'a',
        text: 'Bulk transfers like data copies and state sync tolerate throttling or rescheduling, so TE can pack links full',
      },
      incorrect: [
        { id: 'b', text: 'Because the bulk traffic is fully encrypted end-to-end and can therefore be safely dropped whenever links fill up' },
        { id: 'c', text: 'Because end users never notice any added WAN latency at all, so these flows can be delayed indefinitely at will' },
        { id: 'd', text: 'Because elastic bulk traffic only ever runs overnight during scheduled off-peak batch windows' },
        { id: 'e', text: 'Because elastic flows use UDP exclusively and so can be rate-limited without any retransmissions' },
      ],
      explanation:
        'B4 carries mostly elastic bulk traffic: copying user data for availability, remote storage access for computation, and large-scale state synchronization. Elasticity lets central TE defer or limit lower-priority flows to drive utilization toward 100% without hurting high-priority traffic.',
      reference: B4('Traffic characteristics'),
      tags: ['traffic', 'elasticity'],
    },
    {
      id: 'b4-fairness',
      prompt:
        'How does B4 decide how much bandwidth each application gets when the network is congested?',
      correct: {
        id: 'a',
        text: 'Max-min fair shares set by per-app bandwidth functions',
      },
      incorrect: [
        { id: 'b', text: 'First-come-first-served scheduling applied separately to every individual TCP flow on each link' },
        { id: 'c', text: 'Strict priority queuing in which the highest-priority app can fully starve all the lower ones' },
        { id: 'd', text: 'An equal bandwidth share given to every flow regardless of the application sending it' },
        { id: 'e', text: 'Random early drop applied uniformly to every queue without any priority awareness at all' },
      ],
      explanation:
        'Each application/flow-group has a bandwidth function (derived from its priority) describing how much it deserves at a given fair-share level. B4’s TE solves for a max-min fair allocation across these, so important apps get capacity first while bulk apps soak up the rest.',
      reference: B4('Bandwidth functions'),
      tags: ['traffic-engineering', 'fairness'],
    },
    {
      id: 'b4-layers',
      prompt: 'B4’s control architecture has three layers. Which set is correct?',
      correct: {
        id: 'a',
        text: 'Switch hardware on OpenFlow; per-site controllers with Paxos; a global SDN gateway plus central TE',
      },
      incorrect: [
        { id: 'b', text: 'Traditional access, aggregation, and core router tiers exactly like those found in legacy WAN designs' },
        { id: 'c', text: 'Top-of-rack switches, spine blocks, and a separate dedicated Optical Circuit Switch layer sitting on top' },
        { id: 'd', text: 'The classic OSI application, transport, and network protocol layers stacked together' },
        { id: 'e', text: 'Ingress, middle, and egress switching stages of a single multi-stage Clos fabric' },
      ],
      explanation:
        'B4’s layers are: (1) switch hardware running OpenFlow agents; (2) site-level Network Control Servers hosting OpenFlow controllers (with Paxos for leader election); and (3) the global layer with the SDN gateway and centralized TE server that drives the whole WAN.',
      reference: B4('Architecture overview'),
      tags: ['architecture'],
    },
    {
      id: 'b4-paxos',
      prompt: 'What role does Paxos play in B4?',
      correct: {
        id: 'a',
        text: 'Leader election and state consistency among redundant per-site OpenFlow controllers',
      },
      incorrect: [
        { id: 'b', text: 'Hashing individual flows onto the available ECMP paths for even traffic load distribution' },
        { id: 'c', text: 'Dynamic optical wavelength assignment across the entire long-haul fiber plant' },
        { id: 'd', text: 'Compressing the large routing tables before distributing them out to the edge devices' },
        { id: 'e', text: 'Encrypting all OpenFlow control messages between controllers and switches' },
      ],
      explanation:
        'B4 runs replicated controllers for fault tolerance; Paxos elects the master and keeps replicas consistent, so a controller failure doesn’t take down a site.',
      reference: B4('Control plane — fault tolerance'),
      tags: ['architecture', 'fault-tolerance'],
    },
    {
      id: 'b4-routing',
      prompt: 'How does B4 interoperate with traditional routing protocols?',
      correct: {
        id: 'a',
        text: 'It runs a Quagga BGP/IS-IS stack on the controllers for interop and shortest-path fallback, while centralized TE overrides paths',
      },
      incorrect: [
        { id: 'b', text: 'It completely removes both BGP and IS-IS from the WAN, relying solely on the central controllers for paths' },
        { id: 'c', text: 'It tunnels absolutely everything over MPLS label-switched paths and performs no IP routing at all' },
        { id: 'd', text: 'It uses only static routes that operators configure by hand on every single device in the WAN' },
        { id: 'e', text: 'It relies entirely on the classic spanning tree protocol to build all of its forwarding paths' },
      ],
      explanation:
        'B4 is a hybrid: a routing stack (Quagga, via the Routing Application Proxy) provides baseline shortest-path/BGP behavior and interop, while the centralized TE layer installs higher-priority tunnels to optimize utilization. If TE fails, the network falls back to plain shortest-path routing.',
      reference: B4('Routing — integration'),
      tags: ['routing', 'bgp'],
    },
    {
      id: 'b4-result',
      prompt: 'What headline result did B4 achieve for link utilization?',
      correct: {
        id: 'a',
        text: 'Near 100% link utilization while respecting app priorities',
      },
      incorrect: [
        { id: 'b', text: 'It deliberately capped link utilization near 30% to reserve spare safety headroom for failures' },
        { id: 'c', text: 'It eliminated the need for any dedicated long-haul WAN links running between the sites' },
        { id: 'd', text: 'It roughly doubled end-user web latency across nearly all of Google’s services' },
        { id: 'e', text: 'It removed the need for any congestion control in the network entirely' },
      ],
      explanation:
        'By centrally engineering traffic over an elastic, prioritized workload, B4 sustained near-100% utilization on its busiest links — several times more efficient than conventional WANs.',
      reference: B4('Evaluation — results'),
      tags: ['results', 'utilization'],
    },
    {
      id: 'b4-why-possible',
      prompt: 'Why can B4 use a far more aggressive centralized TE approach than the public internet could?',
      correct: {
        id: 'a',
        text: 'Google controls both endpoints and the network, with mostly elastic traffic of known, classifiable priority',
      },
      incorrect: [
        { id: 'b', text: 'The WAN has effectively infinite spare bandwidth, so aggressive optimization carries essentially no risk at all' },
        { id: 'c', text: 'Public internet routers everywhere also run OpenFlow today, which enables exactly the same global optimization' },
        { id: 'd', text: 'B4 carries only internal non-user data that can be dropped without consequence' },
        { id: 'e', text: 'Latency is irrelevant on a WAN so aggressive packing has no user-visible impact' },
      ],
      explanation:
        'A single operator controlling edge servers, switches, and applications — with elastic, classifiable traffic — makes global optimization tractable. That degree of control is exactly what the public, multi-operator internet lacks.',
      reference: B4('Discussion'),
      tags: ['design', 'context'],
    },
    {
      id: 'b4-elastic-tpm',
      prompt: 'How does the predominantly elastic nature of B4 traffic (bulk copies, remote storage, state sync) change the way a TPM would plan maintenance windows or capacity upgrades for the WAN supporting Workspace data availability?',
      correct: {
        id: 'a',
        text: 'Elastic bulk flows can be throttled or deferred during maintenance, enabling smaller change windows while still fully protecting interactive user traffic',
      },
      incorrect: [
        { id: 'b', text: 'All B4 traffic is uniformly latency-sensitive and must be treated exactly like real-time user-facing web traffic in every window' },
        { id: 'c', text: 'Elasticity means the entire WAN can simply be taken fully offline for hours during upgrades with no user-visible impact' },
        { id: 'd', text: 'It forces TPMs to over-provision every link to 200% of peak load just to absorb any throttling during upgrades' },
        { id: 'e', text: 'Elastic flows use UDP only, so standard TCP-based maintenance and drain tooling simply cannot be used here' },
      ],
      explanation:
        'Because most B4 traffic can tolerate delay or rate-limiting (unlike real-time user sessions), TPMs can schedule maintenance during lower global utilization periods, temporarily shift lower-priority bulk jobs, and use the TE system itself to drain traffic gracefully. This shrinks the blast radius and makes “hitless” upgrades more achievable than on a general-purpose internet backbone.',
      reference: B4('Traffic characteristics'),
      tags: ['traffic', 'elasticity', 'tpm'],
    },
    {
      id: 'b4-te-failure-tpm',
      prompt: 'If the centralized Traffic Engineering service in B4 experiences a prolonged outage, what fallback behavior should a TPM expect and plan recovery playbooks around?',
      correct: {
        id: 'a',
        text: 'It falls back to shortest-path routing via the Quagga BGP/IS-IS stack, giving basic connectivity but lower utilization and no prioritization',
      },
      incorrect: [
        { id: 'b', text: 'All inter-datacenter traffic is immediately and fully dropped until the TE service is manually restarted on every single site controller across the WAN' },
        { id: 'c', text: 'OpenFlow agents on every switch automatically revert to a pre-programmed static full mesh that somehow still sustains near 100% link utilization everywhere' },
        { id: 'd', text: 'Paxos automatically elects a brand-new global TE master within seconds, so essentially no inter-site traffic is ever lost' },
        { id: 'e', text: 'The WAN simply continues running at near-100% utilization using only local per-switch forwarding decisions' },
      ],
      explanation:
        'B4 was explicitly designed with a hybrid model: TE provides optimization on top of a working distributed routing underlay. A TPM must model the “degraded but available” state — utilization drops, some priority inversions occur, and bulk jobs slow down — and have playbooks to accelerate TE recovery, shed lower-priority work, and communicate realistic SLO impact to Workspace service owners during such incidents.',
      reference: B4('Routing — integration'),
      tags: ['fault-tolerance', 'te', 'tpm'],
    },
  ],
};
