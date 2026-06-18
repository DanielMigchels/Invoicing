# Invoicing

Invoicing management application built with Angular and .NET. Generate structured invoice PDFs.

## Features

- Manage creditors (Companies) and debtors (Customers)
- Create and manage invoices and invoice lines
- Auto-calculated invoice totals (based on invoice lines)
- PDF invoice export (Dutch-style invoice layout)

## How to Run

Instructions on how to run the application.

### Docker Compose

Compiles source code, builds docker image, and runs it along with PostgreSQL on your Docker instance.

```bash
docker compose up -d --build
```

App becomes available on port 8080 and should be reachable through HTTP. (http://localhost:8080)

### Helm Chart

Installs the app on your Kubernetes cluster.

```bash
helm install invoicing .\Invoicing.Helm\ --namespace invoicing --create-namespace
```

App becomes available on NodePort 32112 and should be reachable through HTTP. (http://localhost:32112)

## Notes

- The API automatically applies EF Core migrations on startup.
- Docker Compose uses a local PostgreSQL volume (`~/apps/postgres`) for persistence.
- JWT secret and connection string are configured via environment variables.

## Future Enhancements

- Integration with mail to automatically send.
- Payment requests (e.g. Tikkie)
