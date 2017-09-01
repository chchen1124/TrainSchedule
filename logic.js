/* global firebase moment */
// Steps to complete:

// 1. Initialize Firebase
// 2. Create button for adding new employees - then update the html + update the database
// 3. Create a way to retrieve employees from the employee database.
// 4. Create a way to calculate the months worked. Using difference between start and current time.
//    Then use moment.js formatting to set difference in months.
// 5. Calculate Total billed

// 1. Initialize Firebase
  var config = {
    apiKey: "AIzaSyDJIc0CGy13a9uf3RqtlsroqbkJKLJ4064",
    authDomain: "train-scheduling.firebaseapp.com",
    databaseURL: "https://train-scheduling.firebaseio.com",
    projectId: "train-scheduling",
    storageBucket: "",
    messagingSenderId: "739822470596"
  };
  firebase.initializeApp(config);

var database = firebase.database();

// 2. Button for adding Trains
$("#add-train-btn").on("click", function(event) {
  event.preventDefault();

  // Grabs user input for the form (the inputs include train name, train destination, start time for train, and train frequency)
  var trainName = $("#train-name-input").val().trim();
  var trainDest = $("#destination-input").val().trim();
  var trainStart = moment($("#start-input").val().trim(), "HH:mm").format("X");
  var trainFreq = $("#frequency-input").val().trim();

  // Creates local "temporary" object for holding train data
  var newTrain = {
    name: trainName,
    dest: trainDest,
    start: trainStart,
    freq: trainFreq
  };

  // Uploads train data to the database
  database.ref().push(newTrain);

  // Logs everything to console
  console.log(newTrain.name);
  console.log(newTrain.dest);
  console.log(newTrain.start);
  console.log(newTrain.freq);

  // alerts message that train has been successfully added
  alert("Train successfully added");

  // Clears all of the text-boxes
  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#start-input").val("");
  $("#frequency-input").val("");
});

// 3. Create Firebase event for adding train to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot, prevChildKey) {

  console.log(childSnapshot.val());

  // Store everything into a variable.
  var trainName = childSnapshot.val().name;
  var trainDest = childSnapshot.val().dest;
  var trainStart = childSnapshot.val().start;
  var trainFreq = childSnapshot.val().freq;

  // Train Info
  console.log(trainName);
  console.log(trainDest);
  console.log(trainStart);
  console.log(trainFreq);

  // Prettify the train start
  var trainStartPretty = moment.unix(trainStart).format("HH:mm");
  var trainStartPrettyconverted=moment(trainStartPretty,"HH:mm").subtract(1,"years");
  var trainStartPrettyconv=moment(trainStartPrettyconverted).format("HH:mm");
  console.log("trainStartPrettyconverted is: "+trainStartPrettyconverted);

  //current time
  var currentTime=moment();
  var currentTimeconv=moment(currentTime).format("HH:mm");
  console.log("Current time is: "+currentTimeconv);

  //difference between the times
  var diffTime=moment().diff(moment(trainStartPrettyconverted),"minutes");
  console.log("Difference in time: "+diffTime);

  // Time apart (remainder)
  var tRemainder = diffTime % trainFreq;
  console.log("remainder is: "+tRemainder);

  // Minutes Until the next train
  var tMinutesTillTrain = trainFreq - tRemainder;
  console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

  // The next train's arrival time
  var nextTrain = moment().add(tMinutesTillTrain, "minutes");
  var nextTrainconv=moment(nextTrain).format("h:mm A");
  console.log("ARRIVAL TIME: " + nextTrainconv);

  // Add each train's data into the table
  $("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + trainDest + "</td><td>" +
  trainStartPrettyconv + "</td><td>" + trainFreq + "</td><td>"+nextTrainconv+"</td><td>"+tMinutesTillTrain+"</td></tr>");
});