import React from 'react';
import { server } from '../../lib/api';
import { ListingData, DeleteListingData, DeleteListingVariables } from './types';

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

const DELETE_LISTING = `
  mutation DeleteLisitng($id: ID!){
    deleteListing(id: $id) {
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

  const deleteListing = async () => {
    const response = await server.fetch<DeleteListingData>({
      query: DELETE_LISTING,
      variables: { id: '5ef7fbd3291a27123b4df291' },
    });
    console.log('delete listing', response.data);
  };

  return (
    <div>
      <h2>{title}</h2>
      <button onClick={fetchListings}>Query listing</button>
      <button onClick={deleteListing}>Delete a listing</button>
    </div>
  );
};

export { Listings };
