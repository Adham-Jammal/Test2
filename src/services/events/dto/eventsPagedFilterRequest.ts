import { EventOccoursOptions, EventType } from '../../../lib/types';

export interface EventsPagedFilterRequest {
  maxResultCount?: number;
  skipCount?: number;
  status?: number;
  type?: EventType;
  keyword?: string;
  categoryId?: number;
  Sorting?: string;
  OnlyMyEvents?: boolean;
  organizerId?: string;
  expired?: boolean;
  running?: boolean;
  endAfterEvents?: Array<number>;
  repeat?: EventOccoursOptions;
  startDate?: string;
  endDate?: string;
  parentId?: number;
}
