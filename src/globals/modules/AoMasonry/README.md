# AO Masonry
Masonry section for AOL.

__Include:__ gridSection

E.G

  {
  "sectionId": "gridSection",
			"rowType": "grid",
            "data": [{

            }]
  }

## Template Config Data:

config = {{ data | dump }}

data key properties for main pod ["title", "static ", "sku", "text", "image" , "link" , "brandTall" , "brandShort", noImage, "hero" , "bigger"]

** sku must be >= 001 and unique

data key properties for pod pop up modal ["text", "image", "href"]

## JS Setup:


JS required for this module.


Image JS -> everytime Js changes are made in one page the CDN variable must be changed to point there.

*Needs fixing

let imageRegExp = /img(.*)/;

// CDN location

let imageCdnPath = '//media.ao.com/uk/brandPages/nespresso/';
// let imageCdnPath = '//media.ao.com/uk/brandPages/samsung/samsung2017/';

on your project main/index.js file import the global script:

** import { AoMasonry } from 'modules/AoMasonry'; **

Change imageCDNpath variable

// CDN location

	let imageCdnPath = '';


E.G

//media.ao.com/uk/brandPages/samsung/samsung2017/


# Example setup

### Live examples


add //media.ao.com/uk/brandPages/samsung/samsung2017/

 -  ao.com/samsung
 -  ao.com/nespresso

### Background colors override (SASS)

.masonry-container {
    background-color: $newColor;
    .content-holder {
           background-color: $newColor;
    }
     .modal-content {
          background-color: $newColor;
     }
}

###Config JSON file

