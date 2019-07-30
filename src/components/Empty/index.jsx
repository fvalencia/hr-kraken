import React from 'react';
import './styles.scss';

const Empty = ({ width = 100, height = 100, children }) => {
  return (
    <div className="empty-box">
      <svg width={width} height={height} viewBox="0 0 64 64" version="1.1">
        <g id="surface277647">
          <path
            style={{ stroke: 'none', fillRule: 'nonzero', fill: 'rgb(100%,100%,100%)', fillOpacity: 1 }}
            d="M 56 23.5 L 32 15 L 8 23.5 L 8 53.5 L 32 62 L 56 53.5 Z M 56 23.5 "
          />
          <path
            style={{ stroke: 'none', fillRule: 'nonzero', fill: 'rgb(100%,100%,100%)', fillOpacity: 1 }}
            d="M 56 23.5 L 32 15 L 8 23.5 L 8 53.5 L 32 62 L 56 53.5 Z M 56 23.5 "
          />
          <path
            style={{ stroke: 'none', fillRule: 'nonzero', fill: 'rgb(100%,100%,100%)', fillOpacity: 1 }}
            d="M 8 23.5 L 2 33.5 L 26 42 L 32 32 Z M 56 23.5 L 32 15 "
          />
          <path
            style={{ stroke: 'none', fillRule: 'nonzero', fill: '#3f51b5', fillOpacity: 1 }}
            d="M 32 33.5 C 31.398438 33.5 30.800781 33.101562 30.601562 32.5 C 30.300781 31.699219 30.75 30.851562 31.5 30.601562 L 55.5 22.101562 C 56.300781 21.800781 57.148438 22.25 57.398438 23 C 57.699219 23.800781 57.25 24.648438 56.5 24.898438 L 32.5 33.398438 C 32.351562 33.449219 32.148438 33.5 32 33.5 Z M 32 33.5 "
          />
          <path
            style={{ stroke: 'none', fillRule: 'nonzero', fill: '#3f51b5', fillOpacity: 1 }}
            d="M 32 63.5 C 31.699219 63.5 31.398438 63.398438 31.148438 63.25 C 30.75 62.949219 30.5 62.5 30.5 62 L 30.5 47.851562 C 30.5 47 31.148438 46.351562 32 46.351562 C 32.851562 46.351562 33.5 47 33.5 47.851562 L 33.5 59.898438 L 54.5 52.449219 L 54.5 23.5 C 54.5 22.648438 55.148438 22 56 22 C 56.851562 22 57.5 22.648438 57.5 23.5 L 57.5 53.5 C 57.5 54.148438 57.101562 54.699219 56.5 54.898438 L 32.5 63.398438 C 32.351562 63.449219 32.148438 63.5 32 63.5 Z M 32 63.5 "
          />
          <path
            style={{ stroke: 'none', fillRule: 'nonzero', fill: 'rgb(100%,100%,100%)', fillOpacity: 1 }}
            d="M 56 23.5 L 32 15 M 56 23.5 L 32 15 M 32 32 L 8 23.5 "
          />
          <path
            style={{ stroke: 'none', fillRule: 'nonzero', fill: '#3f51b5', fillOpacity: 1 }}
            d="M 6.5 53.5 C 6.5 54.148438 6.898438 54.699219 7.5 54.898438 L 31.5 63.398438 C 31.648438 63.449219 31.851562 63.5 32 63.5 C 32.601562 63.5 33.199219 63.101562 33.398438 62.5 C 33.699219 61.699219 33.25 60.851562 32.5 60.601562 L 9.5 52.449219 L 9.5 36.148438 L 6.5 35.101562 Z M 6.5 53.5 "
          />
          <path
            style={{ stroke: 'none', fillRule: 'nonzero', fill: 'rgb(100%,100%,100%)', fillOpacity: 1 }}
            d="M 62 33.5 L 38 42 L 32 32 L 56 23.5 Z M 62 33.5 "
          />
          <path
            style={{ stroke: 'none', fillRule: 'nonzero', fill: '#3f51b5', fillOpacity: 1 }}
            d="M 63.300781 32.75 L 57.300781 22.75 C 57.300781 22.75 57.25 22.699219 57.25 22.699219 C 57.25 22.648438 57.199219 22.648438 57.199219 22.601562 C 57.148438 22.550781 57.148438 22.5 57.101562 22.5 C 57.050781 22.449219 57.050781 22.449219 57 22.398438 C 56.949219 22.351562 56.898438 22.351562 56.851562 22.300781 C 56.800781 22.300781 56.800781 22.25 56.75 22.25 C 56.648438 22.199219 56.601562 22.148438 56.5 22.148438 L 32.5 13.648438 C 32.398438 13.601562 32.300781 13.601562 32.199219 13.601562 C 32.199219 13.601562 32.148438 13.601562 32.148438 13.601562 C 32.050781 13.601562 32 13.601562 31.898438 13.601562 C 31.851562 13.601562 31.851562 13.601562 31.800781 13.601562 C 31.699219 13.601562 31.601562 13.648438 31.5 13.648438 L 7.5 22.148438 C 7.5 22.148438 7.449219 22.148438 7.449219 22.199219 C 7.398438 22.25 7.300781 22.25 7.25 22.300781 C 7.148438 22.351562 7.050781 22.449219 6.949219 22.550781 C 6.949219 22.550781 6.898438 22.601562 6.898438 22.601562 C 6.851562 22.648438 6.851562 22.699219 6.800781 22.699219 C 6.800781 22.699219 6.800781 22.699219 6.75 22.75 L 0.75 32.75 C 0.5 33.101562 0.449219 33.601562 0.601562 34 C 0.75 34.398438 1.101562 34.75 1.5 34.898438 L 25.5 43.398438 C 25.648438 43.449219 25.851562 43.5 26 43.5 C 26.5 43.5 27 43.25 27.300781 42.75 L 32 34.898438 L 36.699219 42.75 C 37 43.25 37.5 43.5 38 43.5 C 38.148438 43.5 38.351562 43.449219 38.5 43.398438 L 62.5 34.898438 C 62.898438 34.75 63.25 34.398438 63.398438 34 C 63.550781 33.601562 63.5 33.101562 63.300781 32.75 Z M 33.5 17.101562 L 51.5 23.5 L 33.5 29.898438 Z M 25.351562 40.199219 L 4.25 32.699219 L 8.699219 25.300781 L 29.800781 32.800781 Z M 38.648438 40.199219 L 34.199219 32.800781 L 55.300781 25.300781 L 59.75 32.699219 Z M 38.648438 40.199219 "
          />
        </g>
      </svg>
      <h5 className="hrk-fontSecondary">{children}</h5>
    </div>
  );
};

export default Empty;