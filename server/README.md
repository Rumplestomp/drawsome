# server

## Drawsome REST API Documentation

(https://github.com/UTSCC09/hw3-Alxander64/tree/master/webgallery/doc)

### Users

- description: create a new user
- request: `POST /api/signup/`
    - content-type: `application/json`
    - body: object
        - username: (string) username for new user
        - password: (string) password for new user
- response: 200
    - content-type: `application/json`
    - body: user username signed up
- response: 409
    - body: user username already exists

```
$ curl -X POST
       -H "Content-Type: application/json"
       -d '{"username":"drawsome","password":"pictures"}'
       -c cookie.txt
       http://localhost:3000/api/signup/
```

- description: sign in as a user
- request: `POST /api/signin/`
    - content-type: `application/json`
    - body: object
        - username: (string) username for existing user
        - password: (string) password for existing user
- response: 200
    - content-type: `application/json`
    - body: user username signed in
- response: 401
    - body: access denied

```
$ curl -X POST
       -H "Content-Type: application/json"
       -d '{"username":"drawsome","password":"pictures"}'
       -c cookie.txt
       http://localhost:3000/api/signin/
```

- description: sign out from a user
- request: `GET /api/signout/`
    - content-type: `application/json`
- response: 200
    - content-type: `application/json`
    - redirect: `/`

```
$ curl -b cookie.txt
       -c cookie.txt
       http://localhost:3000/api/signout/
```

### Create

- description: add a new image
- request: `POST /api/image/`
    - content-type: `multipart/form-data`
    - body: object
        - image: (object) form data for the image
- response: 200
    - content-type: `application/json`
    - body: id (string)
- response: 400
    - body: missing file

```
$ curl -X POST
       -H "Content-Type: multipart/form-data"
       -F image="@/path/to/file.jpg"
       -b cookie.txt
       http://localhost:3000/api/image/
```

### Read

- description: get an image by id
- request: `GET /api/image/:id/`
- response: 200
    - content-type: `imageMimeType`
- response: 404
    - body: image id does not exist

```
$ curl -b cookie.txt
       http://localhost:3000/api/image/dRaWsOmEpIcTuReS/
```
