import React, { useState, useMemo, useEffect } from 'react';
import { Calendar as CalendarIcon, Users, ChevronLeft, ChevronRight, Info, Coffee, Trophy, MapPin, CalendarDays, LayoutGrid, List } from 'lucide-react';

// Raw schedule data
const rawData = [
  { id: 1, block: 'Block 1', week: 'MW1', date: '27/03/2026', day: 'Friday', team1: 'Frisbeyri', team2: 'Kanmathee FC', bye: 'Disc Raiders', note: 'Post-Ramadan Launch', isBuffer: false },
  { id: 2, block: 'Block 1', week: 'MW1', date: '27/03/2026', day: 'Friday', team1: 'Hammerheads', team2: 'Discfunctional', bye: 'Disc Raiders', note: 'Post-Ramadan Launch', isBuffer: false },
  { id: 3, block: 'Block 1', week: 'MW2', date: '03/04/2026', day: 'Friday', team1: 'Disc Raiders', team2: 'Discfunctional', bye: 'Kanmathee FC', note: '7-Day Rest', isBuffer: false },
  { id: 4, block: 'Block 1', week: 'MW2', date: '03/04/2026', day: 'Friday', team1: 'Frisbeyri', team2: 'Hammerheads', bye: 'Kanmathee FC', note: '7-Day Rest', isBuffer: false },
  { id: 5, block: 'Block 1', week: 'MW3', date: '10/04/2026', day: 'Friday', team1: 'Disc Raiders', team2: 'Frisbeyri', bye: 'Discfunctional', note: '7-Day Rest', isBuffer: false },
  { id: 6, block: 'Block 1', week: 'MW3', date: '10/04/2026', day: 'Friday', team1: 'Hammerheads', team2: 'Kanmathee FC', bye: 'Discfunctional', note: '7-Day Rest', isBuffer: false },
  { id: 7, block: 'Block 1', week: 'MW4', date: '17/04/2026', day: 'Friday', team1: 'Disc Raiders', team2: 'Kanmathee FC', bye: 'Hammerheads', note: '7-Day Rest', isBuffer: false },
  { id: 8, block: 'Block 1', week: 'MW4', date: '17/04/2026', day: 'Friday', team1: 'Discfunctional', team2: 'Frisbeyri', bye: 'Hammerheads', note: '7-Day Rest', isBuffer: false },
  { id: 9, block: 'Block 1', week: 'MW5', date: '24/04/2026', day: 'Friday', team1: 'Hammerheads', team2: 'Disc Raiders', bye: 'Frisbeyri', note: '7-Day Rest', isBuffer: false },
  { id: 10, block: 'Block 1', week: 'MW5', date: '24/04/2026', day: 'Friday', team1: 'Kanmathee FC', team2: 'Discfunctional', bye: 'Frisbeyri', note: '7-Day Rest', isBuffer: false },
  { id: 'b1', block: 'BUFFER', week: 'GAP', date: '01/05/2026', endDate: '02/05/2026', day: 'Friday', note: 'Labour Day Weekend', isBuffer: true },
  { id: 11, block: 'Block 2', week: 'MW6', date: '08/05/2026', day: 'Friday', team1: 'Kanmathee FC', team2: 'Frisbeyri', bye: 'Disc Raiders', note: '14-Day Gap (Post-Holiday)', isBuffer: false },
  { id: 12, block: 'Block 2', week: 'MW6', date: '08/05/2026', day: 'Friday', team1: 'Discfunctional', team2: 'Hammerheads', bye: 'Disc Raiders', note: '14-Day Gap (Post-Holiday)', isBuffer: false },
  { id: 13, block: 'Block 2', week: 'MW7', date: '15/05/2026', day: 'Friday', team1: 'Discfunctional', team2: 'Disc Raiders', bye: 'Kanmathee FC', note: '7-Day Rest', isBuffer: false },
  { id: 14, block: 'Block 2', week: 'MW7', date: '15/05/2026', day: 'Friday', team1: 'Hammerheads', team2: 'Frisbeyri', bye: 'Kanmathee FC', note: '7-Day Rest', isBuffer: false },
  { id: 15, block: 'Block 2', week: 'MW8', date: '19/05/2026', day: 'Tuesday', team1: 'Frisbeyri', team2: 'Disc Raiders', bye: 'Discfunctional', note: '4-Day Rest (Pre-Eid Push)', isBuffer: false },
  { id: 16, block: 'Block 2', week: 'MW8', date: '19/05/2026', day: 'Tuesday', team1: 'Kanmathee FC', team2: 'Hammerheads', bye: 'Discfunctional', note: '4-Day Rest (Pre-Eid Push)', isBuffer: false },
  { id: 'b2', block: 'BUFFER', week: 'GAP', date: '22/05/2026', endDate: '27/05/2026', day: 'Friday', note: 'Hajj / Eid-al-Adha Break', isBuffer: true },
  { id: 17, block: 'Block 3', week: 'MW9', date: '05/06/2026', day: 'Friday', team1: 'Kanmathee FC', team2: 'Disc Raiders', bye: 'Hammerheads', note: '17-Day Gap (Post-Eid)', isBuffer: false },
  { id: 18, block: 'Block 3', week: 'MW9', date: '05/06/2026', day: 'Friday', team1: 'Frisbeyri', team2: 'Discfunctional', bye: 'Hammerheads', note: '17-Day Gap (Post-Eid)', isBuffer: false },
  { id: 19, block: 'Block 3', week: 'MW10', date: '12/06/2026', day: 'Friday', team1: 'Disc Raiders', team2: 'Hammerheads', bye: 'Frisbeyri', note: 'Season Finale', isBuffer: false },
  { id: 20, block: 'Block 3', week: 'MW10', date: '12/06/2026', day: 'Friday', team1: 'Discfunctional', team2: 'Kanmathee FC', bye: 'Frisbeyri', note: 'Season Finale', isBuffer: false }
];

