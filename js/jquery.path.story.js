/**
 * 
 * jQuery Path Story
 * 
 * Version 0.6 (23-05-2013)
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
		config: true,
		cookie: true,
		coverPath:'images/cover.jpg'
    };
            
  // # Utilizzo la funzione $.extend per "mergiare" gli oggetti
  options = $.extend( defaults, options );
  
  return this.each(function() {
	    var book = $(this);
		pageInfo(book);
		linearNav(book); 
		logBox(book);
		if(options.config)
			config(book,options.cookie);
		if(options.config != '')
			setCover(book,options.coverPath);
		
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
		//attribuisco un id univoco a ciascuna sezione o capitolo
		$(this).attr('id','cap' + capitolo);
		
		//preparo le stringhe per le pagine
		titolo_capitolo = '<h2 class="info titoloCap"><span>Capitolo: ' + capitolo + '</span> - ' + titolo_capitolo + '</h2>';
		capitolo = '<span class="info capNumber">' + capitolo + '</span>';
		
		//inserisco le stringhe nelle pagine
		$(this).prepend(titolo);
		$(this).prepend(titolo_capitolo);
		$(this).append(capitolo);		
	}); 
}

function config(book,cookie) {
	var pages = $(book).children('section');
	pages.wrapInner('<div class="innerSection">');
	pages = pages.children('div');
	var paragraph = $(pages).children('p');
	
	
	//ripristino le impostazioni iniziali verificando i cookie
	margin = getCookie('margin');
	fontSize = getCookie('fontSize'); 
	lineHeight = getCookie('lineHeight');
	//se i cookie contengono impostazioni precedenti allora il documento viene formattato di conseguenza
	if (margin !='noValue') 	$(pages).css({marginLeft : margin + 'em', marginRight : margin + 'em'});
	if (fontSize !='noValue') 	$(paragraph).css('fontSize',fontSize + 'em');
	if (lineHeight !='noValue') $(pages).css('lineHeight',lineHeight + 'em');
	
	
	
	//inserisco il pulsante config
	$(book).prepend('<div class="nav" id="configBookButton"></div>');
	//inserisco il pulsante richiamo indice
	$(book).prepend('<div class="nav" id="indexButton"></div>');
	
	//visualizza la percentuale di completamento
	$(book).prepend('<i id="ref">reference</i>');
	$('#ref').css({
					position : 'fixed',
					top: 0,
					left:0,
					display: 'none'
					});
	var progressPercent = progress(book);
	$(window).scroll(function() {
		var progressPercent = progress(book);
		$('#progressPrercent span').text(progressPercent + '%');
	})
	//inserisco il pulsante richiamo indice
	$(book).prepend('<div class="nav" id="progressPrercent"><span>' + progressPercent +'%</span></div>');
	
	//inserisco il box di configurazione
	$('body').prepend('<div class="wrapConfigBook"><div id="configBook"><div class="wrapInnerConfigBook"><div class="row dSelection"><span>Dimensione Testo</span><i class="less"></i><i class="plus"></i></div><div class="row mSelection"><span>Margini</span><i class="less"></i><i class="plus"></i></div><div class="row iSelection"><span>Interlinea</span><i class="less"></i><i class="plus"></i></div></div></div></div>');
//gestione dimensioni del testo
plus(paragraph,1,2,3,'.dSelection .plus','fontSize');
less(paragraph,1,0.7,3,'.dSelection .less','fontSize');
//gestione dimensioni interlinea
plus(pages,1.5,2.5,3,'.iSelection .plus','lineHeight');
less(pages,1.5,1,3,'.iSelection .less','lineHeight');
//gestione margini
plusMargin(pages,3,8,5,'.mSelection .plus');
lessMargin(pages,3,1,3,'.mSelection .less');
	
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
//dimensioni carattere e interlinea
function plus(target,start,end,step,button,style) { 
    //target -> elemento su cui agire
    //start  -> valore di default
    //end    -> valore massimo
    //step   -> n° di step
    //button -> elemento attuatore
    var stepValue = (end-start)/step;
    $(button).click(function() {
        var size = $(target).css(style);
		size = parseFloat(pxToEm(size,'section',false)); 
        if (size < end) {
            size = size + stepValue;
            if(options.cookie) setCookie(style, size, 365, '/');
            $(target).css(style,size + 'em');
        }
    }) 
}

function less(target,start,end,step,button,style) {
    var stepValue = (start-end)/step; 
    $(button).click(function() {
        var size = $(target).css(style);
			size = parseFloat(pxToEm(size,'section',false));
            if (size > end) {
                size = size - stepValue;
                if(options.cookie) setCookie(style, size, 365, '/');
                $(target).css(style,size + 'em');
            }
    })
}


//gestione margini
//funzioni di controllo formattazione
//dimensioni margini
function plusMargin(target,start,end,step,button) { 
    var stepValue = (end-start)/step;
    $(button).click(function() {
        var size= $(target).css('marginLeft');
		size = parseFloat(pxToEm(size,'section',false));
        if (size < end) {
            size = size + stepValue;
            if(options.cookie) setCookie('margin', size, 365, '/');
            $(target).css({marginLeft : size + 'em', marginRight : size + 'em'});
        }
    }) 
}

//gestione margini
//dimensioni margini
function lessMargin(target,start,end,step,button) { 
    var stepValue = (start-end)/step;
    $(button).click(function() {
        var size= $(target).css('marginLeft');
			size = parseFloat(pxToEm(size,'section',false));
        if (size > end) {
            size = size - stepValue;
            if(options.cookie) setCookie('margin', size, 365, '/');
            $(target).css({marginLeft : size + 'em', marginRight : size + 'em'});
        }
    }) 
}


function pxToEm(value,scope,reverse) {
		 var pxVal = (value === '') ? 0 : parseFloat(value);
            var scopeVal;
            var getWindowWidth = function(){
                var de = document.documentElement;
                return self.innerWidth || (de && de.clientWidth) || document.body.clientWidth;
            };  
            
            /* When a percentage-based font-size is set on the body, IE returns that percent of the window width as the font-size. 
                For example, if the body font-size is 62.5% and the window width is 1000px, IE will return 625px as the font-size.      
                When this happens, we calculate the correct body font-size (%) and multiply it by 16 (the standard browser font size) 
                to get an accurate em value. */


			jQuery.browser = {};
			jQuery.browser.mozilla = /mozilla/.test(navigator.userAgent.toLowerCase()) && !/webkit/.test(navigator.userAgent.toLowerCase());
			jQuery.browser.webkit = /webkit/.test(navigator.userAgent.toLowerCase());
			jQuery.browser.opera = /opera/.test(navigator.userAgent.toLowerCase());
			jQuery.browser.msie = /msie/.test(navigator.userAgent.toLowerCase());


                        
            if (scope == 'body' && jQuery.browser.msie && (parseFloat($('body').css('font-size')) / getWindowWidth()).toFixed(1) > 0.0) {
                var calcFontSize = function(){          
                    return (parseFloat($('body').css('font-size'))/getWindowWidth()).toFixed(3) * 16;
                };
                scopeVal = calcFontSize();
            }
            else { scopeVal = parseFloat(jQuery(scope).css("font-size")); }
                    
            var result = (reverse === true) ? (pxVal * scopeVal).toFixed(2) + 'px' : (pxVal / scopeVal).toFixed(2) + 'em';
            return result;
		}
		



