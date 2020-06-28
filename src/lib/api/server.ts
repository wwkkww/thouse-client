interface Body {
  query: string;
}

export const server = {
  fetch: async (body: Body) => {
    // const res = await fetch('http://localhost:5000/api');
    // Note: use webpack "proxy" to deal with CORS error
    const res = await fetch('/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    return res.json();
  },
};