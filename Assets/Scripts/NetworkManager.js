#pragma strict

var gameName:String = "Didi's RTS";
private var refreshing:boolean;
var hostData:HostData[];
var world:World;
world = GameObject.Find("World").GetComponent(World);

function Start () {

}

function Update () {
	if(refreshing){
		if(MasterServer.PollHostList().length > 0){
			refreshing = false;
			Debug.Log(MasterServer.PollHostList().length);
			hostData = MasterServer.PollHostList();
		}
	}

}

function startServer(){
	Network.InitializeServer(32,25001,false);
	MasterServer.RegisterHost(gameName,"RTS","Just a RTS WIP");
}

var ballPrefab:Transform;
function OnServerInitialized(){
	Debug.Log("Server initialized :P");
	world.CreateTeam("Home");	
	Network.Instantiate(ballPrefab, Vector3(0,15,0), Quaternion.identity, 0);	
	//world.ballScript = ballPrefab.GetComponent(Ball);
	world.ball = GameObject.Find("Ball(Clone)");
	world.ballScript = world.ball.GetComponent(Ball);
}

function OnMasterServerEvent(mse:MasterServerEvent){
	if(mse == MasterServerEvent.RegistrationSucceeded){
		Debug.Log("registered");
	}
}

function connectToServer(data:HostData){
	Network.Connect(data);
}

function OnConnectedToServer(){
	Debug.Log("Connected :)");
	world.CreateTeam("Away");
	world.ball = GameObject.Find("Ball(Clone)");
	world.ballScript = world.ball.GetComponent(Ball);	
}


function refreshServerList(){
	MasterServer.RequestHostList(gameName);
	refreshing = true;
}