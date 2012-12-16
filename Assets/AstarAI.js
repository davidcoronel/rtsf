//Note this line, if it is left out, the script won't know that the class 'Path' exists and it will throw compiler errors
//This line should always be present at the top of scripts which use pathfinding
    //The point to move to
    var targetPosition:Vector3;
    
    var seeker:Seeker;
    var controller:CharacterController;
 
    //The calculated path
    var path:Pathfinding.Path;
    
    //The AI's speed per second
    
    var speed:float = 100;//:float;
    
    //The max distance from the AI to a waypoint for it to continue to the next waypoint
    var nextWaypointDistance:float = 1;
 
    //The waypoint we are currently moving towards
    var currentWaypoint:int = 0;//int;
 
    function Start () {
        seeker = GetComponent(Seeker);
        controller = GetComponent(CharacterController);
        
        //Start a new path to the targetPosition, return the result to the OnPathComplete function
        seeker.StartPath (transform.position,targetPosition, OnPathComplete);
    }
    
    function OnPathComplete (p:Pathfinding.Path) {
        Debug.Log ("Yey, we got a path back. Did it have an error? "+p.error);
        if (!p.error) {
            path = p;
            //Reset the waypoint counter
            currentWaypoint = 0;
        }
    }
 
    function FixedUpdate () {
        if (path == null) {
            //We have no path to move after yet
            return;
        }
        
        if (currentWaypoint >= path.vectorPath.Length) {
            //Debug.Log ("End Of Path Reached");
            return;
        }
        
        //Direction to the next waypoint
        dir = (path.vectorPath[currentWaypoint]-transform.position).normalized;//:Vector3;
        dir *= speed * Time.fixedDeltaTime;
        controller.SimpleMove (dir);
        
        //Check if we are close enough to the next waypoint
        //If we are, proceed to follow the next waypoint
        if (Vector3.Distance (transform.position,path.vectorPath[currentWaypoint]) < nextWaypointDistance) {
            currentWaypoint++;
            return;
        }
    }
