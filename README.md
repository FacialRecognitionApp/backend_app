# Please type these commands to start server side:

``` bash
npm install
```
``` bash
npm start
```
## User

### Test the backend api is working
``` bash
GET http://localhost:7000/user/

res output
"Hi api!"
```

### Add new user record
``` bash
POST http://localhost:7000/user/create_new_user

Sample axios
axios({
	method: 'POST',
	url: 'http://localhost:7000/user/create_new_user',
	data: { email: 'dfew@dsf.com' },
}).then(res => {
	console.log(res.data);
});

Sample res data output
{ success: false, message: 'Please provide valid email address' }
{ success: false, message: 'Sorry, this email address is already taken' }
{ success: false, message: 'Can not create new user' }
{ success: true, message: 'Create user successful', user_id: 1 }

```

## Video

### Test the backend api is working
``` bash
GET http://localhost:7000/video/

res output
"Hi api!"
```

### API to upload video file
``` bash
POST http://localhost:7000/video/upload_file

Sample axios
axios({
	method: 'post',
	url: 'http://localhost:7000/video/upload_file',
	data: UploadFile,
	params: {
		user_id: 10
	},
	headers: {
		'Content-Type': 'multipart/form-data;charset=UTF-8'
	}
}).then(res => {
	console.log(res.data);
});

Sample res data output
{ success: false, message: 'Please give your correct user id' }
{ success: false, message: 'Sorry, user is not existed' }
{ success: false, message: 'Sorry, video can not be upload' }
{ success: true, message: 'Video upload successful' }

```

## Survey




