# FuzzBuzz-Take-Home

This Repository contains the Take Home project for the Software Develop Position at FuzzBuzz

## Project Structure

The project consists of:

- A front-end react application within the `frontend` directory
- A back-end golang (gorilla/mux) application within the `backend` directory

## Requirements

- Design an API that can:

  - Return a list of potential files
  - Return coverage information for a specific file
  - Return coverage information for a specific file **_and_** version **(stretch goal)**

- Design a Datastore that can:
  - Get Coverage for an individual file and version
  - Get the total coverage for an individual file.
  - Ingest code coverage data in the form of a JSON file.

- Design a front-end application that displays:
  - A landing page with a list of potential files
  - A search bar that filters potential files (search within a full repo)
  - When a file is clicked, the file should be displayed with the percentage of code covered.
  - Highlights the covered code **(stretch goal)**

- Technical Constraints:
  - The frontend must be ReactJS, preferably with TypeScript

## Setup
