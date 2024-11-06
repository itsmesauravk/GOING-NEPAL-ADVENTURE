//Trekking

interface TrekHighlight {
  content: string
  links: Array<{
    text: string
    url: string
  }>
}

interface Itinerary {
  day: number
  title: string
  description: string
  links: Array<{
    text: string
    url: string
  }>
}

interface PackingList {
  general: string[]
  clothes: string[]
  firstAid: string[]
  otherEssentials: string[]
}

interface FAQ {
  question: string
  answer: string
}
