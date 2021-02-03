## Please type these commands to start server side:

``` bash
npm install
```
``` bash
npm start
```

### API URL:
#### Test the backend api is working
``` bash
GET http://localhost:7000/video/

res output
"Hi api!"
```

#### API to upload video file
``` bash
POST http://localhost:7000/video/upload_file

res output
Upload successful:
data:{ success: true }

Upload Fail:
data:{ success: false }

```