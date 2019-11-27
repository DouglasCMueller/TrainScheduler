$(document).ready(function () {

    // Defining variables
    var NewTrainName;
    var current;
    var currentTime;
    var firebaseConfig;
    var database;
    var newTrainName;
    var newDestination;
    var newFirstTrainTime;
    var newFrequency;
    var newTrain;
    var name;
    var destination;
    var firstTrainTime;
    var frequency;
    var firstTimeConverted;
    var currentTime;
    var diffTime;
    var tRemainder;
    var tMinutesTillTrain;
    var nextTrain;
    var newRow
    //current time and date function shown in html
    function currentTime() {
        var current = moment().format('MMMM Do YYYY, h:mm:ss A');
        $("#time").html(current);
        setTimeout(currentTime, 1000);
    };

    // Firebase configuration
    var firebaseConfig = {
        apiKey: "AIzaSyDzSYRrDC11x-dc4TSBZAa9EkzoUcNjqfQ",
        authDomain: "firstproject-446b1.firebaseapp.com",
        databaseURL: "https://firstproject-446b1.firebaseio.com",
        projectId: "firstproject-446b1",
        storageBucket: "firstproject-446b1.appspot.com",
        messagingSenderId: "668873385545",
        appId: "1:668873385545:web:50589c9fcd699055884198"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    var database = firebase.database();

    //on click submit new train info
    $("#submitButton").on("click", function (event) {
        event.preventDefault();

        var newTrainName = $("#trainNameEntered").val().trim();
        var newDestination = $("#destinationEntered").val().trim();
        var newFirstTrainTime = $("#firstTrainTimeEntered").val().trim();
        var newFrequency = $("#frequencyEntered").val().trim();
        // Creates local "temporary" object for holding train data
        var newTrain = {
            name: newTrainName,
            destination: newDestination,
            firstTrainTime: newFirstTrainTime,
            frequency: newFrequency
        }

        // Uploads new train data to the database
        database.ref().push(newTrain);
        // clear data entry
        $("#trainNameEntered").val("");
        $("#destinationEntered").val("");
        $("#firstTrainTimeEntered").val("");
        $("#frequencyEntered").val("");

    });

        // Create Firebase event for adding new train and a row in the html when a user adds an entry
        database.ref().on("child_added", function (childSnapshot) {

        // Store everything into a variable.
        var newTrainName = childSnapshot.val().name;
        var newDestination = childSnapshot.val().destination;
        var newFirstTrainTime = childSnapshot.val().firstTrainTime;
        var newFrequency = childSnapshot.val().frequency;

        // First Time (pushed back 1 year to make sure it comes before current time)
        var firstTimeConverted = moment(newFirstTrainTime, "HH:mm").subtract(1, "years");
     
        // Current Time
        var currentTime = moment();
      
        // Difference between the times
        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
       
        // Time apart (remainder)
        var tRemainder = diffTime % newFrequency;
 
        // Minutes Until Train
        var tMinutesTillTrain = newFrequency - tRemainder;
       
        // Next Train
        var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    
        // Create the new row
        var newRow = $("<tr>").append(
            $("<td>").text(newTrainName),
            $("<td>").text(newDestination),
            $("<td>").text(newFrequency),
            $("<td>").text(moment(nextTrain).format("hh:mm A")),
            $("<td>").text(tMinutesTillTrain)
        );
        //add train info to html    
        $("#trainTable > tbody").append(newRow);
    });
    currentTime();
});
