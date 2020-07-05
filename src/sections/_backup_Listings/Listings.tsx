import React from 'react';
import { List, Avatar, Button, Spin, Alert } from 'antd';
// import { useQuery, useMutation } from '../../lib/api';
import { gql } from 'apollo-boost';
import { useQuery, useMutation } from 'react-apollo';
// import { Listing, ListingData, DeleteListingData, DeleteListingVariables } from './types';
import { Listings as ListingData } from './__generated__/Listings';
import {
  DeleteListing as DeleteListingData,
  DeleteListingVariables,
} from './__generated__/DeleteListing';
import './styles/Listings.css';
import { ListingsSkeleton } from './components';

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
  mutation DeleteListing($id: ID!) {
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
    <List
      itemLayout="horizontal"
      dataSource={listings}
      renderItem={listing => (
        <List.Item
          actions={[
            <Button type="primary" onClick={() => handleDeleteListing(listing.id)}>
              Delete
            </Button>,
          ]}
        >
          <List.Item.Meta
            title={listing.title}
            description={listing.address}
            avatar={<Avatar src={listing.image} shape="square" size={48} />}
          />
        </List.Item>
      )}
    />
  ) : null;

  // const listingList = listings ? (
  //   <ul>
  //     {listings.map(listing => {
  //       return (
  //         <li key={listing.id}>
  //           {listing.title}
  //           <button onClick={() => handleDeleteListing(listing.id)}>Delete a listing</button>
  //         </li>
  //       );
  //     })}
  //   </ul>
  // ) : null;

  if (loading) {
    return (
      <div className="listings">
        <ListingsSkeleton title={title} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="listings">
        <ListingsSkeleton title={title} error />
      </div>
    );
  }

  // const deleteListingLoadingMesage = deleteListingLoading ? <h4>Deleting...</h4> : null;
  // const deleteListingErrorMessage = deleteListingError ? (
  //   <h4>Failed to delete listing. Plase try again.</h4>
  // ) : null;

  const deleteListingErrorAlert = deleteListingError ? (
    <Alert
      message="Something went wrong. Please try again"
      type="error"
      className="listings__alert"
    />
  ) : null;

  return (
    <div className="listings">
      <Spin spinning={deleteListingLoading}>
        {deleteListingErrorAlert}
        <h2>{title}</h2>
        {listingList}
        {/* {deleteListingLoadingMesage} */}
        {/* {deleteListingErrorMessage} */}
        {/* <button onClick={fetchListings}>Query listing</button> */}
      </Spin>
    </div>
  );
};

export { Listings };
