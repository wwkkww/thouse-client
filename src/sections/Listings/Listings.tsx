import React, { useState, useEffect } from 'react';
import { server, useQuery } from '../../lib/api';
import { Listing, ListingData, DeleteListingData } from './types';

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
  // const [listings, setListings] = useState<Listing[] | null>(null);

  // useEffect(() => {
  //   console.log('effect has run');
  //   fetchListings();
  // }, []);

  // const fetchListings = async () => {
  //   const { data } = await server.fetch<ListingData>({ query: LISTINGS });
  //   console.log('fetch listings!', data);
  //   setListings(data.listings);
  // };
  const { data, loading, error, refetch } = useQuery<ListingData>(LISTINGS);

  const deleteListing = async (id: string) => {
    const response = await server.fetch<DeleteListingData>({
      query: DELETE_LISTING,
      variables: { id },
    });
    console.log('delete listing', response.data);
    refetch();
    // fetchListings();
  };

  const listings = data ? data.listings : null;

  const listingList = listings ? (
    <ul>
      {listings.map(listing => {
        return (
          <li key={listing.id}>
            {listing.title}
            <button onClick={() => deleteListing(listing.id)}>Delete a listing</button>
          </li>
        );
      })}
    </ul>
  ) : null;

  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (error) {
    return <h2>Ops. Something went wrong.</h2>;
  }
  return (
    <div>
      <h2>{title}</h2>
      {listingList}
      {/* <button onClick={fetchListings}>Query listing</button> */}
    </div>
  );
};

export { Listings };
