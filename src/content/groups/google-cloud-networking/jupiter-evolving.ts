import type { Reference, Subject } from '../../../types/content';

const JE = (section: string): Reference => ({
  sourceTitle: 'Jupiter Evolving: Optical Circuit Switches and SDN (SIGCOMM 2022)',
  url: 'https://research.google/pubs/jupiter-evolving-transforming-googles-datacenter-network-via-optical-circuit-switches-and-software-defined-networking/',
  locator: { kind: 'section', section },
});

export const jupiterEvolving: Subject = {
  id: 'je',
  name: 'Jupiter Evolving (SIGCOMM 2022) (TPM III Prep)',
  description:
    'Evolution from spine-based Jupiter to OCS-enabled direct-connect fabric: reconfigurable topology, heterogeneous block support, ~30% capex / ~41% power savings. TPM III focus: managing generational fabric transformations, hitless operations, topology engineering coordination between hardware and SDN teams, and long-term cost/power efficiency programs for Cloud Networking. Balanced options.',
  questions: [
    {
      id: 'je-core',
      prompt: 'What is the central architectural change introduced in Jupiter Evolving?',
      correct: {
        id: 'a',
        text: 'Adding an Optical Circuit Switch layer for a reconfigurable direct-connect topology between blocks, removing the spine tier',
      },
      incorrect: [
        { id: 'b', text: 'Replacing every ToR switch in the fabric with an optical circuit switch for server connectivity' },
        { id: 'c', text: 'Relocating the entire datacenter network control plane into Google Cloud’s public infrastructure' },
        { id: 'd', text: 'Switching from the multi-stage Clos design to a simple unidirectional ring topology for lower latency' },
        { id: 'e', text: 'Adopting MPLS Traffic Engineering with RSVP-TE signaling across every fabric link in the building' },
      ],
      explanation:
        'Jupiter Evolving replaces the rigid electronic spine with a layer of MEMS-based OCS, letting aggregation (machine) blocks connect directly and have their interconnect topology reconfigured in software.',
      reference: JE('Overview — direct-connect'),
      tags: ['architecture', 'ocs'],
    },
    {
      id: 'je-why',
      prompt: 'What key advantage does an OCS layer give over a fixed electronic spine?',
      correct: {
        id: 'a',
        text: 'It allows incremental heterogeneous upgrades and software-driven topology changes with no spine rebuild',
      },
      incorrect: [
        { id: 'b', text: 'It inspects packet headers optically at line rate, eliminating the need for any electronic lookup tables' },
        { id: 'c', text: 'It runs the BGP routing protocol natively inside the OCS layer so no separate control plane network exists' },
        { id: 'd', text: 'It provides hardware-level line-rate encryption for all traffic crossing the shared optical backplane' },
        { id: 'e', text: 'It fully removes the need for any pluggable optical transceivers on the aggregation block uplink ports' },
      ],
      explanation:
        'Because an OCS is data-rate/wavelength agnostic and just steers light, you can mix generations of aggregation blocks, add capacity block-by-block, and reconfigure who-connects-to-whom in software — none of which a fixed spine allows.',
      reference: JE('Motivation'),
      tags: ['design', 'ocs'],
    },
    {
      id: 'je-mems',
      prompt: 'How does Google’s OCS physically switch connections?',
      correct: {
        id: 'a',
        text: 'MEMS micro-mirrors tilt to steer a light beam from any input fiber to any output fiber',
      },
      incorrect: [
        { id: 'b', text: 'Incoming packets are buffered in fast optical RAM inside the switch before being forwarded out the correct port' },
        { id: 'c', text: 'Incoming light is converted to electrical signals, switched electronically, then converted back into light' },
        { id: 'd', text: 'The source laser wavelength is dynamically retuned to route the signal toward the correct destination port' },
        { id: 'e', text: 'A motorized physical patch panel mechanically rotates to connect the desired input and output fibers' },
      ],
      explanation:
        'The OCS uses arrays of MEMS mirrors (Micro-Electro-Mechanical Systems) to bounce a beam from any input port to any output port — no optical-electrical-optical conversion, so it is transparent to data rate and protocol.',
      reference: JE('Apollo OCS — technology'),
      tags: ['optical', 'mems'],
    },
    {
      id: 'je-oeo',
      prompt: 'Why is avoiding optical-electrical-optical (O-E-O) conversion in the OCS layer beneficial?',
      correct: {
        id: 'a',
        text: 'Staying optical saves significant power and cost while keeping the OCS agnostic to data rate and protocol',
      },
      incorrect: [
        { id: 'b', text: 'Optical buffering is deliberately added to increase the latency and allow more sophisticated traffic shaping' },
        { id: 'c', text: 'The OCS can inspect packet headers optically to make dynamic routing decisions without electronic help' },
        { id: 'd', text: 'ECMP load balancing fundamentally requires avoiding any O-E-O conversion in the middle of the fabric path' },
        { id: 'e', text: 'WDM multiplexing is performed inside the OCS itself, so external pluggable transceivers are not needed' },
      ],
      explanation:
        'Staying in the optical domain means the OCS doesn’t care whether the light is 40G, 100G, or 400G — upgrading edge optics doesn’t require upgrading the OCS — and it avoids the power and cost of conversion electronics.',
      reference: JE('Apollo OCS — technology'),
      tags: ['optical', 'power'],
    },
    {
      id: 'je-wdm',
      prompt: 'How does Jupiter Evolving increase the capacity carried over each fiber/OCS port?',
      correct: {
        id: 'a',
        text: 'WDM packs more wavelengths onto each fiber while circulators enable two-way transmission, raising per-strand capacity',
      },
      incorrect: [
        { id: 'b', text: 'Adding more MEMS mirrors per OCS port creates extra parallel light paths through the switch fabric' },
        { id: 'c', text: 'Running the source lasers at higher drive voltage increases the optical signal strength and reach' },
        { id: 'd', text: 'Compressing packet payloads before optical transmission lowers the effective data rate carried per wavelength' },
        { id: 'e', text: 'Overclocking the merchant switch silicon raises packet processing speed across every uplink port in the block' },
      ],
      explanation:
        'WDM multiplies the channels per fiber, and circulators let a single fiber carry light in both directions — together raising the effective capacity through the OCS plane.',
      reference: JE('Optical layer — WDM & circulators'),
      tags: ['optical', 'wdm'],
    },
    {
      id: 'je-sdn',
      prompt: 'Jupiter Evolving relies on SDN for two complementary functions. Which pair?',
      correct: {
        id: 'a',
        text: 'Traffic Engineering to route flows and Topology Engineering to map OCS cross-connects to demand',
      },
      incorrect: [
        { id: 'b', text: 'Spanning Tree Protocol for loop prevention combined with NAT for IP address management at every fabric edge' },
        { id: 'c', text: 'DHCP for dynamic IP addressing and DNS for internal service discovery across every aggregation block' },
        { id: 'd', text: 'Firewalling for security policy enforcement and server load balancing for east-west traffic between racks' },
        { id: 'e', text: 'Wavelength assignment by the OCS and packet buffering at the ToR switches for end-to-end congestion control' },
      ],
      explanation:
        'Because the topology is now reconfigurable, SDN must do Topology Engineering (set the OCS cross-connects to match demand) and Traffic Engineering (route flows over the resulting non-uniform topology). The two work together to match capacity to traffic.',
      reference: JE('SDN — traffic & topology engineering'),
      tags: ['sdn', 'control-plane'],
    },
    {
      id: 'je-directconnect',
      prompt: "What does the 'direct-connect' topology mean in Jupiter Evolving?",
      correct: {
        id: 'a',
        text: 'Aggregation blocks interconnect through the OCS layer instead of via a separate spine tier',
      },
      incorrect: [
        { id: 'b', text: 'Every server is wired directly to every other server in the fabric with no switching layer at all' },
        { id: 'c', text: 'Each datacenter building connects directly to the public internet without any intervening WAN edge' },
        { id: 'd', text: 'Every top-of-rack switch is cabled straight into the wide-area network, bypassing the fabric' },
        { id: 'e', text: 'Each aggregation block is given a dedicated dark fiber running to every other datacenter building' },
      ],
      explanation:
        'With the spine removed, aggregation (machine) blocks interconnect directly through the OCS, and the number of links between any two blocks can be tuned in software to the traffic between them.',
      reference: JE('Overview — direct-connect'),
      tags: ['architecture', 'topology'],
    },
    {
      id: 'je-results',
      prompt: 'Which set of improvements does Jupiter Evolving report versus the prior spine-based design?',
      correct: {
        id: 'a',
        text: 'Roughly 5x higher speed/capacity, about 30% lower capex, and 41% lower power while serving live traffic',
      },
      incorrect: [
        { id: 'b', text: 'A 10x reduction in end-to-end latency paired with a 2x increase in the overall capital expenditure cost' },
        { id: 'c', text: 'No meaningful change in build cost but roughly 5x higher steady-state power consumption across the fabric' },
        { id: 'd', text: 'A 50% reduction in available bisection bandwidth in exchange for a significantly lower overall cost' },
        { id: 'e', text: 'A 100x increase in fabric capacity while maintaining exactly the same total power envelope as before' },
      ],
      explanation:
        'The paper reports roughly 5x speed/capacity, ~30% capex reduction, and ~41% power reduction — achieved incrementally while serving live production traffic.',
      reference: JE('Results'),
      tags: ['results'],
    },
    {
      id: 'je-hitless',
      prompt: 'What makes reconfiguring the OCS topology safe for live traffic?',
      correct: {
        id: 'a',
        text: 'SDN drains the affected links via traffic engineering and shifts flows to other paths, then makes the OCS change incrementally and validates it',
      },
      incorrect: [
        { id: 'b', text: 'All production traffic is paused globally for several minutes while the OCS mirrors move into place' },
        { id: 'c', text: 'The entire datacenter fabric is quiesced and then cold-rebooted between two topology configurations' },
        { id: 'd', text: 'Packets are optically buffered inside the OCS hardware until the new topology fully stabilizes' },
        { id: 'e', text: 'Reconfigurations are only ever performed during scheduled maintenance windows when the building is empty' },
      ],
      explanation:
        'SDN drains affected links and shifts traffic before the OCS re-points them, allowing hitless incremental topology changes and capacity additions while production traffic keeps flowing.',
      reference: JE('Operations — reconfiguration'),
      tags: ['operations', 'reconfiguration'],
    },
    {
      id: 'je-hetero',
      prompt: 'Why is supporting heterogeneous (mixed-generation) aggregation blocks important?',
      correct: {
        id: 'a',
        text: 'Datacenters are refreshed over years, so new faster blocks must coexist with older ones without a forklift upgrade',
      },
      incorrect: [
        { id: 'b', text: 'Every aggregation block in the fabric must be physically identical for a Clos topology to function correctly at all' },
        { id: 'c', text: 'An OCS can only steer and switch traffic at a single fixed data rate that is shared across all of its ports' },
        { id: 'd', text: 'The BGP routing protocol strictly requires that all of the directly connected devices run at exactly the same speed' },
        { id: 'e', text: 'Mixing heterogeneous block generations measurably reduces the total number of fiber strands the fabric needs' },
      ],
      explanation:
        'Real datacenters are upgraded piecemeal. The OCS layer’s rate-agnostic switching lets a fabric mix block generations and speeds, so capacity and technology can be refreshed incrementally instead of all at once.',
      reference: JE('Motivation — heterogeneity'),
      tags: ['design', 'evolution'],
    },
    {
      id: 'je-routing',
      prompt: 'What new routing challenge does a reconfigurable, non-uniform topology create?',
      correct: {
        id: 'a',
        text: 'Link counts between block pairs now vary, so TE must run over a non-uniform, changing topology not a Clos',
      },
      incorrect: [
        { id: 'b', text: 'Every pair of blocks has exactly one possible path, fully eliminating any need to make any routing decisions' },
        { id: 'c', text: 'The BGP routing protocol can no longer run anywhere in the fabric once the electronic spine layer is removed' },
        { id: 'd', text: 'All flows are forced to share one single wavelength across the entire OCS plane, capping throughput' },
        { id: 'e', text: 'End-to-end latency becomes effectively unbounded because mirror light paths can take a variable route' },
      ],
      explanation:
        'A uniform Clos gives symmetric any-to-any paths; a direct-connect OCS topology has different link counts between different block pairs, so the control plane must do traffic engineering over a non-uniform, changing graph.',
      reference: JE('SDN — traffic & topology engineering'),
      tags: ['routing', 'control-plane'],
    },
    {
      id: 'je-patchpanel',
      prompt:
        'An OCS layer is sometimes described as a software-controlled replacement for what manual datacenter component?',
      correct: { id: 'a', text: 'The fiber patch panel — it automates cross-connecting fibers under software control' },
      incorrect: [
        { id: 'b', text: 'The rack power distribution unit that manages and meters rack-level electrical feeds and breakers' },
        { id: 'c', text: 'The server BIOS firmware that controls the boot sequence and low-level hardware initialization steps' },
        { id: 'd', text: 'The top-of-rack switch that aggregates the server connections within a single physical equipment rack' },
        { id: 'e', text: 'The WAN edge router that connects the datacenter building to external networks and peering links' },
      ],
      explanation:
        'Conceptually the OCS is an automated, software-driven patch panel: instead of a technician physically re-cabling cross-connects, the OCS re-points light paths on demand — at datacenter scale and in milliseconds.',
      reference: JE('Apollo OCS — role'),
      tags: ['concepts', 'ocs', 'physical-layer'],
    },
    {
      id: 'je-hitless-tpm',
      prompt: 'As a TPM coordinating a live production change to reconfigure the OCS topology (adding links between two aggregation blocks), what coordination is required across teams to keep Workspace traffic unaffected?',
      correct: {
        id: 'a',
        text: 'SDN drains affected links via traffic engineering, shifts flows to other paths, triggers the OCS change, then validates',
      },
      incorrect: [
        { id: 'b', text: 'The OCS can be reconfigured instantly with zero cross-team coordination because it is purely optical and fully lossless' },
        { id: 'c', text: 'All servers attached to the affected blocks must be quiesced or live-migrated before any mirror movement begins' },
        { id: 'd', text: 'Only the hardware team needs to be involved, since SDN traffic engineering will automatically adapt within 50 ms' },
        { id: 'e', text: 'Reconfiguration is only ever scheduled during quarterly maintenance windows when all production traffic is throttled to 10%' },
      ],
      explanation:
        'Hitless operation in Jupiter Evolving relies on tight coupling between the topology engineering (OCS cross-connect changes) and traffic engineering (draining + shifting). A TPM must run a cross-functional playbook involving network control, operations, and service owners to time the drain, monitor SLOs during the change, and have fast rollback criteria — exactly the kind of coordinated program execution expected at TPM III level.',
      reference: JE('Operations — reconfiguration'),
      tags: ['operations', 'reconfiguration', 'tpm'],
    },
    {
      id: 'je-hetero-tpm',
      prompt: 'Why is the ability of an OCS-based fabric to support heterogeneous (mixed-generation) aggregation blocks a major advantage for a multi-year TPM-led datacenter refresh program?',
      correct: {
        id: 'a',
        text: 'Newer faster blocks deploy through the rate-agnostic OCS without a simultaneous upgrade of every existing block, spreading capex',
      },
      incorrect: [
        { id: 'b', text: 'Heterogeneity works only because the OCS internally converts every optical signal to a common electrical format' },
        { id: 'c', text: 'Every aggregation block must run identical ToR switch hardware and firmware for ECMP to work correctly' },
        { id: 'd', text: 'Mixing block generations forces reverting to a rigid electronic spine layer to prevent topology asymmetry' },
        { id: 'e', text: 'Total power consumption rises because the older slower blocks must be overclocked to match the newer ones' },
      ],
      explanation:
        'Real datacenters are built and refreshed over years. The OCS’s data-rate and protocol agnosticism lets TPMs deploy shiny new 800G blocks alongside 100G/400G blocks from prior generations. This spreads capex, lets you learn from early deployments, and keeps the program on a realistic multi-year timeline instead of a risky all-or-nothing cutover.',
      reference: JE('Motivation — heterogeneity'),
      tags: ['evolution', 'heterogeneous', 'tpm'],
    },
    {
      id: 'je-routing-challenge-tpm',
      prompt: 'What new operational complexity does the shift to a reconfigurable, non-uniform direct-connect topology in Jupiter Evolving introduce for the teams a TPM must coordinate?',
      correct: {
        id: 'a',
        text: 'Traffic engineering must continuously adapt to a changing, asymmetric graph of links between blocks, not a static Clos',
      },
      incorrect: [
        { id: 'b', text: 'Both BGP and IS-IS must be completely removed from the whole fabric because shortest-path routing no longer applies at all' },
        { id: 'c', text: 'Every individual flow now requires an explicit end-to-end circuit reservation, much like the old-school MPLS-TE tunnels' },
        { id: 'd', text: 'The OCS layer makes ECMP fundamentally impossible, forcing all load balancing up into application-layer sharding logic' },
        { id: 'e', text: 'End-to-end latency becomes unpredictable because individual light paths can take dozens of hops through the mirrors' },
      ],
      explanation:
        'In a classic Clos every path is two hops and symmetric. With OCS direct-connect, the number of parallel links between any pair of blocks can be tuned to demand. This gives huge efficiency wins but means TE algorithms and monitoring must handle a dynamic, non-uniform topology. TPMs need to ensure the SDN platform team and operations have the tooling and runbooks to reason about and debug this new model at scale.',
      reference: JE('SDN — traffic & topology engineering'),
      tags: ['routing', 'control-plane', 'tpm'],
    },
  ],
};
