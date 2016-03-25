/*!
 * clickClock.js 
 *
 * Launch  : March 2016
 * Version : 1.0
 * Released: Fryday 18th March, 2016 - 23:57
 */


(function($){

	// Extending the jQuery core with a jquery-plugin:
	$.fn.svgClock = function(opts){

		// "this" contains the elements that were selected when calling the plugin: $('elements').svgClock();
		// If the selector returned more than one element, use the first one:
		var container = this.eq(0);   
		if (!container) {
			try {
				console.log("Invalid selector!");
			} catch(e){}         
			return false;
		}

		// define default values and merge with given one
		if(!opts) opts = {}; 
		var options = $.extend({
			background  : "#FFFFFF",    // background-color
			width       : 180,          // width of clock    (in px)
			height      : 180,          // height of clock   (in px)
			padding     : 10,           // padding of clock  (in px)
			top         : 50,           // distance from top (in px)
			showSecond  : 1,            // 0: don't show, 1: show
			showRing    : 1,            // 0: don't show, 1: show 
			showDisplay : 1,            // 0: don't show, 1: show 
			ringSize    : 30,           // ring-size in percentage 0..100
			colorHour   : "#992222",    // ring-color of hour
			colorMinute : "#225522",    // ring-color of minute
			colorSecond : "#333377",    // ring-color of second
			fontColor   : "#AAAAAA",    // color of font
			fontSize    : 80,           // size of font      (in px)
			fontFamily  : "sans-serif", // font-family
			fontWeight  : "bold",       // font-weight
		}, opts );

		// Calling  svgClock, passing the container-element and options,
		init.call(container,options);  // first parameter is "this"

		// to make plugin "chainable"
		return this;
	}


	function init(options)
	{      
		var parts = ['hour','minute','second'];  // The parts of a clock: hour, minute, second      
		var partsObj = {};                       // An array used by the functions of the plug-in:

		// build dom structure: clock with display and ring, both optionally
		for (var i=0;i<3;i++)  { 
			// Creating a new element and setting the part as a class name:        
			var display = "";
			if (options.showDisplay) {
				var display='<div class="display"></div>'; 
			}
			var ring = "";
			if (options.showRing) {
			var ring ='<div class="ring">'+
			            '<svg version="1.1" viewBox="-500 -500 1000 1000"><path /></svg>'+
			          '</div>'
			}
			var clock = $('<div>').attr('class',parts[i]+' clock').html(display + ring);
			// Appending to the container:
			$(this).append(clock);       
			// will be available as "partsObj.part" in Interval-function
			partsObj[parts[i]] = clock;
		}

		// fill styles of clock to make it flow
		var clocks = $(this).find(".clock");
		clocks.css({ backgroundColor : options.background,
			width           : options.width  + "px",
			height          : options.height + "px",
			padding         : options.padding,
			position        : "relative",
			overflow        : "hidden",
			float           : "left",
		});

		// fill styles of display to center it
		if (options.showDisplay) {
			var displays = $(this).find(".display");
			displays.css({ color      : options.fontColor,
				fontSize   : options.fontSize + "px",
				fontFamily : options.fontFamily,
				fontWeight : options.fontWeight,
				textAlign  : "center",
				position   : "absolute",
				top        : options.top + "px",
				width      : displays.parent().css("width"),
				zIndex     : 20,
			});
		}

		// fill sytles of ring: scale svg, fill colors
		if (options.showRing) {
			var svgs = $(this).find("svg");
			svgs.css ({ width  : options.width  + "px",
			            height : options.height + "px",
			});
			partsObj.hour.find("path").attr   ("fill",options.colorHour);
			partsObj.minute.find("path").attr ("fill",options.colorMinute);
			partsObj.second.find("path").attr ("fill",options.colorSecond);
		}

		// show clock in an interval, depending on "showSecond"
		var showClockFunc = function showClock() {
			var currentTime = new Date();
			var h = currentTime.getHours();
			var m = currentTime.getMinutes();
			var s = currentTime.getSeconds();         
			animation(partsObj.hour,   h, 12, options);     
			animation(partsObj.minute, m, 60, options);
			if (options.showSecond) { // only if "showSecond"=1
				animation(partsObj.second, s, 60, options);
			}
		}
		showClockFunc.call();  // call showClock-function once initially ...
		setInterval(showClockFunc,options.showSecond?1000:60000);  // ... and cyclically

	}


	function animation(part,current,total,options)
	{
		// Show display
		if (options.showDisplay) { // insert leading zeros
			part.find(".display").html(current<10?'0'+current:current);
		}

		// Show rings
		if (options.showRing) { // rotate rings
			var rad = 500 - options.ringSize*5;    // inner radius
			var angle = (360/total)*(current);  // angle of clock
			var cos = Math.cos(Math.PI * 2 / 360 * angle);
			var sin = Math.sin(Math.PI * 2 / 360 * angle);         
			var svg_text = "M 0,-500 A 500,500";
			(angle > 180) ? svg_text += " 0 1,1" : svg_text += " 0 0,1";
			svg_text +=         sin*500 + "," + (-1*cos*500);
			svg_text += " L " + sin*rad + "," + (-1*cos*rad);
			svg_text += " A " + rad + " " + rad;
			(angle > 180) ? svg_text += " 0 1,0" : svg_text += " 0 0,0";
			svg_text += " 0 -" + rad + "z";      
			part.find("path").attr ("d",svg_text);  // ... show it
		}
	}   

})(jQuery)  // to handle "noConflict"

