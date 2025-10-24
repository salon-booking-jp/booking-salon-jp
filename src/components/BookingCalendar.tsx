'use client';

import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useBookings } from '@/hooks/useBookings';
import { CalendarEvent } from '@/lib/types';

interface BookingCalendarProps {
  onEventClick?: (event: CalendarEvent) => void;
  onDateClick?: (date: Date) => void;
}

export function BookingCalendar({ onEventClick, onDateClick }: BookingCalendarProps) {
  const { events, loading, error } = useBookings();
  const [view, setView] = useState<'dayGridMonth' | 'timeGridWeek' | 'timeGridDay'>('dayGridMonth');

  if (loading) {
    return <div className="p-4 text-center">カレンダーを読み込み中...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">エラー: {error}</div>;
  }

  const handleEventClick = (info: any) => {
    const event: CalendarEvent = {
      id: info.event.id,
      title: info.event.title,
      start: info.event.start,
      end: info.event.end,
      extendedProps: info.event.extendedProps,
    };
    onEventClick?.(event);
  };

  const handleDateClick = (info: any) => {
    onDateClick?.(info.date);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView={view}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
        events={events}
        eventClick={handleEventClick}
        dateClick={handleDateClick}
        locale="ja"
        height="auto"
        contentHeight="auto"
        eventDisplay="block"
        dayMaxEvents={true}
        editable={false}
        className="fc-custom"
      />
    </div>
  );
}