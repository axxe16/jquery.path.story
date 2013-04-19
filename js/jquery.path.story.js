/**
 * 
 * jQuery Path Story
 * 
 * Version 0.3 (19-04-2013)
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
		debug: false,
		config: true
    };
            
  // # Utilizzo la funzione $.extend per "mergiare" gli oggetti
  options = $.extend( defaults, options );
  
  return this.each(function() {
	    var book = $(this);
		console.dir(book)
		pageInfo(book);
		linearNav(book); 
		if(config)
			config(book)
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

function config(book) {
	var pages = $(book).children('section');
	var paragraph = $(pages).children('p');
	//inserisco il pulsante config
	$(book).prepend('<div class="nav" id="configBookButton"></div>');
	//inserisco il box di configurazione
	$('body').prepend('<div class="wrapConfigBook"><div id="configBook"><div class="wrapInnerConfigBook"><div class="row dSelection"><span>Dimensione Testo</span><i class="less"></i><i class="plus"></i></div><!--<div class="row mSelection"><span>Margini</span><i class="less"></i><i class="plus"></i></div><div class="row iSelection"><span>Interlinea</span><i class="less"></i><i class="plus"></i></div>--></div></div></div>');
//gestione dimensioni del testo
plus(paragraph,16,23,7,'.dSelection .plus','fontSize');
less(paragraph,16,10,6,'.dSelection .less','fontSize');

	
	//ricavo l'altezza del box di configurazione
	var heightBox = '-' + $(".wrapConfigBook").height();
	var heightBoxEnter = $(".wrapConfigBook").height();
	//comportamento pulsante per visualizzare/nascondere il box
	$("#configBookButton").click(function() {
		if ($('#configBookButton.active').length) {
			$(this).removeClass('active');
			$(".wrapConfigBook").animate({top: parseInt(heightBox), opacity:0},300);
		} else {
			$(".wrapConfigBook").css({top: parseInt(heightBox),opacity:0 }).show();
			$(".wrapConfigBook").animate({top: 0, opacity:1},400);
			$(this).addClass('active');
		}
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
  

//funzioni di controllo formattazione
function plus(target,start,end,step,button,style) { 
    //target -> elemento su cui agire
    //start  -> valore di default
    //end    -> valore massimo
    //step   -> n° di step
    //button -> elemento attuatore
    var stepValue = Math.floor((end-start)/step);
    $(button).click(function() {
        var size = $(target).css(style);
        size = size.substring(0, size.length - 2);
        if (parseInt(size) < end) {
            size = parseFloat(size) + parseInt(stepValue);
            $(target).css(style,size);
        }
    }) 
}

function less(target,start,end,step,button,style) {
    var stepValue = Math.floor((start-end)/step); 
    $(button).click(function() {
        var size = $(target).css(style);
            size = size.substring(0, size.length - 2);        
            if (parseInt(size) > end) {
                size = parseFloat(size) - parseInt(stepValue);
                $(target).css(style,size);
            }
    })
}


  
  
  
  }  
  
  });
    
}) ( jQuery );