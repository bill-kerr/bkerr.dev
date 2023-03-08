---
description: FleetWatcher material ticket aggregator and automated messenger.
github: https://github.com/bill-kerr/ticket-crawler
previewImg: /img/tickets-preview.webp
tags:
  - TypeScript
  - Express
  - CRON
  - Nodemailer
  - AWS
  - PostgreSQL
title: Ticket Crawler
weight: 1
---

# Ticket Crawler

FleetWatcher material ticket aggregator and automated messenger.

## What it does

Ticket Crawler eliminates the need to manually download and send material tickets from FleetWatcher on a daily basis. The motivation behind building the application was to standardize and automate ticket aggregation and delivery, while capturing relevant data.

Ticket Crawler finds material delivery tickets for a given date, records data for each ticket, uploads them as separate PDFs based on material type to AWS S3 storage, and emails them to recipients. This task is automated and run on a user-defined interval.

## How to use it

First, clone or fork the repository and create a local copy on your computer. Ticket Crawler runs entirely inside of Docker containers, described in the `docker-compose.yml` file. The two containers launched by the compose file require seperate `.env` files that describe their configurations.

1. Create a `.env` file in the project root directory. Below are the required configuration variables.

```
FW_USERNAME=                  # Username for access to login.fleetwatcher.com
FW_PASSWORD=                  # Password for access to login.fleetwatcher.com

PDF_SPLIT_KEY=                # Text string used to split PDF pages. Use first unique string on each page.
PDF_MUST_INCLUDE=             # String used to filter split text. Use a string that will appear on every ticket.

TICKET_CRON=                  # How and when tickets are retrieved. A valid CRON conforming to the structure: "* * * * * *"
CRON_TIMEZONE=                # A valid CRON timezone per (https://raw.githubusercontent.com/node-cron/tz-offset/master/generated/offsets.json)[this list].
MAX_RETRIES=                  # Maximum number of times TicketCrawler will re-attempt a failed task execution.
RETRY_DELAY=                  # Delay in milliseconds between retry attempts.
SEND_EMAIL_ON_ERROR=          # If set to true, will send an email when MAX_RETRIES has been reached.
ERROR_EMAIL_TARGETS=          # A comma seperated list of emails that defines the recipients of the error emails.

S3_ACCESS_KEY=                # Access key for Amazon S3 storage.
S3_SECRET_ACCESS_KEY=         # Secret access key for Amazon S3 storage.
S3_BUCKET=                    # Name of the S3 bucket to be used.
S3_REGION=                    # Region where the S3 bucket is located.
S3_DOWNLOADS_PATH=            # Path within S3 bucket to store downloaded PDFs.

EMAIL_SERVER=                 # SMTP server for sending emails.
EMAIL_PORT=                   # SMTP port for emailing.
EMAIL_USERNAME=               # Email username.
EMAIL_PASSWORD=               # Email password.
EMAIL_TARGETS=                # Comma separated list of email addresses to send emails to.
EMAIL_COPY_TARGETS=           # Comma separated list of email addresses to copy on emails sent.

PG_CONN_STRING=               # PostgreSQL connection string for connecting to the database. Should be in the form "postgres://<username>:<password>@db/<table_name>"

TICKET_DAY_OFFSET=            # Days in the past relative to current date to generate tickets.
TICKET_DAY_START_TIME=        # Start time in format hh:mm before which tickets will not be generated. Defaults to 0:00.
TICKET_DAY_END_TIME=          # End time in format hh:mm after which tickets will not be generated. Defaults to 23:59.
```

2. Create a `db.env` file in the root project directory for database configuration. Below are the required configuration variables.

```
POSTGRES_PASSWORD=            # Password for the PostgreSQL process.
POSTGRES_DB=                  # Database name to use for storing ticket records.
```

3. Launch the application with `docker-compose up -d`.

4. OPTIONAL: You may use the prebuilt Docker image hosted on DockerHub at bk7987/ticket-crawler. You must still provide configuration files and a database image. I suggest using your own docker-compose.yml file similar to the following:

```yaml
version: "3.8"

services:
  db:
    image: postgres:12
    restart: always
    env_file:
      - db.env
    volumes:
      - pgdata:/var/lib/postgresql/data
  crawler:
    image: bk7987/ticket-crawler
    restart: always
    env_file:
      - .env

volumes:
  pgdata:
```

Then simply run `docker-compose up --build -d`.

## How it's built

Ticket Crawler is written completely in Typescript and runs inside of two Docker containers. The first container contains all of the application logic and the second contains the database which holds application data.

The application begins by intiating a CRON job that runs on a predefined interval determined by the configuration settings. The CRON job initiates a task that runs on the predefined interval.

The task starts by first launching a [Puppeteer](https://github.com/puppeteer/puppeteer) process, which crawls the FleetWatcher website for tickets generated on the previous day. When the tickets for a particular day are found, a request to download the PDF containing all of the tickets is intercepted by Ticket Crawler, which attaches all required Auth headers and sends the request to the FleetWatcher endpoint. The response data (PDF file) is piped directly to an S3 bucket.

Once the PDF file is saved to AWS S3 storage, it is read by a PDF parser and split into individual tickets, which are saved to the database. The parser extracts all required information from each page of the PDF and creates new tickets with the appropriate data.

These ticket data objects, along with their source PDF file, are then used to create separate PDF files based on the ticket material. Each file will be named based on the date and material and will contain all of the tickets for the given material. These files will then be added to the AWS S3 bucket, prepended with a path matching the material name.

Once the individual ticket PDFs have been saved in the S3 bucket, they are attached to an email and sent to the intended recipients.
