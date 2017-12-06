if(location.href.toLowerCase().indexOf('testevents=true') > -1) {
	ga = function ga(a, b, c, d, e) {
		console.log("ga('" + a + "', '" + b + "', '" + c + "', '" + d + "', '" + e + "');");
		return false;
	};
};

alberta = new function() {
	var o = this;
	var currentDomain;
	
	this.queryString = {};
	
	// queryString
	// youtube
	// forms
	// labels
	// maps
	
	/*** labels **************************************************************/
	
	labels = {
		'en': {
			accordion: {
				expand: 'Expand',
				collapse: 'Collapse'
			},
			toc: {
				label: 'On this page:'
			}
		},
		'fr': {
			accordion: {
				expand: 'E',
				collapse: 'C'
			},
			toc: {
				label: 'Dans cette page:'
			}
		},
		'de': {
			accordion: {
				expand: 'E',
				collapse: 'C'
			},
			toc: {
				label: 'Auf dieser seite:'
			}
		}
	};
	
	/*** elements ************************************************************/
	
	elements = new function() {
		this.html = null;
		this.toc = null;
		this.tocH2 = null;
		this.tocUL = null;
		this.content = null;
		this.main = null;
		this.related = null;
		this.contact = null;
		
		this.headings = [];
		this.tables = [];
		this.cards = [];
		this.tocItems = [];
	};
	
	/*** alberta.data ********************************************************/
	
	this.data = new function() {
		this.language = 'en';
		this.media = 'screen';
		this.pageAnimationTicking = false;
		this.tableAnimationTicking = false;
		
		this.page = {
			scroll: {
				top: 0,
				left: 0,
				width: 0,
				height: 0
			}
		};
		this.viewport = {
			width: 0,
			height: 0
		};
		this.content = {
			top: 0,
			left: 0,
			width: 0,
			height: 0
		};
		this.toc = {
			top: 0,
			left: 0,
			width: 0,
			height: 0
		};
		
		this.headings = [];
		this.forms = [];
		this.captchas = [];
	};
	
	/*** handlers ************************************************************/
	
	handlers = new function() {
		
		/*** resize **********************************************************/
		
		this.resize = new function() {
			
			/*** page ********************************************************/
		
			this.page = function() {
				// add in something to track the width for which breakpoint we are at
				// once into the mobile range change to the mobile menu and cancel all this stuff
				
				// set something with the breakpoint value in this function if not in the previously set value then do any breakpoint updates
				
				console.log('resize.page');
				
				// viewport
				o.data.viewport.width = (window.innerWidth ? window.innerWidth : (document.documentElement && document.documentElement.clientWidth ? document.documentElement.clientWidth : (document.body && document.body.clientWidth ? document.body.clientWidth : 0)));
				o.data.viewport.height = (window.innerHeight ? window.innerHeight : (document.documentElement && document.documentElement.clientHeight ? document.documentElement.clientHeight : (document.body && document.body.clientHeight ? document.body.clientHeight : 0)));
				
				// scroll
				o.data.page.scroll.top = document.documentElement.scrollTop + document.body.scrollTop;
				o.data.page.scroll.left = document.documentElement.scrollLeft + document.body.scrollLeft;
				o.data.page.scroll.width = document.documentElement.scrollWidth;
				o.data.page.scroll.height = document.documentElement.scrollHeight;
				
				o.data.content = getCoords(elements.content);
				o.data.main = getCoords(elements.main);
				o.data.footer = getCoords(elements.footer);
				
				if(elements.toc) {
					o.data.toc = getCoords(elements.toc);
					o.data.toc.width = o.data.content.width - o.data.main.width;
					
					// headings
					for(var c = 0; c < elements.headings.length; c++) {
						o.data.headings[c] = getCoords(elements.headings[c]);
					};
				};
				
				requestPageAnimationTick();
			};
		};
		
		/*********************************************************************/
		
		this.scroll = new function() {
			
			/*** page ********************************************************/
			
			this.page = function() {
				
				console.log('scroll.page');
				
				o.data.page.scroll.top = document.documentElement.scrollTop + document.body.scrollTop;
				o.data.page.scroll.left = document.documentElement.scrollLeft + document.body.scrollLeft;
				o.data.page.scroll.width = document.documentElement.scrollWidth;
				o.data.page.scroll.height = document.documentElement.scrollHeight;
				
				o.data.content = getCoords(elements.content);
				o.data.main = getCoords(elements.main);
				o.data.footer = getCoords(elements.footer);
				
				if(elements.toc) {
					o.data.toc = getCoords(elements.toc);
					o.data.toc.width = o.data.content.width - o.data.main.width;
				};
				
				requestPageAnimationTick();
			};
			
			/*** table *******************************************************/
			
			this.table = function() {
				console.log('scroll.table');
				
				requestTableAnimationTick();
			};
		};
	};
	
	/*** requestAnimationFrame ***********************************************/
	
	// fill out polyfill better
	requestAnimationFrame = (function() {
		return window.requestAnimationFrame || function(cb) {
			return setTimeout(cb, 17);
		};
	})();
	
	/*** requestPageAnimationTick ********************************************/
	
	// may need a couple types of ticks
	requestPageAnimationTick = function() {
		if(!o.data.pageAnimationTicking) {
			o.data.pageAnimationTicking = true;
			requestAnimationFrame(o.pageUpdate);
		};
	};
	
	/*** requestTableAnimationTick *******************************************/
	
	// may need a couple types of ticks
	requestTableAnimationTick = function() {
		if(!o.data.tableAnimationTicking) {
			o.data.tableAnimationTicking = true;
			
			requestAnimationFrame(o.tableUpdate);
		};
	};
	
	/*** getCoords ***********************************************************/
	
	getCoords = function(elem) { 
	 	if(elem) {
		 	// crossbrowser version
		    var box = elem.getBoundingClientRect();
		
		    var body = document.body;
		    var docEl = document.documentElement;
		
		    var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
		    var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;
		
		    var clientTop = docEl.clientTop || body.clientTop || 0;
		    var clientLeft = docEl.clientLeft || body.clientLeft || 0;
		
		    var top  = box.top +  scrollTop - clientTop;
		    var left = box.left + scrollLeft - clientLeft;
		
		    return {
		    	top: Math.round(top),
		    	left: Math.round(left),
		    	width: elem.offsetWidth,
		    	height: elem.offsetHeight
		    };
	    } else {
	    	return { top: 0, left: 0, width: 0, height: 0 };
	    };
	};
	
	/*** getCoords ***********************************************************/
	
	urlToDomain = function(z) {
		var a = z.slice(z.indexOf('://') + 3, z.indexOf('/', z.indexOf('://') + 3));			
		return a;
	};
	
	
	/**************************************************************************
	* accordions
	* 
	***/
	
	this.accordions = new function() {
		
		/*** accordions.init *************************************************/
		
		this.init = function() {
			// load into elements on init
			var a = document.getElementsByClassName('accordions');
			for(c = 0; c < a.length; c++) {
				var toolbar = document.createElement('div');
				toolbar.className = 'toolbar';
				
				var expand = document.createElement('a');
				expand.appendChild(document.createTextNode(labels[o.data.language].accordion.expand));
				expand.className = 'button-primary expand';
				expand.href = '?a=expand';
				expand.onclick = (function(a, c) {
					return function() {
						var items = a[c].getElementsByClassName('accordion');
						for(cItem = 0; cItem < items.length; cItem++) {
							var title = items[cItem].getElementsByClassName('title')[0];
							var text = items[cItem].getElementsByClassName('text')[0];
							
							// set aria status to expanded
							text.className = text.className.replace('collapsed', 'expanded');
							title.firstChild.setAttribute('aria-expanded', 'true');
						};
						return false;
					};
				})(a, c);
				
				var collapse = document.createElement('a');
				collapse.appendChild(document.createTextNode(labels[o.data.language].accordion.collapse));
				collapse.className = 'button-primary collapse';
				collapse.href = '?a=collapse';
				collapse.onclick = (function(a, c) {
					return function() {
						var items = a[c].getElementsByClassName('accordion');
						for(cItem = 0; cItem < items.length; cItem++) {
							var title = items[cItem].getElementsByClassName('title')[0];
							var text = items[cItem].getElementsByClassName('text')[0];
							
							// set aria status to expanded
							text.className = text.className.replace('expanded', 'collapsed');
							title.firstChild.setAttribute('aria-expanded', 'false');
						};
						return false;
					};
				})(a, c);
				
				toolbar.appendChild(expand);
				toolbar.appendChild(collapse);
				a[c].insertBefore(toolbar, a[c].firstChild);
				
				var b = a[c].getElementsByClassName('accordion');
				for(c2 = 0; c2 < b.length; c2++) {
					var title = b[c2].getElementsByClassName('title')[0];
					var text = b[c2].getElementsByClassName('text')[0];
					var anchor = document.createElement('a');
					anchor.className = '';
					anchor.href = '?a=accordion';
					anchor.setAttribute('aria-expanded', 'false');
					
					anchor.onclick = (function(text, anchor) {
						return function() {
							if(text.className.indexOf('collapsed') > -1) {
								text.className = text.className.replace('collapsed', 'expanded');
								anchor.setAttribute('aria-expanded', 'true');
							} else {
								text.className = text.className.replace('expanded', 'collapsed');
								anchor.setAttribute('aria-expanded', 'false');
							};
							
							return false;
						};
					})(text, anchor);
					
					anchor.appendChild(title.firstChild);
					title.appendChild(anchor);
					
					text.className += ' collapsed';
				};
			};
		};
	};
	
	
	/**************************************************************************
	* cards
	* 
	***/
	
	this.cards = new function() {
		
		/*** cards.init ******************************************************/
		
		this.init = function() {
			// populate all cards into elements
			console.log('cards.init');
			elements.cards = document.getElementsByClassName('card');
		};
		
		/*** cards.update ****************************************************/
		
		this.update = function() {
			console.log('cards.update');
			
			// pull all cards into the elements array
			var groupTop = -1;
			var group = [];
			var maxHeight = 0;
			
			for(var c = 0; c < elements.cards.length; c++) {
				elements.cards[c].style.height = null;
			};
			for(var c = 0; c < elements.cards.length; c++) {
				cardTop = elements.cards[c].offsetTop;
				
				if(groupTop != cardTop) {
					for(var c2 = 0; c2 < group.length; c2++) {
						group[c2].style.height = maxHeight + 'px';
					};
					groupTop = cardTop;
					maxHeight = 0;
					group = [];
				};
				group.push(elements.cards[c]);
				if(maxHeight < elements.cards[c].offsetHeight) {
					maxHeight = elements.cards[c].offsetHeight;
				};
			};
			for(var c2 = 0; c2 < group.length; c2++) {
				group[c2].style.height = maxHeight + 'px';
			};
		};
	};
	
	
	/**************************************************************************
	* forms
	* 
	***/
	
	this.forms = new function() {
		
		/*** forms.init ******************************************************/
		
		this.attach = function(z) {
			o.data.forms.push(z);
		};
	};
	
	
	/**************************************************************************
	* tables
	* 
	***/
	
	this.tables = new function() {
		
		/*** tables.init ******************************************************/
		
		this.init = function() {
			var tables = document.getElementsByClassName('table');
			
			for(c = 0; c < tables.length; c++) {
				var div = document.createElement('div');
				div.className = 'table-outer';
				tables[c].parentNode.insertBefore(div, tables[c]);
				div.appendChild(tables[c]);
				
				elements.tables.push(div);
			};
		};
		
		/*** tables.update ****************************************************/
		
		this.update = function() {
			if(elements.tables.length > 0) {
				for(c = 0; c < elements.tables.length; c++) {
					var tableScroll = elements.tables[c].firstChild;
					
					if(tableScroll.scrollWidth == tableScroll.clientWidth) {
						elements.tables[c].className = 'table-outer';
					} else if(tableScroll.scrollLeft == 0) {
						elements.tables[c].className = 'table-outer start';
					} else if(tableScroll.scrollLeft == tableScroll.scrollWidth - tableScroll.clientWidth) {
						elements.tables[c].className = 'table-outer end';
					} else {
						elements.tables[c].className = 'table-outer middle';
					};
				};
			};
		};
	};
	
	
	/**************************************************************************
	* tableOfContents
	* 
	***/
	
	this.tableOfContents = new function() {
		
		/*** tableOfContents.init ********************************************/
		
		this.init = function () {
			if(elements.toc) {
				
				/*** populate headings array ***/
				
				var h2s = elements.main.getElementsByTagName('h2');
				
				for(var c = 0; c < h2s.length; c++) {
					elements.headings.push(h2s[c]);
					o.data.headings.push(getCoords(h2s[c]));
				};
				
				if(document.getElementById('related')) {
					elements.headings.push(document.getElementById('related').getElementsByTagName('h2')[0]);
					o.data.headings.push(getCoords(document.getElementById('related').getElementsByTagName('h2')[0]));
				};
				
				if(elements.headings.length > 0) {
					
					/*** build toc ***/
					
					elements.tocH2 = document.createElement('h2');
					elements.tocH2.appendChild(document.createTextNode(labels[o.data.language].toc.label));
					
					elements.tocUL = document.createElement('ul');
					for(var c = 0; c < elements.headings.length; c++) {
						var li = document.createElement('li');
						var a = document.createElement('a');
						var l = document.createTextNode(elements.headings[c].textContent);
						
						if(!elements.headings[c].id) {
							elements.headings[c].id = 'toc-' + c;
						};
						a.href = '#' + elements.headings[c].id;
						a.onclick = function() {
							return ga('send', 'event', 'Interactions', 'TOC', this.href);
						};
						
						a.appendChild(l);
						li.appendChild(a);
						elements.tocUL.appendChild(li);
						
						elements.tocItems.push(li);
					};
					
					elements.toc.appendChild(elements.tocH2);
					elements.toc.appendChild(elements.tocUL);
					
					/*** populate toc element ***/
					
					if(o.data.viewport.width > 768) {
						elements.toc.style.position = 'fixed';
						elements.toc.style.top = '0px';
						elements.toc.style.right = '0px';
					};
				};
			};
		};
		
		/*** tableOfContents.update ******************************************/
		
		this.update = function() {
			
			if(elements.toc && elements.headings.length > 0) {
				
				// would offset the TOC position by the relative amount scrolled
				//console.log('Scrolled ' + ((o.data.page.scroll.top / (o.data.page.scroll.height - o.data.viewport.height)).toFixed(4) * 100).toFixed(2) + '%');
			
				var active = 0;
				
				for(var c = 0; c < elements.headings.length; c++) {
					if(o.data.headings[c].top - 20 < o.data.page.scroll.top) {
						active = c;
					};
					elements.tocItems[c].className = '';
				};
				
				if(o.data.viewport.width > 768) {
					if(elements.tocH2.firstChild.tagName == 'A') {
						elements.tocUL.style.display = 'inline-block';
						elements.tocH2.appendChild(elements.tocH2.firstChild.firstChild);
						elements.tocH2.removeChild(elements.tocH2.firstChild);
					};
					
					elements.toc.style.position = 'fixed';
					
					if(o.data.footer.top < o.data.page.scroll.top + o.data.viewport.height && (o.data.viewport.height - (o.data.page.scroll.top + o.data.viewport.height - o.data.footer.top)) < o.data.toc.height) {
						elements.toc.style.top = ((o.data.toc.height - (o.data.viewport.height - (o.data.page.scroll.top + o.data.viewport.height - o.data.footer.top))) * -1) + 'px';
					} else if(o.data.page.scroll.top < o.data.content.top) {
						elements.toc.style.top = (o.data.content.top - o.data.page.scroll.top) + 'px';
					} else {
						elements.toc.style.top = '0px';
					};
	
					elements.toc.style.right = o.data.content.left + 'px';
					elements.toc.style.width = (o.data.toc.width - 1) + 'px';
					
					elements.tocItems[active].className = 'active';
				} else {
					if(elements.tocH2.firstChild.tagName != 'A') {
						elements.tocUL.style.display = 'none';
						
						var a = document.createElement('a');
						a.href = '';
						a.onclick = function() {
							if(elements.tocUL.style.display == 'none') {
								elements.tocUL.style.display = 'inline-block';
								elements.tocH2.className = 'expanded';
							} else {
								elements.tocUL.style.display = 'none';
								elements.tocH2.className = 'collapsed';
							};
							return false;
						};
						
						a.appendChild(elements.tocH2.firstChild);
						elements.tocH2.appendChild(a);
						
						elements.tocH2.className = 'collapsed';
					};
					
					elements.toc.style.position = 'relative';
					elements.toc.style.top = null;
					elements.toc.style.right = null;
					elements.toc.style.width = '100%';
				};
			};
		};
	};
	
	/*** *********************************************************************/
	
	this.events = new function() {
		this.init = function() {
			console.log('events.init');
			
			// notification banners
			// toc
			
			if(window.ga) {
				var a, b, c;
				
				// accessibility links
				a = document.getElementById('skip-content');
				if(a) a.addEventListener('click', function() {
					return ga('send', 'event', 'Interactions', 'Skip To Content Link', this.href);
				});
				
				// notifications
				a = document.getElementsByClassName('notifications');
				if(a && a.length > 0) {
					b = a[0].getElementsByTagName('a');
					for(c = 0; c < b.length; c++) {
						var d = b[c];
						
						d.addEventListener('click', (function(d) {
							return function() {
								var type = '';
								
								switch(d.parentNode.className) {
									case 'emergency':
										type = 'Emergency notification';
									break;
									case 'important':
										type = 'Important notification';
									break;
									case 'info':
										type = 'Information notification';
									break;
									case 'event':
										type = 'Event notification';
									break;
								};
								return ga('send', 'event', 'Interactions', type, this.href);
							};
						})(d));
					};
				};
				
				// logo
				a = document.getElementsByClassName('logo')[0].getElementsByTagName('a');
				for(c = 0; c < a.length; c++) {
					a[c].addEventListener('click', function() {
						return ga('send', 'event', 'Interactions', 'Logo', this.href);
					});
				};
				
				// breadcrumb
				a = document.getElementsByClassName('section-breadcrumb');
				if(a && a.length > 0) {
					b = a[0].getElementsByTagName('a');
					for(c = 0; c < b.length; c++) {
						b[c].addEventListener('click', function() {
							return ga('send', 'event', 'Interactions', 'Breadcrumb', this.href);
						});
					};
				};
				
				// menu
				a = document.getElementsByClassName('menu');
				if(a && a.length > 0) {
					b = a[0].getElementsByTagName('a');
					for(c = 0; c < b.length; c++) {
						b[c].addEventListener('click', function() {
							return ga('send', 'event', 'Interactions', 'Section Menu Item', this.href);
						});
					};
				};
				
				// accordions
				a = document.getElementsByClassName('accordion');
				if(a && a.length > 0) {
					b = a[0].getElementsByClassName('title')[0].getElementsByTagName('a');
					for(c = 0; c < b.length; c++) {
						b[c].addEventListener('click', function() {
							return ga('send', 'event', 'Interactions', 'Accordion', this.href);
						});
					};
				};
				
				// back to top
				a = document.getElementById('back-to-top');
				if(a) a.addEventListener('click', function() {
					return ga('send', 'event', 'Interactions', 'Back To Top Link', this.href);
				});
				
				// footer - quick links
				a = document.getElementById('quick-links').getElementsByTagName('a');
				for(c = 0; c < a.length; c++) {
					a[c].addEventListener('click', function() {
						return ga('send', 'event', 'Interactions', 'Footer Quick Links', this.href);
					});
				};
				
				//footer - social links
				a = document.getElementById('social-links').getElementsByTagName('a');
				for(c = 0; c < a.length; c++) {
					a[c].addEventListener('click', function() {
						return ga('send', 'event', 'Interactions', 'Footer Social Links', this.href);
					});
				};
				
				// footer - about links
				a = document.getElementById('about-links').getElementsByTagName('a');
				for(c = 0; c < a.length; c++) {
					a[c].addEventListener('click', function() {
						return ga('send', 'event', 'Interactions', 'Footer About Links', this.href);
					});
				};
				
				// main
				a = document.getElementById('main');
				if(a) {
					b = a.getElementsByTagName('a');
					for(c = 0; c < b.length; c++) {
						if(b[c].href.match(/^mailto:/gi)) {
							b[c].addEventListener('click', function() {
								return ga('send', 'event', 'Contact', 'Email', this.href);
							});
						} else if(b[c].href.match(/^tel:/gi)) {
							b[c].addEventListener('click', function() {
								return ga('send', 'event', 'Contact', 'Telephone', this.href);
							});
						} else if(urlToDomain(b[c].href) != currentDomain) {
							b[c].addEventListener('click', function() {
								return ga('send', 'event', 'Interactions', 'External', this.href);
							});
						} else if(b[c].href.match(/.pdf$|.xls$|.xlt$|.xlsx$|.xlst$|.doc$|.dot$|.docx$|.dotx$|.zip$|.bz2$|.tar$|.iso$|.7z$|.jpg$|.png$|.bmp$|.gif$|.svg$|.mp3$|.ogg$|.aac$|.aiff$|.flac$|.m4a$|.wav$|.mp4$|.f4v$|.webm$|.avi$|.mov$|.qt$/gi)) {
							b[c].addEventListener('click', function() {
								return ga('send', 'event', 'Downloads', 'Files', this.href);
							});
						};
					};
				};
				
				//related
				a = document.getElementById('related');
				if(a) {
					b = a.getElementsByTagName('a');
					for(c = 0; c < b.length; c++) {
						if(b[c].href.match(/^mailto:/gi)) {
							b[c].addEventListener('click', function() {
								return ga('send', 'event', 'Contact', 'Related Email', this.href);
							});
						} else if(b[c].href.match(/^tel:/gi)) {
							b[c].addEventListener('click', function() {
								return ga('send', 'event', 'Contact', 'Related Telephone', this.href);
							});
						} else if(urlToDomain(b[c].href) != currentDomain) {
							b[c].addEventListener('click', function() {
								return ga('send', 'event', 'Interactions', 'Related External', this.href);
							});
						} else if(b[c].href.match(/.pdf$|.xls$|.xlt$|.xlsx$|.xlst$|.doc$|.dot$|.docx$|.dotx$|.zip$|.bz2$|.tar$|.iso$|.7z$|.jpg$|.png$|.bmp$|.gif$|.svg$|.mp3$|.ogg$|.aac$|.aiff$|.flac$|.m4a$|.wav$|.mp4$|.f4v$|.webm$|.avi$|.mov$|.qt$/gi)) {
							b[c].addEventListener('click', function() {
								return ga('send', 'event', 'Downloads', 'Related Files', this.href);
							});
						};
					};
				};
			};
		};
	};
	
	/*** pageUpdate **********************************************************/
	
	this.pageUpdate = function() {
		if(o.data.page.scroll.top > 0) {
			if(elements.html.className.indexOf('scrolled') == -1) elements.html.className += ' scrolled';
		} else {
			elements.html.className = elements.html.className.replace(' scrolled', '');
		};
		
		o.tableOfContents.update();
		o.tables.update();
		o.cards.update();

		o.data.pageAnimationTicking = false;
	};
	
	/*** tableUpdate *********************************************************/
	
	this.tableUpdate = function() {
		o.tables.update();
		
		o.data.tableAnimationTicking = false;
	};
	
	
	/*** init ****************************************************************/
	
	this.init = function() {
		
		/*** load google recaptcha ***/
		
		if(o.data.forms.length > 0) {
			var s = document.createElement('script');
			s.src = 'https://www.google.com/recaptcha/api.js?onload=initAlbertaForms&render=explicit&hl=' + o.data.language + '-CA';
			document.body.appendChild(s);
		};
		
		/*** lookup elements ***/
		
		elements.toc = document.getElementById('toc');
		if(document.getElementById('content')) {
			elements.content = document.getElementById('content').getElementsByClassName('container')[0];
		};
		elements.main = document.getElementById('main');
		elements.footer = document.getElementsByClassName('section-footer')[0];
		
		o.tableOfContents.init();
		o.accordions.init();
		o.tables.init();
		o.cards.init();
		o.events.init();
		
		handlers.resize.page();
		
		window.addEventListener('scroll', handlers.scroll.page, false);
		window.addEventListener('resize', handlers.resize.page, false);
		
		for(var c = 0; c < elements.tables.length; c++) {
			elements.tables[c].firstChild.addEventListener('scroll', handlers.scroll.table, false);
		};
	};
	
	
	/**************************************************************************
	* Constructor
	* 
	***/
	
	(function() {
		
		/*** Array.indexOf ***/
		
		if(!Array.indexOf){
			Array.prototype.indexOf = function(a, b) {
				var c = 0;
				for(c = (b || 0); c < this.length; c++) {
					if(this[c] == a) {
						return c;
					};
				};
				return -1;
			};
		};
		
		currentDomain = urlToDomain(location.href);
		
		elements.html = document.getElementsByTagName('html')[0];
		elements.html.className = elements.html.className.replace('nojs', 'js');
	})();
};



/******************************************************************************
* initAlbertaForms
* 
***/

initAlbertaForms = function() {
	if(alberta) {
		for(var c = 0; c < alberta.data.forms.length; c++) {
			alberta.data.captchas.push(grecaptcha.render('recaptcha' + alberta.data.forms[c], {
				'sitekey': '6Le0WxsTAAAAABU25_hDRbaESb8fA3YDDG4VkYY0'
			}));
		};
	};
};