const TEAMS = ['All Teams', 'Frisbeyri', 'Kanmathee FC', 'Disc Raiders', 'Hammerheads', 'Discfunctional'];

// Helper to parse DD/MM/YYYY string to JS Date
const parseDate = (dateString) => {
  const [day, month, year] = dateString.split('/');
  return new Date(year, parseInt(month) - 1, day);
};

// Map raw data with JS dates and expand continuous holidays
const processedSchedule = [];
rawData.forEach(item => {
  const startDate = parseDate(item.date);
  if (item.isBuffer && item.endDate) {
    const endDate = parseDate(item.endDate);
    let current = new Date(startDate);
    while (current <= endDate) {
      processedSchedule.push({
        ...item,
        originalDate: item.date,
        date: `${current.getDate().toString().padStart(2, '0')}/${(current.getMonth() + 1).toString().padStart(2, '0')}/${current.getFullYear()}`,
        day: current.toLocaleDateString('en-US', { weekday: 'long' }),
        jsDate: new Date(current),
        id: `${item.id}-${current.getTime()}`,
        isExpandedDay: current.getTime() !== startDate.getTime() // Flag to hide duplicates in the list
      });
      current.setDate(current.getDate() + 1);
    }
  } else {
    processedSchedule.push({
      ...item,
      originalDate: item.date,
      jsDate: startDate,
      isExpandedDay: false
    });
  }
});

// Colors for Blocks and Buffers
const getBlockColors = (block, isBuffer) => {
  if (isBuffer) return 'bg-red-100 border-red-300 text-red-800';
  switch (block) {
    case 'Block 1': return 'bg-blue-100 border-blue-300 text-blue-800';
    case 'Block 2': return 'bg-emerald-100 border-emerald-300 text-emerald-800';
    case 'Block 3': return 'bg-purple-100 border-purple-300 text-purple-800';
    default: return 'bg-gray-100 border-gray-300 text-gray-800';
  }
};

