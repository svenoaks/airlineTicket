function Event(time, type)
{
	this.time = time;
	this.type = type;
}

Event.prototype.valueOf = function() { return this.time; }

function EventQueue(priorityQueueImp)
{
	this.priorityQueue = priorityQueueImp;
	
	this.isEmpty = function isEmpty()
	{
		return this.priorityQueue.isEmpty();
	}
	
	this.add = function add(event)
	{
		this.priorityQueue.insert(new BinaryHeapNode(event));
	}
	
	this.removeNextEvent = function removeNextEvent()
	{
		return this.priorityQueue.removeMin();
	}
	
	this.peekNextEvent = function peekNextEvent()
	{
		return this.priorityQueue.peekNext();
	}
}
function addRandomEventsToQueue(eventQueue, numberOfEvents, maxArrivalTime)
{
	for (var i = 0; i < numberOfEvents; ++i)
	{
		var arrivalTime = Math.floor(Math.random() * maxArrivalTime) + 1
		eventQueue.add(new Event(arrivalTime, "Customer Arrival"));
	}
}

function askUserForNumberOfAgents()
{
	var numberOfAgents = 0;
	while (numberOfAgents < 1 || numberOfAgents > 7)
	{
		numberOfAgents = prompt("Enter number of Agents 1-7", "2");
	}
	return numberOfAgents;
}

function msToSeconds(ms)
{
	return ms / 1000.0;
}

function lockUI(shouldBeLocked)
{
	document.getElementById("startSimulation").disabled = shouldBeLocked;
}

function changeCounterUI(id, value)
{
	document.getElementById(id).innerHTML = value;
}

function doSimulation()
{
	lockUI(true);
	
	var MAX_NO_OF_EVENTS = 50;
	var MAX_ARRIVAL_TIME = 60;
	var HANDLE_TIME = 3000;
	
	var eventsRemaining = MAX_NO_OF_EVENTS;
	var totalWaitingTime = 0;
	var waitingLine = [];
	var currentFreeAgents = maxFreeAgents = askUserForNumberOfAgents();
	var timeStarted = new Date();
	var eventQueue = new EventQueue(new BinaryHeap());
	
	addRandomEventsToQueue(eventQueue, MAX_NO_OF_EVENTS, MAX_ARRIVAL_TIME);
	
	changeCounterUI("agents", currentFreeAgents);
	changeCounterUI("remaining", MAX_NO_OF_EVENTS);
	
	var serviceLoop = setInterval(serviceQueue, 10);
	
	function serviceQueue()
	{
		var timeNow = new Date();
		
		if (waitingLine.length != 0 && 
				currentFreeAgents > 0)
		{
			var currentEvent = waitingLine.shift();
			serviceEvent(currentEvent);
		}
		else
		{
			var nextEvent = eventQueue.peekNextEvent();
			
			if (nextEvent != null && 
					msToSeconds(timeNow - timeStarted) >= nextEvent.time)
			{
				var currentEvent = eventQueue.removeNextEvent();
				changeCounterUI("remaining", --eventsRemaining);
				
				if (currentFreeAgents > 0)
				{
					serviceEvent(currentEvent);
				}
				else
				{
					currentEvent.startedWaiting = timeNow;
					waitingLine.push(currentEvent);
					changeCounterUI("waiting", waitingLine.length);
				}
			}
		}
			
		if (eventQueue.isEmpty() && waitingLine.length == 0) 
		{
			clearInterval(serviceLoop);
			lockUI(false);
		}
	}
	
	function serviceEvent(currentEvent)
	{
		changeCounterUI("agents", --currentFreeAgents);
		
		if (typeof currentEvent.startedWaiting !== 'undefined')
		{
			var timeNow = new Date();
			totalWaitingTime += timeNow - currentEvent.startedWaiting;
			changeCounterUI("waiting", waitingLine.length);
		}
		
		changeCounterUI("seconds", msToSeconds(totalWaitingTime / (MAX_NO_OF_EVENTS - eventsRemaining))
			.toFixed(2)
			.toString()
			.concat(" seconds"));
			
		setTimeout(function() { onTransactionComplete(currentEvent); }, HANDLE_TIME);
	}
	
	function onTransactionComplete(currentEvent)
	{
		if (currentFreeAgents < maxFreeAgents)
		{
			changeCounterUI("agents", ++currentFreeAgents);
		}
	}
}