//gestione cookie
  
function getCookie(w){
	cName = "noValue";
	pCOOKIES = new Array();
	pCOOKIES = document.cookie.split('; ');
	for(bb = 0; bb < pCOOKIES.length; bb++){
		NmeVal  = new Array();
		NmeVal  = pCOOKIES[bb].split('=');
		if(NmeVal[0] == w){
			cName = unescape(NmeVal[1]);
		}
	}
	return cName;
}

function printCookies(w){
	cStr = "";
	pCOOKIES = new Array();
	pCOOKIES = document.cookie.split('; ');
	for(bb = 0; bb < pCOOKIES.length; bb++){
		NmeVal  = new Array();
		NmeVal  = pCOOKIES[bb].split('=');
		if(NmeVal[0]){
			cStr += NmeVal[0] + '=' + unescape(NmeVal[1]) + '; ';
		}
	}
	return cStr;
}

function setCookie(name, value, expires, path, domain, secure){
	document.cookie = name + "=" + escape(value) + "; ";
	
	if(expires){
		expires = setExpiration(expires);
		document.cookie += "expires=" + expires + "; ";
	}
	if(path){
		document.cookie += "path=" + path + "; ";
	}
	if(domain){
		document.cookie += "domain=" + domain + "; ";
	}
	if(secure){
		document.cookie += "secure; ";
	}
}

