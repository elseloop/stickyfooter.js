/*global jQuery */
/*jshint multistr:true browser:true */
/*!
* StickyFooter.js 1.0
*
* The MIT License (MIT)
* 
* Copyright (c) 2013 Dan Manchester, http://elseloop.com
* 
* Permission is hereby granted, free of charge, to any person obtaining a copy of
* this software and associated documentation files (the "Software"), to deal in
* the Software without restriction, including without limitation the rights to
* use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
* the Software, and to permit persons to whom the Software is furnished to do so,
* subject to the following conditions:
* 
* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.
* 
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
* FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
* COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
* IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
* CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*
* Date: Sat Aug 03 22:37:00 2013 -0700
*
*/

;(function ( $, window, document, undefined ) {

    // Create the defaults once
    var stickyFooter = "StickyFooter",
        defaults = {
            innerSelector:  jQuery( ".outer-wrap" )
        };

    // The actual plugin constructor
    function StickyFooter( element, options ) {
        
        this.element   = element;
        this.options   = $.extend( {}, defaults, options);
        
        this._defaults = defaults;
        this._name     = stickyFooter;

        this.init();

    }

    StickyFooter.prototype = {

        init: function() {
          
          this.positionFooter( this.element, this.options );
          this.positionOnResize( this.element, this.options );

        },

        positionFooter: function( el, options ) {
          
          var footerHeight = 0,
              footerTop    = 0,
              body         = jQuery( "body" ),
              footer       = jQuery(el),
              main         = options.innerSelector;

          // fade out the footer from the giddy up so nobody sees our finagling
          body.removeClass( "footer-loaded" ).addClass( "footer-loading" );
          footer.css( "opacity", "0" );

          // measure the footer's height plus any margins set via CSS
          footerHeight = footer.outerHeight(true);
          
          // new footer position ==
          // ( any bits of page outside of view + full window height ) - height of footer + px
          footerTop = ( jQuery(window).scrollTop() + jQuery(window).height() - footerHeight ) + "px";

          // if the total height of the page is less than the height of the window...
          if ( ( main.height() + footerHeight ) < jQuery( window ).height() ) {
            
            // relocate the footer to the bottom of the window
            footer.css({
              position: "absolute",
              top: footerTop,
              left: 0
            }).animate({
              // fade it back in
              opacity: 1
            }, 250, function() {
              // then let everyone know
              body
                .removeClass( "footer-loading")
                .addClass( "footer-loaded" );
            });
            
          } else {
            
            // page content is taller than the window, so just leave well enough alone
            footer.animate({
              // fade it back in
              opacity: 1
            }, 250, function() {
              // let 'em no
              body
                .removeClass( "footer-loading")
                .addClass( "footer-loaded" );
            });

          } // if/else height check

        }, // positionFooter()

        positionOnResize: function( el, options ) {

          jQuery( window ).resize( function() {
            
            setTimeout( function() {
              StickyFooter.prototype.positionFooter.call( this, el, options );
            }, 250);

          });

        }

    };

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn.stickyFooter = function ( options ) {
        return this.each(function () {
            if (!$.data(this, "plugin_" + stickyFooter)) {
                $.data(this, "plugin_" + stickyFooter,
                new StickyFooter( this, options ));
            }
        });
    }

})( jQuery, window, document );