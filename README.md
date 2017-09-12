# voltage-matcher

Products matcher against 3rd party retailer listings by comparing similarities between 2 JSON files.
Shows related matches with the most precise way possible. 

What it does ? 

- Parse external Products/Listings lists ( /data/products.txt & /data/listings.txt ) into JSON 
- Loop thru Products and search against Listings by converting both search terms into lowerCases & .replace('-','_') to prevent missmatch 
- Search using 3 level of precision : 
	- Official retailer 	: Check if listing manufacturer match product manufacturer AND model in title 
	- High precision match 	: Listing title share Family AND Manufacturer AND Model name with product  
	- Low precision match 	: Listing title share Manufacturer AND Model name with product  
- Generate JSON file "res.json" that show all matches, total matches, official retailer matches, high and low precision matches

Start app with node : 

> node matcher
