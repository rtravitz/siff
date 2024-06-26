import { Dayjs } from 'dayjs'
import { Star } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { VenueFilter } from '@/components/venue-filter'
import { DatePicker } from '@/components/date-picker'
import { TimePicker } from '@/components/time-picker'
import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { FilmListItem } from '@/components/film-list-item'
import { linkStyle, Film } from '@/app'

interface FilmsTabProps {
  allVenues: string[];
  films: Film[];
  filterTitle: string;
  selectedDate: Dayjs | null;
  selectedVenues: Set<string>;
  setDate: (val?: Date) => void;
  setFilterTitle: (val: string) => void;
  setSelectedDate: (val: Dayjs | null) => void;
  setSelectedVenues: (val: Set<string>) => void;
  setStartAfter: (val: Dayjs | null) => void;
  setStartBefore: (val: Dayjs | null) => void;
  starred: Set<string>;
  startAfter: Dayjs | null;
  startBefore: Dayjs | null;
  toggleStarred: (name: string) => void;
  updateSelectedVenues: (name: string, add: boolean) => void;
  attending: Set<string>;
  toggleAttending: (_: string) => void;
  filterFavorites: boolean;
  setFilterFavorites: (_: boolean) => void;
}

export function FilmsTab(props: FilmsTabProps) {
  const anyFilterActive = props.filterTitle.length > 0
    || props.selectedVenues.size > 0
    || props.selectedDate
    || props.startAfter
    || props.startBefore
    || props.filterFavorites

  const clearFilters = () => {
    props.setFilterTitle('')
    props.setSelectedVenues(new Set<string>())
    props.setSelectedDate(null)
    props.setStartAfter(null)
    props.setStartBefore(null)
    props.setFilterFavorites(false)
  }

  const checkFiltersForFilm = (film: Film): boolean => {
    if (props.filterFavorites && !props.starred.has(film.title)) {
      return false
    }

    const titleMatches = film.title.toLowerCase().includes(props.filterTitle)
    const atLeastOneShowingMatches = film.showings.some(show => {
      const startBeforeMatches = props.startBefore === null || show.time.isSameOrBefore(props.startBefore, 'minute')
      const startAfterMatches = props.startAfter === null || show.time.isSameOrAfter(props.startAfter, 'minute')
      const venueMatches = props.selectedVenues.size === 0 || props.selectedVenues.has(show.location)
      const dateMatches = props.selectedDate === null || show.date.isSame(props.selectedDate, 'day')
      return startBeforeMatches && startAfterMatches && venueMatches && dateMatches
    })

    return titleMatches && atLeastOneShowingMatches
  }

  const toggleFavoritesButtonStyle = props.filterFavorites ?
    { border: 'solid 2px gold' } : {}
  const toggleFavoritesStarColor = props.filterFavorites ? 'gold' : 'none'


  return (
    <>
      <Accordion type="single" collapsible className="w-full mb-4">
        <AccordionItem value="item-1">
          <AccordionTrigger className={`text-md pb-2 ${linkStyle}`}>Filters</AccordionTrigger>
          <AccordionContent>
            <Input
              className="mb-2 text-lg"
              placeholder="Title"
              value={props.filterTitle}
              onChange={(e) => { props.setFilterTitle(e.target.value.toLowerCase()) }} />
            <TimePicker
              time={props.startAfter}
              setTime={props.setStartAfter}
              id="startAfter"
              label="Start after" />
            <TimePicker
              time={props.startBefore}
              setTime={props.setStartBefore}
              id="startBefore"
              label="Start before" />
            <DatePicker setDate={props.setDate} date={props.selectedDate} />
            <VenueFilter
              venues={props.allVenues}
              updateChecked={props.updateSelectedVenues}
              checked={Array.from(props.selectedVenues)}
            />
            <Button
              style={toggleFavoritesButtonStyle}
              variant="outline"
              onClick={() => { props.setFilterFavorites(!props.filterFavorites) }}
            >Only Favorites <Star fill={toggleFavoritesStarColor} className="ml-2" size={16} />
            </Button>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      {
        anyFilterActive &&
        <Button
          onClick={clearFilters}
          className="mb-4">Clear Filters</Button>
      }
      <ul>
        {
          props.films
            .filter(film => checkFiltersForFilm(film))
            .map(film => <FilmListItem
              key={film.title}
              film={film}
              selectedVenues={props.selectedVenues}
              selectedDate={props.selectedDate}
              startBefore={props.startBefore}
              startAfter={props.startAfter}
              starred={props.starred.has(film.title)}
              checkFilters={true}
              toggleStarred={props.toggleStarred}
              attending={props.attending}
              toggleAttending={props.toggleAttending}
              checkAttending={false}
            />)
        }
      </ul>
    </>
  )
}
