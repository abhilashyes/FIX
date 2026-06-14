import type {
  CategoryId,
  Issue,
  IssueId,
  LocalityId,
  PlaceId,
  StatusChange,
  UserId,
} from '@/types';
import { ISSUE_STATUS_ORDER, IssueStatus, Severity, asId } from '@/types';
import { CATEGORY_IDS } from '@/config/categories';
import { METRO_LOCALITY_IDS, METRO_PLACE_ID } from '@/config/places/metro';
import { TOWN_LOCALITY_IDS, TOWN_PLACE_ID } from '@/config/places/town';
import { VILLAGE_LOCALITY_IDS, VILLAGE_PLACE_ID } from '@/config/places/village';
import { getPlace } from '@/config/places';
import { daysAgoISO } from '@/lib/ids';
import { categoryThumb } from '@/lib/placeholderImages';
import { USER_IDS } from './users';

interface IssueSpec {
  n: number;
  place: PlaceId;
  category: CategoryId;
  locality: LocalityId;
  title: string;
  description: string;
  severity: Severity;
  status: IssueStatus;
  ageDays: number;
  upvotes: number;
  population: number;
  reporter: UserId;
  countermeasure?: string;
}

const idFor = (place: string, n: number): IssueId =>
  asId<IssueId>(`issue-${place}-${String(n).padStart(2, '0')}`);

/** Build a plausible status history walking the lifecycle up to the current status. */
function buildHistory(status: IssueStatus, ageDays: number, reporter: UserId): StatusChange[] {
  const idx = ISSUE_STATUS_ORDER.indexOf(status);
  const steps = ISSUE_STATUS_ORDER.slice(0, idx + 1);
  const span = Math.max(1, ageDays);
  return steps.map((to, i) => ({
    from: i === 0 ? null : ISSUE_STATUS_ORDER[i - 1] ?? null,
    to,
    at: daysAgoISO(Math.round(ageDays - (span * i) / Math.max(1, steps.length - 1 || 1))),
    byUserId: i === 0 ? reporter : USER_IDS.suresh,
  }));
}

function localityCenter(place: PlaceId, locality: LocalityId): { lat: number; lng: number } {
  const cfg = getPlace(place);
  const loc = cfg?.localities.find((l) => l.id === locality);
  const base = loc?.center ?? cfg?.mapCenter ?? { lat: 12.97, lng: 77.59 };
  // Small deterministic jitter so pins don't stack exactly.
  const j = (locality.length % 7) * 0.0006;
  return { lat: base.lat + j, lng: base.lng - j };
}

function mkIssue(spec: IssueSpec): Issue {
  const id = idFor(spec.place === METRO_PLACE_ID ? 'metro' : spec.place === TOWN_PLACE_ID ? 'town' : 'village', spec.n);
  const history = buildHistory(spec.status, spec.ageDays, spec.reporter);
  return {
    id,
    placeId: spec.place,
    categoryId: spec.category,
    title: spec.title,
    description: spec.description,
    severity: spec.severity,
    status: spec.status,
    location: localityCenter(spec.place, spec.locality),
    localityId: spec.locality,
    beforePhoto: { url: categoryThumb(id), caption: 'Current situation (sample)' },
    proposedCountermeasure: spec.countermeasure,
    reporterId: spec.reporter,
    affectedUserIds: [spec.reporter],
    upvoteCount: spec.upvotes,
    affectedPopulationEstimate: spec.population,
    createdAt: daysAgoISO(spec.ageDays),
    updatedAt: history[history.length - 1]?.at ?? daysAgoISO(spec.ageDays),
    statusHistory: history,
  };
}

const C = CATEGORY_IDS;
const ML = METRO_LOCALITY_IDS;
const U = USER_IDS;

