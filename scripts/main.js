var themeLayout = {

	root : "",
	customFields : {},

	initNavigationToggle : function () {

		$('.menu-toggle').unbind('click').click(function (event) {
			event.stopPropagation();
			event.preventDefault();
			var body = $('body').toggleClass('nav-open');
		})

	},

	init: function(root, customFields) {
		this.root = root;
		this.customFields = customFields;

		this.initNavigationToggle();

	}
};

//this theme needs to propagate scroll events to body, for lazy load to work
$('.main-content').scroll(function () {
	$('body').trigger('scroll');
});


$(function(){

	/*********CUSTOMIZE ANIMATION PLUGIN***********/
	$.fn.royAnime = function(options){
		var royAnime = {
			init: function(el){

				this.$el = $(el);
				this.$elCarousel = this.$el.find('.carousel');

				this.settings = $.extend({
					useClass: '.to-animate',
					title:'.big-title',
					sub:'.sub-title',
					button:'.btn-wrap',
					useClassType: 'fadeIn',
					titleType:'fadeInUp',
					subType:'fadeInUp',
					buttonType:'fadeInUp',
					splitCharacter:false,
					splitCharacterTarget: 'h1',
					splitCharacterClass: 'to-animate'
				}, options);


				this.setAnimation() //Necessary;
				this.setType();

				if( this.settings.titleType ) {
					this.setTitleType();
				}
				if( this.settings.buttonType ) {
					this.setButtonType();
				}

				if( this.settings.subType ) {
					this.setSubType();
				}

				if ( this.settings.splitCharacter == true ) {
					this.splitCharacter();
				}

			},

			splitCharacter:function() {
				var thisSplitCharacterClass = this.settings.splitCharacterClass,
					thisSplitCharacterTarget = this.settings.splitCharacterTarget;

				this.$elCarouselItem = this.$elCarousel.find('.item');
				this.$elCarouselItem.each(function() {
					var targetEl = $(this).find('h1').text();
					var eachChar = targetEl.replace(/\w/g,function(eachCharacter){
						return '<span class="' + thisSplitCharacterClass + '">'+ eachCharacter +'</span>';
					})
					$(this).find( thisSplitCharacterTarget ).html(eachChar);
					$(this).find( thisSplitCharacterTarget + " ." + thisSplitCharacterClass )
					.css('display','inline-block')
				});
			},
			setType:function() {
				var dataAttr = 'animated ' + this.settings.useClassType;
				var $el = this.settings.useClass;

				this.$elCarousel.find('.item').each(function(){
					var counter = 1;
					$(this).find($el).each(function(){
						$(this).attr('data-animation', dataAttr);
						$(this).css('animation-delay', (counter / 2) + 's');
						$(this).css('animation-duration', ( (4 - counter) / 3 ) + 's');
						counter += 1;
					});
				});	

			},
			setTitleType:function() {
				var dataAttr = 'animated ' + this.settings.titleType,
					$el = this.settings.title;
				this.$elCarousel.find('.item').each(function(){
					$(this).find($el).each(function(){
						$(this).attr('data-animation', dataAttr);
					});
				});	
			},
			setButtonType:function() {
				var dataAttr = 'animated ' + this.settings.buttonType,
					$el = this.settings.button;
				this.$elCarousel.find('.item').each(function(){
					$(this).find($el).each(function(){
						$(this).attr('data-animation', dataAttr);
					});
				});	
			},
			setSubType:function() {
				var dataAttr = 'animated ' + this.settings.subType,
					$el = this.settings.sub;
				this.$elCarousel.find('.item').each(function(){
					$(this).find($el).each(function(){
						$(this).attr('data-animation', dataAttr);
					});
				});	
			},
			setAnimation:function() {
				function animateThis(elems) {
					var animEndEv = "webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend";
					elems.each(function() {
						var $this = $(this),
							$animationType = $this.data("animation");
						$this.addClass($animationType).one(animEndEv, function() {
							$this.removeClass($animationType);
						});
					});
				}
				var $thisCarousel = this.$elCarousel,
					$firstAnimatingElems = $thisCarousel
				.find(".item:first")
				.find("[data-animation ^= 'animated']");

				$thisCarousel.carousel();

				animateThis($firstAnimatingElems);

				$thisCarousel.on("slide.bs.carousel", function(e) {
					var $animatingElems = $(e.relatedTarget).find(
						"[data-animation ^= 'animated']"
					);
					animateThis($animatingElems);
				});
			}
		}
		return this.each(function(){
			royAnime.init(this);
		});
	}


	/*********CUSTOMIZE CAROUSEL PLUGIN***********/
	$.fn.themeCarousel = function(options){
		var themeCarousel = {
			init: function(el){

				this.$slider = $(el);
				this.$slidesContainer = this.$slider.find('.carousel');
				this.$slides = this.$slidesContainer.find('.item').length;
				this.$indicatorsWrap = this.$slider.find('.ry-indicator');

				this.settings = $.extend({ //Add Options Here
					leftBtn:this.$slider.find(".button-prev"),
					rightBtn:this.$slider.find(".button-next"),
					dots:false,
					nav:false,
					itemBg:false,
					setBgTarget:"",
					appendControls:false,
				}, options);


				this.initNav();
				this.setCustomSlideBg();

				if(this.settings.itemBg){
					this.setItembg();
				}
				if(this.settings.dots){
					this.initIndicator();
					this.activeIndicator();
				}
				if(this.settings.appendControls){
					this.appendControls();
				}

			},
			bindEvents:function(){
				$(this.settings.leftBtn).on('click',this.prev.bind(this));
				$(this.settings.rightBtn).on('click',this.next.bind(this));
				$(this.$slidesContainer).on('slid.bs.carousel',this.setCustomSlideBg.bind(this));

				if(this.settings.dots){
					$(this.$slidesContainer).on('slid.bs.carousel',this.activeIndicator.bind(this));
				}


			},
			prev:function(){
				this.$slidesContainer.carousel('prev');
				if(this.settings.dots){
					this.activeIndicator();
				}
			},
			next:function(){
				this.$slidesContainer.carousel('next');
				if(this.settings.dots){
					this.activeIndicator();
				}
			},
			initNav: function(){
				this.bindEvents();
			},
			initIndicator:function(){
				for(var i = 1; i <= this.$slides; i++ ){
					$(this.$indicatorsWrap).append("<span></span>");
				}
				this.$indicator = this.$slider.find('.ry-indicator span');
			},
			activeIndicator:function(){
				var _this = this;
				this.$activeSlide = this.$slidesContainer.find('.item.active').index();

				this.$indicator.each(function(i){
					if( _this.$activeSlide == i ){
						$(this).addClass('active').siblings().removeClass('active');
					}
					$(this).click(function(){
						$(_this.$slidesContainer).carousel(i);
						$(this).addClass('active').siblings().removeClass('active');
					});
				});
			},
			setItembg:function(){
				var target = ( this.settings.setBgTarget !=="") ? this.settings.setBgTarget : ".item" ;


				if(this.settings.itemBg && this.settings.setBgTarget !="" ){
					$(this.$slidesContainer).find(".item").each(function(i){
						var src = $(this).find('img').attr('src');
						$(this).find(target).css('background-image','url('+src+')');
					});
				}else{
					$(this.$slidesContainer).find(".item").each(function(i){
						var src = $(this).find('img').attr('src');
						$(this).css('background-image','url('+src+')');
					});

				}

			},
			setCustomSlideBg:function(){
				var _this = this;

				this.$slideBgSrc = this.$slidesContainer.find('.item.active img').attr('src');

				$(this.$slider).find(this.settings.setBgTarget).css('background-image','url('+ this.$slideBgSrc +')')

			},
			appendControls:function(){
				var slider = this.$slider;
				var targetSlide = this.$slidesContainer
				$(this.$slider).find('.ry-indicator').prepend('<a href="javascript:;" class="ry-play-btn"></a>');
				$(this.$slider).find('.ry-indicator').append('<a href="javascript:;" class="ry-pause-btn"></a>');
				$(slider).find('.ry-play-btn').click(function(){
					$(targetSlide).carousel('cycle');
					console.log(slider)

				});
				$(slider).find('.ry-pause-btn').click(function(){
					$(targetSlide).carousel('pause');
				});
			},

		}

		return this.each(function(){
			themeCarousel.init(this);
		});
	}

	/******CUSTOM THEME SETTINGS******/
	var themeSettings= {
		init: function(){
			var pageName = document.getElementsByTagName('body')[0].getAttribute('data-page-name');
			//intialize settings
			this.initCarousel();
			this.initRoyAnime();
			this.initRemoveBurger();
			this.initInstaFeed();
			this.initMobileMenu();
			this.initElBg();
			this.initElLink();
			this.initMultiLevelMenu();
			this.initChangeFontawesome();
			this.initDeferIframe();
			this.initFormBtn();
			this.initTruncate();
			this.initArcticleSb();
			this.initReviewStars();
			this.initActiveSb();
			this.initRandomBanner();
			this.initNoResult();
			this.initAccordion();
			this.initScrollFixed();
			this.initPdfLink();
			this.initRespondTitle();
			//this.initAOS();
			this.initScrollLink();
			this.initReviewStars();
			this.initMod6Fix();
			this.initFixMobileMenuDropdown();

			if($('#map').length > 0){
				this.initMap();
			}
		},
		initMap: function(){
			var map;
			var center = {
				//lat:,
				//lng:
			};
			map = new google.maps.Map(document.getElementById('map'), {
				center: center,
				zoom: 14
			});
			var marker = new google.maps.Marker({position: center, map: map});
		},
		initElBg: function(){
			$('.ry-el-bg').each(function(){
				var src = ($(this).find('img.ry-bg').length > 0) ? $(this).find('img.ry-bg').attr('src') : $(this).find('img').attr('src') ;
				$(this).css('background-image','url('+src+')');
			});
		},
		initElLink:function(){
			$('.ry-el-link').each(function(){
				$(this).click(function(){
					var href = $(this).find('a').attr('href');
					window.location.href = href;
				});
			});
		},
		initDeferIframe: function() {
			var vidDefer = document.getElementsByTagName('iframe');
			for (var i=0; i<vidDefer.length; i++) {
				if(vidDefer[i].getAttribute('data-src')) {
					vidDefer[i].setAttribute('src',vidDefer[i].getAttribute('data-src'));
				}
			}
		},
		initFormBtn: function() {
			$('.form-btn').click(function(){
				$(this).parents("form").submit();
			});
		},
		initRoyAnime: function() {
			$('.module-45').royAnime({
				useClass: '.ry-text',
				title:'.ry-section-title',
				sub:'.ry-section-sub-title',
				useClassType: 'fadeInUp'
			});		
		},
		initCarousel:function() {


			$('.module-91').themeCarousel({
				itemBg:true,
			})

			$('.module-90').themeCarousel()

			$('.module-170').themeCarousel({
				nav:true
			})


			var partnersSwiper = new Swiper('.brands-carousel', {
				speed: 400,
				spaceBetween: 10,
				slidesPerView: 5,
				loop: true,
				navigation: {
					nextEl: '.swiper-button-next',
					prevEl: '.swiper-button-prev',
				},
				breakpoints: {
					
					
					1440: {
						slidesPerView: 4,
						spaceBetween: 40,
					},
					
					
					1024: {
						slidesPerView: 3,
						spaceBetween: 40,
					},
					768: {
						slidesPerView: 2,
						spaceBetween: 30,
					},
					640: {
						slidesPerView: 1,
						spaceBetween: 20,
					}
				}
			})
			
			var clinicSwiper = new Swiper('.clinic .swiper-container', {
				speed: 400,
				spaceBetween: 0,
				slidesPerView: 1,
				loop: true,
				navigation: {
					nextEl: '.swiper-button-next',
					prevEl: '.swiper-button-prev',
				},
				breakpoints: {
					1024: {
						slidesPerView: 1,
						spaceBetween: 0,
					},
					768: {
						slidesPerView: 1,
						spaceBetween: 30,
					},
					640: {
						slidesPerView: 1,
						spaceBetween: 0,
					}
				}
			})

			var moveToCenter = function(swiper){swiper.swipeTo(swiper.clickedSlideIndex)}

			var ctaSlider = new Swiper('.module-83 .swiper-container', {
				slidesPerView: 4,
				spaceBetween: 100,
				centeredSlides: true,
				loop: true,
				slideToClickedSlide:true,
				onSlideClick: moveToCenter,
				navigation: {
					nextEl: '.swiper-button-next',
					prevEl: '.swiper-button-prev',
				},
				autoplay: {
					delay: 3500,
					disableOnInteraction: true,
				},
				pagination: {
					el: '.swiper-pagination',
					clickable: true,
				},
				breakpoints: {
					991: {
						slidesPerView: 1,
						spaceBetween: 20,
					}
				},
				breakpoints: {
					1440: {
						spaceBetween: 30,
					},
				}
			});
			$(".swiper-container").hover(function(){
				this.swiper.autoplay.stop();
			}, function(){
				this.swiper.autoplay.start();
			});

		},
		
		
		
		initReviewStars:function(){

			$('.blank-star').hover(function() {
				$(this).toggleClass('star-active');
				$(this).prevAll().toggleClass('star-active');
			});

			$('.blank-star').each(function(index) {
				$(this).click(function() {
					$('.blank-star').removeClass('star-active, star-rated');
					$(this).addClass('star-rated');
					$(this).prevAll().addClass('star-rated');
					$('input#rating').val(index+1);
				});
			});
		},
		
		
		initTruncate:function(){
			$('.ry-list-item').each(function(){
				var txt = $(this).find('.ry-list-excerpt p:first-child').text();
				if(txt.length > 220){
					txt = txt.substring(0,220);
					txt += '...';
				}
				$(this).find('.ry-list-excerpt').html(txt);
			});
		},
		initArcticleSb:function(){//Dynamic Sidebar Articles
			$('.ry-drop-nav').append('<ul></ul>');

			$("#accordion .ry-link-item").each(function(){

				$(this).attr('id',$(this).attr("id").replace(/[!@#$%^&*]/g,""));

				var parentID = $(this).attr('id');

				$('.ry-dropdown-list .ry-dropdown').each(function(){
					var li = $(this).find('li');

					var dataAttr = $(this).find('li').attr("data-class");

					var dataClass = (dataAttr != undefined) ? $(this).find('li').attr('data-class',dataAttr.replace(/[!@#$%^&*\s]/g,"")) : "";

					if($(dataClass).attr('data-class') == parentID) {
						$(li).appendTo(".ry-link-wrp"+" "+"#"+parentID + " ul");
					}
				});

			});

			$('.ry-drop-nav').click(function(){
				$(this).toggleClass('open').siblings().removeClass('open');
				$(this).find('ul').slideToggle();
				$(this).siblings('.ry-drop-nav').find('ul').slideUp();
			});
		},
		initActiveSb:function(){
			$('.ry-drop-nav').each(function(){
				var url = window.location.href ;
				var path = url.substr(url.lastIndexOf('/') + 1);
				$(this).find('li a').each(function(){
					var currentPath  = $(this).attr('href');
					currentPath = currentPath.substr(currentPath.lastIndexOf('/') + 1);
					if(path == currentPath){
						$(this).addClass('active');
						$(this).parents('.ry-drop-nav').addClass('open');
						$(this).parents('ul').css('display','block');
					}
				});
			});
		},
		Shuffle:function(){

			var whichToShow = Math.floor(Math.random() * $('.ry-bnr-wrp').length);

			return whichToShow;

		},
		initRandomBanner:function(){

			var show =  this.Shuffle();

			var len = $('.ry-bnr-wrp').length;

			if( $("#ry-pg-banner").length ){

				var rytitle = $('.ry-pg-title');

				var current = localStorage.getItem('current_banner') == null  ? localStorage.setItem('current_banner',show) : localStorage.getItem('current_banner');

				$('.ry-bnr-wrp').eq(show).append(rytitle);

				if( current != show){

					$('.ry-bnr-wrp').hide().eq(show).fadeIn(100);

					localStorage.setItem('current_banner',show)

				}else{

					if(len == 1) return;

					var shuffling  = true; 

					while(shuffling){

						show =  this.Shuffle();

						if( show !=  localStorage.getItem('current_banner') ){

							//console.log('shuffling',`${show} current:${current}`);

							$('.ry-bnr-wrp').hide().eq(show).fadeIn(100);

							$('.ry-bnr-wrp').eq(show).append(rytitle);

							localStorage.setItem('current_banner',show);

							shuffling = false;

						}

					}

				}
			}


		},


		initScrollFixed:function(){
			/* scroll event */
			$( window ).scroll(function() {
				var height = $(window).scrollTop();
				var header = $('.ry-sticky-menu');

				if(height  > 150) {
					$('.ry-sticky-menu').addClass('fixed');

				}else{
					$('.ry-sticky-menu').removeClass('fixed');
				}

			});
		},

		initPdfLink:function(){
			$('.ry-pdf-link').click(function(e){
				e.preventDefault();
				var href = $(this).attr('href');
				window.open('https://docs.google.com/viewerng/viewer?url='+href,'_blank')
			});

		},
		initChangeFontawesome:function(){		
			//google 
			var fa = document.querySelectorAll('.fa-google-plus');
			for ( var i = 0; i < fa.length; i++ ) {
				fa[i].classList.add('fa-google')
				fa[i].classList.remove('fa-google-plus')
			}
		},
		initMultiLevelMenu:function(){

			$('.ry-nav .dropdown').hover(function(){
				$(this).find('.dropdown-menu').addClass('hover');
			},function(){
				$(this).find('.dropdown-menu').removeClass('hover');
			});

			$('.ry-nav .third-level-container').hover(function(){
				$(this).find('.third-level-dropdown').addClass('third-hover');
			},function(){
				$(this).find('.third-level-dropdown').removeClass('third-hover');
			});

			$('.ry-nav .fourth-level-container').hover(function(){
				$(this).find('.fourth-level-dropdown').addClass('fourth-hover');
			},function(){
				$(this).find('.fourth-level-dropdown').removeClass('fourth-hover');
			});
			
			
			/*
						---third level menu class structure---
						parent li => third-level-container dental
						children => third-level dental

						---Fourth level menu class structure---
						parent li => third-level dental fourth-level-container dental_implants
						children => fourth-level dental_implants
						*/

			$('.ry-nav .fourth-level-container').each(function(){
				var ul = $('<ul></ul>').addClass('fourth-level-dropdown'),
					clss = $(this).attr('class');

				clss = clss.split(' ');

				$(this).siblings('.fourth-level.'+clss[3]).appendTo(ul)
				$(this).append(ul);
			});

			$('.ry-nav .third-level-container').each(function(){
				var ul = $('<ul></ul>').addClass('third-level-dropdown'),
					clss = $(this).attr('class');

				clss = clss.split(' ');

				$(this).siblings('.third-level.'+clss[1]).appendTo(ul)
				$(this).append(ul);
			});

		},
		initNoResult:function(){
			var result = $('.result-box .search-result').length;
			if(! result > 0){
				$('.no-result').css('display','block');
			}
		},
		initAccordion:function(){
			/*accordion*/
			$( ".ry-accordion" ).accordion({
				header: ".ry-heading",
				active:false ,
				collapsible: true,
				heightStyle:"content"
			});

		},
		initRespondTitle:function(){
			$('.ry-pg-title h1').html(function(i, html) {
				if(html.length > 20){
					$(this).addClass('ry-responsive-title');
				}
			});
		},
		initMobileMenu:function(){

			var pos = ($('.module-91').hasClass('style2') ? 'position-left' : 'position-right');

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

			/* INITIALIZE MOBILE MENU */
			var iconBarEnable = ( $(document).width() >= 992) ? false : true;
			var menuSettings = {
				enableIconBar:false,
				iconbarTopContent:[
					"<a href='./index'><i class='fa fa-home'></i></a>",
				],
				iconbarBottomContent: [],
				appendCloseBtn:true,

				//Menu Extensions
				menuPos:pos, // position-right, position-left
				menuthemeColor:"theme-black", // default:theme-light ,theme-dark, theme-white ,theme-black
				menuEffect:"", // fx-menu-zoom , fx-menu-slide , fx-menu-zoom
				menuZposition:"position-front",  // position-back , position-front
				menuPanelSlideEffect:"fx-panels-slide-up", // fx-panels-none, fx-panels-slide-0, fx-panels-slide-100 , fx-panels-slide-up ,fx-panels-zoom
				menuListItemSlideEffect:"fx-listitems-drop", // fx-listitems-drop , fx-listitems-slide , fx-listitems-fade , fx-listitems-slide
				menuBorderOffset:"border-offset", // border-full , border-offset , border-none
				menuPageDim:""  // pagedim-black , pagedim-white
			}

			if( Object.keys(links).length > 0 ){

				$.each(links, function(key, value) {
					if( links[key].link != ""){
						menuSettings.iconbarBottomContent.push("<a href="+links[key].link+">"+ "<i class=\""+ links[key].fa +"\"></i></a>");
					}

				});

			}

			var menu =	$("#mobile_menu").mmenu({

				"iconbar": {
					"add": menuSettings.enableIconBar,
					"top": menuSettings.iconbarTopContent,
					"bottom": menuSettings.iconbarBottomContent,
				},
				sidebar: {

				},

				extensions: [
					menuSettings.menuPos,
					menuSettings.menuthemeColor,
					menuSettings.menuEffect,
					menuSettings.menuZposition,
					menuSettings.menuPanelSlideEffect,
					menuSettings.menuListItemSlideEffect,
					menuSettings.menuPageDim,
				]
			});

			if(menuSettings.appendCloseBtn){
				$('<button class="hamburger hamburger--collapse" type="button"> <div class="flex-btn"> <span class="hamburger-box"><span class="hamburger-inner"></span></span> </div> </button>').appendTo('#menu_container')
			}

			if (menu.data("mmenu")) {
				var api = menu.data("mmenu");
				var icon = $('button.hamburger');

				icon.on("click", function () {
					if ($(this).hasClass('is-active')) {
						api.close();
					} else {
						api.open();
					}
				});


				api.bind("open:finish", function () {
					setTimeout(function () {
						icon.addClass("is-active");
					}, 100);
				});
				api.bind("close:finish", function () {
					setTimeout(function () {
						icon.removeClass("is-active");
					}, 100);
				});

			}

		},
		initPhoneDynamicFormat:function(){
			$('.ry-phone-dynamic')
			.text(function(i, text) { return text.replace(/(\d\d\d)(\d\d\d)(\d\d\d\d)/, '($1) $2-$3'); });
		},
		initReviewStars:function(){

			$('.blank-star').hover(function() {
				$(this).toggleClass('star-active');
				$(this).prevAll().toggleClass('star-active');
			});

			$('.blank-star').each(function(index) {
				$(this).click(function() {
					$('.blank-star').removeClass('star-active, star-rated');
					$(this).addClass('star-rated');
					$(this).prevAll().addClass('star-rated');
					$('input#rating').val(index+1);
				});
			});
		},
		initAOS:function(){
			AOS.init();
		},
		initTextTruncate:function(){
			var _this = this;
			$('#ry-section-team .item p').each(function(){

				var txt = $(this).text();

				$(this).text(_this.textTruncate(txt,250));

			});

		},
		textTruncate:function(txt , len){

			if(txt.length > len){

				txt = txt.substring(0,len);

				txt += '...';

			}

			return txt;

		},
		initSmootAnchorLink:function(offset, target){
			var	target = $(window.location.hash) ;

			if (target.length) {
				console.log(target.offset().top);
				var	target = $(window.location.hash) ;
				var targetOffset = target.offset().top - 1140;
				$('html,body')
				.animate({scrollTop: targetOffset}, 1000);
				return false;
			}

		},
		initScrollLink:function(){

			$('.arrow__wrapper').click(function() {

				if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'')
					&& location.hostname == this.hostname) {
					var $target = $(this.hash);
					$target = $target.length && $target
					|| $('[name=' + this.hash.slice(1) +']');
					if ($target.length) {
						var targetOffset = $target.offset().top - 200;
						$('html,body')
						.animate({scrollTop: targetOffset}, 1000);
						return false;
					}
				}
			});


		},
		initryOpenLink:function(){
			var _this = this;

			$('.ry-open-link a').on('click',function(e){

				e.preventDefault();

				var link = $(this).attr('href');

				_this.initOpenLinkNewTab(link);

			});

		},
		initOpenLinkNewTab:function(link){

			window.open(link, '_blank');

		},
		initMod6Fix:function(){
			$('.module-6').each(function(){
				var len = $(this).find('li').length;
				if(len % 2 == 0){
					$(this).addClass('remove-last');
				}
			});


		},
		initInstaFeed:function(){
			if( document.getElementById('instafeed') !== null ){

				var _this = this,
					appenChild = false,
					loadButton = document.getElementById('load-more');

				var feed = new Instafeed({
					get: 'user',      
					userId: '15512655178',   // get UserId here https://codeofaninja.com/tools/find-instagram-user-id
					accessToken:'15512655178.1677ed0.7a632c8d4c6c4714b9ee4860be638142', //get access token here https://instagram.pixelunion.net/
					limit:8,
					template: '<div class="flex-item">'+
					'<a class="animation" href="{{link}}" target="_blank">' +
					'<div class="ry-el-bg">'+
					'<img class="img-responsive" src="{{image}}" /></div></a>'+
					'<div class="ry-desc">{{caption}}</div>'+
					'<a class="overlay" href="{{link}}" target="_blank"></a>'+
					'</div>',
					resolution:'standard_resolution',
					success:function(json){
						var len = json.data.length;
						if(len % 4 == 2){
							appenChild = true;
						}

					},
					after:function(e){
						_this.initElBg();
						if(appenChild){
							var item = document.createElement('div');
							item.setAttribute('class','flex-item');			
							document.getElementById('instafeed').appendChild(item);
						}
						if (!this.hasNext()) {
							loadButton.style.display = "none";
						}
					}
				});
				if(loadButton != null ){
					loadButton.addEventListener('click', function() {
						feed.next();
					});		
				}


				feed.run();

			}
		},
		initRemoveBurger:function(){
			if($('.module-43').length > 0){

				$('.module-91').addClass('classic-menu-active');
			}


		},
		initFixMobileMenuDropdown:function(){
			$(".mob-menu").each(function(){
				$(this).find("a.dropdown").click(function(e){
					e.preventDefault();
					$(this).siblings(".mm-btn_next").trigger("click")
				});
			});
		},

	}

	themeSettings.init();

});


/*YOUTUBE VIDEO*/
$(document).ready(function() {
	$(".ry-btn-play-youtube-src").click(function(t) {
            t.preventDefault();
            var i = $(this),
                n = '<iframe src="' + i.attr("href") + '" width="' + i.parent().parent().width() + '" height="' + i.parent().parent().height() + '" style="z-index:900;position:absolute;top:0;left:0;width:100%;height:100%;"></iframe>';
            i.parent().parent().append(n)
        })
})



/*SELECT REGION SECTION*/


$('.ellipse').click(function(e){
	e.preventDefault();
	var classname = $(this).attr('class').split(" ")
	$(this).addClass('active').siblings().removeClass('active')
	$('.where-it-hurts' + '.'+classname[1]).addClass('active').siblings().removeClass('active')

})


$('.ry-about-service .ellipse-wrap a').addClass('pulsate-fwd');


