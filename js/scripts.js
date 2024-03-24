/*!
* Start Bootstrap - Shop Homepage v5.0.6 (https://startbootstrap.com/template/shop-homepage)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-shop-homepage/blob/master/LICENSE)
*/
// This file is intentionally blank
// Use this file to add JavaScript to your project
// mock database to store houses that have been searched
var green_houses = {}

var demo_house = {
    state: "AL",
    city: "Saraland",
    street: "Scott Dr",
    zip_code: 36571,
    bedroom: 4,
    bathroom: 2,
    latitude: 30.819534,
    longitude: -88.09596,
    listed_price: 239900.0
}
/**
 * Listener for demo button on homepage
 * @param {*}
 */
function searchArea(e) {
    console.log('search called');
    // for (var house in demo_house) {
    // houseInsightsOnGet(house.longitude, house.latitude);
    // };
    houseInsightsOnGet(demo_house.longitude, demo_house.latitude);
    console.log(green_houses);

}


/**
 * Listener for more information buttons
 * @param {*} e
 */
function houseInsightsOnGet(long, lat) {

    const fetchSolarData = fetch(`https://solar.googleapis.com/v1/buildingInsights:findClosest?location.latitude=${demo_house.latitude}&location.longitude=${demo_house.longitude}&requiredQuality=HIGH&key=AIzaSyDWc9R774qJLweBQgcQjYXs6L6VPfzrQvY`)
        .then((response) => response.json())
        .then((solar_data) => {
            console.log(solar_data);
            // if (finance) {
            // } else {
            //     house_insight['savings'] = 0;
            // }
            return solar_data
        });
    console.log("\n\nPrinting Pollen Data");
    // const fetchPollenData = fetch(`https://pollen.googleapis.com/v1/forecast:lookup?key=AIzaSyDWc9R774qJLweBQgcQjYXs6L6VPfzrQvY&location.longitude=${demo_house.longitude}&location.latitude=${demo_house.latitude}&days=3`)
    const fetchPollenData = fetch(`https://pollen.googleapis.com/v1/forecast:lookup?key=AIzaSyDWc9R774qJLweBQgcQjYXs6L6VPfzrQvY&location.longitude=35.32&location.latitude=32.32&days=3`)
        .then((response) => response.json())
        .then((pollen_data) => {
            console.log(pollen_data);
            return pollen_data
        });

    var house_insight = {};
    Promise.all([fetchSolarData, fetchPollenData])
        .then(([solar_data, pollen_data]) => {

            house_insight['name'] = solar_data.name;
            // center - latitude, longitude
            let center = solar_data.center;
            house_insight['lat'] = center.latitude;
            house_insight['long'] = center.longitude;
            // postalCode (zipcode)
            house_insight['zip'] = solar_data.postalCode;
            // get address for the cards on front page
            house_insight['addr'] = solar_data.administrativeArea;
            // administrativeArea (state code)
            // solarPotential - maxArrayPanelsCount, maxSunshineHoursPerYear, carbonOffsetFactorKgPerMwh
            let solar_potential = solar_data.solarPotential;
            house_insight['num_panels'] = solar_potential.maxArrayPanelsCount;
            house_insight['sun_hours_per_year'] = solar_potential.maxSunshineHoursPerYear;
            house_insight['carbon_offset'] = solar_potential.carbonOffsetFactorKgPerMwh;

            // financialAnalyses - for each item
            //      - get the financialDetails, then costOfElectricityWithoutSolar
            //      - get the leasingSavings, then annualLeasingCost, savings, savingsLifetime
            //      - get the cashPurchasedSavings, then outOfPocketCost, upfrontCost, etc
            let finance = solar_data.financialAnalyses.leasing_savings;
            house_insight['savings'] = finance.savings.savingsLifetime;
            let pollen_types = pollen_data.dailyInfo;
            for (var type in pollen_types) {
                let sub_types = type.pollenTypeInfo
                for (var sub_type in sub_types) {
                    // dailyinfo -
                    //      - pollenTypeInfo, then inSeason (if false, no penalty)
                    house_insight['pollen_season'] = (sub_type.inSeason);
                    //          - indexInfo, then value / category (value correlates with category)
                    house_insight['pollen_index'] = (sub_type.indexInfo.value);
                    house_insight['pollen_cat'] = (sub_type.indexInfo.category);
                }
            }
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
        });
    green_houses['demo'] = house_insight;
    load_homes(green_houses);
    
    localStorage.setItem('house_insight', JSON.stringify(green_houses));
    for (var feature in house_insight) {
        console.log('feature', feature);
        const list_item = document.createElement('li');
        list_item.textContent = `${feature}: ${demo_features[feature]}`;
        housing_info_list.appendChild(list_item);
    }
    console.log('house insights = ', house_insight);
    // console.log("\n\nPrinting Air Quality Data");
    // fetch("https://pollen.googleapis.com/v1/forecast:lookup?key=AIzaSyDWc9R774qJLweBQgcQjYXs6L6VPfzrQvY&location.longitude=35.32&location.latitude=32.32&days=3")
    // .then((response) => response.json())
    // .then((json) => console.log(json));
    const housing_info_list = document.getElementById("housing_info");

    // const demo_features = green_houses['demo'];
    // console.log('demos', demo_features);

}

