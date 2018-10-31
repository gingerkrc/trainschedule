  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDPOy6TiZk1Re_5fn0VZ8jgY7V0wMdrogQ",
    authDomain: "firestarter-66ad1.firebaseapp.com",
    databaseURL: "https://firestarter-66ad1.firebaseio.com",
    projectId: "firestarter-66ad1",
    storageBucket: "firestarter-66ad1.appspot.com",
    messagingSenderId: "905011402430"
  };
  firebase.initializeApp(config);

    // Global Variables

    var database = firebase.database();

    var train = "";
    var destination = "";
    var startTime = "";
    var frequency = "";
   
    // Capture Button Click
    $("#submit-btn").on("click", function(event) {
      event.preventDefault();
  
      train = $("#train-name").val().trim();
      destination = $("#destination").val().trim();
      startTime = $("#first-train-time").val().trim();
      frequency = $("#frequency").val().trim();
  
      
      database.ref().push({
  
        trainData: train,
        destinationData: destination,
        startTimeData: startTime,
        frequencyData: frequency,
      //   dateAdded: firebase.database.ServerValue.TIMESTAMP 
      });
    });
  
    // Firebase watcher + initial loader HINT: This code behaves similarly to .on("value")
    database.ref().on("child_added", function(childSnapshot) { 

    var tFirstTime = childSnapshot.val().startTimeData;
    var tFrequency = childSnapshot.val().frequencyData;
    var firstTimeConverted = moment(tFirstTime, "HH:mm").subtract(1, "years"); // Make sure previous backlog of trains and counting in positive minutes
    console.log(firstTimeConverted);

    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));
  
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes"); // how many minutes between current time and train departure time
    console.log("DIFFERENCE IN TIME: " + diffTime);

    var tRemainder = diffTime % tFrequency; // tells how much time is left over
    console.log(tRemainder);

    var tMinutesTillTrain = tFrequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));
  
      // Log everything that's coming out of snapshot
      console.log(childSnapshot.val().trainData); // properties related to entry just made
      console.log(childSnapshot.val().destinationData);
      console.log(childSnapshot.val().startTimeData);
      console.log(childSnapshot.val().frequencyData);
      console.log(childSnapshot.val());

    var tableRow = $("<tr>");

    tableRow.append("<td>" + childSnapshot.val().trainData + "</td>");
    tableRow.append("<td>" + childSnapshot.val().destinationData + "</td>");
    tableRow.append("<td>" + childSnapshot.val().startTimeData + "</td>");
    tableRow.append("<td>" + moment(nextTrain).format("hh:mm") + "</td>");
    tableRow.append("<td>" + tMinutesTillTrain + "</td>");
    $("tbody").append(tableRow);
 
  });


  