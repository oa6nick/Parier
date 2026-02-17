# Pariall — Production Deployment Checklist

## Environment Variables

### Required for Production

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXTAUTH_SECRET` | Session encryption key. Generate with `openssl rand -base64 32` | (32+ char random) |
| `STORE_SECRET` | Backend JWT/session secret. Generate with `openssl rand -base64 32` | (32+ char random) |
| `KEYCLOAK_CLIENT_SECRET` | Keycloak client secret for frontend. Never leave empty. | From Keycloak admin |
| `FRONTEND_BASE_URL` | Production frontend URL (HTTPS) | `https://app.pariall.com` |
| `NEXT_PUBLIC_API_URL` | Production API URL (HTTPS) | `https://api.pariall.com` |
| `NEXTAUTH_URL` | Same as FRONTEND_BASE_URL for NextAuth | `https://app.pariall.com` |

### Optional

| Variable | Description | Default |
|----------|-------------|---------|
| `CORS_ALLOW_ORIGINS` | Comma-separated allowed origins | `FRONTEND_BASE_URL` |
| `RATE_LIMIT_RPS` | Rate limit requests per second | `10` |
| `RATE_LIMIT_BURST` | Rate limit burst size | `20` |
| `GIN_MODE` | Set to `release` for production | `debug` |

### Database

- Use strong `DB_API_PASSWORD` and `KEYCLOAK_DB_PASSWORD`
- Use managed PostgreSQL (e.g., AWS RDS, Supabase) with SSL in production

## Keycloak Configuration

### Local development (HTTP)

For `invalid_request (HTTPS required)` when logging in locally: realm must have `sslRequired: "none"` (already set in `parier-realm.json`). If the error persists after changing the realm, restart Keycloak and re-import the realm (or delete `keycloak_data` volume and run `docker-compose up` again).

### Production

1. **Valid Redirect URIs**: Add `https://your-domain.com/*` and `https://your-domain.com/api/auth/callback/keycloak`
2. **Web Origins**: Add `https://your-domain.com` (or `+` for all valid redirect URIs)
3. **Client Secret**: Create and set in `.env` for both frontend and API clients
4. **HTTPS**: Keycloak must use HTTPS in production; set `KC_HOSTNAME` to your Keycloak URL

## HTTPS

- Use nginx, Traefik, or cloud load balancer in front of the app
- Terminate TLS at the reverse proxy
- Set `FRONTEND_BASE_URL` and `NEXTAUTH_URL` to `https://` URLs

## Backend Binary

- **Do not commit** `back/server/main` to git (it is in `.gitignore`)
- Build the binary in CI/CD: `CGO_ENABLED=0 go build -o main ./cmd/main.go`
- Dockerfile already builds the binary during image build

## Production Features (Implemented)

- **CORS**: Configured via `FRONTEND_BASE_URL` and `CORS_ALLOW_ORIGINS`; no wildcard in production
- **Rate limiting**: Per-IP rate limiting on protected API routes (`RATE_LIMIT_RPS`, `RATE_LIMIT_BURST`)
- **Likes & comments**: Connected to API; no mock data for authenticated users
- **Share page**: Requires auth; uses referral API for code and stats

## Security Checklist

- [ ] All secrets changed from defaults
- [ ] `.env` not committed (in `.gitignore`)
- [ ] CORS restricted to production domains
- [ ] `GIN_MODE=release` for backend
- [ ] Keycloak redirect URIs and Web Origins configured
- [ ] HTTPS enabled for frontend and API
