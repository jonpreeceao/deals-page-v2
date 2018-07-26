# AO Proposition Footer
Proposition footer used on AOL, ADE & ANL.

__Include:__ AoPropositionFooter

## Template Config Data:
If you have the global `config.lang` then the correct footer will be set. Else pass in `data.lang`.

To set a section title pass in `data.title`.

To change box three variant to `data.variant` to one of the following options:
* INSTALLATION MESSAGE *(en-GB)*: installation

__NOTE:__ The lang property value should be in the ISO Language Code format. [W3 HTML Language Code Reference](http://www.w3schools.com/tags/ref_language_codes.asp)

## JS Setup:
No JS required for this module.




EG for Merch Pod Config:

``` json
{
	"sectionId": "propositionFooter",
	"rowType": "AoPropositionFooter",
	"isGlobal": true,
	"data": {
		"header": "Why shop with AO.com?",
		"variant": "sda",
		"promos": [{
			"url": "#",
			"image": "//media.ao.com/uk/promotions/merch/SDAIFC-271016_LP.jpg",
			"alt": "Test"
		}, {
			"url": "#",
			"image": "//media.ao.com/uk/promotions/merch/boschTradeGeneric-201016_LP.jpg",
			"alt": "Test1"
		}, {
			"url": "#",
			"image": "//media.ao.com/uk/promotions/merch/tvDeals400-131016_LP.jpg",
			"alt": "Test2"
		}]
	}
}
```