# Tailspin Toys

This repository contains the project for a 1 hour guided workshop to explore GitHub Copilot Agent Mode and related features in Visual Studio Code. The project is a website for a fictional game crowd-funding company, with a [Flask](https://flask.palletsprojects.com/en/stable/) backend using [SQLAlchemy](https://www.sqlalchemy.org/) and [Astro](https://astro.build/) frontend using [Svelte](https://svelte.dev/) for dynamic pages.

To begin the workshop, start at [docs/README.md](./docs/README.md)

Or, if just want to run the app...

## Launch the site

A script file has been created to launch the site. You can run it by:

```bash
./scripts/start-app.sh
```

Then navigate to the [website](http://localhost:4321) to see the site!

## Features

### Game Filtering
The application now supports filtering games by category and publisher to help users find games that match their interests:

- **Category Filtering**: Filter games by categories like Strategy, Puzzle, Simulation, Adventure, and Action
- **Publisher Filtering**: Filter games by publishers such as CodeForge Studios, DevMasters Inc., GitHub Games, and Ops Interactive  
- **Combined Filtering**: Apply both category and publisher filters simultaneously for more precise results
- **Active Filter Indicators**: Visual badges show which filters are currently applied
- **Clear Filters**: Easily remove individual filters or clear all filters at once
- **Responsive Design**: Filter controls work seamlessly on both desktop and mobile devices

#### API Endpoints

The backend provides the following filtering capabilities:

- `GET /api/games` - Returns all games, supports optional query parameters:
  - `category_id` - Filter by category ID
  - `publisher_id` - Filter by publisher ID
- `GET /api/categories` - Returns all available categories for filter options
- `GET /api/publishers` - Returns all available publishers for filter options

#### Example Usage

```bash
# Get all games
curl http://localhost:5100/api/games

# Get games in Strategy category (category_id=1)
curl http://localhost:5100/api/games?category_id=1

# Get games from CodeForge Studios (publisher_id=1)
curl http://localhost:5100/api/games?publisher_id=1

# Get Strategy games from CodeForge Studios
curl http://localhost:5100/api/games?category_id=1&publisher_id=1
```

## License 

This project is licensed under the terms of the MIT open source license. Please refer to the [LICENSE](./LICENSE) for the full terms.

## Maintainers 

You can find the list of maintainers in [CODEOWNERS](./.github/CODEOWNERS).

## Support

This project is provided as-is, and may be updated over time. If you have questions, please open an issue.
