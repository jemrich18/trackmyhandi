# TrackMyHandi API

A Django REST Framework backend for [trackmyhandi.com](https://trackmyhandi.com) — an unofficial WHS handicap tracker for golfers who want to track their game without the cost of a full USGA membership.

## Features

- JWT authentication (register, login, token refresh)
- WHS handicap index calculation from saved rounds
- Round logging with full course conditions and personal reflection notes
- Premium tier with AI-powered caddy insights and trend analysis
- Stripe subscription billing ($10/year)

## Tech Stack

- Python 3.12
- Django 5 + Django REST Framework
- PostgreSQL (Railway)
- SimpleJWT for authentication
- Stripe for payments
- Deployed on Railway

## Local Development

### Prerequisites

- Python 3.12+
- [uv](https://github.com/astral-sh/uv)
- PostgreSQL (or SQLite for local dev)

### Setup

```bash
git clone https://github.com/yourusername/trackmyhandi-api.git
cd trackmyhandi-api

uv sync

cp .env.example .env
# fill in your environment variables

uv run python manage.py migrate
uv run python manage.py createsuperuser
uv run python manage.py runserver
```


## API Endpoints

### Accounts
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/accounts/register/` | Register a new user | Public |
| POST | `/api/accounts/login/` | Login and receive JWT tokens | Public |
| POST | `/api/accounts/token/refresh/` | Refresh access token | Public |
| GET | `/api/accounts/me/` | Get current user details | Required |

### Rounds
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/rounds/` | List all rounds for current user | Required |
| POST | `/api/rounds/` | Log a new round | Required |
| GET | `/api/rounds/<id>/` | Get a specific round | Required |
| PUT | `/api/rounds/<id>/` | Update a round | Required |
| DELETE | `/api/rounds/<id>/` | Delete a round | Required |

## Data Model

### Round
| Field | Type | Description |
|-------|------|-------------|
| score | int | Adjusted gross score |
| course_name | str | Name of the course |
| course_rating | decimal | Course rating (e.g. 71.4) |
| slope_rating | int | Slope rating (e.g. 125) |
| date_played | date | Date of the round |
| weather | choice | sunny / cloudy / windy / rainy |
| wind_strength | choice | none / light / moderate / strong |
| green_speed | choice | slow / normal / fast |
| green_firmness | choice | soft / normal / firm |
| fairway_conditions | choice | wet / normal / dry / firm |
| miss_category | choice | driving / iron_play / chipping / putting / bunker |
| notes | text | Free text reflection notes |

## WHS Handicap Formula

```
Score Differential = (Adjusted Score - Course Rating) × 113 ÷ Slope Rating
```

The handicap index is calculated by averaging the best differentials from the golfer's recent rounds, scaled by the WHS lookup table, then multiplied by 0.96.

## Project Structure

```
trackmyhandi-api/
  core/           # Django project settings and root URLs
  accounts/       # Custom user model, auth endpoints
  rounds/         # Round model, serializers, views
  manage.py
  pyproject.toml
```

## Related

- [trackmyhandi-app](https://github.com/yourusername/trackmyhandi-app) — React + TypeScript frontend

## License

MIT
