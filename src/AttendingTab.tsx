import { Button } from '@/components/ui/button'
import { Film, Showing } from "./App";
import { FilmListItem } from "./FilmListItem"
import { Calendar } from 'lucide-react'

interface AttendingTabProps {
  films: Film[]
  starred: Set<string>;
  toggleStarred: (name: string) => void;
  attending: Set<number>;
  toggleAttending: (_: number) => void;
}

interface ShowingOption {
  showing: Showing;
  title: string;
}

export function AttendingTab(props: AttendingTabProps) {
  if (props.attending.size === 0) {
    return <div className="flex justify-center items-center mt-12">
      <h3 className="text-lg">You aren't attending any events yet. Try clicking the "play button" next to a showing!</h3>
    </div>
  }

  const showingOptions: ShowingOption[] = []
  props.films.forEach((film) => {
    film.showings.forEach((show) => {
      if (props.attending.has(show.id)) {
        showingOptions.push({
          title: film.title,
          showing: show,
        })
      }
    })
  })

  return (
    <div>
      <div className="my-4">
        <Button variant="default" className="flex items-center mt-2">
          <Calendar size="16" className="mr-2" />
          Create Calendar Event
        </Button>
      </div>
      <ul>
        {
          props.films.map(film => <FilmListItem
            key={film.title}
            film={film}
            starred={props.starred.has(film.title)}
            checkFilters={false}
            toggleStarred={props.toggleStarred}
            attending={props.attending}
            toggleAttending={props.toggleAttending}
            checkAttending={true}
          />)
        }
      </ul>
    </div>
  )
}