function setExpiration(cookieLife){
    var today = new Date();
    var expr = new Date(today.getTime() + cookieLife * 24 * 60 * 60 * 1000);
    return  expr.toGMTString();
}  

function setCover(book,coverPath) {
	var autore = $(book).attr('data-author');
	var titolo = $(book).attr('data-title');
	
	//nascondo il libro
	$(book).hide();
	
	//appendo la cover e l'indice
	var indice = getIndex(book);
	$('body').append('<div id="cover"><img class="front" alt="' + titolo + '" src="' + coverPath + '" title="' + titolo + ' di ' + autore + '"  /><div id="indice" class="back"><div class="innerIndice"><h3>INDICE</h3>'  + indice + '</div></div></div>');
	$('.innerIndice').prepend('<h3>' + titolo + '<br/> di ' + autore + '</h3>');
	
	$('#indexButton').toggle(function() {
		$(book).fadeOut(1000);
		$('#cover').fadeIn(500);
	})	

	var viewportHeight = $(window).height(); //altezza finestra
	var coverHeight = $('#cover').height(); //altezza cover
	if (viewportHeight <= coverHeight) {
		$('#cover').css({
				position : 'relative',
				margin: '0 auto',
				left: 0,
				top: 0
		})
	}
	$(window).scroll(function() {
		var viewportHeight = $(window).height(); //altezza finestra
		var coverHeight = $('#cover').height(); //altezza cover
		if (viewportHeight <= coverHeight) {
			$('#cover').css({
					position : 'relative',
					margin: '0 auto',
					left: 0,
					top: 0
			})
		} else {
			$('#cover').css({
					position : 'absolute',
					marginLeft: -252,
					marginTop: -360,
					left: '50%',
					top: '50%'
			});
		}
	});	
	

$('#cover').click(function() {
	$(this).addClass('flip');
    })

$('#indice').click(function() {
    $(this).fadeOut(2000).hide()
	$(book).fadeIn(1000);
})

$('#indexButton').click(function() {
    $(book).fadeOut(2000).hide()
	$('#indice').fadeIn(1000);
})

}

function getIndex(book) {
	var pages = $(book).children('section');
	var indice = '<ul class="listaIndice">';
	$(pages).each(function(index, value) {
		var capitolo = $(value).attr('data-capther');
		var titolo_capitolo = $(value).attr('data-title');
		indice = indice + '<li><a href="#cap' +  capitolo + '">CAP. ' + capitolo + ': ' + titolo_capitolo + '</a></li>';
	});
	indice = indice + '</ul>';
	return indice;
}

function logBox(book) {
	$(book).append('<div id="logBox"></div>');
}

function progress(book) {
	var heightBook = $(book).height();
	var posReference = $('#ref').offset().top;
	var progressPercent = Math.floor((posReference/heightBook)*100);
	return progressPercent;
	}
  }
  
});
    
}) ( jQuery );