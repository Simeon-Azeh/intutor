import React from "react";
import ContentLoader from "react-content-loader";

const UserCardLoader = (props) => (
  <ContentLoader
    viewBox="0 0 180 150"
    height={150}
    width={180}
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    {...props}
  >
    <rect x="10" y="10" rx="8" ry="8" width="160" height="120" />
    <rect x="10" y="140" rx="0" ry="0" width="160" height="10" />
  </ContentLoader>
);

const UserCardLoaders = () => (
  <div className="user-card-loaders">
    <UserCardLoader />
    <UserCardLoader />
    <UserCardLoader />
    <UserCardLoader />
  </div>
);

export default UserCardLoaders;