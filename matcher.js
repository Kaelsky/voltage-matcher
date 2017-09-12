/* --------------------------------------------------
	VOLTAGE TECHNOLOGY Challenge
	Products matcher from 3rd party retailer listings 
	09/12/17 - Mickaël Chimansky
-------------------------------------------------- */
fs = require('fs'); //node.js FileSystem module
var products = fs.readFileSync('./data/products.txt','utf8');
var listings = fs.readFileSync('./data/listings.txt','utf8');

//Sanitize : add brackets, add comas, REGEX to remove last coma & Parse : to JSON 
function jsonParser(data){
	data = "[" + data.replace(/\n/g, ",").replace(/,\s*$/,"") + "]";
	data = JSON.parse(data);
	return data;
}

function main() {
	//JSON vars
	products = jsonParser(products) ;
	listings = jsonParser(listings) ;

	var loading = 0,
		loadingProgress;
	var jsonArr = [];

	var i;
	for( i=0, n=products.length ; i < n ; i++  ){ //products.length only called at first iteration
		var countOfficial = 0; 	//Counter for official retailer matches
		var countHigh	= 0; 	//Counter for High precision matches
		var countLow 	= 0; 	//Counter for Low precision matches

		jsonArr.push({ 
			product: products[i].product_name, total : [], 
			officialRetailers: [], 
			highPrecisionMatch: [], 
			lowPrecisionMatch: [], 
			listings: []
		});

		listings.filter(function (list) {

			var filterIsOfficialManufacturer 	= list.manufacturer.toLowerCase().replace(/-/g, "_").includes( products[i].manufacturer.toLowerCase().replace(/-/g, "_") ); 
			var filterManufacturer 				= list.title.toLowerCase().replace(/-/g, "_").includes( products[i].manufacturer.toLowerCase().replace(/-/g, "_") ); 
			var filterModel 					= list.title.toLowerCase().replace(/-/g, "_").includes( products[i].model.toLowerCase().replace(/-/g, "_") ); 

			//Official retailer : Check if listing manufacturer match product manufacturer AND model in title 
			if( filterIsOfficialManufacturer ){
				if( filterIsOfficialManufacturer && filterManufacturer && filterModel ){ 
					countOfficial++;
				    jsonArr[i].listings.push( list.title );
				}
			//High precision match : Listing title share Family AND Manufacturer AND Model name with product  
			}else if( products[i].family ) { 
				var filterFamily	= list.title.toLowerCase().replace(/-/g, "_").includes( products[i].family.toLowerCase().replace(/-/g, "_") ); 
			 	if( filterFamily && filterManufacturer && filterModel ){ //ICI 
					countHigh++;
					jsonArr[i].listings.push( list.title );
				}
			//Low precision match : Listing title share Manufacturer AND Model name with product  
			}else{
			    if( filterManufacturer && filterModel ){ //ICI 
					countLow++;
					jsonArr[i].listings.push( list.title );
				}
			}
		});

		//Show progress
		loading++;
		loadingProgress =  Math.floor((loading / products.length) * 100 );
		process.stdout.write( 'Generating JSON file, please wait : ' + loadingProgress + ' %\r');

		//Push stats
		var total = countOfficial + countHigh + countLow; 
		jsonArr[i].total.push( 'Total matches ' + total );
		jsonArr[i].officialRetailers.push( 'Official retailers matches ' + countOfficial );
		jsonArr[i].highPrecisionMatch.push( 'High precision matches ' + countHigh );
		jsonArr[i].lowPrecisionMatch.push( 'Low precision matches ' + countLow );
	};

	//Export JSON file
	var stringJsonArr = JSON.stringify(jsonArr);
	fs.writeFile('res.json', stringJsonArr, 'utf8', done);
	function done(){
		process.stdout.write( 'All good ! "res.json" saved in folder. Displaying data... \r');
		setTimeout( () => { console.log(JSON.parse(stringJsonArr)); }, 2000); //Delay for displaying JSON
	}
}	
main();