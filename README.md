# HubSpot API Request

This simple script GETs a list of partners, their countries, and which dates they’re available, from the HubSpot API.
Finds the best possible pair of consecutive days for each country, in wich the most number of partners will be available to attend a two day meeting.
Finally, POSTs back the first of the two days, for each country, or `null` if no date is possible.

<br>

**Sample data format from the HTTP GET request:**

```javascript
{
  "partners": [
    {
      "firstName": "Darin",
      "lastName": "Daignault",
      "email": "ddaignault@hubspotpartners.com",
      "country": "United States",
      "availableDates": [
      "2017-05-03",
      "2017-05-06"
      ]
    },
    {
      "firstName": "Crystal",
      "lastName": "Brenna",
      "email": "cbrenna@hubspotpartners.com",
      "country": "Ireland",
      "availableDates": [
      "2017-04-27",
      "2017-04-29",
      "2017-04-30"
      ]
    }
  ]
}
```

**Sample data format for the final POST:**

```javascript
{
  "countries": [
    {
      "attendeeCount": 1,
      "attendees": [
      "cbrenna@hubspotpartners.com"
      ],
      "name": "Ireland",
      "startDate": "2017-04-29"
    },
    {
      "attendeeCount": 0,
      "attendees": [],
      "name": "United States",
      "startDate": null
    },
    {
      "attendeeCount": 3,
      "attendees": [
      "omajica@hubspotpartners.com",
      "taffelt@hubspotpartners.com",
      "tmozie@hubspotpartners.com"
      ],
      "name": "Spain",
      "startDate": "2017-04-28"
    }
  ]
}
```
