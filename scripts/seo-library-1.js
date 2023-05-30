$(document).ready(function(){
	// clear cookie if user clicks on no button so modal shows again on next visit
	// ***** Problem with user refreshing the page instead of clicking No -> will take it as if Yes clicked *****
	$('#btn-no').click(function(){
		var cookies = $.cookie();
		for(var cookie in cookies) {
			$.removeCookie(cookie);
			console.log("No clicked - continue to show modal");
		}		
	});
	
	// Show No Results when no results on Gallery Page
	if ( !document.getElementsByClassName('ry-seo-card').length ) {
		if( document.getElementsByClassName('ry-seo-filtered-result')[0] ) {
			var text = "No Results Found";
			document.getElementsByClassName('ry-seo-filtered-result')[0].innerHTML = text;   
		}
	}
	
	// If mobile/ipad scroll to cases when visiting page
	if( window.innerWidth < 991 ) {
		$('html, body').animate({
        	scrollTop: $('#ry-seo-main-cases').offset().top-50
    	}, 1500);
	}
});

