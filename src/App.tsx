import { Scheduler } from "./lib";
import { EVENTS } from "./events";
import { useRef } from "react";
import { DayHours, ProcessedEvent, RemoteQuery, SchedulerRef } from "./lib/types";
import { WeekDays } from "./lib/views/Month";
import { Typography, Button } from "@mui/material";
import EventNoteRoundedIcon from "@mui/icons-material/EventNoteRounded";
import { format } from "date-fns";

function App() {
  const calendarRef = useRef<SchedulerRef>(null);
  const date = new Date();

  function generateEventsForMonth(year: any, month: any, eventTemplate: any) {
    const eventsForMonth: ProcessedEvent[] = [];

    const daysInMonth = new Date(year, month, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month - 1, day);
      const event = { ...eventTemplate };
      event.event_id = day;
      event.title += day;
      event.start = new Date(currentDate);
      event.start.setHours(eventTemplate.start.getHours());
      event.start.setMinutes(eventTemplate.start.getMinutes());
      event.end = new Date(currentDate);
      event.end.setHours(eventTemplate.end.getHours());
      event.end.setMinutes(eventTemplate.end.getMinutes());
      eventsForMonth.push(event as ProcessedEvent);
      const newEvent = { ...eventTemplate };
      newEvent.event_id = day * 60;
      newEvent.title += day;
      newEvent.start = new Date(currentDate);
      newEvent.start.setHours(eventTemplate.start.getHours() + 3);
      newEvent.start.setMinutes(eventTemplate.start.getMinutes());
      newEvent.end = new Date(currentDate);
      newEvent.end.setHours(eventTemplate.end.getHours() + 3);
      newEvent.end.setMinutes(eventTemplate.end.getMinutes());
      eventsForMonth.push(newEvent as ProcessedEvent);
    }

    return eventsForMonth;
  }

  const fetchRemote: (params: RemoteQuery) => Promise<ProcessedEvent[]> = async (
    params: RemoteQuery
  ) => {
    return new Promise((res) => {
      setTimeout(() => {
        const eventsTemplate = {
          event_id: 1,
          title: "Event ",
          start: new Date(date.setHours(9, 0)),
          end: new Date(new Date().setHours(10, 0)),
          admin_id: [1, 2, 3, 4],
        };
        res(
          generateEventsForMonth(
            date.getFullYear(),
            date.getMonth() + 1,
            eventsTemplate as ProcessedEvent
          )
        );
      }, 100);
    });
  };

  return (
    <Scheduler
      ref={calendarRef}
      height={600}
      getRemoteEvents={fetchRemote}
      // view={"month"}
      month={{
        weekDays: [0, 1, 2, 3, 4, 5, 6],
        weekStartOn: 1,
        startHour: 9,
        endHour: 14,
        headRenderer: (day) => {
          return <></>;
        },
      }}
      onEventDrop={(
        droppedOn: Date,
        updatedEvent: ProcessedEvent,
        originalEvent: ProcessedEvent,
        htmlEvent: any
      ) => {
        return new Promise((res) => res(updatedEvent));
      }}
      week={{
        weekDays: [0, 1, 2, 3, 4, 5, 6],
        weekStartOn: 1,
        startHour: 9,
        endHour: 16,
        step: 60,
        timeRanges: [
          { label: "1-2", value: 9 },
          { label: "3-4", value: 10 },
          { label: "5-6", value: 11 },
          { label: "15:00-16:00", value: 12 },
          { label: "16:00-17:00", value: 13 },
          { label: "17:00-18:00", value: 14 },
          { label: "18:00-19:00", value: 15 },
        ],
        customWeeks: [-3, -2, -1, 0, 1, 2, 3, 4],
      }}
      viewerExtraComponent={() => {
        return (
          <Typography
            style={{ display: "flex", alignItems: "center", gap: 8 }}
            color="textSecondary"
            variant="caption"
            noWrap
          >
            <EventNoteRoundedIcon />
            04 September 2023 11:00 AM - 04 September 2023 12:00
          </Typography>
        );
      }}
      // events={generateRandomEvents(200)}
    />
  );
}

export default App;
