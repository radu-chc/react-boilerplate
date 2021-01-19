/*
 * HomePage Messages
 *
 * This contains all the text for the HomePage container.
 */
import { defineMessages } from 'react-intl';

export const scope = 'app.containers.HomePage';

export default defineMessages({
  header: {
    id: `${scope}.header`,
    defaultMessage: 'Such Network. Much Visualization. Wow.',
  },
  instruction1: {
    id: `${scope}.instruction1`,
    defaultMessage: 'Scroll Up and Down within the graph area in order to Zoom In and Out.',
  },
  instruction2: {
    id: `${scope}.instruction2`,
    defaultMessage: 'Hold and Drag in order to move from side to side.',
  },
  instruction3: {
    id: `${scope}.instruction3`,
    defaultMessage: '! Visualizing Depth 2 and 3 layers can be slow depending on the source node.',
  },
  instruction4: {
    id: `${scope}.instruction4`,
    defaultMessage: '! react-d3-graph has a bug whereby it may fail to refresh properly :/',
  },
});
