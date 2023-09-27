import { ViewState } from '@devexpress/dx-react-scheduler'
import {
  Appointments,
  DayView,
  Resources
} from '@devexpress/dx-react-scheduler-material-ui'
import Paper from '@mui/material/Paper'
import Scheduler from '@/devexpress/dx-react-scheduler-material-ui'

import { useStateContext } from '@/context/StateContext'
import { ISchedulerView } from '@/core/types'
import { resources } from '@/mocks/dataResouces'
import { useEffect, useState } from 'react'

export const ScheduleView: React.FC<ISchedulerView> = ({
  events,
  currentDate
}) => {
  const [isClient, setIsClient] = useState(false);
  const { search } = useStateContext()
  useEffect(() => {
    setIsClient(true);
  }, []);
  const filtered = events.filter(({ title }) =>
    title?.toLocaleLowerCase().includes(search?.toLocaleLowerCase())
  )
  if (!isClient) {
    return null;
  }
  return (
    <Paper>
      <Scheduler data={filtered}>
        <ViewState currentDate={currentDate} />
        <DayView startDayHour={5} endDayHour={24} />
        <Appointments />
        <Resources data={resources} />
      </Scheduler>
    </Paper>
  )
}
