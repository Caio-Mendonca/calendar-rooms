import { IEvents } from '@/core/types'

export const LocalStorage = () => {
  const get = (key: string) => {
    const getItem = localStorage.getItem(key)
    const response: IEvents[] = getItem ? JSON.parse(getItem) : []

    return response
  }

  const set = (key: string, data: string) => {
    localStorage.setItem(key, data)
  }

  return { get, set }
}

export const CRUD = () => {
  const get = async () => {
    const response = await fetch('/api/events', {
      method: 'GET',
    })
    const data = await response.json()
    return data
  }
  const add = async (event: any) => {
      const response = await fetch('/api/createEvent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      })
      const data = await response.json()
      if(response.status !== 201) {
        const data = await response.json();
        return Promise.reject(data);
      }
      return data;
  };
  const remove = async (events: IEvents[], eventId: string) => {
    const response = await fetch(`/api/deleteEvent?id=${eventId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.status !== 204) {
      throw new Error(`Failed to delete event. Status: ${response.status}`);
    }
    return events.filter(({ id }) => id !== eventId);
}

  const update = async (event: IEvents) => {
    console.log('event ->',event)
    const response = await fetch(`/api/updateEvent?id=${event.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    });
    console.log('response ->',response)
    const data = await response.json();
    console.log('data ->',data)
    if(response.status !== 200) {
      throw new Error(`Failed to update event. Status: ${response.status}`);
    }
    return  data;
  }

  return { add, update, remove, get }
}
