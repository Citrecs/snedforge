import type { Reference, Subject } from '../../../types/content';

// General physical-layer refreshers — no single paper; cite the relevant domain.
const PHYS = (section: string): Reference => ({
  sourceTitle: 'Datacenter physical layer & structured cabling (fiber optics, TIA-942)',
  locator: { kind: 'section', section },
});
const JE = (section: string): Reference => ({
  sourceTitle: 'Jupiter Evolving: Optical Circuit Switches and SDN (SIGCOMM 2022)',
  url: 'https://research.google/pubs/jupiter-evolving-transforming-googles-datacenter-network-via-optical-circuit-switches-and-software-defined-networking/',
  locator: { kind: 'section', section },
});

export const physicalLayer: Subject = {
  id: 'phys',
  name: 'Physical Layer & Topology Refresher (RCDD) (TPM III Prep)',
  description:
    'Structured cabling, fiber optics, TIA-942 hierarchy, ToR/EoR, link budgets, and OCS as automated patch panel — tied to Jupiter fabrics. For TPMs with RCDD or data-center construction background: cabling program oversight, contractor coordination, insertion-loss budgeting for OCS adds, and physical-layer implications of logical topology choices on deployment cost, timeline, and reliability for Workspace delivery. Balanced options.',
  questions: [
    {
      id: 'phys-smf-mmf',
      prompt: 'What is the key difference between single-mode (SMF) and multi-mode (MMF) fiber?',
      correct: {
        id: 'a',
        text: 'SMF’s tiny ~9µm core carries a single light path for long reach; MMF’s wider core carries many modes but only short reach',
      },
      incorrect: [
        { id: 'b', text: 'SMF is just plain copper twisted-pair, while MMF is the only true glass-fiber optical medium in modern use' },
        { id: 'c', text: 'MMF reaches much farther than SMF because its wider core greatly lowers modal dispersion losses overall' },
        { id: 'd', text: 'SMF carries many wavelengths simultaneously, while MMF is strictly limited to a single color of light' },
        { id: 'e', text: 'They are identical internally and differ only in the outer jacket color used for coding them apart' },
      ],
      explanation:
        'SMF (~9µm core, laser sources) supports long reaches with low dispersion and is used for longer datacenter, WDM, and OCS links. MMF (50µm OM3/OM4/OM5, historically VCSEL optics) is cheaper for short reaches but distance-limited by modal dispersion.',
      reference: PHYS('Optical fiber types'),
      tags: ['fiber', 'physical-layer'],
    },
    {
      id: 'phys-qsfp',
      prompt: 'What is a QSFP/QSFP28 module in a datacenter switch?',
      correct: {
        id: 'a',
        text: 'A hot-pluggable transceiver terminating a fiber (or direct-attach copper) at a switch port',
      },
      incorrect: [
        { id: 'b', text: 'A standardized angled end-face polish applied to fiber connectors to reduce back-reflections' },
        { id: 'c', text: 'A link-state routing protocol that computes the optimal paths across optical transport networks' },
        { id: 'd', text: 'A MEMS micro-mirror array that steers light between fiber ports' },
        { id: 'e', text: 'A passive multiplexer combining several color channels onto one fiber' },
      ],
      explanation:
        'Pluggable transceivers (SFP+, QSFP+, QSFP28, QSFP-DD, OSFP…) convert between a switch’s electrical lanes and optical fiber (or DAC). The "Q" means quad (4 lanes); a QSFP28 carries 100G as 4×25G, for example.',
      reference: PHYS('Pluggable optics / transceivers'),
      tags: ['transceivers', 'physical-layer'],
    },
    {
      id: 'phys-mpo',
      prompt: 'Where are MPO/MTP multi-fiber connectors typically used?',
      correct: {
        id: 'a',
        text: 'For parallel optics spreading a link across several fibers (e.g., 40G/100G-SR4)',
      },
      incorrect: [
        { id: 'b', text: 'Exclusively for single-fiber long-haul DWDM circuits between metro and regional facility sites' },
        { id: 'c', text: 'For high-speed copper Ethernet cabling runs where shielded twisted-pair would be far too lossy' },
        { id: 'd', text: 'For datacenter power distribution between busways and rack-mounted PDUs at the cabinet level' },
        { id: 'e', text: 'Only inside the OCS mirror array, where it aligns MEMS micro-mirrors to the fiber collimators' },
      ],
      explanation:
        'MPO/MTP connectors bundle 8/12/24 fibers so parallel-optics transceivers (e.g., 40GBASE-SR4 uses 4 transmit + 4 receive fibers) cable up with a single connector — common in spine-leaf fabric cabling and structured-cabling trunks.',
      reference: PHYS('Connectors — MPO/MTP & parallel optics'),
      tags: ['connectors', 'physical-layer'],
    },
    {
      id: 'phys-dwdm-cwdm',
      prompt: 'How do DWDM and CWDM differ?',
      correct: {
        id: 'a',
        text: 'DWDM packs many narrow-spaced channels for capacity at pricier optics; CWDM uses few wide-spaced ones',
      },
      incorrect: [
        { id: 'b', text: 'DWDM is a copper-only transport, while CWDM is the only true fiber-based variant of wavelength multiplexing' },
        { id: 'c', text: 'CWDM carries far more channels than DWDM does, because its much wider grid fits more colors onto each fiber' },
        { id: 'd', text: 'DWDM works only over multimode fiber, whereas CWDM is reserved strictly for single-mode runs' },
        { id: 'e', text: 'They are effectively the same thing, differing only in the vendor branding of the transceivers' },
      ],
      explanation:
        'Dense WDM uses tight channel spacing (e.g., ~0.8 nm / 100 GHz) to fit dozens-plus of wavelengths on a fiber; Coarse WDM uses wide spacing (~20 nm) with far fewer channels and cheaper, uncooled optics. Both increase fiber capacity by multiplexing colors of light.',
      reference: PHYS('WDM — DWDM vs CWDM'),
      tags: ['wdm', 'optical', 'physical-layer'],
    },
    {
      id: 'phys-tor-eor',
      prompt: 'How does a Top-of-Rack (ToR) cabling design differ from End-of-Row (EoR)?',
      correct: {
        id: 'a',
        text: 'ToR puts a switch in each rack: short copper server runs with fiber uplinks; EoR instead centralizes switches at the ends of rows',
      },
      incorrect: [
        { id: 'b', text: 'EoR places a switch inside every single server itself, while ToR eliminates dedicated rack switches completely' },
        { id: 'c', text: 'ToR is used exclusively for storage traffic alone, while EoR handles only the latency-sensitive compute paths' },
        { id: 'd', text: 'Both terms describe WAN edge router placement rather than datacenter cabling topologies at all' },
        { id: 'e', text: 'ToR uses only copper while EoR uses only fiber for every server and uplink connection alike' },
      ],
      explanation:
        'ToR localizes server-to-switch cabling inside the rack (cheap copper/DAC) and uses fiber uplinks to the fabric — the dominant modern approach. EoR/MoR centralizes switching at the row level: longer horizontal server runs but fewer switches to manage.',
      reference: PHYS('Cabling topologies — ToR vs EoR/MoR'),
      tags: ['topology', 'cabling', 'physical-layer'],
    },
    {
      id: 'phys-tia942',
      prompt: 'In the TIA-942 datacenter cabling model, which describes the hierarchy of spaces?',
      correct: {
        id: 'a',
        text: 'Main (MDA), Horizontal (HDA), and Equipment Distribution Areas (EDA), via backbone and horizontal cabling',
      },
      incorrect: [
        { id: 'b', text: 'Core routers, aggregation routers, and access routers wired together by structured backbone trunking' },
        { id: 'c', text: 'Spine ASICs, leaf ASICs, and Top-of-Rack ASICs arranged into the standard structured-cabling distribution areas' },
        { id: 'd', text: 'Optical circuit switch, WDM mux, and circulator stages defined as the three core structured cabling spaces' },
        { id: 'e', text: 'Ingress switches, middle-stage switches, and egress switches connected by horizontal patch cabling' },
      ],
      explanation:
        'TIA-942 defines structured-cabling spaces — MDA (core cross-connect), HDA (distribution to rows), EDA (the racks/cabinets), plus optional zones — connected by backbone (between spaces) and horizontal (to equipment) cabling. This is the RCDD framework underlying any fabric’s physical plant.',
      reference: PHYS('TIA-942 spaces'),
      tags: ['standards', 'structured-cabling', 'physical-layer'],
    },
    {
      id: 'phys-clos-cabling',
      prompt:
        'Compared with a traditional 3-tier (access/aggregation/core) design, a Clos/spine-leaf fabric tends to require…',
      correct: {
        id: 'a',
        text: 'Many more uniform fiber runs (every leaf to every spine), favoring dense MPO trunks and tidy patching',
      },
      incorrect: [
        { id: 'b', text: 'Far fewer cables overall, since collapsing the tiers lets a few trunks serve everything' },
        { id: 'c', text: 'Only copper cabling throughout, since the short leaf-to-spine hops never need fiber' },
        { id: 'd', text: 'No fiber at all between switching tiers, with every spine-to-leaf link carried over passive copper DAC' },
        { id: 'e', text: 'Just a single uplink per rack, because the flattened topology removes the need for redundant fiber paths' },
      ],
      explanation:
        'Spine-leaf’s "every leaf to every spine" wiring multiplies the number of fiber links versus a 3-tier tree, so cabling shifts to dense, structured fiber (MPO trunks, patch panels) — a key physical-plant consideration when designing fabrics.',
      reference: PHYS('Cabling implications of Clos fabrics'),
      tags: ['topology', 'cabling', 'physical-layer'],
    },
    {
      id: 'phys-ocs-xconnect',
      prompt: 'From a cabling perspective, an Optical Circuit Switch behaves most like…',
      correct: {
        id: 'a',
        text: 'An automated cross-connect re-pointing fiber paths under software control',
      },
      incorrect: [
        { id: 'b', text: 'A packet router that maintains a large distributed forwarding table and rewrites packet headers' },
        { id: 'c', text: 'A media converter that translates electrical copper signals into optical signals and back again' },
        { id: 'd', text: 'A fiber amplifier (EDFA) used to boost optical signal power across spans without regeneration' },
        { id: 'e', text: 'A wavelength-locking laser source used to hold DWDM channel center frequencies stable' },
      ],
      explanation:
        'The OCS is functionally an automated fiber cross-connect: where an RCDD would design a manual patch field for cross-connections, the OCS performs those cross-connects in software via MEMS mirrors — central to Jupiter Evolving’s reconfigurable topology.',
      reference: JE('Apollo OCS — role'),
      tags: ['ocs', 'cabling', 'physical-layer'],
    },
    {
      id: 'phys-linkbudget',
      prompt: 'Why must designers account for insertion loss when adding an OCS (or extra patch points) to an optical path?',
      correct: {
        id: 'a',
        text: 'Each connector and switch element adds loss; the total must stay within the link’s optical power budget',
      },
      incorrect: [
        { id: 'b', text: 'Insertion loss actually increases the usable bandwidth, so adding more patch points improves link capacity' },
        { id: 'c', text: 'Optical loss only matters on copper media, where attenuation accumulates much faster than it does on fiber' },
        { id: 'd', text: 'An OCS contributes optical gain along the path, so the added insertion loss can be ignored safely' },
        { id: 'e', text: 'Link-budget accounting applies only to long-haul WAN links and never to in-building fiber paths' },
      ],
      explanation:
        'Every mating sleeve, splice, and the OCS itself attenuates light. End-to-end loss must fit within the transceiver’s power budget (Tx power minus Rx sensitivity); inserting an OCS consumes part of that budget, constraining reach and the number of cross-connects — classic RCDD link-budget math.',
      reference: PHYS('Optical link budget & insertion loss'),
      tags: ['link-budget', 'optical', 'physical-layer'],
    },
    {
      id: 'phys-dac',
      prompt: 'For very short in-rack server-to-ToR links, what medium is commonly used to save cost and power?',
      correct: { id: 'a', text: 'Passive Direct-Attach Copper (DAC) twinax cabling for the short links inside a rack' },
      incorrect: [
        { id: 'b', text: 'Single-mode fiber paired with expensive coherent optics for the in-rack drops' },
        { id: 'c', text: 'DWDM channels carried over multimode fiber from each server to its ToR switch' },
        { id: 'd', text: 'Long-haul amplified fiber links with inline EDFAs spanning the few meters inside the rack' },
        { id: 'e', text: 'OCS cross-connects steering every server link through dedicated MEMS mirrors in the cabinet' },
      ],
      explanation:
        'Within a rack (a few meters), passive Direct-Attach Copper (DAC, often with QSFP ends) is cheaper and lower-power than optics — which is why ToR designs use copper/DAC down to servers and reserve fiber for uplinks to the fabric.',
      reference: PHYS('Short-reach media — DAC'),
      tags: ['cabling', 'copper', 'physical-layer'],
    },
    {
      id: 'phys-circulator',
      prompt: 'What lets a single fiber strand carry light in both directions at once (as used in Jupiter Evolving)?',
      correct: { id: 'a', text: 'A passive optical circulator that routes light directionally, separating the two propagation directions on one fiber' },
      incorrect: [
        { id: 'b', text: 'A repeater that copies and retransmits each optical signal back toward its original source' },
        { id: 'c', text: 'A copper return path bonded directly alongside the fiber to provide the reverse direction' },
        { id: 'd', text: 'A second laser transmitting at exactly the same wavelength in the opposite direction' },
        { id: 'e', text: 'Spanning Tree Protocol running at the optical layer to prevent bidirectional fiber loops' },
      ],
      explanation:
        'An optical circulator is a passive multi-port device that routes light directionally, enabling bidirectional transmission over one fiber. Jupiter Evolving pairs circulators with WDM to raise capacity across the OCS plane and cut fiber count.',
      reference: JE('Optical layer — WDM & circulators'),
      tags: ['optical', 'circulator', 'physical-layer'],
    },
    {
      id: 'phys-why-fiber',
      prompt: 'Why are fabric uplinks (leaf-to-spine, or block-to-OCS) almost always fiber rather than copper?',
      correct: {
        id: 'a',
        text: 'Fiber spans the distances and high data rates building-wide with low loss, where copper’s reach is too short',
      },
      incorrect: [
        { id: 'b', text: 'Copper physically cannot carry Ethernet frames at all, so any link above the rack itself must always be optical' },
        { id: 'c', text: 'Fiber is always cheaper per port than copper is, which is the single main reason that fabrics standardize on it' },
        { id: 'd', text: 'Copper cabling is outright banned by the TIA-942 standard for use anywhere inside the data center' },
        { id: 'e', text: 'Fiber links require no transceivers at all, eliminating the optics cost that copper drops still incur' },
      ],
      explanation:
        'High-speed copper (DAC) only reaches a few meters; building-scale fabric links span tens to hundreds of meters at 40/100/400G, where only fiber maintains the signal — so fabric interconnect is fiber while in-rack drops can be copper.',
      reference: PHYS('Media selection — reach vs speed'),
      tags: ['cabling', 'fiber', 'physical-layer'],
    },
    {
      id: 'phys-linkbudget-ocs-tpm',
      prompt: 'When inserting an OCS layer into an existing optical fabric path during a Jupiter Evolving upgrade, what must a TPM ensure the cabling design and link-budget calculations account for to avoid service degradation?',
      correct: {
        id: 'a',
        text: 'Every connector, splice, and the OCS adds loss; end-to-end loss must keep margin in the transceiver’s budget',
      },
      incorrect: [
        { id: 'b', text: 'The OCS contributes optical gain, so link budgets automatically improve and no recalculation is needed at all' },
        { id: 'c', text: 'Only the fiber type (SMF versus MMF) matters; connector loss and OCS insertion loss can be ignored at 100G and above' },
        { id: 'd', text: 'Link budgets are only relevant for WAN and long-haul circuits and never apply inside an in-building fabric path' },
        { id: 'e', text: 'Adding the OCS reduces the total number of connectors in the path, so the overall optical loss always decreases' },
      ],
      explanation:
        'Classic RCDD link-budget math still applies. Each OCS port adds ~1-2 dB loss (plus patch cords). A TPM coordinating with cabling contractors and network engineers must verify that existing or new transceivers have enough budget headroom, or that new higher-power optics or shorter reaches are used — directly impacting hardware selection, cost, and whether the upgrade can proceed without replacing all optics.',
      reference: PHYS('Optical link budget & insertion loss'),
      tags: ['link-budget', 'ocs', 'physical-layer', 'tpm'],
    },
    {
      id: 'phys-tor-eor-tpm',
      prompt: 'For a large-scale new datacenter build supporting high-density AI and Workspace workloads, what cabling-topology decision should a TPM help drive between ToR and EoR/MoR designs, and why?',
      correct: {
        id: 'a',
        text: 'ToR is usually preferred: short in-rack copper/DAC is cheaper and easier to debug, with fiber uplinks consolidated onto MPO trunks',
      },
      incorrect: [
        { id: 'b', text: 'EoR is always superior because it reduces the total number of switches that must be managed and spares stocked' },
        { id: 'c', text: 'ToR forces all fiber to be single-mode and therefore dramatically increases transceiver cost across the building' },
        { id: 'd', text: 'EoR eliminates the need for any patch panels or structured cabling because switches sit at the end of each row' },
        { id: 'e', text: 'The choice has no impact on program timeline or contractor coordination because both use identical fiber counts' },
      ],
      explanation:
        'ToR localizes most cabling (cheap copper) and standardizes fiber uplinks into high-density MPO trunks that can be pre-terminated and installed quickly by structured-cabling contractors. EoR centralizes switching but creates long horizontal copper runs that are harder to manage, test, and scale. A TPM weighs management overhead, upfront cabling cost, power, and ease of future adds/moves/changes when deciding — and must align network, facilities, and construction teams on the chosen model early in the program.',
      reference: PHYS('Cabling topologies — ToR vs EoR/MoR'),
      tags: ['cabling', 'topology', 'tpm'],
    },
  ],
};