// ── Metro: 25 issues across 7 wards, mixed categories + statuses ──
const metroSpecs: IssueSpec[] = [
  { n: 1, place: METRO_PLACE_ID, category: C.roads, locality: ML.jalnagar, title: 'Deep potholes on Jalnagar Main Road', description: 'A 200m stretch near the bus stop has several deep potholes; two-wheelers swerve dangerously, especially after rain.', severity: Severity.High, status: IssueStatus.Prioritized, ageDays: 34, upvotes: 86, population: 12000, reporter: U.asha, countermeasure: 'Full resurfacing of the stretch with proper drainage camber' },
  { n: 2, place: METRO_PLACE_ID, category: C.streetlights, locality: ML.sundarpet, title: 'Dark stretch on Sundarpet 4th Cross', description: 'Six streetlights have been out for weeks; the lane is pitch dark and feels unsafe at night.', severity: Severity.High, status: IssueStatus.Verified, ageDays: 21, upvotes: 64, population: 5400, reporter: U.ravi, countermeasure: 'Replace fixtures with LED lamps' },
  { n: 3, place: METRO_PLACE_ID, category: C.parks, locality: ML.greenfield, title: 'Garbage-strewn corner could be a pocket park', description: 'The vacant corner plot has become a dumping spot. Residents want it cleared and turned into a small green space.', severity: Severity.Medium, status: IssueStatus.Prioritized, ageDays: 48, upvotes: 102, population: 8000, reporter: U.meera, countermeasure: 'Community clean-up + planting drive to create a pocket park' },
  { n: 4, place: METRO_PLACE_ID, category: C.water, locality: ML.kempapura, title: 'Recurring drain overflow at Kempapura junction', description: 'The storm drain overflows onto the road every monsoon, flooding shopfronts.', severity: Severity.Critical, status: IssueStatus.InProgress, ageDays: 60, upvotes: 140, population: 15000, reporter: U.imran, countermeasure: 'Desilt and widen the drain; add a grating' },
  { n: 5, place: METRO_PLACE_ID, category: C.safety, locality: ML.mahadevi, title: 'No pedestrian crossing near Mahadevi school', description: 'Children cross a busy road with no marked crossing or signage. A speed table is needed.', severity: Severity.High, status: IssueStatus.InProgress, ageDays: 40, upvotes: 95, population: 6000, reporter: U.divya, countermeasure: 'Install a raised crossing + school-zone signage' },
  { n: 6, place: METRO_PLACE_ID, category: C.waste, locality: ML.oldtown, title: 'Missed garbage collection in Old Town lanes', description: 'Collection has been irregular for a month; waste piles up at the lane mouths.', severity: Severity.Medium, status: IssueStatus.Reported, ageDays: 8, upvotes: 38, population: 9000, reporter: U.imran },
  { n: 7, place: METRO_PLACE_ID, category: C.footpaths, locality: ML.rishivalley, title: 'Broken footpath slabs on Rishi Valley Road', description: 'Loose and missing slabs make walking hazardous for the elderly.', severity: Severity.Medium, status: IssueStatus.Prioritized, ageDays: 27, upvotes: 57, population: 4200, reporter: U.lakshmi, countermeasure: 'Re-lay slabs and level the footpath' },
  { n: 8, place: METRO_PLACE_ID, category: C.traffic, locality: ML.jalnagar, title: 'Signal timing causes long jams at Jalnagar circle', description: 'Peak-hour signal cycle is too short for the side road, backing traffic up for blocks.', severity: Severity.Medium, status: IssueStatus.Verified, ageDays: 15, upvotes: 49, population: 11000, reporter: U.asha },
  { n: 9, place: METRO_PLACE_ID, category: C.roads, locality: ML.sundarpet, title: 'Sunken patch after pipeline repair', description: 'A utility cut was filled poorly and has sunk, creating a jarring dip.', severity: Severity.Medium, status: IssueStatus.Resolved, ageDays: 75, upvotes: 41, population: 3000, reporter: U.ravi, countermeasure: 'Proper compaction and asphalt overlay' },
  { n: 10, place: METRO_PLACE_ID, category: C.streetlights, locality: ML.greenfield, title: 'Flickering lights near Greenfield park gate', description: 'Lights flicker and trip; likely faulty wiring.', severity: Severity.Low, status: IssueStatus.Reported, ageDays: 5, upvotes: 22, population: 2500, reporter: U.lakshmi },
  { n: 11, place: METRO_PLACE_ID, category: C.water, locality: ML.mahadevi, title: 'Low water pressure in Mahadevi Nagar', description: 'Upper-floor homes get almost no supply in mornings.', severity: Severity.High, status: IssueStatus.InProgress, ageDays: 52, upvotes: 73, population: 7000, reporter: U.divya, countermeasure: 'Audit the feeder line and boost pumping schedule' },
  { n: 12, place: METRO_PLACE_ID, category: C.safety, locality: ML.kempapura, title: 'Unsafe open transformer near footpath', description: 'An open electrical box sits at child height beside a busy footpath.', severity: Severity.Critical, status: IssueStatus.Verified, ageDays: 12, upvotes: 88, population: 6500, reporter: U.imran },
  { n: 13, place: METRO_PLACE_ID, category: C.parks, locality: ML.rishivalley, title: 'Dead trees need replacing on Rishi Valley Avenue', description: 'Several avenue trees have died; stumps remain.', severity: Severity.Low, status: IssueStatus.Reported, ageDays: 18, upvotes: 19, population: 3000, reporter: U.lakshmi },
  { n: 14, place: METRO_PLACE_ID, category: C.waste, locality: ML.sundarpet, title: 'Overflowing community bin at Sundarpet market', description: 'The single bin overflows daily; needs a larger one and twice-daily pickup.', severity: Severity.Medium, status: IssueStatus.Verified, ageDays: 14, upvotes: 44, population: 8000, reporter: U.ravi },
  { n: 15, place: METRO_PLACE_ID, category: C.roads, locality: ML.oldtown, title: 'Crumbling road edge on Old Town bridge approach', description: 'The road shoulder is breaking off at the bridge approach.', severity: Severity.High, status: IssueStatus.Prioritized, ageDays: 30, upvotes: 61, population: 10000, reporter: U.imran },
  { n: 16, place: METRO_PLACE_ID, category: C.parks, locality: ML.greenfield, title: 'Neglected playground equipment at Greenfield', description: 'Swings are broken and the sandpit is overgrown.', severity: Severity.Low, status: IssueStatus.Resolved, ageDays: 90, upvotes: 35, population: 4000, reporter: U.meera, countermeasure: 'Repair equipment and re-turf the play area' },
  { n: 17, place: METRO_PLACE_ID, category: C.traffic, locality: ML.mahadevi, title: 'Faded zebra crossing at Mahadevi junction', description: 'The crossing markings are nearly invisible.', severity: Severity.Medium, status: IssueStatus.Reported, ageDays: 6, upvotes: 27, population: 9000, reporter: U.divya },
  { n: 18, place: METRO_PLACE_ID, category: C.streetlights, locality: ML.kempapura, title: 'No lighting on new Kempapura link road', description: 'The newly opened link road has poles but no working lamps.', severity: Severity.Medium, status: IssueStatus.Prioritized, ageDays: 25, upvotes: 53, population: 5000, reporter: U.imran },
  { n: 19, place: METRO_PLACE_ID, category: C.footpaths, locality: ML.jalnagar, title: 'Footpath encroached by parked vehicles', description: 'Pedestrians forced onto the road as cars park on the footpath.', severity: Severity.Low, status: IssueStatus.Reported, ageDays: 9, upvotes: 31, population: 6000, reporter: U.asha },
  { n: 20, place: METRO_PLACE_ID, category: C.water, locality: ML.oldtown, title: 'Leaking water main wasting supply', description: 'A main has been leaking for days, with water pooling on the road.', severity: Severity.High, status: IssueStatus.Verified, ageDays: 11, upvotes: 58, population: 7500, reporter: U.imran },
  { n: 21, place: METRO_PLACE_ID, category: C.roads, locality: ML.mahadevi, title: 'Potholes around Mahadevi bus terminus', description: 'The terminus forecourt is pitted, jolting buses and autos.', severity: Severity.Medium, status: IssueStatus.Reported, ageDays: 7, upvotes: 33, population: 8500, reporter: U.divya },
  { n: 22, place: METRO_PLACE_ID, category: C.safety, locality: ML.greenfield, title: 'Missing manhole cover on Greenfield 2nd Main', description: 'An open manhole is a serious hazard, especially at night.', severity: Severity.Critical, status: IssueStatus.InProgress, ageDays: 16, upvotes: 110, population: 5000, reporter: U.meera, countermeasure: 'Install a new cover immediately and barricade meanwhile' },
  { n: 23, place: METRO_PLACE_ID, category: C.waste, locality: ML.rishivalley, title: 'Construction debris dumped on roadside', description: 'A builder has dumped debris narrowing the road.', severity: Severity.Low, status: IssueStatus.Reported, ageDays: 4, upvotes: 17, population: 3000, reporter: U.lakshmi },
  { n: 24, place: METRO_PLACE_ID, category: C.traffic, locality: ML.sundarpet, title: 'Need a speed breaker near Sundarpet clinic', description: 'Vehicles speed past a busy clinic entrance.', severity: Severity.Medium, status: IssueStatus.Verified, ageDays: 19, upvotes: 46, population: 6000, reporter: U.ravi, countermeasure: 'Install a speed breaker with markings' },
  { n: 25, place: METRO_PLACE_ID, category: C.parks, locality: ML.kempapura, title: 'Park boundary fence damaged at Kempapura', description: 'The fence is broken, letting stray cattle into the park.', severity: Severity.Low, status: IssueStatus.Closed, ageDays: 120, upvotes: 24, population: 3500, reporter: U.imran, countermeasure: 'Repair fencing and add a gate' },
];

