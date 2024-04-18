import jsdom from 'jsdom'
import fs from 'fs'
import dayjs from 'dayjs'
import axios from 'axios'

const dateRegex = /\/Date\((\d+)\)\//

function topLevel(filmsPage) {
  const filmsDom = new jsdom.JSDOM(filmsPage)
  const allFilms = []

  const filmElems = filmsDom.window.document.querySelectorAll('.filtered-index > div > p > a')
  filmElems.forEach(filmEl => {
    let film = {
      title: filmEl.querySelector('span > span.title').textContent,
      link: filmEl.getAttribute('href')
    }

    allFilms.push(film)
  })

  return allFilms
}

function individual(filmPage) {
  const filmDom = new jsdom.JSDOM(filmPage)
  const showtimes = filmDom.window.document.querySelectorAll('.showtimes a.elevent')
  const outputShowings = []
  showtimes.forEach(showEl => {
    const screening = JSON.parse(showEl.getAttribute('data-screening'))
    if (screening.VenueName !== 'Virtual') {
      const extracted = dateRegex.exec(screening.Showtime)
      const dateInt = parseInt(extracted[1])
      const date = dayjs(dateInt)
      let showing = {
        id: screening.ShowtimeId,
        date: date.format('M/DD/YY'),
        time: date.format('h:mm A'),
        location: screening.VenueName,
      }
      outputShowings.push(showing)
    }
  })

  return outputShowings
}

async function main() {
  const filmsPage = fs.readFileSync('films.html', 'utf8')
  const allFilms = topLevel(filmsPage)
  const transformedFilms = []
  for (let i = 0; i < allFilms.length; i++) {
    const film = allFilms[i]
    const resp = await axios.get(`https://siff.net${film.link}`)
    const showings = individual(resp.data)
    film.showings = showings
    transformedFilms.push(film)
  }
  fs.writeFileSync('complete.json', JSON.stringify(transformedFilms))
}

main()
  .then(() => { })
  .catch((err) => { console.log(err) })
