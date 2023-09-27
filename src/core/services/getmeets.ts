interface propsGetEvents {
    date: any
    room: any
}

export async function getEvents({ date,room }: propsGetEvents) {
    const response = await fetch(`/api/events?date=${date}&room=${room}`, {
        method: 'GET',
      })
    const data = await response.json()
    return data
}