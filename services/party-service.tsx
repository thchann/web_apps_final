const BACKEND_URL = 'https://ac13-131-194-168-66.ngrok-free.app'; // make sure this is your current backend URL

export const createEvent = async (eventData: {
    title: string;
    date: string; 
    location: string;
    images: string;
    organization?: string;
    description?: string;
    host: string;
    attendees?: string[];
  }) => {
    const response = await fetch(`${BACKEND_URL}/events/create_event`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData),
    });
  
    if (!response.ok) {
      throw new Error('Failed to create event');
    }
  
    return await response.json(); 
  };

// Fetch all events
export const fetchAllEvents = async () => {
  const response = await fetch(`${BACKEND_URL}/events/all_events`);
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`[fetchAllEvents] Failed: ${response.status} ${errorText}`);
    throw new Error('Failed to fetch events');
  }
  const events = await response.json();
  return events.map((event: any) => ({
    id: event.id,
    title: event.title,
    org: event.organization ?? '',
    date: event.date,
    location: event.location,
    description: event.description,
    image: { uri: event.images },
    compact: false,
  }));
};

export const fetchEventAttendees = async (eventId: string) => {
  const response = await fetch(`${BACKEND_URL}/events/${eventId}/attendees`);
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`[fetchEventAttendees] Failed: ${response.status} ${errorText}`);
    throw new Error('Failed to fetch event attendees');
  }
  const attendees = await response.json();
  return attendees;
};

export const fetchUserById = async (userId: string) => {
  const response = await fetch(`${BACKEND_URL}/users/${userId}`);
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`[fetchUserById] Failed: ${response.status} ${errorText}`);
    throw new Error('Failed to fetch user by ID');
  }
  const user = await response.json();
  return {
    id: user.id,
    name: user.name,
    username: user.email.split('@')[0],
    avatar: { uri: user.image || 'https://via.placeholder.com/150' },
    status: 'pending' as 'pending', 
  };
};

export const attendEvent = async (eventId: string, userId: string) => {
  const response = await fetch(`${BACKEND_URL}/events/${eventId}/attend`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userId),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`[attendEvent] Failed: ${response.status} ${errorText}`);
    throw new Error('Failed to RSVP for event');
  }

  return await response.json();
};

export const rejectEvent = async (eventId: string, userId: string) => {
  const response = await fetch(`${BACKEND_URL}/events/${eventId}/attendees/${userId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to reject attendance');
  }

  return await response.json();
};

export const fetchUserEvents = async (userId: string) => {
    const response = await fetch(`${BACKEND_URL}/users/${userId}/events`);
    if (!response.ok) throw new Error('Failed to fetch user events');
    return await response.json(); 
  };
  
export const fetchEventById = async (eventId: string) => {
    const response = await fetch(`${BACKEND_URL}/events/${eventId}`);
    if (!response.ok) throw new Error('Failed to fetch event details');
    return await response.json(); 
  };
