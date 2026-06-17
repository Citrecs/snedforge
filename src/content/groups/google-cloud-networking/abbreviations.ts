import type { Reference, Subject } from '../../../types/content';

// Generic reference helper for abbreviations that span multiple sources or industry standards.
const ABBR = (term: string): Reference => ({
  sourceTitle: `Industry standard / Google networking terminology — ${term}`,
  locator: { kind: 'section', section: 'Abbreviations & Acronyms' },
});

export const abbreviations: Subject = {
  id: 'abbr',
  name: 'Key Abbreviations & Acronyms (TPM III Cloud Networking)',
  description:
    'Master the language used by network engineering, hardware, and operations teams. For TPM III prep: these terms appear constantly in design reviews, risk registers, capacity models, and cross-functional discussions about Workspace delivery reliability, deployment programs, and trade-off decisions. Questions test both expansion and contextual understanding.',
  questions: [
    {
      id: 'abbr-sdn',
      prompt: 'In Google’s B4 and Jupiter architectures, what does SDN stand for and what fundamental shift did it introduce for how TPMs reason about network changes?',
      correct: {
        id: 'a',
        text: 'Software-Defined Networking — centralizes control-plane logic in software for global visibility, change simulation, smaller blast radius, and one coordinated source of truth for fabric-wide changes',
      },
      incorrect: [
        { id: 'b', text: 'Secure Data Network — a scheme that transparently encrypts all inter-datacenter traffic by default at line rate' },
        { id: 'c', text: 'Scalable Distributed Network — switch hardware that auto-scales its radix independently, with no central solver at all' },
        { id: 'd', text: 'Service Delivery Network — the public-facing edge tier that fronts Workspace users and steers them to regions' },
        { id: 'e', text: 'Synchronous Data Network — a fabric that guarantees strict in-order delivery for every storage replication flow' },
      ],
      explanation:
        'SDN (Software-Defined Networking) is the foundational idea behind both B4’s central TE and Jupiter’s Firepath/OCS control. For a TPM it means you can often simulate or stage a change in software before touching hardware, model the exact impact on SLOs, and coordinate across many teams with a single source of truth — dramatically improving program predictability compared with traditional distributed protocols.',
      reference: ABBR('SDN'),
      tags: ['sdn', 'control-plane'],
    },
    {
      id: 'abbr-te',
      prompt: 'What does TE stand for in the context of B4 and Jupiter Evolving, and why does it matter for capacity-planning discussions with engineering teams?',
      correct: {
        id: 'a',
        text: 'Traffic Engineering — computes globally optimal paths and bandwidth shares so TPMs can model how drains or failures hit utilization',
      },
      incorrect: [
        { id: 'b', text: 'Topology Engineering — the layer that decides only which fiber pairs get cross-connected inside the OCS mirror array during a reconfiguration' },
        { id: 'c', text: 'Throughput Enhancement — a feature that automatically inserts extra optical amplifiers on every long-haul span to raise raw line capacity' },
        { id: 'd', text: 'Tunnel Encryption — a service that wraps and encrypts every individual flow at the network layer transparently' },
        { id: 'e', text: 'Time-Evolution — a planner that forecasts future traffic growth purely from historical utilization trends' },
      ],
      explanation:
        'Traffic Engineering is the brain that turns raw capacity into usable, prioritized bandwidth. A TPM who understands TE can ask the right questions in capacity reviews (“What happens to bulk sync jobs if we lose this TE server during a planned drain?”) and can translate engineering trade-offs into program risk and timeline impacts.',
      reference: ABBR('Traffic Engineering'),
      tags: ['te', 'capacity'],
    },
    {
      id: 'abbr-ecmp',
      prompt: 'What does ECMP stand for and what practical limitation must a TPM understand when relying on it for load balancing in a Clos or direct-connect fabric?',
      correct: {
        id: 'a',
        text: 'Equal-Cost Multi-Path — hashes flows over parallel paths, so elephant flows still create hot spots',
      },
      incorrect: [
        { id: 'b', text: 'Elastic Cloud Multi-Path — a scheme that provisions brand-new parallel paths only once the OCS detects sustained congestion' },
        { id: 'c', text: 'End-to-End Congestion Management Protocol — a transport that fully replaces TCP for every datacenter flow and handles its own retransmits' },
        { id: 'd', text: 'Extended Control Message Protocol — a signaling layer used solely to drive Firepath controller master election handshakes' },
        { id: 'e', text: 'Enterprise Campus Mesh Protocol — a proprietary Layer-2 fabric that replaces classic spanning tree across the campus everywhere' },
      ],
      explanation:
        'ECMP is the workhorse for spreading traffic in both classic Clos and OCS direct-connect fabrics. TPMs need to know its limitations (hash polarization, elephant flows) because they explain why utilization is never perfect and why centralized TE or application-level sharding is still required for the most demanding workloads.',
      reference: ABBR('ECMP'),
      tags: ['routing', 'load-balancing'],
    },
    {
      id: 'abbr-tor-eor',
      prompt: 'What do ToR and EoR stand for, and when would a TPM advocate for one cabling topology over the other in a new high-density build?',
      correct: {
        id: 'a',
        text: 'Top-of-Rack and End-of-Row — ToR keeps copper short with fiber uplinks; EoR centralizes switches but adds long, hard-to-scale horizontal runs',
      },
      incorrect: [
        { id: 'b', text: 'Top-of-Rack and Edge-of-Rack — two layouts that are effectively identical in cabling cost, power draw, and ongoing day-to-day management overhead' },
        { id: 'c', text: 'Transport over Router and End-of-Route — a pair of terms that describe long-haul WAN edge connectivity options only, never in-building rack cabling' },
        { id: 'd', text: 'Test or Replace and Emergency override Router — operational recovery procedures rather than cabling topologies' },
        { id: 'e', text: 'Top-of-Rack and Everything-over-Ring — EoR here wires racks in a token-ring physical layout for redundancy' },
      ],
      explanation:
        'Understanding ToR vs EoR lets you participate in early design reviews with facilities and cabling contractors. ToR usually wins for speed of deployment and lower power/cost in AI-heavy builds; a TPM who can articulate the trade-offs helps lock the right decision before construction drawings are finalized.',
      reference: ABBR('ToR / EoR'),
      tags: ['cabling', 'physical-layer'],
    },
    {
      id: 'abbr-clos',
      prompt: 'What is a Clos network (and why do TPMs hear the term constantly when discussing Jupiter fabrics)?',
      correct: {
        id: 'a',
        text: 'A multi-stage non-blocking topology from Charles Clos built from many small, identical switches',
      },
      incorrect: [
        { id: 'b', text: 'A proprietary Google switch ASIC that is deployed only in the spine layer of every single Jupiter datacenter fabric generation' },
        { id: 'c', text: 'A Layer-4 load-balancing algorithm that runs inside Google Cloud’s external load balancers to spread incoming client flows' },
        { id: 'd', text: 'An optical switching protocol that fully replaces ECMP hashing within every OCS-based datacenter fabric' },
        { id: 'e', text: 'A structured-cabling standard within TIA-942 that covers only the main distribution areas of a data hall' },
      ],
      explanation:
        'Clos (and its folded/spine-leaf variant) is why Google can scale to petabits of bisection bandwidth using cheap merchant silicon instead of expensive chassis routers. Every TPM discussion about “adding another block” or “maintaining full bisection” ultimately rests on Clos math.',
      reference: ABBR('Clos'),
      tags: ['topology', 'clos'],
    },
    {
      id: 'abbr-ocs-mems',
      prompt: 'What does OCS stand for in Jupiter Evolving, and what physical technology (MEMS) makes its reconfigurability possible?',
      correct: {
        id: 'a',
        text: 'Optical Circuit Switch — MEMS micro-mirrors physically steer light between fibers, reconfiguring the topology in software with no O-E-O conversion and no recabling of the physical plant',
      },
      incorrect: [
        { id: 'b', text: 'Open Circuit Switch — a switching fabric built entirely on electrical crossbars that buffers packets at every stage' },
        { id: 'c', text: 'Optical Channel Scheduler — a control unit that only assigns wavelengths to flows and never switches any light path' },
        { id: 'd', text: 'Out-of-Band Control System — the dedicated management network that interconnects the Firepath controllers' },
        { id: 'e', text: 'Optical Core Switch — really just a high-radix electronic spine dressed up with an optical-sounding label' },
      ],
      explanation:
        'The OCS (with MEMS mirrors) is the key enabler of Jupiter Evolving’s spineless, reconfigurable, heterogeneous fabric. TPMs who understand that it is a software-controlled automated patch panel can better coordinate the hardware, SDN, and operations workstreams needed for hitless topology changes.',
      reference: ABBR('OCS / MEMS'),
      tags: ['optical', 'ocs'],
    },
    {
      id: 'abbr-wdm',
      prompt: 'What does WDM stand for and how does it multiply capacity in both traditional fiber plants and Jupiter Evolving OCS paths?',
      correct: {
        id: 'a',
        text: 'Wavelength-Division Multiplexing — carries many independent channels on different colors of light over one fiber, multiplying capacity without new strands',
      },
      incorrect: [
        { id: 'b', text: 'Waveform Data Modulation — a preprocessing step that compresses and reshapes packets just before they enter the optical transmission domain of a fiber link' },
        { id: 'c', text: 'Wideband Digital Multiplexing — a time-slot division technique that applies only to legacy copper T1 and E1 circuits found across much older carrier WAN plants' },
        { id: 'd', text: 'Wireless Data Mesh — a radio-based standby path that takes over when the primary fiber plant fails completely' },
        { id: 'e', text: 'Wavelength Distribution Manager — a software-only scheduling function that lives inside the central TE controller' },
      ],
      explanation:
        'WDM (especially DWDM) is why a single fiber pair can carry terabits. In Jupiter Evolving it is combined with circulators for bidirectional use. A TPM who grasps this can evaluate whether a proposed fiber plant design has enough lambda capacity for future growth or whether additional strands or higher-order modulation will be needed.',
      reference: ABBR('WDM'),
      tags: ['optical', 'wdm'],
    },
    {
      id: 'abbr-smf-mmf',
      prompt: 'What is the key practical difference between SMF and MMF that affects transceiver choice and reach in a datacenter fabric build?',
      correct: {
        id: 'a',
        text: 'Single-Mode Fiber (tiny core, lasers) reaches far and carries many wavelengths; Multi-Mode (larger core, VCSELs) is cheaper but modal-dispersion limited',
      },
      incorrect: [
        { id: 'b', text: 'SMF is always the pricier choice and is strictly WAN-only, while MMF is what handles every single intra-building link no matter the negotiated line speed' },
        { id: 'c', text: 'The two fiber types differ only in their outer jacket color, since their measured optical performance is effectively identical at 100G and at every speed above' },
        { id: 'd', text: 'SMF requires active electrical-to-optical conversion at each end, whereas MMF is an entirely passive medium' },
        { id: 'e', text: 'MMF reliably supports higher data rates over much longer distances than SMF in every datacenter scenario' },
      ],
      explanation:
        'SMF vs MMF decisions directly affect transceiver cost, power, and whether you can use the OCS or need regeneration. TPMs see this in hardware BOM reviews and must understand why a “cheap” MMF decision today can become expensive when you later want 800G or longer structured-cabling runs.',
      reference: ABBR('SMF / MMF'),
      tags: ['fiber', 'physical-layer'],
    },
    {
      id: 'abbr-mpo',
      prompt: 'What does MPO/MTP stand for and why has it become the dominant connector for high-density fabric uplinks in Clos and OCS designs?',
      correct: {
        id: 'a',
        text: 'Multi-fiber Push-On / Mechanical Transfer Push-On — bundles many fibers in one connector',
      },
      incorrect: [
        { id: 'b', text: 'Multi-Path Optical — a dynamic routing protocol that fully replaces ECMP hashing when selecting optical circuits across a fabric' },
        { id: 'c', text: 'Main Patch Outlet — the single central cross-connect that sits in the main distribution area as defined within the TIA-942 standard' },
        { id: 'd', text: 'Managed Passive Optical — a component used only inside the MEMS mirror array at the heart of an OCS' },
        { id: 'e', text: 'Maximum Power Output — a launch-power rating printed on the label of optical transceiver modules' },
      ],
      explanation:
        'MPO connectors are why you can cable a 48-port ToR uplink or a full aggregation block in hours instead of days. Pre-terminated MPO trunks are a cornerstone of fast, high-quality structured-cabling programs. A TPM who understands MPO polarity, gender, and pinning issues can avoid costly rework during commissioning.',
      reference: ABBR('MPO / MTP'),
      tags: ['connectors', 'physical-layer'],
    },
    {
      id: 'abbr-dac-aoc',
      prompt: 'What do DAC and AOC stand for, and when would a TPM choose one over the other for in-rack server-to-ToR links?',
      correct: {
        id: 'a',
        text: 'Direct-Attach Copper and Active Optical Cable — DAC is passive and cheapest for very short reaches; AOC adds optics for longer or EMI-prone runs',
      },
      incorrect: [
        { id: 'b', text: 'Data Acquisition Cable and Advanced Optical Connector — two completely interchangeable choices that work equally well at absolutely any link distance' },
        { id: 'c', text: 'Distributed Access Control and Aggregated Optical Channel — a pair of mechanisms used only on the spine-to-OCS uplink connections within a fabric block' },
        { id: 'd', text: 'Direct-Attach Copper and Always-On Connection — IEEE mandates AOC for every server link running at 25G or above' },
        { id: 'e', text: 'DAC is fiber-only and AOC is copper-only, so picking between them is purely a matter of jacket color coding' },
      ],
      explanation:
        'For the millions of server-to-ToR links in a building, even small power or cost differences matter. TPMs often see DAC vs AOC decisions in hardware standardization or energy-efficiency programs. Understanding reach, power, and EMI trade-offs lets you challenge or support engineering recommendations with confidence.',
      reference: ABBR('DAC / AOC'),
      tags: ['cabling', 'physical-layer'],
    },
    {
      id: 'abbr-firepath',
      prompt: 'What is Firepath in the Jupiter fabric, and how does its centralized model change the way TPMs plan and validate routing changes?',
      correct: {
        id: 'a',
        text: 'A centralized control system where switches report link state to a replicated master that computes and pushes their forwarding tables, giving one place to stage and simulate routing changes',
      },
      incorrect: [
        { id: 'b', text: 'An optical path-computation engine that runs inside the OCS MEMS mirror controller and steers light between fiber ports' },
        { id: 'c', text: 'The BGP-speaking border router that links the Jupiter fabric out to B4 and the public internet, advertising prefixes upstream' },
        { id: 'd', text: 'A distributed hash table that ToRs consult to pick their ECMP paths without any central coordination' },
        { id: 'e', text: 'The out-of-band console server reserved purely for emergency manual recovery of individual failed switches' },
      ],
      explanation:
        'Firepath gives TPMs a single place to understand “what routes exist right now” and to stage or simulate changes. This is invaluable when you need to prove to service owners that a maintenance window or block addition will not violate Workspace SLOs.',
      reference: ABBR('Firepath'),
      tags: ['control-plane', 'jupiter'],
    },
    {
      id: 'abbr-cpn',
      prompt: 'What does CPN stand for in Jupiter fabrics and why is it architecturally separated from the data plane?',
      correct: {
        id: 'a',
        text: 'Control-Plane Network — a dedicated out-of-band network for Firepath, telemetry, and management so control survives data-plane congestion',
      },
      incorrect: [
        { id: 'b', text: 'Customer Premises Network — the demarcation point where the fabric hands traffic off to Google Cloud customers' },
        { id: 'c', text: 'Cluster Private Network — a network that provides flat Layer-2 adjacency for all of the servers sitting inside one single aggregation block' },
        { id: 'd', text: 'Centralized Policy Node — the one server instance that runs the global traffic-engineering optimization solver for the entire fabric at once' },
        { id: 'e', text: 'Console Port Network — a network used only during initial switch bootstrap and zero-touch provisioning runs' },
      ],
      explanation:
        'Separating control from data is a core reliability pattern. A TPM who understands the CPN can ask better questions about “what happens if the management network is partitioned?” and can ensure that runbooks and monitoring treat control-plane health as a first-class SLO.',
      reference: ABBR('CPN'),
      tags: ['control-plane', 'reliability'],
    },
    {
      id: 'abbr-tia942',
      prompt: 'What is TIA-942 and why should a TPM with structured-cabling or data-center construction experience care about its hierarchy?',
      correct: {
        id: 'a',
        text: 'A Telecommunications Industry Association standard defining MDA, HDA, and EDA cabling spaces',
      },
      incorrect: [
        { id: 'b', text: 'A Google-internal-only cabling specification that is used exclusively for OCS fabric deployments and is never shared with outside contractors' },
        { id: 'c', text: 'An IEEE standard that strictly mandates a folded Clos topology for every new datacenter rated above ten megawatts of total provisioned power' },
        { id: 'd', text: 'A European Union regulation governing fiber recycling and broad data-center sustainability reporting' },
        { id: 'e', text: 'An old Bellcore spec for T1 copper entrance facilities still widely in use across carrier hotels today' },
      ],
      explanation:
        'TIA-942 gives you and your cabling contractors a common language for “where does this fiber belong?” and “how do we label and document it?” A TPM who speaks MDA/HDA/EDA can review drawings, spot single points of failure in the physical plant, and ensure the logical Clos topology has a clean, supportable physical realization.',
      reference: ABBR('TIA-942'),
      tags: ['standards', 'structured-cabling', 'rcdd'],
    },
    {
      id: 'abbr-rcdd',
      prompt: 'What does RCDD stand for and how does it relate to the physical-layer and structured-cabling content in this study set?',
      correct: {
        id: 'a',
        text: 'Registered Communications Distribution Designer — a BICSI credential for structured-cabling design, TIA-942 spaces, and link budgets',
      },
      incorrect: [
        { id: 'b', text: 'Remote Cloud Data Delivery — a fully managed Google Cloud product that edge-caches Workspace content as close to the end users as possible' },
        { id: 'c', text: 'Redundant Clos Design Document — a standardized internal template that engineers use for new Jupiter fabric proposals' },
        { id: 'd', text: 'Rack Cooling Distribution Device — a facilities sensor that actively manages hot-aisle and cold-aisle airflow balance across an entire row' },
        { id: 'e', text: 'Regional Capacity Decision Dashboard — a planning tool that network capacity TPMs use for forecasting' },
      ],
      explanation:
        'If you already hold (or are studying for) the RCDD, the physical-layer and cabling questions here map directly to your domain expertise. It is a strong signal to hiring managers that you can bridge the gap between “what the network engineers want logically” and “what can actually be built, cabled, tested, and maintained in a real data hall.”',
      reference: ABBR('RCDD'),
      tags: ['rcdd', 'physical-layer'],
    },
  ],
};
