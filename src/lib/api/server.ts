interface Body<TVariables> {
  query: string;
  variables?: TVariables;
}

interface Error {
  message: string;
}

export const server = {
  fetch: async <TData = any, TVariables = any>(body: Body<TVariables>) => {
    // const res = await fetch('http://localhost:5000/api');
    // Note: use webpack "proxy" to deal with CORS error
    const res = await fetch('/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    // check server response that is unsuccessful
    if (!res.ok) {
      throw new Error('Failed to fetch from server');
    }

    // check for error when request is successful but graphql api return error
    return res.json() as Promise<{ data: TData; errors: Error[] }>;
  },
};
