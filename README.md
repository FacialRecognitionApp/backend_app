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
GET http://localhost:7000/api/user/

res output
"Hi api!"
```

### Add new user record
``` bash
POST http://localhost:7000/api/user/create_new_user

Sample axios
axios({
	method: 'POST',
	url: 'http://localhost:7000/api/user/create_new_user',
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
GET http://localhost:7000/api/video/

res output
"Hi api!"
```

### Get all the video type questions
``` bash
GET http://localhost:7000/api/video/get_video_question_type

Sample res data output
{ success: false, message: 'Can not find video question types' }
{
    "success": true,
    "message": "Get video question type successful",
    "data": [
        {
            "video_type_id": 4,
            "video_type_content": "Brow furrow",
            "video_duration": 10,
            "image_url": "https://survey-assets-mohawk-dev.s3.ca-central-1.amazonaws.com/emotions/BrowFurrow.png"
        },
        {
            "video_type_id": 1,
            "video_type_content": "Closed-mouth smile",
            "video_duration": 10,
            "image_url": "https://survey-assets-mohawk-dev.s3.ca-central-1.amazonaws.com/emotions/CloseMouthedSmile.png"
        },
        {
            "video_type_id": 3,
            "video_type_content": "Frown",
            "video_duration": 10,
            "image_url": "https://survey-assets-mohawk-dev.s3.ca-central-1.amazonaws.com/emotions/Frown.png"
        },
        {
            "video_type_id": 5,
            "video_type_content": "Wink with left eye",
            "video_duration": 10,
            "image_url": "https://survey-assets-mohawk-dev.s3.ca-central-1.amazonaws.com/emotions/LeftEyeWink.png"
        },
        {
            "video_type_id": 2,
            "video_type_content": "Open-mouth smile",
            "video_duration": 10,
            "image_url": "https://survey-assets-mohawk-dev.s3.ca-central-1.amazonaws.com/emotions/OpenMouthedSmile.png"
        },
        {
            "video_type_id": 6,
            "video_type_content": "Wink with right eye",
            "video_duration": 10,
            "image_url": "https://survey-assets-mohawk-dev.s3.ca-central-1.amazonaws.com/emotions/RightEyeWink.png"
        }
    ]
}
```

### API to upload video file
``` bash
POST http://localhost:7000/api/video/upload_file

Sample axios
axios({
	method: 'post',
	url: 'http://localhost:7000/api/video/upload_file',
	data: formData,
	params: {
		user_id: 10,
        video_type_id: 2
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
{ success: true, message: 'Video upload successful', url: "https://survey-videos-mohawk-dev.s3.amazonaws.com/														1615226000334.jpg" }

```

## Survey

### Test the backend api is working
``` bash
GET http://localhost:7000/api/survey/

res output
"Hi api!"
```

### Get all survey questions
``` bash
GET http://localhost:7000/api/survey/survey_questions

Sample res data output
{ success: false, message: 'Can not find questions' }
{
    "success": true,
    "message": "Get question list successful",
    "data": [
        {
            "survey_question_id": 1,
            "question_content": "Out of the following, which facial gestures were the most difficult to produce. Please rate them with 6 being the hardest, 1 being the easiest to produce.",
            "question_type_id": 1,
            "type_name": "Rating",
            "rating_questions": [
                {
                    "rating_question_id": 1,
                    "rating_question_content": "Closed-mouth smile"
                },
                {
                    "rating_question_id": 2,
                    "rating_question_content": "Open-mouth smile"
                },
                {
                    "rating_question_id": 3,
                    "rating_question_content": "Frown"
                },
                {
                    "rating_question_id": 4,
                    "rating_question_content": "Brow furrow"
                },
                {
                    "rating_question_id": 5,
                    "rating_question_content": "Wink with left eye"
                },
                {
                    "rating_question_id": 6,
                    "rating_question_content": "Wink with right eye"
                }
            ]
        },
        {
            "survey_question_id": 2,
            "question_content": "What facial gesture would you want to use to activate your turn signals?",
            "question_type_id": 2,
            "type_name": "Short Answer"
        },
        {
            "survey_question_id": 3,
            "question_content": "What facial gesture would you want to use to activate your windshield wipers?",
            "question_type_id": 2,
            "type_name": "Short Answer"
        },
        {
            "survey_question_id": 4,
            "question_content": "What facial gesture would you want to use to activate your horn?",
            "question_type_id": 2,
            "type_name": "Short Answer"
        },
        {
            "survey_question_id": 5,
            "question_content": "What do you think about facial gesture recognition technology being used in vehicles?",
            "question_type_id": 3,
            "type_name": "Long answer"
        }
    ]
}

```

### Send all survey question answers
``` bash
POST http://localhost:7000/api/survey/survey_answer

Sample axios
axios({
	method: 'POST',
	url: 'http://localhost:7000/api/survey/survey_answer',
	data: {
		user_id: 6,
		survey_answer: [
			{
				survey_question_id: 1,
				question_type_id: 2,
				answer_content: 'sd'
			},
			{
				survey_question_id: 2,
				question_type_id: 2,
				answer_content: 'sddfgfg'
			},
			{
				survey_question_id: 3,
				question_type_id: 3,
				answer_content: 'sdfdgfdg'
			},
			{
				survey_question_id: 2,
				question_type_id: 1,
				answer_content: [
					{
						rating_question_id: 1,
						rating: 3.2
					},
					{
						rating_question_id: 2,
						rating: 3.4
					},
				]
			}
		]
	},
}).then(res => {
	console.log(res.data);
});

Sample res data output
{ success: false, message: 'Sorry, can not update your answers' }
{ success: true, message: 'Update answer successful' }

```




