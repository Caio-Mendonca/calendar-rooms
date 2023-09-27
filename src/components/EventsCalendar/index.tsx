import { StrictMode } from 'react'

import Aside from '@/components/Aside'
import { ScheduleView } from '@/components/ScheduleTable'
import { useEventsContext } from '@/context/EventsContext'

import { CalendarComponent } from './Calendar'
import { EventCard } from './EventCard'

export const EventsCalendar = () => {
  const { events, updateDate, currentDate  } = useEventsContext()

  function getDate(date: Date | string) {
    updateDate(new Date(date))
  }


  return (
    <section className="flex w-full flex-col items-center xl:w-fit xl:flex-row xl:items-start">
      <Aside />
      <div className="w-80 py-8">
        <CalendarComponent getDate={getDate} />
        <div className="mt-7 flex w-full flex-col">
          <p className="mb-3">Agendas:</p>

          <div className="h-22 flex w-full flex-col overflow-y-auto py-4 scrollbar-thin">
            {events.length > 0 ? (
              events.map((event) => (
                <StrictMode key={event.id.toString()}>
                  <EventCard {...event} />
                </StrictMode>
              ))
            ) : (
              <p className="p-4">Nada criado para o dia selecionado</p>
            )}
          </div>
        </div>
      </div>
      <div className="mx-8 flex w-full overflow-y-auto py-8 scrollbar-thin scrollbar-thumb-transparent xl:flex-1">
        <ScheduleView
          events={events?.map(({ title, date, startDate, endDate, }) => ({
            startDate: new Date(`${date} ${startDate}`),
            endDate: new Date(`${date} ${endDate}`),
            title: title.normalize()
          }))}
          currentDate={currentDate}
        />
      </div>
    </section>
  )
}
