import { Scheduler } from "./lib";
import { EVENTS } from "./events";
import { useRef } from "react";
import { DayHours, SchedulerRef } from "./lib/types";
import { WeekDays } from "./lib/views/Month";
import { Typography } from "@mui/material";
import EventNoteRoundedIcon from "@mui/icons-material/EventNoteRounded";
import { format } from "date-fns";

function App() {
  const calendarRef = useRef<SchedulerRef>(null);

  // const fetchRemote = async (query: RemoteQuery): Promise<ProcessedEvent[]> => {
  //   console.log({ query });
  //   /**Simulate fetchin remote data */
  //   return new Promise((res) => {
  //     setTimeout(() => {
  //       res(generateRandomEvents(200));
  //     }, 3000);
  //   });
  // };

  return (
    <Scheduler
      ref={calendarRef}
      events={EVENTS}
      view={"week"}
      month={{
        weekDays: [0, 1, 2, 3, 4, 5, 6],
        weekStartOn: 1,
        startHour: 9,
        endHour: 14,
        headRenderer: (day) => {
          return <></>;
        },
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
