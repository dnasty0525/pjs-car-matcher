export default async function handler(req, res) {
  const { match } = req.body;

  const emailBody = `
    Match found!\n
    Customer: ${match.customer.name} (${match.customer.email}, ${match.customer.phone})\n
    Requested: ${match.customer.year} ${match.customer.make} ${match.customer.model}\n
    Found in Inventory: ${match.vehicle.year} ${match.vehicle.make} ${match.vehicle.model}
  `;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'alerts@yourdomain.com',  // use a verified domain or Resend’s default domain
        to: 'your-email@example.com',
        subject: 'New Match Found in Inventory',
        text: emailBody,
      }),
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data);

    res.status(200).json({ message: 'Email sent', data });
  } catch (err) {
    console.error('Email error:', err);
    res.status(500).json({ error: 'Failed to send email' });
  }
}
