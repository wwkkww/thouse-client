import React, { useState, useEffect } from 'react';
// import { useQuery, useMutation } from '../../lib/api';
import { gql } from 'apollo-boost';
import { useQuery, useMutation } from 'react-apollo';
import { Listing, ListingData, DeleteListingData, DeleteListingVariables } from './types';

const LISTINGS = gql`
  query Listings {
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

const DELETE_LISTING = gql`
  mutation DeleteLisitng($id: ID!) {
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
  const [deleteListing, { loading: deleteListingLoading, error: deleteListingError }] = useMutation<
    DeleteListingData,
    DeleteListingVariables
  >(DELETE_LISTING);

  const handleDeleteListing = async (id: string) => {
    // const response = await server.fetch<DeleteListingData>({
    //   query: DELETE_LISTING,
    //   variables: { id },
    // });
    // await deleteListing({ id });
    await deleteListing({ variables: { id } });

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
            <button onClick={() => handleDeleteListing(listing.id)}>Delete a listing</button>
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

  const deleteListingLoadingMesage = deleteListingLoading ? <h4>Deleting...</h4> : null;
  const deleteListingErrorMessage = deleteListingError ? (
    <h4>Failed to delete listing. Plase try again.</h4>
  ) : null;

  return (
    <div>
      <h2>{title}</h2>
      {listingList}
      {deleteListingLoadingMesage}
      {deleteListingErrorMessage}
      {/* <button onClick={fetchListings}>Query listing</button> */}
    </div>
  );
};

export { Listings };
