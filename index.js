import jsdom from 'jsdom'
import fs from 'fs'


function topLevel() {
  const filmsPage = fs.readFileSync('films.html', 'utf8')

  const filmsDom = new jsdom.JSDOM(filmsPage)

  const filmElems = filmsDom.window.document.querySelectorAll('.filtered-index > div > p > a')
  filmElems.forEach(film => {
    console.log('---------------------')
    film.childNodes.forEach(child => {
      if (child.tagName === 'SPAN') {
        child.childNodes.forEach(doubleChild => {
          if (doubleChild.tagName === 'SPAN' && doubleChild.getAttribute('class') === 'title') {
            console.log(doubleChild.textContent)
          }
        })
      }
    })

    console.log(film.getAttribute('href'))
  })
}

function individual() {
  const filmPage = fs.readFileSync('agra.html', 'utf8')

  const filmDom = new jsdom.JSDOM(filmPage)

  const dates = filmDom.window.document.querySelectorAll('.screenings p')
  dates.forEach(date => {
    if (!date.textContent.includes('-')) {
      console.log(date.textContent)
    }
  })


  const showtimes = filmDom.window.document.querySelectorAll('.showtimes a > span.dark-gray-text')
  showtimes.forEach(st => {
    console.log(st.textContent.trim())
  })
}

individual()