const TL = TOWN_LOCALITY_IDS;
const townSpecs: IssueSpec[] = [
  { n: 1, place: TOWN_PLACE_ID, category: C.roads, locality: TL.market, title: 'Potholes on Devarahalli market street', description: 'The market street is badly pitted, hurting vendors and shoppers.', severity: Severity.High, status: IssueStatus.Prioritized, ageDays: 26, upvotes: 41, population: 5000, reporter: U.town1, countermeasure: 'Patch and resurface the market street' },
  { n: 2, place: TOWN_PLACE_ID, category: C.water, locality: TL.station, title: 'Irregular water supply near the station', description: 'Supply comes only on alternate days.', severity: Severity.High, status: IssueStatus.Verified, ageDays: 18, upvotes: 33, population: 4000, reporter: U.town2 },
  { n: 3, place: TOWN_PLACE_ID, category: C.streetlights, locality: TL.temple, title: 'Temple street lights not working', description: 'The approach to the temple is dark during evening aarti.', severity: Severity.Medium, status: IssueStatus.Reported, ageDays: 7, upvotes: 22, population: 3000, reporter: U.town1 },
  { n: 4, place: TOWN_PLACE_ID, category: C.waste, locality: TL.newcolony, title: 'No bin in New Colony', description: 'Residents have nowhere to dispose of waste and it ends up on empty plots.', severity: Severity.Medium, status: IssueStatus.Verified, ageDays: 13, upvotes: 19, population: 2500, reporter: U.town2 },
  { n: 5, place: TOWN_PLACE_ID, category: C.safety, locality: TL.riverside, title: 'No railing on Riverside path', description: 'The path along the river has no railing; risky for children.', severity: Severity.High, status: IssueStatus.Reported, ageDays: 10, upvotes: 28, population: 1800, reporter: U.town1, countermeasure: 'Install a safety railing along the riverside path' },
  { n: 6, place: TOWN_PLACE_ID, category: C.footpaths, locality: TL.market, title: 'Footpath missing near bus stand', description: 'Pedestrians walk on the road by the bus stand.', severity: Severity.Low, status: IssueStatus.Reported, ageDays: 5, upvotes: 14, population: 3500, reporter: U.town2 },
  { n: 7, place: TOWN_PLACE_ID, category: C.roads, locality: TL.station, title: 'Resolved: station road shoulder repaired', description: 'The eroded shoulder near the station was rebuilt by the council.', severity: Severity.Medium, status: IssueStatus.Resolved, ageDays: 70, upvotes: 30, population: 4000, reporter: U.town1, countermeasure: 'Rebuild and compact the road shoulder' },
];

