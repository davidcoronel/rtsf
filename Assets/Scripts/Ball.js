#pragma strict

var assigned:boolean;
var assignee:GameObject;

function Update(){
	if(transform.position.y < -1){
		transform.position = Vector3(0,10,0);
		rigidbody.velocity = Vector3(0,-15,0);
	}

}

function Start(){
	rigidbody.interpolation = RigidbodyInterpolation.Extrapolate;;
}

// Probably better to use OnTriggerStay + enable
function OnTriggerEnter(collider : Collider) {
	if(collider.gameObject.GetComponent(AstarAI) && collider.gameObject.GetComponent(AstarAI).isActive){
		if (!assigned) {
	        //transform.parent = collider.gameObject.transform;
	        AssignBallTo(collider.gameObject);
	    }
	}
}


function OnTriggerExit(collider : Collider) {
	if (collider.tag == "Player" && collider.gameObject == assignee && assigned) {
		LooseBall();
    }
}

function LooseBall(){
    rigidbody.isKinematic = false;
    transform.parent = null;
    assignee = null;
    assigned = false;
    rigidbody.useGravity=true;
}

function AssignBallTo(player : GameObject){
		transform.parent = player.transform;
		transform.localPosition = Vector3(0,-0.8,0.5);
        assignee = player;
        assigned = true;
        rigidbody.isKinematic = true;
}