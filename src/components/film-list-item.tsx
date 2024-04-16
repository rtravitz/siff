import { Dayjs } from 'dayjs';
import { Film, Showing, linkStyle } from '@/app'
import { Star, Play } from 'lucide-react'

interface FilmListItemProps {
  film: Film;
  selectedVenues?: Set<string>;
  selectedDate?: Dayjs | null;
  startAfter?: Dayjs | null;
  startBefore?: Dayjs | null;
  starred: boolean;
  checkFilters: boolean;
  toggleStarred: (name: string) => void;
  attending: Set<number>;
  toggleAttending: (_: number) => void;
  checkAttending: boolean;
}

export function FilmListItem(props: FilmListItemProps) {
  const checkFiltersForShowing = (show: Showing): boolean => {
    if (props.checkAttending) {
      if (!props.attending.has(show.id)) {
        return false
      }
    }

    if (props.checkFilters) {
      const venueMatches = props.selectedVenues?.size === 0 || props.selectedVenues?.has(show.location)
      const dateMatches = props.selectedDate === null || show.date.isSame(props.selectedDate, 'day')
      const startBeforeMatches = props.startBefore === null || show.time.isSameOrBefore(props.startBefore, 'minute')
      const startAfterMatches = props.startAfter === null || show.time.isSameOrAfter(props.startAfter, 'minute')
      return (venueMatches && dateMatches && startAfterMatches && startBeforeMatches)!
    }

    return true
  }

  return <li className="mb-6 flex items-center">
    <Star
      fill={props.starred ? 'gold' : 'none'}
      onClick={() => { props.toggleStarred(props.film.title) }}
      className="mr-4" />
    <div>
      <a href={props.film.link} target="_blank" className={`inline-block ${linkStyle}`}>
        <h3 className="text-xl font-bold mb-2">{props.film.title}</h3>
      </a>
      <div className="border-l border-b pl-2 pb-2">
        {
          props.film.showings
            .filter(showing => checkFiltersForShowing(showing))
            .map(showing => {
              const attendingFill = props.attending.has(showing.id) ? '#86efac' : 'none'
              return <div className="flex mt-1 items-center" key={showing.id}>
                <Play
                  fill={attendingFill}
                  onClick={() => { props.toggleAttending(showing.id) }}
                  className="mr-2" />
                <p className="text-lg">{showing.date.format('ddd, MMM D')} / {showing.time.format('h:mm A')} / {showing.location}</p>
              </div>
            })
        }
      </div>
    </div>
  </li>
}
