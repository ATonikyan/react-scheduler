import React, { useEffect, useCallback, Fragment } from "react";
import { Grid, Paper, Typography } from "@mui/material";
import {
  startOfWeek,
  addDays,
  eachMinuteOfInterval,
  isSameDay,
  isBefore,
  isToday,
  isWithinInterval,
  isAfter,
  endOfDay,
  startOfDay,
  addMinutes,
  set,
} from "date-fns";
import { CellRenderedProps, DayHours, DefaultRecourse, ProcessedEvent } from "../types";
import { WeekDays } from "./Month";
import {
  calcCellHeight,
  calcMinuteHeight,
  differenceInDaysOmitTime,
  filterMultiDaySlot,
  filterTodayEvents,
  getResourcedEvents,
  getTimeZonedDate,
} from "../helpers/generals";
import { WithResources } from "../components/common/WithResources";
import { MULTI_DAY_EVENT_HEIGHT } from "../helpers/constants";
import useSyncScroll from "../hooks/useSyncScroll";
import useStore from "../hooks/useStore";
import OneWeek, { MemoOneWeek } from "../custom/OneWeek";
import { WeekGridContainer } from "../styles/styles";

export interface WeekProps {
  weekDays: WeekDays[];
  weekStartOn: WeekDays;
  startHour: DayHours;
  endHour: DayHours;
  step: number;

  cellRenderer?(props: CellRenderedProps): JSX.Element;

  headRenderer?(day: Date): JSX.Element;

  navigation?: boolean;
  disableGoToDay?: boolean;
  timeRanges?: { label: string; value: number }[];
  customWeeks?: number[];
}

const Week = () => {
  const {
    week,
    selectedDate,
    height,
    events,
    handleGotoDay,
    getRemoteEvents,
    triggerLoading,
    handleState,
    resources,
    resourceFields,
    resourceViewMode,
    fields,
    direction,
    locale,
    hourFormat,
    timeZone,
    stickyNavitation,
  } = useStore();

  const {
    weekStartOn,
    weekDays,
    startHour,
    endHour,
    step,
    cellRenderer,
    disableGoToDay,
    headRenderer,
    customWeeks,
  } = week!;
  const _weekStart = startOfWeek(selectedDate, { weekStartsOn: weekStartOn });
  const daysList = weekDays.map((d) => addDays(_weekStart, d));
  const weekStart = startOfDay(daysList[0]);
  const weekEnd = endOfDay(daysList[daysList.length - 1]);
  const START_TIME = set(selectedDate, { hours: startHour, minutes: 0, seconds: 0 });
  const END_TIME = set(selectedDate, { hours: endHour, minutes: -step, seconds: 0 });

  const hours = week?.timeRanges
    ? week?.timeRanges?.map((time) => {
        return { value: new Date(START_TIME.setHours(time.value)), label: time.label };
      })
    : eachMinuteOfInterval(
        {
          start: START_TIME,
          end: END_TIME,
        },
        { step }
      ).map((t) => {
        return {
          value: t,
          label: t.toString(),
        };
      });

  const CELL_HEIGHT = calcCellHeight(height, hours.length);
  const MINUTE_HEIGHT = calcMinuteHeight(CELL_HEIGHT, step);
  const MULTI_SPACE = MULTI_DAY_EVENT_HEIGHT;
  const hFormat = hourFormat === "12" ? "hh:mm a" : "HH:mm";
  const { headersRef, bodyRef } = useSyncScroll();

  const fetchEvents = useCallback(async () => {
    try {
      triggerLoading(true);

      const events = await getRemoteEvents!({
        start: weekStart,
        end: weekEnd,
        view: "week",
      });
      if (Array.isArray(events)) {
        handleState(events, "events");
      }
    } catch (error) {
      throw error;
    } finally {
      triggerLoading(false);
    }
    // eslint-disable-next-line
  }, [selectedDate, getRemoteEvents]);

  useEffect(() => {
    if (getRemoteEvents instanceof Function) {
      fetchEvents();
    }
  }, [fetchEvents, getRemoteEvents]);

  const renderTable = (resource?: DefaultRecourse) => {
    let recousedEvents = events;
    if (resource) {
      recousedEvents = getResourcedEvents(events, resource, resourceFields, fields);
    }

    // Equalizing multi-day section height except in resource/tabs mode
    const shouldEqualize = resources.length && resourceViewMode !== "tabs";
    const allWeekMulti = filterMultiDaySlot(
      shouldEqualize ? events : recousedEvents,
      daysList,
      timeZone,
      true
    );
    const headerHeight = MULTI_SPACE * allWeekMulti.length + 45;

    return (
      <>
        {customWeeks ? (
          <WeekGridContainer container spacing={2}>
            {customWeeks.map((i) => {
              const weekDate = daysList.map((d) => {
                const a = new Date(d);
                a.setDate(a.getDate() + i * 7);
                return a;
              });
              return (
                <Grid item xs={12} lg={6} md={12} key={i}>
                  <MemoOneWeek
                    i={i}
                    weekDate={weekDate}
                    headerHeight={headerHeight}
                    recousedEvents={recousedEvents.filter(
                      (e) =>
                        weekDate[0] <= e.start &&
                        e.start <=
                          new Date(new Date(weekDate[6]).setDate(weekDate[6].getDate() + 1))
                    )}
                    resource={resources}
                  />
                </Grid>
              );
            })}
          </WeekGridContainer>
        ) : (
          <OneWeek
            weekDate={daysList}
            headerHeight={headerHeight}
            recousedEvents={recousedEvents}
            resource={resources}
          />
        )}
      </>
    );
  };

  return resources.length ? <WithResources renderChildren={renderTable} /> : renderTable();
};

export { Week };
