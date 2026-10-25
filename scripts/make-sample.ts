import writeXlsxFile from 'write-excel-file/node'

// A pool of categories (5 clues each, easiest to hardest); the game layout below picks 12 of them.
const pool: [string, [string, string][]][][] = [
  [
    ['Geography', [
      ['The longest river in Africa', 'The Nile'],
      ['The largest ocean on Earth', 'The Pacific Ocean'],
      ['The tallest mountain above sea level', 'Mount Everest'],
      ['The most populous country in the world as of 2023', 'India'],
      ['The largest hot desert in the world', 'The Sahara'],
    ]],
    ['Science', [
      ['H2O is the chemical formula for this', 'Water'],
      ['The planet closest to the Sun', 'Mercury'],
      ['This organelle is known as the powerhouse of the cell', 'Mitochondria'],
      ['The chemical symbol Au stands for this element', 'Gold'],
      ['Light travels at about this many kilometers per second', '300,000'],
    ]],
    ['Movies', [
      ['The toy cowboy in Pixar\'s Toy Story', 'Woody'],
      ['Dorothy\'s dog in The Wizard of Oz', 'Toto'],
      ['This 1997 film features Jack and Rose aboard a doomed ship', 'Titanic'],
      ['He directed Jaws and E.T.', 'Steven Spielberg'],
      ['This 1994 Best Picture winner says "Life is like a box of chocolates"', 'Forrest Gump'],
    ]],
    ['Food & Drink', [
      ['The main ingredient in guacamole', 'Avocado'],
      ['This Italian dish layers pasta sheets with meat sauce and cheese', 'Lasagna'],
      ['Japanese dish of vinegared rice with raw fish', 'Sushi'],
      ['Fermented cabbage dish that is a staple of Korea', 'Kimchi'],
      ['The world\'s most expensive spice by weight, from crocus flowers', 'Saffron'],
    ]],
    ['Animals', [
      ['The largest land animal', 'The African elephant'],
      ['A baby kangaroo is called this', 'A joey'],
      ['The fastest land animal', 'The cheetah'],
      ['The only mammal capable of true flight', 'The bat'],
      ['An octopus has this many hearts', 'Three'],
    ]],
  ],
  [
    ['US History', [
      ['The first president of the United States', 'George Washington'],
      ['The Declaration of Independence was signed in this year', '1776'],
      ['He appears on the $5 bill', 'Abraham Lincoln'],
      ['The 1803 deal that doubled the size of the US', 'The Louisiana Purchase'],
      ['This amendment abolished slavery', 'The 13th Amendment'],
    ]],
    ['Music', [
      ['A standard guitar has this many strings', 'Six'],
      ['The "King of Pop"', 'Michael Jackson'],
      ['The band of John Lennon and Paul McCartney', 'The Beatles'],
      ['Queen\'s 1975 rock-opera single', 'Bohemian Rhapsody'],
      ['This composer wrote his Ninth Symphony while almost completely deaf', 'Ludwig van Beethoven'],
    ]],
    ['Literature', [
      ['The author of the Harry Potter books', 'J.K. Rowling'],
      ['Shakespeare\'s tragedy about the Prince of Denmark', 'Hamlet'],
      ['Captain Ahab hunts this in Moby-Dick', 'A white whale'],
      ['The author of Pride and Prejudice', 'Jane Austen'],
      ['George Orwell\'s novel featuring Big Brother', '1984'],
    ]],
    ['Sports', [
      ['The sport played at Wimbledon', 'Tennis'],
      ['A soccer team has this many players on the field', 'Eleven'],
      ['The Olympic flag has this many rings', 'Five'],
      ['The ancient Olympic Games originated in this country', 'Greece'],
      ['The winner of the 2022 FIFA World Cup', 'Argentina'],
    ]],
    ['Space', [
      ['The galaxy that contains our solar system', 'The Milky Way'],
      ['The "Red Planet"', 'Mars'],
      ['The largest planet in our solar system', 'Jupiter'],
      ['The first human to walk on the Moon', 'Neil Armstrong'],
      ['Apollo 11 landed on the Moon in this year', '1969'],
    ]],
  ],
  [
    ['World Capitals', [
      ['France', 'Paris'],
      ['Japan', 'Tokyo'],
      ['Canada', 'Ottawa'],
      ['Australia', 'Canberra'],
      ['Brazil', 'Brasília'],
    ]],
    ['Human Body', [
      ['The organ that pumps blood around the body', 'The heart'],
      ['The largest organ of the human body', 'The skin'],
      ['Your skin makes this vitamin when exposed to sunlight', 'Vitamin D'],
      ['An adult human has this many bones', '206'],
      ['The smallest bone in the body, found in the ear', 'The stapes'],
    ]],
    ['TV', [
      ['The yellow-skinned family from Springfield', 'The Simpsons'],
      ['Sitcom about Ross, Rachel, Monica, Chandler, Joey and Phoebe', 'Friends'],
      ['Fantasy series about the fight for the Iron Throne', 'Game of Thrones'],
      ['Chemistry teacher Walter White stars in this series', 'Breaking Bad'],
      ['Korean series where contestants in green tracksuits play deadly games', 'Squid Game'],
    ]],
    ['Inventions', [
      ['He is credited with inventing the telephone', 'Alexander Graham Bell'],
      ['He developed the first commercially practical light bulb', 'Thomas Edison'],
      ['Alexander Fleming discovered this antibiotic in 1928', 'Penicillin'],
      ['Johannes Gutenberg invented this in the 15th century', 'The printing press'],
      ['The Wright brothers\' first flight took place near this North Carolina town', 'Kitty Hawk'],
    ]],
    ['Mythology', [
      ['The king of the Greek gods', 'Zeus'],
      ['The Norse god of thunder', 'Thor'],
      ['The Roman name for the Greek god Poseidon', 'Neptune'],
      ['The jackal-headed Egyptian god of embalming', 'Anubis'],
      ['The hero who slew Medusa', 'Perseus'],
    ]],
  ],
  [
    ['Languages', [
      ['"Hola" means hello in this language', 'Spanish'],
      ['"Danke" means thank you in this language', 'German'],
      ['The language of ancient Rome', 'Latin'],
      ['The script used to write Russian', 'Cyrillic'],
      ['The most spoken native language in the world', 'Mandarin Chinese'],
    ]],
    ['Math', [
      ['7 x 8', '56'],
      ['The square root of 144', '12'],
      ['Pi to two decimal places', '3.14'],
      ['The interior angles of a triangle add up to this many degrees', '180'],
      ['The name for the number 1 followed by 100 zeros', 'A googol'],
    ]],
    ['Art', [
      ['He painted the Mona Lisa', 'Leonardo da Vinci'],
      ['He painted The Starry Night', 'Vincent van Gogh'],
      ['The Paris museum that houses the Mona Lisa', 'The Louvre'],
      ['The Spanish artist who co-founded Cubism', 'Pablo Picasso'],
      ['Michelangelo painted the ceiling of this chapel', 'The Sistine Chapel'],
    ]],
    ['Tech', [
      ['The company that makes the iPhone', 'Apple'],
      ['He co-founded Microsoft with Paul Allen', 'Bill Gates'],
      ['CPU stands for this', 'Central Processing Unit'],
      ['Binary digits, 0 and 1, are called this', 'Bits'],
      ['Linus Torvalds created this open-source operating system kernel', 'Linux'],
    ]],
    ['Famous Firsts', [
      ['The first woman to fly solo across the Atlantic', 'Amelia Earhart'],
      ['The first artificial satellite, launched in 1957', 'Sputnik'],
      ['The first woman to win a Nobel Prize', 'Marie Curie'],
      ['He led the first expedition to reach the South Pole in 1911', 'Roald Amundsen'],
      ['The first US president to live in the White House', 'John Adams'],
    ]],
  ],
]

