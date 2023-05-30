/******************************
Changelog: Added External link
Last update:4/10/2019
*******************************/

/************** DYNAMIC MOBILE MENU *****************/
if(!$('.module-146, .module-43').length == 0){ //check if ry-section-header is set

	$('.ry-menu .ry-nav').children().addClass('primary');


	var menuItems = {};
	$('.ry-menu li.primary').each(function(indx){ //starts loop for each li.primary menu
		var link = $(this).find('a').attr('href'),
			txt = $(this).children('a').text(),
			cName = $(this).attr('class').replace(/ /g,""),
			externalLink = ($(this).hasClass("ry-open-link")) ? true : false;

		$(this).find('a').click(function(){
			var href = $(this).attr('href');
			//window.location.href= href;
		});

		if(!(cName.match(/dropdown/g))){ //check if theres a dropdown
			menuItems[indx] = {
				link:link,
				txt:txt,
				externalLink:externalLink
			}
		}else{
			var dropdownItems = {};
			var dropdown = {};

			/** Collect all of the dropdown and assigning it to dropdownItems{} **/

			$(this).find('.dropdown-menu li').each(function(indx){ // if dropdown class found
				var link = $(this).find('a').attr('href'),
					txt = $(this).find('a').text(),
					dropdownClass = $(this).attr('class'),
					res = dropdownClass.split(" "),
					externalLink = ($(this).hasClass("ry-open-link")) ? true : false;


				if(dropdownClass.match(/third-level/g) || dropdownClass.match(/fourth-level/g)){ // if it contains third level assign it to dropdownItems{}
					var fourthLevelcat =  (dropdownClass.match(/fourth-level-container/g)) ? res[3]: "";
					var hasFourthLevel =  (dropdownClass.match(/fourth-level-container/g)) ? "third-level-parent" : "";
					var type = dropdownClass.match(/third-level-container/g) ? "parent" : "sub";

					dropdownItems[indx] = {
						type:type,
						link:link,
						txt:txt,
						category:res[1],
						hasFourthLevel:hasFourthLevel,
						fourtLevelCat:fourthLevelcat,
						externalLink:externalLink

					}
				}else{

					dropdownItems[indx] = {
						link:link,
						txt:txt,
						externalLink:externalLink
					}

				}

			});

			/** END COLLECTION OF DROPDOWN **/

			// console.log(dropdownItems,'dropdownInt');

			/** after collecting the dropdown restructure the dropdown menu by iterating each dropdownItems{} and assign it to new {} dropdown **/
			$.each(dropdownItems , function(key,val){

				if(dropdownItems[key].type == "parent" && dropdownItems[key].type != undefined){ // check if this is parent and type not undefined
					var thirdLevel = [] ; 	// ready array for third level menu collection
					/*THIRD LEVEL STRUCTURE*/
					for(var i = 0; i <= Object.keys(dropdownItems).length -1; i++){ // iterate on existing dropdownItems to collect third level for the parent dropdown

						if(dropdownItems[i].type == "sub" && dropdownItems[key].category == dropdownItems[i].category){ // check if the iterated dropdown is a sub and category is equal to parent category

							/*************Construct Fourth Level*************/
							var fourthlevel = [] ;
							if(dropdownItems[i].hasFourthLevel == "third-level-parent"){//if has fourthlevel collect each items
								//iterate through each fourth Level Items
								for(var x = 0; x <= Object.keys(dropdownItems).length -1; x++){

									//console.log(dropdownItems[i].fourthLevelcat , dropdownItems[x].category )
									if(dropdownItems[i].fourtLevelCat == dropdownItems[x].category){
										fourthlevel.push({
											link:dropdownItems[x].link,
											txt:dropdownItems[x].txt,
											externalLink:dropdownItems[x].externalLink
										}); // then push it to fourth Level array
										//console.log("fourth level: "+ dropdownItems[x].txt + " parent: " + dropdownItems[i].txt  )
									}
								}
							}
							/***************************/
							thirdLevel.push({
								link:dropdownItems[i].link,
								txt:dropdownItems[i].txt,
								fourthLevel:fourthlevel,
								externalLink:dropdownItems[i].externalLink
							}); // then push it to thirdLevel array

						}

					}
					/**** THIRD LEVEL STRUCTURE END *****/

					/* After thirdLevel is createad for the parent dropdown add it to new {} dropdown*/
					dropdown[key] = {
						link:dropdownItems[key].link,
						txt:dropdownItems[key].txt,
						thirdLevel:thirdLevel
					}

				}else{
					if(dropdownItems[key].type != "sub" && dropdownItems[key].type == undefined ){ /* secure that dropdown sub will not be added to dropdown {}*/
						dropdown[key] = {
							link:dropdownItems[key].link,
							txt:dropdownItems[key].txt,
							externalLink:dropdownItems[key].externalLink
						}
					}

				}
			});
			/* END RESTRUCTURE OF DROPDOWN*/

			// console.log(dropdown,'dropdownobj');


			//finally add it to menuItems {}
			menuItems[indx] = {
				link:link,
				txt:txt,
				type:"dropdown",
				dropdown:dropdown,
				externalLink:externalLink
			}
		}

	});

	//console.log(menuItems,'menuobj');

	var li = "";

	li += '<li class="mob-menu mm-listitem lbl"><a>Menu</a></li>';

	/* BUILDING THE HTML STRUCTURE */
	$.each(menuItems, function(key, value) {

		var target = menuItems[key].externalLink ? "_blank" : "_self",
			addClass = menuItems[key].type != undefined ? "dropdown" : "none";

		li += '<li class=mob-menu>';

		li += '<a class='+ addClass +' href='+menuItems[key].link+' target='+ target +'>'+menuItems[key].txt+'</a>' ;

		if(!(menuItems[key].type == undefined)){

			var dropdown = menuItems[key].dropdown;

			li += '<ul class=mob-dropdown>';

			$.each(dropdown, function(key, value) {

				var target = dropdown[key].externalLink ? "_blank" : "_self"; //check primary level external link

				if(dropdown[key].type == undefined){
					li += '<li class=mob-menu>';
					li += '<a href='+dropdown[key].link+' target='+ target +'>'+dropdown[key].txt+'</a>';

					if(dropdown[key].thirdLevel != undefined && dropdown[key].thirdLevel.length > 0){
						li +='<ul class=mob-dropdown>';

						for(var i = 0 ; i <= dropdown[key].thirdLevel.length -1; i++){

							var target = dropdown[key].thirdLevel[i].externalLink ? "_blank" : "_self"; //check third level external link

							li += '<li class=mob-menu>';
							li += '<a href='+dropdown[key].thirdLevel[i].link+' target='+ target +'>'+dropdown[key].thirdLevel[i].txt+'</a>';
							if(dropdown[key].thirdLevel[i].fourthLevel.length > 0){

								li +='<ul class=mob-dropdown>';
								for(var x = 0 ; x <= dropdown[key].thirdLevel[i].fourthLevel.length -1 ; x++){

									var target = dropdown[key].thirdLevel[i].fourthLevel[x].externalLink ? "_blank" : "_self"; //check fourth level external link

									li += '<li class=mob-menu>';
									li += '<a href='+	dropdown[key].thirdLevel[i].fourthLevel[x].link+' target='+ target +'>'+	dropdown[key].thirdLevel[i].fourthLevel[x].txt+'</a>';
									li +="</li>"
								}
								li +='</ul>'
							}
							li += '</li>'
						}
						li +='</ul>'

					}

					li += '</li>';
				}


			});
			li +='</ul>';
		}

		li += '</li>';

	});

	/*********** ADD SOCIAL LINKS FROM CUSTOM FIELDS ************/
	/*
	var links = {
				'facebook':{"link":"https://www.facebook.com/BeverlyHills.Aesthetics","fa":"fab fa-facebook-square"},
				'twitter':{"link":"","fa":"fab fa-twitter-square"},
				'linkedin':{"link":"https://www.linkedin.com/in/drsamassassa/","fa":"fab fa-linkedin"},
				'google':{"link":"https://g.page/BeverlyHills-Aesthetics?share","fa":"fab fa-google-plus-square"},
				'instagram':{"link":"https://www.instagram.com/beverlyhillsaesthetics/","fa":"fab fa-instagram"},
				'Yelp':{"link":"https://www.yelp.com/biz/beverly-hills-aesthetics-los-angeles","fa":"fab fa-yelp"},
				'rss':{"link":"","fa":"fas fa-rss-square"},
				'pinterest':{"link":"","fa":"fab fa-pinterest-square"},
				'youtube':{"link":"","fa":"fab fa-youtube-square"}
			}

			if( Object.keys(links).length > 0 ){

				li += '<li class="mob-menu mm-listitem lbl"><a>Share</a></li>';

				$.each(links, function(key, value) {

					if( links[key].link != ""){
						li +='<li class=mob-menu>';
						li += "<a href="+links[key].link+">"+ "<i class=\""+ links[key].fa +"\"></i>"+key+"</a>";
						li += '</li>';
					}

				});

			}
	*/
	/*********** END ADDING OF SOCIAL LINKS ************/

	$('.mobile_menu ul').append(li);
	//console.log(li);

	/**------- END OF HTML STRUCTURE FOR MOBILE MENU ----------**/
	/********------- END OF DYNAMIC MOBILE MENU ----------*********/


}
