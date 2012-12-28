#pragma strict

//Note this line, if it is left out, the script won't know that the class 'Path' exists and it will throw compiler errors
//This line should always be present at the top of scripts which use pathfinding
//The point to move to

var targetPosition:Vector3;
var targetActive:boolean;

var controller:CharacterController;

//The AI's speed per second

var speed:float = 100;//:float;

//The max distance from the AI to a waypoint for it to continue to the next waypoint
var nextWaypointDistance:float = 1;

//The waypoint we are currently moving towards
var currentWaypoint:int = 0;//int;

var ball:GameObject;

function Update(){
	// dirrrrty
	if(!ball){
		GameObject.Find("Ball(Clone)");
	}
}

var isActive:boolean;
isActive=true;

var team:String;

function Start(){
	AssignToTeam(team);
}

function AssignToTeam(typeOfTeam:String){
	if(typeOfTeam == "Away"){
		renderer.material.color = Color.green;	
	}else{
		renderer.material.color = Color.blue;	
	}
}



function FixedUpdate () {

    //Direction to the next waypoint
    var dir:Vector3 = targetPosition;
    //dir *= speed * Time.fixedDeltaTime;
  	if(this.GetComponent(NetworkView).isMine){
	  	if(targetActive){
	  		GetComponent(CapsuleCollider).transform.LookAt(targetPosition);
	        transform.Translate(0, 0, Time.deltaTime*2);
	        if(Vector3.Distance(transform.position,targetPosition) < 0.1){
	        	targetActive = false;
	        }
	    }
	}
}
    
// Probably better to use OnTriggerStay + enable
function OnTriggerStay(collider : Collider) {
	if(collider.gameObject.GetComponent(AstarAI)){
		if(isActive && collider.gameObject.GetComponent(AstarAI).isActive && collider.tag == "Player" && ball.GetComponent(Ball).assignee == this.gameObject && IsRival(collider.gameObject)){
			//collider is the other (the collider, doh!)
			//print('clash!: ' + collider.name);
			var chance = Random.Range(1,4);
			//print("chance: " + chance);

			switch(chance){
				case 1: //Def wins
					ball.GetComponent(Ball).AssignBallTo(collider.gameObject);
					DisablePlayer(this.gameObject);
					break;
				case 2: //Tie
					var x = Random.Range(-15,15);
					var y = Random.Range(10,25);
					var z = Random.Range(-15,15);				
					DisablePlayer(this.gameObject);
					DisablePlayer(collider.gameObject);
					ball.GetComponent(Ball).LooseBall();
					ball.rigidbody.AddForce(Vector3(x,y,z)*30);
					break;
				case 3: //Att wins
					// Player gets stuck maybe because there's no code so he keeps moving the ball
					DisablePlayer(collider.gameObject);
					break;
			}
		}
	}
}

function IsRival(player:GameObject){
	if(player.GetComponent(AstarAI).team != team){
		return true;
	}else{
		return false;
	}
}

function DisablePlayer(player : GameObject){
	//disable
	//print('disable!!');
	player.GetComponent(AstarAI).targetActive = false;
	player.transform.Rotate(-90,0,0,Space.Self);
	player.transform.position.y = 0;
	player.GetComponent(AstarAI).isActive = false;
	//Physics.IgnoreCollision(player.collider, ball.collider);
	//Physics.IgnoreCollision(player.collider, this.collider);

	
	//wait
	yield WaitForSeconds (4);
	
	//enable
	//player.SetActive(true);
	player.transform.Rotate(90,0,0,Space.Self);
	player.transform.position.y = 1;
	player.GetComponent(AstarAI).isActive = true;
	//Physics.IgnoreCollision(player.collider, ball.collider,false);
	//Physics.IgnoreCollision(player.collider, this.collider,false);
}

function Shoot(){
		var goal = Vector3(Random.Range(-3.5,3.5),Random.Range(1.0,4.0),0);
		//home 0 0 15
		//away 0 0 -15
		
		//Debug.DrawLine(ball.transform.position,goal,Color.red,2);
		//var Astar = selectedPlayer.GetComponent(AstarAI);
		transform.LookAt(goal+Vector3(0,1,0));
		targetActive = false;
		ball.rigidbody.isKinematic = false;
		ball.rigidbody.velocity = Vector3(0,0,0);
		goal -= ball.transform.position;
		ball.rigidbody.AddForce(goal.normalized*34,ForceMode.Impulse);
}