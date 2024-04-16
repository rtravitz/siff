import { useState } from 'react'
import dayjs, { Dayjs } from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import { ModeToggle } from "./components/mode-toggle"
import { ThemeProvider } from "./components/theme-provider"
import rawFilms from './showtimes.json'
import { Tabs, TabsList, TabsTrigger, TabsContent } from './components/ui/tabs'
import { FilmsTab } from '@/components/films-tab'
import { useStickySet } from './hooks'
import { AttendingTab } from '@/components/attending-tab'
import { InfoPopover } from '@/components/info-popover'

export const linkStyle = 'underline underline-offset-4 decoration-2 decoration-teal-600'

dayjs.extend(customParseFormat)
dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefore)

export interface Showing {
  id: number;
  date: Dayjs;
  time: Dayjs;
  location: string;
}

export interface Film {
  title: string;
  link: string;
  showings: Showing[]
}

const films: Film[] = rawFilms.map(f => ({
  title: f.title,
  link: f.link,
  showings: f.showings.map(show => (
    {
      id: show.id,
      date: dayjs(show.date, 'M/D/YY'),
      time: dayjs(show.time, 'h:mm A'),
      location: show.location,
    })
  ),
}))

const allVenueSet: Set<string> = films.reduce((all: Set<string>, film: Film) => {
  film.showings.forEach(show => all.add(show.location))
  return all
}, new Set<string>())
const allVenues: Array<string> = Array.from(allVenueSet)

function App() {
  const [filterTitle, setFilterTitle] = useState('')
  const [selectedVenues, setSelectedVenues] = useState<Set<string>>(new Set<string>())
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null)
  const [startAfter, setStartAfter] = useState<Dayjs | null>(null)
  const [startBefore, setStartBefore] = useState<Dayjs | null>(null)
  const [starred, setStarred] = useStickySet<string>(new Set<string>(), 'starred')
  const [attending, setAttending] = useStickySet<number>(new Set<number>(), 'attending')
  const [filterFavorites, setFilterFavorites] = useState(false);

  const toggleStarred = (name: string) => {
    const updated = new Set(starred)
    if (updated.has(name)) {
      updated.delete(name)
    } else {
      updated.add(name)
    }

    setStarred(updated)
  }

  const toggleAttending = (id: number) => {
    const updated = new Set(attending)
    if (updated.has(id)) {
      updated.delete(id)
    } else {
      updated.add(id)
    }

    setAttending(updated)
  }

  const setDate = (val?: Date) => {
    if (val) {
      setSelectedDate(dayjs(val))
    } else {
      setSelectedDate(null)
    }
  }

  const updateSelectedVenues = (name: string, add: boolean): void => {
    const updated = new Set(selectedVenues)
    if (add) {
      updated.add(name)
    } else {
      updated.delete(name)
    }

    setSelectedVenues(updated)
  }

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="p-4">
        <Tabs defaultValue="films">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="films">Films</TabsTrigger>
              <TabsTrigger value="attending">Attending ({attending.size})</TabsTrigger>
            </TabsList>
            <div className="flex items-center">
              <InfoPopover />
              <ModeToggle />
            </div>
          </div>
          <TabsContent value="films">
            <FilmsTab
              allVenues={allVenues}
              films={films}
              filterTitle={filterTitle}
              selectedDate={selectedDate}
              selectedVenues={selectedVenues}
              setDate={setDate}
              setFilterTitle={setFilterTitle}
              setSelectedDate={setSelectedDate}
              setSelectedVenues={setSelectedVenues}
              setStartAfter={setStartAfter}
              setStartBefore={setStartBefore}
              starred={starred}
              startAfter={startAfter}
              startBefore={startBefore}
              toggleStarred={toggleStarred}
              updateSelectedVenues={updateSelectedVenues}
              attending={attending}
              toggleAttending={toggleAttending}
              filterFavorites={filterFavorites}
              setFilterFavorites={setFilterFavorites}
            />
          </TabsContent>
          <TabsContent value="attending">
            <AttendingTab
              films={films.filter(f => f.showings.some(s => attending.has(s.id)))}
              starred={starred}
              attending={attending}
              toggleAttending={toggleAttending}
              toggleStarred={toggleStarred}
            />
          </TabsContent>
        </Tabs>
      </div>
    </ThemeProvider >
  )
}

export default App
