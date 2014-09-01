var today = new Date()
var DDSPEED = 10;
var DDTIMER = 15;

//load the date
function loadDate() {
	alert(today);
}


//main function to handle mouse events
function ddMenu(id, d) {

	//assign h, c to the document ID's, for header and content
	//h and c become the elements
	var h = document.getElementById(id + '-ddheader');
	var c = document.getElementById(id + '-ddcontent');
	
	//clear timer interval
	clearInterval(c.timer);
	
	//if d = 1 open up the menu
	if(d == 1) 
	{
		clearTimeout(h.timer);
		if(c.maxh && c.maxh <= c.offsetHeight) {return}
		else if(!c.maxh) {
			c.style.display = 'block';
			c.style.height = 'auto';
			c.maxh = c.offsetHeight;
			c.style.height = '0px';
		}
		c.timer = setInterval(function() {ddSlide(c, 1)}, DDTIMER);
	}
	//if d=1 collapse the menu
	else 
	{
		h.timer = setTimeout(function() {ddCollapse(c)}, 50);
	}
}

//collapse the menu
function ddCollapse(c) {
	c.timer = setInterval(function() {ddSlide(c, -1)}, DDTIMER);
}

//cancel the collapse if the user rolls over the dropdown menu
function cancelHide(id) {
	//h and c become header and content elements
	var h = document.getElementById(id + '-ddheader');
	var c = document.getElementById(id + '-ddcontent');
	
	clearTimeout(h.timer);
	clearInterval(c.timer);
	
	if(c.offsetHeight < c.maxh)
		c.timer = setInterval(function(){ddSlide(c,1)},DDTIMER);
}

// incrementally expand/contract the dropdown and change the opacity //
function ddSlide(c,d){
	var currh = c.offsetHeight;
	var dist;
	
	if(d == 1){
		dist = (Math.round((c.maxh - currh) / DDSPEED));
	}
	else{
		dist = (Math.round(currh / DDSPEED));
	}
	if(dist <= 1 && d == 1){
		dist = 1;
	}
	
	c.style.height = currh + (dist * d) + 'px';
	c.style.opacity = currh / c.maxh;
	c.style.filter = 'alpha(opacity=' + (currh * 100 / c.maxh) + ')';
	
	if((currh < 2 && d != 1) || (currh > (c.maxh - 2) && d == 1)){
		clearInterval(c.timer);
	}
}
