

/* ############################################################################################################################################### 
																										
	CLASS SMOOTHI
																																			
################################################################################################################################################# */


var Smoothie = (function(public){


	/* ========================
	
		Indirect Public Containers
	
	====================================================================================================================== */
	
	this.public			= {
		smoothieContainer: 		$('#smoothie'),
		smoothieCurrent:        'currentSlide container',
		slideSpeed: 			5000
	};

	
	/* ========================
	
		Private Containers
	
	====================================================================================================================== */
	
	this.vars 				= {
		slides: 				[],
		smoothiePlaceholder: 	'smoothie____Placeholder',
		smoothieSlide:          'smoothie____Slide',
		smoothieSlideWrapper: 	'smoothie____Slide____wrapper',		
		timer: 					'',
		currentSlideIndex: 		0,
		smoothiePaginationLeft: 'smoothie____Pagination____Left',
		smoothiePaginationRight: 'smoothie____Pagination____Right'
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
	
	this.createElement = function(attr = {elementType:'', elementClass:'', elementID:'', elementHTML:'', elementInline: ''}) {

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
			
			/* Prepare link for current slide item only if user has passed btnCaption */

			if(that.vars.slides[i].btnCaption !== ''){

				link = '<a target="' + that.vars.slides[i].btnTarget + '" href="' + that.vars.slides[i].btnLink + '" >' + that.vars.slides[i].btnCaption + '</a>'
			
			}

			/* Start appending the elements */

			$('.' + that.vars.smoothiePlaceholder)
			.append(
				
				/* Creating slide item  */

				that.createElement({
					elementType: 'div',
					elementClass: that.vars.smoothieSlide
				})

				/* Append wrapper div inside slide item div */
				.append(

					/* Creating wrapper div */

					that.createElement({
						elementType: 'div',
						elementClass: that.vars.smoothieSlideWrapper
					})
					
					/* Add headline inside wrapper */

					.append(
						that.createElement({
							elementType: 'h1',
							elementHTML: '<span>' + that.vars.slides[i].headline + '</span>'
						})						
					)
					
					/* Add paragraph inside wrapper */
					.append(						
						that.createElement({
							elementType: 'p',
							elementHTML: '<span>' + that.vars.slides[i].paragraph + '</span>'
						})
					)

					/* Add link inside wrapper */

					.append(
						link
					)

				) /* End of wrapper */

			) /* End of slide item */;

		}

		/* -----------------------
			Since we are using table layouting, so the slide wrapper needs to have a fixed width.
		--------------------------------------------------------------------------------------------------- */
		
		var dynamicWidth;

		$(window).on('load resize', function(){

			dynamicWidth = $('.' + that.vars.smoothieSlide).width();
			$('.' + that.vars.smoothieSlideWrapper).width(dynamicWidth);

		});


	}
	
	
	/* ========================
	
		Render Render Pagination Arrows
	
	====================================================================================================================== */
	
	this.renderPaginationArrows = function(){
		$('.' + that.vars.smoothiePlaceholder)
		.append(
			that.createElement({
				elementType: 'div',
				elementClass: that.vars.smoothiePaginationLeft
			})
			.append(
				that.createElement({
					elementType: 'span',
					elementHTML: '<->'
				}).on('click', function(){

					clearInterval(that.vars.timer);;
					that.changeSlide('PREVIOUS');
					
				})
			)			
		)
		.append(
			that.createElement({
				elementType: 'div',
				elementClass: that.vars.smoothiePaginationRight
			})
			.append(
				that.createElement({
					elementType: 'span',
					elementHTML: '>'
				}).on('click', function(){

					clearInterval(that.vars.timer);					
					that.changeSlide('NEXT');

				})
			)
		)
	}

	
	/* ========================
	
		Invoke Timer
	
	====================================================================================================================== */
	
	this.invokeTimer = function(){
		
		/* Start timer */

		that.vars.timer = setInterval(function(){			

			that.changeSlide();	

		}, that.public.slideSpeed);

	}
	

	/* ========================
	
		Change Slide
	
	====================================================================================================================== */
	
	this.changeSlide = function(direction = '') {
		
		if(direction === 'PREVIOUS'){

			if(that.vars.currentSlideIndex === 1) {
				
				that.vars.currentSlideIndex = that.vars.slides.length - 1;				

			}

		}

		

		/* Change the placeholder's backgroung image*/
		
		$('.' + that.vars.smoothiePlaceholder).css({
			backgroundImage: "url('" + that.vars.slides[that.vars.currentSlideIndex].imgSrc + "')"
		})

		/* Now add current class to new slide which has to be shown and remove current class from any previouly showing slide */

		$('.' + that.vars.smoothieSlide)
			.removeClass(that.public.smoothieCurrent)
			.eq(that.vars.currentSlideIndex)
			.addClass(that.public.smoothieCurrent)

		
		/* Increment or set 0 index for current slide */

		if(that.vars.currentSlideIndex + 1 >= that.vars.slides.length) {
			
			that.vars.currentSlideIndex = 0;			

		} else {

			that.vars.currentSlideIndex++;
		
		}
		
	}
	
	

	/* ========================
	
		Init / Constructor
	
	====================================================================================================================== */

	this.init = (function(public){
		

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

		
		/* -----------------------
			Render Pagination Arrow		
		--------------------------------------------------------------------------------------------------- */
		
		that.renderPaginationArrows();

		/* Show first slide until timer triggers the next slide*/
		
		that.changeSlide();

		/* -----------------------
			Start the timer to invoke slide rotation
		--------------------------------------------------------------------------------------------------- */
		
		that.invokeTimer();



	})(public);

});


var s = new Smoothie({
	slideSpeed: 	  2000,
	smoothieCurrent: 'currentSlide container',
});
