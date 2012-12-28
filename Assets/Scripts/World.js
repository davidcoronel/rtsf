#pragma strict



var selectedPlayer:GameObject ;
var selectedColor = new Color(255,0,0,1);

var ball:GameObject;

var ballScript:Ball;


var allPlayers :GameObject[];
allPlayers = GameObject.FindGameObjectsWithTag("Player");
 
var NM:NetworkManager;
NM = GetComponent(NetworkManager);

function Start () {

}


function Update () {


	
	// dirrrrty
	if(!ball){
		ball = GameObject.Find("Ball(Clone)");
	}
	
	if(!ballScript && ball){
		ballScript = ball.GetComponent(Ball);
	}
	
    var ray : Ray = Camera.main.ScreenPointToRay (Input.mousePosition);
	var hit : RaycastHit;

	
	if(ballScript && ballScript.assigned && Input.GetMouseButtonDown(1) && Physics.Raycast (ray, hit)){
		
		print(ballScript.assignee);
	
		var Astar = selectedPlayer.GetComponent(AstarAI);
		Astar.GetComponent(CapsuleCollider).transform.LookAt(hit.point+Vector3(0,1,0));
		Astar.targetActive = false;
	    
		
	    ballScript.LooseBall();
	    
	    var direction:Vector3 = (hit.point-ball.transform.position)*2;
		ball.rigidbody.AddForce(direction,ForceMode.Impulse);
		
		networkView.RPC("RPC_PassBall",RPCMode.Others,direction);
	}

	
	//
	if(Input.GetMouseButtonDown(0)&&Physics.Raycast (ray, hit)){

	    // Check collision with terrain
		if(hit.collider.GetType()==typeof(CapsuleCollider) && hit.collider.networkView.isMine){
			SelectPlayer(hit.collider.gameObject);
			return;
		}
		// Move selected player:
		if(selectedPlayer && hit.collider.GetType()==typeof(BoxCollider)){
			MoveSelectedPlayerTo(hit.point);
		}
	}
}

@RPC
function RPC_PassBall(direction:Vector3){
    ballScript.LooseBall();
	ball.rigidbody.AddForce(direction,ForceMode.Impulse);
}


function DetectMousePosition(input:Vector3){
	    var ray : Ray = Camera.main.ScreenPointToRay (Input.mousePosition);
		var hit : RaycastHit;
		return hit;
}

function SelectPlayer(currentPlayer:GameObject){
	DeselectAllPlayers();
	currentPlayer.GetComponent(Light).enabled = true;
//	currentPlayer.renderer.material.color = Color.red;
	var playerSeeker = currentPlayer.GetComponent("Seeker");
	selectedPlayer = currentPlayer;
	
}

function DeselectAllPlayers(){
	for (var player in allPlayers){
		//TODO: Should abstract the color assignment
		player.GetComponent(Light).enabled = false;
	}

}

function MoveSelectedPlayerTo(target:Vector3){
	var Astar = selectedPlayer.GetComponent(AstarAI);
	Astar.targetPosition = target + Vector3(0,1,0);	
	Astar.targetActive = true;	
}

function LooseBall(){
    ball.rigidbody.isKinematic = false;
}

var playerPrefab:Transform;

function CreateTeam(typeOfTeam:String){
	var spawnPosition:Vector3;
	if(typeOfTeam=="Home"){
		spawnPosition = Vector3(5,1,10);
	}else{
		spawnPosition = Vector3(5,1,-10);
	}
	for(var i:int=0;i<3;i++){
	    
		var newPlayer= Network.Instantiate(playerPrefab, spawnPosition+Vector3(-5*i,0,0), Quaternion.identity, 0);

		networkView.RPC("RPC_SetTeam",RPCMode.Others,typeOfTeam, newPlayer.GetComponent(NetworkView).viewID,i);
		
		//local
		newPlayer.GetComponent(AstarAI).team = typeOfTeam;
		newPlayer.GetComponent(AstarAI).Start();
	}
	//update all players array
	allPlayers = GameObject.FindGameObjectsWithTag("Player");
}



@RPC
function RPC_SetTeam(typeOfTeam:String, viewID:NetworkViewID, i:int){
	// NEED ACCESS TO NETWORK VIEW TO ASSIGN TO TEAM
	
	//yield WaitForSeconds(3);
	
	var player = NetworkView.Find(viewID).gameObject;
	
	//RETURNING NULL CONSTANTLY
	
	player.GetComponent(AstarAI).team = typeOfTeam;
	player.GetComponent(AstarAI).Start();
}



function OnGUI () {
/*
	if (GUI.Button (Rect (10,20,100,25), "Crear home")) {
		CreateTeam("Home");
	}
	if (GUI.Button (Rect (10,60,100,25), "Crear away")) {
		CreateTeam("Away");
	}	

	if (GUI.Button (Rect (10,100,100,25), "Tiro al arco")) {
		var Astar = selectedPlayer.GetComponent(AstarAI);
		Astar.Shoot();
	}
	if (GUI.Button (Rect (10,140,100,25), "Bullet time!")) {
		Time.timeScale = 0.4;
		Time.fixedDeltaTime = 0.02 * Time.timeScale;
	}	
	if (GUI.Button (Rect (10,180,100,25), "Normal time")) {
		Time.timeScale = 1;
		Time.fixedDeltaTime = 0.02;
	}
*/
	if(!Network.isClient && !Network.isServer){
		if (GUI.Button (Rect (10,220,100,25), "Crear Server")) {
			NM.startServer();
		}
		if (GUI.Button (Rect (10,260,100,25), "Refresh")) {
			NM.refreshServerList();
		}
		if(NM.hostData){
			for(var i:int = 0; i < NM.hostData.length; i++){
				if(GUI.Button(Rect (300, 10, 100,25), NM.hostData[i].gameName)){
					NM.connectToServer(NM.hostData[i]);
				}
			}
		}
	}
}	