const categories = new Map(pool.flat())

// Like the real game: 2 rounds of 6 categories x 5 clues, then Final Jeopardy.
const rounds = [
  ['Geography', 'Science', 'Movies', 'Food & Drink', 'Animals', 'Music'],
  ['US History', 'Literature', 'Space', 'Mythology', 'Art', 'Inventions'],
].map((names) => names.map((name) => [name, categories.get(name)!] as const))

// Values double in Double Jeopardy! (round 2).
// Daily Doubles: one in round 1, two in round 2, as `round|category|clue number`.
const dailyDoubles = new Set(['1|Movies|4', '2|Literature|4', '2|Space|5'])

const rows: (string | number)[][] = [['Round', 'Category', 'Value', 'Clue', 'Answer', 'Daily Double']]
rounds.forEach((roundCategories, r) => {
  const round = r + 1
  const step = round === 2 ? 200 : 100
  for (const [category, clues] of roundCategories) {
    clues.forEach(([clue, answer], i) => {
      rows.push([round, category, step * (i + 1), clue, answer, dailyDoubles.has(`${round}|${category}|${i + 1}`) ? 'yes' : ''])
    })
  }
})
rows.push(['Final', 'Seas', '', 'This sea has no coastline; it is defined by ocean currents rather than land', 'The Sargasso Sea', ''])

await writeXlsxFile(rows, { columns: [{ width: 8 }, { width: 18 }, { width: 8 }, { width: 70 }, { width: 30 }, { width: 13 }] }).toFile('public/sample-questions.xlsx')
console.log(`Wrote ${rows.length - 1} rows to public/sample-questions.xlsx`)
