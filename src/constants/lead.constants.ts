export const LEAD_STATUS = {
  NEW: 'New',
  CONTACTED: 'Contacted',
  QUALIFIED: 'Qualified',
  PROPOSAL: 'Proposal',
  NEGOTIATION: 'Negotiation',
  CLOSED_WON: 'Closed Won',
  CLOSED_LOST: 'Closed Lost',
} as const;

export type LeadStatusType = typeof LEAD_STATUS[keyof typeof LEAD_STATUS];

export const LEAD_SOURCE = {
  ORGANIC: 'Organic',
  SOCIAL_MEDIA: 'Social Media',
  WORD_OF_MOUTH: 'Word of Mouth',
  CONTACTS: 'Contacts',
} as const;

export type LeadSourceType = typeof LEAD_SOURCE[keyof typeof LEAD_SOURCE];
