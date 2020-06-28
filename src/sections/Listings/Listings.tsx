import React from 'react';

interface Props {
  title: string;
}

const Listings = ({ title }: Props) => {
  return <h2>{title}</h2>;
};

export { Listings };
