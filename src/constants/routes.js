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
    icon: 'star',
    to: '/candidates',
    routes: [
      {
        key: 'a',
        label: 'Candidates A',
        to: '/candidates/a'
      },
      {
        key: 'b',
        label: 'Candidates B',
        to: '/candidates/b'
      },
      {
        key: 'c',
        label: 'Candidates C',
        to: '/candidates/c'
      }
    ]
  },
  {
    key: 'openings',
    label: 'Openings',
    icon: 'send',
    to: '/openings',
    routes: [
      {
        key: 'a',
        label: 'Openings A',
        to: '/openings/a'
      },
      {
        key: 'b',
        label: 'Openings B',
        to: '/openings/b'
      },
      {
        key: 'c',
        label: 'Openings C',
        to: '/openings/c'
      }
    ]
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
