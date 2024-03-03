import React from 'react';

import LazyLoad from 'react-lazyload';

export default function LazyLoadingImages(props) {
  const {
    src = '',
    className = {},
    alt = 'Landing Page Images',
    isGif = false,
    gifContainer,
  } = props;
  return (
    <LazyLoad once offset={100} className={isGif ? gifContainer : ''}>
      <img className={className} src={src} alt={alt} />
    </LazyLoad>
  );
}
