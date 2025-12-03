# 🏈 Big Football

[Big Football](https://www.bigfootball.co) is a modern web application built with Next.js, designed to deliver dynamic NFL content. Each team has its own dashboard featuring:

- 📅 Game schedules and results
- 📊 Team and player statistics
- 🧑‍🤝‍🧑 Full rosters
- 🏆 Conference and division standings

Additionally, each player has his own dashboard featuring:

- 📈 Stats from the current (or the player's most recent) season
- 📜 Team history
- 📊 Career stats
- 📰 Latest news

The app uses dynamic routing, type safety, and modular React components to ensure maintainability and avoid code duplication. 

All data is courtesy of ESPN's NFL API, and a curated list of many of the available endpoints can be found on [@nntrn's GitHub page](https://gist.github.com/nntrn/ee26cb2a0716de0947a0a4e9a157bc1c#scoreboard-api).

Favicon: [Sport](https://icons8.com/icon/W2pGKt6brLlk/sport) icon by [Icons8](https://icons8.com).

Big Football was created and designed by [Dimitrik Johnson](https://www.dimitrik.dev/) with help from Elleni Adhanom, and it is a **work in progress**.

## 📁 Project Structure
- /app
  - [/albinoskies](https://github.com/dimitrikjohnson/nfl-project/tree/master/app/albinoskies)                    → Dynasty Fantasy Football league pages and components
  - [/apiCalls](https://github.com/dimitrikjohnson/nfl-project/tree/master/app/apiCalls)                          → API calls for various pieces of data
  - [/components](https://github.com/dimitrikjohnson/nfl-project/tree/master/app/components)                      → Reusable UI elements that are used in multiple directories
  - [/data](https://github.com/dimitrikjohnson/nfl-project/tree/master/app/data)                                  → JSON data (e.g. team colors)
  - [/formatAPIcalls](https://github.com/dimitrikjohnson/nfl-project/tree/master/app/formatAPIcalls)              → Format the API response before it's sent to the JSX
  - [/helpers](https://github.com/dimitrikjohnson/nfl-project/tree/master/app/helpers)                            → Utility logic
  - [/player/playerSlug](https://github.com/dimitrikjohnson/nfl-project/tree/master/app/player/%5BplayerSlug%5D)  → Player-specific pages and components
  - [/teams](https://github.com/dimitrikjohnson/nfl-project/tree/master/app/teams)                                → Select-a-team dashboard
    - [/teamName](https://github.com/dimitrikjohnson/nfl-project/tree/master/app/teams/%5BteamName%5D)            → Team-specific pages and components
  - [/types](https://github.com/dimitrikjohnson/nfl-project/tree/master/app/types)                                → Shared TypeScript interfaces and types

## 💻 Tech Stack
- [Next.js (App Router)](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- React components


## 🔥 Upcoming Features
✅ Search functionality to search for players and teams
- Boxscores for each game
- List of each team's recently drafted players
- Detailed list of each team's currently injured players
