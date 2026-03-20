# CommitScript
**AI-powered PR analysis for developer content creation.**

TODO:
- Setup Sequelize to easily connect to SQLite db
- Fetch the users repositories from github using the token stored in SQLite db
- All the user to select the repo they want to work out of, and pull it using their access token
- Chunk the repository by file, and feed it to the LLM as context to write the script based off the future selected PR
