# Mario Butir - Battleship assignment
React UI for Battleship

### Install
```
$ git clone https://github.com/mariobutir/Battleship_UI.git
$ cd PROJECT
$ npm install
```
### Configure app
Create `.env` file in root project and add environment variable `REACT_APP_API_URL`.
Assign it the root URL value of REST API.

Example:
```
REACT_APP_API_URL={backend_URL}
```

for backend URL like `http://localhost:8080/battleship-api` without "/" at the end.

### Development
```
$ npm start
```

### Deployment
```
$ npm build
```