function load_housing_information() {

}

// f
// ction houseInsightsOnPost
/**
 * Function to load all the API data we've recieved
 * @param {*} data The data retrieved from the above api calls
 */
function load_homes(data) {
    let i = 0;
    // get it because it holds cards
    let wallet = document.getElementById('wallet');
    for (var house in data) {
        console.log('loadhome', house)
        let home = data[house]
        i = i + 1;
        let card_container = document.createElement('div');
        card_container.className = 'col mb-5';

        let card = document.createElement('div');
        card.className = 'col h-100';

        let img = document.createElement('img');
        img.className = 'card-img-top';
        img.src = 'assets/house' + i + '.jpeg';
        img.alt = 'photo of ' + house;

        let card_body = document.createElement('div');
        card_body.className = 'card-body p-4';

        let text_center = document.createElement('div');
        text_center.className = 'text-center';

        let name = document.createElement('h5');
        name.className = 'fw-bolder';
        name.textContent = house;

        let value = document.createElement('p');
        value.textContent = 'Green Score: 100%';

        text_center.appendChild(name);
        text_center.appendChild(value);

        card_body.appendChild(text_center);

        let card_footer = document.createElement('div');
        card_footer.className = 'card-footer p-4 pt-0 border-top-0 bg-transparent';

        let view_div = document.createElement('div');
        view_div.className = 'text-center';

        let view_link = document.createElement('a');
        view_link.className = 'btn btn-outline-dark mt-auto';
        view_link.href = 'house_view.html';
        view_link.textContent = 'View';

        view_div.appendChild(view_link);

        card.appendChild(img);
        card.appendChild(card_body);
        card.appendChild(view_div);
        card_container.appendChild(card);
        wallet.appendChild(card_container);
    }
}

/**
 * Calculate the 'Green Score' of the home
 * @param {*} data The data retrieved from the above api calls
 */
function calculate_score(data) {
    // if pollen in season, add penalty (otherwise do nothing)
    //      if the pollen is in season, multiply its value by 10? add some weight?
}


function get_zone(latitude) {
    if (latitude > 60) {
        return ["1", "2"];
    } else if (latitude > 45) {
        return ["3", "4"];
    } else if (latitude > 35) {
        return ["5", "6"];
    } else if (latitude > 25) {
        return ["7", "8"];
    } else if (latitude > 10) {
        return ["9", "10"]
    }

    return ["11", "12"]
}


/**
 * get the fruit associated with a hardiness zone of a home
 * @param {*} latitude The latitude of a given home
 */
function get_fruit_by_zone(latitude) {
    const fruit_dict = {
        1: ["N/A"], 2: ["N/A"],
        3: ["Apples", "Plums", "Strawberries"],
        4: ["Apples", "Peaches", "Plums", "Pears", "Strawberries"],
        5: ["Apples", "Peaches", "Plums", "Cherries", "Pears", "Berries"],
        6: ["Apples", "Peaches", "Plums", "Cherries", "Pears", "Berries"],
        7: ["Apples", "Peaches", "Plums", "Cherries", "Pears", "Berries"],
        8: ["Apples", "Peaches", "Plums", "Pears"],
        9: ["Apples", "Peaches", "Plums", "Pears"],
        10: ["Citrus"],
        11: ["Citrus"],
        12: ["N/A"]
    };

    const zones = get_zone(latitude);
    const fruit_zone_1 = fruit_dict[zones[0]];
    const fruit_zone_2 = fruit_dict[zones[1]];

    const fruit_in_zone = fruit_zone_1.concat(fruit_zone_2);

    return [...new Set(fruit_in_zone)];


}

/**
 * get the veg associated with a hardiness zone of a home
 * @param {*} latitude The latitude of a given home
 */
function get_veg_by_zone(latitude) {
    const veg_dict = {
        1: ["N/A"], 2: ["N/A"],
        3: ["Carrots", "Broccoli"],
        4: ["Tomatoes", "Peppers", "Lettuce", "Carrots", "Cucumbers", "Broccoli"],
        5: ["Tomatoes", "Peppers", "Lettuce", "Carrots", "Cucumbers", "Broccoli"],
        6: ["Tomatoes", "Peppers", "Lettuce", "Carrots", "Cucumbers", "Broccoli"],
        7: ["Tomatoes", "Peppers", "Lettuce", "Carrots", "Cucumbers", "Broccoli"],
        8: ["Tomatoes", "Peppers", "Lettuce", "Carrots", "Cucumbers", "Broccoli"],
        9: ["Tomatoes", "Peppers", "Lettuce", "Carrots", "Cucumbers", "Broccoli"],
        10: ["Tomatoes", "Peppers", "Carrots", "Cucumbers"],
        11: ["Cucumbers"],
        12: ["N/A"]
    };

    const zones = get_zone(latitude);
    const veg_zone_1 = veg_dict[zones[0]];
    const veg_zone_2 = veg_dict[zones[1]];

    const veg_in_zone = veg_zone_1.concat(veg_zone_2);

    return [...new Set(fruit_in_zone)];
}
// load_housing_information();

// database for project: https://www.kaggle.com/datasets/febinphilips/us-house-listings-2023