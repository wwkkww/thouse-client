import { useState, useReducer } from 'react';
import { server } from './server';

interface State<TData> {
  data: TData | null;
  loading: Boolean;
  error: boolean;
}

type MutationTuple<TData, TVariables> = [
  (variables?: TVariables | undefined) => Promise<void>,
  State<TData>
];

type Action<TData> =
  | { type: 'FETCH' }
  | { type: 'FETCH_SUCCESS'; payload: TData }
  | { type: 'FETCH_ERROR' };

const reducer = <TData>() => (state: State<TData>, action: Action<TData>): State<TData> => {
  switch (action.type) {
    case 'FETCH':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { data: action.payload, loading: false, error: false };
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: true };
    default:
      throw new Error();
  }
};

export const useMutation = <TData = any, TVariables = any>(
  query: string
): MutationTuple<TData, TVariables> => {
  const fetchReducer = reducer<TData>();
  const [state, dispatch] = useReducer(fetchReducer, {
    data: null,
    loading: false,
    error: false,
  });
  // const [state, setState] = useState<State<TData>>({
  //   data: null,
  //   loading: false,
  //   error: false,
  // });

  const fetch = async (variables?: TVariables) => {
    try {
      // setState({ data: null, loading: true, error: false });
      dispatch({ type: 'FETCH' });
      const { data, errors } = await server.fetch<TData, TVariables>({
        query,
        variables,
      });

      if (errors && errors.length) {
        throw new Error(errors[0].message);
      }
      // setState({ data, loading: false, error: false });
      dispatch({ type: 'FETCH_SUCCESS', payload: data });
    } catch (error) {
      // setState({ data: null, loading: false, error: true });
      dispatch({ type: 'FETCH_ERROR' });
      throw console.error(error);
    }
  };

  return [fetch, state];
};