export default function App() {
  const [selectedTeam, setSelectedTeam] = useState('All Teams');
  const [gameWeekMode, setGameWeekMode] = useState(false);
  const [highlightedDate, setHighlightedDate] = useState(null);
  const [calendarExpanded, setCalendarExpanded] = useState(false);
  const [activeMobileMonth, setActiveMobileMonth] = useState(0); // 0=Mar … 3=Jun
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)');
    setIsMobile(mq.matches);
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Filtering Logic
  const filteredSchedule = useMemo(() => {
    if (selectedTeam === 'All Teams') return processedSchedule;
    return processedSchedule.filter(
      item => item.isBuffer || item.team1 === selectedTeam || item.team2 === selectedTeam || item.bye === selectedTeam
    );
  }, [selectedTeam]);

  // Rest Days Calculation for Team View
  const teamScheduleWithRest = useMemo(() => {
    if (selectedTeam === 'All Teams') return filteredSchedule;
    
    let lastMatchDate = null;
    return filteredSchedule.map(item => {
      if (item.isBuffer) return item; // Keep buffers but don't count for rest
      
      const isPlaying = item.team1 === selectedTeam || item.team2 === selectedTeam;
      let restDays = null;
      
      if (isPlaying) {
        if (lastMatchDate) {
          const diffTime = Math.abs(item.jsDate - lastMatchDate);
          restDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        }
        lastMatchDate = item.jsDate;
      }

      return { ...item, restDays, isPlaying };
    });
  }, [filteredSchedule, selectedTeam]);

  // Statistics (Matches per month)
  const stats = useMemo(() => {
    const months = { 'March': 0, 'April': 0, 'May': 0, 'June': 0 };
    rawData.forEach(item => {
      if (!item.isBuffer) {
        const month = parseDate(item.date).toLocaleString('default', { month: 'long' });
        if (months[month] !== undefined) months[month]++;
      }
    });
    return months;
  }, []);

  const handleFixtureClick = (dateStr) => {
    setHighlightedDate(dateStr);
    if (isMobile) {
      // Pulse the dot + switch mini calendar to the correct month
      const parsed = parseDate(dateStr);
      const idx = monthsToRender.findIndex(m => m.getMonth() === parsed.getMonth());
      if (idx >= 0) setActiveMobileMonth(idx);
    } else {
      const el = document.getElementById(`cal-date-${dateStr}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    setTimeout(() => setHighlightedDate(null), 2500);
  };

  const handleMiniCalendarClick = (dateStr) => {
    setHighlightedDate(dateStr);
    const el = document.querySelector(`[data-fixture-date="${dateStr}"]`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => setHighlightedDate(null), 2500);
  };

  // Mini calendar dot colour (mirrors getBlockColors but returns a bg class for the dot)
  const getDotColor = (block, isBuffer) => {
    if (isBuffer) return 'bg-red-400';
    switch (block) {
      case 'Block 1': return 'bg-blue-400';
      case 'Block 2': return 'bg-emerald-400';
      case 'Block 3': return 'bg-purple-400';
      default: return 'bg-gray-400';
    }
  };

  // Renders compact 7-col grid for the currently active mobile month
  const renderMiniCalendar = () => {
    const monthDate = monthsToRender[activeMobileMonth];
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayIndex = new Date(year, month, 1).getDay();

    const cells = [];
    for (let i = 0; i < firstDayIndex; i++) {
      cells.push(<div key={`e-${i}`} />);
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${d.toString().padStart(2, '0')}/${(month + 1).toString().padStart(2, '0')}/${year}`;
      const dayEvents = processedSchedule.filter(e => e.date === dateStr);
      const hasEvents = dayEvents.length > 0;
      const isBuffer = dayEvents.some(e => e.isBuffer);
      const eventBlock = hasEvents ? dayEvents[0].block : null;
      const isHighlightActive = highlightedDate === dateStr;

      // Dim when a team is selected and this day's events don't involve them
      const isRelevant = !hasEvents || selectedTeam === 'All Teams' ||
        dayEvents.some(e => e.isBuffer || e.team1 === selectedTeam || e.team2 === selectedTeam);

      cells.push(
        <div
          key={d}
          onClick={() => hasEvents ? handleMiniCalendarClick(dateStr) : undefined}
          className={`flex flex-col items-center justify-center h-9 rounded-lg transition-all duration-200
            ${hasEvents ? 'cursor-pointer hover:bg-gray-50' : ''}
            ${isHighlightActive ? 'ring-2 ring-[#0076CE] bg-[#0076CE]/10' : ''}
            ${!isRelevant ? 'opacity-30' : ''}
          `}
        >
          <span className={`text-[10px] font-semibold leading-none ${hasEvents ? 'text-slate-800' : 'text-gray-400'}`}>{d}</span>
          {hasEvents && (
            <span className={`mt-0.5 w-1.5 h-1.5 rounded-full ${getDotColor(eventBlock, isBuffer)} ${isHighlightActive ? 'animate-pulse' : ''}`} />
          )}
        </div>
      );
    }
    return cells;
  };

  // Calendar Rendering Helpers
  const renderMonth = (monthDate) => {
    if (gameWeekMode) {
      const year = monthDate.getFullYear();
      const month = monthDate.getMonth();
      
      // Filter out expanded buffer days so holidays are grouped into a single entry
      const monthEvents = processedSchedule.filter(e => 
        e.jsDate.getMonth() === month && 
        e.jsDate.getFullYear() === year &&
        !(e.isBuffer && e.isExpandedDay)
      );
      
      const datesMap = new Map();
      monthEvents.forEach(e => {
        if (!datesMap.has(e.date)) datesMap.set(e.date, []);
        datesMap.get(e.date).push(e);
      });

      if (datesMap.size === 0) return <div className="text-sm text-gray-400 py-2 italic px-2">No fixtures this month.</div>;

      const rows = [];
      datesMap.forEach((dayEvents, dateStr) => {
         const isBuffer = dayEvents.some(e => e.isBuffer);
         let isPlayingToday = false;
         let isHighlighted = false;
         
         if (selectedTeam !== 'All Teams') {
            isPlayingToday = dayEvents.some(e => e.team1 === selectedTeam || e.team2 === selectedTeam);
            isHighlighted = isPlayingToday || isBuffer; 
         } else {
            isHighlighted = true;
         }

         if (selectedTeam !== 'All Teams' && !isHighlighted) return; 

         const eventBlock = dayEvents[0].block;
         const isHighlightActive = highlightedDate === dateStr;

         rows.push(
           <div key={dateStr} id={`cal-date-${dateStr}`} className={`mb-3 border rounded-xl p-3 bg-white transition-all duration-500 ${isHighlightActive ? 'ring-2 ring-[#0076CE] shadow-lg border-[#0076CE] transform scale-[1.02]' : 'border-gray-200 hover:shadow-sm'}`}>
             <div className="flex justify-between items-center mb-2 border-b border-gray-100 pb-2">
                <div className="font-bold text-sm text-slate-800">
                   {isBuffer && dayEvents[0].endDate 
                      ? `${dayEvents[0].originalDate} - ${dayEvents[0].endDate}` 
                      : `${dayEvents[0].day}, ${dateStr}`}
                </div>
                {isBuffer ? (
                   <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-1 rounded border border-red-100">Holiday Break</span>
                ) : (
                   <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded border ${getBlockColors(eventBlock, false)}`}>{eventBlock} - {dayEvents[0].week}</span>
                )}
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {dayEvents.map((ev, idx) => {
                   if (ev.isBuffer) {
                      return <div key={idx} className="col-span-1 md:col-span-2 text-xs text-red-600 font-medium flex items-center gap-1"><Coffee size={12}/> {ev.note}</div>;
                   }
                   
                   if (selectedTeam !== 'All Teams' && ev.team1 !== selectedTeam && ev.team2 !== selectedTeam) return null;

                   return (
                     <div key={idx} className="flex justify-between items-center text-xs p-2 bg-gray-50 rounded-lg border border-gray-100">
                        <span className={`flex-1 text-right font-semibold truncate ${selectedTeam === ev.team1 ? 'text-[#0076CE]' : 'text-slate-700'}`}>{ev.team1}</span>
                        <span className="text-[9px] text-gray-400 font-bold px-3">VS</span>
                        <span className={`flex-1 text-left font-semibold truncate ${selectedTeam === ev.team2 ? 'text-[#0076CE]' : 'text-slate-700'}`}>{ev.team2}</span>
                     </div>
                   );
                })}
             </div>
           </div>
         );
      });
      
      return rows.length > 0 ? rows : <div className="text-sm text-gray-400 py-2 italic px-2">No matches for selected team this month.</div>;
    }

    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Sunday
    
    const days = [];
    // Pad empty days
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(<div key={`empty-${i}`} className="h-20 bg-gray-50/40 rounded-lg border border-transparent"></div>);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const currentDate = new Date(year, month, i);
      const dateString = `${i.toString().padStart(2, '0')}/${(month + 1).toString().padStart(2, '0')}/${year}`;
      
      const dayEvents = processedSchedule.filter(e => e.date === dateString);
      const hasMatch = dayEvents.some(e => !e.isBuffer);
      const isBuffer = dayEvents.some(e => e.isBuffer);
      
      // Highlight logic based on selection
      let isHighlighted = false;
      let eventBlock = null;
      let isPlayingToday = false;

      const dayOfWeek = currentDate.getDay();
      const isMatchDayOfWeek = dayOfWeek === 2 || dayOfWeek === 5; // Highlight Tuesdays and Fridays

      if (dayEvents.length > 0) {
        eventBlock = dayEvents[0].block;
        if (selectedTeam !== 'All Teams') {
           isPlayingToday = dayEvents.some(e => e.team1 === selectedTeam || e.team2 === selectedTeam);
           isHighlighted = isPlayingToday || isBuffer; 
        } else {
           isHighlighted = true;
        }
      }

      const blockColorClass = dayEvents.length > 0 ? getBlockColors(eventBlock, isBuffer) : '';
      const opacityClass = (selectedTeam !== 'All Teams' && !isHighlighted && dayEvents.length > 0) ? 'opacity-30 grayscale' : '';
      const bgClass = isMatchDayOfWeek ? 'bg-[#0076CE]/[0.04] border-[#0076CE]/20' : 'bg-white border-gray-200';
      const isHighlightActive = highlightedDate === dateString;

      days.push(
        <div key={i} id={`cal-date-${dateString}`} className={`relative h-20 border rounded-lg p-1.5 flex flex-col transition-all duration-500 hover:shadow-sm ${bgClass} ${opacityClass} ${isHighlightActive ? 'ring-2 ring-[#0076CE] shadow-lg scale-105 z-10 bg-white' : ''}`}>
          <span className={`absolute top-1 right-1 text-[10px] font-semibold w-5 h-5 flex items-center justify-center rounded-full ${dayEvents.length > 0 ? 'bg-gray-800 text-white shadow-sm' : 'text-gray-400'}`}>
            {i}
          </span>
          
          <div className="flex-1 overflow-y-auto mt-5 space-y-1 no-scrollbar">
            {dayEvents.map((ev, idx) => (
              <div key={idx} className={`text-[9px] px-1.5 py-0.5 rounded border leading-tight ${getBlockColors(ev.block, ev.isBuffer)}`}>
                {ev.isBuffer ? (
                  <span className="font-bold flex items-center gap-1"><Coffee size={8} /> Holiday</span>
                ) : (
                  <span className="font-semibold">{ev.block} - {ev.week}</span>
                )}
              </div>
            ))}
            {isPlayingToday && selectedTeam !== 'All Teams' && (
              <div className="text-[8px] bg-yellow-100 text-yellow-800 rounded font-bold text-center mt-0.5 border border-yellow-300 shadow-sm animate-pulse">
                MATCH
              </div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  const monthsToRender = [
    new Date(2026, 2, 1), // March
    new Date(2026, 3, 1), // April
    new Date(2026, 4, 1), // May
    new Date(2026, 5, 1)  // June
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-gray-800 pb-12" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Header */}
      <header className="bg-white py-6 px-4 sm:px-6 lg:px-8 shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img src="/ufa-logo.png" alt="Ultimate Frisbee Association" className="h-12 md:h-16 object-contain" />
            <div className="hidden md:flex items-center gap-1 text-xs font-semibold text-[#0076CE] bg-[#0076CE]/10 px-3 py-1 rounded-full">
              <MapPin size={12} /> Villingili
            </div>
          </div>
          
          {/* Summary Stats Cards */}
          <div className="flex flex-col items-center md:items-end w-full md:w-auto">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Matches Scheduled Per Month</span>
            <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 justify-center md:justify-end">
              {Object.entries(stats).map(([month, count]) => (
                <div key={month} className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-center min-w-[70px]">
                  <div className="text-[10px] text-gray-500 uppercase font-semibold">{month}</div>
                  <div className="text-lg font-bold text-[#0076CE]">{count}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Team Selector */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Users className="text-[#0076CE]" size={20} />
            <h2 className="text-lg font-bold text-slate-800">Focus on a Team</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {TEAMS.map(team => (
              <button
                key={team}
                onClick={() => setSelectedTeam(team)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 border-2 
                  ${selectedTeam === team 
                    ? 'bg-[#0076CE] border-[#0076CE] text-white shadow-md transform scale-105' 
                    : 'bg-white border-gray-200 text-gray-600 hover:border-[#0076CE]/30 hover:bg-[#0076CE]/5'}`}
              >
                {team}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Mini Calendar Strip — hidden on desktop */}
        <div className="lg:hidden mb-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">

            {/* Month navigation */}
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={() => setActiveMobileMonth(m => Math.max(0, m - 1))}
                disabled={activeMobileMonth === 0}
                className="p-1.5 rounded-lg disabled:opacity-30 hover:bg-gray-100 transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-slate-800">
                  {monthsToRender[activeMobileMonth].toLocaleString('default', { month: 'long', year: 'numeric' })}
                </span>
                <button
                  onClick={() => setGameWeekMode(!gameWeekMode)}
                  className="flex items-center gap-1 px-2 py-1 bg-[#0076CE]/10 hover:bg-[#0076CE]/20 text-[#0076CE] text-[10px] font-bold rounded-md transition-colors"
                >
                  {gameWeekMode ? <LayoutGrid size={11} /> : <List size={11} />}
                  {gameWeekMode ? 'Grid' : 'List'}
                </button>
              </div>
              <button
                onClick={() => setActiveMobileMonth(m => Math.min(3, m + 1))}
                disabled={activeMobileMonth === 3}
                className="p-1.5 rounded-lg disabled:opacity-30 hover:bg-gray-100 transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            {/* Day-of-week headers */}
            <div className="grid grid-cols-7 gap-1 mb-1">
              {['S','M','T','W','T','F','S'].map((d, i) => (
                <div key={i} className="text-center text-[9px] font-semibold text-slate-400 uppercase">{d}</div>
              ))}
            </div>

            {/* Mini calendar grid */}
            <div className="grid grid-cols-7 gap-1">
              {renderMiniCalendar()}
            </div>

            {/* Block colour legend */}
            <div className="flex flex-wrap gap-3 mt-3 pt-3 border-t border-gray-100 text-[10px] text-gray-600">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-400 shrink-0" /> Block 1</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" /> Block 2</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-400 shrink-0" /> Block 3</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400 shrink-0" /> Holiday</span>
            </div>

            {/* Expand / collapse full calendar */}
            <button
              onClick={() => setCalendarExpanded(v => !v)}
              className="mt-3 w-full text-center text-xs font-semibold text-[#0076CE] py-2 rounded-lg hover:bg-[#0076CE]/5 transition-colors flex items-center justify-center gap-1.5 border border-[#0076CE]/20"
            >
              <CalendarDays size={13} />
              {calendarExpanded ? 'Hide Full Calendar' : 'View Full Calendar'}
            </button>

            {/* Collapsible full calendar */}
            <div
              className="overflow-hidden transition-all duration-500"
              style={{ maxHeight: calendarExpanded ? '2000px' : '0px' }}
            >
              <div className="mt-4 pt-4 border-t border-gray-100 space-y-8 overflow-y-auto custom-scrollbar" style={{ maxHeight: '60vh' }}>
                {monthsToRender.map(monthDate => (
                  <div key={monthDate.getTime()}>
                    <h3 className="text-base font-bold mb-2 sticky top-0 bg-white/95 backdrop-blur py-1.5 z-10 text-slate-800 border-b border-gray-100">
                      {monthDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </h3>
                    {!gameWeekMode && (
                      <div className="grid grid-cols-7 gap-0.5 mb-1">
                        {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
                          <div key={d} className="text-center text-[8px] font-semibold text-slate-400 py-0.5 uppercase">{d}</div>
                        ))}
                      </div>
                    )}
                    <div className={gameWeekMode ? 'space-y-2' : 'grid grid-cols-7 gap-0.5'}>
                      {renderMonth(monthDate)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Calendar — desktop only */}
          <div className="hidden lg:block lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col h-[85vh]">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800">
                  <CalendarDays className="text-[#0076CE]" />
                  Season Calendar
                </h2>
                <button 
                  onClick={() => setGameWeekMode(!gameWeekMode)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0076CE]/10 hover:bg-[#0076CE]/20 text-[#0076CE] text-xs font-bold rounded-lg transition-colors"
                >
                  {gameWeekMode ? <LayoutGrid size={14} /> : <List size={14} />}
                  {gameWeekMode ? 'Grid View' : 'Game Week View'}
                </button>
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-4 mb-4 text-xs">
                <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-blue-400"></span> Block 1</div>
                <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-400"></span> Block 2</div>
                <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-purple-400"></span> Block 3</div>
                <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-red-400"></span> Holiday</div>
              </div>

              {/* Scrollable Calendar Container */}
              <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-8">
                {monthsToRender.map((monthDate) => (
                  <div key={monthDate.getTime()}>
                    <h3 className="text-lg font-bold mb-3 sticky top-0 bg-white/95 backdrop-blur py-2 z-10 text-slate-800 border-b border-gray-100">
                      {monthDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </h3>
                    {!gameWeekMode && (
                      <div className="grid grid-cols-7 gap-1 md:gap-2 mb-2">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                          <div key={day} className="text-center text-[10px] font-semibold text-slate-400 py-1 uppercase tracking-wider">
                            {day}
                          </div>
                        ))}
                      </div>
                    )}
                    <div className={gameWeekMode ? "space-y-2" : "grid grid-cols-7 gap-1 md:gap-2"}>
                      {renderMonth(monthDate)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Fixture List */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 sticky top-6 max-h-[85vh] overflow-y-auto custom-scrollbar">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-800 sticky top-0 bg-white z-10 py-2 border-b border-gray-100">
                <CalendarIcon className="text-[#0076CE]" size={20} />
                Fixtures
                {selectedTeam !== 'All Teams' && <span className="text-xs font-normal text-[#0076CE] bg-[#0076CE]/10 px-2 py-0.5 rounded-full ml-auto">{selectedTeam}</span>}
              </h3>
              
              <div className="space-y-3 relative">
                {teamScheduleWithRest.map((item, idx) => {
                  if (item.isBuffer && item.isExpandedDay) return null; // Hide expanded duplicates
                  
                  // FEATURE 4: Hide fixtures that aren't theirs
                  if (selectedTeam !== 'All Teams' && !item.isPlaying && !item.isBuffer) return null;
                  
                  const isHighlightActive = highlightedDate === item.date;

                  return (
                    <React.Fragment key={item.id}>
                      {/* Rest Days Indicator */}
                      {selectedTeam !== 'All Teams' && item.restDays && item.isPlaying && !item.isBuffer && (
                        <div className="flex items-center justify-center -my-2 relative z-0">
                          <div className="bg-[#0076CE]/5 border border-[#0076CE]/20 text-[#0076CE] text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                            {item.restDays} Days Rest
                          </div>
                        </div>
                      )}

                      {/* Buffer/Holiday Card or Match Card */}
                      <div
                        data-fixture-date={item.originalDate}
                        onClick={() => handleFixtureClick(item.date)}
                        className={`relative z-10 rounded-lg p-3 border transition-all duration-300 cursor-pointer hover:shadow-md
                          ${item.isBuffer ? 'bg-red-50/50 border-red-200' : 'bg-white border-gray-200'} 
                          ${isHighlightActive ? 'ring-2 ring-[#0076CE] shadow-lg border-[#0076CE] scale-[1.02]' : 'hover:border-[#0076CE]/40'}
                        `}
                      >
                        {item.isBuffer ? (
                          <div className="flex items-center gap-3">
                            <div className="bg-red-100 p-1.5 rounded text-red-600"><Coffee size={14} /></div>
                            <div>
                              <p className="text-xs font-bold text-red-800">{item.note}</p>
                              <p className="text-[10px] text-red-600/80">
                                {item.endDate ? `${item.originalDate} - ${item.endDate}` : `${item.day}, ${item.date}`}
                              </p>
                            </div>
                          </div>
                        ) : (
                          /* Match Card - Condensed */
                          <>
                            <div className="flex justify-between items-center mb-2">
                              <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded border ${getBlockColors(item.block, false)}`}>
                                {item.block} - {item.week}
                              </span>
                              <span className="text-[10px] font-semibold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                                {item.originalDate}
                              </span>
                            </div>

                            <div className="flex items-center justify-between text-center gap-1.5 mb-2">
                              <div className={`flex-1 p-1.5 rounded-md font-bold text-xs truncate ${selectedTeam === item.team1 ? 'bg-[#0076CE] text-white shadow-sm' : 'bg-gray-50 text-slate-700'}`}>
                                {item.team1}
                              </div>
                              <span className="text-gray-300 font-bold text-[9px] uppercase">vs</span>
                              <div className={`flex-1 p-1.5 rounded-md font-bold text-xs truncate ${selectedTeam === item.team2 ? 'bg-[#0076CE] text-white shadow-sm' : 'bg-gray-50 text-slate-700'}`}>
                                {item.team2}
                              </div>
                            </div>

                            <div className="flex justify-between items-center text-[10px] pt-2 border-t border-gray-50">
                              <span className="text-gray-500 flex items-center gap-1 truncate max-w-[65%]">
                                <Info size={12} className="text-gray-400 shrink-0" /> {item.note}
                              </span>
                              <span className="text-gray-400 whitespace-nowrap">Bye: <span className="font-medium text-gray-600">{item.bye}</span></span>
                            </div>
                          </>
                        )}
                      </div>
                    </React.Fragment>
                  );
                })}
                
                {teamScheduleWithRest.length === 0 && (
                  <div className="text-center py-8 text-gray-500">No events found for this selection.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #e2e8f0; border-radius: 20px; }
      `}} />
    </div>
  );
}
