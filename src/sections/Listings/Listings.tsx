import React from 'react';
import { server } from '../../lib/api';
import { ListingData } from './types';

const LISTINGS = `
  query Listings{
    listings {
      id
      title
      image
      address
      price
      numOfGuests
      numOfBeds
      numOfBaths
      rating
    }
  }
`;

interface Props {
  title: string;
}

const Listings = ({ title }: Props) => {
  const fetchListings = async () => {
    const response = await server.fetch<ListingData>({ query: LISTINGS });
    console.log('fetch listings!', response.data);
  };

  return (
    <div>
      <h2>{title}</h2>
      <button onClick={fetchListings}>Query listing</button>
    </div>
  );
};

export { Listings };
