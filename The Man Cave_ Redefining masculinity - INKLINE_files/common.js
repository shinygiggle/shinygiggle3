/**
 * File navigation.js.
 *
 * Handles toggling the navigation menu for small screens and enables TAB key
 * navigation support for dropdown menus.
 */
( function() {
	var body, container, button, menu, links, subMenus, i, len;

	body = document.body;

	container = document.getElementById( 'site-navigation-side' );
	if ( ! container ) {
		return;
	}

	button = body.querySelectorAll('.menu-toggle');
	if ( 'undefined' === typeof button ) {
		return;
	}

	menu = container.getElementsByTagName( 'ul' )[0];

	// Hide menu toggle button if menu is empty and return early.
	if ( 'undefined' === typeof menu ) {
		button[0].style.display = 'none';
		return;
	}

	menu.setAttribute( 'aria-expanded', 'false' );
	if ( -1 === menu.className.indexOf( 'menu' ) ) {
		menu.className += ' menu';
	}

	for (var i = 0; i < button.length; i++)
		button[i].onclick = function() {
			if ( -1 !== body.className.indexOf( 'sidemenu-nav-toggled' ) ) {
				container.className = container.className.replace( ' toggled', '' );
				body.className = body.className.replace( ' sidemenu-nav-toggled', '' );
				menu.setAttribute( 'aria-expanded', 'false' );
			} else {
				container.className += ' toggled';
				body.className += ' sidemenu-nav-toggled';
				menu.setAttribute( 'aria-expanded', 'true' );
			}
		};

	// Get all the link elements within the menu.
	links    = menu.getElementsByTagName( 'a' );
	subMenus = menu.getElementsByTagName( 'ul' );

	// Set menu items with submenus to aria-haspopup="true".
	for ( i = 0, len = subMenus.length; i < len; i++ ) {
		subMenus[i].parentNode.setAttribute( 'aria-haspopup', 'true' );
	}

	// Each time a menu link is focused or blurred, toggle focus.
	for ( i = 0, len = links.length; i < len; i++ ) {
		links[i].addEventListener( 'focus', toggleFocus, true );
		links[i].addEventListener( 'blur', toggleFocus, true );
	}

	/**
	 * Sets or removes .focus class on an element.
	 */
	function toggleFocus() {
		var self = this;

		// Move up through the ancestors of the current link until we hit .menu.
		while ( -1 === self.className.indexOf( 'menu' ) ) {

			// On li elements toggle the class .focus.
			if ( 'li' === self.tagName.toLowerCase() ) {
				if ( -1 !== self.className.indexOf( 'focus' ) ) {
					self.className = self.className.replace( ' focus', '' );
				} else {
					self.className += ' focus';
				}
			}

			self = self.parentElement;
		}
	}

	/**
	 * Toggles `focus` class to allow submenu access on tablets.
	 */
	( function( container ) {
		var touchStartFn, i,
			parentLink = container.querySelectorAll( '.menu-item-has-children > a, .page_item_has_children > a' );

		if ( 'ontouchstart' in window ) {
			touchStartFn = function( e ) {
				var menuItem = this.parentNode, i;

				if ( ! menuItem.classList.contains( 'focus' ) ) {
					e.preventDefault();
					for ( i = 0; i < menuItem.parentNode.children.length; ++i ) {
						if ( menuItem === menuItem.parentNode.children[i] ) {
							continue;
						}
						menuItem.parentNode.children[i].classList.remove( 'focus' );
					}
					menuItem.classList.add( 'focus' );
				} else {
					menuItem.classList.remove( 'focus' );
				}
			};

			for ( i = 0; i < parentLink.length; ++i ) {
				parentLink[i].addEventListener( 'touchstart', touchStartFn, false );
			}
		}
	}( container ) );
} )();

