import type { SubjectGroup } from '../../../types/content';
import { fundamentals } from './fundamentals';
import { b4 } from './b4';
import { jupiterRising } from './jupiter-rising';
import { jupiterEvolving } from './jupiter-evolving';
import { physicalLayer } from './physical-layer';
import { abbreviations } from './abbreviations';

export const googleCloudNetworking: SubjectGroup = {
  id: 'google-cloud-networking',
  name: 'Google Cloud Networking (TPM III Prep)',
  description:
    'Study set for Google’s Technical Program Manager III, Workspace Delivery, Cloud Networking role — B4, Jupiter Rising, Jupiter Evolving, core datacenter networking terms, physical-layer refreshers, and essential abbreviations. Designed to build the technical depth and cross-functional vocabulary expected in TPM interviews and on-the-job program leadership.',
  subjects: [fundamentals, b4, jupiterRising, jupiterEvolving, physicalLayer, abbreviations],
};
