(() => {
  "use strict";

  initVercelAnalytics();

  const page = document.body.dataset.page || "home";

  const defaultMovies = [
    { title: "Inception", year: 2010, genres: ["Sci-Fi", "Thriller", "Action"], cast: ["Leonardo DiCaprio", "Tom Hardy"], popularity: 96, clue: "A mind-bending heist inside dreams." },
    { title: "Titanic", year: 1997, genres: ["Romance", "Drama"], cast: ["Leonardo DiCaprio", "Kate Winslet"], popularity: 98, clue: "A romance set on an infamous voyage." },
    { title: "The Wolf of Wall Street", year: 2013, genres: ["Comedy", "Crime", "Drama"], cast: ["Leonardo DiCaprio", "Jonah Hill"], popularity: 91, clue: "Excess, fraud, and a very loud sales pitch." },
    { title: "Once Upon a Time in Hollywood", year: 2019, genres: ["Comedy", "Drama"], cast: ["Leonardo DiCaprio", "Brad Pitt"], popularity: 82, clue: "An actor and his stunt double roam late-60s LA." },
    { title: "Django Unchained", year: 2012, genres: ["Action", "Drama"], cast: ["Jamie Foxx", "Leonardo DiCaprio", "Samuel L. Jackson"], popularity: 86, clue: "A bounty hunter teams up with a freed slave." },
    { title: "Fight Club", year: 1999, genres: ["Drama", "Thriller"], cast: ["Brad Pitt", "Edward Norton"], popularity: 95, clue: "The first rule is usually not discussed." },
    { title: "Se7en", year: 1995, genres: ["Crime", "Thriller", "Mystery"], cast: ["Brad Pitt", "Morgan Freeman"], popularity: 93, clue: "Two detectives chase a killer inspired by sins." },
    { title: "Moneyball", year: 2011, genres: ["Drama"], cast: ["Brad Pitt", "Jonah Hill"], popularity: 84, clue: "Baseball math changes team strategy." },
    { title: "Mr. & Mrs. Smith", year: 2005, genres: ["Action", "Comedy", "Romance"], cast: ["Brad Pitt", "Angelina Jolie"], popularity: 78, clue: "Married assassins discover each other's secret." },
    { title: "Burn After Reading", year: 2008, genres: ["Comedy", "Crime"], cast: ["Brad Pitt", "George Clooney"], popularity: 73, clue: "Chaotic blackmail from misunderstood intel files." },
    { title: "Bullet Train", year: 2022, genres: ["Action", "Comedy", "Thriller"], cast: ["Brad Pitt", "Joey King"], popularity: 77, clue: "Assassins collide on a very fast train." },
    { title: "Lost in Translation", year: 2003, genres: ["Drama", "Romance"], cast: ["Scarlett Johansson", "Bill Murray"], popularity: 83, clue: "Two strangers connect in Tokyo." },
    { title: "Avengers: Endgame", year: 2019, genres: ["Action", "Sci-Fi", "Adventure"], cast: ["Scarlett Johansson", "Robert Downey Jr.", "Samuel L. Jackson"], popularity: 99, clue: "A universe-level final stand after a snap." },
    { title: "Lucy", year: 2014, genres: ["Action", "Sci-Fi", "Thriller"], cast: ["Scarlett Johansson", "Morgan Freeman"], popularity: 76, clue: "A drug turns a woman into a super-intellect." },
    { title: "Marriage Story", year: 2019, genres: ["Drama"], cast: ["Scarlett Johansson", "Adam Driver"], popularity: 79, clue: "A painful modern divorce unfolds in detail." },
    { title: "Jojo Rabbit", year: 2019, genres: ["Comedy", "Drama"], cast: ["Scarlett Johansson", "Roman Griffin Davis"], popularity: 74, clue: "A boy's imaginary friend has a dark identity." },
    { title: "Forrest Gump", year: 1994, genres: ["Drama", "Romance"], cast: ["Tom Hanks", "Robin Wright"], popularity: 97, clue: "A simple man witnesses key moments of US history." },
    { title: "Cast Away", year: 2000, genres: ["Drama", "Adventure"], cast: ["Tom Hanks"], popularity: 88, clue: "A man survives alone on an island with a volleyball." },
    { title: "Saving Private Ryan", year: 1998, genres: ["Drama", "Action"], cast: ["Tom Hanks", "Matt Damon"], popularity: 90, clue: "A squad searches behind enemy lines." },
    { title: "The Post", year: 2017, genres: ["Drama"], cast: ["Tom Hanks", "Meryl Streep"], popularity: 72, clue: "Journalists publish leaked government papers." },
    { title: "The Terminal", year: 2004, genres: ["Comedy", "Drama", "Romance"], cast: ["Tom Hanks", "Catherine Zeta-Jones"], popularity: 70, clue: "A traveler gets stuck in an airport indefinitely." },
    { title: "The Devil Wears Prada", year: 2006, genres: ["Comedy", "Drama"], cast: ["Meryl Streep", "Anne Hathaway"], popularity: 89, clue: "Fashion publishing runs on impossible demands." },
    { title: "Mamma Mia!", year: 2008, genres: ["Comedy", "Romance"], cast: ["Meryl Streep", "Amanda Seyfried"], popularity: 81, clue: "A Greek island wedding with ABBA songs." },
    { title: "Kramer vs. Kramer", year: 1979, genres: ["Drama"], cast: ["Meryl Streep", "Dustin Hoffman"], popularity: 67, clue: "A custody battle changes a family." },
    { title: "The Iron Lady", year: 2011, genres: ["Drama"], cast: ["Meryl Streep"], popularity: 64, clue: "A portrayal of a powerful UK prime minister." },
    { title: "The Intern", year: 2015, genres: ["Comedy", "Drama"], cast: ["Anne Hathaway", "Robert De Niro"], popularity: 75, clue: "A startup founder hires a senior intern." },
    { title: "Les Miserables", year: 2012, genres: ["Drama", "Romance"], cast: ["Anne Hathaway", "Hugh Jackman"], popularity: 78, clue: "French revolution-era musical adaptation." },
    { title: "Interstellar", year: 2014, genres: ["Sci-Fi", "Adventure", "Drama"], cast: ["Matthew McConaughey", "Anne Hathaway", "Matt Damon"], popularity: 95, clue: "Astronauts search for humanity's new home." },
    { title: "Ocean's Eight", year: 2018, genres: ["Crime", "Comedy"], cast: ["Sandra Bullock", "Cate Blanchett", "Anne Hathaway"], popularity: 72, clue: "A glamorous Met Gala heist." },
    { title: "La La Land", year: 2016, genres: ["Romance", "Drama", "Comedy"], cast: ["Emma Stone", "Ryan Gosling"], popularity: 88, clue: "Love and ambition collide in Los Angeles." },
    { title: "Easy A", year: 2010, genres: ["Comedy", "Romance"], cast: ["Emma Stone"], popularity: 74, clue: "A rumor-fueled high school reputation spiral." },
    { title: "Cruella", year: 2021, genres: ["Comedy", "Crime"], cast: ["Emma Stone"], popularity: 73, clue: "A fashion antihero origin story." },
    { title: "Barbie", year: 2023, genres: ["Comedy", "Fantasy"], cast: ["Margot Robbie", "Ryan Gosling"], popularity: 94, clue: "A doll leaves perfect plastic life for the real world." },
    { title: "Drive", year: 2011, genres: ["Crime", "Drama", "Thriller"], cast: ["Ryan Gosling", "Carey Mulligan"], popularity: 80, clue: "A stunt driver moonlights as a getaway specialist." },
    { title: "Blade Runner 2049", year: 2017, genres: ["Sci-Fi", "Thriller"], cast: ["Ryan Gosling", "Harrison Ford"], popularity: 87, clue: "A replicant hunter uncovers a buried secret." },
    { title: "The Gray Man", year: 2022, genres: ["Action", "Thriller"], cast: ["Ryan Gosling", "Chris Evans"], popularity: 69, clue: "A CIA operative becomes a target." },
    { title: "The Notebook", year: 2004, genres: ["Romance", "Drama"], cast: ["Ryan Gosling", "Rachel McAdams"], popularity: 86, clue: "A long summer love survives decades." },
    { title: "The Matrix", year: 1999, genres: ["Sci-Fi", "Action"], cast: ["Keanu Reeves", "Carrie-Anne Moss"], popularity: 96, clue: "Reality is not what it seems." },
    { title: "John Wick", year: 2014, genres: ["Action", "Thriller", "Crime"], cast: ["Keanu Reeves"], popularity: 92, clue: "A retired assassin returns for revenge." },
    { title: "Speed", year: 1994, genres: ["Action", "Thriller"], cast: ["Keanu Reeves", "Sandra Bullock"], popularity: 85, clue: "A city bus cannot drop below 50 mph." },
    { title: "The Lake House", year: 2006, genres: ["Romance", "Drama"], cast: ["Keanu Reeves", "Sandra Bullock"], popularity: 66, clue: "Two people fall in love across time by mail." },
    { title: "Black Swan", year: 2010, genres: ["Drama", "Thriller"], cast: ["Natalie Portman"], popularity: 84, clue: "Perfection in ballet turns psychologically dark." },
    { title: "V for Vendetta", year: 2005, genres: ["Action", "Thriller"], cast: ["Natalie Portman", "Hugo Weaving"], popularity: 82, clue: "A masked rebel fights authoritarian rule." },
    { title: "Pulp Fiction", year: 1994, genres: ["Crime", "Drama"], cast: ["Samuel L. Jackson", "John Travolta"], popularity: 97, clue: "Intertwined LA crime stories told out of order." },
    { title: "Training Day", year: 2001, genres: ["Crime", "Thriller", "Drama"], cast: ["Denzel Washington", "Ethan Hawke"], popularity: 89, clue: "A rookie cop's first day goes very wrong." },
    { title: "The Equalizer", year: 2014, genres: ["Action", "Thriller"], cast: ["Denzel Washington"], popularity: 79, clue: "A quiet man brings violent justice." },
    { title: "American Gangster", year: 2007, genres: ["Crime", "Drama"], cast: ["Denzel Washington", "Russell Crowe"], popularity: 77, clue: "A Harlem drug kingpin builds an empire." },
    { title: "The Dark Knight", year: 2008, genres: ["Action", "Crime", "Drama"], cast: ["Christian Bale", "Heath Ledger"], popularity: 99, clue: "A vigilante faces a chaotic criminal mastermind." },
    { title: "The Prestige", year: 2006, genres: ["Drama", "Mystery", "Thriller"], cast: ["Christian Bale", "Hugh Jackman"], popularity: 85, clue: "Rival magicians take obsession too far." },
    { title: "The Big Short", year: 2015, genres: ["Comedy", "Drama"], cast: ["Christian Bale", "Brad Pitt", "Ryan Gosling"], popularity: 83, clue: "Investors bet against the housing market." },
    { title: "The Bourne Identity", year: 2002, genres: ["Action", "Thriller"], cast: ["Matt Damon"], popularity: 86, clue: "An amnesiac discovers elite combat skills." },
    { title: "The Martian", year: 2015, genres: ["Sci-Fi", "Adventure"], cast: ["Matt Damon"], popularity: 88, clue: "An astronaut tries to survive alone on Mars." },
    { title: "Ocean's Eleven", year: 2001, genres: ["Crime", "Comedy"], cast: ["Matt Damon", "Brad Pitt", "George Clooney"], popularity: 90, clue: "An elegant Vegas casino heist." },
    { title: "Goodfellas", year: 1990, genres: ["Crime", "Drama"], cast: ["Robert De Niro", "Ray Liotta"], popularity: 94, clue: "Rise and fall of a mob insider." },
    { title: "Heat", year: 1995, genres: ["Crime", "Thriller", "Action"], cast: ["Robert De Niro", "Al Pacino"], popularity: 91, clue: "A cop and thief mirror each other in LA." },
    { title: "Taxi Driver", year: 1976, genres: ["Crime", "Drama"], cast: ["Robert De Niro", "Jodie Foster"], popularity: 87, clue: "An isolated veteran spirals in New York." },
    { title: "The Shawshank Redemption", year: 1994, genres: ["Drama", "Crime"], cast: ["Morgan Freeman", "Tim Robbins"], popularity: 99, clue: "Hope survives decades behind bars." },
    { title: "Carol", year: 2015, genres: ["Romance", "Drama"], cast: ["Cate Blanchett", "Rooney Mara"], popularity: 65, clue: "A forbidden love in the 1950s." },
    { title: "The Aviator", year: 2004, genres: ["Drama"], cast: ["Leonardo DiCaprio", "Cate Blanchett"], popularity: 75, clue: "A film mogul and aviation pioneer battles OCD." },
    { title: "Joker", year: 2019, genres: ["Crime", "Drama", "Thriller"], cast: ["Joaquin Phoenix"], popularity: 93, clue: "A failed comedian descends into chaos." },
    { title: "Gladiator", year: 2000, genres: ["Action", "Drama"], cast: ["Russell Crowe", "Joaquin Phoenix"], popularity: 92, clue: "A betrayed general seeks revenge in Rome." },
    { title: "Gravity", year: 2013, genres: ["Sci-Fi", "Thriller"], cast: ["Sandra Bullock", "George Clooney"], popularity: 82, clue: "Two astronauts fight to return to Earth." },
    { title: "Bird Box", year: 2018, genres: ["Thriller", "Drama"], cast: ["Sandra Bullock"], popularity: 71, clue: "Seeing the wrong thing can kill instantly." },
    { title: "The Blind Side", year: 2009, genres: ["Drama"], cast: ["Sandra Bullock"], popularity: 76, clue: "A family helps a future football star." },
    { title: "The Proposal", year: 2009, genres: ["Romance", "Comedy"], cast: ["Sandra Bullock", "Ryan Reynolds"], popularity: 80, clue: "A fake engagement with real consequences." },
    { title: "Gone Girl", year: 2014, genres: ["Thriller", "Mystery", "Drama"], cast: ["Ben Affleck", "Rosamund Pike"], popularity: 87, clue: "A missing spouse case turns media-toxic." },
    { title: "Shutter Island", year: 2010, genres: ["Thriller", "Mystery"], cast: ["Leonardo DiCaprio", "Mark Ruffalo"], popularity: 88, clue: "A US marshal investigates a remote asylum." },
    { title: "The Sixth Sense", year: 1999, genres: ["Mystery", "Thriller", "Drama"], cast: ["Bruce Willis", "Haley Joel Osment"], popularity: 89, clue: "A child says he sees dead people." },
    { title: "American Beauty", year: 1999, genres: ["Drama"], cast: ["Kevin Spacey", "Annette Bening"], popularity: 78, clue: "A suburban midlife crisis shatters appearances." },
    { title: "Apollo 13", year: 1995, genres: ["Drama", "Adventure"], cast: ["Tom Hanks", "Kevin Bacon"], popularity: 81, clue: "NASA races to bring astronauts home alive." },
    { title: "The Italian Job", year: 2003, genres: ["Action", "Crime", "Thriller"], cast: ["Mark Wahlberg", "Charlize Theron"], popularity: 72, clue: "A gold-heist crew seeks payback." },
    { title: "Chicago", year: 2002, genres: ["Drama", "Comedy", "Romance"], cast: ["Renee Zellweger", "Catherine Zeta-Jones"], popularity: 68, clue: "A stage musical set in roaring-20s scandal." },
    { title: "American Psycho", year: 2000, genres: ["Crime", "Thriller", "Drama"], cast: ["Christian Bale"], popularity: 84, clue: "A Wall Street banker hides a violent double life." }
  ];

  const fullCatalogMovies = resolveCatalogMovies(defaultMovies, window.CINECLASH_CATALOG);
  const rankedMoviesByPoolPriority = fullCatalogMovies.slice().sort(compareMoviesByDifficultyScore);

  const urlParams = new URLSearchParams(window.location.search);
  const dayOverride = parseDayOverride(urlParams.get("day"));
  const variantOverride = parseVariantOverride(urlParams.get("variant"));
  const difficultyFromUrl = parseDifficulty(urlParams.get("difficulty"));
  const storedDifficulty = parseDifficulty(readLocalStorageSafe("cineclash-difficulty-v1"));
  const difficulty = difficultyFromUrl || storedDifficulty || "medium";
  writeLocalStorageSafe("cineclash-difficulty-v1", difficulty);

  const movies = resolveDifficultyMoviePool(rankedMoviesByPoolPriority, difficulty);

  const gridTemplates = [
    { rows: ["Leonardo DiCaprio", "Scarlett Johansson", "Brad Pitt"], cols: ["Drama", "Action", "Comedy"] },
    { rows: ["Tom Hanks", "Meryl Streep", "Anne Hathaway"], cols: ["Drama", "Romance", "Comedy"] },
    { rows: ["Ryan Gosling", "Keanu Reeves", "Sandra Bullock"], cols: ["Action", "Thriller", "Romance"] },
    { rows: ["Christian Bale", "Matt Damon", "Denzel Washington"], cols: ["Drama", "Action", "Crime"] }
  ];

  const fallbackConnectionsPuzzles = [
    {
      title: "Classic Categories",
      groups: [
        { name: "Sci-Fi Movies", items: ["Inception", "The Matrix", "Interstellar", "Blade Runner 2049"] },
        { name: "Crime Dramas", items: ["Goodfellas", "Heat", "Training Day", "Pulp Fiction"] },
        { name: "Romance Titles", items: ["Titanic", "La La Land", "The Notebook", "The Proposal"] },
        { name: "Comedy Picks", items: ["Barbie", "The Intern", "Burn After Reading", "Mamma Mia!"] }
      ]
    },
    {
      title: "By Lead Actor",
      groups: [
        { name: "Keanu Reeves Films", items: ["The Matrix", "John Wick", "Speed", "The Lake House"] },
        { name: "Brad Pitt Films", items: ["Fight Club", "Se7en", "Moneyball", "Bullet Train"] },
        { name: "Meryl Streep Films", items: ["Mamma Mia!", "The Post", "The Iron Lady", "Kramer vs. Kramer"] },
        { name: "Sandra Bullock Films", items: ["Gravity", "The Proposal", "Bird Box", "Ocean's Eight"] }
      ]
    },
    {
      title: "Theme Night",
      groups: [
        { name: "1999 Releases", items: ["Fight Club", "The Matrix", "The Sixth Sense", "American Beauty"] },
        { name: "Space Stories", items: ["Gravity", "Interstellar", "The Martian", "Apollo 13"] },
        { name: "Musicals", items: ["La La Land", "Mamma Mia!", "Les Miserables", "Chicago"] },
        { name: "One-Word Titles", items: ["Joker", "Lucy", "Drive", "Gladiator"] }
      ]
    },
    {
      title: "Nerdy Buckets",
      groups: [
        { name: "Heist Movies", items: ["Ocean's Eleven", "Inception", "The Italian Job", "Now You See Me"] },
        { name: "Psychological Thrillers", items: ["Black Swan", "Gone Girl", "Shutter Island", "Fight Club"] },
        { name: "Biographical Stories", items: ["The Aviator", "Moneyball", "The Iron Lady", "The Wolf of Wall Street"] },
        { name: "Has A Number", items: ["Se7en", "Blade Runner 2049", "Ocean's Eight", "Apollo 13"] }
      ]
    },
    {
      title: "Actor Mania",
      groups: [
        { name: "Oscar-Winning Actresses", items: ["Meryl Streep", "Emma Stone", "Natalie Portman", "Cate Blanchett"] },
        { name: "Played Batman", items: ["Christian Bale", "Ben Affleck", "Michael Keaton", "Robert Pattinson"] },
        { name: "Action Franchise Leads", items: ["Keanu Reeves", "Matt Damon", "Denzel Washington", "Tom Cruise"] },
        { name: "Scorsese Collaborators", items: ["Leonardo DiCaprio", "Robert De Niro", "Joe Pesci", "Harvey Keitel"] }
      ]
    }
  ];

  const fallbackPlotlePool = [
    "Inception",
    "Titanic",
    "The Matrix",
    "The Dark Knight",
    "Interstellar",
    "La La Land",
    "Pulp Fiction",
    "The Shawshank Redemption",
    "Fight Club",
    "Joker",
    "Gladiator",
    "The Martian",
    "Goodfellas",
    "The Wolf of Wall Street",
    "The Prestige",
    "The Proposal"
  ];

  const movieMap = new Map(movies.map((movie) => [normalize(movie.title), movie]));
  const actorNameMap = new Map();
  const actorFrequency = new Map();

  movies.forEach((movie) => {
    [...new Set(movie.cast)].forEach((actor) => {
      const key = normalize(actor);
      if (!key) return;
      if (!actorNameMap.has(key)) actorNameMap.set(key, actor);
      actorFrequency.set(key, (actorFrequency.get(key) || 0) + 1);
    });
  });

  const actorOptions = [...actorNameMap.values()].sort((a, b) => a.localeCompare(b));

  const today = dayOverride ? dateFromKey(dayOverride) : new Date();
  const todayKey = formatDateKey(today);
  const seedBase = `${todayKey}|${difficulty}`;
  const seedKey = variantOverride ? `${seedBase}|${variantOverride}` : seedBase;
  const prettyDateBase = today.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  const prettyDate = dayOverride || variantOverride ? `${prettyDateBase} (test)` : prettyDateBase;
  const daySeed = hashString(seedKey);
  const gameKeys = ["grid", "connections", "plotle", "moviedle", "impostor", "impostorCast"];
  const totalGameCount = gameKeys.length;
  const gameLabels = {
    grid: "Movie Grid",
    connections: "Cast Connections",
    plotle: "Plotle",
    moviedle: "Moviedle",
    impostor: "Spotlight",
    impostorCast: "Impostor"
  };

  let gridTemplate = buildDailyGridTemplate(movies, daySeed, gridTemplates);
  let gridPuzzle = buildGridPuzzle(gridTemplate);
  if (!gridPuzzle.valid) {
    const emergencyTemplate = buildEmergencyGridTemplate(movies);
    if (emergencyTemplate) {
      gridTemplate = emergencyTemplate;
      gridPuzzle = buildGridPuzzle(gridTemplate);
    }
  }
  const gridSignature = buildGridSignature(gridPuzzle);
  const connectionsPuzzle =
    buildDailyConnectionsPuzzle(movies, daySeed) || fallbackConnectionsPuzzles[Math.floor(daySeed / 11) % fallbackConnectionsPuzzles.length];
  const plotlePool = movies.length >= 12 ? movies.map((movie) => movie.title) : fallbackPlotlePool;
  const plotleTarget = movieMap.get(normalize(plotlePool[Math.floor(daySeed / 7) % plotlePool.length]));
  const moviedleBuckets = movies.reduce((acc, movie) => {
    const len = titleLetters(movie.title).length;
    if (len < 4 || len > 12) return acc;
    if (!acc[len]) acc[len] = [];
    acc[len].push(movie);
    return acc;
  }, {});
  const moviedlePool = Object.values(moviedleBuckets)
    .filter((bucket) => bucket.length >= 4)
    .flat();
  const moviedleFallbackPool = movies.filter((movie) => {
    const len = titleLetters(movie.title).length;
    return len >= 4 && len <= 12;
  });
  const moviedleCandidates = moviedlePool.length > 0 ? moviedlePool : moviedleFallbackPool.length > 0 ? moviedleFallbackPool : movies;
  const moviedleTarget = moviedleCandidates[Math.floor(daySeed / 5) % moviedleCandidates.length] || movies[0];
  const moviedleTargetLetters = titleLetters(moviedleTarget ? moviedleTarget.title : "");
  const impostorPuzzle = buildDailyImpostorPuzzle(movies, daySeed) || buildDailyImpostorPuzzle(defaultMovies, daySeed);
  const impostorSignature = buildImpostorSignature(impostorPuzzle);
  const impostorCastPuzzle = buildDailyImpostorCastPuzzle(movies, daySeed) || buildDailyImpostorCastPuzzle(defaultMovies, daySeed);
  const impostorCastSignature = buildImpostorCastSignature(impostorCastPuzzle);
  let moviedleDraft = "";
  const connectionsItems = buildConnectionsItems(connectionsPuzzle, `${seedKey}-connections`);
  const connectionItemByIndex = new Map(connectionsItems.map((item, idx) => [idx, item]));

  if (!gridPuzzle.valid || !plotleTarget || !moviedleTarget || !moviedleTargetLetters || !impostorPuzzle || !impostorCastPuzzle) {
    throw new Error("Daily puzzle generation failed.");
  }

  const profileKey = "cineclash-profile-v1";
  const dailyBaseKey = `cineclash-day-v2-${difficulty}-${todayKey}`;
  const dailyKey = variantOverride ? `${dailyBaseKey}-${variantOverride}` : dailyBaseKey;

  const defaultProfile = {
    xp: 0,
    referralCode: buildReferralCode(daySeed),
    referrals: [],
    streak: 0,
    longestStreak: 0,
    lastCompleteDate: "",
    gameStats: {}
  };

  const defaultDaily = {
    grid: {
      answers: Array(9).fill(""),
      attemptsLeft: 12,
      selectedIndex: -1,
      score: 0,
      status: "playing",
      wrongPulse: -1,
      signature: gridSignature
    },
    connections: {
      selected: [],
      solvedGroupIds: [],
      revealedGroupIds: [],
      mistakes: 0,
      history: [],
      score: 0,
      status: "playing"
    },
    plotle: {
      guesses: [],
      score: 0,
      status: "playing"
    },
    moviedle: {
      guesses: [],
      score: 0,
      status: "playing",
      revealedAnswer: false
    },
    impostor: {
      roundIndex: 0,
      selectedIndex: -1,
      solvedRounds: [],
      history: [],
      score: 0,
      status: "playing",
      feedback: null,
      signature: impostorSignature
    },
    impostorCast: {
      selected: [],
      lockedCorrect: [],
      wrongSelection: [],
      history: [],
      attempts: 0,
      score: 0,
      status: "playing",
      signature: impostorCastSignature
    },
    gamesCompleted: [],
    rewardsGiven: false,
    streakCredited: false
  };

  const profile = loadStore(profileKey, defaultProfile);
  const daily = loadStore(dailyKey, defaultDaily);

  if (!profile.referralCode || typeof profile.referralCode !== "string") {
    profile.referralCode = buildReferralCode(daySeed);
  }
  profile.gameStats = normalizeGameStats(profile.gameStats);
  if (!Array.isArray(profile.referrals)) {
    profile.referrals = [];
  }
  if (!Array.isArray(daily.grid.answers) || daily.grid.answers.length !== 9) {
    daily.grid.answers = Array(9).fill("");
  }
  if (daily.grid.signature !== gridSignature) {
    daily.grid = {
      answers: Array(9).fill(""),
      attemptsLeft: 12,
      selectedIndex: -1,
      score: 0,
      status: "playing",
      wrongPulse: -1,
      signature: gridSignature
    };
  } else if (typeof daily.grid.signature !== "string") {
    daily.grid.signature = gridSignature;
  }
  if (!Array.isArray(daily.gamesCompleted)) {
    daily.gamesCompleted = [];
  }
  if (!Array.isArray(daily.connections?.revealedGroupIds)) {
    daily.connections.revealedGroupIds = [];
  }
  if (!daily.moviedle || !Array.isArray(daily.moviedle.guesses)) {
    daily.moviedle = { guesses: [], score: 0, status: "playing", revealedAnswer: false };
  }
  if (typeof daily.moviedle.score !== "number") {
    daily.moviedle.score = 0;
  }
  if (typeof daily.moviedle.status !== "string") {
    daily.moviedle.status = "playing";
  }
  if (typeof daily.moviedle.revealedAnswer !== "boolean") {
    daily.moviedle.revealedAnswer = false;
  }
  if (!daily.impostor || typeof daily.impostor !== "object") {
    daily.impostor = {
      roundIndex: 0,
      selectedIndex: -1,
      solvedRounds: [],
      history: [],
      score: 0,
      status: "playing",
      feedback: null,
      signature: impostorSignature
    };
  }
  if (!Array.isArray(daily.impostor.solvedRounds)) {
    daily.impostor.solvedRounds = [];
  }
  if (!Array.isArray(daily.impostor.history)) {
    daily.impostor.history = [];
  }
  if (typeof daily.impostor.roundIndex !== "number") {
    daily.impostor.roundIndex = 0;
  }
  if (typeof daily.impostor.selectedIndex !== "number") {
    daily.impostor.selectedIndex = -1;
  }
  if (typeof daily.impostor.score !== "number") {
    daily.impostor.score = 0;
  }
  if (typeof daily.impostor.status !== "string") {
    daily.impostor.status = "playing";
  }
  if (!daily.impostor.feedback || typeof daily.impostor.feedback !== "object") {
    daily.impostor.feedback = null;
  }
  if (daily.impostor.signature !== impostorSignature) {
    daily.impostor = {
      roundIndex: 0,
      selectedIndex: -1,
      solvedRounds: [],
      history: [],
      score: 0,
      status: "playing",
      feedback: null,
      signature: impostorSignature
    };
  } else if (typeof daily.impostor.signature !== "string") {
    daily.impostor.signature = impostorSignature;
  }
  daily.impostor.roundIndex = Math.max(0, Math.min(Math.trunc(daily.impostor.roundIndex), Math.max(0, impostorPuzzle.rounds.length - 1)));
  if (!daily.impostorCast || typeof daily.impostorCast !== "object") {
    daily.impostorCast = {
      selected: [],
      lockedCorrect: [],
      wrongSelection: [],
      history: [],
      attempts: 0,
      score: 0,
      status: "playing",
      signature: impostorCastSignature
    };
  }
  if (!Array.isArray(daily.impostorCast.selected)) {
    daily.impostorCast.selected = [];
  }
  if (!Array.isArray(daily.impostorCast.lockedCorrect)) {
    daily.impostorCast.lockedCorrect = [];
  }
  if (!Array.isArray(daily.impostorCast.wrongSelection)) {
    daily.impostorCast.wrongSelection = [];
  }
  if (!Array.isArray(daily.impostorCast.history)) {
    daily.impostorCast.history = [];
  }
  if (typeof daily.impostorCast.attempts !== "number") {
    daily.impostorCast.attempts = 0;
  }
  if (typeof daily.impostorCast.score !== "number") {
    daily.impostorCast.score = 0;
  }
  if (typeof daily.impostorCast.status !== "string") {
    daily.impostorCast.status = "playing";
  }
  if (daily.impostorCast.signature !== impostorCastSignature) {
    daily.impostorCast = {
      selected: [],
      lockedCorrect: [],
      wrongSelection: [],
      history: [],
      attempts: 0,
      score: 0,
      status: "playing",
      signature: impostorCastSignature
    };
  } else if (typeof daily.impostorCast.signature !== "string") {
    daily.impostorCast.signature = impostorCastSignature;
  }
  daily.impostorCast.selected = daily.impostorCast.selected.filter(
    (idx) => Number.isInteger(idx) && idx >= 0 && idx < impostorCastPuzzle.options.length
  );
  daily.impostorCast.wrongSelection = daily.impostorCast.wrongSelection.filter(
    (idx) => Number.isInteger(idx) && idx >= 0 && idx < impostorCastPuzzle.options.length
  );

  const challengeParams = new URLSearchParams();
  challengeParams.set("ref", profile.referralCode);
  challengeParams.set("difficulty", difficulty);
  if (dayOverride) challengeParams.set("day", dayOverride);
  if (variantOverride) challengeParams.set("variant", variantOverride);
  const challengeLink = `${window.location.href.split("?")[0]}?${challengeParams.toString()}`;
  const seenRefKey = `cineclash-ref-seen-${todayKey}`;

  const dom = {
    todayDate: q("today-date"),
    streakValue: q("streak-value"),
    xpValue: q("xp-value"),
    dailyScoreValue: q("daily-score-value"),
    referralValue: q("referral-value"),
    tierBadge: q("tier-badge"),
    liveFeed: q("live-feed"),
    toast: q("toast"),
    haulSummary: q("haul-summary"),
    movieOptions: q("movie-options"),
    copyHaulBtn: q("copy-haul-btn"),
    copyFinalBtn: q("copy-final-btn"),
    challengeBtn: q("challenge-btn"),
    copyLinkBtn: q("copy-link-btn"),
    homeGridStatus: q("home-grid-status"),
    homeConnectionsStatus: q("home-connections-status"),
    homePlotleStatus: q("home-plotle-status"),
    homeMoviedleStatus: q("home-moviedle-status"),
    homeSpotlightStatus: q("home-spotlight-status"),
    homeImpostorStatus: q("home-impostor-status"),
    gridBoard: q("grid-board"),
    gridSelected: q("grid-selected"),
    gridInput: q("grid-input"),
    gridSubmitBtn: q("grid-submit-btn"),
    gridSurrenderBtn: q("grid-surrender-btn"),
    gridMeta: q("grid-meta"),
    connectionsBoard: q("connections-board"),
    connectionsSubmitBtn: q("connections-submit-btn"),
    connectionsClearBtn: q("connections-clear-btn"),
    connectionsSurrenderBtn: q("connections-surrender-btn"),
    connectionsMeta: q("connections-meta"),
    connectionsSolved: q("connections-solved"),
    plotleClues: q("plotle-clues"),
    plotleInput: q("plotle-input"),
    plotleSubmitBtn: q("plotle-submit-btn"),
    plotleSurrenderBtn: q("plotle-surrender-btn"),
    plotleMeta: q("plotle-meta"),
    plotleGuesses: q("plotle-guesses"),
    moviedleClue: q("moviedle-clue"),
    moviedleSection: q("moviedle-section"),
    moviedleBoard: q("moviedle-board"),
    moviedleKeyboard: q("moviedle-keyboard"),
    moviedleCapture: q("moviedle-capture"),
    moviedleInput: q("moviedle-input"),
    moviedleSubmitBtn: q("moviedle-submit-btn"),
    moviedleSurrenderBtn: q("moviedle-surrender-btn"),
    moviedleMeta: q("moviedle-meta"),
    impostorSection: q("impostor-section"),
    impostorProgress: q("impostor-progress"),
    impostorQuestion: q("impostor-question"),
    impostorSub: q("impostor-sub"),
    impostorOptions: q("impostor-options"),
    impostorCheckBtn: q("impostor-check-btn"),
    impostorClearBtn: q("impostor-clear-btn"),
    impostorSurrenderBtn: q("impostor-surrender-btn"),
    impostorMeta: q("impostor-meta"),
    impostorCastSection: q("impostor-cast-section"),
    impostorCastTitle: q("impostor-cast-title"),
    impostorCastSub: q("impostor-cast-sub"),
    impostorCastOptions: q("impostor-cast-options"),
    impostorCastCheckBtn: q("impostor-cast-check-btn"),
    impostorCastClearBtn: q("impostor-cast-clear-btn"),
    impostorCastSurrenderBtn: q("impostor-cast-surrender-btn"),
    impostorCastMeta: q("impostor-cast-meta")
  };
  let winModal = null;
  let surrenderConfirmModal = null;
  let previousConnectionsRevealSet = new Set(daily.connections?.revealedGroupIds || daily.connections?.solvedGroupIds || []);
  let impostorAdvanceTimer = null;

  if (daily.gamesCompleted.length >= totalGameCount) {
    finalizeDailyRewards();
  }

  mountGameDifficultyView();
  applyDifficultyToNavigationLinks();
  applyReferralBonus();
  hydrateDatalist();
  wireEvents();
  tickLiveFeed();
  renderAll();

  function renderAll() {
    renderTop();
    renderHome();
    renderGrid();
    renderConnections();
    renderPlotle();
    renderMoviedle();
    renderImpostor();
    renderImpostorCast();
    renderHaulSummary();
  }

  function renderTop() {
    setText(dom.todayDate, prettyDate);
    setText(dom.streakValue, String(profile.streak || 0));
    setText(dom.xpValue, String(profile.xp || 0));
    setText(dom.dailyScoreValue, String(totalDailyScore()));
    setText(dom.referralValue, String((profile.referrals || []).length));
    setText(dom.tierBadge, tierFromXP(profile.xp || 0));
  }

  function mountGameDifficultyView() {
    if (page === "home") return;

    const layout = document.querySelector("main.layout");
    if (!layout) return;
    if (layout.querySelector(".difficulty-view")) return;

    const panel = document.createElement("section");
    panel.className = "difficulty-view reveal";

    const title = document.createElement("h3");
    title.textContent = "Choose Difficulty";

    const sub = document.createElement("p");
    sub.textContent = "Easy: top 400 by popularity/votes. Medium: top 1000. Hard: all movies.";

    const options = document.createElement("div");
    options.className = "difficulty-options";

    const levels = [
      { value: "easy", label: "Easy", meta: "Top 400" },
      { value: "medium", label: "Medium", meta: "Top 1000" },
      { value: "hard", label: "Hard", meta: "All Movies" }
    ];

    levels.forEach((entry) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "difficulty-option";
      if (entry.value === difficulty) button.classList.add("active");
      button.setAttribute("aria-pressed", entry.value === difficulty ? "true" : "false");
      button.innerHTML = `<strong>${entry.label}</strong><span>${entry.meta}</span>`;
      button.addEventListener("click", () => {
        const next = parseDifficulty(entry.value) || "medium";
        if (next === difficulty) return;
        writeLocalStorageSafe("cineclash-difficulty-v1", next);

        const nextUrl = new URL(window.location.href);
        nextUrl.searchParams.set("difficulty", next);
        window.location.assign(nextUrl.toString());
      });
      options.appendChild(button);
    });

    panel.appendChild(title);
    panel.appendChild(sub);
    panel.appendChild(options);

    const hero = layout.querySelector(".hero");
    if (hero && hero.parentNode === layout) {
      hero.insertAdjacentElement("afterend", panel);
      return;
    }
    layout.prepend(panel);
  }

  function applyDifficultyToNavigationLinks() {
    const links = document.querySelectorAll("a[href]");
    links.forEach((link) => {
      const href = link.getAttribute("href");
      if (!href || href.startsWith("#")) return;
      if (/^(mailto:|tel:|javascript:)/i.test(href)) return;

      let url;
      try {
        url = new URL(href, window.location.href);
      } catch (_error) {
        return;
      }

      if (url.origin !== window.location.origin) return;
      const isHtmlRoute = url.pathname === "/" || url.pathname.endsWith(".html");
      if (!isHtmlRoute) return;

      url.searchParams.set("difficulty", difficulty);
      const relative = `${url.pathname}${url.search}${url.hash}`;
      link.setAttribute("href", relative);
    });
  }

  function renderHome() {
    if (page !== "home") return;

    if (dom.homeGridStatus) {
      const solved = daily.grid.answers.filter(Boolean).length;
      const status = daily.grid.status === "won" ? "Completed" : daily.grid.status === "lost" ? "Locked" : "In progress";
      dom.homeGridStatus.textContent = `${status} - ${solved}/9 squares`;
    }

    if (dom.homeConnectionsStatus) {
      const solved = daily.connections.solvedGroupIds.length;
      const status = daily.connections.status === "won" ? "Completed" : daily.connections.status === "lost" ? "Locked" : "In progress";
      dom.homeConnectionsStatus.textContent = `${status} - ${solved}/4 groups`;
    }

    if (dom.homePlotleStatus) {
      const status = daily.plotle.status === "won" ? "Completed" : daily.plotle.status === "lost" ? "Locked" : "In progress";
      const meta = daily.plotle.status === "won" ? `${daily.plotle.guesses.length}/6 guesses` : `${daily.plotle.guesses.length}/6 used`;
      dom.homePlotleStatus.textContent = `${status} - ${meta}`;
    }

    if (dom.homeMoviedleStatus) {
      const status = daily.moviedle.status === "won" ? "Completed" : daily.moviedle.status === "lost" ? "Locked" : "In progress";
      const meta = daily.moviedle.status === "won" ? `${daily.moviedle.guesses.length}/6 guesses` : `${daily.moviedle.guesses.length}/6 used`;
      dom.homeMoviedleStatus.textContent = `${status} - ${meta}`;
    }

    if (dom.homeSpotlightStatus) {
      const totalRounds = impostorPuzzle.rounds.length;
      const status = daily.impostor.status === "won" ? "Completed" : daily.impostor.status === "lost" ? "Locked" : "In progress";
      const meta =
        daily.impostor.status === "won"
          ? `${totalRounds}/${totalRounds} rounds`
          : daily.impostor.status === "lost"
            ? `${daily.impostor.solvedRounds.length}/${totalRounds} solved`
            : `${daily.impostor.solvedRounds.length}/${totalRounds} solved`;
      dom.homeSpotlightStatus.textContent = `${status} - ${meta}`;
    }

    if (dom.homeImpostorStatus) {
      const correctNeeded = impostorCastPuzzle.answers.length;
      const locked = uniqueNormalizedValues(daily.impostorCast.lockedCorrect).length;
      const status = daily.impostorCast.status === "won" ? "Completed" : daily.impostorCast.status === "lost" ? "Locked" : "In progress";
      const meta = daily.impostorCast.status === "lost" ? `${locked}/${correctNeeded} found` : `${locked}/${correctNeeded} found`;
      dom.homeImpostorStatus.textContent = `${status} - ${meta}`;
    }
  }

  function renderGrid() {
    if (!dom.gridBoard || !dom.gridMeta || !dom.gridSelected || !dom.gridSubmitBtn) return;

    const { rows, cols, intersections } = gridPuzzle;
    const state = daily.grid;
    dom.gridBoard.innerHTML = "";
    if (dom.gridInput) {
      dom.gridInput.placeholder = gridPuzzle.answerType === "actor" ? "Type an actor name" : "Type a movie title";
    }

    dom.gridBoard.appendChild(createGridNode("grid-header grid-corner", gridPuzzle.cornerLabel));
    cols.forEach((col) => dom.gridBoard.appendChild(createGridNode("grid-header", col)));

    rows.forEach((rowValue, rowIdx) => {
      dom.gridBoard.appendChild(createGridNode("grid-header", rowValue));

      cols.forEach((colValue, colIdx) => {
        const idx = rowIdx * 3 + colIdx;
        const button = document.createElement("button");
        button.type = "button";
        button.className = "grid-cell";
        button.dataset.index = String(idx);
        button.textContent = state.answers[idx] || "Tap to guess";

        if (state.selectedIndex === idx) button.classList.add("active");
        if (state.answers[idx]) button.classList.add("filled");
        if (state.wrongPulse === idx) button.classList.add("wrong");
        if (state.status !== "playing" && !state.answers[idx]) {
          button.disabled = true;
          button.textContent = describeGridCellRequirement(rowValue, colValue, gridPuzzle);
        }

        button.addEventListener("click", onGridCellClick);
        dom.gridBoard.appendChild(button);
      });
    });

    const solved = state.answers.filter(Boolean).length;
    const selectedText =
      state.selectedIndex >= 0
        ? describeGridSelection(rows[Math.floor(state.selectedIndex / 3)], cols[state.selectedIndex % 3])
        : "Select a square to guess";
    dom.gridSelected.textContent = selectedText;

    const baseMeta = `Solved ${solved}/9 | Attempts left ${state.attemptsLeft} | Score ${state.score}`;
    if (state.status === "won") {
      dom.gridMeta.textContent = `${baseMeta} | Perfect board`;
    } else if (state.status === "lost") {
      dom.gridMeta.textContent = `${baseMeta} | Answers revealed (one valid answer per square)`;
    } else if (state.selectedIndex >= 0) {
      const options = intersections[state.selectedIndex];
      dom.gridMeta.textContent = `${baseMeta} | ${options.length} valid answers`;
    } else {
      dom.gridMeta.textContent = baseMeta;
    }

    dom.gridSubmitBtn.disabled = state.status !== "playing";
    if (dom.gridSurrenderBtn) {
      dom.gridSurrenderBtn.disabled = state.status !== "playing";
    }

    if (state.wrongPulse >= 0) {
      window.clearTimeout(state.wrongTimer);
      state.wrongTimer = window.setTimeout(() => {
        state.wrongPulse = -1;
        renderGrid();
      }, 260);
    }
  }

  function createGridNode(className, text) {
    const node = document.createElement("div");
    node.className = className;
    node.textContent = text;
    return node;
  }

  function describeGridSelection(rowActor, colValue) {
    return `${rowActor} + ${colValue}`;
  }

  function describeGridCellRequirement(rowValue, colValue, puzzle) {
    if (puzzle.answerType === "actor") {
      return `Any actor in "${rowValue}" and "${colValue}"`;
    }
    if (puzzle.colType === "actor") {
      return `Any title with ${rowValue} and ${colValue}`;
    }
    return `Any ${colValue} title with ${rowValue}`;
  }

  function onGridCellClick(event) {
    if (daily.grid.status !== "playing") return;
    const idx = Number(event.currentTarget.dataset.index);
    if (!Number.isInteger(idx) || daily.grid.answers[idx]) return;
    daily.grid.selectedIndex = idx;
    persistDaily();
    renderGrid();
  }

  function submitGridGuess() {
    if (!dom.gridInput) return;
    const state = daily.grid;
    if (state.status !== "playing") return;
    if (state.selectedIndex < 0) {
      showToast("Pick a square first.");
      return;
    }

    const raw = dom.gridInput.value.trim();
    if (!raw) return;

    const guess = resolveGridGuess(raw, gridPuzzle.answerType);
    if (!guess) {
      registerGridMiss(gridPuzzle.answerType === "actor" ? "Actor not in list." : "Title not in list.");
      return;
    }

    const intersection = gridPuzzle.intersections[state.selectedIndex];
    const alreadyUsed = state.answers.some((value) => normalize(value) === normalize(guess.value));
    const allowed = intersection.some((entry) => normalize(entry.value) === normalize(guess.value));

    if (!allowed || alreadyUsed) {
      registerGridMiss(
        alreadyUsed
          ? `You already used that ${gridPuzzle.answerType}.`
          : `That ${gridPuzzle.answerType} does not match this square.`
      );
      return;
    }

    state.answers[state.selectedIndex] = guess.value;
    state.selectedIndex = -1;
    const gain = scoreGridGuess(guess, gridPuzzle.answerType);
    state.score += gain;
    dom.gridInput.value = "";

    if (state.answers.every(Boolean)) {
      state.status = "won";
      const streak = recordGameWin("grid");
      completeGame("grid");
      showGameWinModal("grid", streak);
      showToast(`Grid cleared. +${gain} points.`);
      burst("#grid-section");
    } else {
      showToast(`Correct. +${gain} points.`);
    }

    persistDaily();
    renderAll();
  }

  function registerGridMiss(reason) {
    const state = daily.grid;
    state.attemptsLeft -= 1;
    state.wrongPulse = state.selectedIndex;
    showToast(reason);

    if (state.attemptsLeft <= 0) {
      state.status = "lost";
      solveGridBoard();
      recordGameLoss("grid");
      completeGame("grid");
      showGameLossModal("grid");
      showToast("Grid locked for today.");
    }

    persistDaily();
    renderAll();
  }

  function ensureSurrenderConfirmModal() {
    if (surrenderConfirmModal) return surrenderConfirmModal;

    const overlay = document.createElement("div");
    overlay.className = "confirm-modal";
    overlay.innerHTML = `
      <div class="confirm-modal-card" role="dialog" aria-modal="true" aria-labelledby="confirm-modal-title">
        <h3 id="confirm-modal-title">Surrender game?</h3>
        <p id="confirm-modal-text"></p>
        <div class="guess-actions confirm-modal-actions">
          <button type="button" class="btn btn-surrender confirm-modal-confirm">Surrender</button>
          <button type="button" class="btn btn-ghost confirm-modal-cancel">Cancel</button>
        </div>
      </div>
    `;

    const titleNode = overlay.querySelector("#confirm-modal-title");
    const textNode = overlay.querySelector("#confirm-modal-text");
    const confirmBtn = overlay.querySelector(".confirm-modal-confirm");
    const cancelBtn = overlay.querySelector(".confirm-modal-cancel");

    const resolveAndClose = (accepted) => {
      overlay.classList.remove("show");
      const resolver = overlay._confirmResolve;
      overlay._confirmResolve = null;
      if (typeof resolver === "function") {
        resolver(Boolean(accepted));
      }
    };

    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) {
        resolveAndClose(false);
      }
    });

    if (confirmBtn) {
      confirmBtn.addEventListener("click", () => resolveAndClose(true));
    }

    if (cancelBtn) {
      cancelBtn.addEventListener("click", () => resolveAndClose(false));
    }

    document.addEventListener("keydown", (event) => {
      if (!overlay.classList.contains("show")) return;
      if (event.key === "Escape") {
        event.preventDefault();
        resolveAndClose(false);
      }
    });

    document.body.appendChild(overlay);
    surrenderConfirmModal = { overlay, titleNode, textNode, confirmBtn };
    return surrenderConfirmModal;
  }

  function confirmSurrender(gameLabel) {
    const label = String(gameLabel || "this game");
    const modal = ensureSurrenderConfirmModal();

    if (typeof modal.overlay._confirmResolve === "function") {
      modal.overlay._confirmResolve(false);
      modal.overlay._confirmResolve = null;
    }

    if (modal.titleNode) {
      modal.titleNode.textContent = `Surrender ${label}?`;
    }
    if (modal.textNode) {
      modal.textNode.textContent = `You will lose ${label} and reveal its answers for today.`;
    }

    modal.overlay.classList.add("show");
    if (modal.confirmBtn && typeof modal.confirmBtn.focus === "function") {
      modal.confirmBtn.focus({ preventScroll: true });
    }

    return new Promise((resolve) => {
      modal.overlay._confirmResolve = resolve;
    });
  }

  async function surrenderGrid() {
    const state = daily.grid;
    if (state.status !== "playing") return;
    if (!(await confirmSurrender("Movie Grid"))) return;

    state.status = "lost";
    state.selectedIndex = -1;
    solveGridBoard();
    recordGameLoss("grid");
    completeGame("grid");
    showGameLossModal("grid");
    showToast("You surrendered. Grid answers revealed.");
    persistDaily();
    renderAll();
  }

  function resolveGridGuess(raw, answerType) {
    if (answerType === "actor") {
      const actor = actorNameMap.get(normalize(raw));
      if (!actor) return null;
      return {
        type: "actor",
        value: actor,
        popularity: actorPopularityScore(actor)
      };
    }

    const movie = movieMap.get(normalize(raw));
    if (!movie) return null;
    return {
      type: "title",
      value: movie.title,
      popularity: movie.popularity
    };
  }

  function scoreGridGuess(guess, answerType) {
    if (answerType === "actor") {
      const freq = actorFrequency.get(normalize(guess.value)) || 1;
      return Math.max(8, 32 - Math.min(24, freq * 2));
    }
    return Math.max(8, 36 - Math.floor(guess.popularity / 3));
  }

  function solveGridBoard() {
    const state = daily.grid;
    const used = new Set(state.answers.filter(Boolean).map((value) => normalize(value)));

    for (let idx = 0; idx < gridPuzzle.intersections.length; idx += 1) {
      if (state.answers[idx]) continue;
      const options = gridPuzzle.intersections[idx];
      const uniquePick = options.find((option) => !used.has(normalize(option.value)));
      const picked = uniquePick || options[0];
      if (!picked) continue;
      state.answers[idx] = picked.value;
      used.add(normalize(picked.value));
    }

    state.selectedIndex = -1;
  }

  function renderConnections() {
    if (!dom.connectionsBoard || !dom.connectionsMeta || !dom.connectionsSolved || !dom.connectionsSubmitBtn || !dom.connectionsClearBtn) {
      return;
    }

    const previousRects = captureConnectionsTileRects();
    const state = daily.connections;
    if (state.status === "playing" && state.revealedGroupIds.length) {
      state.revealedGroupIds = [];
    }

    const allGroupIds = connectionsPuzzle.groups.map((_group, idx) => idx);
    const fallbackRevealOrder = [...state.solvedGroupIds, ...allGroupIds.filter((id) => !state.solvedGroupIds.includes(id))];
    const revealedGroupIds =
      state.status === "lost"
        ? state.revealedGroupIds.length
          ? state.revealedGroupIds
          : fallbackRevealOrder
        : state.solvedGroupIds.slice();
    const revealedSet = new Set(revealedGroupIds);

    dom.connectionsBoard.innerHTML = "";
    renderConnectionsRevealedRows(revealedGroupIds, previousConnectionsRevealSet);

    let visibleCount = 0;
    connectionsItems.forEach((item, idx) => {
      if (revealedSet.has(item.groupId)) return;
      visibleCount += 1;

      const button = document.createElement("button");
      button.type = "button";
      button.className = "conn-item";
      button.textContent = item.text;
      button.dataset.index = String(idx);

      const selected = state.selected.includes(idx);

      if (selected) button.classList.add("selected");
      button.disabled = state.status !== "playing";

      button.addEventListener("click", onConnectionItemClick);
      dom.connectionsBoard.appendChild(button);
    });

    dom.connectionsBoard.classList.toggle("empty", visibleCount === 0);
    if (visibleCount === 0) {
      const empty = document.createElement("p");
      empty.className = "connections-board-empty";
      empty.textContent = state.status === "lost" ? "All categories revealed." : "All categories solved.";
      dom.connectionsBoard.appendChild(empty);
    }

    const mistakesLeft = 4 - state.mistakes;
    const solvedCount = state.solvedGroupIds.length;
    if (state.status === "won") {
      dom.connectionsMeta.textContent = `Solved 4/4 | Mistakes used ${state.mistakes} | Score ${state.score}`;
    } else if (state.status === "lost") {
      dom.connectionsMeta.textContent = `Misses maxed out | Answers revealed | Score ${state.score}`;
    } else {
      dom.connectionsMeta.textContent = `Solved ${solvedCount}/4 | Mistakes left ${mistakesLeft} | Puzzle: ${connectionsPuzzle.title}`;
    }

    dom.connectionsSubmitBtn.disabled = state.status !== "playing" || visibleCount === 0;
    dom.connectionsClearBtn.disabled = state.status !== "playing" || visibleCount === 0;
    if (dom.connectionsSurrenderBtn) {
      dom.connectionsSurrenderBtn.disabled = state.status !== "playing";
    }
    animateConnectionsReflow(previousRects);
    previousConnectionsRevealSet = new Set(revealedGroupIds);
  }

  function renderConnectionsRevealedRows(groupIds, previousSet = new Set()) {
    if (!dom.connectionsSolved) return;
    dom.connectionsSolved.innerHTML = "";

    groupIds.forEach((groupId) => {
      const group = connectionsPuzzle.groups[groupId];
      if (!group) return;

      const row = document.createElement("li");
      row.className = `connections-reveal-row tone-${groupId % 4}`;
      if (!previousSet.has(groupId)) {
        row.classList.add("is-new");
      }

      const title = document.createElement("strong");
      title.textContent = group.name;

      const items = document.createElement("p");
      items.textContent = group.items.join(", ");

      row.appendChild(title);
      row.appendChild(items);
      dom.connectionsSolved.appendChild(row);
    });
  }

  function captureConnectionsTileRects() {
    const output = new Map();
    if (!dom.connectionsBoard) return output;
    const nodes = dom.connectionsBoard.querySelectorAll(".conn-item[data-index]");
    nodes.forEach((node) => {
      if (node.dataset.index) {
        output.set(node.dataset.index, node.getBoundingClientRect());
      }
    });
    return output;
  }

  function animateConnectionsReflow(previousRects) {
    if (!dom.connectionsBoard || !previousRects || previousRects.size === 0) return;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const nodes = dom.connectionsBoard.querySelectorAll(".conn-item[data-index]");
    nodes.forEach((node) => {
      const key = node.dataset.index || "";
      const oldRect = previousRects.get(key);
      if (!oldRect) {
        node.classList.add("is-entering");
        return;
      }

      const newRect = node.getBoundingClientRect();
      const dx = oldRect.left - newRect.left;
      const dy = oldRect.top - newRect.top;
      if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) return;

      node.style.transform = `translate(${dx}px, ${dy}px)`;
      node.style.transition = "transform 0s";
      window.requestAnimationFrame(() => {
        node.style.transition = "transform 340ms cubic-bezier(0.22, 1, 0.36, 1)";
        node.style.transform = "";
        const clear = () => {
          node.style.transition = "";
          node.removeEventListener("transitionend", clear);
        };
        node.addEventListener("transitionend", clear);
      });
    });
  }

  function onConnectionItemClick(event) {
    if (daily.connections.status !== "playing") return;
    const idx = Number(event.currentTarget.dataset.index);
    if (!Number.isInteger(idx)) return;

    const selected = daily.connections.selected;
    if (selected.includes(idx)) {
      daily.connections.selected = selected.filter((item) => item !== idx);
    } else {
      if (selected.length >= 4) {
        showToast("Only 4 picks at a time.");
        return;
      }
      daily.connections.selected = selected.concat(idx);
    }

    persistDaily();
    renderConnections();
  }

  function clearConnectionSelection() {
    if (daily.connections.status !== "playing") return;
    daily.connections.selected = [];
    persistDaily();
    renderConnections();
  }

  function submitConnections() {
    const state = daily.connections;
    if (state.status !== "playing") return;
    if (state.selected.length !== 4) {
      showToast("Pick exactly 4 items.");
      return;
    }

    const chosen = state.selected.map((idx) => connectionItemByIndex.get(idx));
    const groupIds = chosen.map((entry) => entry.groupId);
    const unique = new Set(groupIds);
    state.history.push(groupIds);

    if (unique.size === 1) {
      const groupId = groupIds[0];
      if (!state.solvedGroupIds.includes(groupId)) {
        state.solvedGroupIds.push(groupId);
        showToast(`Correct group: ${connectionsPuzzle.groups[groupId].name}`);
      } else {
        showToast("Group already solved.");
      }

      if (state.solvedGroupIds.length === 4) {
        state.status = "won";
        state.score = Math.max(45, 150 - state.mistakes * 22);
        const streak = recordGameWin("connections");
        completeGame("connections");
        showGameWinModal("connections", streak);
        burst("#connections-section");
      }
    } else {
      state.mistakes += 1;
      showToast("Not a valid group.");
      if (state.mistakes >= 4) {
        state.status = "lost";
        state.score = Math.max(10, state.solvedGroupIds.length * 18);
        solveConnectionsBoard();
        recordGameLoss("connections");
        completeGame("connections");
        showGameLossModal("connections");
      }
    }

    state.selected = [];
    persistDaily();
    renderAll();
  }

  function solveConnectionsBoard() {
    const state = daily.connections;
    const allGroupIds = connectionsPuzzle.groups.map((_group, idx) => idx);
    const solved = state.solvedGroupIds.slice();
    state.revealedGroupIds = [...solved, ...allGroupIds.filter((id) => !solved.includes(id))];
    state.selected = [];
  }

  async function surrenderConnections() {
    const state = daily.connections;
    if (state.status !== "playing") return;
    if (!(await confirmSurrender("Cast Connections"))) return;

    state.status = "lost";
    state.score = Math.max(10, state.solvedGroupIds.length * 18);
    solveConnectionsBoard();
    recordGameLoss("connections");
    completeGame("connections");
    showGameLossModal("connections");
    showToast("You surrendered. Connections answers revealed.");
    persistDaily();
    renderAll();
  }

  function renderPlotle() {
    if (!dom.plotleClues || !dom.plotleMeta || !dom.plotleGuesses || !dom.plotleSubmitBtn) return;

    const state = daily.plotle;
    const clueList = buildPlotleClues(plotleTarget);
    const cluesToShow = Math.max(1, Math.min(clueList.length, state.guesses.length + 1));

    dom.plotleClues.innerHTML = "";
    for (let i = 0; i < cluesToShow; i += 1) {
      const line = document.createElement("p");
      line.textContent = `${i + 1}. ${clueList[i]}`;
      dom.plotleClues.appendChild(line);
    }

    dom.plotleGuesses.innerHTML = "";
    state.guesses.forEach((guess) => {
      const row = document.createElement("div");
      row.className = "guess-item";
      const header = document.createElement("strong");
      header.textContent = guess.title;
      row.appendChild(header);

      const tags = document.createElement("div");
      tags.className = "guess-tags";
      guess.tags.forEach((tag) => {
        const item = document.createElement("span");
        item.className = `tag ${tag.className}`;
        item.textContent = tag.label;
        tags.appendChild(item);
      });
      row.appendChild(tags);
      dom.plotleGuesses.appendChild(row);
    });

    if (state.status === "won") {
      dom.plotleMeta.textContent = `Solved in ${state.guesses.length}/6 tries | Score ${state.score}`;
    } else if (state.status === "lost") {
      dom.plotleMeta.textContent = `Out of tries. Answer: ${plotleTarget.title} | Score ${state.score}`;
    } else {
      dom.plotleMeta.textContent = `Guesses used ${state.guesses.length}/6`;
    }

    dom.plotleSubmitBtn.disabled = state.status !== "playing";
    if (dom.plotleSurrenderBtn) {
      dom.plotleSurrenderBtn.disabled = state.status !== "playing";
    }
  }

  function submitPlotle() {
    if (!dom.plotleInput) return;
    const state = daily.plotle;
    if (state.status !== "playing") return;
    const raw = dom.plotleInput.value.trim();
    if (!raw) return;

    const movie = movieMap.get(normalize(raw));
    if (!movie) {
      showToast("That title is not in the catalog.");
      return;
    }

    if (state.guesses.some((entry) => normalize(entry.title) === normalize(movie.title))) {
      showToast("You already guessed that one.");
      return;
    }

    const tags = evaluatePlotleGuess(movie, plotleTarget);
    state.guesses.push({ title: movie.title, tags });
    dom.plotleInput.value = "";

    if (normalize(movie.title) === normalize(plotleTarget.title)) {
      state.status = "won";
      state.score = Math.max(60, 190 - (state.guesses.length - 1) * 26);
      const streak = recordGameWin("plotle");
      completeGame("plotle");
      showGameWinModal("plotle", streak);
      showToast("Nailed it.");
      burst("#plotle-section");
    } else if (state.guesses.length >= 6) {
      state.status = "lost";
      state.score = 0;
      solvePlotleAnswer();
      recordGameLoss("plotle");
      completeGame("plotle");
      showGameLossModal("plotle");
      showToast(`No more guesses. ${plotleTarget.title} was the answer.`);
    }

    persistDaily();
    renderAll();
  }

  function solvePlotleAnswer() {
    const state = daily.plotle;
    const answerEntry = { title: plotleTarget.title, tags: evaluatePlotleGuess(plotleTarget, plotleTarget) };
    const answerIdx = state.guesses.findIndex((entry) => normalize(entry.title) === normalize(plotleTarget.title));
    if (answerIdx >= 0) return;

    if (state.guesses.length >= 6) {
      state.guesses[state.guesses.length - 1] = answerEntry;
    } else {
      state.guesses.push(answerEntry);
    }
  }

  async function surrenderPlotle() {
    const state = daily.plotle;
    if (state.status !== "playing") return;
    if (!(await confirmSurrender("Plotle"))) return;

    state.status = "lost";
    state.score = 0;
    solvePlotleAnswer();
    recordGameLoss("plotle");
    completeGame("plotle");
    showGameLossModal("plotle");
    showToast("You surrendered. Plotle answer revealed.");
    persistDaily();
    renderAll();
  }

  function renderMoviedle() {
    if (!dom.moviedleBoard || !dom.moviedleMeta || !dom.moviedleClue) return;

    const state = daily.moviedle;
    const targetLetters = moviedleTargetLetters;
    const totalRows = 6 + (state.status === "lost" && state.revealedAnswer ? 1 : 0);
    dom.moviedleBoard.innerHTML = "";
    dom.moviedleClue.textContent = `Target length: ${targetLetters.length} letters (spaces and punctuation ignored). Type directly in the grid and press Enter.`;

    for (let rowIdx = 0; rowIdx < totalRows; rowIdx += 1) {
      const row = document.createElement("div");
      row.className = "moviedle-row";
      row.style.gridTemplateColumns = `repeat(${targetLetters.length}, minmax(0, 1fr))`;
      const isRevealRow = rowIdx >= 6;
      if (isRevealRow) row.classList.add("answer-row");
      const isActiveRow = !isRevealRow && state.status === "playing" && rowIdx === state.guesses.length;
      if (isActiveRow) row.classList.add("active");

      const guess = isRevealRow ? buildMoviedleAnswerGuess() : state.guesses[rowIdx];
      for (let colIdx = 0; colIdx < targetLetters.length; colIdx += 1) {
        const tile = document.createElement("div");
        tile.className = "moviedle-tile";
        const char = guess ? guess.letters[colIdx] || "" : isActiveRow ? moviedleDraft[colIdx] || "" : "";
        tile.textContent = char;
        if (guess) {
          tile.classList.add(guess.feedback[colIdx] || "absent");
        } else {
          tile.classList.add("empty");
          if (isActiveRow && char) tile.classList.add("draft");
          if (isActiveRow && !char && colIdx === moviedleDraft.length) tile.classList.add("cursor");
        }
        row.appendChild(tile);
      }

      dom.moviedleBoard.appendChild(row);
    }

    if (state.status === "won") {
      dom.moviedleMeta.textContent = `Solved in ${state.guesses.length}/6 tries | Score ${state.score}`;
    } else if (state.status === "lost") {
      dom.moviedleMeta.textContent = `Out of tries. Answer: ${moviedleTarget.title} | Score ${state.score}`;
    } else {
      dom.moviedleMeta.textContent = `Guesses used ${state.guesses.length}/6 | Typed ${moviedleDraft.length}/${targetLetters.length}`;
    }

    syncMoviedleCapture();
    if (dom.moviedleSubmitBtn) {
      dom.moviedleSubmitBtn.disabled = state.status !== "playing";
    }
    if (dom.moviedleSurrenderBtn) {
      dom.moviedleSurrenderBtn.disabled = state.status !== "playing";
    }
    renderMoviedleKeyboard();
  }

  function submitMoviedle(rawGuess = "") {
    const state = daily.moviedle;
    if (state.status !== "playing") return;

    const fallbackRaw = dom.moviedleInput ? dom.moviedleInput.value : "";
    const raw = String(rawGuess || fallbackRaw).trim();
    if (!raw) return;

    const typedLetters = titleLetters(raw);
    if (typedLetters.length !== moviedleTargetLetters.length) {
      showToast(`Use a ${moviedleTargetLetters.length}-letter title.`);
      return;
    }

    const movie = resolveMoviedleGuess(raw, typedLetters);
    if (!movie) {
      showToast("That title is not in the catalog.");
      return;
    }

    const guessLetters = titleLetters(movie.title);
    if (state.guesses.some((entry) => normalize(entry.title) === normalize(movie.title))) {
      showToast("You already guessed that one.");
      return;
    }

    const feedback = evaluateMoviedleGuess(guessLetters, moviedleTargetLetters);
    state.guesses.push({ title: movie.title, letters: guessLetters, feedback });
    moviedleDraft = "";
    if (dom.moviedleInput) dom.moviedleInput.value = "";
    syncMoviedleCapture();

    if (guessLetters === moviedleTargetLetters) {
      state.status = "won";
      state.score = Math.max(55, 190 - (state.guesses.length - 1) * 26);
      const streak = recordGameWin("moviedle");
      completeGame("moviedle");
      showGameWinModal("moviedle", streak);
      showToast("Moviedle solved.");
      burst("#moviedle-section");
    } else if (state.guesses.length >= 6) {
      state.status = "lost";
      state.score = 0;
      solveMoviedleAnswer();
      recordGameLoss("moviedle");
      completeGame("moviedle");
      showGameLossModal("moviedle");
      showToast(`No more guesses. ${moviedleTarget.title} was the answer.`);
    }

    persistDaily();
    renderAll();
  }

  function solveMoviedleAnswer() {
    daily.moviedle.revealedAnswer = true;
    moviedleDraft = "";
    syncMoviedleCapture();
  }

  async function surrenderMoviedle() {
    const state = daily.moviedle;
    if (state.status !== "playing") return;
    if (!(await confirmSurrender("Moviedle"))) return;

    state.status = "lost";
    state.score = 0;
    solveMoviedleAnswer();
    recordGameLoss("moviedle");
    completeGame("moviedle");
    showGameLossModal("moviedle");
    showToast("You surrendered. Moviedle answer revealed.");
    persistDaily();
    renderAll();
  }

  function buildMoviedleAnswerGuess() {
    const letters = moviedleTargetLetters;
    return {
      title: moviedleTarget.title,
      letters,
      feedback: Array(letters.length).fill("exact")
    };
  }

  function resolveMoviedleGuess(raw, letters) {
    const directMatch = movieMap.get(normalize(raw));
    if (directMatch && titleLetters(directMatch.title) === letters) {
      return directMatch;
    }

    const letterMatches = movies
      .filter((movie) => titleLetters(movie.title) === letters)
      .sort(compareMoviesByRank);

    return letterMatches[0] || null;
  }

  function syncMoviedleCapture() {
    if (!dom.moviedleCapture) return;
    dom.moviedleCapture.value = moviedleDraft;
  }

  function setMoviedleDraft(value) {
    moviedleDraft = String(value || "")
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "")
      .slice(0, moviedleTargetLetters.length);
    syncMoviedleCapture();
  }

  function focusMoviedleCapture() {
    if (page !== "moviedle" || !dom.moviedleCapture || daily.moviedle.status !== "playing") return;
    if (!shouldUseMoviedleCaptureFocus() && document.activeElement !== dom.moviedleCapture) return;

    const prevX = window.scrollX;
    const prevY = window.scrollY;
    dom.moviedleCapture.focus({ preventScroll: true });
    const caret = moviedleDraft.length;
    if (typeof dom.moviedleCapture.setSelectionRange === "function") {
      dom.moviedleCapture.setSelectionRange(caret, caret);
    }
    if (window.scrollX !== prevX || window.scrollY !== prevY) {
      window.scrollTo(prevX, prevY);
    }
  }

  function onMoviedleCaptureInput() {
    if (daily.moviedle.status !== "playing") return;
    setMoviedleDraft(dom.moviedleCapture ? dom.moviedleCapture.value : "");
    renderMoviedle();
  }

  function onMoviedleCaptureKeydown(event) {
    if (daily.moviedle.status !== "playing") return;
    if (event.key === "Enter") {
      event.preventDefault();
      submitMoviedle(moviedleDraft);
      return;
    }
    if (event.key === "Escape") {
      event.preventDefault();
      setMoviedleDraft("");
      renderMoviedle();
    }
  }

  function onMoviedleGlobalKeydown(event) {
    if (page !== "moviedle" || daily.moviedle.status !== "playing") return;
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    if (event.target === dom.moviedleCapture) return;

    const tag = String(event.target?.tagName || "").toLowerCase();
    if (tag === "input" || tag === "textarea" || tag === "select") return;

    if (event.key === "Enter") {
      event.preventDefault();
      submitMoviedle(moviedleDraft);
      return;
    }

    if (event.key === "Backspace") {
      event.preventDefault();
      setMoviedleDraft(moviedleDraft.slice(0, -1));
      renderMoviedle();
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      setMoviedleDraft("");
      renderMoviedle();
      return;
    }

    if (event.key.length !== 1 || !/[A-Za-z0-9]/.test(event.key)) return;
    if (moviedleDraft.length >= moviedleTargetLetters.length) return;

    event.preventDefault();
    setMoviedleDraft(moviedleDraft + event.key);
    renderMoviedle();
  }

  function shouldUseMoviedleCaptureFocus() {
    return typeof window !== "undefined" && typeof window.matchMedia === "function" && window.matchMedia("(pointer: coarse)").matches;
  }

  function renderMoviedleKeyboard() {
    if (!dom.moviedleKeyboard) return;

    const state = daily.moviedle;
    const rows = [
      ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
      ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
      ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "BKSP"]
    ];

    const keyState = buildMoviedleKeyState(state.guesses);
    dom.moviedleKeyboard.innerHTML = "";

    rows.forEach((rowKeys) => {
      const row = document.createElement("div");
      row.className = "moviedle-keyboard-row";

      rowKeys.forEach((key) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "moviedle-key";
        button.dataset.key = key;
        button.textContent = key === "BKSP" ? "bksp" : key.toLowerCase();

        if (key === "ENTER" || key === "BKSP") button.classList.add("wide");
        const status = keyState.get(key);
        if (status) button.classList.add(status);
        button.disabled = state.status !== "playing";

        button.addEventListener("click", (event) => {
          event.preventDefault();
          event.stopPropagation();
          onMoviedleKeyPress(key);
          if (event.currentTarget && typeof event.currentTarget.blur === "function") {
            event.currentTarget.blur();
          }
        });
        row.appendChild(button);
      });

      dom.moviedleKeyboard.appendChild(row);
    });
  }

  function buildMoviedleKeyState(guesses) {
    const score = new Map();
    const rank = { absent: 1, present: 2, exact: 3 };

    guesses.forEach((guess) => {
      guess.letters.split("").forEach((letter, idx) => {
        const key = String(letter || "").toUpperCase();
        const status = guess.feedback[idx];
        if (!key || !status) return;
        const current = score.get(key);
        if (!current || rank[status] > rank[current]) {
          score.set(key, status);
        }
      });
    });

    return score;
  }

  function onMoviedleKeyPress(key) {
    if (page !== "moviedle" || daily.moviedle.status !== "playing") return;

    if (key === "ENTER") {
      submitMoviedle(moviedleDraft);
      return;
    }

    if (key === "BKSP") {
      setMoviedleDraft(moviedleDraft.slice(0, -1));
      renderMoviedle();
      return;
    }

    if (!/^[A-Z0-9]$/.test(key)) return;
    if (moviedleDraft.length >= moviedleTargetLetters.length) return;

    setMoviedleDraft(moviedleDraft + key);
    renderMoviedle();
  }

  function renderImpostor() {
    if (
      !dom.impostorOptions ||
      !dom.impostorMeta ||
      !dom.impostorCheckBtn ||
      !dom.impostorClearBtn ||
      !dom.impostorProgress ||
      !dom.impostorQuestion ||
      !dom.impostorSub
    ) {
      return;
    }

    const state = daily.impostor;
    const rounds = impostorPuzzle.rounds;
    const totalRounds = rounds.length;
    const cappedRoundIndex = Math.max(0, Math.min(state.roundIndex, Math.max(0, totalRounds - 1)));
    const round = rounds[cappedRoundIndex];
    const waitingAdvance =
      state.status === "playing" &&
      state.feedback &&
      state.feedback.result === "correct" &&
      state.feedback.round === state.roundIndex;
    const canInteract = state.status === "playing" && !waitingAdvance;

    if (waitingAdvance) {
      window.clearTimeout(impostorAdvanceTimer);
      impostorAdvanceTimer = window.setTimeout(() => {
        advanceImpostorRound();
      }, 420);
    }

    dom.impostorOptions.innerHTML = "";
    dom.impostorOptions.classList.toggle("revealed", state.status !== "playing");

    if (!round) {
      dom.impostorProgress.textContent = "No rounds available";
      dom.impostorQuestion.textContent = "Spotlight puzzle unavailable";
      dom.impostorSub.textContent = "Try another day.";
      dom.impostorMeta.textContent = "No puzzle generated.";
      dom.impostorCheckBtn.disabled = true;
      dom.impostorClearBtn.disabled = true;
      if (dom.impostorSurrenderBtn) dom.impostorSurrenderBtn.disabled = true;
      return;
    }

    if (state.status === "lost" || state.status === "won") {
      dom.impostorProgress.textContent =
        state.status === "won" ? `Solved ${totalRounds}/${totalRounds}` : `Solved ${state.solvedRounds.length}/${totalRounds}`;
      dom.impostorQuestion.textContent = state.status === "won" ? "Every round cleared." : "You missed one. Answers revealed.";
      dom.impostorSub.textContent = "Correct actor for each clue:";

      rounds.forEach((entry, idx) => {
        const reveal = document.createElement("article");
        reveal.className = "impostor-reveal-row";
        const clue = document.createElement("strong");
        clue.textContent = `Round ${idx + 1}: ${entry.clue}`;
        const answer = document.createElement("p");
        answer.textContent = entry.answer;
        reveal.appendChild(clue);
        reveal.appendChild(answer);
        dom.impostorOptions.appendChild(reveal);
      });

      dom.impostorMeta.textContent = `Score ${state.score}`;
      dom.impostorCheckBtn.disabled = true;
      dom.impostorClearBtn.disabled = true;
      if (dom.impostorSurrenderBtn) dom.impostorSurrenderBtn.disabled = true;
      return;
    }

    dom.impostorProgress.textContent = `Round ${state.roundIndex + 1} of ${totalRounds}`;
    dom.impostorQuestion.textContent = round.clue;
    dom.impostorSub.textContent = "Select one actor and press Check.";

    const correctIndex = round.options.findIndex((name) => normalize(name) === normalize(round.answer));

    round.options.forEach((name, idx) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "impostor-option";
      button.textContent = name;
      button.dataset.index = String(idx);

      if (state.selectedIndex === idx) {
        button.classList.add("selected");
      }

      if (state.feedback && state.feedback.round === state.roundIndex) {
        if (idx === correctIndex) {
          button.classList.add("correct");
        }
        if (state.feedback.result === "wrong" && idx === state.feedback.selected) {
          button.classList.add("wrong");
        }
      }

      button.disabled = !canInteract;
      button.addEventListener("click", onImpostorOptionClick);
      dom.impostorOptions.appendChild(button);
    });

    dom.impostorMeta.textContent = `Solved ${state.solvedRounds.length}/${totalRounds} | Score ${state.score}`;
    dom.impostorCheckBtn.disabled = !canInteract || state.selectedIndex < 0;
    dom.impostorClearBtn.disabled = !canInteract || state.selectedIndex < 0;
    if (dom.impostorSurrenderBtn) dom.impostorSurrenderBtn.disabled = !canInteract;
  }

  function onImpostorOptionClick(event) {
    const state = daily.impostor;
    if (state.status !== "playing") return;
    if (state.feedback && state.feedback.result === "correct" && state.feedback.round === state.roundIndex) return;

    const idx = Number(event.currentTarget.dataset.index);
    if (!Number.isInteger(idx)) return;

    state.selectedIndex = idx;
    persistDaily();
    renderImpostor();
  }

  function clearImpostorSelection() {
    const state = daily.impostor;
    if (state.status !== "playing") return;
    if (state.feedback && state.feedback.result === "correct" && state.feedback.round === state.roundIndex) return;

    state.selectedIndex = -1;
    persistDaily();
    renderImpostor();
  }

  function submitImpostor() {
    const state = daily.impostor;
    if (state.status !== "playing") return;
    if (state.selectedIndex < 0) {
      showToast("Pick one actor first.");
      return;
    }

    const round = impostorPuzzle.rounds[state.roundIndex];
    if (!round) return;

    const selectedIdx = state.selectedIndex;
    const selectedActor = round.options[selectedIdx];
    const correctIdx = round.options.findIndex((name) => normalize(name) === normalize(round.answer));
    const isCorrect = normalize(selectedActor) === normalize(round.answer);
    state.feedback = {
      round: state.roundIndex,
      selected: selectedIdx,
      correct: correctIdx,
      result: isCorrect ? "correct" : "wrong"
    };
    state.history.push(isCorrect ? "correct" : "wrong");

    if (isCorrect) {
      if (!state.solvedRounds.includes(state.roundIndex)) {
        state.solvedRounds.push(state.roundIndex);
      }
      const gain = 24;
      state.score += gain;

      if (state.solvedRounds.length >= impostorPuzzle.rounds.length) {
        state.status = "won";
        state.score += 36;
        window.clearTimeout(impostorAdvanceTimer);
        impostorAdvanceTimer = null;
        const streak = recordGameWin("impostor");
        completeGame("impostor");
        showGameWinModal("impostor", streak);
      showToast("Spotlight cleared.");
        burst("#impostor-section");
        persistDaily();
        renderAll();
        return;
      }

      showToast(`Correct. +${gain} points.`);
      persistDaily();
      renderImpostor();
      window.clearTimeout(impostorAdvanceTimer);
      impostorAdvanceTimer = window.setTimeout(() => {
        advanceImpostorRound();
      }, 560);
      return;
    }

    state.status = "lost";
    state.score = Math.max(8, state.solvedRounds.length * 20);
    solveImpostorGame();
    window.clearTimeout(impostorAdvanceTimer);
    impostorAdvanceTimer = null;
    recordGameLoss("impostor");
    completeGame("impostor");
    showGameLossModal("impostor");
    showToast("Wrong pick. Answers revealed.");
    persistDaily();
    renderAll();
  }

  function advanceImpostorRound() {
    window.clearTimeout(impostorAdvanceTimer);
    impostorAdvanceTimer = null;
    const state = daily.impostor;
    if (state.status !== "playing") return;
    state.roundIndex = Math.min(state.roundIndex + 1, Math.max(0, impostorPuzzle.rounds.length - 1));
    state.selectedIndex = -1;
    state.feedback = null;
    persistDaily();
    renderImpostor();
  }

  function solveImpostorGame() {
    const state = daily.impostor;
    state.selectedIndex = -1;
    state.feedback = null;
  }

  async function surrenderImpostor() {
    const state = daily.impostor;
    if (state.status !== "playing") return;
    if (!(await confirmSurrender("Spotlight"))) return;

    state.status = "lost";
    state.score = Math.max(8, state.solvedRounds.length * 20);
    solveImpostorGame();
    window.clearTimeout(impostorAdvanceTimer);
    impostorAdvanceTimer = null;
    recordGameLoss("impostor");
    completeGame("impostor");
    showGameLossModal("impostor");
    showToast("You surrendered. Spotlight answers revealed.");
    persistDaily();
    renderAll();
  }

  function renderImpostorCast() {
    if (
      !dom.impostorCastOptions ||
      !dom.impostorCastMeta ||
      !dom.impostorCastCheckBtn ||
      !dom.impostorCastClearBtn ||
      !dom.impostorCastTitle ||
      !dom.impostorCastSub
    ) {
      return;
    }

    const state = daily.impostorCast;
    const lockedSet = new Set(uniqueNormalizedValues(state.lockedCorrect));
    const answerSet = new Set(impostorCastPuzzle.answers.map((name) => normalize(name)));
    const selectedSet = new Set(state.selected.filter((idx) => Number.isInteger(idx) && idx >= 0 && idx < impostorCastPuzzle.options.length));

    dom.impostorCastTitle.textContent = `Select every cast member from "${impostorCastPuzzle.workTitle}".`;
    dom.impostorCastSub.textContent = "Choose one or more actors, then press Check. A wrong pick ends the game.";
    dom.impostorCastOptions.innerHTML = "";

    impostorCastPuzzle.options.forEach((actor, idx) => {
      const key = normalize(actor);
      const button = document.createElement("button");
      button.type = "button";
      button.className = "impostor-cast-option";
      button.dataset.index = String(idx);
      button.textContent = actor;

      if (selectedSet.has(idx)) {
        button.classList.add("selected");
      }

      if (lockedSet.has(key)) {
        button.classList.add("correct");
      }

      if (state.status === "lost") {
        if (answerSet.has(key)) {
          button.classList.add("correct");
        } else if (state.wrongSelection.includes(idx)) {
          button.classList.add("wrong");
        }
      }

      if (state.status !== "playing" || lockedSet.has(key)) {
        button.disabled = true;
      }

      button.addEventListener("click", onImpostorCastOptionClick);
      dom.impostorCastOptions.appendChild(button);
    });

    const found = lockedSet.size;
    const needed = answerSet.size;
    if (state.status === "won") {
      dom.impostorCastMeta.textContent = `Solved ${needed}/${needed} in ${state.attempts} checks | Score ${state.score}`;
    } else if (state.status === "lost") {
      dom.impostorCastMeta.textContent = "";
    } else {
      dom.impostorCastMeta.textContent = `Found ${found}/${needed} | Checks ${state.attempts} | Score ${state.score}`;
    }

    dom.impostorCastCheckBtn.disabled = state.status !== "playing" || selectedSet.size === 0;
    dom.impostorCastClearBtn.disabled = state.status !== "playing" || selectedSet.size === 0;
    if (dom.impostorCastSurrenderBtn) dom.impostorCastSurrenderBtn.disabled = state.status !== "playing";
  }

  function onImpostorCastOptionClick(event) {
    const state = daily.impostorCast;
    if (state.status !== "playing") return;

    const idx = Number(event.currentTarget.dataset.index);
    if (!Number.isInteger(idx)) return;
    if (idx < 0 || idx >= impostorCastPuzzle.options.length) return;

    const actor = impostorCastPuzzle.options[idx];
    const lockedSet = new Set(uniqueNormalizedValues(state.lockedCorrect));
    if (lockedSet.has(normalize(actor))) return;

    if (state.selected.includes(idx)) {
      state.selected = state.selected.filter((entry) => entry !== idx);
    } else {
      state.selected = [...state.selected, idx];
    }

    persistDaily();
    renderImpostorCast();
  }

  function clearImpostorCastSelection() {
    const state = daily.impostorCast;
    if (state.status !== "playing") return;
    state.selected = [];
    persistDaily();
    renderImpostorCast();
  }

  function submitImpostorCast() {
    const state = daily.impostorCast;
    if (state.status !== "playing") return;

    const selected = state.selected.filter((idx) => Number.isInteger(idx) && idx >= 0 && idx < impostorCastPuzzle.options.length);
    if (!selected.length) {
      showToast("Select at least one actor.");
      return;
    }

    const answerSet = new Set(impostorCastPuzzle.answers.map((name) => normalize(name)));
    const selectedActors = selected.map((idx) => impostorCastPuzzle.options[idx]);
    const wrongActors = selectedActors.filter((name) => !answerSet.has(normalize(name)));

    state.attempts += 1;

    if (wrongActors.length > 0) {
      state.history.push("fail");
      state.status = "lost";
      state.wrongSelection = selected.slice();
      state.selected = [];
      state.score = Math.max(12, uniqueNormalizedValues(state.lockedCorrect).length * 18);
      recordGameLoss("impostorCast");
      completeGame("impostorCast");
      showGameLossModal("impostorCast");
      showToast(`Wrong pick: ${wrongActors[0]}`);
      persistDaily();
      renderAll();
      return;
    }

    state.history.push("pass");
    const lockedSet = new Set(uniqueNormalizedValues(state.lockedCorrect));
    let added = 0;
    selectedActors.forEach((actor) => {
      const key = normalize(actor);
      if (answerSet.has(key) && !lockedSet.has(key)) {
        state.lockedCorrect.push(actor);
        lockedSet.add(key);
        added += 1;
      }
    });

    state.selected = [];
    state.wrongSelection = [];
    if (lockedSet.size >= answerSet.size) {
      state.status = "won";
      state.score = Math.max(90, 220 - (state.attempts - 1) * 26);
      const streak = recordGameWin("impostorCast");
      completeGame("impostorCast");
      showGameWinModal("impostorCast", streak);
      showToast("Impostor solved.");
      burst("#impostor-cast-section");
    } else if (added > 0) {
      showToast(`Correct. Locked ${added} cast member${added > 1 ? "s" : ""}.`);
    } else {
      showToast("Those picks were already confirmed.");
    }

    persistDaily();
    renderAll();
  }

  async function surrenderImpostorCast() {
    const state = daily.impostorCast;
    if (state.status !== "playing") return;
    if (!(await confirmSurrender("Impostor"))) return;

    state.status = "lost";
    state.selected = [];
    state.wrongSelection = [];
    state.score = Math.max(12, uniqueNormalizedValues(state.lockedCorrect).length * 18);
    recordGameLoss("impostorCast");
    completeGame("impostorCast");
    showGameLossModal("impostorCast");
    showToast("You surrendered. Impostor cast answers revealed.");
    persistDaily();
    renderAll();
  }

  function evaluateMoviedleGuess(guessLetters, targetLetters) {
    const result = Array(guessLetters.length).fill("absent");
    const remaining = {};

    for (let i = 0; i < targetLetters.length; i += 1) {
      const targetChar = targetLetters[i];
      const guessChar = guessLetters[i];
      if (guessChar === targetChar) {
        result[i] = "exact";
      } else {
        remaining[targetChar] = (remaining[targetChar] || 0) + 1;
      }
    }

    for (let i = 0; i < guessLetters.length; i += 1) {
      if (result[i] === "exact") continue;
      const guessChar = guessLetters[i];
      if ((remaining[guessChar] || 0) > 0) {
        result[i] = "present";
        remaining[guessChar] -= 1;
      }
    }

    return result;
  }

  function evaluatePlotleGuess(guess, target) {
    const yearDiff = Math.abs(guess.year - target.year);
    const guessGenres = new Set(guess.genres);
    const targetGenres = new Set(target.genres);
    const guessCast = new Set(guess.cast.map((name) => normalize(name)));
    const targetCast = new Set(target.cast.map((name) => normalize(name)));

    let genreMatches = 0;
    targetGenres.forEach((genre) => {
      if (guessGenres.has(genre)) genreMatches += 1;
    });

    let castMatches = 0;
    targetCast.forEach((actor) => {
      if (guessCast.has(actor)) castMatches += 1;
    });

    const tags = [];
    if (yearDiff === 0) {
      tags.push({ label: "Year exact", className: "good" });
    } else if (yearDiff <= 5) {
      tags.push({ label: `Year +/-${yearDiff}`, className: "mid" });
    } else {
      tags.push({ label: `Year far (${yearDiff})`, className: "bad" });
    }

    if (genreMatches >= 2) {
      tags.push({ label: `${genreMatches} genre matches`, className: "good" });
    } else if (genreMatches === 1) {
      tags.push({ label: "1 genre match", className: "mid" });
    } else {
      tags.push({ label: "No genre match", className: "bad" });
    }

    if (castMatches >= 1) {
      tags.push({ label: `${castMatches} cast match`, className: "good" });
    } else {
      tags.push({ label: "No cast match", className: "bad" });
    }

    return tags;
  }

  function buildPlotleClues(target) {
    const decade = Math.floor(target.year / 10) * 10;
    const lead = target.cast[0] || "Unknown actor";
    const genre = target.genres[0] || "Unknown genre";
    return [
      `Released in the ${decade}s.`,
      `Starts with "${target.title[0]}".`,
      `Lead cast includes ${lead}.`,
      `Primary genre: ${genre}.`,
      `Contains ${target.title.split(" ").length} word(s).`,
      target.clue
    ];
  }

  function completeGame(name) {
    if (!daily.gamesCompleted.includes(name)) {
      daily.gamesCompleted.push(name);
    }

    if (daily.gamesCompleted.length >= totalGameCount) {
      finalizeDailyRewards();
    }
  }

  function finalizeDailyRewards() {
    const score = totalDailyScore();
    if (!daily.rewardsGiven) {
      profile.xp += score;
      daily.rewardsGiven = true;
    }

    if (!daily.streakCredited) {
      const prev = profile.lastCompleteDate;
      const yesterday = formatDateKey(new Date(today.getTime() - 24 * 60 * 60 * 1000));
      if (prev === todayKey) {
        // no-op
      } else if (prev === yesterday) {
        profile.streak = (profile.streak || 0) + 1;
      } else {
        profile.streak = 1;
      }
      profile.longestStreak = Math.max(profile.longestStreak || 0, profile.streak || 0);
      profile.lastCompleteDate = todayKey;
      daily.streakCredited = true;
      showToast(`Daily run complete. Streak ${profile.streak}.`);
    }

    persistProfile();
    persistDaily();
  }

  function normalizeGameStats(stats) {
    const input = stats && typeof stats === "object" ? stats : {};
    const output = {};
    gameKeys.forEach((key) => {
      const current = input[key] && typeof input[key] === "object" ? input[key] : {};
      output[key] = {
        streak: Number.isFinite(Number(current.streak)) ? Math.max(0, Math.round(Number(current.streak))) : 0,
        longest: Number.isFinite(Number(current.longest)) ? Math.max(0, Math.round(Number(current.longest))) : 0,
        lastWonDate: typeof current.lastWonDate === "string" ? current.lastWonDate : "",
        lastLostDate: typeof current.lastLostDate === "string" ? current.lastLostDate : ""
      };
    });
    return output;
  }

  function recordGameWin(gameName) {
    if (!profile.gameStats || !profile.gameStats[gameName]) {
      profile.gameStats = normalizeGameStats(profile.gameStats);
    }

    const stats = profile.gameStats[gameName];
    if (stats.lastWonDate === todayKey) {
      return stats.streak || 0;
    }

    const yesterday = formatDateKey(new Date(today.getTime() - 24 * 60 * 60 * 1000));
    if (stats.lastWonDate === yesterday) {
      stats.streak = (stats.streak || 0) + 1;
    } else {
      stats.streak = 1;
    }

    stats.longest = Math.max(stats.longest || 0, stats.streak || 0);
    stats.lastWonDate = todayKey;
    persistProfile();
    return stats.streak;
  }

  function recordGameLoss(gameName) {
    if (!profile.gameStats || !profile.gameStats[gameName]) {
      profile.gameStats = normalizeGameStats(profile.gameStats);
    }

    const stats = profile.gameStats[gameName];
    if (stats.lastLostDate === todayKey) {
      return stats.streak || 0;
    }

    stats.streak = 0;
    stats.lastLostDate = todayKey;
    persistProfile();
    return stats.streak;
  }

  function ensureWinModal() {
    if (winModal) return winModal;

    const overlay = document.createElement("div");
    overlay.className = "win-modal";
    overlay.innerHTML = `
      <div class="win-modal-card" role="dialog" aria-modal="true" aria-labelledby="win-modal-title">
        <h3 id="win-modal-title">You won!</h3>
        <p id="win-modal-text"></p>
        <div class="win-modal-actions">
          <button type="button" class="btn btn-secondary win-modal-challenge">Challenge A Friend</button>
          <button type="button" class="btn btn-primary win-modal-share">Share Result</button>
          <button type="button" class="btn btn-ghost win-modal-close">Close</button>
        </div>
      </div>
    `;

    const titleNode = overlay.querySelector("#win-modal-title");
    const textNode = overlay.querySelector("#win-modal-text");
    const shareBtn = overlay.querySelector(".win-modal-share");
    const challengeBtn = overlay.querySelector(".win-modal-challenge");
    const closeBtn = overlay.querySelector(".win-modal-close");

    const close = () => overlay.classList.remove("show");
    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) close();
    });
    if (closeBtn) closeBtn.addEventListener("click", close);
    if (shareBtn) {
      shareBtn.addEventListener("click", () => {
        copyText(buildShareText());
      });
    }
    if (challengeBtn) {
      challengeBtn.addEventListener("click", async () => {
        const text = "Beat my CineClash score today.";
        const didShare = await shareWithNativeSheet(text, challengeLink);
        if (!didShare) {
          copyText(challengeLink);
        }
      });
    }
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && overlay.classList.contains("show")) {
        close();
      }
    });

    document.body.appendChild(overlay);
    winModal = { overlay, titleNode, textNode };
    return winModal;
  }

  function showGameWinModal(gameName, streak) {
    const modal = ensureWinModal();
    const gameLabel = gameLabels[gameName] || "Game";
    const score = gameScore(gameName);
    const card = modal.overlay.querySelector(".win-modal-card");
    if (card) card.classList.remove("lost");
    if (modal.titleNode) {
      modal.titleNode.textContent = "You won!";
    }
    if (modal.textNode) {
      modal.textNode.textContent = `${gameLabel} streak: ${streak} | Score: ${score}`;
    }
    modal.overlay.classList.add("show");
  }

  function showGameLossModal(gameName) {
    const modal = ensureWinModal();
    const gameLabel = gameLabels[gameName] || "Game";
    const score = gameScore(gameName);
    const card = modal.overlay.querySelector(".win-modal-card");
    if (card) card.classList.add("lost");
    if (modal.titleNode) {
      modal.titleNode.textContent = "You lost!";
    }
    if (modal.textNode) {
      modal.textNode.textContent = `${gameLabel} score: ${score}`;
    }
    modal.overlay.classList.add("show");
  }

  async function shareWithNativeSheet(text, url) {
    if (!navigator.share) return false;
    try {
      await navigator.share({ title: "CineClash", text: String(text || ""), url: String(url || "") });
      return true;
    } catch (error) {
      if (error && error.name === "AbortError") return true;
      return false;
    }
  }

  function renderHaulSummary() {
    if (!dom.haulSummary) return;

    const finished = daily.gamesCompleted.length >= totalGameCount;
    const score = totalDailyScore();
    const solvedGrid = daily.grid.answers.filter(Boolean).length;
    const solvedConn = daily.connections.solvedGroupIds.length;
    const plotleGuesses = daily.plotle.status === "won" ? daily.plotle.guesses.length : "X";
    const moviedleGuesses = daily.moviedle.status === "won" ? daily.moviedle.guesses.length : "X";
    const spotlightSolved = daily.impostor.solvedRounds.length;
    const spotlightTotal = impostorPuzzle.rounds.length;
    const impostorFound = uniqueNormalizedValues(daily.impostorCast.lockedCorrect).length;
    const impostorTotal = impostorCastPuzzle.answers.length;

    if (!finished) {
      dom.haulSummary.textContent = `Progress: Grid ${solvedGrid}/9, Connections ${solvedConn}/4, Plotle ${plotleGuesses}/6, Moviedle ${moviedleGuesses}/6, Spotlight ${spotlightSolved}/${spotlightTotal}, Impostor ${impostorFound}/${impostorTotal}. Finish all ${totalGameCount} to lock your daily score card.`;
      return;
    }

    const tier = tierFromXP(profile.xp);
    const rankText = score >= 560 ? "Box Office Titan" : score >= 420 ? "Blockbuster" : score >= 300 ? "Crowd Favorite" : "Cult Classic";
    dom.haulSummary.textContent = `Final score ${score}. Rank: ${rankText}. Current profile tier: ${tier}. Invite friends with your code ${profile.referralCode}.`;
  }

  function hydrateDatalist() {
    if (!dom.movieOptions) return;
    const options =
      page === "grid" && gridPuzzle.answerType === "actor"
        ? actorOptions
        : [...movies.map((movie) => movie.title)].sort((a, b) => a.localeCompare(b));
    dom.movieOptions.innerHTML = options.map((item) => `<option value="${escapeHtml(item)}"></option>`).join("");
  }

  function wireEvents() {
    if (dom.gridSubmitBtn) {
      dom.gridSubmitBtn.addEventListener("click", submitGridGuess);
    }
    if (dom.gridSurrenderBtn) {
      dom.gridSurrenderBtn.addEventListener("click", surrenderGrid);
    }
    if (dom.gridInput) {
      dom.gridInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          submitGridGuess();
        }
      });
    }

    if (dom.connectionsSubmitBtn) {
      dom.connectionsSubmitBtn.addEventListener("click", submitConnections);
    }
    if (dom.connectionsClearBtn) {
      dom.connectionsClearBtn.addEventListener("click", clearConnectionSelection);
    }
    if (dom.connectionsSurrenderBtn) {
      dom.connectionsSurrenderBtn.addEventListener("click", surrenderConnections);
    }

    if (dom.plotleSubmitBtn) {
      dom.plotleSubmitBtn.addEventListener("click", submitPlotle);
    }
    if (dom.plotleSurrenderBtn) {
      dom.plotleSurrenderBtn.addEventListener("click", surrenderPlotle);
    }
    if (dom.plotleInput) {
      dom.plotleInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          submitPlotle();
        }
      });
    }

    if (dom.moviedleSubmitBtn) {
      dom.moviedleSubmitBtn.addEventListener("click", submitMoviedle);
    }
    if (dom.moviedleSurrenderBtn) {
      dom.moviedleSurrenderBtn.addEventListener("click", surrenderMoviedle);
    }
    if (dom.moviedleInput) {
      dom.moviedleInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          submitMoviedle();
        }
      });
    }
    document.addEventListener("keydown", onMoviedleGlobalKeydown);

    if (dom.impostorCheckBtn) {
      dom.impostorCheckBtn.addEventListener("click", submitImpostor);
    }
    if (dom.impostorClearBtn) {
      dom.impostorClearBtn.addEventListener("click", clearImpostorSelection);
    }
    if (dom.impostorSurrenderBtn) {
      dom.impostorSurrenderBtn.addEventListener("click", surrenderImpostor);
    }
    if (dom.impostorCastCheckBtn) {
      dom.impostorCastCheckBtn.addEventListener("click", submitImpostorCast);
    }
    if (dom.impostorCastClearBtn) {
      dom.impostorCastClearBtn.addEventListener("click", clearImpostorCastSelection);
    }
    if (dom.impostorCastSurrenderBtn) {
      dom.impostorCastSurrenderBtn.addEventListener("click", surrenderImpostorCast);
    }

    if (dom.copyHaulBtn) {
      dom.copyHaulBtn.addEventListener("click", () => copyText(buildShareText()));
    }
    if (dom.copyFinalBtn) {
      dom.copyFinalBtn.addEventListener("click", () => copyText(buildShareText()));
    }
    if (dom.copyLinkBtn) {
      dom.copyLinkBtn.addEventListener("click", () => copyText(challengeLink));
    }
    if (dom.challengeBtn) {
      dom.challengeBtn.addEventListener("click", () => {
        const text = encodeURIComponent(buildShareText());
        const url = `https://twitter.com/intent/tweet?text=${text}`;
        window.open(url, "_blank", "noopener,noreferrer");
      });
    }
  }

  function buildShareText() {
    const gridSolved = daily.grid.answers.filter(Boolean).length;
    const connSolved = daily.connections.solvedGroupIds.length;
    const plotleResult = daily.plotle.status === "won" ? `${daily.plotle.guesses.length}/6` : "X/6";
    const moviedleResult = daily.moviedle.status === "won" ? `${daily.moviedle.guesses.length}/6` : "X/6";
    const spotlightTotal = impostorPuzzle.rounds.length;
    const spotlightResult =
      daily.impostor.status === "won"
        ? `${spotlightTotal}/${spotlightTotal}`
        : daily.impostor.status === "lost"
          ? `X/${spotlightTotal}`
          : `${daily.impostor.solvedRounds.length}/${spotlightTotal}`;
    const impostorTotal = impostorCastPuzzle.answers.length;
    const impostorResult =
      daily.impostorCast.status === "won"
        ? `${impostorTotal}/${impostorTotal}`
        : daily.impostorCast.status === "lost"
          ? `X/${impostorTotal}`
          : `${uniqueNormalizedValues(daily.impostorCast.lockedCorrect).length}/${impostorTotal}`;
    const score = totalDailyScore();

    const lines = [
      `CineClash ${todayKey}`,
      `Score ${score} | Streak ${profile.streak || 0}`,
      `Movie Grid ${gridSolved}/9`,
      gridEmojiBoard(),
      `Cast Connections ${connSolved}/4`,
      connectionsEmojiBoard(),
      `Plotle ${plotleResult}`,
      plotleEmojiRow(),
      `Moviedle ${moviedleResult}`,
      moviedleEmojiRow(),
      `Spotlight ${spotlightResult}`,
      spotlightEmojiRow(),
      `Impostor ${impostorResult}`,
      impostorCastEmojiRow(),
      `Play: ${challengeLink}`
    ];

    return lines.join("\n");
  }

  function gridEmojiBoard() {
    const cells = daily.grid.answers.map((title) => (title ? "🟩" : "⬛"));
    return `${cells.slice(0, 3).join("")}\n${cells.slice(3, 6).join("")}\n${cells.slice(6, 9).join("")}`;
  }

  function connectionsEmojiBoard() {
    if (daily.connections.history.length === 0) return "⬜⬜⬜⬜";
    const emojiByGroup = ["🟪", "🟦", "🟩", "🟨"];
    return daily.connections.history
      .slice(0, 6)
      .map((attempt) => {
        const unique = new Set(attempt);
        if (unique.size === 1) return emojiByGroup[attempt[0]].repeat(4);
        return attempt.map((groupId) => emojiByGroup[groupId] || "🟥").join("");
      })
      .join("\n");
  }

  function plotleEmojiRow() {
    if (daily.plotle.guesses.length === 0) return "⬜";
    return daily.plotle.guesses
      .map((guess) => {
        if (normalize(guess.title) === normalize(plotleTarget.title)) return "🟩";
        const score = guess.tags.reduce((acc, tag) => acc + (tag.className === "good" ? 2 : tag.className === "mid" ? 1 : 0), 0);
        if (score >= 4) return "🟨";
        return "🟥";
      })
      .join("");
  }

  function moviedleEmojiRow() {
    if (!daily.moviedle.guesses.length) return "⬜";
    return daily.moviedle.guesses
      .map((guess) => {
        if (guess.letters === moviedleTargetLetters) return "🟩";
        if (guess.feedback.some((item) => item === "exact" || item === "present")) return "🟨";
        return "⬛";
      })
      .join("");
  }

  function spotlightEmojiRow() {
    if (!daily.impostor.history.length) return "⬜";
    return daily.impostor.history.map((entry) => (entry === "correct" ? "🟩" : "🟥")).join("");
  }

  function impostorCastEmojiRow() {
    if (!daily.impostorCast.history.length) return "⬜";
    return daily.impostorCast.history.map((entry) => (entry === "pass" ? "🟩" : "🟥")).join("");
  }

  function totalDailyScore() {
    return (
      (daily.grid.score || 0) +
      (daily.connections.score || 0) +
      (daily.plotle.score || 0) +
      (daily.moviedle.score || 0) +
      (daily.impostor.score || 0) +
      (daily.impostorCast.score || 0)
    );
  }

  function gameScore(gameName) {
    const value = Number(daily && daily[gameName] && daily[gameName].score);
    if (!Number.isFinite(value)) return 0;
    return Math.max(0, Math.round(value));
  }

  function buildGridPuzzle(template) {
    const rows = template.rows.slice();
    const cols = template.cols.slice();
    const rowType = template.rowType || "actor";
    const colType = template.colType || "genre";
    const answerType = template.answerType || "title";
    const intersections = [];

    for (let row = 0; row < 3; row += 1) {
      for (let col = 0; col < 3; col += 1) {
        const rowValue = rows[row];
        const columnValue = cols[col];
        const valid = buildGridCellOptions({
          rowType,
          rowValue,
          colType,
          colValue: columnValue,
          answerType
        });
        intersections.push(valid);
      }
    }

    const valid = intersections.every((entry) => entry.length > 0);

    return {
      valid,
      rows,
      cols,
      rowType,
      colType,
      answerType,
      cornerLabel: `${gridAxisLabel(rowType)} x ${gridAxisLabel(colType)}`,
      intersections
    };
  }

  function buildGridSignature(puzzle) {
    const rowPart = puzzle.rows.map((value) => normalize(value)).join(",");
    const colPart = puzzle.cols.map((value) => normalize(value)).join(",");
    return [puzzle.rowType, puzzle.colType, puzzle.answerType, rowPart, colPart].join("|");
  }

  function gridAxisLabel(axisType) {
    if (axisType === "genre") return "Genre";
    if (axisType === "title") return "Title";
    return "Actor";
  }

  function buildGridCellOptions({ rowType, rowValue, colType, colValue, answerType }) {
    if (answerType === "actor" && rowType === "title" && colType === "title") {
      const rowMovie = movieMap.get(normalize(rowValue));
      const colMovie = movieMap.get(normalize(colValue));
      if (!rowMovie || !colMovie) return [];

      const colCast = new Set(colMovie.cast.map((name) => normalize(name)));
      const sharedActors = rowMovie.cast.filter((name) => colCast.has(normalize(name)));
      const uniqueActors = [...new Set(sharedActors.map((name) => actorNameMap.get(normalize(name)) || name))];
      return uniqueActors
        .map((actor) => ({ value: actor, popularity: actorPopularityScore(actor) }))
        .sort((a, b) => b.popularity - a.popularity);
    }

    const matchingTitles = movies.filter(
      (movie) => movieMatchesGridAxis(movie, rowType, rowValue) && movieMatchesGridAxis(movie, colType, colValue)
    );

    if (answerType === "actor") {
      const actorSet = new Set();
      matchingTitles.forEach((movie) => {
        movie.cast.forEach((actor) => actorSet.add(actorNameMap.get(normalize(actor)) || actor));
      });
      return [...actorSet]
        .map((actor) => ({ value: actor, popularity: actorPopularityScore(actor) }))
        .sort((a, b) => b.popularity - a.popularity);
    }

    return matchingTitles
      .map((movie) => ({ value: movie.title, popularity: movie.popularity }))
      .sort((a, b) => b.popularity - a.popularity);
  }

  function movieMatchesGridAxis(movie, axisType, axisValue) {
    if (axisType === "genre") {
      return movie.genres.some((item) => normalize(item) === normalize(axisValue));
    }
    if (axisType === "title") {
      return normalize(movie.title) === normalize(axisValue);
    }
    return movie.cast.some((name) => normalize(name) === normalize(axisValue));
  }

  function actorPopularityScore(actorName) {
    const freq = actorFrequency.get(normalize(actorName)) || 1;
    return Math.max(1, Math.min(100, freq * 8));
  }

  function hasUniqueGridFill(intersections) {
    const ordered = intersections
      .map((options, idx) => ({ idx, options }))
      .sort((a, b) => a.options.length - b.options.length);

    const used = new Set();
    const maxOptionsPerCell = 24;

    const solve = (cursor) => {
      if (cursor >= ordered.length) return true;
      const options = ordered[cursor].options.slice(0, maxOptionsPerCell);
      for (const option of options) {
        const key = normalize(option.value);
        if (used.has(key)) continue;
        used.add(key);
        if (solve(cursor + 1)) return true;
        used.delete(key);
      }
      return false;
    };

    return solve(0);
  }

  function buildEmergencyGridTemplate(movieCatalog) {
    const withCast = movieCatalog.filter((movie) => Array.isArray(movie.cast) && movie.cast.length > 0);
    if (withCast.length < 3) return null;

    // Guaranteed non-empty intersections: each title intersects with itself by cast.
    const titles = withCast.slice(0, 3).map((movie) => movie.title);
    return {
      rows: titles,
      cols: titles,
      rowType: "title",
      colType: "title",
      answerType: "actor"
    };
  }

  function buildDailyGridTemplate(movieCatalog, dayHash, fallbackTemplates) {
    const actorGenreMap = new Map();
    const actorCoactorMap = new Map();
    const titleCoTitleMap = new Map();
    const actorTitleMap = new Map();
    const actorMovieCount = new Map();
    const genreCount = new Map();
    const titleCandidates = [];

    movieCatalog.forEach((movie) => {
      const uniqueActors = [...new Set(movie.cast)];
      const uniqueGenres = [...new Set(movie.genres)];

      uniqueGenres.forEach((genre) => {
        genreCount.set(genre, (genreCount.get(genre) || 0) + 1);
      });

      uniqueActors.forEach((actor) => {
        actorMovieCount.set(actor, (actorMovieCount.get(actor) || 0) + 1);
        if (!actorGenreMap.has(actor)) {
          actorGenreMap.set(actor, new Set());
        }
        if (!actorCoactorMap.has(actor)) {
          actorCoactorMap.set(actor, new Set());
        }
        uniqueGenres.forEach((genre) => actorGenreMap.get(actor).add(genre));

        const actorKey = normalize(actor);
        if (!actorTitleMap.has(actorKey)) actorTitleMap.set(actorKey, new Set());
        actorTitleMap.get(actorKey).add(movie.title);
      });

      uniqueActors.forEach((actor) => {
        uniqueActors.forEach((coactor) => {
          if (normalize(actor) === normalize(coactor)) return;
          actorCoactorMap.get(actor)?.add(coactor);
        });
      });

      if (uniqueActors.length >= 2) {
        titleCandidates.push(movie.title);
      }
    });

    const rankedTitleCandidates = [...new Set(titleCandidates)]
      .map((title) => movieMap.get(normalize(title)))
      .filter(Boolean)
      .sort(compareMoviesByRank)
      .map((movie) => movie.title);

    const rankedTitleSet = new Set(rankedTitleCandidates.map((title) => normalize(title)));
    rankedTitleCandidates.forEach((title) => titleCoTitleMap.set(title, new Set()));

    actorTitleMap.forEach((titles) => {
      const candidateTitles = [...titles].filter((title) => rankedTitleSet.has(normalize(title)));
      if (candidateTitles.length < 2) return;

      for (let i = 0; i < candidateTitles.length - 1; i += 1) {
        const titleA = candidateTitles[i];
        for (let j = i + 1; j < candidateTitles.length; j += 1) {
          const titleB = candidateTitles[j];
          if (normalize(titleA) === normalize(titleB)) continue;
          titleCoTitleMap.get(titleA)?.add(titleB);
          titleCoTitleMap.get(titleB)?.add(titleA);
        }
      }
    });

    const genreCandidates = [...genreCount.entries()]
      .filter(([, count]) => count >= 6)
      .map(([genre]) => genre);

    const actorCandidates = [...actorMovieCount.entries()]
      .filter(([, count]) => count >= 3)
      .sort((a, b) => b[1] - a[1])
      .map(([actor]) => actor);

    const rng = rngFromSeed(`${dayHash}-grid-template`);
    const genreOrder = shuffle(genreCandidates, rng);
    const actorOrder = shuffle(actorCandidates, rng);
    const titleOrder = shuffle(rankedTitleCandidates.slice(), rng);

    const tryActorGenreTemplate = () => {
      for (let attempt = 0; attempt < 24; attempt += 1) {
        const cols = shuffle(genreOrder.slice(), rng).slice(0, 3);
        if (cols.length < 3) continue;

        const compatibleActors = actorOrder.filter((actor) => cols.every((genre) => actorGenreMap.get(actor)?.has(genre)));
        if (compatibleActors.length < 3) continue;

        const rows = compatibleActors.slice(0, 3);
        const template = { rows, cols, rowType: "actor", colType: "genre" };
        if (buildGridPuzzle(template).valid) {
          return template;
        }
      }
      return null;
    };

    const tryActorActorTemplate = () => {
      for (let attempt = 0; attempt < 30; attempt += 1) {
        const rows = shuffle(actorOrder.slice(), rng).slice(0, 3);
        if (rows.length < 3) continue;

        const rowSet = new Set(rows.map((name) => normalize(name)));
        const cols = actorOrder.filter((actor) => {
          if (rowSet.has(normalize(actor))) return false;
          return rows.every((rowActor) => actorCoactorMap.get(rowActor)?.has(actor));
        });

        if (cols.length < 3) continue;

        const template = {
          rows,
          cols: shuffle(cols.slice(), rng).slice(0, 3),
          rowType: "actor",
          colType: "actor"
        };

        if (buildGridPuzzle(template).valid) {
          return template;
        }
      }
      return null;
    };

    const tryTitleTitleTemplate = () => {
      for (let attempt = 0; attempt < 40; attempt += 1) {
        const rows = shuffle(titleOrder.slice(), rng).slice(0, 3);
        if (rows.length < 3) continue;

        const rowSet = new Set(rows.map((title) => normalize(title)));
        const cols = titleOrder.filter((title) => {
          if (rowSet.has(normalize(title))) return false;
          return rows.every((rowTitle) => titleCoTitleMap.get(rowTitle)?.has(title));
        });

        if (cols.length < 3) continue;

        const template = {
          rows,
          cols: shuffle(cols.slice(), rng).slice(0, 3),
          rowType: "title",
          colType: "title",
          answerType: "actor"
        };

        if (buildGridPuzzle(template).valid) {
          return template;
        }
      }
      return null;
    };

    const modeOrder = [tryTitleTitleTemplate, tryActorActorTemplate, tryActorGenreTemplate];

    for (const buildTemplate of modeOrder) {
      const candidate = buildTemplate();
      if (candidate) return candidate;
    }

    const fallbackPool = fallbackTemplates.map((template) => ({
      ...template,
      rowType: "actor",
      colType: "genre",
      answerType: "title"
    }));
    const fallback = fallbackPool.find((template) => buildGridPuzzle(template).valid);
    return fallback || fallbackPool[dayHash % fallbackPool.length];
  }

  function buildDailyConnectionsPuzzle(movieCatalog, dayHash) {
    const voteThresholds = [50000, 30000, 20000, 10000, 5000, 2500];
    const blockedGenres = new Set(["documentary", "news", "talk show", "game show", "reality tv", "short", "music"]);
    const plans = [
      ["genre", "genre", "actor", "decade"],
      ["genre", "actor", "actor", "decade"],
      ["genre", "genre", "actor", "actor"],
      ["genre", "genre", "decade", "decade"],
      ["genre", "actor", "decade", "genre"]
    ];

    for (const minVotes of voteThresholds) {
      const filtered = movieCatalog
        .filter((movie) => parseVotesValue(movie?.votes) >= minVotes)
        .filter((movie) => Array.isArray(movie?.cast) && movie.cast.length >= 2)
        .filter((movie) => !isLikelyNonMovieSpecial(movie?.title, movie?.genres, movie?.description));
      if (filtered.length < 40) continue;

      const rng = rngFromSeed(`${dayHash}-connections-mixed-${minVotes}`);
      const candidateGroups = {
        genre: buildConnectionGenreGroups(filtered, rng, blockedGenres),
        actor: buildConnectionActorGroups(filtered, rng),
        decade: buildConnectionDecadeGroups(filtered, rng)
      };

      for (const plan of plans) {
        const selection = selectConnectionsGroupsByPlan(candidateGroups, plan, rng);
        if (!selection) continue;
        return {
          title: buildConnectionsPuzzleTitle(selection),
          groups: selection.map((group) => ({ name: group.name, items: group.items }))
        };
      }

      const fallbackSelection = selectAnyMixedConnectionsGroups(candidateGroups, rng, 4);
      if (fallbackSelection) {
        return {
          title: buildConnectionsPuzzleTitle(fallbackSelection),
          groups: fallbackSelection.map((group) => ({ name: group.name, items: group.items }))
        };
      }
    }

    return null;
  }

  function buildConnectionGenreGroups(movieCatalog, rng, blockedGenres) {
    const buckets = new Map();

    movieCatalog.forEach((movie) => {
      const mainGenre = pickMainGenreForConnections(movie.genres);
      const key = normalizeGenreToken(mainGenre);
      if (!mainGenre || blockedGenres.has(key)) return;
      if (!buckets.has(mainGenre)) buckets.set(mainGenre, []);
      buckets.get(mainGenre).push(movie);
    });

    const groups = [];
    buckets.forEach((entries, genre) => {
      const items = pickConnectionItemsFromMovies(entries, rng);
      if (!items) return;
      groups.push({
        type: "genre",
        key: `genre:${normalizeGenreToken(genre)}`,
        name: `${genre} Movies`,
        items
      });
    });

    return shuffle(groups, rng);
  }

  function buildConnectionActorGroups(movieCatalog, rng) {
    const buckets = new Map();

    movieCatalog.forEach((movie) => {
      const uniqueCast = [...new Set((movie.cast || []).map((actor) => actorNameMap.get(normalize(actor)) || actor))];
      uniqueCast.forEach((actor) => {
        const key = normalize(actor);
        if (!key) return;
        if (!buckets.has(actor)) buckets.set(actor, []);
        buckets.get(actor).push(movie);
      });
    });

    const groups = [];
    buckets.forEach((entries, actor) => {
      const reuseCount = actorFrequency.get(normalize(actor)) || entries.length;
      if (reuseCount < 4) return;
      const items = pickConnectionItemsFromMovies(entries, rng);
      if (!items) return;

      groups.push({
        type: "actor",
        key: `actor:${normalize(actor)}`,
        name: `Movies With ${actor}`,
        items,
        weight: reuseCount
      });
    });

    return shuffle(
      groups
        .sort((a, b) => (b.weight || 0) - (a.weight || 0) || a.name.localeCompare(b.name))
        .slice(0, 120)
        .map(({ weight, ...group }) => group),
      rng
    );
  }

  function buildConnectionDecadeGroups(movieCatalog, rng) {
    const buckets = new Map();

    movieCatalog.forEach((movie) => {
      const year = Number(movie?.year);
      if (!Number.isFinite(year)) return;
      const decade = Math.floor(year / 10) * 10;
      if (decade < 1930 || decade > 2030) return;
      const label = `${decade}s`;
      if (!buckets.has(label)) buckets.set(label, []);
      buckets.get(label).push(movie);
    });

    const groups = [];
    buckets.forEach((entries, label) => {
      const items = pickConnectionItemsFromMovies(entries, rng);
      if (!items) return;
      groups.push({
        type: "decade",
        key: `decade:${label}`,
        name: `${label} Movies`,
        items
      });
    });

    return shuffle(groups, rng);
  }

  function pickConnectionItemsFromMovies(entries, rng) {
    const ranked = dedupeCatalogByTitle(entries).sort(compareMoviesByRank);
    if (ranked.length < 4) return null;
    const pool = ranked.slice(0, Math.min(28, ranked.length));
    const items = shuffle(pool.map((movie) => movie.title), rng).slice(0, 4);
    if (items.length < 4) return null;
    return items;
  }

  function selectConnectionsGroupsByPlan(candidatesByType, plan, rng) {
    const selected = [];
    const usedGroupKeys = new Set();
    const usedTitles = new Set();
    const poolByType = {};

    [...new Set(plan)].forEach((type) => {
      poolByType[type] = shuffle((candidatesByType[type] || []).slice(), rng);
    });

    function dfs(step) {
      if (step >= plan.length) return true;
      const type = plan[step];
      const pool = poolByType[type] || [];
      for (const group of pool) {
        if (!group || usedGroupKeys.has(group.key)) continue;
        const keys = group.items.map((title) => normalize(title));
        if (keys.some((key) => usedTitles.has(key))) continue;

        selected.push(group);
        usedGroupKeys.add(group.key);
        keys.forEach((key) => usedTitles.add(key));

        if (dfs(step + 1)) return true;

        selected.pop();
        usedGroupKeys.delete(group.key);
        keys.forEach((key) => usedTitles.delete(key));
      }
      return false;
    }

    return dfs(0) ? selected : null;
  }

  function selectAnyMixedConnectionsGroups(candidatesByType, rng, targetCount) {
    const pool = shuffle(
      [...(candidatesByType.genre || []), ...(candidatesByType.actor || []), ...(candidatesByType.decade || [])],
      rng
    );
    const selected = [];
    const usedTitles = new Set();

    function dfs(index) {
      if (selected.length >= targetCount) {
        return selected.some((group) => group.type !== "genre");
      }
      if (index >= pool.length) return false;

      for (let i = index; i < pool.length; i += 1) {
        const group = pool[i];
        const keys = group.items.map((title) => normalize(title));
        if (keys.some((key) => usedTitles.has(key))) continue;

        selected.push(group);
        keys.forEach((key) => usedTitles.add(key));
        if (dfs(i + 1)) return true;
        selected.pop();
        keys.forEach((key) => usedTitles.delete(key));
      }

      return false;
    }

    return dfs(0) ? selected : null;
  }

  function buildConnectionsPuzzleTitle(groups) {
    const types = new Set((groups || []).map((group) => group.type));
    if (types.has("genre") && types.has("actor") && types.has("decade")) return "Mixed Categories";
    if (types.has("actor") && types.has("decade")) return "Cast & Era Mix";
    if (types.has("actor")) return "Cast Mix";
    if (types.has("decade")) return "Era Mix";
    return "Genre Mix";
  }

  function pickMainGenreForConnections(genres) {
    if (!Array.isArray(genres) || genres.length === 0) return "";

    let best = "";
    let bestScore = Number.POSITIVE_INFINITY;

    genres.forEach((genre, idx) => {
      const value = String(genre || "").trim();
      if (!value) return;
      const score = scoreConnectionGenrePriority(value, idx);
      if (score < bestScore) {
        best = value;
        bestScore = score;
      }
    });

    return best || String(genres[0] || "").trim();
  }

  function scoreConnectionGenrePriority(rawGenre, index) {
    const token = normalizeGenreToken(rawGenre);
    const ordered = {
      drama: 1,
      crime: 2,
      thriller: 3,
      mystery: 4,
      comedy: 5,
      romance: 6,
      action: 7,
      "sci fi": 8,
      horror: 9,
      animation: 10,
      fantasy: 11,
      family: 12,
      biography: 13,
      history: 14,
      war: 15,
      western: 16,
      sport: 17,
      musical: 18,
      adventure: 19,
      documentary: 20
    };
    const base = Object.prototype.hasOwnProperty.call(ordered, token) ? ordered[token] : 80;
    return base * 10 + index;
  }

  function normalizeGenreToken(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
  }

  function buildDailyImpostorPuzzle(movieCatalog, dayHash) {
    const actorPool = [...new Set(movieCatalog.flatMap((movie) => (Array.isArray(movie.cast) ? movie.cast : [])))];
    const eligibleWorks = movieCatalog.filter((movie) => {
      const uniqueCast = [...new Set((movie.cast || []).map((name) => normalize(name)))];
      return movie.title && uniqueCast.length >= 3;
    });

    if (eligibleWorks.length < 3 || actorPool.length < 12) return null;

    const rng = rngFromSeed(`${dayHash}-impostor`);
    const rounds = [];
    const usedTitles = new Set();
    const targetRounds = Math.min(5, Math.max(3, eligibleWorks.length >= 5 ? 5 : eligibleWorks.length));
    const clueTemplates = [
      (title) => `Part of the cast of "${title}"`,
      (title) => `Credited cast member in "${title}"`,
      (title) => `Which actor appears in "${title}"?`
    ];

    const shuffledWorks = shuffle(eligibleWorks, rng);
    for (const work of shuffledWorks) {
      if (rounds.length >= targetRounds) break;
      const titleKey = normalize(work.title);
      if (!titleKey || usedTitles.has(titleKey)) continue;

      const cast = [...new Set(work.cast.map((actor) => actorNameMap.get(normalize(actor)) || actor))];
      if (cast.length < 2) continue;

      const answer = cast[Math.floor(rng() * cast.length)];
      const castSet = new Set(cast.map((actor) => normalize(actor)));
      const distractorPool = actorPool.filter((actor) => !castSet.has(normalize(actor)));
      if (distractorPool.length < 5) continue;

      const distractors = shuffle(distractorPool, rng).slice(0, 5);
      const options = shuffle([answer, ...distractors], rng);

      rounds.push({
        clue: clueTemplates[Math.floor(rng() * clueTemplates.length)](work.title),
        workTitle: work.title,
        answer,
        options
      });
      usedTitles.add(titleKey);
    }

    if (rounds.length < 3) return null;

    return {
      title: "Spotlight",
      rounds
    };
  }

  function buildImpostorSignature(puzzle) {
    if (!puzzle || !Array.isArray(puzzle.rounds)) return "";
    return puzzle.rounds.map((round) => `${normalize(round.workTitle)}:${normalize(round.answer)}`).join("|");
  }

  function buildDailyImpostorCastPuzzle(movieCatalog, dayHash) {
    const eligible = movieCatalog.filter((movie) => {
      const uniqueCast = [...new Set((movie.cast || []).map((name) => normalize(name)))];
      return movie.title && uniqueCast.length >= 4;
    });
    if (!eligible.length) return null;

    const actorPool = [...new Set(movieCatalog.flatMap((movie) => (Array.isArray(movie.cast) ? movie.cast : [])))];
    if (actorPool.length < 16) return null;

    const rng = rngFromSeed(`${dayHash}-impostor-cast`);
    const target = shuffle(eligible, rng)[0];
    if (!target) return null;

    const cast = [...new Set(target.cast.map((actor) => actorNameMap.get(normalize(actor)) || actor))];
    const answerCount = Math.min(5, Math.max(4, cast.length >= 5 ? 5 : 4));
    const answers = shuffle(cast, rng).slice(0, answerCount);
    const answerSet = new Set(answers.map((name) => normalize(name)));
    const distractorPool = actorPool
      .map((actor) => actorNameMap.get(normalize(actor)) || actor)
      .filter((actor) => !answerSet.has(normalize(actor)));
    if (distractorPool.length < 9 - answers.length) return null;

    const distractors = shuffle([...new Set(distractorPool)], rng).slice(0, 9 - answers.length);
    const options = shuffle([...answers, ...distractors], rng);
    if (options.length !== 9) return null;

    return {
      workTitle: target.title,
      answers,
      options
    };
  }

  function buildImpostorCastSignature(puzzle) {
    if (!puzzle) return "";
    return `${normalize(puzzle.workTitle)}|${puzzle.answers.map((name) => normalize(name)).join(",")}`;
  }

  function resolveCatalogMovies(fallbackCatalog, runtimeCatalog) {
    const runtime = Array.isArray(runtimeCatalog)
      ? dedupeCatalogByTitle(runtimeCatalog.map(sanitizeMovieRecord).filter(Boolean))
      : [];
    if (runtime.length >= 40 && hasViableGrid(runtime) && hasViableConnections(runtime)) {
      return runtime;
    }
    return dedupeCatalogByTitle(fallbackCatalog.map(sanitizeMovieRecord).filter(Boolean));
  }

  function sanitizeMovieRecord(record) {
    if (!record || typeof record !== "object") return null;
    const rawTitle =
      typeof record.title === "string"
        ? record.title
        : typeof record.names === "string"
          ? record.names
          : typeof record["movie name"] === "string"
            ? record["movie name"]
            : "";
    const title = rawTitle.trim();
    if (!title) return null;

    const year = Number(parseYearValue(record.year ?? record.date_x));
    const safeYear = Number.isFinite(year) ? Math.max(1900, Math.min(2100, Math.round(year))) : 2000;

    const genres = parseGenreList(record.genre ?? record.genres);
    const cast =
      record.stars != null || record.cast != null
        ? parseStarsList(record.stars ?? record.cast)
        : parseCrewMembersList(record.crew);

    if (!genres.length || !cast.length) return null;

    const duration = typeof record.duration === "string" ? record.duration.trim() : "";
    const safeRating = parseRatingValue(record.rating ?? record.score);
    const safeVotes = parseVotesValue(record.votes ?? record.budbet_x ?? record.budget_x);
    const rawDescription =
      typeof record.description === "string"
        ? record.description.trim()
        : typeof record.overview === "string"
          ? record.overview.trim()
          : typeof record.clue === "string"
            ? record.clue.trim()
            : "";
    const description = normalizeDescriptionText(rawDescription);
    if (isLikelyNonMovieSpecial(title, genres, description)) return null;

    const popularity = Number(record.popularity);
    const safePopularity = Number.isFinite(popularity)
      ? Math.max(1, Math.min(100, Math.round(popularity)))
      : scorePopularityFromRatingVotes(safeRating, safeVotes);

    let clue = description;
    if (!clue) {
      clue = `${title} is a ${genres[0]} title released in ${safeYear}.`;
    }

    return {
      title,
      year: safeYear,
      duration,
      genre: genres.join(", "),
      rating: safeRating,
      description: description || clue,
      stars: cast.slice(0, 6),
      votes: safeVotes,
      genres: genres.slice(0, 4),
      cast: cast.slice(0, 6),
      popularity: safePopularity,
      clue
    };
  }

  function parseYearValue(value) {
    const raw = String(value || "");
    const match = raw.match(/(\d{4})/);
    return match ? Number(match[1]) : Number(raw);
  }

  function parseGenreList(input) {
    if (Array.isArray(input)) {
      return [...new Set(input.map((genre) => String(genre || "").trim()).filter(Boolean))];
    }

    return [...new Set(
      String(input || "")
        .split(",")
        .map((genre) => String(genre || "").trim())
        .filter(Boolean)
    )];
  }

  function parseStarsList(input) {
    if (Array.isArray(input)) {
      return [...new Set(input.map((name) => String(name || "").trim()).filter(Boolean))];
    }

    const raw = String(input || "").trim();
    if (!raw) return [];

    const out = [];
    const regex = /'((?:\\'|[^'])*)'/g;
    let match = regex.exec(raw);
    while (match) {
      const name = String(match[1] || "")
        .replace(/\\'/g, "'")
        .replace(/,\s*$/, "")
        .trim();
      if (name) out.push(name);
      match = regex.exec(raw);
    }

    if (out.length) {
      return normalizeStarsList(out);
    }

    return normalizeStarsList(
      raw
        .replace(/^\[/, "")
        .replace(/\]$/, "")
        .split(",")
        .map((name) => String(name || "").replace(/^['"]|['"]$/g, "").trim())
        .filter(Boolean)
    );
  }

  function parseCrewMembersList(input) {
    const raw = String(input || "").trim();
    if (!raw) return [];

    const parts = raw
      .replace(/^\[/, "")
      .replace(/\]$/, "")
      .split(",")
      .map((name) => String(name || "").replace(/^['"]|['"]$/g, "").trim())
      .filter(Boolean);

    if (parts.length >= 4) {
      const evenParts = parts.filter((_value, index) => index % 2 === 0);
      if (evenParts.length >= 2) return normalizeStarsList(evenParts);
    }

    return normalizeStarsList(parts);
  }

  function parseRatingValue(value) {
    const numeric = Number(String(value || "").replace(",", "."));
    if (!Number.isFinite(numeric)) return 0;
    if (numeric > 10) {
      return Math.max(0, Math.min(10, Number((numeric / 10).toFixed(1))));
    }
    return Math.max(0, Math.min(10, Number(numeric.toFixed(1))));
  }

  function normalizeDescriptionText(value) {
    const text = String(value || "").replace(/\s+/g, " ").trim();
    return text.replace(/\s*(?:\.{3}|…)?\s*see\s+full\s+(?:summary|synopsis)\s*»?\s*$/i, "").trim();
  }

  function isLikelyNonMovieSpecial(title, genres, description) {
    const titleText = String(title || "").toLowerCase();
    const descText = String(description || "").toLowerCase();
    const genreTokens = (Array.isArray(genres) ? genres : []).map((genre) => normalize(String(genre || "")));

    if (genreTokens.some((genre) => ["news", "talk show", "game show", "reality tv"].includes(genre))) {
      return true;
    }

    if (/\b(?:season\s*\d+|episode\s*\d+)\b/i.test(titleText)) return true;
    if (/\bthe oscars\b/i.test(titleText)) return true;
    if (/\bseries\b[:\s-]/i.test(titleText)) return true;

    const awardPattern =
      /\b(?:\d{1,3}(?:st|nd|rd|th)\s+)?(?:annual\s+)?(?:golden globe|primetime emmy|screen actors guild|academy awards?|grammy|bafta|independent spirit awards?)\b/i;
    if (awardPattern.test(titleText)) return true;
    if (/\bawards?\b/i.test(titleText) && /\b(golden globe|emmy|screen actors guild|academy|grammy|bafta|spirit awards?)\b/i.test(titleText)) {
      return true;
    }
    if (/\baward ceremony\b/i.test(`${titleText} ${descText}`)) return true;
    if (/\b(featurette|electronic press kit|behind the scenes|date announcement commercial|for your consideration)\b/i.test(`${titleText} ${descText}`)) {
      return true;
    }
    if (/\b(docuseries|miniseries)\b/i.test(descText)) return true;

    return false;
  }

  function parseVotesValue(value) {
    if (Number.isFinite(Number(value))) return Math.max(0, Math.round(Number(value)));
    const digits = String(value || "").replace(/[^0-9]/g, "");
    const numeric = Number(digits);
    if (!Number.isFinite(numeric)) return 0;
    return Math.max(0, Math.round(numeric));
  }

  function scorePopularityFromRatingVotes(rating, votes) {
    const voteScore = Math.min(100, Math.round((Math.log10(Math.max(1, votes) + 1) / 6) * 100));
    const ratingScore = Math.min(100, Math.max(0, Math.round((rating / 10) * 100)));
    return Math.max(1, Math.min(100, Math.round(voteScore * 0.7 + ratingScore * 0.3)));
  }

  function compareMoviesByRank(a, b) {
    const votesA = parseVotesValue(a?.votes);
    const votesB = parseVotesValue(b?.votes);
    if (votesB !== votesA) return votesB - votesA;

    const ratingA = parseRatingValue(a?.rating);
    const ratingB = parseRatingValue(b?.rating);
    if (ratingB !== ratingA) return ratingB - ratingA;

    const popularityA = Number(a?.popularity) || 0;
    const popularityB = Number(b?.popularity) || 0;
    if (popularityB !== popularityA) return popularityB - popularityA;

    const yearA = Number(a?.year) || 0;
    const yearB = Number(b?.year) || 0;
    if (yearB !== yearA) return yearB - yearA;

    return String(a?.title || "").localeCompare(String(b?.title || ""));
  }

  function compareMoviesByDifficultyScore(a, b) {
    const popularityA = Number(a?.popularity) || 0;
    const popularityB = Number(b?.popularity) || 0;
    if (popularityB !== popularityA) return popularityB - popularityA;

    const votesA = parseVotesValue(a?.votes);
    const votesB = parseVotesValue(b?.votes);
    if (votesB !== votesA) return votesB - votesA;

    const ratingA = parseRatingValue(a?.rating);
    const ratingB = parseRatingValue(b?.rating);
    if (ratingB !== ratingA) return ratingB - ratingA;

    const yearA = Number(a?.year) || 0;
    const yearB = Number(b?.year) || 0;
    if (yearB !== yearA) return yearB - yearA;

    return String(a?.title || "").localeCompare(String(b?.title || ""));
  }

  function resolveDifficultyMoviePool(rankedCatalog, difficulty) {
    const source = Array.isArray(rankedCatalog) ? rankedCatalog : [];
    if (!source.length) return [];

    const cap =
      difficulty === "easy"
        ? 400
        : difficulty === "medium"
          ? 1000
          : source.length;
    const capped = source.slice(0, Math.min(cap, source.length));

    // Keep requested cap but avoid crashes if intersections become impossible.
    if (hasViableGrid(capped) && hasViableConnections(capped)) {
      return capped;
    }
    if (difficulty === "easy") {
      const fallback = source.slice(0, Math.min(1000, source.length));
      if (hasViableGrid(fallback) && hasViableConnections(fallback)) return fallback;
    }
    return source;
  }

  function normalizeStarsList(stars) {
    const list = Array.isArray(stars) ? stars.map((name) => String(name || "").trim()).filter(Boolean) : [];
    const splitIndex = list.lastIndexOf("|");
    const candidateList = splitIndex >= 0 ? list.slice(splitIndex + 1) : list;

    return [...new Set(
      candidateList.filter((value) => {
        const lower = String(value || "").toLowerCase().replace(/:$/, "");
        if (!value || value === "|") return false;
        if (lower === "star" || lower === "stars" || lower === "director" || lower === "directors") return false;
        return true;
      })
    )];
  }

  function dedupeCatalogByTitle(movieCatalog) {
    const bestByTitle = new Map();

    movieCatalog.forEach((movie) => {
      const key = normalize(movie?.title);
      if (!key) return;

      const current = bestByTitle.get(key);
      if (!current || compareMoviesByRank(movie, current) < 0) {
        bestByTitle.set(key, movie);
      }
    });

    return [...bestByTitle.values()];
  }

  function hasViableGrid(movieCatalog) {
    const actorGenres = new Map();
    const genreSet = new Set();
    const titles = [];

    movieCatalog.forEach((movie) => {
      const uniqueGenres = [...new Set(movie.genres)];
      uniqueGenres.forEach((genre) => genreSet.add(genre));
      [...new Set(movie.cast)].forEach((actor) => {
        if (!actorGenres.has(actor)) actorGenres.set(actor, new Set());
        uniqueGenres.forEach((genre) => actorGenres.get(actor).add(genre));
      });
      if ([...new Set(movie.cast)].length >= 2) {
        titles.push(movie.title);
      }
    });

    const genres = [...genreSet];
    if (genres.length >= 3) {
      for (let i = 0; i < genres.length - 2; i += 1) {
        for (let j = i + 1; j < genres.length - 1; j += 1) {
          for (let k = j + 1; k < genres.length; k += 1) {
            const cols = [genres[i], genres[j], genres[k]];
            const actors = [...actorGenres.entries()]
              .filter(([, actorGenreSet]) => cols.every((genre) => actorGenreSet.has(genre)))
              .map(([actor]) => actor);
            if (actors.length >= 3) return true;
          }
        }
      }
    }

    const titleMap = new Map(movieCatalog.map((movie) => [normalize(movie.title), movie]));
    for (let i = 0; i < titles.length - 2; i += 1) {
      const a = titleMap.get(normalize(titles[i]));
      if (!a) continue;
      const castA = new Set(a.cast.map((name) => normalize(name)));
      for (let j = i + 1; j < titles.length - 1; j += 1) {
        const b = titleMap.get(normalize(titles[j]));
        if (!b) continue;
        const sharesWithA = b.cast.some((name) => castA.has(normalize(name)));
        if (!sharesWithA) continue;
        const castB = new Set(b.cast.map((name) => normalize(name)));
        for (let k = j + 1; k < titles.length; k += 1) {
          const c = titleMap.get(normalize(titles[k]));
          if (!c) continue;
          const sharesWithB = c.cast.some((name) => castB.has(normalize(name)));
          const sharesWithC = c.cast.some((name) => castA.has(normalize(name)));
          if (sharesWithB && sharesWithC) return true;
        }
      }
    }

    return false;
  }

  function hasViableConnections(movieCatalog) {
    const blockedGenres = new Set(["documentary", "news", "talk show", "game show", "reality tv", "short", "music"]);
    const genreBuckets = new Map();
    const decadeBuckets = new Map();
    const actorBuckets = new Map();

    movieCatalog.forEach((movie) => {
      if (!movie || !Array.isArray(movie.cast) || movie.cast.length < 2) return;
      if (isLikelyNonMovieSpecial(movie.title, movie.genres, movie.description)) return;

      const mainGenre = pickMainGenreForConnections(movie.genres);
      const genreKey = normalizeGenreToken(mainGenre);
      if (mainGenre && !blockedGenres.has(genreKey)) {
        if (!genreBuckets.has(mainGenre)) genreBuckets.set(mainGenre, new Set());
        genreBuckets.get(mainGenre).add(movie.title);
      }

      const year = Number(movie.year);
      if (Number.isFinite(year)) {
        const decade = `${Math.floor(year / 10) * 10}s`;
        if (!decadeBuckets.has(decade)) decadeBuckets.set(decade, new Set());
        decadeBuckets.get(decade).add(movie.title);
      }

      [...new Set(movie.cast)].forEach((actor) => {
        if (!actorBuckets.has(actor)) actorBuckets.set(actor, new Set());
        actorBuckets.get(actor).add(movie.title);
      });
    });

    const genreEligible = [...genreBuckets.values()].filter((titles) => titles.size >= 4).length;
    const decadeEligible = [...decadeBuckets.values()].filter((titles) => titles.size >= 4).length;
    const actorEligible = [...actorBuckets.values()].filter((titles) => titles.size >= 4).length;
    const nonGenreEligible = decadeEligible + actorEligible;

    return (genreEligible >= 2 && nonGenreEligible >= 2) || genreEligible >= 4;
  }

  function buildConnectionsItems(puzzle, seedKey) {
    const items = [];
    puzzle.groups.forEach((group, groupId) => {
      group.items.forEach((text) => {
        items.push({ text, groupId });
      });
    });
    return shuffle(items, rngFromSeed(seedKey));
  }

  function applyReferralBonus() {
    const params = new URLSearchParams(window.location.search);
    const incoming = (params.get("ref") || "").trim().toUpperCase();
    if (!incoming) return;
    if (incoming === profile.referralCode) return;
    if (window.sessionStorage.getItem(seenRefKey) === incoming) return;

    const alreadyKnown = profile.referrals.includes(incoming);
    if (!alreadyKnown) {
      profile.referrals.push(incoming);
      profile.xp += 25;
      showToast(`Challenge accepted from ${incoming}. +25 XP.`);
    }
    window.sessionStorage.setItem(seenRefKey, incoming);
    persistProfile();
  }

  function tickLiveFeed() {
    if (!dom.liveFeed) return;

    const names = ["Maya", "Jared", "Nina", "Luis", "Ava", "Theo", "Rhea", "Omar", "Ella", "Noah"];
    const cities = ["Austin", "Miami", "Chicago", "Seattle", "Denver", "LA", "NYC", "Boston"];
    const feed = [
      "cleared Movie Grid with 2 attempts left",
      "solved Plotle in 3 guesses",
      "cracked Moviedle in 4 tries",
      "lost Connections by 1 mistake",
      "posted a score card in group chat",
      "hit a 9-day streak"
    ];

    const rng = rngFromSeed(`${todayKey}-feed`);
    const render = () => {
      const name = names[Math.floor(rng() * names.length)];
      const city = cities[Math.floor(rng() * cities.length)];
      const action = feed[Math.floor(rng() * feed.length)];
      dom.liveFeed.textContent = `${name} (${city}) ${action}.`;
    };

    render();
    window.setInterval(render, 5400);
  }

  function tierFromXP(xp) {
    if (xp >= 4000) return "Box Office Legend";
    if (xp >= 2200) return "Festival Headliner";
    if (xp >= 1200) return "Premiere Icon";
    if (xp >= 600) return "Viral Director";
    if (xp >= 250) return "Scene Stealer";
    return "Rookie Critic";
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(text)
        .then(() => showToast("Copied to clipboard."))
        .catch(() => showToast("Clipboard blocked. Copy manually."));
      return;
    }

    const helper = document.createElement("textarea");
    helper.value = text;
    helper.setAttribute("readonly", "readonly");
    helper.style.position = "absolute";
    helper.style.left = "-9999px";
    document.body.appendChild(helper);
    helper.select();
    try {
      document.execCommand("copy");
      showToast("Copied to clipboard.");
    } catch (_error) {
      showToast("Clipboard blocked. Copy manually.");
    }
    document.body.removeChild(helper);
  }

  function showToast(message) {
    if (!dom.toast) return;
    dom.toast.textContent = message;
    dom.toast.classList.add("show");
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => dom.toast.classList.remove("show"), 1700);
  }

  function burst(selector) {
    const node = document.querySelector(selector);
    if (!node) return;
    node.animate(
      [
        { transform: "scale(1)", filter: "brightness(1)" },
        { transform: "scale(1.01)", filter: "brightness(1.15)" },
        { transform: "scale(1)", filter: "brightness(1)" }
      ],
      { duration: 420, easing: "ease" }
    );
  }

  function persistDaily() {
    localStorage.setItem(dailyKey, JSON.stringify(daily));
  }

  function persistProfile() {
    localStorage.setItem(profileKey, JSON.stringify(profile));
  }

  function loadStore(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return cloneValue(fallback);
      const parsed = JSON.parse(raw);
      return { ...cloneValue(fallback), ...parsed };
    } catch (_error) {
      return cloneValue(fallback);
    }
  }

  function shuffle(items, rng) {
    const output = items.slice();
    for (let i = output.length - 1; i > 0; i -= 1) {
      const j = Math.floor(rng() * (i + 1));
      [output[i], output[j]] = [output[j], output[i]];
    }
    return output;
  }

  function rngFromSeed(text) {
    return mulberry32(hashString(text));
  }

  function mulberry32(seed) {
    let t = seed >>> 0;
    return function random() {
      t += 0x6d2b79f5;
      let x = Math.imul(t ^ (t >>> 15), 1 | t);
      x ^= x + Math.imul(x ^ (x >>> 7), 61 | x);
      return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
    };
  }

  function hashString(input) {
    let hash = 2166136261;
    for (let i = 0; i < input.length; i += 1) {
      hash ^= input.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
  }

  function normalize(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]/g, "");
  }

  function uniqueNormalizedValues(values) {
    if (!Array.isArray(values)) return [];
    const seen = new Set();
    const out = [];
    values.forEach((value) => {
      const key = normalize(value);
      if (!key || seen.has(key)) return;
      seen.add(key);
      out.push(key);
    });
    return out;
  }

  function titleLetters(value) {
    return String(value || "")
      .toUpperCase()
      .replace(/&/g, "AND")
      .replace(/[^A-Z0-9]/g, "");
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function buildReferralCode(seed) {
    const letters = "BCDFGHJKLMNPQRSTVWXYZ";
    const rng = mulberry32(seed ^ 0x13af09);
    let out = "";
    for (let i = 0; i < 6; i += 1) {
      out += letters[Math.floor(rng() * letters.length)];
    }
    return out;
  }

  function parseDayOverride(raw) {
    const value = String(raw || "").trim();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return "";
    const date = dateFromKey(value);
    if (Number.isNaN(date.getTime())) return "";
    if (formatDateKey(date) !== value) return "";
    return value;
  }

  function parseVariantOverride(raw) {
    return String(raw || "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, "")
      .slice(0, 32);
  }

  function parseDifficulty(raw) {
    const value = String(raw || "")
      .trim()
      .toLowerCase();
    if (value === "easy" || value === "medium" || value === "hard") return value;
    return "";
  }

  function readLocalStorageSafe(key) {
    try {
      return localStorage.getItem(key);
    } catch (_error) {
      return "";
    }
  }

  function writeLocalStorageSafe(key, value) {
    try {
      localStorage.setItem(key, String(value));
    } catch (_error) {
      // no-op
    }
  }

  function dateFromKey(dateKey) {
    const [year, month, day] = String(dateKey || "")
      .split("-")
      .map((part) => Number(part));
    return new Date(year, month - 1, day);
  }

  function formatDateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function cloneValue(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function q(id) {
    return document.getElementById(id);
  }

  function setText(node, value) {
    if (node) {
      node.textContent = value;
    }
  }

  function initVercelAnalytics() {
    if (typeof window === "undefined" || typeof document === "undefined") return;
    if (window.__cineclashVercelAnalyticsLoaded) return;
    window.__cineclashVercelAnalyticsLoaded = true;

    window.va =
      window.va ||
      function queueVercelAnalytics() {
        (window.vaq = window.vaq || []).push(arguments);
      };

    const script = document.createElement("script");
    script.defer = true;
    script.dataset.analytics = "vercel";
    script.src = resolveVercelAnalyticsScriptSrc();
    document.head.appendChild(script);
  }

  function resolveVercelAnalyticsScriptSrc() {
    const defaultSrc = "/_vercel/insights/script.js";
    const rawConfig = window.VERCEL_OBSERVABILITY_CLIENT_CONFIG || window.__VERCEL_OBSERVABILITY_CLIENT_CONFIG;
    if (!rawConfig) return defaultSrc;

    let parsed = rawConfig;
    if (typeof rawConfig === "string") {
      try {
        parsed = JSON.parse(rawConfig);
      } catch (_error) {
        return defaultSrc;
      }
    }

    const scriptSrc = parsed?.analytics?.scriptSrc;
    return typeof scriptSrc === "string" && scriptSrc ? scriptSrc : defaultSrc;
  }
})();
