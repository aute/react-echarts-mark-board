import { configure,addParameters } from '@storybook/react';
import {theme} from './theme';

// automatically import all files ending in *.stories.js
const req = require.context('../stories', true, /\.stories\.js$/);
function loadStories() {
  req.keys().forEach(filename => req(filename));
}
addParameters({
  options: {
    theme
  },
});

configure(loadStories, module);
