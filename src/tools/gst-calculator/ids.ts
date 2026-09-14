import type { LineField } from './schema';

/** DOM id of a field on a bill line, used for labels and for moving focus. */
export const lineFieldId = (id: number, field: LineField | 'description' | 'rate') =>
  `gst-line-${id}-${field}`;
