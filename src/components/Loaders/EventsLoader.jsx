import React from 'react';
import ContentLoader from 'react-content-loader';

const EventLoader = props => (
  <ContentLoader
    width={300}
    height={80}
    viewBox="0 0 300 80"
    backgroundColor="#f5f5f5"
    foregroundColor="#dbdbdb"
    {...props}
  >
    <rect x="10" y="10" rx="5" ry="5" width="280" height="15" />
    <rect x="10" y="35" rx="5" ry="5" width="250" height="10" />
    <rect x="10" y="55" rx="5" ry="5" width="200" height="10" />
  </ContentLoader>
);

const EventsLoader = () => (
  <div className="space-y-4">
    <EventLoader />
    <EventLoader />
    <EventLoader />
  </div>
);

export default EventsLoader;