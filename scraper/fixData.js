import fs from 'fs'

const uptown = 'SIFF Cinema Uptown'
const amc = 'AMC Pacific Place'
const shoreline = 'Shoreline CC Theater'

const source = JSON.parse(fs.readFileSync('src/complete.json', 'utf8'))
const output = source.map((film) => {
  film.link = `https://www.siff.net${film.link}`
  film.showings = film.showings.map((show) => {
    if (show.location.includes(uptown)) {
      show.location = uptown 
    } else if (show.location.includes(amc)) {
      show.location = amc
    } else if (show.location.includes(shoreline)) {
      show.location = shoreline
    }

    return show
  })

  return film
})

fs.writeFileSync('complete-updated.json', JSON.stringify(output))

