export const routes = [
  {
    key: 'home',
    label: 'Home',
    icon: 'home',
    to: '/',
    exact: true
  },
  {
    key: 'candidates',
    label: 'Candidates',
    icon: 'person',
    to: '/candidates'
  },
  {
    key: 'openings',
    label: 'Openings',
    icon: 'send',
    to: '/openings'
  },
  {
    key: 'applications',
    label: 'Applications',
    icon: 'done_all',
    to: '/applications'
  }
  // If you need a divider or a subheader
  //   { key: 'divider', divider: true },
  //   { key: 'subheader', subheader: true, key: 'soselo', primaryText: 'Joselo' },
];