const VL = VILLAGE_LOCALITY_IDS;
const villageSpecs: IssueSpec[] = [
  { n: 1, place: VILLAGE_PLACE_ID, category: C.water, locality: VL.tankarea, title: 'Village tank inlet silted up', description: 'The tank that feeds the wells has silted; water levels are dropping.', severity: Severity.High, status: IssueStatus.Prioritized, ageDays: 30, upvotes: 26, population: 950, reporter: U.village1, countermeasure: 'Desilt the tank inlet before the rains' },
  { n: 2, place: VILLAGE_PLACE_ID, category: C.roads, locality: VL.mainvillage, title: 'Mud road to main village impassable in rain', description: 'The approach road turns to slush, cutting off the hamlet.', severity: Severity.High, status: IssueStatus.Verified, ageDays: 22, upvotes: 21, population: 1800, reporter: U.village1, countermeasure: 'Gravel and grade the approach road' },
  { n: 3, place: VILLAGE_PLACE_ID, category: C.streetlights, locality: VL.hillside, title: 'No street lighting in Hillside hamlet', description: 'The hamlet has no lighting at all after dusk.', severity: Severity.Medium, status: IssueStatus.Reported, ageDays: 9, upvotes: 12, population: 620, reporter: U.village2, countermeasure: 'Install solar street lights' },
  { n: 4, place: VILLAGE_PLACE_ID, category: C.waste, locality: VL.mainvillage, title: 'No waste disposal point in the village', description: 'Waste is burned in the open; a collection point is needed.', severity: Severity.Low, status: IssueStatus.Reported, ageDays: 6, upvotes: 9, population: 1800, reporter: U.village2 },
  { n: 5, place: VILLAGE_PLACE_ID, category: C.parks, locality: VL.fields, title: 'Community ground needs levelling', description: 'The shared ground used for events and play is uneven and waterlogged.', severity: Severity.Low, status: IssueStatus.Verified, ageDays: 15, upvotes: 11, population: 540, reporter: U.village1 },
  { n: 6, place: VILLAGE_PLACE_ID, category: C.water, locality: VL.mainvillage, title: 'Resolved: hand pump repaired in Main Village', description: 'The broken hand pump serving the main village was repaired.', severity: Severity.Medium, status: IssueStatus.Resolved, ageDays: 55, upvotes: 18, population: 1800, reporter: U.village1, countermeasure: 'Repair the hand pump mechanism' },
];

export const allIssueSpecs = [...metroSpecs, ...townSpecs, ...villageSpecs];
export const issues: Issue[] = allIssueSpecs.map(mkIssue);

/** Stable id lookups for feature-attachment fixtures (discussions, mobilization, etc.). */
export const ISSUE_IDS = {
  metroPotholes: idFor('metro', 1),
  metroPocketPark: idFor('metro', 3),
  metroDrain: idFor('metro', 4),
  metroSchoolCrossing: idFor('metro', 5),
  metroFootpath: idFor('metro', 7),
  metroResurfaced: idFor('metro', 9),
  metroWaterPressure: idFor('metro', 11),
  metroPlayground: idFor('metro', 16),
  metroManhole: idFor('metro', 22),
  townMarketRoad: idFor('town', 1),
  villageTank: idFor('village', 1),
} as const;
