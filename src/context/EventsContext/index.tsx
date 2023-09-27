/* eslint-disable react-hooks/exhaustive-deps */
import { createContext, useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import { useRouter } from 'next/router'
import { CRUD } from '@/core/methods'
import { IChildren, IEvents, IEventsContext } from '@/core/types'
import moment from 'moment'
import { getEvents } from '@/core/services/getmeets'

const defaultEvents: IEventsContext = {
  events: [],
  currentDate: new Date(),
  setEvents: () => [],
  saveEventStorage: () => null,
  removeEventStorage: () => null,
  updateEventStorage: () => null,
  updateDate: () => null,
}

const EventsContext = createContext(defaultEvents)

const useEventsContext = () => useContext(EventsContext)

const EventProvider = ({ children }: IChildren) => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const router = useRouter()
  const path = router.pathname

  const [events, setEvents] = useState<any>([])

  const crud = CRUD()

  const saveEventStorage = async (event: IEvents) => {
    await crud.add(event).then((res) => {
      setEvents([...events, res])
      toast.success(`Event "${event.title}" created!`)
    }).catch((err) => {
      toast.error(`Error: ${err.error}`)
    })
  }

  const removeEventStorage = async (id: string) => {
    const remove = await crud.remove(events, id)
    setEvents(remove)
    toast.success(`Event removed!`)
  }

  const updateEventStorage = async (event: IEvents) => {
    console.log(event)
    const update = await crud.update(event)
    console.log('event.id', event.id)
    const filter = events.filter(({ id } : any) => id === event.id)
    console.log('1filter', filter)
    console.log('2update', update)
    setEvents([...filter, update])
    toast.success(`Event "${event.title}" updated!`)

  }
  const updateDate = (date: Date) => {
    setCurrentDate(date)
  }
  function updateEvents(){
    const formattedDate = moment(currentDate).format('YYYY-MM-DD');
    getEvents({date:formattedDate, room: path ==='/' ? 'deolinda': 'jose_mauricio'}).then((res) => {
      setEvents(res)
    })
  }
  useEffect(() => {
    updateEvents()
  }, [currentDate, path])
  return (
    <EventsContext.Provider
      value={{
        events,
        currentDate,
        setEvents,
        saveEventStorage,
        removeEventStorage,
        updateEventStorage,
        updateDate
      }}
    >
      {children}
    </EventsContext.Provider>
  )
}

export { EventProvider, useEventsContext }