''
{
			"sectionId": "gridSection",
			"rowType": "AoMasonry",
			"isGlobal" : true,
			"data": [
				{
					"title": "Laundry",
					"sku": "001",
					"text": "Add to the wash, during the wash",
					"image": "//media.ao.com/uk/brandPages/samsung/samsung2017/img/washer.jpg",
					"link": "",
					"isBrandTall": true,
					"modal": {
						"text": "<h1>Laundry</h1> <h3>Add to the wash during the wash</h3> <p>Feast your eyes on the latest innovation in refrigeration and stay in control on the go with the new Family Hub™ refrigerator. Cameras inside the fridge take photos when you close the doors and are sent straight to your phone. Plus, you can create shopping lists via the unique  touchscreen, so you’ll always know what you need.</p> <a href=\"/samsung/addwash?cmredirectionvalue=addwash/\" class=\"aoCTA\">Shop AddWash™</a><h3>Explore the full laundry range</h3><p>The full Samsung laundry range is made up of stylish washing machines, tumble dryers and washer dryers packed with innovative technology and an array of programmes. So you're able to wash away the toughest stains without damaging your delicates.</p>",
						"image": "//media.ao.com/uk/brandPages/samsung/samsung2017/img/washer.jpg",
						"href": "<a href=\"/samsung-laundry-eco-bubble-technology#/\" class=\"transparent\">Shop all laundry</a>"

					}
				},
				{
					"title": "Refrigerators",
					"sku": "002",
					"text": "Take a fresh look at what a fridge can do",
					"image": "//media.ao.com/uk/brandPages/samsung/samsung2017/img/fridge.jpg",
					"isBrandShort": true,
					"modal": {
						"text": "<h1>Refrigerators</h1> <h3>Take a fresh look at what a fridge can do</h3> <p>Introducing the first washing machine of its kind, you can add to laundry cycles mid-wash with Samsung’s latest AddWash™ range. The extra door within the main door is perfect for when you’ve missed an item, forgotten to add softener or just want to give something a quick rinse. </p> <a href=\"ao.com/samsung/family-hub?cmredirectionvalue=Family%20Hub/\" class=\"aoCTA\">Shop Family Hub™</a><h3>Explore the full refrigeration range</h3><p>Samsung fridge freezers are packed with innovative technology that keeps your food fresher for longer. Their beautiful design brings a touch of style and with huge capacities available, you can stock up on plenty of food.</p>",
						"image": "//media.ao.com/uk/brandPages/samsung/samsung2017/img/fridge.jpg",
						"href": "<a href=\"/samsung-fridge-freezers/\" class=\"transparent\">Shop all refrigeration</a>"

					}
				},
				{
					"title": "Tablets",
					"sku": "003",
					"text": "Light, fast and reliable",
					"image": "//media.ao.com/uk/brandPages/samsung/samsung2017/img/computing.jpg",
					"isBrandTall": true,
					"modal": {
						"text": "<h1>Tablets</h1> <h3>Light, fast and reliable</h3> <p>The newest Samsung Galaxy Tab S Pro combines the functionality of a laptop with the portability of a tablet. Whether you’re working late or catching up on TV, it’ll easily fit around your busy lifestyle. And with a 10.5 hour battery life, it’ll run your favourite apps for even longer.</p> <a href=\"/product/smw703nzkabtu-samsung-computing-galaxy-tab-pro-s-laptop-black-43464-251.aspx?cmredirectionvalue=samsung%20galaxy%20tab%20pro/\" class=\"aoCTA\">Shop our favourite</a><h3>Explore the full computing range</h3><p>Samsung tablets are light, powerful and ideal for work or entertainment whether you’re on the move or at home. And with black, white and gold finishes available, you can find something to suit your style.</p>",
						"image": "//media.ao.com/uk/brandPages/samsung/samsung2017/img/computing.jpg",
						"href": "<a href=\"/l/computing-samsung_computing/1-6/250/\" class=\"transparent\">Shop all computing</a>"

					}
				},
				{
					"title": "TVs",
					"sku": "004",
					"text": "The most immersive viewing experience",
					"image": "//media.ao.com/uk/brandPages/samsung/samsung2017/img/tv.jpg",
					"isBrandShort": true,
					"modal": {
						"text": "<h1>TVs</h1> <h3>The most immmersive viewing experience</h3> <p>Samsung bring you the best viewing experience imaginable with their KU6100 Certified UHD curved screen TV. With HDR technology and 4 times as many pixels as a Full HD television, you’ll fall in love with the most incredible colour depth and crystal-clear definition.</p> <a href=\"/product/ue55ku6100-samsung-tv-black-43148-108.aspx/\" class=\"aoCTA\">Shop our favourite</a><h3>Explore the full TV range</h3><p>Your favourite films look better than ever on a Samsung TV, as they feature the latest technology to give you the sharpest picture around. Every image looks crisper and clearer white colours are more vivid, so your TV uncovers more detail than any other. </p>",
						"image": "//media.ao.com/uk/brandPages/samsung/samsung2017/img/tv.jpg",
						"href": "<a href=\"/l/tvs-samsung/1-6/107-108/\" class=\"transparent\">Shop all TVs</a>"

					}
				},
				{
					"title": "Audio",
					"sku": "005",
					"text": "Surround yourself with powerfull audio",
					"image": "//media.ao.com/uk/brandPages/samsung/samsung2017/img/soundbar.jpg",
					"isBrandShort": true,
					"modal": {
						"text": "<h1>Audio</h1> <h3>Surround yourself with powerfull sound</h3> <p>Immerse yourself in the sharpest audio with this Samsung curved soundbar. It brings sound to every corner and fits in seamlessly with a Samsung curved TV for the full cinematic experience. With six speakers packed into one bar, it really brings your favourite films, box sets and documentaries to life.</p> <a href=\"/product/hwj6000r-samsung-soundbar-black-41256-111.aspx/\" class=\"aoCTA\">Shop our favourite</a><h3>Explore the full audio range</h3><p>Bring a cinematic experience to your living room with Samsung's  soundbar range, featuring the latest audio innovations. These curved soundbars offer rich, booming bass and speakers that fill a room with crisp sound.</p>",
						"image": "//media.ao.com/uk/brandPages/samsung/samsung2017/img/soundbar.jpg",
						"href": "<a href=\"/l/soundbars-samsung/1-6/107-109-111/\" class=\"transparent\">Shop all audio</a>"

					}
				},
				{
					"title": "Ovens",
					"sku": "006",
					"text": "Flavours stay beautifully unique",
					"image": "//media.ao.com/uk/brandPages/samsung/samsung2017/img/oven.jpg",
					"isBrandTall": true,
					"modal": {
						"text": "<h1>Ovens</h1> <h3>Flavours stay beautifully unique</h3> <p>Revolutionise dinner times and cook 2 different dishes without odours or flavours transferring with Samsung’s Dual Cook oven tech. Pop in a casserole and a crumble at the same time by setting 2 different temperatures and times, and they’ll still pack a unique punch.</p> <a href=\"/product/nv75k5571rs-samsung-dual-cook-electric-single-oven-stainless-steel-40723-45.aspx/\" class=\"aoCTA\">Shop our favourite</a><h3>Explore the full oven range</h3><p>Cook your best dishes just the way you like them with a multifunctional Samsung oven. Food cooks evenly with dual fans pushing hot air into every corner. And with black, white or stainless steel finishes to choose from, you can find the perfect fit for your kitchen.</p>",
						"image": "//media.ao.com/uk/brandPages/samsung/samsung2017/img/oven.jpg",
						"href": "<a href=\"/l/single_ovens-samsung/1-6/42-43/\" class=\"transparent\">Shop all ovens</a>"

					}
				},
				{
					"title": "Dishwashers",
					"sku": "007",
					"text": "Give your dishes the spa treatment",
					"image": "//media.ao.com/uk/brandPages/samsung/samsung2017/img/dishwasher.jpg",
					"isBrandShort": true,
					"modal": {
						"text": "<h1>Dishwashers</h1> <h3>Add to the wash during the wash</h3> <p>Samsung's new WaterWall™ technology revolutionises the way your dishes are cleaned. It gives an extra thorough clean by sweping a wall of water through the whole dishwasher. Plus, the Zone Booster™ feature lets you give stained items an intense clean and delicate glassware a gentle wash at the same time.</p> <a href=\"/product/dw60h9950fw-samsung-waterwall-standard-dishwasher-white-31689-23.aspx?cmredirectionvalue=DW60H9950FW/\" class=\"aoCTA\">Shop our favourite</a><h3>Explore the full Samsung dishwasher range</h3><p>Samsung dishwashers are perfect for busy homes as they wash either 12 or 14 place settings in one go. The quick cycle cleans and dries your dishes in under an hour, while still giving everything an intense clean.</p>",
						"image": "//media.ao.com/uk/brandPages/samsung/samsung2017/img/dishwasher.jpg",
						"href": "<a href=\"/l/dishwashers-samsung/1-6/21/\" class=\"transparent\">Shop all dishwahers</a>"

					}
				},
				{
					"title": "Microwaves",
					"sku": "008",
					"text": "Powerfull cooking in a flash",
					"image": "//media.ao.com/uk/brandPages/samsung/samsung2017/img/microwave.jpg",
					"isBrandTall": true,
					"modal": {
						"text": "<h1>Microwaves</h1> <h3>Powerfull cooking in a flash</h3> <p>Serve up dinner in no time with Samsung’s latest HotBlast™ microwave technology. It blows hot air directly onto dishes, cooking food twice as quickly as regular convection ovens. And with the built-in grill, you’ll get the perfect finish on lasagnes and cheese on toast.</p> <a href=\"ao.com/product/mc32k7055ck-samsung-hotblast-microwave-black-41622-50.aspx?cmredirectionvalue=hotblast/\" class=\"aoCTA\">Shop our favourite</a><h3>Explore the full Samsung microwave range</h3><p>Ideal for the stylish kitchen, a Samsung microwave doesn’t just look the part. Enjoy exceptional cooking with minimum effort, with a choice of solo, grill or combination to suit your cooking style. And you’re able to cook bigger dishes thanks to the large capacities available.</p>",
						"image": "//media.ao.com/uk/brandPages/samsung/samsung2017/img/microwave.jpg",
						"href": "<a href=\"/l/microwaves-samsung/1-6/42-50/\" class=\"transparent\">Shop all microwaves</a>"

					}
				}
			]
		}
''
