#pragma strict

function Start () {

}

var target:GameObject;

function Update () {
	if(target != null){
		transform.LookAt(target.transform.position);
	}
}