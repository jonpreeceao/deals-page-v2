AO Sticky Nav Documentation
===========================

Styling
-------

# Permutable variables (overwrite global defaults)

## To be used under the local variables sass module
*When importing the local module into the structural sass file ensure to have it above the global syle module import for correct compilation*

### SASS main

'''
@import 'susy/sass/susy';
@import 'variables';
@import 'mixins';
@import 'placeholders';
@import 'globals/variables';                   <-- 1st
@import 'AoPropositionFooter/styles';          <-- 2nd
@import 'AoStickyNav/styles';

'''

### SASS variables /globals/variables

'''
- $ao-sticky-nav-bg
- $ao-sticky-nav-font-colour
- $ao-sticky-nav-hover
- $ao-sticky-nav-mobile-tab

'''

JSON config
-----------

E.G with sub-navigation included

'''

"layout": [
				{
			"sectionId": "brandNav",
			"templateId": "AoStickyNav",
			"isGlobal": true,
			"data": {
				"navItems": [
					{
						"navClass": "TV & Audio",
						"navText": "TV & Audio",
						"navLink": "#",
						"subItems": [
							{
								"navClass": "TVs",
								"navText": "TVs",
								"navLink": "#"
							},
							{
								"navClass": "Soundbars",
								"navText": "SoundBars",
								"navLink": "#"
							},
							{
								"navClass": "HomeCinema",
								"navText": "Home Cinema",
								"navLink": "#"
							},
							{
								"navClass": "BluRay",
								"navText": "Blu Ray",
								"navLink": "#"
							},
							{
								"navClass": "tvAudioRange",
								"navText": "Shop The Range",
								"navLink": "#"
							}
						]
					},
					{
						"navClass": "computing",
						"navText": "Computing",
						"navLink": "#"
					},
					{
						"navClass": "laundry",
						"navText": "Laundry",
						"navLink": "#",
						"subItems": [
							{
								"navClass": "WashingMachines",
								"navText": "Washing Machines",
								"navLink": "#"
							},
							{
								"navClass": "Washer Dryers",
								"navText": "Washer Dryers",
								"navLink": "#"
							},
							{
								"navClass": "Tumble Dryers",
								"navText": "Tumble Dryers",
								"navLink": "#"
							},
						    {
								"navClass": "laundryRange",
								"navText": "Shop The Range",
								"navLink": "#"
							}
						]
					},
					{
						"navClass": "dishwashers",
						"navText": "Dishwashers",
						"navLink": "#"
					},
					{
						"navClass": "refrigeration",
						"navText": "Refrigeration",
						"navLink": "#",
						"subItems": [
							{
								"navClass": "Fridges",
								"navText": "Fridges",
								"navLink": "#"
							},
							{
								"navClass": "Freezers",
								"navText": "Freezers",
								"navLink": "#"
							},
							{
								"navClass": "FridgeFreezers",
								"navText": "Fridges",
								"navLink": "#"
							},
							{
								"navClass": "AmericanFridgeFreezers",
								"navText": "American Fridge Freezers",
								"navLink": "#"
							},
							{
								"navClass": "coolingRange",
								"navText": "Shop The Range",
								"navLink": "#"
							}
						]
					},
					{
						"navClass": "cooking",
						"navText": "Cooking",
						"subItems": [
							{
								"navClass": "Ovens",
								"navText": "Ovens",
								"navLink": "#"
							},
							{
								"navClass": "Hobs",
								"navText": "Hobs",
								"navLink": "#"
							},
							{
								"navClass": "Hoods",
								"navText": "Hoods",
								"navLink": "#"
							}
						]
					},
					{
						"navClass": "microwaves",
						"navText": "Microwaves",
						"navLink": "#"
					}
				],
				"brandImage": "img/tab.png"
			}
		},

'''
