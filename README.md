# time_reservation
Time reservation system for food delivery services, including delay for preparation or delivery of food.
- show possible delivery time against to current time 
- there are two ways how to get order - delivery or pickup (they have different delivery/prepare time). 

Configuration part in `reservation_time.js` contains 
- Open time different for each delivery type:
```js
hour = {
         "pickup":
        [{
            "from": 9,
            "to":20,
         }],
        "carry":
          [{
              "from":8,
              "to":19,
           }]};
```
- Time step different for each delivery type:
```js
minute = {
         "pickup":
        [{
            "from": 40,
            "to":59,
            "step":20
         }],
          "carry":
          [{
              "from":50,
              "to":59,
              "step":40
           }]};
```
**NOTE: Step 20 means: time between order and delivery is at least 20 minutes (e.g. order in 16:05 -> closest delivery in 16:30)**

## How to run
Just download all files for demonstration and open `index.html`.

For implementation are required at least these three HTML elements:
```html
<input type="checkbox" id="carry">carry</input>
<select id="hours"></select>
<select id="minutes"></select>
<input hidden id="currentState" type="number" name="currentState" hour="" deprecated="" minMin="" minute="" />
```

#### All suggestions and repairs are welcome
