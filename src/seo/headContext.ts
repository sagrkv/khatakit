import { createContext } from 'react';

/**
 * True while prerendering. The prerender writes the head tags into the HTML
 * template itself, so the app render leaves them out of the body markup.
 */
export const HeadWrittenByServer = createContext(false);
