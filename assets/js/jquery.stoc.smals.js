/**
 * jQuery Plugin: Table of Contents with Smooth Scrolling
 * @link    http://www.1stwebdesigner.com/css/jquery-plugin-smooth-scrolling/
 * @author  Rochester Oliveira
 */

(function($) {
    $.fn.stoc = function(options) {
        //Our default options
        var defaults = {
            search: "body", //where we will search for titles
            depth: 6, //how many hN should we search
            start: 1, //which hN will be the first (and after it we go just deeper)
            stocTitle: "<h2>Contents</h2>", //what to display before our box
            listType: "ul", //could be ul or ol
            smoothScroll: 1,
            beforeText: "", // can add <span class="text-class">
            afterText: "", // can add </span> to match beforeText
            children: true, //Find through all dom or just Children,
            justInk: false
        };

        //let's extend our plugin with default or user options when defined
        var options = $.extend(defaults, options);

        return this.each(function() {
            //"cache" our target and search objects
            var obj = $(this); //target
            var src = $(options.search); //search
            // if container is not found.
            if (!src || 0 === src.length) {
                return;
            }

            //let's declare some variables. We need this var declaration to create them as local variables (not global)
            var appHTML = "",
                tagNumber = 0,
                txt = "",
                id = "",
                beforeText = options.beforeText,
                afterText = options.afterText,
                previous = options.start,
                start = options.start,
                depth = options.depth,
                i = 0,
                srcTags = "h" + options.start,
                cacheHN = "";

            //which tags we will search
            while (depth > 1) {
                start++; //we will just get our start level and numbers higher than it
                srcTags = srcTags + ", h" + start;
                depth--; //since went one level up, our depth will go one level down
            }

            // if the target is not found
            var found = (options.children) ? src.find(srcTags) : src.children(srcTags);
            if (!found || 0 === found.length) {
                return;
            }
            found.each(function() {
                //we will cache our current H element
                cacheHN = $(this);
                //if we are on h1, 2, 3...
                tagNumber = (cacheHN.get(0).tagName).substr(1);

                //sets the needed id to the element
                id = cacheHN.attr('id');
                if (id == "" || typeof id === "undefined") { //if it doesn't have only, of course
                    id = "h" + tagNumber + "_" + i;
                    cacheHN.attr('id', id);
                }
                //our current text
                txt = beforeText + cacheHN.text() + afterText;

                // apologize for this variable, I needed it for my localhost
                var pathname = (options.justInk) ? "" : window.location.pathname;

                switch (true) { //with switch(true) we can do comparisons in each case
                    case (tagNumber > previous): //it means that we went down one level (e.g. from h2 to h3)
                        appHTML = appHTML + "<" + options.listType + "><li><a href=\"" + pathname + "#" + id + "\">" + txt + "</a>";
                        previous = tagNumber;
                        break;
                    case (tagNumber == previous): //it means that stay on the same level (e.g. h3 and stay on it)
                        appHTML = appHTML + "</li><li><a href=\"" + pathname + "#" + id + "\">" + txt + "</a>";
                        break;
                    case (tagNumber < previous): //it means that we went up but we don't know how much levels (e.g. from h3 to h2)
                        while (tagNumber != previous && (previous - tagNumber == 1)) {
                            appHTML = appHTML + "</" + options.listType + "></li>";
                            previous--;
                        }
                        appHTML = appHTML + "<li><a href=\"" + pathname + "#" + id + "\">" + txt + "</a>";
                        break;
                }
                i++;
            });
            //corrects our last item, because it may have some opened ul's
            while (tagNumber != options.start && tagNumber > 0) {
                appHTML = appHTML + "</" + options.listType + ">";
                tagNumber--;
            }
            //appendQuery our html to our object
            appHTML = options.stocTitle + "<" + options.listType + ">" + appHTML + "</" + options.listType + ">";
            obj.append(appHTML);

            // our pretty smooth scrolling here
            // actually I've just compressed the code so you guys will think that I'm the man .
            // Source: http://css-tricks.com/snippets/jquery/smooth-scrolling/
            if (options.smoothScroll == 1) {
                $(window).on("load", function() {
                    function filterPath(string) {
                        return string.replace(/^\//, '').replace(/(index|default).[a-zA-Z]{3,4}$/, '').replace(/\/$/, '')
                    }
                    var locationPath = filterPath(location.pathname);
                    var scrollElem = scrollableElement('html', 'body');

                    obj.find("a[href*='#']").each(function() {
                        var thisPath = filterPath(this.pathname) || locationPath;
                        if (locationPath == thisPath && (location.hostname == this.hostname || !this.hostname) && this.hash.replace(/#/, '')) {
                            var $target = $(this.hash),
                                target = this.hash;
                            if (target) {
                                var targetOffset = $target.offset().top;
                                $(this).click(function(event) {
                                    event.preventDefault();

                                    //location.hash = target
                                    /*$(scrollElem).animate({
                                        scrollTop: targetOffset
                                    }, 400, function() {
                                        location.hash = target
                                    })*/
                                })
                            }
                        }
                    });

                    function scrollableElement(els) {
                        for (var i = 0, argLength = arguments.length; i < argLength; i++) {
                            var el = arguments[i],
                                $scrollElement = $(el);
                            if ($scrollElement.scrollTop() > 0) {
                                return el
                            } else {
                                $scrollElement.scrollTop(1);
                                var isScrollable = $scrollElement.scrollTop() > 0;
                                $scrollElement.scrollTop(0);
                                if (isScrollable) {
                                    return el
                                }
                            }
                        }
                        return []
                    }
                });
            }
        });
    };
})(jQuery);