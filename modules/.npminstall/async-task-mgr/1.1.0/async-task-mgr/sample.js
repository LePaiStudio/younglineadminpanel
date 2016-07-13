var asyncTask = require("./index");

// use this one in your project
// var asyncTask = require("async-task-mgr");

var asyncTaskInstance = new asyncTask();


//a simple task to generate random number
function taskAction(callback){
	setTimeout(function(){ //simulate an async task
		var resultA = Math.floor(Math.random()*100),
			resultB = Math.floor(Math.random()*100);

		callback(resultA, resultB);
	},200); 
}

//add a new task named task_A
//when taskAction is done, its return value will be saved and apply to all the task with the same name
asyncTaskInstance.addTask("task_A",taskAction,function(resultA,resultB){ 
	console.log("task A_1 result :" + resultA + " " + resultB); //all result generated by taskAction will be passed here
});


//add another task named task_A
/*
since a task with the same name has been added, this taskAction will not be executed.
the callback function will be put in a queue and will be called when previous callbacks are done.
*/
asyncTaskInstance.addTask("task_A",taskAction,function(resultA,resultB){
	console.log("task A_2 result :" + resultA + " " + resultB);
});


//add a new task named task_X
//a new task, have no relationship to the previous ones
asyncTaskInstance.addTask("task_X",taskAction,function(resultA,resultB){
	console.log("task X_0 result :" + resultA + " " + resultB);
});


setTimeout(function(){
	//remove task_A, add again 
	//task_A will now execute again
	asyncTaskInstance.removeTask("task_A");
	asyncTaskInstance.addTask("task_A",taskAction,function(resultA,resultB){ 
		console.log("task A_1 result :" + resultA + " " + resultB); //all result generated by taskAction will be passed here
	});

},1000);