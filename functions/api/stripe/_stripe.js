function normalizeStripeError(response, data) {
  const message = data?.error?.message || data?.message || response.statusText || 'Stripe request failed';
  const error = new Error(message);
  error.status = response.status;
  error.data = data;
  return error;
}

export async function stripeRequest(env, method, path, body) {
  const secretKey = env?.STRIPE_SECRET_KEY;
  if (!secretKey) {
    const error = new Error('Stripe secret key not configured');
    error.status = 500;
    throw error;
  }

  const url = `https://api.stripe.com${path}`;
  const headers = new Headers();
  headers.set('Authorization', `Bearer ${secretKey}`);
  headers.set('Stripe-Version', env?.STRIPE_API_VERSION || '2023-10-16');
  headers.set('Content-Type', 'application/x-www-form-urlencoded');

  const params = new URLSearchParams();
  Object.entries(body || {}).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    params.set(key, String(value));
  });

  const response = await fetch(url, {
    method,
    headers,
    body: method === 'GET' ? undefined : params.toString(),
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw normalizeStripeError(response, data);
  }
  return data;
}
