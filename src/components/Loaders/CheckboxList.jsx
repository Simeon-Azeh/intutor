import React from 'react';
import ContentLoader from 'react-content-loader';

const CheckboxList = props => (
  <ContentLoader
    speed={2}
    width="100%"
    height={400}
    viewBox="0 0 250 400"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    {...props}
  >
    {/* Title */}
    <rect x="15" y="15" rx="5" ry="5" width="60%" height="15" />
    
    {/* Menu Items */}
    <rect x="15" y="50" rx="5" ry="5" width="10%" height="20" />
    <rect x="45" y="50" rx="5" ry="5" width="70%" height="20" />
    
    <rect x="15" y="90" rx="5" ry="5" width="10%" height="20" />
    <rect x="45" y="90" rx="5" ry="5" width="70%" height="20" />
    
    <rect x="15" y="130" rx="5" ry="5" width="10%" height="20" />
    <rect x="45" y="130" rx="5" ry="5" width="70%" height="20" />
    
    <rect x="15" y="170" rx="5" ry="5" width="10%" height="20" />
    <rect x="45" y="170" rx="5" ry="5" width="70%" height="20" />
    
    <rect x="15" y="210" rx="5" ry="5" width="10%" height="20" />
    <rect x="45" y="210" rx="5" ry="5" width="70%" height="20" />
    
    <rect x="15" y="250" rx="5" ry="5" width="10%" height="20" />
    <rect x="45" y="250" rx="5" ry="5" width="70%" height="20" />
    
    <rect x="15" y="290" rx="5" ry="5" width="10%" height="20" />
    <rect x="45" y="290" rx="5" ry="5" width="70%" height="20" />
    
    <rect x="15" y="330" rx="5" ry="5" width="10%" height="20" />
    <rect x="45" y="330" rx="5" ry="5" width="70%" height="20" />
    
    <rect x="15" y="370" rx="5" ry="5" width="10%" height="20" />
    <rect x="45" y="370" rx="5" ry="5" width="70%" height="20" />
  </ContentLoader>
);

CheckboxList.metadata = {
  name: 'Manuela Garcia',
  github: 'ManuelaGar',
  description: 'This is a checkbox list loader.',
  filename: 'CheckboxList',
};

export default CheckboxList;