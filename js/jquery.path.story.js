/**
 * 
 * jQuery Path Story
 * 
 * Version 0.2 (08-04-2013)
 * semanticstone.net
 *
 * Licensed under GPL license:
 * http://www.gnu.org/licenses/gpl.html
 * 
 * @author Alessandro Grassi aka Axxe16 
 * @since 2013
 */


( function($) {
  
  $.fn.extend({
      
  storypath: function( options ) {
       
// Default
  var defaults = {
		debug: false
    };
            
  // # Utilizzo la funzione $.extend per "mergiare" gli oggetti
  options = $.extend( defaults, options );
  
  return this.each(function() {
	    var book = $(this);
		console.dir(book)
		pageInfo(book);
		linearNav(book); 
    });  
  
  //STAMPO IN OGNI PAGINA IL TITOLO DEL LIBRO, IL TITOLO DEL CAPITOLO IL NUMERO DEL CAPITOLO CORRENTE E L'AUTORE
function pageInfo(book)
{
	var pages = $(book).children('section');
	var autore = $(book).attr('data-author');
	var titolo = $(book).attr('data-title');

	//preparo le stringhe per le pagine
	titolo = '<h1 class="info titolo">' + titolo + ' di <span>' +  autore + '</span></h1>';
	
		
	$(pages).each(function(index, value) {
		var capitolo = $(value).attr('data-capther');
		var titolo_capitolo = $(value).attr('data-title');
		
		//preparo le stringhe per le pagine
		titolo_capitolo = '<h2 class="info titoloCap"><span>Capitolo: ' + capitolo + '</span> - ' + titolo_capitolo + '</h2>';
		capitolo = '<span class="info capNumber">' + capitolo + '</span>';
		
		//inserisco le stringhe nelle pagine
		$(this).prepend(titolo);
		$(this).prepend(titolo_capitolo);
		$(this).append(capitolo);		
	}); 
}

function linearNav(book) {
	var pages = $(book).children('section');
	$(book).prepend('<div class="nav" id="prevNav"></div><div class="nav" id="postNav"></div>');
	var viewportHeight = $(window).height();
	var currentPosition = $('#prevNav').offset().top;
	
	if (defaults.debug) {
		console.log(currentPosition);	
		console.log(viewportHeight);
	}
	$(window).resize(function() {
		viewportHeight = $(window).height();
		if (defaults.debug)
			console.log(viewportHeight );
	});
	$(window).scroll(function() {
		currentPosition = $('#prevNav').offset().top;
		if (defaults.debug)
			console.log(currentPosition );
	});	
			
	
	$(".nav").click(function() {
  		if($(this).attr('id')=='prevNav') {
		$('html, body').animate({
			scrollTop: - viewportHeight + currentPosition
		}, 1000);
		} 
		else if ($(this).attr('id')=='postNav') {
		$('html, body').animate({
			scrollTop: viewportHeight + currentPosition
		}, 1000);
		}
	});
}
  
  
  
  
  }  
  
  });
    
}) ( jQuery );