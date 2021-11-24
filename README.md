# FuzzBuzz-Take-Home

This Repository contains the Take Home project for the Software Developer Position at FuzzBuzz

## Project Requirements

- Design an API that can:

  - Return a list of potential files
  - Return coverage information for a specific file

- Design a Datastore that can:
  - Get Coverage for an individual file and version
  - Get the total coverage for an individual file.
  - Ingest code coverage data in the form of a JSON file.

- Design a front-end application that displays:
  - A landing page with a list of potential files
  - A search bar that filters potential files (search within a full repo)
  - When a file is clicked, the file should be displayed with the percentage of code covered.

- Technical Constraints:
  - The frontend must be ReactJS, preferably with TypeScript

## Project Structure

The project consists of:

- A frontend react application within the `frontend/` directory
- A backend golang (gorilla/mux) application within the `backend/` directory
- **!** A `.env` file for environment variables with the `backend/` directory. **!**

### Backend

The backend contains:

1. A datastore for repositories and code coverage
   - The datastore can create, read, and update code coverage and repository data
   - Just kinda mimics a db.

2. Entities that are stored in the datastore.
   - These define the data contract for the rest API, mapping json names to members.
   - Define "business logic" for the entity. Things like calculating code coverage flattening data, etc.

3. A REST API for repository data and code coverage data.
   - Code coverage can be ingested in bulk or single test formats. (i.e the entire json file you provided or single objects).
   - For the api basically just take the structure of a repository/directory. The data provided here maps to the directories in the repository directory defined by the `.env` file.
   - I think maybe the server should have just read the data and provided it, because this does get a bit confusing. I just think of it as a "fake sftp" server.

Error messages and codes are just a guess sometimes because of time constraints. Error handling/responses could be handled better, maybe with it's own model format instead of plaintext.

### Frontend

The frontend contains:

1. React context for repository data storage

2. An API layer for communicating with the backend (repository and coverage) 

3. Visually, not much. Just a list of repositories, and the repository data. Clicking on a file will take you to the coverage page.

## Frontend Setup

Install dependencies:

```bash
npm install
```

Start the application

```bash
npm run start # Runs on port 3000
```

## Backend Setup

### Setup environment variables

**!** This project uses a .env file for environment variables. **!**

Within the .env file at the root of the backend project, two variables can be found:

```bash
REPOSITORY_DIRECTORY= # The directory that contains the repositories for the server. 
                      # e.g. /home/user/FuzzBuzz/repositories

PORT=                 # The port the server listens on.
```

### Install Dependencies

```bash
make install # Installs missing dependencies (go get)
```

### Build

```bash
make go-build
```

### Run

```bash
./bin/backend # In FuzzBuzz/backend. 
```
