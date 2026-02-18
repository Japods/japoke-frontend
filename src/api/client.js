const BASE_URL = import.meta.env.VITE_API_URL || '/api';

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  };

  const response = await fetch(url, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || `Error ${response.status}`);
  }

  return data;
}

export async function getCatalog() {
  const res = await request('/catalog');
  return res.data;
}

export async function createOrder(orderData) {
  const res = await request('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData),
  });
  return res.data;
}

export async function getOrder(id) {
  const res = await request(`/orders/${id}`);
  return res.data;
}

export async function getExchangeRates() {
  const res = await request('/exchange-rates/latest');
  return res.data;
}
