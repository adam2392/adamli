//load jQuery library from google
  			google.load("jquery", "1");

        //global vars
        var listProjects = new Array();     //store list of all projects 
        var lastSelection = null;           //stores the project last clicked on in the nav menu
        var lastIndex = 0;
        var isSelected = null;              //silly flag to check if something was selected
        var dataForHome = null;             //exclusively stores the home page data

        /*********************************************************************
        function : keyPressed
        description: key up event handler for the page
        *********************************************************************/
        function keyPressed(e){
          
          var del = 0;
          var textInputBox = document.getElementById("searchboxText");

          if(true) return;
          
          e = e || window.event;
          if(e.keyCode == 37) del = -1;
          else if(e.keyCode == 39) del = 1;
          else return;

          var nextIndex = lastIndex + del;
          if(nextIndex >= -1 && nextIndex < listProjects.length){ 
            lastIndex = nextIndex;
            if(lastIndex == -1) goHome(); else clickProj("project_" + (lastIndex+1));
          }
      
          
        }

  			/********************************************************************
  			function : onLoadCallback
        description : called when the page is loaded. Things to do asap:
          a. parse the JSON data from the text file
          b. populate list of projects
          c. load the home page data
  			********************************************************************/
 		  	google.setOnLoadCallback(function() {
    			
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

        
        /********************************************************************
        function : addProjectToGrid
        description : add a project to the navigation grid/menu. This routine
        dynamically inserts <div> tags for each project into the container
        (folioGridContainer). 
        ********************************************************************/
        function addProjectToGrid(project,index){
          
          /*
            The grid item is a div that contains two things - a thumb image and a
            description of the project (title + subtitle). There are also a few 
            event handlers associated with each div - hover, click and leave

            For each project, there are two divs:
              a. div for thumbnail
              b. div for text

            Note on mapping between divs and project objects in 'listProjects'...
            in the list, project objects are stored against indices [0,1,2...]
              a. IDs for divs for text:  [project_1, project_2, project_3...]
              b. IDs for divs for thumb: [project_1_bg, project_2_bg, project_3_bg...]

            general rule: id = "project_" + array_index (+ "_bg" if needed)         

          */

          //this will go as the description and title of the project
          var gridItemText = "<b style='font-size:14px'>" + project.title + "</b><br/>" + project.subtitle;
          var id = 'project_' + index;
          
          //prepare both divs - thumbnail is outer div, text is inner div
          var divString = 
          "<div class='projectFolio_bg' id='"+id+"_bg"+"'>"+
              "<div class='projectFolio' id='" + id + "' onclick='clickProj(this.id)' onmouseover='hoverProj(this.id)' onmouseout='leaveProj(this.id)'>" + "<p>"+ gridItemText +"</p>"+
              "</div>"+
          "</div>";
          
          //now grab the div for the outer container - the grid of nav menu items
          //push the divs created above inside this div
          var divProject = document.getElementById("folioGridContainer");
          divProject.innerHTML += divString;
          
          //grab the 'thumbnail' div and set the image
          document.getElementById(id+"_bg").style.background =  "url('"+project.thumb+"')";
        }

        /*******************************************************************
        function: getProjectFromId
        description: resolve 'project_1' to index [0] basically. Maps div ids
        to actual objects in the list of projects
        *******************************************************************/
        function getProjectFromId(id){
          //note the '-1' at the end is for project_1 to be shown as index '0'
          var projNum = parseInt(id.substring(id.indexOf("_")+1, id.length)) - 1;
          return listProjects[projNum];
        }

        function getIndexFromId(id){
          var projNum = parseInt(id.substring(id.indexOf("_")+1, id.length)) - 1;
          return projNum;
        }

        /*******************************************************************
        function: hoverProj
        description: handles the hover event for a particular project div
        *******************************************************************/
        function hoverProj(id){
          var projectHovered = getProjectFromId(id);
          //console.log("id:" + id);
          
          //if project being hovered on is not the current selection, 
          //change opacity to zero
          if(lastSelection!=null && projectHovered.title != lastSelection.title){
              document.getElementById(id).style.opacity = 0;
          }

          //if nothing is selected, change the opacity for the project
          //being hovered to zero
          if(lastSelection == null){
            document.getElementById(id).style.opacity = 0;
          }

        }

        /*******************************************************************
        function: clickProj
        description: handles the click event for a particular project div
        *******************************************************************/
        function clickProj(id){

          console.log("ProjectID: " + id);
          //grab the project that was clicked from the list and load 
          //project data onto the page
          var project = getProjectFromId(id);
          var index = getIndexFromId(id);
          populatePageWithProject(project);

          //set the isSelected flag, and save this as the lastSelection
          isSelected = project;
          lastSelection = project;
          lastIndex = index;

          //for all projects, restore opacity and background color
          for(var i = 0; i < listProjects.length; i++){
            var id_iter = "project_" + (i+1);
            document.getElementById(id_iter).style.opacity = 1;
            document.getElementById(id_iter).style.background = "#303030";
          }

          //for the project that was selected (by clicking just now),
          //change background to orange and set opacity to translucent
          document.getElementById(id).style.opacity = 0.95;
          document.getElementById(id).style.background = 'orange';
        }

        /*******************************************************************
        function: leaveProj
        description: handles the mouseout event for a project div
        *******************************************************************/
        function leaveProj(id){
          var projectLeft = getProjectFromId(id);
          
          //if nothing is selected, restore the opacity of the project
          //the mouse pointer just left
          if(lastSelection == null){
            document.getElementById(id).style.opacity = 1;
          }          

          //if something was selected, but it isn't the same as the project
          //the mouse pointer just left, restore its opacity
          if(lastSelection!=null && projectLeft.title != lastSelection.title){
            document.getElementById(id).style.opacity = 1;
          }
        }

        /*******************************************************************
        function: populatePageWithProject
        description: load the data from a 'project' object (list item) into
        the page. Note that the page elements the data is being loaded into
        are actually present in the HTML below... not generated dynamically!
        *******************************************************************/
        function populatePageWithProject(project){
          console.log("lastIndex:" + lastIndex);

          //some fancy animations - fade out previous entry, load new data, fade in
          //$('#categories').fadeOut(20);
          $('#content').fadeOut(20, function()
          {
            
            //load title, subtitle and bulk of the text
            document.getElementById("title").innerHTML = project.title;
            document.getElementById("subtitle").innerHTML = project.subtitle;
            document.getElementById("description").innerHTML = project.description + "<br/><br/>";
            
            //if the project has tags (skills), load those into the 'categories' div
            if(project.tags.length > 0){
              var tagString = "<span style='font-size:13px;font-weight:bold'>SKILLS</span><br/><br/>" + project.tags.replace(/,/g,"<br/>");
              //console.log("showing tags : " + tagString);
              document.getElementById("categories").innerHTML = tagString;
              document.getElementById("categories").className = "tags";
            }
            //if no tags are present, set categories to a diff CSS style to make it invisible
            else{
              document.getElementById("categories").innerHTML = "";
              document.getElementById("categories").className = "notags";    
            }


            //if the project has a link to source code, then show it in the "sourcecode" div
            //unless it is the home page. The sourcecode field in the JSON data is used to 
            //differentiate the home page from other project pages (silly hack!)
            if(project.srccode.length != "" && project.srccode != "home"){
              var srcString = "<a href='(%link)'>Source Code</a>";
              document.getElementById("sourcecode").innerHTML = srcString.replace("(%link)",project.srccode);
              document.getElementById("sourcecode").className = "source"; 
              
            }
            //again, if no code is present, set the CSS style for the 'sourcecode' div to be invisble
            else{
              document.getElementById("sourcecode").innerHTML = "";
              document.getElementById("sourcecode").className = "notags";  
            }

            //load the major resource - youtube video / image (currently all projects only have either
            //of these resources). A project must have this resource (that is how I roll!!). if no resource
            //link is present, well nothing will happen. It will be a blank div :)
            var linkString = "";
            if(project.resource.indexOf("youtube") != -1){
              linkString = "<iframe width='600' height='450' src='(%link)' frameborder='0' allowfullscreen></iframe><br />";            
            }
            else if (project.resource.length > 0){
              linkString = "<img width='600' src='(%link)'/>";
            }

            //finally once the resource (youtube/image) is known, insert the chosen HTML into the 'assets' div
            document.getElementById("assets").innerHTML = linkString.replace("(%link)",project.resource);          
          });
          
          //more fancy animation - wooohoo!
          $('#content').fadeIn('fast');
          //$('#categories').fadeIn('fast');
          
        }

        /******************************************************************
        function: searchProjects
        description: Search through all the projects for the query typed 
        into the search box
        *******************************************************************/
        function searchProjects(){

          var query = document.getElementById('searchboxText').value;
          query = query.toLowerCase().trim();
          document.getElementById("searchResultsContainer").innerHTML = "";
          document.getElementById("searchResultsContainer").className = "notags";

          if(query.length > 0){
            document.getElementById("searchResultsContainer").className = "searchresultsVisible";          
            document.getElementById("searchResultsContainer").innerHTML = "<h4>Projects with: '" + query +"'</h4>";
            for(var i = 0; i < listProjects.length; i++){
              var projTags = listProjects[i].tags.toLowerCase();
              var projText = listProjects[i].description.toLowerCase();
              var projTitle = listProjects[i].title.toLowerCase() +" "+ listProjects[i].title.toLowerCase();
              var finalSearchString = projTags + " " + projText + " " + projTitle;

              if(finalSearchString.indexOf(query)!=-1){
                var searchItemId = "searchResult_" + (i+1);
                var searchResultItemDiv = "<div class='searchResultItem' onclick='searchResultSelected(this.id)' id='"+ searchItemId +"''>"+ listProjects[i].title +"</div>";
                document.getElementById("searchResultsContainer").innerHTML += searchResultItemDiv;
              }
            }
          }
        }

        /******************************************************************
        function: searchResultsSelected
        description: event handler for when a search result is clicked
        ******************************************************************/
        function searchResultSelected(id){
          var projectId = id.replace("searchResult","project");
          console.log(projectId);
          clickProj(projectId);
        }

        /*******************************************************************
        function: toggleGridVisibility
        description: toggles the visibility of navigation menu
        *******************************************************************/
        function toggleGridVisibility(){
          
          if($('#folioGridContainer').is(":hidden")){         //nav menu is hidden, show it
              
              console.log("hide()");
              $('#folioGridContainer').hide();
              $('#content').animate({left:'250px'},800,function(){
                $('#folioGridContainer').slideDown('fast');
              });
              
          }else{ 
              $('#folioGridContainer').show();
              $('#folioGridContainer').slideUp('fast',function(){
                $('#content').animate({left:'30px'},800);
                //$('#categories').animate({left:'650px'},800);
              });
          } 
        }

        /*******************************************************************
        function: hideGrid
        description: explicit call to hide the nav menu if its visible
        *******************************************************************/
        function hideGrid(){
          if(isSelected != null){
            isSelected = null;
            toggleGridVisibility();
          }
        }

        /*******************************************************************
        function: showGrid
        description: explicit call to show the nav menu if its hidden
        *******************************************************************/
        function showGrid () {
           if($('#folioGridContainer').is(":hidden")){
              
              $('#folioGridContainer').hide();
              $('#folioGridContainer').hide();
              $('#folioGridContainer').slideDown('fast');  
          }
        }

        /*******************************************************************
        function: goHome
        description: load the home page data
        *******************************************************************/
        function goHome(){
          lastIndex = -1;
          lastSelection = null;

          //for all projects, restore opacity and background color
          for(var i = 0; i < listProjects.length; i++){
            var id_iter = "project_" + (i+1);
            document.getElementById(id_iter).style.opacity = 1;
            document.getElementById(id_iter).style.background = "#303030";
          }

          populatePageWithProject(dataForHome);      

        }

        function showMailForm(){
          document.getElementById('formName').value = "";
          document.getElementById('formMsg').value = "";
          document.getElementById('formEmail').value = "";
          $('#opacityMask').animate({left:'1%'},'slow');
        }

        function hideMailForm(){
          $('#opacityMask').animate({left:'99%'},'slow');
          return;
        }

        function sendMail(){
          var url = "http://www.justhost.com/justmail?";
          var sender = document.getElementById("formName").value;
          var email = document.getElementById("formEmail").value;
          var msg = document.getElementById("formMsg").value;
          var sendto = "webmaster@asimmittal.net";

          if(sender.trim().length>0 && checkMail(email) && msg.trim().length>0){
            
            $.get(url, {sendtoemail:sendto, name:sender, addr:email, message:msg, redirect:''},function(result){
              console.log("RESULT:" + result);
            });

            hideMailForm();
          }else{
            document.getElementById('formName').style.borderColor = (sender.trim().length == 0)? "orange":"white";
            document.getElementById('formMsg').style.borderColor = (msg.trim().length == 0)? "orange":"white"; 
            document.getElementById('formEmail').style.borderColor = (checkMail(email) == false)? "orange":"white";          
          }
        }

        function checkMail(email){
          var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
          if (filter.test(email)) {
          return true;
          }
          return false;
        }