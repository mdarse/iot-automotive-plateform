/*
 * Au clic sur un bouton, celui-ci devient sélectionné.
 * On doit donc changer l'état du nouveau bouton mais aussi du bouton actuel
 * car un seul bouton peut-être sélectionné à la fois.
 * Parfois, il n'y a pas 2 mais 3 boutons.
 */

 /* si le bouton est cliqué,	-> addeventlistener
 alors il est sélectionné	= style
 alors il est disabled		= 

*/

document.getElementById('door-close').addEventListener('click', changeEtat, false);
document.getElementById('door-open').addeventlistener('click', changeEtat, false);

function changeEtat() {
//	this.disabled = disabled;
	this.className = this.className + ' selection';
}