// GET DATA from API
// -------------------------------
function getData() {
  axios
    .get('https://candidate.hubteam.com/candidateTest/v3/problem/dataset?userKey=00e8039510cf0d2ade3518b068bd', {
      timeout: 10000
    })
    .then(function(response){
      let bestDates = findDates(response.data);
      logPartners(response.data);
      logBestDates(bestDates);
      postResult(bestDates);
    })
    .catch(err => console.error(err));
}

// POST RESULT to API
// -------------------------------
function postResult(bestDates) {
  axios
    .post('https://candidate.hubteam.com/candidateTest/v3/problem/result?userKey=00e8039510cf0d2ade3518b068bd',
      bestDates
    )
    .then(response => logPostResponse(response))
    .catch(err => console.log(err));
}

// Find the Best Dates (by country)
// -------------------------------
function findDates(data) {
  let partnersCount = data.partners.length;
  let partnerDates, dayOne, dayTwo;
  let datesLog = {};

  // For each partner
  for(let p = 0; p < partnersCount; p++){
    partnerCountry = data.partners[p].country;
    partnerDates = data.partners[p].availableDates;
    if(partnerDates.length < 2) continue;
    dayOne = new Date(partnerDates[0]);

    // Check all available dates
    for(let i = 1; i < partnerDates.length; i++){
      currDay = new Date(partnerDates[i]);
      dayTwo = new Date(dayOne);
      dayTwo.setDate(dayTwo.getDate() + 1);

      // Find pairs of consecutive days and add the 1st day from each pair to the datesLog
      if(+currDay == +dayTwo){
        // add country to datesLog, if not there
        if(!(partnerCountry in datesLog)){
          datesLog[partnerCountry] = {};
        }
        // add 1st day from pair to datesLog, if not there
        if(!(+dayOne in datesLog[partnerCountry])){
          datesLog[partnerCountry][+dayOne] = [0,[]];
        }
        // increment day count in datesLog
        datesLog[partnerCountry][+dayOne][0]++;
        // add partner email to attendees array
        datesLog[partnerCountry][+dayOne][1].push(data.partners[p].email);
      }
      dayOne = currDay;
    }
  }

  // Check for 1st possible best day in each country
  let max = 0;
  let bestDay = null;
  let formattedDay;
  let bestDates = { "countries": []};

  // In each country
  for(const country in datesLog){
    // Search for the day with the max attendees
    for(const day in datesLog[country]){
      if (datesLog[country][day][0] > max){
        max = datesLog[country][day][0];
        bestDay = day;
      }
    }
    // Insert the result date,
    // plus the additional required data,
    // into the bestDates array
    formattedDay = new Date(+bestDay);
    formattedDay = formattedDay.getFullYear() + "-" + (formattedDay.getMonth()+1).toString().padStart(2, '0') + "-" + formattedDay.getDate().toString().padStart(2, '0');
    bestDates.countries.push(
      {
        "attendeeCount": max,
        "attendees": bestDay ? datesLog[country][bestDay][1] : [],
        "name": country,
        "startDate": formattedDay
      }
    );
    max = 0;
    bestDay = null;
  }
  return bestDates;
}

// Write info in HTML (not needed)
// -------------------------------
function logPartners(partners) {
  document.getElementById('partners').innerHTML = `
  <div class="card mb-4">
    <div class="card-header">
      Partners <small>(GET)</small>
    </div>
    <div class="card-body">
      <pre>${JSON.stringify(partners, null, 2)}<pre>
      </div>
    </div>
  `;
}
function logBestDates(dates) {
  document.getElementById('best-dates').innerHTML = `
  <div class="card mb-4">
    <div class="card-header">
      Best Dates by Country <small>(POST)</small>
    </div>
    <div class="card-body">
      <pre>${JSON.stringify(dates, null, 2)}<pre>
    </div>
  </div>
  `;
}
function logPostResponse(response) {
  document.getElementById('header').innerHTML = `
  <div class="card mb-4">
    <div class="card-header">
      Status <small>(POST)</small>
    </div>
    <div class="card-body">
      <h5>${response.status}</h5>
    </div>
  </div>
  <div class="card mb-4">
    <div class="card-header">
      Headers <small>(POST)</small>
    </div>
    <div class="card-body">
      <pre>${JSON.stringify(response.headers, null, 2)}</pre>
    </div>
  </div>
  `;
}

// INI
// -------------------------------
 getData();