//load jQuery library from google
		google.load("jquery", "1");
	
	//global vars
	var bengProjects = new Array();				//store lists of all my bioengineering projects
	var codeProjects = new Array();				//store lists of all my coding projects
	var busProjects = new Array();				//store lists of all my business projects
	
	var listProjets = new Array();				//stores lists of all my projects
	var lastSelection = null;					//stores the project last clicked on in the nav menu
	var lastIndex = 0;					
	var isSelected = null;						//flag to check if something was selected
	var dataForHome = null;						//stores the home page data exclusively
	
	/************************************************************************************
	function: keyPressed
	description: key up event handler for the page
	************************************************************************************/
	function keyPressed(e) {
		var del=0;
		var textInputBox = document.getElementById("searchboxText");
		
		if(true) return;
		
		e = e || window.event;
		
		//if left arrow or right arrow is pressed, or else don't do anything
		if(e.keyCode == 37)
			del = -1;
		else if(e.keyCode == 39)
			del = 1;
		else
			return;
			
		var nextIndex = lastIndex + del;	//increment the index
		
		//if the next index we want to select is -1, then we go home
		if(nextIndex >= -1 && nextIndex < listProjects.length() {
			lastIndex = nextIndex;
			if(lastIndex == -1)
				goHome();
			else
				clickProj("project_" + (lastIndex+1));
		}
	}
	
	
	/*************************************************************************************
	function: onLoadCallBack
	description: called when the page is loaded. Things that it does:
		1) parse the JSON data from the text file
		2) populate list of projects
		3) load the home page data
	*************************************************************************************/
	google.setOnLoadCallBack(function() {
	//JSON format of all project data
    			var url = "data.txt";

    			//set the key listener
          document.onkeyup = keyPressed;

          //hide the nav menu... we don't wanna show it just yet
            $('#folioGridContainer').hide();
            //$('#opacityMask').hide();

    			//fetch the above url and handle the response like so...
    			$.get(url, function(response){
    				
            //parse the JSON for list of all 'projects'
            var lstProjects = ($.parseJSON(response)).pages;		
    				
            //loop through the list of projects and do this...
            for(var i = 0; i < lstProjects.length; i++){

              //grab each project and push it into the grid (nav menu)
              var project = lstProjects[i];

              //unless it is a project for the "home" page
              if(project.srccode == "home"){
                dataForHome = project;
              }
              //for every other project, add the project obj into the list
              //and render the project as a menu item in the nav grid/menu
              else{
                listProjects.push(project);
                addProjectToGrid(project, listProjects.length);  
              }
              
            }
                        
            //this loads the home page. Fancy anim effects occur and
            //then we un-hide the folioGridContainer (aka nav menu)                        
            goHome();
           $('#content').animate({left:'250px'},800,function(){
              showGrid();
            });

            //bind event handler for text input
            $('#searchboxText').bind('input',function(){
              searchProjects();
            });
    			});

        });

		