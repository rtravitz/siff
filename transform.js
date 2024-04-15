import fs from 'fs'

const buf = fs.readFileSync('src/test-showings.json', 'utf8')
const parsed = JSON.parse(buf)
const result = parsed.reduce((output, current) => {
  if (!output[current.title]) {
    output[current.title] = {
      title: current.title,
      showings: [],
    }
  }

  output[current.title].showings.push({
    date: current.date,
    time: current.time,
    location: current.location,
  })

  return output
}, {})

const keys = Object.keys(result)
const arrResult = keys.map(k => result[k]).sort((a, b) => {
  if (a.title < b.title) {
    return -1
  } else if (a.title > b.title) {
    return 1
  } 

  return 0
})

console.log(JSON.stringify(arrResult))
