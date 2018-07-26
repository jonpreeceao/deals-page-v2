# Footer content pods

## Setup

### Config

Include the following in your index.json file, directly before the proposition footer:

``` json
{
	"templateId": "AoFooterContentPods",
	"isGlobal": true,
	"data": {
		"mainHeading": "Have we helped?",
		"pods": [
			{
				"heading": "example 1",
				"content": "test",
				"href": "#",
				"bgImage": "//media.ao.com/uk/computing/content-hub/img/global/girl-laptop.jpg"
			},
			{
				"heading": "example 2",
				"content": "test",
				"href": "#",
				"bgImage": "//media.ao.com/uk/computing/content-hub/img/global/Credit-girl.jpg"
			},
			{
				"heading": "example 3",
				"content": "test",
				"href": "#",
				"bgImage": "//media.ao.com/uk/computing/content-hub/img/global/guy-tablet.jpg"
			}
		]
	}
}
```

If you do not want a main heading, do not include it in the json.

### SCSS

To include the styles, simply import them in your master structure SCSS file:

``` scss
@import 'AoFooterContentPods/styles';
```
