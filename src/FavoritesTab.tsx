import { Film } from "./App";
import { FilmListItem } from "./FilmListItem";

interface FavoritesTabProps {
  films: Film[]
  starred: Set<string>;
  toggleStarred: (name: string) => void;
  attending: Set<number>;
  toggleAttending: (_: number) => void;
}

export function FavoritesTab(props: FavoritesTabProps) {
  return (
    <ul>
      {
        props.films.map(film => <FilmListItem
          film={film}
          starred={props.starred.has(film.title)}
          checkFilters={false}
          toggleStarred={props.toggleStarred}
          attending={props.attending}
          toggleAttending={props.toggleAttending}
          checkAttending={false}
        />)
      }
    </ul>
  )
}