(function($) { 'use strict';

	// Calculate clients viewport
	function viewport() {
		var e = window, a = 'inner';
		if(!('innerWidth' in window )) {
			a = 'client';
			e = document.documentElement || document.body;
		}
		return { width : e[ a+'Width' ] , height : e[ a+'Height' ] };
	}

	//  move sidebar in line with post content

	var asideMarginTop = function() {

		var body = $('body'),
			$content = $('#content');

		var entryHeaderHeight = $('#main .entry-header').outerHeight(true),
			sidebarMarginTop = 300;

		if ($('body.woocommerce').length) {
			sidebarMarginTop = 0;

		} else if ($('body.blog').length || $('body.archive').length || $('body.error404').length || $('body.page').length || $('body.search').length) {

			sidebarMarginTop = 0;

		} else if ($('body.single-format-gallery').length) {

			body.addClass('navigation-big-padding');
			sidebarMarginTop = entryHeaderHeight;

		} else if ($('body.single').length) {

			if ($('body.single figure.featured-image img').length) {

				body.addClass('navigation-big-padding');

				var featuredImageAspectRatio = $('figure.featured-image').find('img').get(0).naturalWidth / $('figure.featured-image').find('img').get(0).naturalHeight;

				if ( featuredImageAspectRatio <= 1) {
					sidebarMarginTop = 0;
					verticalFeaturedImage();
				} else {
					sidebarMarginTop = entryHeaderHeight;
				};

			} else if ($('body.single .content-area > .entry-video').length) {
				body.addClass('navigation-big-padding');
				sidebarMarginTop = entryHeaderHeight;

			} else {
				sidebarMarginTop = entryHeaderHeight;
			}
		} else {
			sidebarMarginTop = entryHeaderHeight;
		};

		$('aside#secondary').css('margin-top', sidebarMarginTop);

	};

	// single - on vertical featured-img change layout

	var verticalFeaturedImage = function () {
		var body = $('body');
		if (!$('.header-holder').length) {
			$('figure.featured-image').after('<div class="header-holder"></div>');
			$('.header-holder').append($('article header.entry-header'));

			body.addClass('vertical-layout');
		}
	}

	$(document).ready(function($){

		// Calculate clients viewport
		function viewport() {
			var e = window, a = 'inner';
			if(!('innerWidth' in window )) {
				a = 'client';
				e = document.documentElement || document.body;
			}
			return { width : e[ a+'Width' ] , height : e[ a+'Height' ] };
		}

		var w=window,d=document,
		e=d.documentElement,
		g=d.getElementsByTagName('body')[0],
		x=w.innerWidth||e.clientWidth||g.clientWidth, // Viewport Width
		y=w.innerHeight||e.clientHeight||g.clientHeight; // Viewport Height

		// Global Vars

		var body = $('body'),
			$window = $(window),
			wScrollTop = $window.scrollTop(),
			mainContent = $('#content'),
			mainContentPaddingTop = parseInt(mainContent.css('padding-top')),
			toTopArrow = $('.back-to-top'),
			sidemenuHamburgerMenu = $('.sidemenu .main-navigation');

		// if blackout div clicked - close sidemenu nav or search

		$('div.blackout').on('click mousedown', function() {
			closeSidemenuModal();
		});

		// Outline none on mousedown for focused elements

		body.on('mousedown', '*', function(e) {
			if(($(this).is(':focus') || $(this).is(e.target)) && $(this).css('outline-style') == 'none') {
				$(this).css('outline', 'none').on('blur', function() {
					$(this).off('blur').css('outline', '');
				});
			}
		});

		// Disable search submit if input empty
		$( '.search-submit' ).prop( 'disabled', true );
		$( '.search-field' ).keyup( function() {
			$('.search-submit').prop( 'disabled', this.value === "" ? true : false );
		});

		// Social menu

		var socialMenuTrig = $('.sidemenu #socMenuTrig');

		if(socialMenuTrig.length){
			var socialMenu = $('.sidemenu .social-navigation');
			if (socialMenu.length) {
				socialMenu.append(socialMenuTrig);
				socialMenuTrig.css({display: 'inline-block'});
			} else {
				socialMenuTrig.css({display: 'none'});
			}
		};

		// Dropcaps

		if(body.hasClass('single') || body.hasClass('page')){

			var dropcap = $('span.dropcap');
			if(dropcap.length){
				dropcap.each(function(){
					var $this = $(this);
					$this.attr('data-dropcap', $this.text());
					$this.parent().css({
						"position" : "relative",
						"z-index" : 0
					});

				});
			}

		};

		// add hr to sidemenu nav
		var sidemenuFirstLevelNav = $('.sidemenu .main-navigation ul.menu>li>a');
		var sidemenuNavHr = $('<hr class="sidemenu-nav-hr-line">');

		sidemenuFirstLevelNav.after(sidemenuNavHr);

		// dropdown button

		var menuDropdownLink = $('.main-navigation .menu-item-has-children>a, .main-navigation .page_item_has_children>a');

		var dropDownArrow = $('<button class="dropdown-toggle"><span class="screen-reader-text">toggle child menu</span><i class="icon-down"></i></button>');

		menuDropdownLink.after(dropDownArrow);


		// dropdown open on click

		var dropDownButton = $('button.dropdown-toggle');

		dropDownButton.on('click', function(e){
			e.preventDefault();
			var $this = $(this);
			$this.parent('li').toggleClass('toggle-on').find('.toggle-on').removeClass('toggle-on');
			$this.parent('li').siblings().removeClass('toggle-on');
		});

		$('.site-header .main-navigation .menu').on('mouseleave', function () {
			$(this).find('.toggle-on').removeClass('toggle-on');
		})

		// Featured Slider

		var slider;
		var direction;

		if(body.hasClass('rtl')){
			direction = true;
		}
		else{
			direction = false;
		}

		slider = $('div.featured-slider');

		slider.slick({
			slide: 'article',
			infinite: true,
			fade: true,
			dots: true,
			arrows: false,
			speed: 500,
			centerMode: false,
			draggable: true,
			touchThreshold: 20,
			slidesToShow: 1,
			cssEase: 'cubic-bezier(0.28, 0.12, 0.22, 1)',
			rtl: direction,
		});

		// show slider after init
		setTimeout(function(){
			slider.closest('.featured-slider-wrap').css({opacity: 1});
		}, 1500);

		var slides = $('.featured-slider article, .featured-page-area article');

		slides.each(function(){
			var featuredImg = $(this).find('img');
			if(featuredImg.length){
				var slideImgSrc = featuredImg.attr('src');
				$(this).find('.featured-image').css({backgroundImage: 'url('+slideImgSrc+')'});
			}
		});

		var fullwidthSlider = function() {
			var sliderHeight = slider.outerHeight();
			if(x > 1190){
				if(wScrollTop > 0){
					$('.featured-data, .slick-dots').css({opacity: (sliderHeight - wScrollTop) / sliderHeight});
				}
				else{
					$('.featured-data, .slick-dots').css({opacity: 1});
				}
			}
		};

		if ( body.hasClass('fullwidth-slider')) {
			fullwidthSlider();

			$window.scroll(function(){
				setTimeout(function(){
					wScrollTop = $(window).scrollTop();
					fullwidthSlider();
				}, 200);
			});
		}


		// On Infinite Scroll Load

		var $container = $('div.masonry');
		var infiniteHandle = $('#infinite-handle');


		if(infiniteHandle.length){

			if(x > 551){
				infiniteHandle.parent().css('margin-bottom', 140);
			}
			else{
				infiniteHandle.parent().css('margin-bottom', 120);
			}
		}

		$(document.body).on('post-load', function(){

			// Reactivate masonry on post load

			var newEl = $container.children().not('article.post-loaded, span.infinite-loader, div.grid-sizer').addClass('post-loaded');

			newEl.hide();
			newEl.imagesLoaded(function () {

				// Reactivate masonry on post load

				$container.masonry('appended', newEl, true).masonry('layout');

				setTimeout(function(){
					newEl.each(function(i){
						var $this = $(this);

						if($this.find('iframe').length){
							var $iframe = $this.find('iframe');
							var $iframeSrc = $iframe.attr('src');

							$iframe.load($iframeSrc, function(){
								$container.masonry('layout');
							});
						}

						// Gallery with full size images

						var fullSizeThumbGallery = $this.find('div.gallery-size-full[data-carousel-extra]');

						if(fullSizeThumbGallery.length){
							fullSizeThumbGallery.each(function(){
								var $this = $(this);
								var galleryItemCount = $this.find('.gallery-item').length;
								if(body.hasClass('single')){
									$this.append('<span class="gallery-count">01 / 0'+galleryItemCount+'</span>');
								}
								else{
									$this.parent().addClass('fullsize-gallery').siblings().find('.edit-link').append('<span class="gallery-count">01 / 0'+galleryItemCount+'</span>');
								}
							});
						}

						setTimeout(function(){
							newEl.eq(i).addClass('animate');
						}, 100 * (i+1));
					});
				}, 150);

				// Checkbox and Radio buttons

				radio_checkbox_animation();

			});
		});

		// move anchor on fullwidth-slider

		if (body.hasClass('fullwidth-slider')) {
			var allSlides = $('.featured-slider article');
			allSlides.each(function () {
				$(this).find('.featured-image img').unwrap();
			})
		}

		// Forms

		var smallInput = $('.entry-content > div > .contact-form input[type="text"], .entry-content > div > .contact-form input[type="email"], .entry-content > div > .contact-form input[type="url"], .comment-form input[type="text"], .comment-form input[type="email"], .comment-form input[type="url"]');
		smallInput.parent().addClass('small-input');

		// Checkbox and Radio buttons

		//if buttons are inside label
		function radio_checkbox_animation() {
			var checkBtn = $('label').find('input[type="checkbox"]');
			var checkLabel = checkBtn.parent('label');
			var radioBtn = $('label').find('input[type="radio"]');

			checkLabel.addClass('checkbox');

			checkLabel.click(function(){
				var $this = $(this);
				if($this.find('input').is(':checked')){
					$this.addClass('checked');
				}
				else{
					$this.removeClass('checked');
				}
			});

			var checkBtnAfter = $('label + input[type="checkbox"]');
			var checkLabelBefore = checkBtnAfter.prev('label');

			checkLabelBefore.click(function(){
				var $this = $(this);
				$this.toggleClass('checked');
			});

			radioBtn.change(function(){
				var $this = $(this);
				if($this.is(':checked')){
					$this.parent('label').siblings().removeClass('checked');
					$this.parent('label').addClass('checked');
				}
				else{
					$this.parent('label').removeClass('checked');
				}
			});
		}

		radio_checkbox_animation();

		if($('body[class*="woocommerce"]').length){
			setTimeout(function(){
				radio_checkbox_animation();
			}, 3000);
		}

		// Sharedaddy

		function shareDaddy(){
			var shareTitle = $('.sd-sharing .sd-title');

			if(shareTitle.length){
				var shareWrap = shareTitle.closest('.sd-sharing-enabled');
				shareWrap.attr({'tabindex': '0'});
				shareTitle.on('click touchend', function(){
					$(this).closest('.sd-sharing-enabled').toggleClass('sd-open');
				});

				$(document).keyup(function(e) {
					if(shareWrap.find('a').is(':focus') && e.keyCode == 9){
						shareWrap.addClass('sd-open');
					}
					else if(!(shareWrap.find('a').is(':focus')) && e.keyCode == 9){
						shareWrap.removeClass('sd-open');
					}
				});
			}
		}

		shareDaddy();

		// Big search field

		var bigSearchWrap = $('div.search-wrap');
		var bigSearchButtons = $('div.search-button');
		var bigSearchField = bigSearchWrap.find('.search-field');
		var bigSearchTrigger = $('.big-search-trigger');
		var bigSearchCloseBtn = $('.big-search-close');
		var bigSearchClose = bigSearchButtons.add(bigSearchCloseBtn);

		// close sidemenu modal on ESC

		var closeSidemenuModal = function() {
			if(body.hasClass('big-search')){
				body.removeClass('big-search');
				setTimeout(function(){
					$('.search-wrap').find('.search-field').blur();
				}, 100);
				$('html').css('overflow', 'auto');
			} else if (body.hasClass('sidemenu-nav-toggled')){
				body.removeClass('sidemenu-nav-toggled');
				$('.main-navigation').removeClass('toggled');
				$('html').css('overflow', 'auto');
			};
		}


		bigSearchCloseBtn.on('touchend click', function(e){
			e.preventDefault();
		});

		bigSearchClose.on('touchend click', function(){
			var $this = $(this);
			if(body.hasClass('big-search')){
				body.removeClass('big-search');
				//enableScroll();
				setTimeout(function(){
					$('.search-wrap').find('.search-field').blur();
				}, 100);
				$('html').css('overflow', 'auto');
			}
		});

		bigSearchTrigger.on('touchend click', function(e){
			e.preventDefault();
			e.stopPropagation();
			var $this = $(this);
			body.addClass('big-search');
			$('html').css('overflow', 'hidden');
			//disableScroll();

			setTimeout(function(){
				$('.search-wrap').find('.search-field').focus();
			}, 100);
		});

		bigSearchField.on('touchend click', function(e){
			e.stopPropagation();
		});

		$().on('touchend click', function(e){
			e.stopPropagation();
		});

		// close sidemenu modal on ESC

		$(document).keyup(function(e) {
			if (e.keyCode == 27) {
				closeSidemenuModal();
			}
		});

	   $('.menu-toggle').on('touchend click', function(e) {

			if ($('body.sidemenu-nav-toggled').length) {
				$('html').css('overflow', 'hidden');
			} else {
				$('html').css('overflow', 'auto');
			};
		});


		// Disable scroll if big search sidemenu is open

		// left: 37, up: 38, right: 39, down: 40,
		// spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
		var keys = {37: 1, 38: 1, 39: 1, 40: 1, 32: 1, 33: 1, 34: 1, 35: 1, 36: 1};

		var preventDefault = function (e) {
			e = e || window.event;
				if (e.preventDefault)
					e.preventDefault();
				e.returnValue = false;
		};

		var preventDefaultForScrollKeys = function (e) {
			if (keys[e.keyCode]) {
				preventDefault(e);
				return false;
			}
		};

		// Back to top and hamburger menu

		toTopArrow.on('click touchstart', function (e) {
			e.preventDefault();
			$('html, body').animate({scrollTop: 0}, 900, "easeInOutExpo");
			return false;
		});



		$(window).on("load resize scroll pageshow", function () {
			viewport();
			var $this = $(this);
			if($this.scrollTop() > 600) {
				toTopArrow.removeClass('hide');
			}
			else{
				toTopArrow.addClass('hide');
			}

			if (x > 1190) {
				if($this.scrollTop() > 200 || $('body.sidemenu-nav-toggled').length) {
					sidemenuHamburgerMenu.removeClass('hide');
				}
				else{
					sidemenuHamburgerMenu.addClass('hide');
				}
			} else {
				sidemenuHamburgerMenu.removeClass('hide');
			};
		});

		// Reposition entry footer on single posts to go above related block

		var relatedBlock = $('.jp-relatedposts');

		if(body.hasClass('single') && relatedBlock.length){
			var entryFooter = relatedBlock.siblings('footer.end-meta');
			relatedBlock.before(entryFooter);
		};  // .com only

		// Preloader - show content

		var preload = function() {
			$('body').addClass('show');
		};

		setTimeout(function(){
			preload();
		}, 100);

	}); // End Document Ready

	$(window).on('load pageshow', function(){

		// Calculate clients viewport
		function viewport() {
			var e = window, a = 'inner';
			if(!('innerWidth' in window )) {
				a = 'client';
				e = document.documentElement || document.body;
			}
			return { width : e[ a+'Width' ] , height : e[ a+'Height' ] };
		}

		var w=window,d=document,
		e=d.documentElement,
		g=d.getElementsByTagName('body')[0],
		x=w.innerWidth||e.clientWidth||g.clientWidth, // Viewport Width
		y=w.innerHeight||e.clientHeight||g.clientHeight; // Viewport Height

		// Global Vars

		var body = $('body');

		// Masonry call

		var $container = $('div.masonry');

		$container.imagesLoaded( function() {
			$container.masonry({
				columnWidth: '.grid-sizer',
				itemSelector: '.masonry article',
				transitionDuration: 0
			}).masonry('layout');

			var masonryChild = $container.find('article.hentry, article.product');

			masonryChild.each(function(i){
				setTimeout(function(){
					masonryChild.eq(i).addClass('post-loaded animate');
				}, 100 * (i+1));
			});
		});

		asideMarginTop();

	}); // End Window Load

	$(window).resize(function(){

		// Calculate clients viewport
		function viewport() {
			var e = window, a = 'inner';
			if(!('innerWidth' in window )) {
				a = 'client';
				e = document.documentElement || document.body;
			}
			return { width : e[ a+'Width' ] , height : e[ a+'Height' ] };
		}

		var w=window,d=document,
		e=d.documentElement,
		g=d.getElementsByTagName('body')[0],
		x=w.innerWidth||e.clientWidth||g.clientWidth, // Viewport Width
		y=w.innerHeight||e.clientHeight||g.clientHeight; // Viewport Height

		// Global Vars

		var body = $('body');


		asideMarginTop();

	});

	// window unload

	$(window).on('beforeunload', function () {

		var body = $('body');

		body.removeClass('show');

		setTimeout(function() {
			return true;
		}, 200)

	});

	window.onpageshow = function (event) {
		if (event.persisted) {
			window.location.reload();
		}
	};

})(jQuery);
