

/* ############################################################################################################################################### 
																										
	CLASS SMOOTHI
																																			
################################################################################################################################################# */


var Smoothie = (function(public){


	/* ========================
	
		Indirect Public Containers
	
	====================================================================================================================== */
	
	this.public			= {
		smoothieContainer: $('#smoothie'),
		slideSpeed: 500
	};

	
	/* ========================
	
		Private Containers
	
	====================================================================================================================== */
	
	this.vars 				= {
		slides: 				[],
		smoothiePlaceholder: 	'smoothie____Placeholder',
		smoothieSlide:          'smoothie____Slide',
		smoothieSlideWrapper: 	'smoothie____Slide____wrapper',
		timer: 					''
	};	
	
	
	/* ========================
	
		Self Initializer
	
	====================================================================================================================== */
	
	var that 			= this;
	

	/* ========================
	
		Fetch Slide Data
	
	====================================================================================================================== */
	
	this.fetchSlideData = function(){
		
		var element 			= that.public.smoothieContainer.find('ul li'),
			slide;

		element.each(function(i){

			slide = {
				imgSrc: 		$(this).data('img-src'),
				headline: 		$(this).data('headline'),
				paragraph: 		$(this).data('paragraph'),
				btnCaption: 	$(this).data('btn-caption') ? $(this).data('btn-caption') : '',
				btnLink: 		$(this).data('btn-link') 	? $(this).data('btn-link') : '',
				btnTarget: 		$(this).data('btn-target') 	? $(this).data('btn-target') : '_blank'
			};

			that.vars.slides.push(slide);

		});

	};
	

	/* ========================
	
		Create Element
	
	====================================================================================================================== */
	
	this.createElement = function(attr = {elementType:'', elementClass:'', elementID:'', elementData:'', elementHTML:'', elementInline: ''}) {

		try{
			if(attr.elementType == ''){
				throw 'elementType parameter is empty'
			} 
			else {
				
				var element = $('<' + attr.elementType + '>',{
					class:      attr.elementClass,
					id: 		attr.elementID,
					html: 		attr.elementHTML,
					style: 		attr.elementInline  
				});				
				
				return element;

			} /* End of else */

		} /* End of try */

		catch(err){
			console.error('ELEMENT CREATION ERROR: ' + err);
			return false;
		}

		/* Well everything is good so return true */
		return true;

	}


	/* ========================
	
		Prepare Slides
	
	====================================================================================================================== */
	
	this.renderSlides = function(){
		
		var slideLen 		= that.vars.slides.length,
			link 			= '';

		/* -----------------------
			Create Slides
		--------------------------------------------------------------------------------------------------- */

		for(var i = 0; i < slideLen; i++) {
			
			link  	= '';

			if(that.vars.slides[i].btnCaption !== ''){

				link = '<a target="' + that.vars.slides[i].btnTarget + '" href="' + that.vars.slides[i].btnLink + '" >' + that.vars.slides[i].btnCaption + '</a>'
			
			}

			/* Start appending the elements */

			$('.' + that.vars.smoothiePlaceholder)
			.append(
				that.createElement({
					elementType: 'div',
					elementClass: that.vars.smoothieSlide
				})
				.append(
					that.createElement({
						elementType: 'div',
						elementClass: that.vars.smoothieSlideWrapper
					})					
					.append(
						that.createElement({
							elementType: 'h1',
							elementHTML: '<span>' + that.vars.slides[i].headline + '</span>'
						})						
					)
					.append(						
						that.createElement({
							elementType: 'p',
							elementHTML: '<span>' + that.vars.slides[i].paragraph + '</span>'
						})
					)
					.append(
						link
					)
				)
			);

		}

		/* -----------------------
			Since we are using table layouting, so the slide wrapper needs to have a fixed width
		--------------------------------------------------------------------------------------------------- */
		
		var dynamicWidth;

		$(window).on('load resize', function(){

			dynamicWidth = $('.' + that.vars.smoothieSlide).width();
			$('.' + that.vars.smoothieSlideWrapper).width(dynamicWidth);

		});
		
		$('.' + that.vars.smoothiePlaceholder).css({
			backgroundImage: "url('" + that.vars.slides[0].imgSrc + "')"
		})

	}
	
	
	/* ========================
	
		Invoke Timer
	
	====================================================================================================================== */
	
	this.invokeTimer = function(){
		
		var index 		= 0;

		that.changeSlide(index);

		that.vars.timer = setInterval(function(){
				
			if(index >= that.vars.slides.length) {
				index = 0;
			}

		that.changeSlide(index++);	

		}, that.public.slideSpeed);

	}
	

	/* ========================
	
		Change Slide
	
	====================================================================================================================== */
	
	this.changeSlide = function(index) {

		$('.' + that.vars.smoothiePlaceholder).css({
			backgroundImage: "url('" + that.vars.slides[index].imgSrc + "')"
		})

		$('.' + that.vars.smoothieSlide)
			.removeClass('current')
			.eq(index).addClass('current')

		//$('.' + that.vars.smoothieSlide).eq(index).addClass('current');

	}
	
	

	/* ========================
	
		Public Scope
	
	====================================================================================================================== */

	return {
		
		init: function(public){
			
			var returned;

			/* -----------------------
				Megre new settings
			--------------------------------------------------------------------------------------------------- */
			
			$.extend(that.public, public);


			/* -----------------------
				Fetch slide data from html element
			--------------------------------------------------------------------------------------------------- */
			
			that.fetchSlideData();


			/* -----------------------
				Create slider placeholder element.
			--------------------------------------------------------------------------------------------------- */
			
			that.public.smoothieContainer.append(
				that.createElement({
					elementType: 'div',
					elementClass: that.vars.smoothiePlaceholder
				})
			);


			/* -----------------------
				Prepare Slides for adding slide contents and render it on dom
			--------------------------------------------------------------------------------------------------- */
			
			that.renderSlides();

			that.changeSlide(0)

			/* -----------------------
				Start the timer to invoke slide rotation
			--------------------------------------------------------------------------------------------------- */
			
			that.invokeTimer();

		} /* End of Init */

	}; /* End or public scope - return*/

});


var s = new Smoothie();
s.init({
	slideSpeed: 5000
})