#pragma strict

function Start () {

}

var selectedPlayer;
var selectedColor = new Color(255,0,0,1);


var allPlayers :GameObject[];
allPlayers = GameObject.FindGameObjectsWithTag("Player");
 

function Update () {
	//DetectMousePosition();
	if(Input.GetMouseButtonDown(0)){
	    // Fire raytrace
	    var ray = Camera.main.ScreenPointToRay (Input.mousePosition);
		var hit : RaycastHit;
	    var ball = GameObject.Find("Ball");
	    // Check collision with terrain
		if (Physics.Raycast (ray, hit, 100)) {
				if(hit.collider.GetType()==typeof(CharacterController)){
					SelectPlayer(hit.collider.gameObject.name);
					return;
				}
		    // Get point of colision
			ball.rigidbody.velocity = Vector3(0,0,0);
			//print(ball.transform.position - hit.point);
			ball.rigidbody.AddForce ((hit.point - ball.transform.position + Vector3(0,0,0))*42);
		}
		


	}
}

function DetectMousePosition(){
    var ray = Camera.main.ScreenPointToRay(Input.mousePosition);
    var hit : RaycastHit;
    
}

function SelectPlayer(player){
	DeselectAllPlayers();
	var currentPlayer = GameObject.Find(player);
	currentPlayer.renderer.material.color = Color.red;
	var playerSeeker = currentPlayer.GetComponent("Seeker");
	//playerSeeker.StartPath(currentPlayer.transform.position,currentPlayer.targetPosition, OnPathComplete);
}

function DeselectAllPlayers(){
	for (var item in allPlayers){
		item.renderer.material.color = Color.gray;
	}

}