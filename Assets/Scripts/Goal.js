#pragma strict

function Start () {

}

function Update () {

}

	





function OnTriggerEnter(){
	renderer.material.color = Color.red;
	yield WaitForSeconds (1);
	
	renderer.material.color = Color.grey;

}
