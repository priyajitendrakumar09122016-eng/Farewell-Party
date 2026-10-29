import { RSVP } from '../types';

export const appendRsvpToWebhook = async (
  webhookUrl: string,
  rsvp: RSVP
): Promise<boolean> => {
  if (!webhookUrl || !webhookUrl.startsWith('http')) return false;

  try {
    const payload = {
      name: rsvp.name,
      attending: rsvp.attending ? 'Yes' : 'No',
      foodChoice: rsvp.attending
        ? rsvp.foodChoice === 'veg'
          ? 'Veg Biryani'
          : 'Non-Veg Biryani'
        : 'Not Attending',
      phone: rsvp.phone || '-',
    };

    await fetch(webhookUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    return true;
  } catch (err) {
    console.error('Failed to post to Google Sheets Webhook:', err);
    return false;
  }
};

export const appendRsvpToGoogleSheet = async (
  accessToken: string,
  spreadsheetId: string,
  rsvp: RSVP
): Promise<boolean> => {
  try {
    const row = [
      rsvp.name,
      rsvp.attending ? 'Yes' : 'No',
      rsvp.attending
        ? rsvp.foodChoice === 'veg'
          ? 'Veg Biryani'
          : 'Non-Veg Biryani'
        : 'Not Attending',
      rsvp.phone || '-',
    ];

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(
      spreadsheetId
    )}/values/Sheet1!A:D:append?valueInputOption=USER_ENTERED`;

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: [row],
      }),
    });

    return res.ok;
  } catch (err) {
    console.error('Failed to append to Google Sheet:', err);
    return false;
  }
};

export const syncAllRsvpsToGoogleSheet = async (
  accessToken: string,
  spreadsheetId: string,
  rsvps: RSVP[]
): Promise<boolean> => {
  try {
    const headers = ['Name', 'Physical Present', 'Veg/Non VEg', 'Mobile No.'];
    const rows = rsvps.map((r) => [
      r.name,
      r.attending ? 'Yes' : 'No',
      r.attending
        ? r.foodChoice === 'veg'
          ? 'Veg Biryani'
          : 'Non-Veg Biryani'
        : 'Not Attending',
      r.phone || '-',
    ]);

    const values = [headers, ...rows];

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(
      spreadsheetId
    )}/values/Sheet1!A1:D${values.length}?valueInputOption=USER_ENTERED`;

    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values,
      }),
    });

    return res.ok;
  } catch (err) {
    console.error('Failed to sync all RSVPs to Google Sheet:', err);
    return false;
  }
};
