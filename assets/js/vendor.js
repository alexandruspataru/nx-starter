if (typeof jQuery === "undefined") {
    throw new Error("Bootstrap's JavaScript requires jQuery");
}

+function($) {
    "use strict";
    var version = $.fn.jquery.split(" ")[0].split(".");
    if (version[0] < 2 && version[1] < 9 || version[0] == 1 && version[1] == 9 && version[2] < 1 || version[0] > 3) {
        throw new Error("Bootstrap's JavaScript requires jQuery version 1.9.1 or higher, but lower than version 4");
    }
}(jQuery);

+function($) {
    "use strict";
    function transitionEnd() {
        var el = document.createElement("bootstrap");
        var transEndEventNames = {
            WebkitTransition: "webkitTransitionEnd",
            MozTransition: "transitionend",
            OTransition: "oTransitionEnd otransitionend",
            transition: "transitionend"
        };
        for (var name in transEndEventNames) {
            if (el.style[name] !== undefined) {
                return {
                    end: transEndEventNames[name]
                };
            }
        }
        return false;
    }
    $.fn.emulateTransitionEnd = function(duration) {
        var called = false;
        var $el = this;
        $(this).one("bsTransitionEnd", function() {
            called = true;
        });
        var callback = function() {
            if (!called) $($el).trigger($.support.transition.end);
        };
        setTimeout(callback, duration);
        return this;
    };
    $(function() {
        $.support.transition = transitionEnd();
        if (!$.support.transition) return;
        $.event.special.bsTransitionEnd = {
            bindType: $.support.transition.end,
            delegateType: $.support.transition.end,
            handle: function(e) {
                if ($(e.target).is(this)) return e.handleObj.handler.apply(this, arguments);
            }
        };
    });
}(jQuery);

+function($) {
    "use strict";
    var dismiss = '[data-dismiss="alert"]';
    var Alert = function(el) {
        $(el).on("click", dismiss, this.close);
    };
    Alert.VERSION = "3.4.1";
    Alert.TRANSITION_DURATION = 150;
    Alert.prototype.close = function(e) {
        var $this = $(this);
        var selector = $this.attr("data-target");
        if (!selector) {
            selector = $this.attr("href");
            selector = selector && selector.replace(/.*(?=#[^\s]*$)/, "");
        }
        selector = selector === "#" ? [] : selector;
        var $parent = $(document).find(selector);
        if (e) e.preventDefault();
        if (!$parent.length) {
            $parent = $this.closest(".alert");
        }
        $parent.trigger(e = $.Event("close.bs.alert"));
        if (e.isDefaultPrevented()) return;
        $parent.removeClass("in");
        function removeElement() {
            $parent.detach().trigger("closed.bs.alert").remove();
        }
        $.support.transition && $parent.hasClass("fade") ? $parent.one("bsTransitionEnd", removeElement).emulateTransitionEnd(Alert.TRANSITION_DURATION) : removeElement();
    };
    function Plugin(option) {
        return this.each(function() {
            var $this = $(this);
            var data = $this.data("bs.alert");
            if (!data) $this.data("bs.alert", data = new Alert(this));
            if (typeof option == "string") data[option].call($this);
        });
    }
    var old = $.fn.alert;
    $.fn.alert = Plugin;
    $.fn.alert.Constructor = Alert;
    $.fn.alert.noConflict = function() {
        $.fn.alert = old;
        return this;
    };
    $(document).on("click.bs.alert.data-api", dismiss, Alert.prototype.close);
}(jQuery);

+function($) {
    "use strict";
    var Button = function(element, options) {
        this.$element = $(element);
        this.options = $.extend({}, Button.DEFAULTS, options);
        this.isLoading = false;
    };
    Button.VERSION = "3.4.1";
    Button.DEFAULTS = {
        loadingText: "loading..."
    };
    Button.prototype.setState = function(state) {
        var d = "disabled";
        var $el = this.$element;
        var val = $el.is("input") ? "val" : "html";
        var data = $el.data();
        state += "Text";
        if (data.resetText == null) $el.data("resetText", $el[val]());
        setTimeout($.proxy(function() {
            $el[val](data[state] == null ? this.options[state] : data[state]);
            if (state == "loadingText") {
                this.isLoading = true;
                $el.addClass(d).attr(d, d).prop(d, true);
            } else if (this.isLoading) {
                this.isLoading = false;
                $el.removeClass(d).removeAttr(d).prop(d, false);
            }
        }, this), 0);
    };
    Button.prototype.toggle = function() {
        var changed = true;
        var $parent = this.$element.closest('[data-toggle="buttons"]');
        if ($parent.length) {
            var $input = this.$element.find("input");
            if ($input.prop("type") == "radio") {
                if ($input.prop("checked")) changed = false;
                $parent.find(".active").removeClass("active");
                this.$element.addClass("active");
            } else if ($input.prop("type") == "checkbox") {
                if ($input.prop("checked") !== this.$element.hasClass("active")) changed = false;
                this.$element.toggleClass("active");
            }
            $input.prop("checked", this.$element.hasClass("active"));
            if (changed) $input.trigger("change");
        } else {
            this.$element.attr("aria-pressed", !this.$element.hasClass("active"));
            this.$element.toggleClass("active");
        }
    };
    function Plugin(option) {
        return this.each(function() {
            var $this = $(this);
            var data = $this.data("bs.button");
            var options = typeof option == "object" && option;
            if (!data) $this.data("bs.button", data = new Button(this, options));
            if (option == "toggle") data.toggle(); else if (option) data.setState(option);
        });
    }
    var old = $.fn.button;
    $.fn.button = Plugin;
    $.fn.button.Constructor = Button;
    $.fn.button.noConflict = function() {
        $.fn.button = old;
        return this;
    };
    $(document).on("click.bs.button.data-api", '[data-toggle^="button"]', function(e) {
        var $btn = $(e.target).closest(".btn");
        Plugin.call($btn, "toggle");
        if (!$(e.target).is('input[type="radio"], input[type="checkbox"]')) {
            e.preventDefault();
            if ($btn.is("input,button")) $btn.trigger("focus"); else $btn.find("input:visible,button:visible").first().trigger("focus");
        }
    }).on("focus.bs.button.data-api blur.bs.button.data-api", '[data-toggle^="button"]', function(e) {
        $(e.target).closest(".btn").toggleClass("focus", /^focus(in)?$/.test(e.type));
    });
}(jQuery);

+function($) {
    "use strict";
    var Carousel = function(element, options) {
        this.$element = $(element);
        this.$indicators = this.$element.find(".carousel-indicators");
        this.options = options;
        this.paused = null;
        this.sliding = null;
        this.interval = null;
        this.$active = null;
        this.$items = null;
        this.options.keyboard && this.$element.on("keydown.bs.carousel", $.proxy(this.keydown, this));
        this.options.pause == "hover" && !("ontouchstart" in document.documentElement) && this.$element.on("mouseenter.bs.carousel", $.proxy(this.pause, this)).on("mouseleave.bs.carousel", $.proxy(this.cycle, this));
    };
    Carousel.VERSION = "3.4.1";
    Carousel.TRANSITION_DURATION = 600;
    Carousel.DEFAULTS = {
        interval: 5e3,
        pause: "hover",
        wrap: true,
        keyboard: true
    };
    Carousel.prototype.keydown = function(e) {
        if (/input|textarea/i.test(e.target.tagName)) return;
        switch (e.which) {
          case 37:
            this.prev();
            break;

          case 39:
            this.next();
            break;

          default:
            return;
        }
        e.preventDefault();
    };
    Carousel.prototype.cycle = function(e) {
        e || (this.paused = false);
        this.interval && clearInterval(this.interval);
        this.options.interval && !this.paused && (this.interval = setInterval($.proxy(this.next, this), this.options.interval));
        return this;
    };
    Carousel.prototype.getItemIndex = function(item) {
        this.$items = item.parent().children(".item");
        return this.$items.index(item || this.$active);
    };
    Carousel.prototype.getItemForDirection = function(direction, active) {
        var activeIndex = this.getItemIndex(active);
        var willWrap = direction == "prev" && activeIndex === 0 || direction == "next" && activeIndex == this.$items.length - 1;
        if (willWrap && !this.options.wrap) return active;
        var delta = direction == "prev" ? -1 : 1;
        var itemIndex = (activeIndex + delta) % this.$items.length;
        return this.$items.eq(itemIndex);
    };
    Carousel.prototype.to = function(pos) {
        var that = this;
        var activeIndex = this.getItemIndex(this.$active = this.$element.find(".item.active"));
        if (pos > this.$items.length - 1 || pos < 0) return;
        if (this.sliding) return this.$element.one("slid.bs.carousel", function() {
            that.to(pos);
        });
        if (activeIndex == pos) return this.pause().cycle();
        return this.slide(pos > activeIndex ? "next" : "prev", this.$items.eq(pos));
    };
    Carousel.prototype.pause = function(e) {
        e || (this.paused = true);
        if (this.$element.find(".next, .prev").length && $.support.transition) {
            this.$element.trigger($.support.transition.end);
            this.cycle(true);
        }
        this.interval = clearInterval(this.interval);
        return this;
    };
    Carousel.prototype.next = function() {
        if (this.sliding) return;
        return this.slide("next");
    };
    Carousel.prototype.prev = function() {
        if (this.sliding) return;
        return this.slide("prev");
    };
    Carousel.prototype.slide = function(type, next) {
        var $active = this.$element.find(".item.active");
        var $next = next || this.getItemForDirection(type, $active);
        var isCycling = this.interval;
        var direction = type == "next" ? "left" : "right";
        var that = this;
        if ($next.hasClass("active")) return this.sliding = false;
        var relatedTarget = $next[0];
        var slideEvent = $.Event("slide.bs.carousel", {
            relatedTarget: relatedTarget,
            direction: direction
        });
        this.$element.trigger(slideEvent);
        if (slideEvent.isDefaultPrevented()) return;
        this.sliding = true;
        isCycling && this.pause();
        if (this.$indicators.length) {
            this.$indicators.find(".active").removeClass("active");
            var $nextIndicator = $(this.$indicators.children()[this.getItemIndex($next)]);
            $nextIndicator && $nextIndicator.addClass("active");
        }
        var slidEvent = $.Event("slid.bs.carousel", {
            relatedTarget: relatedTarget,
            direction: direction
        });
        if ($.support.transition && this.$element.hasClass("slide")) {
            $next.addClass(type);
            if (typeof $next === "object" && $next.length) {
                $next[0].offsetWidth;
            }
            $active.addClass(direction);
            $next.addClass(direction);
            $active.one("bsTransitionEnd", function() {
                $next.removeClass([ type, direction ].join(" ")).addClass("active");
                $active.removeClass([ "active", direction ].join(" "));
                that.sliding = false;
                setTimeout(function() {
                    that.$element.trigger(slidEvent);
                }, 0);
            }).emulateTransitionEnd(Carousel.TRANSITION_DURATION);
        } else {
            $active.removeClass("active");
            $next.addClass("active");
            this.sliding = false;
            this.$element.trigger(slidEvent);
        }
        isCycling && this.cycle();
        return this;
    };
    function Plugin(option) {
        return this.each(function() {
            var $this = $(this);
            var data = $this.data("bs.carousel");
            var options = $.extend({}, Carousel.DEFAULTS, $this.data(), typeof option == "object" && option);
            var action = typeof option == "string" ? option : options.slide;
            if (!data) $this.data("bs.carousel", data = new Carousel(this, options));
            if (typeof option == "number") data.to(option); else if (action) data[action](); else if (options.interval) data.pause().cycle();
        });
    }
    var old = $.fn.carousel;
    $.fn.carousel = Plugin;
    $.fn.carousel.Constructor = Carousel;
    $.fn.carousel.noConflict = function() {
        $.fn.carousel = old;
        return this;
    };
    var clickHandler = function(e) {
        var $this = $(this);
        var href = $this.attr("href");
        if (href) {
            href = href.replace(/.*(?=#[^\s]+$)/, "");
        }
        var target = $this.attr("data-target") || href;
        var $target = $(document).find(target);
        if (!$target.hasClass("carousel")) return;
        var options = $.extend({}, $target.data(), $this.data());
        var slideIndex = $this.attr("data-slide-to");
        if (slideIndex) options.interval = false;
        Plugin.call($target, options);
        if (slideIndex) {
            $target.data("bs.carousel").to(slideIndex);
        }
        e.preventDefault();
    };
    $(document).on("click.bs.carousel.data-api", "[data-slide]", clickHandler).on("click.bs.carousel.data-api", "[data-slide-to]", clickHandler);
    $(window).on("load", function() {
        $('[data-ride="carousel"]').each(function() {
            var $carousel = $(this);
            Plugin.call($carousel, $carousel.data());
        });
    });
}(jQuery);

+function($) {
    "use strict";
    var Collapse = function(element, options) {
        this.$element = $(element);
        this.options = $.extend({}, Collapse.DEFAULTS, options);
        this.$trigger = $('[data-toggle="collapse"][href="#' + element.id + '"],' + '[data-toggle="collapse"][data-target="#' + element.id + '"]');
        this.transitioning = null;
        if (this.options.parent) {
            this.$parent = this.getParent();
        } else {
            this.addAriaAndCollapsedClass(this.$element, this.$trigger);
        }
        if (this.options.toggle) this.toggle();
    };
    Collapse.VERSION = "3.4.1";
    Collapse.TRANSITION_DURATION = 350;
    Collapse.DEFAULTS = {
        toggle: true
    };
    Collapse.prototype.dimension = function() {
        var hasWidth = this.$element.hasClass("width");
        return hasWidth ? "width" : "height";
    };
    Collapse.prototype.show = function() {
        if (this.transitioning || this.$element.hasClass("in")) return;
        var activesData;
        var actives = this.$parent && this.$parent.children(".panel").children(".in, .collapsing");
        if (actives && actives.length) {
            activesData = actives.data("bs.collapse");
            if (activesData && activesData.transitioning) return;
        }
        var startEvent = $.Event("show.bs.collapse");
        this.$element.trigger(startEvent);
        if (startEvent.isDefaultPrevented()) return;
        if (actives && actives.length) {
            Plugin.call(actives, "hide");
            activesData || actives.data("bs.collapse", null);
        }
        var dimension = this.dimension();
        this.$element.removeClass("collapse").addClass("collapsing")[dimension](0).attr("aria-expanded", true);
        this.$trigger.removeClass("collapsed").attr("aria-expanded", true);
        this.transitioning = 1;
        var complete = function() {
            this.$element.removeClass("collapsing").addClass("collapse in")[dimension]("");
            this.transitioning = 0;
            this.$element.trigger("shown.bs.collapse");
        };
        if (!$.support.transition) return complete.call(this);
        var scrollSize = $.camelCase([ "scroll", dimension ].join("-"));
        this.$element.one("bsTransitionEnd", $.proxy(complete, this)).emulateTransitionEnd(Collapse.TRANSITION_DURATION)[dimension](this.$element[0][scrollSize]);
    };
    Collapse.prototype.hide = function() {
        if (this.transitioning || !this.$element.hasClass("in")) return;
        var startEvent = $.Event("hide.bs.collapse");
        this.$element.trigger(startEvent);
        if (startEvent.isDefaultPrevented()) return;
        var dimension = this.dimension();
        this.$element[dimension](this.$element[dimension]())[0].offsetHeight;
        this.$element.addClass("collapsing").removeClass("collapse in").attr("aria-expanded", false);
        this.$trigger.addClass("collapsed").attr("aria-expanded", false);
        this.transitioning = 1;
        var complete = function() {
            this.transitioning = 0;
            this.$element.removeClass("collapsing").addClass("collapse").trigger("hidden.bs.collapse");
        };
        if (!$.support.transition) return complete.call(this);
        this.$element[dimension](0).one("bsTransitionEnd", $.proxy(complete, this)).emulateTransitionEnd(Collapse.TRANSITION_DURATION);
    };
    Collapse.prototype.toggle = function() {
        this[this.$element.hasClass("in") ? "hide" : "show"]();
    };
    Collapse.prototype.getParent = function() {
        return $(document).find(this.options.parent).find('[data-toggle="collapse"][data-parent="' + this.options.parent + '"]').each($.proxy(function(i, element) {
            var $element = $(element);
            this.addAriaAndCollapsedClass(getTargetFromTrigger($element), $element);
        }, this)).end();
    };
    Collapse.prototype.addAriaAndCollapsedClass = function($element, $trigger) {
        var isOpen = $element.hasClass("in");
        $element.attr("aria-expanded", isOpen);
        $trigger.toggleClass("collapsed", !isOpen).attr("aria-expanded", isOpen);
    };
    function getTargetFromTrigger($trigger) {
        var href;
        var target = $trigger.attr("data-target") || (href = $trigger.attr("href")) && href.replace(/.*(?=#[^\s]+$)/, "");
        return $(document).find(target);
    }
    function Plugin(option) {
        return this.each(function() {
            var $this = $(this);
            var data = $this.data("bs.collapse");
            var options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == "object" && option);
            if (!data && options.toggle && /show|hide/.test(option)) options.toggle = false;
            if (!data) $this.data("bs.collapse", data = new Collapse(this, options));
            if (typeof option == "string") data[option]();
        });
    }
    var old = $.fn.collapse;
    $.fn.collapse = Plugin;
    $.fn.collapse.Constructor = Collapse;
    $.fn.collapse.noConflict = function() {
        $.fn.collapse = old;
        return this;
    };
    $(document).on("click.bs.collapse.data-api", '[data-toggle="collapse"]', function(e) {
        var $this = $(this);
        if (!$this.attr("data-target")) e.preventDefault();
        var $target = getTargetFromTrigger($this);
        var data = $target.data("bs.collapse");
        var option = data ? "toggle" : $this.data();
        Plugin.call($target, option);
    });
}(jQuery);

+function($) {
    "use strict";
    var backdrop = ".dropdown-backdrop";
    var toggle = '[data-toggle="dropdown"]';
    var Dropdown = function(element) {
        $(element).on("click.bs.dropdown", this.toggle);
    };
    Dropdown.VERSION = "3.4.1";
    function getParent($this) {
        var selector = $this.attr("data-target");
        if (!selector) {
            selector = $this.attr("href");
            selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, "");
        }
        var $parent = selector !== "#" ? $(document).find(selector) : null;
        return $parent && $parent.length ? $parent : $this.parent();
    }
    function clearMenus(e) {
        if (e && e.which === 3) return;
        $(backdrop).remove();
        $(toggle).each(function() {
            var $this = $(this);
            var $parent = getParent($this);
            var relatedTarget = {
                relatedTarget: this
            };
            if (!$parent.hasClass("open")) return;
            if (e && e.type == "click" && /input|textarea/i.test(e.target.tagName) && $.contains($parent[0], e.target)) return;
            $parent.trigger(e = $.Event("hide.bs.dropdown", relatedTarget));
            if (e.isDefaultPrevented()) return;
            $this.attr("aria-expanded", "false");
            $parent.removeClass("open").trigger($.Event("hidden.bs.dropdown", relatedTarget));
        });
    }
    Dropdown.prototype.toggle = function(e) {
        var $this = $(this);
        if ($this.is(".disabled, :disabled")) return;
        var $parent = getParent($this);
        var isActive = $parent.hasClass("open");
        clearMenus();
        if (!isActive) {
            if ("ontouchstart" in document.documentElement && !$parent.closest(".navbar-nav").length) {
                $(document.createElement("div")).addClass("dropdown-backdrop").insertAfter($(this)).on("click", clearMenus);
            }
            var relatedTarget = {
                relatedTarget: this
            };
            $parent.trigger(e = $.Event("show.bs.dropdown", relatedTarget));
            if (e.isDefaultPrevented()) return;
            $this.trigger("focus").attr("aria-expanded", "true");
            $parent.toggleClass("open").trigger($.Event("shown.bs.dropdown", relatedTarget));
        }
        return false;
    };
    Dropdown.prototype.keydown = function(e) {
        if (!/(38|40|27|32)/.test(e.which) || /input|textarea/i.test(e.target.tagName)) return;
        var $this = $(this);
        e.preventDefault();
        e.stopPropagation();
        if ($this.is(".disabled, :disabled")) return;
        var $parent = getParent($this);
        var isActive = $parent.hasClass("open");
        if (!isActive && e.which != 27 || isActive && e.which == 27) {
            if (e.which == 27) $parent.find(toggle).trigger("focus");
            return $this.trigger("click");
        }
        var desc = " li:not(.disabled):visible a";
        var $items = $parent.find(".dropdown-menu" + desc);
        if (!$items.length) return;
        var index = $items.index(e.target);
        if (e.which == 38 && index > 0) index--;
        if (e.which == 40 && index < $items.length - 1) index++;
        if (!~index) index = 0;
        $items.eq(index).trigger("focus");
    };
    function Plugin(option) {
        return this.each(function() {
            var $this = $(this);
            var data = $this.data("bs.dropdown");
            if (!data) $this.data("bs.dropdown", data = new Dropdown(this));
            if (typeof option == "string") data[option].call($this);
        });
    }
    var old = $.fn.dropdown;
    $.fn.dropdown = Plugin;
    $.fn.dropdown.Constructor = Dropdown;
    $.fn.dropdown.noConflict = function() {
        $.fn.dropdown = old;
        return this;
    };
    $(document).on("click.bs.dropdown.data-api", clearMenus).on("click.bs.dropdown.data-api", ".dropdown form", function(e) {
        e.stopPropagation();
    }).on("click.bs.dropdown.data-api", toggle, Dropdown.prototype.toggle).on("keydown.bs.dropdown.data-api", toggle, Dropdown.prototype.keydown).on("keydown.bs.dropdown.data-api", ".dropdown-menu", Dropdown.prototype.keydown);
}(jQuery);

+function($) {
    "use strict";
    var Modal = function(element, options) {
        this.options = options;
        this.$body = $(document.body);
        this.$element = $(element);
        this.$dialog = this.$element.find(".modal-dialog");
        this.$backdrop = null;
        this.isShown = null;
        this.originalBodyPad = null;
        this.scrollbarWidth = 0;
        this.ignoreBackdropClick = false;
        this.fixedContent = ".navbar-fixed-top, .navbar-fixed-bottom";
        if (this.options.remote) {
            this.$element.find(".modal-content").load(this.options.remote, $.proxy(function() {
                this.$element.trigger("loaded.bs.modal");
            }, this));
        }
    };
    Modal.VERSION = "3.4.1";
    Modal.TRANSITION_DURATION = 300;
    Modal.BACKDROP_TRANSITION_DURATION = 150;
    Modal.DEFAULTS = {
        backdrop: true,
        keyboard: true,
        show: true
    };
    Modal.prototype.toggle = function(_relatedTarget) {
        return this.isShown ? this.hide() : this.show(_relatedTarget);
    };
    Modal.prototype.show = function(_relatedTarget) {
        var that = this;
        var e = $.Event("show.bs.modal", {
            relatedTarget: _relatedTarget
        });
        this.$element.trigger(e);
        if (this.isShown || e.isDefaultPrevented()) return;
        this.isShown = true;
        this.checkScrollbar();
        this.setScrollbar();
        this.$body.addClass("modal-open");
        this.escape();
        this.resize();
        this.$element.on("click.dismiss.bs.modal", '[data-dismiss="modal"]', $.proxy(this.hide, this));
        this.$dialog.on("mousedown.dismiss.bs.modal", function() {
            that.$element.one("mouseup.dismiss.bs.modal", function(e) {
                if ($(e.target).is(that.$element)) that.ignoreBackdropClick = true;
            });
        });
        this.backdrop(function() {
            var transition = $.support.transition && that.$element.hasClass("fade");
            if (!that.$element.parent().length) {
                that.$element.appendTo(that.$body);
            }
            that.$element.show().scrollTop(0);
            that.adjustDialog();
            if (transition) {
                that.$element[0].offsetWidth;
            }
            that.$element.addClass("in");
            that.enforceFocus();
            var e = $.Event("shown.bs.modal", {
                relatedTarget: _relatedTarget
            });
            transition ? that.$dialog.one("bsTransitionEnd", function() {
                that.$element.trigger("focus").trigger(e);
            }).emulateTransitionEnd(Modal.TRANSITION_DURATION) : that.$element.trigger("focus").trigger(e);
        });
    };
    Modal.prototype.hide = function(e) {
        if (e) e.preventDefault();
        e = $.Event("hide.bs.modal");
        this.$element.trigger(e);
        if (!this.isShown || e.isDefaultPrevented()) return;
        this.isShown = false;
        this.escape();
        this.resize();
        $(document).off("focusin.bs.modal");
        this.$element.removeClass("in").off("click.dismiss.bs.modal").off("mouseup.dismiss.bs.modal");
        this.$dialog.off("mousedown.dismiss.bs.modal");
        $.support.transition && this.$element.hasClass("fade") ? this.$element.one("bsTransitionEnd", $.proxy(this.hideModal, this)).emulateTransitionEnd(Modal.TRANSITION_DURATION) : this.hideModal();
    };
    Modal.prototype.enforceFocus = function() {
        $(document).off("focusin.bs.modal").on("focusin.bs.modal", $.proxy(function(e) {
            if (document !== e.target && this.$element[0] !== e.target && !this.$element.has(e.target).length) {
                this.$element.trigger("focus");
            }
        }, this));
    };
    Modal.prototype.escape = function() {
        if (this.isShown && this.options.keyboard) {
            this.$element.on("keydown.dismiss.bs.modal", $.proxy(function(e) {
                e.which == 27 && this.hide();
            }, this));
        } else if (!this.isShown) {
            this.$element.off("keydown.dismiss.bs.modal");
        }
    };
    Modal.prototype.resize = function() {
        if (this.isShown) {
            $(window).on("resize.bs.modal", $.proxy(this.handleUpdate, this));
        } else {
            $(window).off("resize.bs.modal");
        }
    };
    Modal.prototype.hideModal = function() {
        var that = this;
        this.$element.hide();
        this.backdrop(function() {
            that.$body.removeClass("modal-open");
            that.resetAdjustments();
            that.resetScrollbar();
            that.$element.trigger("hidden.bs.modal");
        });
    };
    Modal.prototype.removeBackdrop = function() {
        this.$backdrop && this.$backdrop.remove();
        this.$backdrop = null;
    };
    Modal.prototype.backdrop = function(callback) {
        var that = this;
        var animate = this.$element.hasClass("fade") ? "fade" : "";
        if (this.isShown && this.options.backdrop) {
            var doAnimate = $.support.transition && animate;
            this.$backdrop = $(document.createElement("div")).addClass("modal-backdrop " + animate).appendTo(this.$body);
            this.$element.on("click.dismiss.bs.modal", $.proxy(function(e) {
                if (this.ignoreBackdropClick) {
                    this.ignoreBackdropClick = false;
                    return;
                }
                if (e.target !== e.currentTarget) return;
                this.options.backdrop == "static" ? this.$element[0].focus() : this.hide();
            }, this));
            if (doAnimate) this.$backdrop[0].offsetWidth;
            this.$backdrop.addClass("in");
            if (!callback) return;
            doAnimate ? this.$backdrop.one("bsTransitionEnd", callback).emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) : callback();
        } else if (!this.isShown && this.$backdrop) {
            this.$backdrop.removeClass("in");
            var callbackRemove = function() {
                that.removeBackdrop();
                callback && callback();
            };
            $.support.transition && this.$element.hasClass("fade") ? this.$backdrop.one("bsTransitionEnd", callbackRemove).emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) : callbackRemove();
        } else if (callback) {
            callback();
        }
    };
    Modal.prototype.handleUpdate = function() {
        this.adjustDialog();
    };
    Modal.prototype.adjustDialog = function() {
        var modalIsOverflowing = this.$element[0].scrollHeight > document.documentElement.clientHeight;
        this.$element.css({
            paddingLeft: !this.bodyIsOverflowing && modalIsOverflowing ? this.scrollbarWidth : "",
            paddingRight: this.bodyIsOverflowing && !modalIsOverflowing ? this.scrollbarWidth : ""
        });
    };
    Modal.prototype.resetAdjustments = function() {
        this.$element.css({
            paddingLeft: "",
            paddingRight: ""
        });
    };
    Modal.prototype.checkScrollbar = function() {
        var fullWindowWidth = window.innerWidth;
        if (!fullWindowWidth) {
            var documentElementRect = document.documentElement.getBoundingClientRect();
            fullWindowWidth = documentElementRect.right - Math.abs(documentElementRect.left);
        }
        this.bodyIsOverflowing = document.body.clientWidth < fullWindowWidth;
        this.scrollbarWidth = this.measureScrollbar();
    };
    Modal.prototype.setScrollbar = function() {
        var bodyPad = parseInt(this.$body.css("padding-right") || 0, 10);
        this.originalBodyPad = document.body.style.paddingRight || "";
        var scrollbarWidth = this.scrollbarWidth;
        if (this.bodyIsOverflowing) {
            this.$body.css("padding-right", bodyPad + scrollbarWidth);
            $(this.fixedContent).each(function(index, element) {
                var actualPadding = element.style.paddingRight;
                var calculatedPadding = $(element).css("padding-right");
                $(element).data("padding-right", actualPadding).css("padding-right", parseFloat(calculatedPadding) + scrollbarWidth + "px");
            });
        }
    };
    Modal.prototype.resetScrollbar = function() {
        this.$body.css("padding-right", this.originalBodyPad);
        $(this.fixedContent).each(function(index, element) {
            var padding = $(element).data("padding-right");
            $(element).removeData("padding-right");
            element.style.paddingRight = padding ? padding : "";
        });
    };
    Modal.prototype.measureScrollbar = function() {
        var scrollDiv = document.createElement("div");
        scrollDiv.className = "modal-scrollbar-measure";
        this.$body.append(scrollDiv);
        var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
        this.$body[0].removeChild(scrollDiv);
        return scrollbarWidth;
    };
    function Plugin(option, _relatedTarget) {
        return this.each(function() {
            var $this = $(this);
            var data = $this.data("bs.modal");
            var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == "object" && option);
            if (!data) $this.data("bs.modal", data = new Modal(this, options));
            if (typeof option == "string") data[option](_relatedTarget); else if (options.show) data.show(_relatedTarget);
        });
    }
    var old = $.fn.modal;
    $.fn.modal = Plugin;
    $.fn.modal.Constructor = Modal;
    $.fn.modal.noConflict = function() {
        $.fn.modal = old;
        return this;
    };
    $(document).on("click.bs.modal.data-api", '[data-toggle="modal"]', function(e) {
        var $this = $(this);
        var href = $this.attr("href");
        var target = $this.attr("data-target") || href && href.replace(/.*(?=#[^\s]+$)/, "");
        var $target = $(document).find(target);
        var option = $target.data("bs.modal") ? "toggle" : $.extend({
            remote: !/#/.test(href) && href
        }, $target.data(), $this.data());
        if ($this.is("a")) e.preventDefault();
        $target.one("show.bs.modal", function(showEvent) {
            if (showEvent.isDefaultPrevented()) return;
            $target.one("hidden.bs.modal", function() {
                $this.is(":visible") && $this.trigger("focus");
            });
        });
        Plugin.call($target, option, this);
    });
}(jQuery);

+function($) {
    "use strict";
    var DISALLOWED_ATTRIBUTES = [ "sanitize", "whiteList", "sanitizeFn" ];
    var uriAttrs = [ "background", "cite", "href", "itemtype", "longdesc", "poster", "src", "xlink:href" ];
    var ARIA_ATTRIBUTE_PATTERN = /^aria-[\w-]*$/i;
    var DefaultWhitelist = {
        "*": [ "class", "dir", "id", "lang", "role", ARIA_ATTRIBUTE_PATTERN ],
        a: [ "target", "href", "title", "rel" ],
        area: [],
        b: [],
        br: [],
        col: [],
        code: [],
        div: [],
        em: [],
        hr: [],
        h1: [],
        h2: [],
        h3: [],
        h4: [],
        h5: [],
        h6: [],
        i: [],
        img: [ "src", "alt", "title", "width", "height" ],
        li: [],
        ol: [],
        p: [],
        pre: [],
        s: [],
        small: [],
        span: [],
        sub: [],
        sup: [],
        strong: [],
        u: [],
        ul: []
    };
    var SAFE_URL_PATTERN = /^(?:(?:https?|mailto|ftp|tel|file):|[^&:/?#]*(?:[/?#]|$))/gi;
    var DATA_URL_PATTERN = /^data:(?:image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp)|video\/(?:mpeg|mp4|ogg|webm)|audio\/(?:mp3|oga|ogg|opus));base64,[a-z0-9+/]+=*$/i;
    function allowedAttribute(attr, allowedAttributeList) {
        var attrName = attr.nodeName.toLowerCase();
        if ($.inArray(attrName, allowedAttributeList) !== -1) {
            if ($.inArray(attrName, uriAttrs) !== -1) {
                return Boolean(attr.nodeValue.match(SAFE_URL_PATTERN) || attr.nodeValue.match(DATA_URL_PATTERN));
            }
            return true;
        }
        var regExp = $(allowedAttributeList).filter(function(index, value) {
            return value instanceof RegExp;
        });
        for (var i = 0, l = regExp.length; i < l; i++) {
            if (attrName.match(regExp[i])) {
                return true;
            }
        }
        return false;
    }
    function sanitizeHtml(unsafeHtml, whiteList, sanitizeFn) {
        if (unsafeHtml.length === 0) {
            return unsafeHtml;
        }
        if (sanitizeFn && typeof sanitizeFn === "function") {
            return sanitizeFn(unsafeHtml);
        }
        if (!document.implementation || !document.implementation.createHTMLDocument) {
            return unsafeHtml;
        }
        var createdDocument = document.implementation.createHTMLDocument("sanitization");
        createdDocument.body.innerHTML = unsafeHtml;
        var whitelistKeys = $.map(whiteList, function(el, i) {
            return i;
        });
        var elements = $(createdDocument.body).find("*");
        for (var i = 0, len = elements.length; i < len; i++) {
            var el = elements[i];
            var elName = el.nodeName.toLowerCase();
            if ($.inArray(elName, whitelistKeys) === -1) {
                el.parentNode.removeChild(el);
                continue;
            }
            var attributeList = $.map(el.attributes, function(el) {
                return el;
            });
            var whitelistedAttributes = [].concat(whiteList["*"] || [], whiteList[elName] || []);
            for (var j = 0, len2 = attributeList.length; j < len2; j++) {
                if (!allowedAttribute(attributeList[j], whitelistedAttributes)) {
                    el.removeAttribute(attributeList[j].nodeName);
                }
            }
        }
        return createdDocument.body.innerHTML;
    }
    var Tooltip = function(element, options) {
        this.type = null;
        this.options = null;
        this.enabled = null;
        this.timeout = null;
        this.hoverState = null;
        this.$element = null;
        this.inState = null;
        this.init("tooltip", element, options);
    };
    Tooltip.VERSION = "3.4.1";
    Tooltip.TRANSITION_DURATION = 150;
    Tooltip.DEFAULTS = {
        animation: true,
        placement: "top",
        selector: false,
        template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
        trigger: "hover focus",
        title: "",
        delay: 0,
        html: false,
        container: false,
        viewport: {
            selector: "body",
            padding: 0
        },
        sanitize: true,
        sanitizeFn: null,
        whiteList: DefaultWhitelist
    };
    Tooltip.prototype.init = function(type, element, options) {
        this.enabled = true;
        this.type = type;
        this.$element = $(element);
        this.options = this.getOptions(options);
        this.$viewport = this.options.viewport && $(document).find($.isFunction(this.options.viewport) ? this.options.viewport.call(this, this.$element) : this.options.viewport.selector || this.options.viewport);
        this.inState = {
            click: false,
            hover: false,
            focus: false
        };
        if (this.$element[0] instanceof document.constructor && !this.options.selector) {
            throw new Error("`selector` option must be specified when initializing " + this.type + " on the window.document object!");
        }
        var triggers = this.options.trigger.split(" ");
        for (var i = triggers.length; i--; ) {
            var trigger = triggers[i];
            if (trigger == "click") {
                this.$element.on("click." + this.type, this.options.selector, $.proxy(this.toggle, this));
            } else if (trigger != "manual") {
                var eventIn = trigger == "hover" ? "mouseenter" : "focusin";
                var eventOut = trigger == "hover" ? "mouseleave" : "focusout";
                this.$element.on(eventIn + "." + this.type, this.options.selector, $.proxy(this.enter, this));
                this.$element.on(eventOut + "." + this.type, this.options.selector, $.proxy(this.leave, this));
            }
        }
        this.options.selector ? this._options = $.extend({}, this.options, {
            trigger: "manual",
            selector: ""
        }) : this.fixTitle();
    };
    Tooltip.prototype.getDefaults = function() {
        return Tooltip.DEFAULTS;
    };
    Tooltip.prototype.getOptions = function(options) {
        var dataAttributes = this.$element.data();
        for (var dataAttr in dataAttributes) {
            if (dataAttributes.hasOwnProperty(dataAttr) && $.inArray(dataAttr, DISALLOWED_ATTRIBUTES) !== -1) {
                delete dataAttributes[dataAttr];
            }
        }
        options = $.extend({}, this.getDefaults(), dataAttributes, options);
        if (options.delay && typeof options.delay == "number") {
            options.delay = {
                show: options.delay,
                hide: options.delay
            };
        }
        if (options.sanitize) {
            options.template = sanitizeHtml(options.template, options.whiteList, options.sanitizeFn);
        }
        return options;
    };
    Tooltip.prototype.getDelegateOptions = function() {
        var options = {};
        var defaults = this.getDefaults();
        this._options && $.each(this._options, function(key, value) {
            if (defaults[key] != value) options[key] = value;
        });
        return options;
    };
    Tooltip.prototype.enter = function(obj) {
        var self = obj instanceof this.constructor ? obj : $(obj.currentTarget).data("bs." + this.type);
        if (!self) {
            self = new this.constructor(obj.currentTarget, this.getDelegateOptions());
            $(obj.currentTarget).data("bs." + this.type, self);
        }
        if (obj instanceof $.Event) {
            self.inState[obj.type == "focusin" ? "focus" : "hover"] = true;
        }
        if (self.tip().hasClass("in") || self.hoverState == "in") {
            self.hoverState = "in";
            return;
        }
        clearTimeout(self.timeout);
        self.hoverState = "in";
        if (!self.options.delay || !self.options.delay.show) return self.show();
        self.timeout = setTimeout(function() {
            if (self.hoverState == "in") self.show();
        }, self.options.delay.show);
    };
    Tooltip.prototype.isInStateTrue = function() {
        for (var key in this.inState) {
            if (this.inState[key]) return true;
        }
        return false;
    };
    Tooltip.prototype.leave = function(obj) {
        var self = obj instanceof this.constructor ? obj : $(obj.currentTarget).data("bs." + this.type);
        if (!self) {
            self = new this.constructor(obj.currentTarget, this.getDelegateOptions());
            $(obj.currentTarget).data("bs." + this.type, self);
        }
        if (obj instanceof $.Event) {
            self.inState[obj.type == "focusout" ? "focus" : "hover"] = false;
        }
        if (self.isInStateTrue()) return;
        clearTimeout(self.timeout);
        self.hoverState = "out";
        if (!self.options.delay || !self.options.delay.hide) return self.hide();
        self.timeout = setTimeout(function() {
            if (self.hoverState == "out") self.hide();
        }, self.options.delay.hide);
    };
    Tooltip.prototype.show = function() {
        var e = $.Event("show.bs." + this.type);
        if (this.hasContent() && this.enabled) {
            this.$element.trigger(e);
            var inDom = $.contains(this.$element[0].ownerDocument.documentElement, this.$element[0]);
            if (e.isDefaultPrevented() || !inDom) return;
            var that = this;
            var $tip = this.tip();
            var tipId = this.getUID(this.type);
            this.setContent();
            $tip.attr("id", tipId);
            this.$element.attr("aria-describedby", tipId);
            if (this.options.animation) $tip.addClass("fade");
            var placement = typeof this.options.placement == "function" ? this.options.placement.call(this, $tip[0], this.$element[0]) : this.options.placement;
            var autoToken = /\s?auto?\s?/i;
            var autoPlace = autoToken.test(placement);
            if (autoPlace) placement = placement.replace(autoToken, "") || "top";
            $tip.detach().css({
                top: 0,
                left: 0,
                display: "block"
            }).addClass(placement).data("bs." + this.type, this);
            this.options.container ? $tip.appendTo($(document).find(this.options.container)) : $tip.insertAfter(this.$element);
            this.$element.trigger("inserted.bs." + this.type);
            var pos = this.getPosition();
            var actualWidth = $tip[0].offsetWidth;
            var actualHeight = $tip[0].offsetHeight;
            if (autoPlace) {
                var orgPlacement = placement;
                var viewportDim = this.getPosition(this.$viewport);
                placement = placement == "bottom" && pos.bottom + actualHeight > viewportDim.bottom ? "top" : placement == "top" && pos.top - actualHeight < viewportDim.top ? "bottom" : placement == "right" && pos.right + actualWidth > viewportDim.width ? "left" : placement == "left" && pos.left - actualWidth < viewportDim.left ? "right" : placement;
                $tip.removeClass(orgPlacement).addClass(placement);
            }
            var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight);
            this.applyPlacement(calculatedOffset, placement);
            var complete = function() {
                var prevHoverState = that.hoverState;
                that.$element.trigger("shown.bs." + that.type);
                that.hoverState = null;
                if (prevHoverState == "out") that.leave(that);
            };
            $.support.transition && this.$tip.hasClass("fade") ? $tip.one("bsTransitionEnd", complete).emulateTransitionEnd(Tooltip.TRANSITION_DURATION) : complete();
        }
    };
    Tooltip.prototype.applyPlacement = function(offset, placement) {
        var $tip = this.tip();
        var width = $tip[0].offsetWidth;
        var height = $tip[0].offsetHeight;
        var marginTop = parseInt($tip.css("margin-top"), 10);
        var marginLeft = parseInt($tip.css("margin-left"), 10);
        if (isNaN(marginTop)) marginTop = 0;
        if (isNaN(marginLeft)) marginLeft = 0;
        offset.top += marginTop;
        offset.left += marginLeft;
        $.offset.setOffset($tip[0], $.extend({
            using: function(props) {
                $tip.css({
                    top: Math.round(props.top),
                    left: Math.round(props.left)
                });
            }
        }, offset), 0);
        $tip.addClass("in");
        var actualWidth = $tip[0].offsetWidth;
        var actualHeight = $tip[0].offsetHeight;
        if (placement == "top" && actualHeight != height) {
            offset.top = offset.top + height - actualHeight;
        }
        var delta = this.getViewportAdjustedDelta(placement, offset, actualWidth, actualHeight);
        if (delta.left) offset.left += delta.left; else offset.top += delta.top;
        var isVertical = /top|bottom/.test(placement);
        var arrowDelta = isVertical ? delta.left * 2 - width + actualWidth : delta.top * 2 - height + actualHeight;
        var arrowOffsetPosition = isVertical ? "offsetWidth" : "offsetHeight";
        $tip.offset(offset);
        this.replaceArrow(arrowDelta, $tip[0][arrowOffsetPosition], isVertical);
    };
    Tooltip.prototype.replaceArrow = function(delta, dimension, isVertical) {
        this.arrow().css(isVertical ? "left" : "top", 50 * (1 - delta / dimension) + "%").css(isVertical ? "top" : "left", "");
    };
    Tooltip.prototype.setContent = function() {
        var $tip = this.tip();
        var title = this.getTitle();
        if (this.options.html) {
            if (this.options.sanitize) {
                title = sanitizeHtml(title, this.options.whiteList, this.options.sanitizeFn);
            }
            $tip.find(".tooltip-inner").html(title);
        } else {
            $tip.find(".tooltip-inner").text(title);
        }
        $tip.removeClass("fade in top bottom left right");
    };
    Tooltip.prototype.hide = function(callback) {
        var that = this;
        var $tip = $(this.$tip);
        var e = $.Event("hide.bs." + this.type);
        function complete() {
            if (that.hoverState != "in") $tip.detach();
            if (that.$element) {
                that.$element.removeAttr("aria-describedby").trigger("hidden.bs." + that.type);
            }
            callback && callback();
        }
        this.$element.trigger(e);
        if (e.isDefaultPrevented()) return;
        $tip.removeClass("in");
        $.support.transition && $tip.hasClass("fade") ? $tip.one("bsTransitionEnd", complete).emulateTransitionEnd(Tooltip.TRANSITION_DURATION) : complete();
        this.hoverState = null;
        return this;
    };
    Tooltip.prototype.fixTitle = function() {
        var $e = this.$element;
        if ($e.attr("title") || typeof $e.attr("data-original-title") != "string") {
            $e.attr("data-original-title", $e.attr("title") || "").attr("title", "");
        }
    };
    Tooltip.prototype.hasContent = function() {
        return this.getTitle();
    };
    Tooltip.prototype.getPosition = function($element) {
        $element = $element || this.$element;
        var el = $element[0];
        var isBody = el.tagName == "BODY";
        var elRect = el.getBoundingClientRect();
        if (elRect.width == null) {
            elRect = $.extend({}, elRect, {
                width: elRect.right - elRect.left,
                height: elRect.bottom - elRect.top
            });
        }
        var isSvg = window.SVGElement && el instanceof window.SVGElement;
        var elOffset = isBody ? {
            top: 0,
            left: 0
        } : isSvg ? null : $element.offset();
        var scroll = {
            scroll: isBody ? document.documentElement.scrollTop || document.body.scrollTop : $element.scrollTop()
        };
        var outerDims = isBody ? {
            width: $(window).width(),
            height: $(window).height()
        } : null;
        return $.extend({}, elRect, scroll, outerDims, elOffset);
    };
    Tooltip.prototype.getCalculatedOffset = function(placement, pos, actualWidth, actualHeight) {
        return placement == "bottom" ? {
            top: pos.top + pos.height,
            left: pos.left + pos.width / 2 - actualWidth / 2
        } : placement == "top" ? {
            top: pos.top - actualHeight,
            left: pos.left + pos.width / 2 - actualWidth / 2
        } : placement == "left" ? {
            top: pos.top + pos.height / 2 - actualHeight / 2,
            left: pos.left - actualWidth
        } : {
            top: pos.top + pos.height / 2 - actualHeight / 2,
            left: pos.left + pos.width
        };
    };
    Tooltip.prototype.getViewportAdjustedDelta = function(placement, pos, actualWidth, actualHeight) {
        var delta = {
            top: 0,
            left: 0
        };
        if (!this.$viewport) return delta;
        var viewportPadding = this.options.viewport && this.options.viewport.padding || 0;
        var viewportDimensions = this.getPosition(this.$viewport);
        if (/right|left/.test(placement)) {
            var topEdgeOffset = pos.top - viewportPadding - viewportDimensions.scroll;
            var bottomEdgeOffset = pos.top + viewportPadding - viewportDimensions.scroll + actualHeight;
            if (topEdgeOffset < viewportDimensions.top) {
                delta.top = viewportDimensions.top - topEdgeOffset;
            } else if (bottomEdgeOffset > viewportDimensions.top + viewportDimensions.height) {
                delta.top = viewportDimensions.top + viewportDimensions.height - bottomEdgeOffset;
            }
        } else {
            var leftEdgeOffset = pos.left - viewportPadding;
            var rightEdgeOffset = pos.left + viewportPadding + actualWidth;
            if (leftEdgeOffset < viewportDimensions.left) {
                delta.left = viewportDimensions.left - leftEdgeOffset;
            } else if (rightEdgeOffset > viewportDimensions.right) {
                delta.left = viewportDimensions.left + viewportDimensions.width - rightEdgeOffset;
            }
        }
        return delta;
    };
    Tooltip.prototype.getTitle = function() {
        var title;
        var $e = this.$element;
        var o = this.options;
        title = $e.attr("data-original-title") || (typeof o.title == "function" ? o.title.call($e[0]) : o.title);
        return title;
    };
    Tooltip.prototype.getUID = function(prefix) {
        do {
            prefix += ~~(Math.random() * 1e6);
        } while (document.getElementById(prefix));
        return prefix;
    };
    Tooltip.prototype.tip = function() {
        if (!this.$tip) {
            this.$tip = $(this.options.template);
            if (this.$tip.length != 1) {
                throw new Error(this.type + " `template` option must consist of exactly 1 top-level element!");
            }
        }
        return this.$tip;
    };
    Tooltip.prototype.arrow = function() {
        return this.$arrow = this.$arrow || this.tip().find(".tooltip-arrow");
    };
    Tooltip.prototype.enable = function() {
        this.enabled = true;
    };
    Tooltip.prototype.disable = function() {
        this.enabled = false;
    };
    Tooltip.prototype.toggleEnabled = function() {
        this.enabled = !this.enabled;
    };
    Tooltip.prototype.toggle = function(e) {
        var self = this;
        if (e) {
            self = $(e.currentTarget).data("bs." + this.type);
            if (!self) {
                self = new this.constructor(e.currentTarget, this.getDelegateOptions());
                $(e.currentTarget).data("bs." + this.type, self);
            }
        }
        if (e) {
            self.inState.click = !self.inState.click;
            if (self.isInStateTrue()) self.enter(self); else self.leave(self);
        } else {
            self.tip().hasClass("in") ? self.leave(self) : self.enter(self);
        }
    };
    Tooltip.prototype.destroy = function() {
        var that = this;
        clearTimeout(this.timeout);
        this.hide(function() {
            that.$element.off("." + that.type).removeData("bs." + that.type);
            if (that.$tip) {
                that.$tip.detach();
            }
            that.$tip = null;
            that.$arrow = null;
            that.$viewport = null;
            that.$element = null;
        });
    };
    Tooltip.prototype.sanitizeHtml = function(unsafeHtml) {
        return sanitizeHtml(unsafeHtml, this.options.whiteList, this.options.sanitizeFn);
    };
    function Plugin(option) {
        return this.each(function() {
            var $this = $(this);
            var data = $this.data("bs.tooltip");
            var options = typeof option == "object" && option;
            if (!data && /destroy|hide/.test(option)) return;
            if (!data) $this.data("bs.tooltip", data = new Tooltip(this, options));
            if (typeof option == "string") data[option]();
        });
    }
    var old = $.fn.tooltip;
    $.fn.tooltip = Plugin;
    $.fn.tooltip.Constructor = Tooltip;
    $.fn.tooltip.noConflict = function() {
        $.fn.tooltip = old;
        return this;
    };
}(jQuery);

+function($) {
    "use strict";
    var Popover = function(element, options) {
        this.init("popover", element, options);
    };
    if (!$.fn.tooltip) throw new Error("Popover requires tooltip.js");
    Popover.VERSION = "3.4.1";
    Popover.DEFAULTS = $.extend({}, $.fn.tooltip.Constructor.DEFAULTS, {
        placement: "right",
        trigger: "click",
        content: "",
        template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
    });
    Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype);
    Popover.prototype.constructor = Popover;
    Popover.prototype.getDefaults = function() {
        return Popover.DEFAULTS;
    };
    Popover.prototype.setContent = function() {
        var $tip = this.tip();
        var title = this.getTitle();
        var content = this.getContent();
        if (this.options.html) {
            var typeContent = typeof content;
            if (this.options.sanitize) {
                title = this.sanitizeHtml(title);
                if (typeContent === "string") {
                    content = this.sanitizeHtml(content);
                }
            }
            $tip.find(".popover-title").html(title);
            $tip.find(".popover-content").children().detach().end()[typeContent === "string" ? "html" : "append"](content);
        } else {
            $tip.find(".popover-title").text(title);
            $tip.find(".popover-content").children().detach().end().text(content);
        }
        $tip.removeClass("fade top bottom left right in");
        if (!$tip.find(".popover-title").html()) $tip.find(".popover-title").hide();
    };
    Popover.prototype.hasContent = function() {
        return this.getTitle() || this.getContent();
    };
    Popover.prototype.getContent = function() {
        var $e = this.$element;
        var o = this.options;
        return $e.attr("data-content") || (typeof o.content == "function" ? o.content.call($e[0]) : o.content);
    };
    Popover.prototype.arrow = function() {
        return this.$arrow = this.$arrow || this.tip().find(".arrow");
    };
    function Plugin(option) {
        return this.each(function() {
            var $this = $(this);
            var data = $this.data("bs.popover");
            var options = typeof option == "object" && option;
            if (!data && /destroy|hide/.test(option)) return;
            if (!data) $this.data("bs.popover", data = new Popover(this, options));
            if (typeof option == "string") data[option]();
        });
    }
    var old = $.fn.popover;
    $.fn.popover = Plugin;
    $.fn.popover.Constructor = Popover;
    $.fn.popover.noConflict = function() {
        $.fn.popover = old;
        return this;
    };
}(jQuery);

+function($) {
    "use strict";
    function ScrollSpy(element, options) {
        this.$body = $(document.body);
        this.$scrollElement = $(element).is(document.body) ? $(window) : $(element);
        this.options = $.extend({}, ScrollSpy.DEFAULTS, options);
        this.selector = (this.options.target || "") + " .nav li > a";
        this.offsets = [];
        this.targets = [];
        this.activeTarget = null;
        this.scrollHeight = 0;
        this.$scrollElement.on("scroll.bs.scrollspy", $.proxy(this.process, this));
        this.refresh();
        this.process();
    }
    ScrollSpy.VERSION = "3.4.1";
    ScrollSpy.DEFAULTS = {
        offset: 10
    };
    ScrollSpy.prototype.getScrollHeight = function() {
        return this.$scrollElement[0].scrollHeight || Math.max(this.$body[0].scrollHeight, document.documentElement.scrollHeight);
    };
    ScrollSpy.prototype.refresh = function() {
        var that = this;
        var offsetMethod = "offset";
        var offsetBase = 0;
        this.offsets = [];
        this.targets = [];
        this.scrollHeight = this.getScrollHeight();
        if (!$.isWindow(this.$scrollElement[0])) {
            offsetMethod = "position";
            offsetBase = this.$scrollElement.scrollTop();
        }
        this.$body.find(this.selector).map(function() {
            var $el = $(this);
            var href = $el.data("target") || $el.attr("href");
            var $href = /^#./.test(href) && $(href);
            return $href && $href.length && $href.is(":visible") && [ [ $href[offsetMethod]().top + offsetBase, href ] ] || null;
        }).sort(function(a, b) {
            return a[0] - b[0];
        }).each(function() {
            that.offsets.push(this[0]);
            that.targets.push(this[1]);
        });
    };
    ScrollSpy.prototype.process = function() {
        var scrollTop = this.$scrollElement.scrollTop() + this.options.offset;
        var scrollHeight = this.getScrollHeight();
        var maxScroll = this.options.offset + scrollHeight - this.$scrollElement.height();
        var offsets = this.offsets;
        var targets = this.targets;
        var activeTarget = this.activeTarget;
        var i;
        if (this.scrollHeight != scrollHeight) {
            this.refresh();
        }
        if (scrollTop >= maxScroll) {
            return activeTarget != (i = targets[targets.length - 1]) && this.activate(i);
        }
        if (activeTarget && scrollTop < offsets[0]) {
            this.activeTarget = null;
            return this.clear();
        }
        for (i = offsets.length; i--; ) {
            activeTarget != targets[i] && scrollTop >= offsets[i] && (offsets[i + 1] === undefined || scrollTop < offsets[i + 1]) && this.activate(targets[i]);
        }
    };
    ScrollSpy.prototype.activate = function(target) {
        this.activeTarget = target;
        this.clear();
        var selector = this.selector + '[data-target="' + target + '"],' + this.selector + '[href="' + target + '"]';
        var active = $(selector).parents("li").addClass("active");
        if (active.parent(".dropdown-menu").length) {
            active = active.closest("li.dropdown").addClass("active");
        }
        active.trigger("activate.bs.scrollspy");
    };
    ScrollSpy.prototype.clear = function() {
        $(this.selector).parentsUntil(this.options.target, ".active").removeClass("active");
    };
    function Plugin(option) {
        return this.each(function() {
            var $this = $(this);
            var data = $this.data("bs.scrollspy");
            var options = typeof option == "object" && option;
            if (!data) $this.data("bs.scrollspy", data = new ScrollSpy(this, options));
            if (typeof option == "string") data[option]();
        });
    }
    var old = $.fn.scrollspy;
    $.fn.scrollspy = Plugin;
    $.fn.scrollspy.Constructor = ScrollSpy;
    $.fn.scrollspy.noConflict = function() {
        $.fn.scrollspy = old;
        return this;
    };
    $(window).on("load.bs.scrollspy.data-api", function() {
        $('[data-spy="scroll"]').each(function() {
            var $spy = $(this);
            Plugin.call($spy, $spy.data());
        });
    });
}(jQuery);

+function($) {
    "use strict";
    var Tab = function(element) {
        this.element = $(element);
    };
    Tab.VERSION = "3.4.1";
    Tab.TRANSITION_DURATION = 150;
    Tab.prototype.show = function() {
        var $this = this.element;
        var $ul = $this.closest("ul:not(.dropdown-menu)");
        var selector = $this.data("target");
        if (!selector) {
            selector = $this.attr("href");
            selector = selector && selector.replace(/.*(?=#[^\s]*$)/, "");
        }
        if ($this.parent("li").hasClass("active")) return;
        var $previous = $ul.find(".active:last a");
        var hideEvent = $.Event("hide.bs.tab", {
            relatedTarget: $this[0]
        });
        var showEvent = $.Event("show.bs.tab", {
            relatedTarget: $previous[0]
        });
        $previous.trigger(hideEvent);
        $this.trigger(showEvent);
        if (showEvent.isDefaultPrevented() || hideEvent.isDefaultPrevented()) return;
        var $target = $(document).find(selector);
        this.activate($this.closest("li"), $ul);
        this.activate($target, $target.parent(), function() {
            $previous.trigger({
                type: "hidden.bs.tab",
                relatedTarget: $this[0]
            });
            $this.trigger({
                type: "shown.bs.tab",
                relatedTarget: $previous[0]
            });
        });
    };
    Tab.prototype.activate = function(element, container, callback) {
        var $active = container.find("> .active");
        var transition = callback && $.support.transition && ($active.length && $active.hasClass("fade") || !!container.find("> .fade").length);
        function next() {
            $active.removeClass("active").find("> .dropdown-menu > .active").removeClass("active").end().find('[data-toggle="tab"]').attr("aria-expanded", false);
            element.addClass("active").find('[data-toggle="tab"]').attr("aria-expanded", true);
            if (transition) {
                element[0].offsetWidth;
                element.addClass("in");
            } else {
                element.removeClass("fade");
            }
            if (element.parent(".dropdown-menu").length) {
                element.closest("li.dropdown").addClass("active").end().find('[data-toggle="tab"]').attr("aria-expanded", true);
            }
            callback && callback();
        }
        $active.length && transition ? $active.one("bsTransitionEnd", next).emulateTransitionEnd(Tab.TRANSITION_DURATION) : next();
        $active.removeClass("in");
    };
    function Plugin(option) {
        return this.each(function() {
            var $this = $(this);
            var data = $this.data("bs.tab");
            if (!data) $this.data("bs.tab", data = new Tab(this));
            if (typeof option == "string") data[option]();
        });
    }
    var old = $.fn.tab;
    $.fn.tab = Plugin;
    $.fn.tab.Constructor = Tab;
    $.fn.tab.noConflict = function() {
        $.fn.tab = old;
        return this;
    };
    var clickHandler = function(e) {
        e.preventDefault();
        Plugin.call($(this), "show");
    };
    $(document).on("click.bs.tab.data-api", '[data-toggle="tab"]', clickHandler).on("click.bs.tab.data-api", '[data-toggle="pill"]', clickHandler);
}(jQuery);

+function($) {
    "use strict";
    var Affix = function(element, options) {
        this.options = $.extend({}, Affix.DEFAULTS, options);
        var target = this.options.target === Affix.DEFAULTS.target ? $(this.options.target) : $(document).find(this.options.target);
        this.$target = target.on("scroll.bs.affix.data-api", $.proxy(this.checkPosition, this)).on("click.bs.affix.data-api", $.proxy(this.checkPositionWithEventLoop, this));
        this.$element = $(element);
        this.affixed = null;
        this.unpin = null;
        this.pinnedOffset = null;
        this.checkPosition();
    };
    Affix.VERSION = "3.4.1";
    Affix.RESET = "affix affix-top affix-bottom";
    Affix.DEFAULTS = {
        offset: 0,
        target: window
    };
    Affix.prototype.getState = function(scrollHeight, height, offsetTop, offsetBottom) {
        var scrollTop = this.$target.scrollTop();
        var position = this.$element.offset();
        var targetHeight = this.$target.height();
        if (offsetTop != null && this.affixed == "top") return scrollTop < offsetTop ? "top" : false;
        if (this.affixed == "bottom") {
            if (offsetTop != null) return scrollTop + this.unpin <= position.top ? false : "bottom";
            return scrollTop + targetHeight <= scrollHeight - offsetBottom ? false : "bottom";
        }
        var initializing = this.affixed == null;
        var colliderTop = initializing ? scrollTop : position.top;
        var colliderHeight = initializing ? targetHeight : height;
        if (offsetTop != null && scrollTop <= offsetTop) return "top";
        if (offsetBottom != null && colliderTop + colliderHeight >= scrollHeight - offsetBottom) return "bottom";
        return false;
    };
    Affix.prototype.getPinnedOffset = function() {
        if (this.pinnedOffset) return this.pinnedOffset;
        this.$element.removeClass(Affix.RESET).addClass("affix");
        var scrollTop = this.$target.scrollTop();
        var position = this.$element.offset();
        return this.pinnedOffset = position.top - scrollTop;
    };
    Affix.prototype.checkPositionWithEventLoop = function() {
        setTimeout($.proxy(this.checkPosition, this), 1);
    };
    Affix.prototype.checkPosition = function() {
        if (!this.$element.is(":visible")) return;
        var height = this.$element.height();
        var offset = this.options.offset;
        var offsetTop = offset.top;
        var offsetBottom = offset.bottom;
        var scrollHeight = Math.max($(document).height(), $(document.body).height());
        if (typeof offset != "object") offsetBottom = offsetTop = offset;
        if (typeof offsetTop == "function") offsetTop = offset.top(this.$element);
        if (typeof offsetBottom == "function") offsetBottom = offset.bottom(this.$element);
        var affix = this.getState(scrollHeight, height, offsetTop, offsetBottom);
        if (this.affixed != affix) {
            if (this.unpin != null) this.$element.css("top", "");
            var affixType = "affix" + (affix ? "-" + affix : "");
            var e = $.Event(affixType + ".bs.affix");
            this.$element.trigger(e);
            if (e.isDefaultPrevented()) return;
            this.affixed = affix;
            this.unpin = affix == "bottom" ? this.getPinnedOffset() : null;
            this.$element.removeClass(Affix.RESET).addClass(affixType).trigger(affixType.replace("affix", "affixed") + ".bs.affix");
        }
        if (affix == "bottom") {
            this.$element.offset({
                top: scrollHeight - height - offsetBottom
            });
        }
    };
    function Plugin(option) {
        return this.each(function() {
            var $this = $(this);
            var data = $this.data("bs.affix");
            var options = typeof option == "object" && option;
            if (!data) $this.data("bs.affix", data = new Affix(this, options));
            if (typeof option == "string") data[option]();
        });
    }
    var old = $.fn.affix;
    $.fn.affix = Plugin;
    $.fn.affix.Constructor = Affix;
    $.fn.affix.noConflict = function() {
        $.fn.affix = old;
        return this;
    };
    $(window).on("load", function() {
        $('[data-spy="affix"]').each(function() {
            var $spy = $(this);
            var data = $spy.data();
            data.offset = data.offset || {};
            if (data.offsetBottom != null) data.offset.bottom = data.offsetBottom;
            if (data.offsetTop != null) data.offset.top = data.offsetTop;
            Plugin.call($spy, data);
        });
    });
}(jQuery);

(function(window, document, $, undefined) {
    "use strict";
    window.console = window.console || {
        info: function(stuff) {}
    };
    if (!$) {
        return;
    }
    if ($.fn.fancybox) {
        console.info("fancyBox already initialized");
        return;
    }
    var defaults = {
        closeExisting: false,
        loop: false,
        gutter: 50,
        keyboard: true,
        preventCaptionOverlap: true,
        arrows: true,
        infobar: true,
        smallBtn: "auto",
        toolbar: "auto",
        buttons: [ "zoom", "slideShow", "thumbs", "close" ],
        idleTime: 3,
        protect: false,
        modal: false,
        image: {
            preload: false
        },
        ajax: {
            settings: {
                data: {
                    fancybox: true
                }
            }
        },
        iframe: {
            tpl: '<iframe id="fancybox-frame{rnd}" name="fancybox-frame{rnd}" class="fancybox-iframe" allowfullscreen="allowfullscreen" allow="autoplay; fullscreen" src=""></iframe>',
            preload: true,
            css: {},
            attr: {
                scrolling: "auto"
            }
        },
        video: {
            tpl: '<video class="fancybox-video" controls controlsList="nodownload" poster="{{poster}}">' + '<source src="{{src}}" type="{{format}}" />' + 'Sorry, your browser doesn\'t support embedded videos, <a href="{{src}}">download</a> and watch with your favorite video player!' + "</video>",
            format: "",
            autoStart: true
        },
        defaultType: "image",
        animationEffect: "zoom",
        animationDuration: 366,
        zoomOpacity: "auto",
        transitionEffect: "fade",
        transitionDuration: 366,
        slideClass: "",
        baseClass: "",
        baseTpl: '<div class="fancybox-container" role="dialog" tabindex="-1">' + '<div class="fancybox-bg"></div>' + '<div class="fancybox-inner">' + '<div class="fancybox-infobar"><span data-fancybox-index></span>&nbsp;/&nbsp;<span data-fancybox-count></span></div>' + '<div class="fancybox-toolbar">{{buttons}}</div>' + '<div class="fancybox-navigation">{{arrows}}</div>' + '<div class="fancybox-stage"></div>' + '<div class="fancybox-caption"><div class="fancybox-caption__body"></div></div>' + "</div>" + "</div>",
        spinnerTpl: '<div class="fancybox-loading"></div>',
        errorTpl: '<div class="fancybox-error"><p>{{ERROR}}</p></div>',
        btnTpl: {
            download: '<a download data-fancybox-download class="fancybox-button fancybox-button--download" title="{{DOWNLOAD}}" href="javascript:;">' + '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M18.62 17.09V19H5.38v-1.91zm-2.97-6.96L17 11.45l-5 4.87-5-4.87 1.36-1.32 2.68 2.64V5h1.92v7.77z"/></svg>' + "</a>",
            zoom: '<button data-fancybox-zoom class="fancybox-button fancybox-button--zoom" title="{{ZOOM}}">' + '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M18.7 17.3l-3-3a5.9 5.9 0 0 0-.6-7.6 5.9 5.9 0 0 0-8.4 0 5.9 5.9 0 0 0 0 8.4 5.9 5.9 0 0 0 7.7.7l3 3a1 1 0 0 0 1.3 0c.4-.5.4-1 0-1.5zM8.1 13.8a4 4 0 0 1 0-5.7 4 4 0 0 1 5.7 0 4 4 0 0 1 0 5.7 4 4 0 0 1-5.7 0z"/></svg>' + "</button>",
            close: '<button data-fancybox-close class="fancybox-button fancybox-button--close" title="{{CLOSE}}">' + '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 10.6L6.6 5.2 5.2 6.6l5.4 5.4-5.4 5.4 1.4 1.4 5.4-5.4 5.4 5.4 1.4-1.4-5.4-5.4 5.4-5.4-1.4-1.4-5.4 5.4z"/></svg>' + "</button>",
            arrowLeft: '<button data-fancybox-prev class="fancybox-button fancybox-button--arrow_left" title="{{PREV}}">' + '<div><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M11.28 15.7l-1.34 1.37L5 12l4.94-5.07 1.34 1.38-2.68 2.72H19v1.94H8.6z"/></svg></div>' + "</button>",
            arrowRight: '<button data-fancybox-next class="fancybox-button fancybox-button--arrow_right" title="{{NEXT}}">' + '<div><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M15.4 12.97l-2.68 2.72 1.34 1.38L19 12l-4.94-5.07-1.34 1.38 2.68 2.72H5v1.94z"/></svg></div>' + "</button>",
            smallBtn: '<button type="button" data-fancybox-close class="fancybox-button fancybox-close-small" title="{{CLOSE}}">' + '<svg xmlns="http://www.w3.org/2000/svg" version="1" viewBox="0 0 24 24"><path d="M13 12l5-5-1-1-5 5-5-5-1 1 5 5-5 5 1 1 5-5 5 5 1-1z"/></svg>' + "</button>"
        },
        parentEl: "body",
        hideScrollbar: true,
        autoFocus: true,
        backFocus: true,
        trapFocus: true,
        fullScreen: {
            autoStart: false
        },
        touch: {
            vertical: true,
            momentum: true
        },
        hash: null,
        media: {},
        slideShow: {
            autoStart: false,
            speed: 3e3
        },
        thumbs: {
            autoStart: false,
            hideOnClose: true,
            parentEl: ".fancybox-container",
            axis: "y"
        },
        wheel: "auto",
        onInit: $.noop,
        beforeLoad: $.noop,
        afterLoad: $.noop,
        beforeShow: $.noop,
        afterShow: $.noop,
        beforeClose: $.noop,
        afterClose: $.noop,
        onActivate: $.noop,
        onDeactivate: $.noop,
        clickContent: function(current, event) {
            return current.type === "image" ? "zoom" : false;
        },
        clickSlide: "close",
        clickOutside: "close",
        dblclickContent: false,
        dblclickSlide: false,
        dblclickOutside: false,
        mobile: {
            preventCaptionOverlap: false,
            idleTime: false,
            clickContent: function(current, event) {
                return current.type === "image" ? "toggleControls" : false;
            },
            clickSlide: function(current, event) {
                return current.type === "image" ? "toggleControls" : "close";
            },
            dblclickContent: function(current, event) {
                return current.type === "image" ? "zoom" : false;
            },
            dblclickSlide: function(current, event) {
                return current.type === "image" ? "zoom" : false;
            }
        },
        lang: "en",
        i18n: {
            en: {
                CLOSE: "Close",
                NEXT: "Next",
                PREV: "Previous",
                ERROR: "The requested content cannot be loaded. <br/> Please try again later.",
                PLAY_START: "Start slideshow",
                PLAY_STOP: "Pause slideshow",
                FULL_SCREEN: "Full screen",
                THUMBS: "Thumbnails",
                DOWNLOAD: "Download",
                SHARE: "Share",
                ZOOM: "Zoom"
            },
            de: {
                CLOSE: "Schlie&szlig;en",
                NEXT: "Weiter",
                PREV: "Zur&uuml;ck",
                ERROR: "Die angeforderten Daten konnten nicht geladen werden. <br/> Bitte versuchen Sie es sp&auml;ter nochmal.",
                PLAY_START: "Diaschau starten",
                PLAY_STOP: "Diaschau beenden",
                FULL_SCREEN: "Vollbild",
                THUMBS: "Vorschaubilder",
                DOWNLOAD: "Herunterladen",
                SHARE: "Teilen",
                ZOOM: "Vergr&ouml;&szlig;ern"
            }
        }
    };
    var $W = $(window);
    var $D = $(document);
    var called = 0;
    var isQuery = function(obj) {
        return obj && obj.hasOwnProperty && obj instanceof $;
    };
    var requestAFrame = function() {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || function(callback) {
            return window.setTimeout(callback, 1e3 / 60);
        };
    }();
    var cancelAFrame = function() {
        return window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.oCancelAnimationFrame || function(id) {
            window.clearTimeout(id);
        };
    }();
    var transitionEnd = function() {
        var el = document.createElement("fakeelement"), t;
        var transitions = {
            transition: "transitionend",
            OTransition: "oTransitionEnd",
            MozTransition: "transitionend",
            WebkitTransition: "webkitTransitionEnd"
        };
        for (t in transitions) {
            if (el.style[t] !== undefined) {
                return transitions[t];
            }
        }
        return "transitionend";
    }();
    var forceRedraw = function($el) {
        return $el && $el.length && $el[0].offsetHeight;
    };
    var mergeOpts = function(opts1, opts2) {
        var rez = $.extend(true, {}, opts1, opts2);
        $.each(opts2, function(key, value) {
            if ($.isArray(value)) {
                rez[key] = value;
            }
        });
        return rez;
    };
    var inViewport = function(elem) {
        var elemCenter, rez;
        if (!elem || elem.ownerDocument !== document) {
            return false;
        }
        $(".fancybox-container").css("pointer-events", "none");
        elemCenter = {
            x: elem.getBoundingClientRect().left + elem.offsetWidth / 2,
            y: elem.getBoundingClientRect().top + elem.offsetHeight / 2
        };
        rez = document.elementFromPoint(elemCenter.x, elemCenter.y) === elem;
        $(".fancybox-container").css("pointer-events", "");
        return rez;
    };
    var FancyBox = function(content, opts, index) {
        var self = this;
        self.opts = mergeOpts({
            index: index
        }, $.fancybox.defaults);
        if ($.isPlainObject(opts)) {
            self.opts = mergeOpts(self.opts, opts);
        }
        if ($.fancybox.isMobile) {
            self.opts = mergeOpts(self.opts, self.opts.mobile);
        }
        self.id = self.opts.id || ++called;
        self.currIndex = parseInt(self.opts.index, 10) || 0;
        self.prevIndex = null;
        self.prevPos = null;
        self.currPos = 0;
        self.firstRun = true;
        self.group = [];
        self.slides = {};
        self.addContent(content);
        if (!self.group.length) {
            return;
        }
        self.init();
    };
    $.extend(FancyBox.prototype, {
        init: function() {
            var self = this, firstItem = self.group[self.currIndex], firstItemOpts = firstItem.opts, $container, buttonStr;
            if (firstItemOpts.closeExisting) {
                $.fancybox.close(true);
            }
            $("body").addClass("fancybox-active");
            if (!$.fancybox.getInstance() && firstItemOpts.hideScrollbar !== false && !$.fancybox.isMobile && document.body.scrollHeight > window.innerHeight) {
                $("head").append('<style id="fancybox-style-noscroll" type="text/css">.compensate-for-scrollbar{margin-right:' + (window.innerWidth - document.documentElement.clientWidth) + "px;}</style>");
                $("body").addClass("compensate-for-scrollbar");
            }
            buttonStr = "";
            $.each(firstItemOpts.buttons, function(index, value) {
                buttonStr += firstItemOpts.btnTpl[value] || "";
            });
            $container = $(self.translate(self, firstItemOpts.baseTpl.replace("{{buttons}}", buttonStr).replace("{{arrows}}", firstItemOpts.btnTpl.arrowLeft + firstItemOpts.btnTpl.arrowRight))).attr("id", "fancybox-container-" + self.id).addClass(firstItemOpts.baseClass).data("FancyBox", self).appendTo(firstItemOpts.parentEl);
            self.$refs = {
                container: $container
            };
            [ "bg", "inner", "infobar", "toolbar", "stage", "caption", "navigation" ].forEach(function(item) {
                self.$refs[item] = $container.find(".fancybox-" + item);
            });
            self.trigger("onInit");
            self.activate();
            self.jumpTo(self.currIndex);
        },
        translate: function(obj, str) {
            var arr = obj.opts.i18n[obj.opts.lang] || obj.opts.i18n.en;
            return str.replace(/\{\{(\w+)\}\}/g, function(match, n) {
                return arr[n] === undefined ? match : arr[n];
            });
        },
        addContent: function(content) {
            var self = this, items = $.makeArray(content), thumbs;
            $.each(items, function(i, item) {
                var obj = {}, opts = {}, $item, type, found, src, srcParts;
                if ($.isPlainObject(item)) {
                    obj = item;
                    opts = item.opts || item;
                } else if ($.type(item) === "object" && $(item).length) {
                    $item = $(item);
                    opts = $item.data() || {};
                    opts = $.extend(true, {}, opts, opts.options);
                    opts.$orig = $item;
                    obj.src = self.opts.src || opts.src || $item.attr("href");
                    if (!obj.type && !obj.src) {
                        obj.type = "inline";
                        obj.src = item;
                    }
                } else {
                    obj = {
                        type: "html",
                        src: item + ""
                    };
                }
                obj.opts = $.extend(true, {}, self.opts, opts);
                if ($.isArray(opts.buttons)) {
                    obj.opts.buttons = opts.buttons;
                }
                if ($.fancybox.isMobile && obj.opts.mobile) {
                    obj.opts = mergeOpts(obj.opts, obj.opts.mobile);
                }
                type = obj.type || obj.opts.type;
                src = obj.src || "";
                if (!type && src) {
                    if (found = src.match(/\.(mp4|mov|ogv|webm)((\?|#).*)?$/i)) {
                        type = "video";
                        if (!obj.opts.video.format) {
                            obj.opts.video.format = "video/" + (found[1] === "ogv" ? "ogg" : found[1]);
                        }
                    } else if (src.match(/(^data:image\/[a-z0-9+\/=]*,)|(\.(jp(e|g|eg)|gif|png|bmp|webp|svg|ico)((\?|#).*)?$)/i)) {
                        type = "image";
                    } else if (src.match(/\.(pdf)((\?|#).*)?$/i)) {
                        type = "iframe";
                        obj = $.extend(true, obj, {
                            contentType: "pdf",
                            opts: {
                                iframe: {
                                    preload: false
                                }
                            }
                        });
                    } else if (src.charAt(0) === "#") {
                        type = "inline";
                    }
                }
                if (type) {
                    obj.type = type;
                } else {
                    self.trigger("objectNeedsType", obj);
                }
                if (!obj.contentType) {
                    obj.contentType = $.inArray(obj.type, [ "html", "inline", "ajax" ]) > -1 ? "html" : obj.type;
                }
                obj.index = self.group.length;
                if (obj.opts.smallBtn == "auto") {
                    obj.opts.smallBtn = $.inArray(obj.type, [ "html", "inline", "ajax" ]) > -1;
                }
                if (obj.opts.toolbar === "auto") {
                    obj.opts.toolbar = !obj.opts.smallBtn;
                }
                obj.$thumb = obj.opts.$thumb || null;
                if (obj.opts.$trigger && obj.index === self.opts.index) {
                    obj.$thumb = obj.opts.$trigger.find("img:first");
                    if (obj.$thumb.length) {
                        obj.opts.$orig = obj.opts.$trigger;
                    }
                }
                if (!(obj.$thumb && obj.$thumb.length) && obj.opts.$orig) {
                    obj.$thumb = obj.opts.$orig.find("img:first");
                }
                if (obj.$thumb && !obj.$thumb.length) {
                    obj.$thumb = null;
                }
                obj.thumb = obj.opts.thumb || (obj.$thumb ? obj.$thumb[0].src : null);
                if ($.type(obj.opts.caption) === "function") {
                    obj.opts.caption = obj.opts.caption.apply(item, [ self, obj ]);
                }
                if ($.type(self.opts.caption) === "function") {
                    obj.opts.caption = self.opts.caption.apply(item, [ self, obj ]);
                }
                if (!(obj.opts.caption instanceof $)) {
                    obj.opts.caption = obj.opts.caption === undefined ? "" : obj.opts.caption + "";
                }
                if (obj.type === "ajax") {
                    srcParts = src.split(/\s+/, 2);
                    if (srcParts.length > 1) {
                        obj.src = srcParts.shift();
                        obj.opts.filter = srcParts.shift();
                    }
                }
                if (obj.opts.modal) {
                    obj.opts = $.extend(true, obj.opts, {
                        trapFocus: true,
                        infobar: 0,
                        toolbar: 0,
                        smallBtn: 0,
                        keyboard: 0,
                        slideShow: 0,
                        fullScreen: 0,
                        thumbs: 0,
                        touch: 0,
                        clickContent: false,
                        clickSlide: false,
                        clickOutside: false,
                        dblclickContent: false,
                        dblclickSlide: false,
                        dblclickOutside: false
                    });
                }
                self.group.push(obj);
            });
            if (Object.keys(self.slides).length) {
                self.updateControls();
                thumbs = self.Thumbs;
                if (thumbs && thumbs.isActive) {
                    thumbs.create();
                    thumbs.focus();
                }
            }
        },
        addEvents: function() {
            var self = this;
            self.removeEvents();
            self.$refs.container.on("click.fb-close", "[data-fancybox-close]", function(e) {
                e.stopPropagation();
                e.preventDefault();
                self.close(e);
            }).on("touchstart.fb-prev click.fb-prev", "[data-fancybox-prev]", function(e) {
                e.stopPropagation();
                e.preventDefault();
                self.previous();
            }).on("touchstart.fb-next click.fb-next", "[data-fancybox-next]", function(e) {
                e.stopPropagation();
                e.preventDefault();
                self.next();
            }).on("click.fb", "[data-fancybox-zoom]", function(e) {
                self[self.isScaledDown() ? "scaleToActual" : "scaleToFit"]();
            });
            $W.on("orientationchange.fb resize.fb", function(e) {
                if (e && e.originalEvent && e.originalEvent.type === "resize") {
                    if (self.requestId) {
                        cancelAFrame(self.requestId);
                    }
                    self.requestId = requestAFrame(function() {
                        self.update(e);
                    });
                } else {
                    if (self.current && self.current.type === "iframe") {
                        self.$refs.stage.hide();
                    }
                    setTimeout(function() {
                        self.$refs.stage.show();
                        self.update(e);
                    }, $.fancybox.isMobile ? 600 : 250);
                }
            });
            $D.on("keydown.fb", function(e) {
                var instance = $.fancybox ? $.fancybox.getInstance() : null, current = instance.current, keycode = e.keyCode || e.which;
                if (keycode == 9) {
                    if (current.opts.trapFocus) {
                        self.focus(e);
                    }
                    return;
                }
                if (!current.opts.keyboard || e.ctrlKey || e.altKey || e.shiftKey || $(e.target).is("input,textarea,video,audio")) {
                    return;
                }
                if (keycode === 8 || keycode === 27) {
                    e.preventDefault();
                    self.close(e);
                    return;
                }
                if (keycode === 37 || keycode === 38) {
                    e.preventDefault();
                    self.previous();
                    return;
                }
                if (keycode === 39 || keycode === 40) {
                    e.preventDefault();
                    self.next();
                    return;
                }
                self.trigger("afterKeydown", e, keycode);
            });
            if (self.group[self.currIndex].opts.idleTime) {
                self.idleSecondsCounter = 0;
                $D.on("mousemove.fb-idle mouseleave.fb-idle mousedown.fb-idle touchstart.fb-idle touchmove.fb-idle scroll.fb-idle keydown.fb-idle", function(e) {
                    self.idleSecondsCounter = 0;
                    if (self.isIdle) {
                        self.showControls();
                    }
                    self.isIdle = false;
                });
                self.idleInterval = window.setInterval(function() {
                    self.idleSecondsCounter++;
                    if (self.idleSecondsCounter >= self.group[self.currIndex].opts.idleTime && !self.isDragging) {
                        self.isIdle = true;
                        self.idleSecondsCounter = 0;
                        self.hideControls();
                    }
                }, 1e3);
            }
        },
        removeEvents: function() {
            var self = this;
            $W.off("orientationchange.fb resize.fb");
            $D.off("keydown.fb .fb-idle");
            this.$refs.container.off(".fb-close .fb-prev .fb-next");
            if (self.idleInterval) {
                window.clearInterval(self.idleInterval);
                self.idleInterval = null;
            }
        },
        previous: function(duration) {
            return this.jumpTo(this.currPos - 1, duration);
        },
        next: function(duration) {
            return this.jumpTo(this.currPos + 1, duration);
        },
        jumpTo: function(pos, duration) {
            var self = this, groupLen = self.group.length, firstRun, isMoved, loop, current, previous, slidePos, stagePos, prop, diff;
            if (self.isDragging || self.isClosing || self.isAnimating && self.firstRun) {
                return;
            }
            pos = parseInt(pos, 10);
            loop = self.current ? self.current.opts.loop : self.opts.loop;
            if (!loop && (pos < 0 || pos >= groupLen)) {
                return false;
            }
            firstRun = self.firstRun = !Object.keys(self.slides).length;
            previous = self.current;
            self.prevIndex = self.currIndex;
            self.prevPos = self.currPos;
            current = self.createSlide(pos);
            if (groupLen > 1) {
                if (loop || current.index < groupLen - 1) {
                    self.createSlide(pos + 1);
                }
                if (loop || current.index > 0) {
                    self.createSlide(pos - 1);
                }
            }
            self.current = current;
            self.currIndex = current.index;
            self.currPos = current.pos;
            self.trigger("beforeShow", firstRun);
            self.updateControls();
            current.forcedDuration = undefined;
            if ($.isNumeric(duration)) {
                current.forcedDuration = duration;
            } else {
                duration = current.opts[firstRun ? "animationDuration" : "transitionDuration"];
            }
            duration = parseInt(duration, 10);
            isMoved = self.isMoved(current);
            current.$slide.addClass("fancybox-slide--current");
            if (firstRun) {
                if (current.opts.animationEffect && duration) {
                    self.$refs.container.css("transition-duration", duration + "ms");
                }
                self.$refs.container.addClass("fancybox-is-open").trigger("focus");
                self.loadSlide(current);
                self.preload("image");
                return;
            }
            slidePos = $.fancybox.getTranslate(previous.$slide);
            stagePos = $.fancybox.getTranslate(self.$refs.stage);
            $.each(self.slides, function(index, slide) {
                $.fancybox.stop(slide.$slide, true);
            });
            if (previous.pos !== current.pos) {
                previous.isComplete = false;
            }
            previous.$slide.removeClass("fancybox-slide--complete fancybox-slide--current");
            if (isMoved) {
                diff = slidePos.left - (previous.pos * slidePos.width + previous.pos * previous.opts.gutter);
                $.each(self.slides, function(index, slide) {
                    slide.$slide.removeClass("fancybox-animated").removeClass(function(index, className) {
                        return (className.match(/(^|\s)fancybox-fx-\S+/g) || []).join(" ");
                    });
                    var leftPos = slide.pos * slidePos.width + slide.pos * slide.opts.gutter;
                    $.fancybox.setTranslate(slide.$slide, {
                        top: 0,
                        left: leftPos - stagePos.left + diff
                    });
                    if (slide.pos !== current.pos) {
                        slide.$slide.addClass("fancybox-slide--" + (slide.pos > current.pos ? "next" : "previous"));
                    }
                    forceRedraw(slide.$slide);
                    $.fancybox.animate(slide.$slide, {
                        top: 0,
                        left: (slide.pos - current.pos) * slidePos.width + (slide.pos - current.pos) * slide.opts.gutter
                    }, duration, function() {
                        slide.$slide.css({
                            transform: "",
                            opacity: ""
                        }).removeClass("fancybox-slide--next fancybox-slide--previous");
                        if (slide.pos === self.currPos) {
                            self.complete();
                        }
                    });
                });
            } else if (duration && current.opts.transitionEffect) {
                prop = "fancybox-animated fancybox-fx-" + current.opts.transitionEffect;
                previous.$slide.addClass("fancybox-slide--" + (previous.pos > current.pos ? "next" : "previous"));
                $.fancybox.animate(previous.$slide, prop, duration, function() {
                    previous.$slide.removeClass(prop).removeClass("fancybox-slide--next fancybox-slide--previous");
                }, false);
            }
            if (current.isLoaded) {
                self.revealContent(current);
            } else {
                self.loadSlide(current);
            }
            self.preload("image");
        },
        createSlide: function(pos) {
            var self = this, $slide, index;
            index = pos % self.group.length;
            index = index < 0 ? self.group.length + index : index;
            if (!self.slides[pos] && self.group[index]) {
                $slide = $('<div class="fancybox-slide"></div>').appendTo(self.$refs.stage);
                self.slides[pos] = $.extend(true, {}, self.group[index], {
                    pos: pos,
                    $slide: $slide,
                    isLoaded: false
                });
                self.updateSlide(self.slides[pos]);
            }
            return self.slides[pos];
        },
        scaleToActual: function(x, y, duration) {
            var self = this, current = self.current, $content = current.$content, canvasWidth = $.fancybox.getTranslate(current.$slide).width, canvasHeight = $.fancybox.getTranslate(current.$slide).height, newImgWidth = current.width, newImgHeight = current.height, imgPos, posX, posY, scaleX, scaleY;
            if (self.isAnimating || self.isMoved() || !$content || !(current.type == "image" && current.isLoaded && !current.hasError)) {
                return;
            }
            self.isAnimating = true;
            $.fancybox.stop($content);
            x = x === undefined ? canvasWidth * .5 : x;
            y = y === undefined ? canvasHeight * .5 : y;
            imgPos = $.fancybox.getTranslate($content);
            imgPos.top -= $.fancybox.getTranslate(current.$slide).top;
            imgPos.left -= $.fancybox.getTranslate(current.$slide).left;
            scaleX = newImgWidth / imgPos.width;
            scaleY = newImgHeight / imgPos.height;
            posX = canvasWidth * .5 - newImgWidth * .5;
            posY = canvasHeight * .5 - newImgHeight * .5;
            if (newImgWidth > canvasWidth) {
                posX = imgPos.left * scaleX - (x * scaleX - x);
                if (posX > 0) {
                    posX = 0;
                }
                if (posX < canvasWidth - newImgWidth) {
                    posX = canvasWidth - newImgWidth;
                }
            }
            if (newImgHeight > canvasHeight) {
                posY = imgPos.top * scaleY - (y * scaleY - y);
                if (posY > 0) {
                    posY = 0;
                }
                if (posY < canvasHeight - newImgHeight) {
                    posY = canvasHeight - newImgHeight;
                }
            }
            self.updateCursor(newImgWidth, newImgHeight);
            $.fancybox.animate($content, {
                top: posY,
                left: posX,
                scaleX: scaleX,
                scaleY: scaleY
            }, duration || 366, function() {
                self.isAnimating = false;
            });
            if (self.SlideShow && self.SlideShow.isActive) {
                self.SlideShow.stop();
            }
        },
        scaleToFit: function(duration) {
            var self = this, current = self.current, $content = current.$content, end;
            if (self.isAnimating || self.isMoved() || !$content || !(current.type == "image" && current.isLoaded && !current.hasError)) {
                return;
            }
            self.isAnimating = true;
            $.fancybox.stop($content);
            end = self.getFitPos(current);
            self.updateCursor(end.width, end.height);
            $.fancybox.animate($content, {
                top: end.top,
                left: end.left,
                scaleX: end.width / $content.width(),
                scaleY: end.height / $content.height()
            }, duration || 366, function() {
                self.isAnimating = false;
            });
        },
        getFitPos: function(slide) {
            var self = this, $content = slide.$content, $slide = slide.$slide, width = slide.width || slide.opts.width, height = slide.height || slide.opts.height, maxWidth, maxHeight, minRatio, aspectRatio, rez = {};
            if (!slide.isLoaded || !$content || !$content.length) {
                return false;
            }
            maxWidth = $.fancybox.getTranslate(self.$refs.stage).width;
            maxHeight = $.fancybox.getTranslate(self.$refs.stage).height;
            maxWidth -= parseFloat($slide.css("paddingLeft")) + parseFloat($slide.css("paddingRight")) + parseFloat($content.css("marginLeft")) + parseFloat($content.css("marginRight"));
            maxHeight -= parseFloat($slide.css("paddingTop")) + parseFloat($slide.css("paddingBottom")) + parseFloat($content.css("marginTop")) + parseFloat($content.css("marginBottom"));
            if (!width || !height) {
                width = maxWidth;
                height = maxHeight;
            }
            minRatio = Math.min(1, maxWidth / width, maxHeight / height);
            width = minRatio * width;
            height = minRatio * height;
            if (width > maxWidth - .5) {
                width = maxWidth;
            }
            if (height > maxHeight - .5) {
                height = maxHeight;
            }
            if (slide.type === "image") {
                rez.top = Math.floor((maxHeight - height) * .5) + parseFloat($slide.css("paddingTop"));
                rez.left = Math.floor((maxWidth - width) * .5) + parseFloat($slide.css("paddingLeft"));
            } else if (slide.contentType === "video") {
                aspectRatio = slide.opts.width && slide.opts.height ? width / height : slide.opts.ratio || 16 / 9;
                if (height > width / aspectRatio) {
                    height = width / aspectRatio;
                } else if (width > height * aspectRatio) {
                    width = height * aspectRatio;
                }
            }
            rez.width = width;
            rez.height = height;
            return rez;
        },
        update: function(e) {
            var self = this;
            $.each(self.slides, function(key, slide) {
                self.updateSlide(slide, e);
            });
        },
        updateSlide: function(slide, e) {
            var self = this, $content = slide && slide.$content, width = slide.width || slide.opts.width, height = slide.height || slide.opts.height, $slide = slide.$slide;
            self.adjustCaption(slide);
            if ($content && (width || height || slide.contentType === "video") && !slide.hasError) {
                $.fancybox.stop($content);
                $.fancybox.setTranslate($content, self.getFitPos(slide));
                if (slide.pos === self.currPos) {
                    self.isAnimating = false;
                    self.updateCursor();
                }
            }
            self.adjustLayout(slide);
            if ($slide.length) {
                $slide.trigger("refresh");
                if (slide.pos === self.currPos) {
                    self.$refs.toolbar.add(self.$refs.navigation.find(".fancybox-button--arrow_right")).toggleClass("compensate-for-scrollbar", $slide.get(0).scrollHeight > $slide.get(0).clientHeight);
                }
            }
            self.trigger("onUpdate", slide, e);
        },
        centerSlide: function(duration) {
            var self = this, current = self.current, $slide = current.$slide;
            if (self.isClosing || !current) {
                return;
            }
            $slide.siblings().css({
                transform: "",
                opacity: ""
            });
            $slide.parent().children().removeClass("fancybox-slide--previous fancybox-slide--next");
            $.fancybox.animate($slide, {
                top: 0,
                left: 0,
                opacity: 1
            }, duration === undefined ? 0 : duration, function() {
                $slide.css({
                    transform: "",
                    opacity: ""
                });
                if (!current.isComplete) {
                    self.complete();
                }
            }, false);
        },
        isMoved: function(slide) {
            var current = slide || this.current, slidePos, stagePos;
            if (!current) {
                return false;
            }
            stagePos = $.fancybox.getTranslate(this.$refs.stage);
            slidePos = $.fancybox.getTranslate(current.$slide);
            return !current.$slide.hasClass("fancybox-animated") && (Math.abs(slidePos.top - stagePos.top) > .5 || Math.abs(slidePos.left - stagePos.left) > .5);
        },
        updateCursor: function(nextWidth, nextHeight) {
            var self = this, current = self.current, $container = self.$refs.container, canPan, isZoomable;
            if (!current || self.isClosing || !self.Guestures) {
                return;
            }
            $container.removeClass("fancybox-is-zoomable fancybox-can-zoomIn fancybox-can-zoomOut fancybox-can-swipe fancybox-can-pan");
            canPan = self.canPan(nextWidth, nextHeight);
            isZoomable = canPan ? true : self.isZoomable();
            $container.toggleClass("fancybox-is-zoomable", isZoomable);
            $("[data-fancybox-zoom]").prop("disabled", !isZoomable);
            if (canPan) {
                $container.addClass("fancybox-can-pan");
            } else if (isZoomable && (current.opts.clickContent === "zoom" || $.isFunction(current.opts.clickContent) && current.opts.clickContent(current) == "zoom")) {
                $container.addClass("fancybox-can-zoomIn");
            } else if (current.opts.touch && (current.opts.touch.vertical || self.group.length > 1) && current.contentType !== "video") {
                $container.addClass("fancybox-can-swipe");
            }
        },
        isZoomable: function() {
            var self = this, current = self.current, fitPos;
            if (current && !self.isClosing && current.type === "image" && !current.hasError) {
                if (!current.isLoaded) {
                    return true;
                }
                fitPos = self.getFitPos(current);
                if (fitPos && (current.width > fitPos.width || current.height > fitPos.height)) {
                    return true;
                }
            }
            return false;
        },
        isScaledDown: function(nextWidth, nextHeight) {
            var self = this, rez = false, current = self.current, $content = current.$content;
            if (nextWidth !== undefined && nextHeight !== undefined) {
                rez = nextWidth < current.width && nextHeight < current.height;
            } else if ($content) {
                rez = $.fancybox.getTranslate($content);
                rez = rez.width < current.width && rez.height < current.height;
            }
            return rez;
        },
        canPan: function(nextWidth, nextHeight) {
            var self = this, current = self.current, pos = null, rez = false;
            if (current.type === "image" && (current.isComplete || nextWidth && nextHeight) && !current.hasError) {
                rez = self.getFitPos(current);
                if (nextWidth !== undefined && nextHeight !== undefined) {
                    pos = {
                        width: nextWidth,
                        height: nextHeight
                    };
                } else if (current.isComplete) {
                    pos = $.fancybox.getTranslate(current.$content);
                }
                if (pos && rez) {
                    rez = Math.abs(pos.width - rez.width) > 1.5 || Math.abs(pos.height - rez.height) > 1.5;
                }
            }
            return rez;
        },
        loadSlide: function(slide) {
            var self = this, type, $slide, ajaxLoad;
            if (slide.isLoading || slide.isLoaded) {
                return;
            }
            slide.isLoading = true;
            if (self.trigger("beforeLoad", slide) === false) {
                slide.isLoading = false;
                return false;
            }
            type = slide.type;
            $slide = slide.$slide;
            $slide.off("refresh").trigger("onReset").addClass(slide.opts.slideClass);
            switch (type) {
              case "image":
                self.setImage(slide);
                break;

              case "iframe":
                self.setIframe(slide);
                break;

              case "html":
                self.setContent(slide, slide.src || slide.content);
                break;

              case "video":
                self.setContent(slide, slide.opts.video.tpl.replace(/\{\{src\}\}/gi, slide.src).replace("{{format}}", slide.opts.videoFormat || slide.opts.video.format || "").replace("{{poster}}", slide.thumb || ""));
                break;

              case "inline":
                if ($(slide.src).length) {
                    self.setContent(slide, $(slide.src));
                } else {
                    self.setError(slide);
                }
                break;

              case "ajax":
                self.showLoading(slide);
                ajaxLoad = $.ajax($.extend({}, slide.opts.ajax.settings, {
                    url: slide.src,
                    success: function(data, textStatus) {
                        if (textStatus === "success") {
                            self.setContent(slide, data);
                        }
                    },
                    error: function(jqXHR, textStatus) {
                        if (jqXHR && textStatus !== "abort") {
                            self.setError(slide);
                        }
                    }
                }));
                $slide.one("onReset", function() {
                    ajaxLoad.abort();
                });
                break;

              default:
                self.setError(slide);
                break;
            }
            return true;
        },
        setImage: function(slide) {
            var self = this, ghost;
            setTimeout(function() {
                var $img = slide.$image;
                if (!self.isClosing && slide.isLoading && (!$img || !$img.length || !$img[0].complete) && !slide.hasError) {
                    self.showLoading(slide);
                }
            }, 50);
            self.checkSrcset(slide);
            slide.$content = $('<div class="fancybox-content"></div>').addClass("fancybox-is-hidden").appendTo(slide.$slide.addClass("fancybox-slide--image"));
            if (slide.opts.preload !== false && slide.opts.width && slide.opts.height && slide.thumb) {
                slide.width = slide.opts.width;
                slide.height = slide.opts.height;
                ghost = document.createElement("img");
                ghost.onerror = function() {
                    $(this).remove();
                    slide.$ghost = null;
                };
                ghost.onload = function() {
                    self.afterLoad(slide);
                };
                slide.$ghost = $(ghost).addClass("fancybox-image").appendTo(slide.$content).attr("src", slide.thumb);
            }
            self.setBigImage(slide);
        },
        checkSrcset: function(slide) {
            var srcset = slide.opts.srcset || slide.opts.image.srcset, found, temp, pxRatio, windowWidth;
            if (srcset) {
                pxRatio = window.devicePixelRatio || 1;
                windowWidth = window.innerWidth * pxRatio;
                temp = srcset.split(",").map(function(el) {
                    var ret = {};
                    el.trim().split(/\s+/).forEach(function(el, i) {
                        var value = parseInt(el.substring(0, el.length - 1), 10);
                        if (i === 0) {
                            return ret.url = el;
                        }
                        if (value) {
                            ret.value = value;
                            ret.postfix = el[el.length - 1];
                        }
                    });
                    return ret;
                });
                temp.sort(function(a, b) {
                    return a.value - b.value;
                });
                for (var j = 0; j < temp.length; j++) {
                    var el = temp[j];
                    if (el.postfix === "w" && el.value >= windowWidth || el.postfix === "x" && el.value >= pxRatio) {
                        found = el;
                        break;
                    }
                }
                if (!found && temp.length) {
                    found = temp[temp.length - 1];
                }
                if (found) {
                    slide.src = found.url;
                    if (slide.width && slide.height && found.postfix == "w") {
                        slide.height = slide.width / slide.height * found.value;
                        slide.width = found.value;
                    }
                    slide.opts.srcset = srcset;
                }
            }
        },
        setBigImage: function(slide) {
            var self = this, img = document.createElement("img"), $img = $(img);
            slide.$image = $img.one("error", function() {
                self.setError(slide);
            }).one("load", function() {
                var sizes;
                if (!slide.$ghost) {
                    self.resolveImageSlideSize(slide, this.naturalWidth, this.naturalHeight);
                    self.afterLoad(slide);
                }
                if (self.isClosing) {
                    return;
                }
                if (slide.opts.srcset) {
                    sizes = slide.opts.sizes;
                    if (!sizes || sizes === "auto") {
                        sizes = (slide.width / slide.height > 1 && $W.width() / $W.height() > 1 ? "100" : Math.round(slide.width / slide.height * 100)) + "vw";
                    }
                    $img.attr("sizes", sizes).attr("srcset", slide.opts.srcset);
                }
                if (slide.$ghost) {
                    setTimeout(function() {
                        if (slide.$ghost && !self.isClosing) {
                            slide.$ghost.hide();
                        }
                    }, Math.min(300, Math.max(1e3, slide.height / 1600)));
                }
                self.hideLoading(slide);
            }).addClass("fancybox-image").attr("src", slide.src).appendTo(slide.$content);
            if ((img.complete || img.readyState == "complete") && $img.naturalWidth && $img.naturalHeight) {
                $img.trigger("load");
            } else if (img.error) {
                $img.trigger("error");
            }
        },
        resolveImageSlideSize: function(slide, imgWidth, imgHeight) {
            var maxWidth = parseInt(slide.opts.width, 10), maxHeight = parseInt(slide.opts.height, 10);
            slide.width = imgWidth;
            slide.height = imgHeight;
            if (maxWidth > 0) {
                slide.width = maxWidth;
                slide.height = Math.floor(maxWidth * imgHeight / imgWidth);
            }
            if (maxHeight > 0) {
                slide.width = Math.floor(maxHeight * imgWidth / imgHeight);
                slide.height = maxHeight;
            }
        },
        setIframe: function(slide) {
            var self = this, opts = slide.opts.iframe, $slide = slide.$slide, $iframe;
            slide.$content = $('<div class="fancybox-content' + (opts.preload ? " fancybox-is-hidden" : "") + '"></div>').css(opts.css).appendTo($slide);
            $slide.addClass("fancybox-slide--" + slide.contentType);
            slide.$iframe = $iframe = $(opts.tpl.replace(/\{rnd\}/g, new Date().getTime())).attr(opts.attr).appendTo(slide.$content);
            if (opts.preload) {
                self.showLoading(slide);
                $iframe.on("load.fb error.fb", function(e) {
                    this.isReady = 1;
                    slide.$slide.trigger("refresh");
                    self.afterLoad(slide);
                });
                $slide.on("refresh.fb", function() {
                    var $content = slide.$content, frameWidth = opts.css.width, frameHeight = opts.css.height, $contents, $body;
                    if ($iframe[0].isReady !== 1) {
                        return;
                    }
                    try {
                        $contents = $iframe.contents();
                        $body = $contents.find("body");
                    } catch (ignore) {}
                    if ($body && $body.length && $body.children().length) {
                        $slide.css("overflow", "visible");
                        $content.css({
                            width: "100%",
                            "max-width": "100%",
                            height: "9999px"
                        });
                        if (frameWidth === undefined) {
                            frameWidth = Math.ceil(Math.max($body[0].clientWidth, $body.outerWidth(true)));
                        }
                        $content.css("width", frameWidth ? frameWidth : "").css("max-width", "");
                        if (frameHeight === undefined) {
                            frameHeight = Math.ceil(Math.max($body[0].clientHeight, $body.outerHeight(true)));
                        }
                        $content.css("height", frameHeight ? frameHeight : "");
                        $slide.css("overflow", "auto");
                    }
                    $content.removeClass("fancybox-is-hidden");
                });
            } else {
                self.afterLoad(slide);
            }
            $iframe.attr("src", slide.src);
            $slide.one("onReset", function() {
                try {
                    $(this).find("iframe").hide().unbind().attr("src", "//about:blank");
                } catch (ignore) {}
                $(this).off("refresh.fb").empty();
                slide.isLoaded = false;
                slide.isRevealed = false;
            });
        },
        setContent: function(slide, content) {
            var self = this;
            if (self.isClosing) {
                return;
            }
            self.hideLoading(slide);
            if (slide.$content) {
                $.fancybox.stop(slide.$content);
            }
            slide.$slide.empty();
            if (isQuery(content) && content.parent().length) {
                if (content.hasClass("fancybox-content") || content.parent().hasClass("fancybox-content")) {
                    content.parents(".fancybox-slide").trigger("onReset");
                }
                slide.$placeholder = $("<div>").hide().insertAfter(content);
                content.css("display", "inline-block");
            } else if (!slide.hasError) {
                if ($.type(content) === "string") {
                    content = $("<div>").append($.trim(content)).contents();
                }
                if (slide.opts.filter) {
                    content = $("<div>").html(content).find(slide.opts.filter);
                }
            }
            slide.$slide.one("onReset", function() {
                $(this).find("video,audio").trigger("pause");
                if (slide.$placeholder) {
                    slide.$placeholder.after(content.removeClass("fancybox-content").hide()).remove();
                    slide.$placeholder = null;
                }
                if (slide.$smallBtn) {
                    slide.$smallBtn.remove();
                    slide.$smallBtn = null;
                }
                if (!slide.hasError) {
                    $(this).empty();
                    slide.isLoaded = false;
                    slide.isRevealed = false;
                }
            });
            $(content).appendTo(slide.$slide);
            if ($(content).is("video,audio")) {
                $(content).addClass("fancybox-video");
                $(content).wrap("<div></div>");
                slide.contentType = "video";
                slide.opts.width = slide.opts.width || $(content).attr("width");
                slide.opts.height = slide.opts.height || $(content).attr("height");
            }
            slide.$content = slide.$slide.children().filter("div,form,main,video,audio,article,.fancybox-content").first();
            slide.$content.siblings().hide();
            if (!slide.$content.length) {
                slide.$content = slide.$slide.wrapInner("<div></div>").children().first();
            }
            slide.$content.addClass("fancybox-content");
            slide.$slide.addClass("fancybox-slide--" + slide.contentType);
            self.afterLoad(slide);
        },
        setError: function(slide) {
            slide.hasError = true;
            slide.$slide.trigger("onReset").removeClass("fancybox-slide--" + slide.contentType).addClass("fancybox-slide--error");
            slide.contentType = "html";
            this.setContent(slide, this.translate(slide, slide.opts.errorTpl));
            if (slide.pos === this.currPos) {
                this.isAnimating = false;
            }
        },
        showLoading: function(slide) {
            var self = this;
            slide = slide || self.current;
            if (slide && !slide.$spinner) {
                slide.$spinner = $(self.translate(self, self.opts.spinnerTpl)).appendTo(slide.$slide).hide().fadeIn("fast");
            }
        },
        hideLoading: function(slide) {
            var self = this;
            slide = slide || self.current;
            if (slide && slide.$spinner) {
                slide.$spinner.stop().remove();
                delete slide.$spinner;
            }
        },
        afterLoad: function(slide) {
            var self = this;
            if (self.isClosing) {
                return;
            }
            slide.isLoading = false;
            slide.isLoaded = true;
            self.trigger("afterLoad", slide);
            self.hideLoading(slide);
            if (slide.opts.smallBtn && (!slide.$smallBtn || !slide.$smallBtn.length)) {
                slide.$smallBtn = $(self.translate(slide, slide.opts.btnTpl.smallBtn)).appendTo(slide.$content);
            }
            if (slide.opts.protect && slide.$content && !slide.hasError) {
                slide.$content.on("contextmenu.fb", function(e) {
                    if (e.button == 2) {
                        e.preventDefault();
                    }
                    return true;
                });
                if (slide.type === "image") {
                    $('<div class="fancybox-spaceball"></div>').appendTo(slide.$content);
                }
            }
            self.adjustCaption(slide);
            self.adjustLayout(slide);
            if (slide.pos === self.currPos) {
                self.updateCursor();
            }
            self.revealContent(slide);
        },
        adjustCaption: function(slide) {
            var self = this, current = slide || self.current, caption = current.opts.caption, preventOverlap = current.opts.preventCaptionOverlap, $caption = self.$refs.caption, $clone, captionH = false;
            $caption.toggleClass("fancybox-caption--separate", preventOverlap);
            if (preventOverlap && caption && caption.length) {
                if (current.pos !== self.currPos) {
                    $clone = $caption.clone().appendTo($caption.parent());
                    $clone.children().eq(0).empty().html(caption);
                    captionH = $clone.outerHeight(true);
                    $clone.empty().remove();
                } else if (self.$caption) {
                    captionH = self.$caption.outerHeight(true);
                }
                current.$slide.css("padding-bottom", captionH || "");
            }
        },
        adjustLayout: function(slide) {
            var self = this, current = slide || self.current, scrollHeight, marginBottom, inlinePadding, actualPadding;
            if (current.isLoaded && current.opts.disableLayoutFix !== true) {
                current.$content.css("margin-bottom", "");
                if (current.$content.outerHeight() > current.$slide.height() + .5) {
                    inlinePadding = current.$slide[0].style["padding-bottom"];
                    actualPadding = current.$slide.css("padding-bottom");
                    if (parseFloat(actualPadding) > 0) {
                        scrollHeight = current.$slide[0].scrollHeight;
                        current.$slide.css("padding-bottom", 0);
                        if (Math.abs(scrollHeight - current.$slide[0].scrollHeight) < 1) {
                            marginBottom = actualPadding;
                        }
                        current.$slide.css("padding-bottom", inlinePadding);
                    }
                }
                current.$content.css("margin-bottom", marginBottom);
            }
        },
        revealContent: function(slide) {
            var self = this, $slide = slide.$slide, end = false, start = false, isMoved = self.isMoved(slide), isRevealed = slide.isRevealed, effect, effectClassName, duration, opacity;
            slide.isRevealed = true;
            effect = slide.opts[self.firstRun ? "animationEffect" : "transitionEffect"];
            duration = slide.opts[self.firstRun ? "animationDuration" : "transitionDuration"];
            duration = parseInt(slide.forcedDuration === undefined ? duration : slide.forcedDuration, 10);
            if (isMoved || slide.pos !== self.currPos || !duration) {
                effect = false;
            }
            if (effect === "zoom") {
                if (slide.pos === self.currPos && duration && slide.type === "image" && !slide.hasError && (start = self.getThumbPos(slide))) {
                    end = self.getFitPos(slide);
                } else {
                    effect = "fade";
                }
            }
            if (effect === "zoom") {
                self.isAnimating = true;
                end.scaleX = end.width / start.width;
                end.scaleY = end.height / start.height;
                opacity = slide.opts.zoomOpacity;
                if (opacity == "auto") {
                    opacity = Math.abs(slide.width / slide.height - start.width / start.height) > .1;
                }
                if (opacity) {
                    start.opacity = .1;
                    end.opacity = 1;
                }
                $.fancybox.setTranslate(slide.$content.removeClass("fancybox-is-hidden"), start);
                forceRedraw(slide.$content);
                $.fancybox.animate(slide.$content, end, duration, function() {
                    self.isAnimating = false;
                    self.complete();
                });
                return;
            }
            self.updateSlide(slide);
            if (!effect) {
                slide.$content.removeClass("fancybox-is-hidden");
                if (!isRevealed && isMoved && slide.type === "image" && !slide.hasError) {
                    slide.$content.hide().fadeIn("fast");
                }
                if (slide.pos === self.currPos) {
                    self.complete();
                }
                return;
            }
            $.fancybox.stop($slide);
            effectClassName = "fancybox-slide--" + (slide.pos >= self.prevPos ? "next" : "previous") + " fancybox-animated fancybox-fx-" + effect;
            $slide.addClass(effectClassName).removeClass("fancybox-slide--current");
            slide.$content.removeClass("fancybox-is-hidden");
            forceRedraw($slide);
            if (slide.type !== "image") {
                slide.$content.hide().show(0);
            }
            $.fancybox.animate($slide, "fancybox-slide--current", duration, function() {
                $slide.removeClass(effectClassName).css({
                    transform: "",
                    opacity: ""
                });
                if (slide.pos === self.currPos) {
                    self.complete();
                }
            }, true);
        },
        getThumbPos: function(slide) {
            var rez = false, $thumb = slide.$thumb, thumbPos, btw, brw, bbw, blw;
            if (!$thumb || !inViewport($thumb[0])) {
                return false;
            }
            thumbPos = $.fancybox.getTranslate($thumb);
            btw = parseFloat($thumb.css("border-top-width") || 0);
            brw = parseFloat($thumb.css("border-right-width") || 0);
            bbw = parseFloat($thumb.css("border-bottom-width") || 0);
            blw = parseFloat($thumb.css("border-left-width") || 0);
            rez = {
                top: thumbPos.top + btw,
                left: thumbPos.left + blw,
                width: thumbPos.width - brw - blw,
                height: thumbPos.height - btw - bbw,
                scaleX: 1,
                scaleY: 1
            };
            return thumbPos.width > 0 && thumbPos.height > 0 ? rez : false;
        },
        complete: function() {
            var self = this, current = self.current, slides = {}, $el;
            if (self.isMoved() || !current.isLoaded) {
                return;
            }
            if (!current.isComplete) {
                current.isComplete = true;
                current.$slide.siblings().trigger("onReset");
                self.preload("inline");
                forceRedraw(current.$slide);
                current.$slide.addClass("fancybox-slide--complete");
                $.each(self.slides, function(key, slide) {
                    if (slide.pos >= self.currPos - 1 && slide.pos <= self.currPos + 1) {
                        slides[slide.pos] = slide;
                    } else if (slide) {
                        $.fancybox.stop(slide.$slide);
                        slide.$slide.off().remove();
                    }
                });
                self.slides = slides;
            }
            self.isAnimating = false;
            self.updateCursor();
            self.trigger("afterShow");
            if (!!current.opts.video.autoStart) {
                current.$slide.find("video,audio").filter(":visible:first").trigger("play").one("ended", function() {
                    if (this.webkitExitFullscreen) {
                        this.webkitExitFullscreen();
                    }
                    self.next();
                });
            }
            if (current.opts.autoFocus && current.contentType === "html") {
                $el = current.$content.find("input[autofocus]:enabled:visible:first");
                if ($el.length) {
                    $el.trigger("focus");
                } else {
                    self.focus(null, true);
                }
            }
            current.$slide.scrollTop(0).scrollLeft(0);
        },
        preload: function(type) {
            var self = this, prev, next;
            if (self.group.length < 2) {
                return;
            }
            next = self.slides[self.currPos + 1];
            prev = self.slides[self.currPos - 1];
            if (prev && prev.type === type) {
                self.loadSlide(prev);
            }
            if (next && next.type === type) {
                self.loadSlide(next);
            }
        },
        focus: function(e, firstRun) {
            var self = this, focusableStr = [ "a[href]", "area[href]", 'input:not([disabled]):not([type="hidden"]):not([aria-hidden])', "select:not([disabled]):not([aria-hidden])", "textarea:not([disabled]):not([aria-hidden])", "button:not([disabled]):not([aria-hidden])", "iframe", "object", "embed", "video", "audio", "[contenteditable]", '[tabindex]:not([tabindex^="-"])' ].join(","), focusableItems, focusedItemIndex;
            if (self.isClosing) {
                return;
            }
            if (e || !self.current || !self.current.isComplete) {
                focusableItems = self.$refs.container.find("*:visible");
            } else {
                focusableItems = self.current.$slide.find("*:visible" + (firstRun ? ":not(.fancybox-close-small)" : ""));
            }
            focusableItems = focusableItems.filter(focusableStr).filter(function() {
                return $(this).css("visibility") !== "hidden" && !$(this).hasClass("disabled");
            });
            if (focusableItems.length) {
                focusedItemIndex = focusableItems.index(document.activeElement);
                if (e && e.shiftKey) {
                    if (focusedItemIndex < 0 || focusedItemIndex == 0) {
                        e.preventDefault();
                        focusableItems.eq(focusableItems.length - 1).trigger("focus");
                    }
                } else {
                    if (focusedItemIndex < 0 || focusedItemIndex == focusableItems.length - 1) {
                        if (e) {
                            e.preventDefault();
                        }
                        focusableItems.eq(0).trigger("focus");
                    }
                }
            } else {
                self.$refs.container.trigger("focus");
            }
        },
        activate: function() {
            var self = this;
            $(".fancybox-container").each(function() {
                var instance = $(this).data("FancyBox");
                if (instance && instance.id !== self.id && !instance.isClosing) {
                    instance.trigger("onDeactivate");
                    instance.removeEvents();
                    instance.isVisible = false;
                }
            });
            self.isVisible = true;
            if (self.current || self.isIdle) {
                self.update();
                self.updateControls();
            }
            self.trigger("onActivate");
            self.addEvents();
        },
        close: function(e, d) {
            var self = this, current = self.current, effect, duration, $content, domRect, opacity, start, end;
            var done = function() {
                self.cleanUp(e);
            };
            if (self.isClosing) {
                return false;
            }
            self.isClosing = true;
            if (self.trigger("beforeClose", e) === false) {
                self.isClosing = false;
                requestAFrame(function() {
                    self.update();
                });
                return false;
            }
            self.removeEvents();
            $content = current.$content;
            effect = current.opts.animationEffect;
            duration = $.isNumeric(d) ? d : effect ? current.opts.animationDuration : 0;
            current.$slide.removeClass("fancybox-slide--complete fancybox-slide--next fancybox-slide--previous fancybox-animated");
            if (e !== true) {
                $.fancybox.stop(current.$slide);
            } else {
                effect = false;
            }
            current.$slide.siblings().trigger("onReset").remove();
            if (duration) {
                self.$refs.container.removeClass("fancybox-is-open").addClass("fancybox-is-closing").css("transition-duration", duration + "ms");
            }
            self.hideLoading(current);
            self.hideControls(true);
            self.updateCursor();
            if (effect === "zoom" && !($content && duration && current.type === "image" && !self.isMoved() && !current.hasError && (end = self.getThumbPos(current)))) {
                effect = "fade";
            }
            if (effect === "zoom") {
                $.fancybox.stop($content);
                domRect = $.fancybox.getTranslate($content);
                start = {
                    top: domRect.top,
                    left: domRect.left,
                    scaleX: domRect.width / end.width,
                    scaleY: domRect.height / end.height,
                    width: end.width,
                    height: end.height
                };
                opacity = current.opts.zoomOpacity;
                if (opacity == "auto") {
                    opacity = Math.abs(current.width / current.height - end.width / end.height) > .1;
                }
                if (opacity) {
                    end.opacity = 0;
                }
                $.fancybox.setTranslate($content, start);
                forceRedraw($content);
                $.fancybox.animate($content, end, duration, done);
                return true;
            }
            if (effect && duration) {
                $.fancybox.animate(current.$slide.addClass("fancybox-slide--previous").removeClass("fancybox-slide--current"), "fancybox-animated fancybox-fx-" + effect, duration, done);
            } else {
                if (e === true) {
                    setTimeout(done, duration);
                } else {
                    done();
                }
            }
            return true;
        },
        cleanUp: function(e) {
            var self = this, instance, $focus = self.current.opts.$orig, x, y;
            self.current.$slide.trigger("onReset");
            self.$refs.container.empty().remove();
            self.trigger("afterClose", e);
            if (!!self.current.opts.backFocus) {
                if (!$focus || !$focus.length || !$focus.is(":visible")) {
                    $focus = self.$trigger;
                }
                if ($focus && $focus.length) {
                    x = window.scrollX;
                    y = window.scrollY;
                    $focus.trigger("focus");
                    $("html, body").scrollTop(y).scrollLeft(x);
                }
            }
            self.current = null;
            instance = $.fancybox.getInstance();
            if (instance) {
                instance.activate();
            } else {
                $("body").removeClass("fancybox-active compensate-for-scrollbar");
                $("#fancybox-style-noscroll").remove();
            }
        },
        trigger: function(name, slide) {
            var args = Array.prototype.slice.call(arguments, 1), self = this, obj = slide && slide.opts ? slide : self.current, rez;
            if (obj) {
                args.unshift(obj);
            } else {
                obj = self;
            }
            args.unshift(self);
            if ($.isFunction(obj.opts[name])) {
                rez = obj.opts[name].apply(obj, args);
            }
            if (rez === false) {
                return rez;
            }
            if (name === "afterClose" || !self.$refs) {
                $D.trigger(name + ".fb", args);
            } else {
                self.$refs.container.trigger(name + ".fb", args);
            }
        },
        updateControls: function() {
            var self = this, current = self.current, index = current.index, $container = self.$refs.container, $caption = self.$refs.caption, caption = current.opts.caption;
            current.$slide.trigger("refresh");
            if (caption && caption.length) {
                self.$caption = $caption;
                $caption.children().eq(0).html(caption);
            } else {
                self.$caption = null;
            }
            if (!self.hasHiddenControls && !self.isIdle) {
                self.showControls();
            }
            $container.find("[data-fancybox-count]").html(self.group.length);
            $container.find("[data-fancybox-index]").html(index + 1);
            $container.find("[data-fancybox-prev]").prop("disabled", !current.opts.loop && index <= 0);
            $container.find("[data-fancybox-next]").prop("disabled", !current.opts.loop && index >= self.group.length - 1);
            if (current.type === "image") {
                $container.find("[data-fancybox-zoom]").show().end().find("[data-fancybox-download]").attr("href", current.opts.image.src || current.src).show();
            } else if (current.opts.toolbar) {
                $container.find("[data-fancybox-download],[data-fancybox-zoom]").hide();
            }
            if ($(document.activeElement).is(":hidden,[disabled]")) {
                self.$refs.container.trigger("focus");
            }
        },
        hideControls: function(andCaption) {
            var self = this, arr = [ "infobar", "toolbar", "nav" ];
            if (andCaption || !self.current.opts.preventCaptionOverlap) {
                arr.push("caption");
            }
            this.$refs.container.removeClass(arr.map(function(i) {
                return "fancybox-show-" + i;
            }).join(" "));
            this.hasHiddenControls = true;
        },
        showControls: function() {
            var self = this, opts = self.current ? self.current.opts : self.opts, $container = self.$refs.container;
            self.hasHiddenControls = false;
            self.idleSecondsCounter = 0;
            $container.toggleClass("fancybox-show-toolbar", !!(opts.toolbar && opts.buttons)).toggleClass("fancybox-show-infobar", !!(opts.infobar && self.group.length > 1)).toggleClass("fancybox-show-caption", !!self.$caption).toggleClass("fancybox-show-nav", !!(opts.arrows && self.group.length > 1)).toggleClass("fancybox-is-modal", !!opts.modal);
        },
        toggleControls: function() {
            if (this.hasHiddenControls) {
                this.showControls();
            } else {
                this.hideControls();
            }
        }
    });
    $.fancybox = {
        version: "3.5.6",
        defaults: defaults,
        getInstance: function(command) {
            var instance = $('.fancybox-container:not(".fancybox-is-closing"):last').data("FancyBox"), args = Array.prototype.slice.call(arguments, 1);
            if (instance instanceof FancyBox) {
                if ($.type(command) === "string") {
                    instance[command].apply(instance, args);
                } else if ($.type(command) === "function") {
                    command.apply(instance, args);
                }
                return instance;
            }
            return false;
        },
        open: function(items, opts, index) {
            return new FancyBox(items, opts, index);
        },
        close: function(all) {
            var instance = this.getInstance();
            if (instance) {
                instance.close();
                if (all === true) {
                    this.close(all);
                }
            }
        },
        destroy: function() {
            this.close(true);
            $D.add("body").off("click.fb-start", "**");
        },
        isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
        use3d: function() {
            var div = document.createElement("div");
            return window.getComputedStyle && window.getComputedStyle(div) && window.getComputedStyle(div).getPropertyValue("transform") && !(document.documentMode && document.documentMode < 11);
        }(),
        getTranslate: function($el) {
            var domRect;
            if (!$el || !$el.length) {
                return false;
            }
            domRect = $el[0].getBoundingClientRect();
            return {
                top: domRect.top || 0,
                left: domRect.left || 0,
                width: domRect.width,
                height: domRect.height,
                opacity: parseFloat($el.css("opacity"))
            };
        },
        setTranslate: function($el, props) {
            var str = "", css = {};
            if (!$el || !props) {
                return;
            }
            if (props.left !== undefined || props.top !== undefined) {
                str = (props.left === undefined ? $el.position().left : props.left) + "px, " + (props.top === undefined ? $el.position().top : props.top) + "px";
                if (this.use3d) {
                    str = "translate3d(" + str + ", 0px)";
                } else {
                    str = "translate(" + str + ")";
                }
            }
            if (props.scaleX !== undefined && props.scaleY !== undefined) {
                str += " scale(" + props.scaleX + ", " + props.scaleY + ")";
            } else if (props.scaleX !== undefined) {
                str += " scaleX(" + props.scaleX + ")";
            }
            if (str.length) {
                css.transform = str;
            }
            if (props.opacity !== undefined) {
                css.opacity = props.opacity;
            }
            if (props.width !== undefined) {
                css.width = props.width;
            }
            if (props.height !== undefined) {
                css.height = props.height;
            }
            return $el.css(css);
        },
        animate: function($el, to, duration, callback, leaveAnimationName) {
            var self = this, from;
            if ($.isFunction(duration)) {
                callback = duration;
                duration = null;
            }
            self.stop($el);
            from = self.getTranslate($el);
            $el.on(transitionEnd, function(e) {
                if (e && e.originalEvent && (!$el.is(e.originalEvent.target) || e.originalEvent.propertyName == "z-index")) {
                    return;
                }
                self.stop($el);
                if ($.isNumeric(duration)) {
                    $el.css("transition-duration", "");
                }
                if ($.isPlainObject(to)) {
                    if (to.scaleX !== undefined && to.scaleY !== undefined) {
                        self.setTranslate($el, {
                            top: to.top,
                            left: to.left,
                            width: from.width * to.scaleX,
                            height: from.height * to.scaleY,
                            scaleX: 1,
                            scaleY: 1
                        });
                    }
                } else if (leaveAnimationName !== true) {
                    $el.removeClass(to);
                }
                if ($.isFunction(callback)) {
                    callback(e);
                }
            });
            if ($.isNumeric(duration)) {
                $el.css("transition-duration", duration + "ms");
            }
            if ($.isPlainObject(to)) {
                if (to.scaleX !== undefined && to.scaleY !== undefined) {
                    delete to.width;
                    delete to.height;
                    if ($el.parent().hasClass("fancybox-slide--image")) {
                        $el.parent().addClass("fancybox-is-scaling");
                    }
                }
                $.fancybox.setTranslate($el, to);
            } else {
                $el.addClass(to);
            }
            $el.data("timer", setTimeout(function() {
                $el.trigger(transitionEnd);
            }, duration + 33));
        },
        stop: function($el, callCallback) {
            if ($el && $el.length) {
                clearTimeout($el.data("timer"));
                if (callCallback) {
                    $el.trigger(transitionEnd);
                }
                $el.off(transitionEnd).css("transition-duration", "");
                $el.parent().removeClass("fancybox-is-scaling");
            }
        }
    };
    function _run(e, opts) {
        var items = [], index = 0, $target, value, instance;
        if (e && e.isDefaultPrevented()) {
            return;
        }
        e.preventDefault();
        opts = opts || {};
        if (e && e.data) {
            opts = mergeOpts(e.data.options, opts);
        }
        $target = opts.$target || $(e.currentTarget).trigger("blur");
        instance = $.fancybox.getInstance();
        if (instance && instance.$trigger && instance.$trigger.is($target)) {
            return;
        }
        if (opts.selector) {
            items = $(opts.selector);
        } else {
            value = $target.attr("data-fancybox") || "";
            if (value) {
                items = e.data ? e.data.items : [];
                items = items.length ? items.filter('[data-fancybox="' + value + '"]') : $('[data-fancybox="' + value + '"]');
            } else {
                items = [ $target ];
            }
        }
        index = $(items).index($target);
        if (index < 0) {
            index = 0;
        }
        instance = $.fancybox.open(items, opts, index);
        instance.$trigger = $target;
    }
    $.fn.fancybox = function(options) {
        var selector;
        options = options || {};
        selector = options.selector || false;
        if (selector) {
            $("body").off("click.fb-start", selector).on("click.fb-start", selector, {
                options: options
            }, _run);
        } else {
            this.off("click.fb-start").on("click.fb-start", {
                items: this,
                options: options
            }, _run);
        }
        return this;
    };
    $D.on("click.fb-start", "[data-fancybox]", _run);
    $D.on("click.fb-start", "[data-fancybox-trigger]", function(e) {
        $('[data-fancybox="' + $(this).attr("data-fancybox-trigger") + '"]').eq($(this).attr("data-fancybox-index") || 0).trigger("click.fb-start", {
            $trigger: $(this)
        });
    });
    (function() {
        var buttonStr = ".fancybox-button", focusStr = "fancybox-focus", $pressed = null;
        $D.on("mousedown mouseup focus blur", buttonStr, function(e) {
            switch (e.type) {
              case "mousedown":
                $pressed = $(this);
                break;

              case "mouseup":
                $pressed = null;
                break;

              case "focusin":
                $(buttonStr).removeClass(focusStr);
                if (!$(this).is($pressed) && !$(this).is("[disabled]")) {
                    $(this).addClass(focusStr);
                }
                break;

              case "focusout":
                $(buttonStr).removeClass(focusStr);
                break;
            }
        });
    })();
})(window, document, jQuery);

(function($) {
    "use strict";
    var defaults = {
        youtube: {
            matcher: /(youtube\.com|youtu\.be|youtube\-nocookie\.com)\/(watch\?(.*&)?v=|v\/|u\/|embed\/?)?(videoseries\?list=(.*)|[\w-]{11}|\?listType=(.*)&list=(.*))(.*)/i,
            params: {
                autoplay: 1,
                autohide: 1,
                fs: 1,
                rel: 0,
                hd: 1,
                wmode: "transparent",
                enablejsapi: 1,
                html5: 1
            },
            paramPlace: 8,
            type: "iframe",
            url: "https://www.youtube-nocookie.com/embed/$4",
            thumb: "https://img.youtube.com/vi/$4/hqdefault.jpg"
        },
        vimeo: {
            matcher: /^.+vimeo.com\/(.*\/)?([\d]+)(.*)?/,
            params: {
                autoplay: 1,
                hd: 1,
                show_title: 1,
                show_byline: 1,
                show_portrait: 0,
                fullscreen: 1
            },
            paramPlace: 3,
            type: "iframe",
            url: "//player.vimeo.com/video/$2"
        },
        instagram: {
            matcher: /(instagr\.am|instagram\.com)\/p\/([a-zA-Z0-9_\-]+)\/?/i,
            type: "image",
            url: "//$1/p/$2/media/?size=l"
        },
        gmap_place: {
            matcher: /(maps\.)?google\.([a-z]{2,3}(\.[a-z]{2})?)\/(((maps\/(place\/(.*)\/)?\@(.*),(\d+.?\d+?)z))|(\?ll=))(.*)?/i,
            type: "iframe",
            url: function(rez) {
                return "//maps.google." + rez[2] + "/?ll=" + (rez[9] ? rez[9] + "&z=" + Math.floor(rez[10]) + (rez[12] ? rez[12].replace(/^\//, "&") : "") : rez[12] + "").replace(/\?/, "&") + "&output=" + (rez[12] && rez[12].indexOf("layer=c") > 0 ? "svembed" : "embed");
            }
        },
        gmap_search: {
            matcher: /(maps\.)?google\.([a-z]{2,3}(\.[a-z]{2})?)\/(maps\/search\/)(.*)/i,
            type: "iframe",
            url: function(rez) {
                return "//maps.google." + rez[2] + "/maps?q=" + rez[5].replace("query=", "q=").replace("api=1", "") + "&output=embed";
            }
        }
    };
    var format = function(url, rez, params) {
        if (!url) {
            return;
        }
        params = params || "";
        if ($.type(params) === "object") {
            params = $.param(params, true);
        }
        $.each(rez, function(key, value) {
            url = url.replace("$" + key, value || "");
        });
        if (params.length) {
            url += (url.indexOf("?") > 0 ? "&" : "?") + params;
        }
        return url;
    };
    $(document).on("objectNeedsType.fb", function(e, instance, item) {
        var url = item.src || "", type = false, media, thumb, rez, params, urlParams, paramObj, provider;
        media = $.extend(true, {}, defaults, item.opts.media);
        $.each(media, function(providerName, providerOpts) {
            rez = url.match(providerOpts.matcher);
            if (!rez) {
                return;
            }
            type = providerOpts.type;
            provider = providerName;
            paramObj = {};
            if (providerOpts.paramPlace && rez[providerOpts.paramPlace]) {
                urlParams = rez[providerOpts.paramPlace];
                if (urlParams[0] == "?") {
                    urlParams = urlParams.substring(1);
                }
                urlParams = urlParams.split("&");
                for (var m = 0; m < urlParams.length; ++m) {
                    var p = urlParams[m].split("=", 2);
                    if (p.length == 2) {
                        paramObj[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
                    }
                }
            }
            params = $.extend(true, {}, providerOpts.params, item.opts[providerName], paramObj);
            url = $.type(providerOpts.url) === "function" ? providerOpts.url.call(this, rez, params, item) : format(providerOpts.url, rez, params);
            thumb = $.type(providerOpts.thumb) === "function" ? providerOpts.thumb.call(this, rez, params, item) : format(providerOpts.thumb, rez);
            if (providerName === "youtube") {
                url = url.replace(/&t=((\d+)m)?(\d+)s/, function(match, p1, m, s) {
                    return "&start=" + ((m ? parseInt(m, 10) * 60 : 0) + parseInt(s, 10));
                });
            } else if (providerName === "vimeo") {
                url = url.replace("&%23", "#");
            }
            return false;
        });
        if (type) {
            if (!item.opts.thumb && !(item.opts.$thumb && item.opts.$thumb.length)) {
                item.opts.thumb = thumb;
            }
            if (type === "iframe") {
                item.opts = $.extend(true, item.opts, {
                    iframe: {
                        preload: false,
                        attr: {
                            scrolling: "no"
                        }
                    }
                });
            }
            $.extend(item, {
                type: type,
                src: url,
                origSrc: item.src,
                contentSource: provider,
                contentType: type === "image" ? "image" : provider == "gmap_place" || provider == "gmap_search" ? "map" : "video"
            });
        } else if (url) {
            item.type = item.opts.defaultType;
        }
    });
    var VideoAPILoader = {
        youtube: {
            src: "https://www.youtube.com/iframe_api",
            class: "YT",
            loading: false,
            loaded: false
        },
        vimeo: {
            src: "https://player.vimeo.com/api/player.js",
            class: "Vimeo",
            loading: false,
            loaded: false
        },
        load: function(vendor) {
            var _this = this, script;
            if (this[vendor].loaded) {
                setTimeout(function() {
                    _this.done(vendor);
                });
                return;
            }
            if (this[vendor].loading) {
                return;
            }
            this[vendor].loading = true;
            script = document.createElement("script");
            script.type = "text/javascript";
            script.src = this[vendor].src;
            if (vendor === "youtube") {
                window.onYouTubeIframeAPIReady = function() {
                    _this[vendor].loaded = true;
                    _this.done(vendor);
                };
            } else {
                script.onload = function() {
                    _this[vendor].loaded = true;
                    _this.done(vendor);
                };
            }
            document.body.appendChild(script);
        },
        done: function(vendor) {
            var instance, $el, player;
            if (vendor === "youtube") {
                delete window.onYouTubeIframeAPIReady;
            }
            instance = $.fancybox.getInstance();
            if (instance) {
                $el = instance.current.$content.find("iframe");
                if (vendor === "youtube" && YT !== undefined && YT) {
                    player = new YT.Player($el.attr("id"), {
                        events: {
                            onStateChange: function(e) {
                                if (e.data == 0) {
                                    instance.next();
                                }
                            }
                        }
                    });
                } else if (vendor === "vimeo" && Vimeo !== undefined && Vimeo) {
                    player = new Vimeo.Player($el);
                    player.on("ended", function() {
                        instance.next();
                    });
                }
            }
        }
    };
    $(document).on({
        "afterShow.fb": function(e, instance, current) {
            if (instance.group.length > 1 && (current.contentSource === "youtube" || current.contentSource === "vimeo")) {
                VideoAPILoader.load(current.contentSource);
            }
        }
    });
})(jQuery);

(function(window, document, $) {
    "use strict";
    var requestAFrame = function() {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || function(callback) {
            return window.setTimeout(callback, 1e3 / 60);
        };
    }();
    var cancelAFrame = function() {
        return window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.oCancelAnimationFrame || function(id) {
            window.clearTimeout(id);
        };
    }();
    var getPointerXY = function(e) {
        var result = [];
        e = e.originalEvent || e || window.e;
        e = e.touches && e.touches.length ? e.touches : e.changedTouches && e.changedTouches.length ? e.changedTouches : [ e ];
        for (var key in e) {
            if (e[key].pageX) {
                result.push({
                    x: e[key].pageX,
                    y: e[key].pageY
                });
            } else if (e[key].clientX) {
                result.push({
                    x: e[key].clientX,
                    y: e[key].clientY
                });
            }
        }
        return result;
    };
    var distance = function(point2, point1, what) {
        if (!point1 || !point2) {
            return 0;
        }
        if (what === "x") {
            return point2.x - point1.x;
        } else if (what === "y") {
            return point2.y - point1.y;
        }
        return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
    };
    var isClickable = function($el) {
        if ($el.is('a,area,button,[role="button"],input,label,select,summary,textarea,video,audio,iframe') || $.isFunction($el.get(0).onclick) || $el.data("selectable")) {
            return true;
        }
        for (var i = 0, atts = $el[0].attributes, n = atts.length; i < n; i++) {
            if (atts[i].nodeName.substr(0, 14) === "data-fancybox-") {
                return true;
            }
        }
        return false;
    };
    var hasScrollbars = function(el) {
        var overflowY = window.getComputedStyle(el)["overflow-y"], overflowX = window.getComputedStyle(el)["overflow-x"], vertical = (overflowY === "scroll" || overflowY === "auto") && el.scrollHeight > el.clientHeight, horizontal = (overflowX === "scroll" || overflowX === "auto") && el.scrollWidth > el.clientWidth;
        return vertical || horizontal;
    };
    var isScrollable = function($el) {
        var rez = false;
        while (true) {
            rez = hasScrollbars($el.get(0));
            if (rez) {
                break;
            }
            $el = $el.parent();
            if (!$el.length || $el.hasClass("fancybox-stage") || $el.is("body")) {
                break;
            }
        }
        return rez;
    };
    var Guestures = function(instance) {
        var self = this;
        self.instance = instance;
        self.$bg = instance.$refs.bg;
        self.$stage = instance.$refs.stage;
        self.$container = instance.$refs.container;
        self.destroy();
        self.$container.on("touchstart.fb.touch mousedown.fb.touch", $.proxy(self, "ontouchstart"));
    };
    Guestures.prototype.destroy = function() {
        var self = this;
        self.$container.off(".fb.touch");
        $(document).off(".fb.touch");
        if (self.requestId) {
            cancelAFrame(self.requestId);
            self.requestId = null;
        }
        if (self.tapped) {
            clearTimeout(self.tapped);
            self.tapped = null;
        }
    };
    Guestures.prototype.ontouchstart = function(e) {
        var self = this, $target = $(e.target), instance = self.instance, current = instance.current, $slide = current.$slide, $content = current.$content, isTouchDevice = e.type == "touchstart";
        if (isTouchDevice) {
            self.$container.off("mousedown.fb.touch");
        }
        if (e.originalEvent && e.originalEvent.button == 2) {
            return;
        }
        if (!$slide.length || !$target.length || isClickable($target) || isClickable($target.parent())) {
            return;
        }
        if (!$target.is("img") && e.originalEvent.clientX > $target[0].clientWidth + $target.offset().left) {
            return;
        }
        if (!current || instance.isAnimating || current.$slide.hasClass("fancybox-animated")) {
            e.stopPropagation();
            e.preventDefault();
            return;
        }
        self.realPoints = self.startPoints = getPointerXY(e);
        if (!self.startPoints.length) {
            return;
        }
        if (current.touch) {
            e.stopPropagation();
        }
        self.startEvent = e;
        self.canTap = true;
        self.$target = $target;
        self.$content = $content;
        self.opts = current.opts.touch;
        self.isPanning = false;
        self.isSwiping = false;
        self.isZooming = false;
        self.isScrolling = false;
        self.canPan = instance.canPan();
        self.startTime = new Date().getTime();
        self.distanceX = self.distanceY = self.distance = 0;
        self.canvasWidth = Math.round($slide[0].clientWidth);
        self.canvasHeight = Math.round($slide[0].clientHeight);
        self.contentLastPos = null;
        self.contentStartPos = $.fancybox.getTranslate(self.$content) || {
            top: 0,
            left: 0
        };
        self.sliderStartPos = $.fancybox.getTranslate($slide);
        self.stagePos = $.fancybox.getTranslate(instance.$refs.stage);
        self.sliderStartPos.top -= self.stagePos.top;
        self.sliderStartPos.left -= self.stagePos.left;
        self.contentStartPos.top -= self.stagePos.top;
        self.contentStartPos.left -= self.stagePos.left;
        $(document).off(".fb.touch").on(isTouchDevice ? "touchend.fb.touch touchcancel.fb.touch" : "mouseup.fb.touch mouseleave.fb.touch", $.proxy(self, "ontouchend")).on(isTouchDevice ? "touchmove.fb.touch" : "mousemove.fb.touch", $.proxy(self, "ontouchmove"));
        if ($.fancybox.isMobile) {
            document.addEventListener("scroll", self.onscroll, true);
        }
        if (!(self.opts || self.canPan) || !($target.is(self.$stage) || self.$stage.find($target).length)) {
            if ($target.is(".fancybox-image")) {
                e.preventDefault();
            }
            if (!($.fancybox.isMobile && $target.parents(".fancybox-caption").length)) {
                return;
            }
        }
        self.isScrollable = isScrollable($target) || isScrollable($target.parent());
        if (!($.fancybox.isMobile && self.isScrollable)) {
            e.preventDefault();
        }
        if (self.startPoints.length === 1 || current.hasError) {
            if (self.canPan) {
                $.fancybox.stop(self.$content);
                self.isPanning = true;
            } else {
                self.isSwiping = true;
            }
            self.$container.addClass("fancybox-is-grabbing");
        }
        if (self.startPoints.length === 2 && current.type === "image" && (current.isLoaded || current.$ghost)) {
            self.canTap = false;
            self.isSwiping = false;
            self.isPanning = false;
            self.isZooming = true;
            $.fancybox.stop(self.$content);
            self.centerPointStartX = (self.startPoints[0].x + self.startPoints[1].x) * .5 - $(window).scrollLeft();
            self.centerPointStartY = (self.startPoints[0].y + self.startPoints[1].y) * .5 - $(window).scrollTop();
            self.percentageOfImageAtPinchPointX = (self.centerPointStartX - self.contentStartPos.left) / self.contentStartPos.width;
            self.percentageOfImageAtPinchPointY = (self.centerPointStartY - self.contentStartPos.top) / self.contentStartPos.height;
            self.startDistanceBetweenFingers = distance(self.startPoints[0], self.startPoints[1]);
        }
    };
    Guestures.prototype.onscroll = function(e) {
        var self = this;
        self.isScrolling = true;
        document.removeEventListener("scroll", self.onscroll, true);
    };
    Guestures.prototype.ontouchmove = function(e) {
        var self = this;
        if (e.originalEvent.buttons !== undefined && e.originalEvent.buttons === 0) {
            self.ontouchend(e);
            return;
        }
        if (self.isScrolling) {
            self.canTap = false;
            return;
        }
        self.newPoints = getPointerXY(e);
        if (!(self.opts || self.canPan) || !self.newPoints.length || !self.newPoints.length) {
            return;
        }
        if (!(self.isSwiping && self.isSwiping === true)) {
            e.preventDefault();
        }
        self.distanceX = distance(self.newPoints[0], self.startPoints[0], "x");
        self.distanceY = distance(self.newPoints[0], self.startPoints[0], "y");
        self.distance = distance(self.newPoints[0], self.startPoints[0]);
        if (self.distance > 0) {
            if (self.isSwiping) {
                self.onSwipe(e);
            } else if (self.isPanning) {
                self.onPan();
            } else if (self.isZooming) {
                self.onZoom();
            }
        }
    };
    Guestures.prototype.onSwipe = function(e) {
        var self = this, instance = self.instance, swiping = self.isSwiping, left = self.sliderStartPos.left || 0, angle;
        if (swiping === true) {
            if (Math.abs(self.distance) > 10) {
                self.canTap = false;
                if (instance.group.length < 2 && self.opts.vertical) {
                    self.isSwiping = "y";
                } else if (instance.isDragging || self.opts.vertical === false || self.opts.vertical === "auto" && $(window).width() > 800) {
                    self.isSwiping = "x";
                } else {
                    angle = Math.abs(Math.atan2(self.distanceY, self.distanceX) * 180 / Math.PI);
                    self.isSwiping = angle > 45 && angle < 135 ? "y" : "x";
                }
                if (self.isSwiping === "y" && $.fancybox.isMobile && self.isScrollable) {
                    self.isScrolling = true;
                    return;
                }
                instance.isDragging = self.isSwiping;
                self.startPoints = self.newPoints;
                $.each(instance.slides, function(index, slide) {
                    var slidePos, stagePos;
                    $.fancybox.stop(slide.$slide);
                    slidePos = $.fancybox.getTranslate(slide.$slide);
                    stagePos = $.fancybox.getTranslate(instance.$refs.stage);
                    slide.$slide.css({
                        transform: "",
                        opacity: "",
                        "transition-duration": ""
                    }).removeClass("fancybox-animated").removeClass(function(index, className) {
                        return (className.match(/(^|\s)fancybox-fx-\S+/g) || []).join(" ");
                    });
                    if (slide.pos === instance.current.pos) {
                        self.sliderStartPos.top = slidePos.top - stagePos.top;
                        self.sliderStartPos.left = slidePos.left - stagePos.left;
                    }
                    $.fancybox.setTranslate(slide.$slide, {
                        top: slidePos.top - stagePos.top,
                        left: slidePos.left - stagePos.left
                    });
                });
                if (instance.SlideShow && instance.SlideShow.isActive) {
                    instance.SlideShow.stop();
                }
            }
            return;
        }
        if (swiping == "x") {
            if (self.distanceX > 0 && (self.instance.group.length < 2 || self.instance.current.index === 0 && !self.instance.current.opts.loop)) {
                left = left + Math.pow(self.distanceX, .8);
            } else if (self.distanceX < 0 && (self.instance.group.length < 2 || self.instance.current.index === self.instance.group.length - 1 && !self.instance.current.opts.loop)) {
                left = left - Math.pow(-self.distanceX, .8);
            } else {
                left = left + self.distanceX;
            }
        }
        self.sliderLastPos = {
            top: swiping == "x" ? 0 : self.sliderStartPos.top + self.distanceY,
            left: left
        };
        if (self.requestId) {
            cancelAFrame(self.requestId);
            self.requestId = null;
        }
        self.requestId = requestAFrame(function() {
            if (self.sliderLastPos) {
                $.each(self.instance.slides, function(index, slide) {
                    var pos = slide.pos - self.instance.currPos;
                    $.fancybox.setTranslate(slide.$slide, {
                        top: self.sliderLastPos.top,
                        left: self.sliderLastPos.left + pos * self.canvasWidth + pos * slide.opts.gutter
                    });
                });
                self.$container.addClass("fancybox-is-sliding");
            }
        });
    };
    Guestures.prototype.onPan = function() {
        var self = this;
        if (distance(self.newPoints[0], self.realPoints[0]) < ($.fancybox.isMobile ? 10 : 5)) {
            self.startPoints = self.newPoints;
            return;
        }
        self.canTap = false;
        self.contentLastPos = self.limitMovement();
        if (self.requestId) {
            cancelAFrame(self.requestId);
        }
        self.requestId = requestAFrame(function() {
            $.fancybox.setTranslate(self.$content, self.contentLastPos);
        });
    };
    Guestures.prototype.limitMovement = function() {
        var self = this;
        var canvasWidth = self.canvasWidth;
        var canvasHeight = self.canvasHeight;
        var distanceX = self.distanceX;
        var distanceY = self.distanceY;
        var contentStartPos = self.contentStartPos;
        var currentOffsetX = contentStartPos.left;
        var currentOffsetY = contentStartPos.top;
        var currentWidth = contentStartPos.width;
        var currentHeight = contentStartPos.height;
        var minTranslateX, minTranslateY, maxTranslateX, maxTranslateY, newOffsetX, newOffsetY;
        if (currentWidth > canvasWidth) {
            newOffsetX = currentOffsetX + distanceX;
        } else {
            newOffsetX = currentOffsetX;
        }
        newOffsetY = currentOffsetY + distanceY;
        minTranslateX = Math.max(0, canvasWidth * .5 - currentWidth * .5);
        minTranslateY = Math.max(0, canvasHeight * .5 - currentHeight * .5);
        maxTranslateX = Math.min(canvasWidth - currentWidth, canvasWidth * .5 - currentWidth * .5);
        maxTranslateY = Math.min(canvasHeight - currentHeight, canvasHeight * .5 - currentHeight * .5);
        if (distanceX > 0 && newOffsetX > minTranslateX) {
            newOffsetX = minTranslateX - 1 + Math.pow(-minTranslateX + currentOffsetX + distanceX, .8) || 0;
        }
        if (distanceX < 0 && newOffsetX < maxTranslateX) {
            newOffsetX = maxTranslateX + 1 - Math.pow(maxTranslateX - currentOffsetX - distanceX, .8) || 0;
        }
        if (distanceY > 0 && newOffsetY > minTranslateY) {
            newOffsetY = minTranslateY - 1 + Math.pow(-minTranslateY + currentOffsetY + distanceY, .8) || 0;
        }
        if (distanceY < 0 && newOffsetY < maxTranslateY) {
            newOffsetY = maxTranslateY + 1 - Math.pow(maxTranslateY - currentOffsetY - distanceY, .8) || 0;
        }
        return {
            top: newOffsetY,
            left: newOffsetX
        };
    };
    Guestures.prototype.limitPosition = function(newOffsetX, newOffsetY, newWidth, newHeight) {
        var self = this;
        var canvasWidth = self.canvasWidth;
        var canvasHeight = self.canvasHeight;
        if (newWidth > canvasWidth) {
            newOffsetX = newOffsetX > 0 ? 0 : newOffsetX;
            newOffsetX = newOffsetX < canvasWidth - newWidth ? canvasWidth - newWidth : newOffsetX;
        } else {
            newOffsetX = Math.max(0, canvasWidth / 2 - newWidth / 2);
        }
        if (newHeight > canvasHeight) {
            newOffsetY = newOffsetY > 0 ? 0 : newOffsetY;
            newOffsetY = newOffsetY < canvasHeight - newHeight ? canvasHeight - newHeight : newOffsetY;
        } else {
            newOffsetY = Math.max(0, canvasHeight / 2 - newHeight / 2);
        }
        return {
            top: newOffsetY,
            left: newOffsetX
        };
    };
    Guestures.prototype.onZoom = function() {
        var self = this;
        var contentStartPos = self.contentStartPos;
        var currentWidth = contentStartPos.width;
        var currentHeight = contentStartPos.height;
        var currentOffsetX = contentStartPos.left;
        var currentOffsetY = contentStartPos.top;
        var endDistanceBetweenFingers = distance(self.newPoints[0], self.newPoints[1]);
        var pinchRatio = endDistanceBetweenFingers / self.startDistanceBetweenFingers;
        var newWidth = Math.floor(currentWidth * pinchRatio);
        var newHeight = Math.floor(currentHeight * pinchRatio);
        var translateFromZoomingX = (currentWidth - newWidth) * self.percentageOfImageAtPinchPointX;
        var translateFromZoomingY = (currentHeight - newHeight) * self.percentageOfImageAtPinchPointY;
        var centerPointEndX = (self.newPoints[0].x + self.newPoints[1].x) / 2 - $(window).scrollLeft();
        var centerPointEndY = (self.newPoints[0].y + self.newPoints[1].y) / 2 - $(window).scrollTop();
        var translateFromTranslatingX = centerPointEndX - self.centerPointStartX;
        var translateFromTranslatingY = centerPointEndY - self.centerPointStartY;
        var newOffsetX = currentOffsetX + (translateFromZoomingX + translateFromTranslatingX);
        var newOffsetY = currentOffsetY + (translateFromZoomingY + translateFromTranslatingY);
        var newPos = {
            top: newOffsetY,
            left: newOffsetX,
            scaleX: pinchRatio,
            scaleY: pinchRatio
        };
        self.canTap = false;
        self.newWidth = newWidth;
        self.newHeight = newHeight;
        self.contentLastPos = newPos;
        if (self.requestId) {
            cancelAFrame(self.requestId);
        }
        self.requestId = requestAFrame(function() {
            $.fancybox.setTranslate(self.$content, self.contentLastPos);
        });
    };
    Guestures.prototype.ontouchend = function(e) {
        var self = this;
        var swiping = self.isSwiping;
        var panning = self.isPanning;
        var zooming = self.isZooming;
        var scrolling = self.isScrolling;
        self.endPoints = getPointerXY(e);
        self.dMs = Math.max(new Date().getTime() - self.startTime, 1);
        self.$container.removeClass("fancybox-is-grabbing");
        $(document).off(".fb.touch");
        document.removeEventListener("scroll", self.onscroll, true);
        if (self.requestId) {
            cancelAFrame(self.requestId);
            self.requestId = null;
        }
        self.isSwiping = false;
        self.isPanning = false;
        self.isZooming = false;
        self.isScrolling = false;
        self.instance.isDragging = false;
        if (self.canTap) {
            return self.onTap(e);
        }
        self.speed = 100;
        self.velocityX = self.distanceX / self.dMs * .5;
        self.velocityY = self.distanceY / self.dMs * .5;
        if (panning) {
            self.endPanning();
        } else if (zooming) {
            self.endZooming();
        } else {
            self.endSwiping(swiping, scrolling);
        }
        return;
    };
    Guestures.prototype.endSwiping = function(swiping, scrolling) {
        var self = this, ret = false, len = self.instance.group.length, distanceX = Math.abs(self.distanceX), canAdvance = swiping == "x" && len > 1 && (self.dMs > 130 && distanceX > 10 || distanceX > 50), speedX = 300;
        self.sliderLastPos = null;
        if (swiping == "y" && !scrolling && Math.abs(self.distanceY) > 50) {
            $.fancybox.animate(self.instance.current.$slide, {
                top: self.sliderStartPos.top + self.distanceY + self.velocityY * 150,
                opacity: 0
            }, 200);
            ret = self.instance.close(true, 250);
        } else if (canAdvance && self.distanceX > 0) {
            ret = self.instance.previous(speedX);
        } else if (canAdvance && self.distanceX < 0) {
            ret = self.instance.next(speedX);
        }
        if (ret === false && (swiping == "x" || swiping == "y")) {
            self.instance.centerSlide(200);
        }
        self.$container.removeClass("fancybox-is-sliding");
    };
    Guestures.prototype.endPanning = function() {
        var self = this, newOffsetX, newOffsetY, newPos;
        if (!self.contentLastPos) {
            return;
        }
        if (self.opts.momentum === false || self.dMs > 350) {
            newOffsetX = self.contentLastPos.left;
            newOffsetY = self.contentLastPos.top;
        } else {
            newOffsetX = self.contentLastPos.left + self.velocityX * 500;
            newOffsetY = self.contentLastPos.top + self.velocityY * 500;
        }
        newPos = self.limitPosition(newOffsetX, newOffsetY, self.contentStartPos.width, self.contentStartPos.height);
        newPos.width = self.contentStartPos.width;
        newPos.height = self.contentStartPos.height;
        $.fancybox.animate(self.$content, newPos, 366);
    };
    Guestures.prototype.endZooming = function() {
        var self = this;
        var current = self.instance.current;
        var newOffsetX, newOffsetY, newPos, reset;
        var newWidth = self.newWidth;
        var newHeight = self.newHeight;
        if (!self.contentLastPos) {
            return;
        }
        newOffsetX = self.contentLastPos.left;
        newOffsetY = self.contentLastPos.top;
        reset = {
            top: newOffsetY,
            left: newOffsetX,
            width: newWidth,
            height: newHeight,
            scaleX: 1,
            scaleY: 1
        };
        $.fancybox.setTranslate(self.$content, reset);
        if (newWidth < self.canvasWidth && newHeight < self.canvasHeight) {
            self.instance.scaleToFit(150);
        } else if (newWidth > current.width || newHeight > current.height) {
            self.instance.scaleToActual(self.centerPointStartX, self.centerPointStartY, 150);
        } else {
            newPos = self.limitPosition(newOffsetX, newOffsetY, newWidth, newHeight);
            $.fancybox.animate(self.$content, newPos, 150);
        }
    };
    Guestures.prototype.onTap = function(e) {
        var self = this;
        var $target = $(e.target);
        var instance = self.instance;
        var current = instance.current;
        var endPoints = e && getPointerXY(e) || self.startPoints;
        var tapX = endPoints[0] ? endPoints[0].x - $(window).scrollLeft() - self.stagePos.left : 0;
        var tapY = endPoints[0] ? endPoints[0].y - $(window).scrollTop() - self.stagePos.top : 0;
        var where;
        var process = function(prefix) {
            var action = current.opts[prefix];
            if ($.isFunction(action)) {
                action = action.apply(instance, [ current, e ]);
            }
            if (!action) {
                return;
            }
            switch (action) {
              case "close":
                instance.close(self.startEvent);
                break;

              case "toggleControls":
                instance.toggleControls();
                break;

              case "next":
                instance.next();
                break;

              case "nextOrClose":
                if (instance.group.length > 1) {
                    instance.next();
                } else {
                    instance.close(self.startEvent);
                }
                break;

              case "zoom":
                if (current.type == "image" && (current.isLoaded || current.$ghost)) {
                    if (instance.canPan()) {
                        instance.scaleToFit();
                    } else if (instance.isScaledDown()) {
                        instance.scaleToActual(tapX, tapY);
                    } else if (instance.group.length < 2) {
                        instance.close(self.startEvent);
                    }
                }
                break;
            }
        };
        if (e.originalEvent && e.originalEvent.button == 2) {
            return;
        }
        if (!$target.is("img") && tapX > $target[0].clientWidth + $target.offset().left) {
            return;
        }
        if ($target.is(".fancybox-bg,.fancybox-inner,.fancybox-outer,.fancybox-container")) {
            where = "Outside";
        } else if ($target.is(".fancybox-slide")) {
            where = "Slide";
        } else if (instance.current.$content && instance.current.$content.find($target).addBack().filter($target).length) {
            where = "Content";
        } else {
            return;
        }
        if (self.tapped) {
            clearTimeout(self.tapped);
            self.tapped = null;
            if (Math.abs(tapX - self.tapX) > 50 || Math.abs(tapY - self.tapY) > 50) {
                return this;
            }
            process("dblclick" + where);
        } else {
            self.tapX = tapX;
            self.tapY = tapY;
            if (current.opts["dblclick" + where] && current.opts["dblclick" + where] !== current.opts["click" + where]) {
                self.tapped = setTimeout(function() {
                    self.tapped = null;
                    if (!instance.isAnimating) {
                        process("click" + where);
                    }
                }, 500);
            } else {
                process("click" + where);
            }
        }
        return this;
    };
    $(document).on("onActivate.fb", function(e, instance) {
        if (instance && !instance.Guestures) {
            instance.Guestures = new Guestures(instance);
        }
    }).on("beforeClose.fb", function(e, instance) {
        if (instance && instance.Guestures) {
            instance.Guestures.destroy();
        }
    });
})(window, document, jQuery);

(function(document, $) {
    "use strict";
    $.extend(true, $.fancybox.defaults, {
        btnTpl: {
            slideShow: '<button data-fancybox-play class="fancybox-button fancybox-button--play" title="{{PLAY_START}}">' + '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M6.5 5.4v13.2l11-6.6z"/></svg>' + '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M8.33 5.75h2.2v12.5h-2.2V5.75zm5.15 0h2.2v12.5h-2.2V5.75z"/></svg>' + "</button>"
        },
        slideShow: {
            autoStart: false,
            speed: 3e3,
            progress: true
        }
    });
    var SlideShow = function(instance) {
        this.instance = instance;
        this.init();
    };
    $.extend(SlideShow.prototype, {
        timer: null,
        isActive: false,
        $button: null,
        init: function() {
            var self = this, instance = self.instance, opts = instance.group[instance.currIndex].opts.slideShow;
            self.$button = instance.$refs.toolbar.find("[data-fancybox-play]").on("click", function() {
                self.toggle();
            });
            if (instance.group.length < 2 || !opts) {
                self.$button.hide();
            } else if (opts.progress) {
                self.$progress = $('<div class="fancybox-progress"></div>').appendTo(instance.$refs.inner);
            }
        },
        set: function(force) {
            var self = this, instance = self.instance, current = instance.current;
            if (current && (force === true || current.opts.loop || instance.currIndex < instance.group.length - 1)) {
                if (self.isActive && current.contentType !== "video") {
                    if (self.$progress) {
                        $.fancybox.animate(self.$progress.show(), {
                            scaleX: 1
                        }, current.opts.slideShow.speed);
                    }
                    self.timer = setTimeout(function() {
                        if (!instance.current.opts.loop && instance.current.index == instance.group.length - 1) {
                            instance.jumpTo(0);
                        } else {
                            instance.next();
                        }
                    }, current.opts.slideShow.speed);
                }
            } else {
                self.stop();
                instance.idleSecondsCounter = 0;
                instance.showControls();
            }
        },
        clear: function() {
            var self = this;
            clearTimeout(self.timer);
            self.timer = null;
            if (self.$progress) {
                self.$progress.removeAttr("style").hide();
            }
        },
        start: function() {
            var self = this, current = self.instance.current;
            if (current) {
                self.$button.attr("title", (current.opts.i18n[current.opts.lang] || current.opts.i18n.en).PLAY_STOP).removeClass("fancybox-button--play").addClass("fancybox-button--pause");
                self.isActive = true;
                if (current.isComplete) {
                    self.set(true);
                }
                self.instance.trigger("onSlideShowChange", true);
            }
        },
        stop: function() {
            var self = this, current = self.instance.current;
            self.clear();
            self.$button.attr("title", (current.opts.i18n[current.opts.lang] || current.opts.i18n.en).PLAY_START).removeClass("fancybox-button--pause").addClass("fancybox-button--play");
            self.isActive = false;
            self.instance.trigger("onSlideShowChange", false);
            if (self.$progress) {
                self.$progress.removeAttr("style").hide();
            }
        },
        toggle: function() {
            var self = this;
            if (self.isActive) {
                self.stop();
            } else {
                self.start();
            }
        }
    });
    $(document).on({
        "onInit.fb": function(e, instance) {
            if (instance && !instance.SlideShow) {
                instance.SlideShow = new SlideShow(instance);
            }
        },
        "beforeShow.fb": function(e, instance, current, firstRun) {
            var SlideShow = instance && instance.SlideShow;
            if (firstRun) {
                if (SlideShow && current.opts.slideShow.autoStart) {
                    SlideShow.start();
                }
            } else if (SlideShow && SlideShow.isActive) {
                SlideShow.clear();
            }
        },
        "afterShow.fb": function(e, instance, current) {
            var SlideShow = instance && instance.SlideShow;
            if (SlideShow && SlideShow.isActive) {
                SlideShow.set();
            }
        },
        "afterKeydown.fb": function(e, instance, current, keypress, keycode) {
            var SlideShow = instance && instance.SlideShow;
            if (SlideShow && current.opts.slideShow && (keycode === 80 || keycode === 32) && !$(document.activeElement).is("button,a,input")) {
                keypress.preventDefault();
                SlideShow.toggle();
            }
        },
        "beforeClose.fb onDeactivate.fb": function(e, instance) {
            var SlideShow = instance && instance.SlideShow;
            if (SlideShow) {
                SlideShow.stop();
            }
        }
    });
    $(document).on("visibilitychange", function() {
        var instance = $.fancybox.getInstance(), SlideShow = instance && instance.SlideShow;
        if (SlideShow && SlideShow.isActive) {
            if (document.hidden) {
                SlideShow.clear();
            } else {
                SlideShow.set();
            }
        }
    });
})(document, jQuery);

(function(document, $) {
    "use strict";
    var fn = function() {
        var fnMap = [ [ "requestFullscreen", "exitFullscreen", "fullscreenElement", "fullscreenEnabled", "fullscreenchange", "fullscreenerror" ], [ "webkitRequestFullscreen", "webkitExitFullscreen", "webkitFullscreenElement", "webkitFullscreenEnabled", "webkitfullscreenchange", "webkitfullscreenerror" ], [ "webkitRequestFullScreen", "webkitCancelFullScreen", "webkitCurrentFullScreenElement", "webkitCancelFullScreen", "webkitfullscreenchange", "webkitfullscreenerror" ], [ "mozRequestFullScreen", "mozCancelFullScreen", "mozFullScreenElement", "mozFullScreenEnabled", "mozfullscreenchange", "mozfullscreenerror" ], [ "msRequestFullscreen", "msExitFullscreen", "msFullscreenElement", "msFullscreenEnabled", "MSFullscreenChange", "MSFullscreenError" ] ];
        var ret = {};
        for (var i = 0; i < fnMap.length; i++) {
            var val = fnMap[i];
            if (val && val[1] in document) {
                for (var j = 0; j < val.length; j++) {
                    ret[fnMap[0][j]] = val[j];
                }
                return ret;
            }
        }
        return false;
    }();
    if (fn) {
        var FullScreen = {
            request: function(elem) {
                elem = elem || document.documentElement;
                elem[fn.requestFullscreen](elem.ALLOW_KEYBOARD_INPUT);
            },
            exit: function() {
                document[fn.exitFullscreen]();
            },
            toggle: function(elem) {
                elem = elem || document.documentElement;
                if (this.isFullscreen()) {
                    this.exit();
                } else {
                    this.request(elem);
                }
            },
            isFullscreen: function() {
                return Boolean(document[fn.fullscreenElement]);
            },
            enabled: function() {
                return Boolean(document[fn.fullscreenEnabled]);
            }
        };
        $.extend(true, $.fancybox.defaults, {
            btnTpl: {
                fullScreen: '<button data-fancybox-fullscreen class="fancybox-button fancybox-button--fsenter" title="{{FULL_SCREEN}}">' + '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>' + '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5 16h3v3h2v-5H5zm3-8H5v2h5V5H8zm6 11h2v-3h3v-2h-5zm2-11V5h-2v5h5V8z"/></svg>' + "</button>"
            },
            fullScreen: {
                autoStart: false
            }
        });
        $(document).on(fn.fullscreenchange, function() {
            var isFullscreen = FullScreen.isFullscreen(), instance = $.fancybox.getInstance();
            if (instance) {
                if (instance.current && instance.current.type === "image" && instance.isAnimating) {
                    instance.isAnimating = false;
                    instance.update(true, true, 0);
                    if (!instance.isComplete) {
                        instance.complete();
                    }
                }
                instance.trigger("onFullscreenChange", isFullscreen);
                instance.$refs.container.toggleClass("fancybox-is-fullscreen", isFullscreen);
                instance.$refs.toolbar.find("[data-fancybox-fullscreen]").toggleClass("fancybox-button--fsenter", !isFullscreen).toggleClass("fancybox-button--fsexit", isFullscreen);
            }
        });
    }
    $(document).on({
        "onInit.fb": function(e, instance) {
            var $container;
            if (!fn) {
                instance.$refs.toolbar.find("[data-fancybox-fullscreen]").remove();
                return;
            }
            if (instance && instance.group[instance.currIndex].opts.fullScreen) {
                $container = instance.$refs.container;
                $container.on("click.fb-fullscreen", "[data-fancybox-fullscreen]", function(e) {
                    e.stopPropagation();
                    e.preventDefault();
                    FullScreen.toggle();
                });
                if (instance.opts.fullScreen && instance.opts.fullScreen.autoStart === true) {
                    FullScreen.request();
                }
                instance.FullScreen = FullScreen;
            } else if (instance) {
                instance.$refs.toolbar.find("[data-fancybox-fullscreen]").hide();
            }
        },
        "afterKeydown.fb": function(e, instance, current, keypress, keycode) {
            if (instance && instance.FullScreen && keycode === 70) {
                keypress.preventDefault();
                instance.FullScreen.toggle();
            }
        },
        "beforeClose.fb": function(e, instance) {
            if (instance && instance.FullScreen && instance.$refs.container.hasClass("fancybox-is-fullscreen")) {
                FullScreen.exit();
            }
        }
    });
})(document, jQuery);

(function(document, $) {
    "use strict";
    var CLASS = "fancybox-thumbs", CLASS_ACTIVE = CLASS + "-active";
    $.fancybox.defaults = $.extend(true, {
        btnTpl: {
            thumbs: '<button data-fancybox-thumbs class="fancybox-button fancybox-button--thumbs" title="{{THUMBS}}">' + '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M14.59 14.59h3.76v3.76h-3.76v-3.76zm-4.47 0h3.76v3.76h-3.76v-3.76zm-4.47 0h3.76v3.76H5.65v-3.76zm8.94-4.47h3.76v3.76h-3.76v-3.76zm-4.47 0h3.76v3.76h-3.76v-3.76zm-4.47 0h3.76v3.76H5.65v-3.76zm8.94-4.47h3.76v3.76h-3.76V5.65zm-4.47 0h3.76v3.76h-3.76V5.65zm-4.47 0h3.76v3.76H5.65V5.65z"/></svg>' + "</button>"
        },
        thumbs: {
            autoStart: false,
            hideOnClose: true,
            parentEl: ".fancybox-container",
            axis: "y"
        }
    }, $.fancybox.defaults);
    var FancyThumbs = function(instance) {
        this.init(instance);
    };
    $.extend(FancyThumbs.prototype, {
        $button: null,
        $grid: null,
        $list: null,
        isVisible: false,
        isActive: false,
        init: function(instance) {
            var self = this, group = instance.group, enabled = 0;
            self.instance = instance;
            self.opts = group[instance.currIndex].opts.thumbs;
            instance.Thumbs = self;
            self.$button = instance.$refs.toolbar.find("[data-fancybox-thumbs]");
            for (var i = 0, len = group.length; i < len; i++) {
                if (group[i].thumb) {
                    enabled++;
                }
                if (enabled > 1) {
                    break;
                }
            }
            if (enabled > 1 && !!self.opts) {
                self.$button.removeAttr("style").on("click", function() {
                    self.toggle();
                });
                self.isActive = true;
            } else {
                self.$button.hide();
            }
        },
        create: function() {
            var self = this, instance = self.instance, parentEl = self.opts.parentEl, list = [], src;
            if (!self.$grid) {
                self.$grid = $('<div class="' + CLASS + " " + CLASS + "-" + self.opts.axis + '"></div>').appendTo(instance.$refs.container.find(parentEl).addBack().filter(parentEl));
                self.$grid.on("click", "a", function() {
                    instance.jumpTo($(this).attr("data-index"));
                });
            }
            if (!self.$list) {
                self.$list = $('<div class="' + CLASS + '__list">').appendTo(self.$grid);
            }
            $.each(instance.group, function(i, item) {
                src = item.thumb;
                if (!src && item.type === "image") {
                    src = item.src;
                }
                list.push('<a href="javascript:;" tabindex="0" data-index="' + i + '"' + (src && src.length ? ' style="background-image:url(' + src + ')"' : 'class="fancybox-thumbs-missing"') + "></a>");
            });
            self.$list[0].innerHTML = list.join("");
            if (self.opts.axis === "x") {
                self.$list.width(parseInt(self.$grid.css("padding-right"), 10) + instance.group.length * self.$list.children().eq(0).outerWidth(true));
            }
        },
        focus: function(duration) {
            var self = this, $list = self.$list, $grid = self.$grid, thumb, thumbPos;
            if (!self.instance.current) {
                return;
            }
            thumb = $list.children().removeClass(CLASS_ACTIVE).filter('[data-index="' + self.instance.current.index + '"]').addClass(CLASS_ACTIVE);
            thumbPos = thumb.position();
            if (self.opts.axis === "y" && (thumbPos.top < 0 || thumbPos.top > $list.height() - thumb.outerHeight())) {
                $list.stop().animate({
                    scrollTop: $list.scrollTop() + thumbPos.top
                }, duration);
            } else if (self.opts.axis === "x" && (thumbPos.left < $grid.scrollLeft() || thumbPos.left > $grid.scrollLeft() + ($grid.width() - thumb.outerWidth()))) {
                $list.parent().stop().animate({
                    scrollLeft: thumbPos.left
                }, duration);
            }
        },
        update: function() {
            var that = this;
            that.instance.$refs.container.toggleClass("fancybox-show-thumbs", this.isVisible);
            if (that.isVisible) {
                if (!that.$grid) {
                    that.create();
                }
                that.instance.trigger("onThumbsShow");
                that.focus(0);
            } else if (that.$grid) {
                that.instance.trigger("onThumbsHide");
            }
            that.instance.update();
        },
        hide: function() {
            this.isVisible = false;
            this.update();
        },
        show: function() {
            this.isVisible = true;
            this.update();
        },
        toggle: function() {
            this.isVisible = !this.isVisible;
            this.update();
        }
    });
    $(document).on({
        "onInit.fb": function(e, instance) {
            var Thumbs;
            if (instance && !instance.Thumbs) {
                Thumbs = new FancyThumbs(instance);
                if (Thumbs.isActive && Thumbs.opts.autoStart === true) {
                    Thumbs.show();
                }
            }
        },
        "beforeShow.fb": function(e, instance, item, firstRun) {
            var Thumbs = instance && instance.Thumbs;
            if (Thumbs && Thumbs.isVisible) {
                Thumbs.focus(firstRun ? 0 : 250);
            }
        },
        "afterKeydown.fb": function(e, instance, current, keypress, keycode) {
            var Thumbs = instance && instance.Thumbs;
            if (Thumbs && Thumbs.isActive && keycode === 71) {
                keypress.preventDefault();
                Thumbs.toggle();
            }
        },
        "beforeClose.fb": function(e, instance) {
            var Thumbs = instance && instance.Thumbs;
            if (Thumbs && Thumbs.isVisible && Thumbs.opts.hideOnClose !== false) {
                Thumbs.$grid.hide();
            }
        }
    });
})(document, jQuery);

(function(document, $) {
    "use strict";
    $.extend(true, $.fancybox.defaults, {
        btnTpl: {
            share: '<button data-fancybox-share class="fancybox-button fancybox-button--share" title="{{SHARE}}">' + '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M2.55 19c1.4-8.4 9.1-9.8 11.9-9.8V5l7 7-7 6.3v-3.5c-2.8 0-10.5 2.1-11.9 4.2z"/></svg>' + "</button>"
        },
        share: {
            url: function(instance, item) {
                return (!instance.currentHash && !(item.type === "inline" || item.type === "html") ? item.origSrc || item.src : false) || window.location;
            },
            tpl: '<div class="fancybox-share">' + "<h1>{{SHARE}}</h1>" + "<p>" + '<a class="fancybox-share__button fancybox-share__button--fb" href="https://www.facebook.com/sharer/sharer.php?u={{url}}">' + '<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="m287 456v-299c0-21 6-35 35-35h38v-63c-7-1-29-3-55-3-54 0-91 33-91 94v306m143-254h-205v72h196" /></svg>' + "<span>Facebook</span>" + "</a>" + '<a class="fancybox-share__button fancybox-share__button--tw" href="https://twitter.com/intent/tweet?url={{url}}&text={{descr}}">' + '<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="m456 133c-14 7-31 11-47 13 17-10 30-27 37-46-15 10-34 16-52 20-61-62-157-7-141 75-68-3-129-35-169-85-22 37-11 86 26 109-13 0-26-4-37-9 0 39 28 72 65 80-12 3-25 4-37 2 10 33 41 57 77 57-42 30-77 38-122 34 170 111 378-32 359-208 16-11 30-25 41-42z" /></svg>' + "<span>Twitter</span>" + "</a>" + '<a class="fancybox-share__button fancybox-share__button--pt" href="https://www.pinterest.com/pin/create/button/?url={{url}}&description={{descr}}&media={{media}}">' + '<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="m265 56c-109 0-164 78-164 144 0 39 15 74 47 87 5 2 10 0 12-5l4-19c2-6 1-8-3-13-9-11-15-25-15-45 0-58 43-110 113-110 62 0 96 38 96 88 0 67-30 122-73 122-24 0-42-19-36-44 6-29 20-60 20-81 0-19-10-35-31-35-25 0-44 26-44 60 0 21 7 36 7 36l-30 125c-8 37-1 83 0 87 0 3 4 4 5 2 2-3 32-39 42-75l16-64c8 16 31 29 56 29 74 0 124-67 124-157 0-69-58-132-146-132z" fill="#fff"/></svg>' + "<span>Pinterest</span>" + "</a>" + "</p>" + '<p><input class="fancybox-share__input" type="text" value="{{url_raw}}" onclick="select()" /></p>' + "</div>"
        }
    });
    function escapeHtml(string) {
        var entityMap = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;",
            "/": "&#x2F;",
            "`": "&#x60;",
            "=": "&#x3D;"
        };
        return String(string).replace(/[&<>"'`=\/]/g, function(s) {
            return entityMap[s];
        });
    }
    $(document).on("click", "[data-fancybox-share]", function() {
        var instance = $.fancybox.getInstance(), current = instance.current || null, url, tpl;
        if (!current) {
            return;
        }
        if ($.type(current.opts.share.url) === "function") {
            url = current.opts.share.url.apply(current, [ instance, current ]);
        }
        tpl = current.opts.share.tpl.replace(/\{\{media\}\}/g, current.type === "image" ? encodeURIComponent(current.src) : "").replace(/\{\{url\}\}/g, encodeURIComponent(url)).replace(/\{\{url_raw\}\}/g, escapeHtml(url)).replace(/\{\{descr\}\}/g, instance.$caption ? encodeURIComponent(instance.$caption.text()) : "");
        $.fancybox.open({
            src: instance.translate(instance, tpl),
            type: "html",
            opts: {
                touch: false,
                animationEffect: false,
                afterLoad: function(shareInstance, shareCurrent) {
                    instance.$refs.container.one("beforeClose.fb", function() {
                        shareInstance.close(null, 0);
                    });
                    shareCurrent.$content.find(".fancybox-share__button").click(function() {
                        window.open(this.href, "Share", "width=550, height=450");
                        return false;
                    });
                },
                mobile: {
                    autoFocus: false
                }
            }
        });
    });
})(document, jQuery);

(function(window, document, $) {
    "use strict";
    if (!$.escapeSelector) {
        $.escapeSelector = function(sel) {
            var rcssescape = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\x80-\uFFFF\w-]/g;
            var fcssescape = function(ch, asCodePoint) {
                if (asCodePoint) {
                    if (ch === "\0") {
                        return "�";
                    }
                    return ch.slice(0, -1) + "\\" + ch.charCodeAt(ch.length - 1).toString(16) + " ";
                }
                return "\\" + ch;
            };
            return (sel + "").replace(rcssescape, fcssescape);
        };
    }
    function parseUrl() {
        var hash = window.location.hash.substr(1), rez = hash.split("-"), index = rez.length > 1 && /^\+?\d+$/.test(rez[rez.length - 1]) ? parseInt(rez.pop(-1), 10) || 1 : 1, gallery = rez.join("-");
        return {
            hash: hash,
            index: index < 1 ? 1 : index,
            gallery: gallery
        };
    }
    function triggerFromUrl(url) {
        if (url.gallery !== "") {
            $("[data-fancybox='" + $.escapeSelector(url.gallery) + "']").eq(url.index - 1).focus().trigger("click.fb-start");
        }
    }
    function getGalleryID(instance) {
        var opts, ret;
        if (!instance) {
            return false;
        }
        opts = instance.current ? instance.current.opts : instance.opts;
        ret = opts.hash || (opts.$orig ? opts.$orig.data("fancybox") || opts.$orig.data("fancybox-trigger") : "");
        return ret === "" ? false : ret;
    }
    $(function() {
        if ($.fancybox.defaults.hash === false) {
            return;
        }
        $(document).on({
            "onInit.fb": function(e, instance) {
                var url, gallery;
                if (instance.group[instance.currIndex].opts.hash === false) {
                    return;
                }
                url = parseUrl();
                gallery = getGalleryID(instance);
                if (gallery && url.gallery && gallery == url.gallery) {
                    instance.currIndex = url.index - 1;
                }
            },
            "beforeShow.fb": function(e, instance, current, firstRun) {
                var gallery;
                if (!current || current.opts.hash === false) {
                    return;
                }
                gallery = getGalleryID(instance);
                if (!gallery) {
                    return;
                }
                instance.currentHash = gallery + (instance.group.length > 1 ? "-" + (current.index + 1) : "");
                if (window.location.hash === "#" + instance.currentHash) {
                    return;
                }
                if (firstRun && !instance.origHash) {
                    instance.origHash = window.location.hash;
                }
                if (instance.hashTimer) {
                    clearTimeout(instance.hashTimer);
                }
                instance.hashTimer = setTimeout(function() {
                    if ("replaceState" in window.history) {
                        window.history[firstRun ? "pushState" : "replaceState"]({}, document.title, window.location.pathname + window.location.search + "#" + instance.currentHash);
                        if (firstRun) {
                            instance.hasCreatedHistory = true;
                        }
                    } else {
                        window.location.hash = instance.currentHash;
                    }
                    instance.hashTimer = null;
                }, 300);
            },
            "beforeClose.fb": function(e, instance, current) {
                if (!current || current.opts.hash === false) {
                    return;
                }
                clearTimeout(instance.hashTimer);
                if (instance.currentHash && instance.hasCreatedHistory) {
                    window.history.back();
                } else if (instance.currentHash) {
                    if ("replaceState" in window.history) {
                        window.history.replaceState({}, document.title, window.location.pathname + window.location.search + (instance.origHash || ""));
                    } else {
                        window.location.hash = instance.origHash;
                    }
                }
                instance.currentHash = null;
            }
        });
        $(window).on("hashchange.fb", function() {
            var url = parseUrl(), fb = null;
            $.each($(".fancybox-container").get().reverse(), function(index, value) {
                var tmp = $(value).data("FancyBox");
                if (tmp && tmp.currentHash) {
                    fb = tmp;
                    return false;
                }
            });
            if (fb) {
                if (fb.currentHash !== url.gallery + "-" + url.index && !(url.index === 1 && fb.currentHash == url.gallery)) {
                    fb.currentHash = null;
                    fb.close();
                }
            } else if (url.gallery !== "") {
                triggerFromUrl(url);
            }
        });
        setTimeout(function() {
            if (!$.fancybox.getInstance()) {
                triggerFromUrl(parseUrl());
            }
        }, 50);
    });
})(window, document, jQuery);

(function(document, $) {
    "use strict";
    var prevTime = new Date().getTime();
    $(document).on({
        "onInit.fb": function(e, instance, current) {
            instance.$refs.stage.on("mousewheel DOMMouseScroll wheel MozMousePixelScroll", function(e) {
                var current = instance.current, currTime = new Date().getTime();
                if (instance.group.length < 2 || current.opts.wheel === false || current.opts.wheel === "auto" && current.type !== "image") {
                    return;
                }
                e.preventDefault();
                e.stopPropagation();
                if (current.$slide.hasClass("fancybox-animated")) {
                    return;
                }
                e = e.originalEvent || e;
                if (currTime - prevTime < 250) {
                    return;
                }
                prevTime = currTime;
                instance[(-e.deltaY || -e.deltaX || e.wheelDelta || -e.detail) < 0 ? "next" : "previous"]();
            });
        }
    });
})(document, jQuery);

(function($, window, document, undefined) {
    function Owl(element, options) {
        this.settings = null;
        this.options = $.extend({}, Owl.Defaults, options);
        this.$element = $(element);
        this._handlers = {};
        this._plugins = {};
        this._supress = {};
        this._current = null;
        this._speed = null;
        this._coordinates = [];
        this._breakpoint = null;
        this._width = null;
        this._items = [];
        this._clones = [];
        this._mergers = [];
        this._widths = [];
        this._invalidated = {};
        this._pipe = [];
        this._drag = {
            time: null,
            target: null,
            pointer: null,
            stage: {
                start: null,
                current: null
            },
            direction: null
        };
        this._states = {
            current: {},
            tags: {
                initializing: [ "busy" ],
                animating: [ "busy" ],
                dragging: [ "interacting" ]
            }
        };
        $.each([ "onResize", "onThrottledResize" ], $.proxy(function(i, handler) {
            this._handlers[handler] = $.proxy(this[handler], this);
        }, this));
        $.each(Owl.Plugins, $.proxy(function(key, plugin) {
            this._plugins[key.charAt(0).toLowerCase() + key.slice(1)] = new plugin(this);
        }, this));
        $.each(Owl.Workers, $.proxy(function(priority, worker) {
            this._pipe.push({
                filter: worker.filter,
                run: $.proxy(worker.run, this)
            });
        }, this));
        this.setup();
        this.initialize();
    }
    Owl.Defaults = {
        items: 3,
        loop: false,
        center: false,
        rewind: false,
        checkVisibility: true,
        mouseDrag: true,
        touchDrag: true,
        pullDrag: true,
        freeDrag: false,
        margin: 0,
        stagePadding: 0,
        merge: false,
        mergeFit: true,
        autoWidth: false,
        startPosition: 0,
        rtl: false,
        smartSpeed: 250,
        fluidSpeed: false,
        dragEndSpeed: false,
        responsive: {},
        responsiveRefreshRate: 200,
        responsiveBaseElement: window,
        fallbackEasing: "swing",
        slideTransition: "",
        info: false,
        nestedItemSelector: false,
        itemElement: "div",
        stageElement: "div",
        refreshClass: "owl-refresh",
        loadedClass: "owl-loaded",
        loadingClass: "owl-loading",
        rtlClass: "owl-rtl",
        responsiveClass: "owl-responsive",
        dragClass: "owl-drag",
        itemClass: "owl-item",
        stageClass: "owl-stage",
        stageOuterClass: "owl-stage-outer",
        grabClass: "owl-grab"
    };
    Owl.Width = {
        Default: "default",
        Inner: "inner",
        Outer: "outer"
    };
    Owl.Type = {
        Event: "event",
        State: "state"
    };
    Owl.Plugins = {};
    Owl.Workers = [ {
        filter: [ "width", "settings" ],
        run: function() {
            this._width = this.$element.width();
        }
    }, {
        filter: [ "width", "items", "settings" ],
        run: function(cache) {
            cache.current = this._items && this._items[this.relative(this._current)];
        }
    }, {
        filter: [ "items", "settings" ],
        run: function() {
            this.$stage.children(".cloned").remove();
        }
    }, {
        filter: [ "width", "items", "settings" ],
        run: function(cache) {
            var margin = this.settings.margin || "", grid = !this.settings.autoWidth, rtl = this.settings.rtl, css = {
                width: "auto",
                "margin-left": rtl ? margin : "",
                "margin-right": rtl ? "" : margin
            };
            !grid && this.$stage.children().css(css);
            cache.css = css;
        }
    }, {
        filter: [ "width", "items", "settings" ],
        run: function(cache) {
            var width = (this.width() / this.settings.items).toFixed(3) - this.settings.margin, merge = null, iterator = this._items.length, grid = !this.settings.autoWidth, widths = [];
            cache.items = {
                merge: false,
                width: width
            };
            while (iterator--) {
                merge = this._mergers[iterator];
                merge = this.settings.mergeFit && Math.min(merge, this.settings.items) || merge;
                cache.items.merge = merge > 1 || cache.items.merge;
                widths[iterator] = !grid ? this._items[iterator].width() : width * merge;
            }
            this._widths = widths;
        }
    }, {
        filter: [ "items", "settings" ],
        run: function() {
            var clones = [], items = this._items, settings = this.settings, view = Math.max(settings.items * 2, 4), size = Math.ceil(items.length / 2) * 2, repeat = settings.loop && items.length ? settings.rewind ? view : Math.max(view, size) : 0, append = "", prepend = "";
            repeat /= 2;
            while (repeat > 0) {
                clones.push(this.normalize(clones.length / 2, true));
                append = append + items[clones[clones.length - 1]][0].outerHTML;
                clones.push(this.normalize(items.length - 1 - (clones.length - 1) / 2, true));
                prepend = items[clones[clones.length - 1]][0].outerHTML + prepend;
                repeat -= 1;
            }
            this._clones = clones;
            $(append).addClass("cloned").appendTo(this.$stage);
            $(prepend).addClass("cloned").prependTo(this.$stage);
        }
    }, {
        filter: [ "width", "items", "settings" ],
        run: function() {
            var rtl = this.settings.rtl ? 1 : -1, size = this._clones.length + this._items.length, iterator = -1, previous = 0, current = 0, coordinates = [];
            while (++iterator < size) {
                previous = coordinates[iterator - 1] || 0;
                current = this._widths[this.relative(iterator)] + this.settings.margin;
                coordinates.push(previous + current * rtl);
            }
            this._coordinates = coordinates;
        }
    }, {
        filter: [ "width", "items", "settings" ],
        run: function() {
            var padding = this.settings.stagePadding, coordinates = this._coordinates, css = {
                width: Math.ceil(Math.abs(coordinates[coordinates.length - 1])) + padding * 2,
                "padding-left": padding || "",
                "padding-right": padding || ""
            };
            this.$stage.css(css);
        }
    }, {
        filter: [ "width", "items", "settings" ],
        run: function(cache) {
            var iterator = this._coordinates.length, grid = !this.settings.autoWidth, items = this.$stage.children();
            if (grid && cache.items.merge) {
                while (iterator--) {
                    cache.css.width = this._widths[this.relative(iterator)];
                    items.eq(iterator).css(cache.css);
                }
            } else if (grid) {
                cache.css.width = cache.items.width;
                items.css(cache.css);
            }
        }
    }, {
        filter: [ "items" ],
        run: function() {
            this._coordinates.length < 1 && this.$stage.removeAttr("style");
        }
    }, {
        filter: [ "width", "items", "settings" ],
        run: function(cache) {
            cache.current = cache.current ? this.$stage.children().index(cache.current) : 0;
            cache.current = Math.max(this.minimum(), Math.min(this.maximum(), cache.current));
            this.reset(cache.current);
        }
    }, {
        filter: [ "position" ],
        run: function() {
            this.animate(this.coordinates(this._current));
        }
    }, {
        filter: [ "width", "position", "items", "settings" ],
        run: function() {
            var rtl = this.settings.rtl ? 1 : -1, padding = this.settings.stagePadding * 2, begin = this.coordinates(this.current()) + padding, end = begin + this.width() * rtl, inner, outer, matches = [], i, n;
            for (i = 0, n = this._coordinates.length; i < n; i++) {
                inner = this._coordinates[i - 1] || 0;
                outer = Math.abs(this._coordinates[i]) + padding * rtl;
                if (this.op(inner, "<=", begin) && this.op(inner, ">", end) || this.op(outer, "<", begin) && this.op(outer, ">", end)) {
                    matches.push(i);
                }
            }
            this.$stage.children(".active").removeClass("active");
            this.$stage.children(":eq(" + matches.join("), :eq(") + ")").addClass("active");
            this.$stage.children(".center").removeClass("center");
            if (this.settings.center) {
                this.$stage.children().eq(this.current()).addClass("center");
            }
        }
    } ];
    Owl.prototype.initializeStage = function() {
        this.$stage = this.$element.find("." + this.settings.stageClass);
        if (this.$stage.length) {
            return;
        }
        this.$element.addClass(this.options.loadingClass);
        this.$stage = $("<" + this.settings.stageElement + ">", {
            class: this.settings.stageClass
        }).wrap($("<div/>", {
            class: this.settings.stageOuterClass
        }));
        this.$element.append(this.$stage.parent());
    };
    Owl.prototype.initializeItems = function() {
        var $items = this.$element.find(".owl-item");
        if ($items.length) {
            this._items = $items.get().map(function(item) {
                return $(item);
            });
            this._mergers = this._items.map(function() {
                return 1;
            });
            this.refresh();
            return;
        }
        this.replace(this.$element.children().not(this.$stage.parent()));
        if (this.isVisible()) {
            this.refresh();
        } else {
            this.invalidate("width");
        }
        this.$element.removeClass(this.options.loadingClass).addClass(this.options.loadedClass);
    };
    Owl.prototype.initialize = function() {
        this.enter("initializing");
        this.trigger("initialize");
        this.$element.toggleClass(this.settings.rtlClass, this.settings.rtl);
        if (this.settings.autoWidth && !this.is("pre-loading")) {
            var imgs, nestedSelector, width;
            imgs = this.$element.find("img");
            nestedSelector = this.settings.nestedItemSelector ? "." + this.settings.nestedItemSelector : undefined;
            width = this.$element.children(nestedSelector).width();
            if (imgs.length && width <= 0) {
                this.preloadAutoWidthImages(imgs);
            }
        }
        this.initializeStage();
        this.initializeItems();
        this.registerEventHandlers();
        this.leave("initializing");
        this.trigger("initialized");
    };
    Owl.prototype.isVisible = function() {
        return this.settings.checkVisibility ? this.$element.is(":visible") : true;
    };
    Owl.prototype.setup = function() {
        var viewport = this.viewport(), overwrites = this.options.responsive, match = -1, settings = null;
        if (!overwrites) {
            settings = $.extend({}, this.options);
        } else {
            $.each(overwrites, function(breakpoint) {
                if (breakpoint <= viewport && breakpoint > match) {
                    match = Number(breakpoint);
                }
            });
            settings = $.extend({}, this.options, overwrites[match]);
            if (typeof settings.stagePadding === "function") {
                settings.stagePadding = settings.stagePadding();
            }
            delete settings.responsive;
            if (settings.responsiveClass) {
                this.$element.attr("class", this.$element.attr("class").replace(new RegExp("(" + this.options.responsiveClass + "-)\\S+\\s", "g"), "$1" + match));
            }
        }
        this.trigger("change", {
            property: {
                name: "settings",
                value: settings
            }
        });
        this._breakpoint = match;
        this.settings = settings;
        this.invalidate("settings");
        this.trigger("changed", {
            property: {
                name: "settings",
                value: this.settings
            }
        });
    };
    Owl.prototype.optionsLogic = function() {
        if (this.settings.autoWidth) {
            this.settings.stagePadding = false;
            this.settings.merge = false;
        }
    };
    Owl.prototype.prepare = function(item) {
        var event = this.trigger("prepare", {
            content: item
        });
        if (!event.data) {
            event.data = $("<" + this.settings.itemElement + "/>").addClass(this.options.itemClass).append(item);
        }
        this.trigger("prepared", {
            content: event.data
        });
        return event.data;
    };
    Owl.prototype.update = function() {
        var i = 0, n = this._pipe.length, filter = $.proxy(function(p) {
            return this[p];
        }, this._invalidated), cache = {};
        while (i < n) {
            if (this._invalidated.all || $.grep(this._pipe[i].filter, filter).length > 0) {
                this._pipe[i].run(cache);
            }
            i++;
        }
        this._invalidated = {};
        !this.is("valid") && this.enter("valid");
    };
    Owl.prototype.width = function(dimension) {
        dimension = dimension || Owl.Width.Default;
        switch (dimension) {
          case Owl.Width.Inner:
          case Owl.Width.Outer:
            return this._width;

          default:
            return this._width - this.settings.stagePadding * 2 + this.settings.margin;
        }
    };
    Owl.prototype.refresh = function() {
        this.enter("refreshing");
        this.trigger("refresh");
        this.setup();
        this.optionsLogic();
        this.$element.addClass(this.options.refreshClass);
        this.update();
        this.$element.removeClass(this.options.refreshClass);
        this.leave("refreshing");
        this.trigger("refreshed");
    };
    Owl.prototype.onThrottledResize = function() {
        window.clearTimeout(this.resizeTimer);
        this.resizeTimer = window.setTimeout(this._handlers.onResize, this.settings.responsiveRefreshRate);
    };
    Owl.prototype.onResize = function() {
        if (!this._items.length) {
            return false;
        }
        if (this._width === this.$element.width()) {
            return false;
        }
        if (!this.isVisible()) {
            return false;
        }
        this.enter("resizing");
        if (this.trigger("resize").isDefaultPrevented()) {
            this.leave("resizing");
            return false;
        }
        this.invalidate("width");
        this.refresh();
        this.leave("resizing");
        this.trigger("resized");
    };
    Owl.prototype.registerEventHandlers = function() {
        if ($.support.transition) {
            this.$stage.on($.support.transition.end + ".owl.core", $.proxy(this.onTransitionEnd, this));
        }
        if (this.settings.responsive !== false) {
            this.on(window, "resize", this._handlers.onThrottledResize);
        }
        if (this.settings.mouseDrag) {
            this.$element.addClass(this.options.dragClass);
            this.$stage.on("mousedown.owl.core", $.proxy(this.onDragStart, this));
            this.$stage.on("dragstart.owl.core selectstart.owl.core", function() {
                return false;
            });
        }
        if (this.settings.touchDrag) {
            this.$stage.on("touchstart.owl.core", $.proxy(this.onDragStart, this));
            this.$stage.on("touchcancel.owl.core", $.proxy(this.onDragEnd, this));
        }
    };
    Owl.prototype.onDragStart = function(event) {
        var stage = null;
        if (event.which === 3) {
            return;
        }
        if ($.support.transform) {
            stage = this.$stage.css("transform").replace(/.*\(|\)| /g, "").split(",");
            stage = {
                x: stage[stage.length === 16 ? 12 : 4],
                y: stage[stage.length === 16 ? 13 : 5]
            };
        } else {
            stage = this.$stage.position();
            stage = {
                x: this.settings.rtl ? stage.left + this.$stage.width() - this.width() + this.settings.margin : stage.left,
                y: stage.top
            };
        }
        if (this.is("animating")) {
            $.support.transform ? this.animate(stage.x) : this.$stage.stop();
            this.invalidate("position");
        }
        this.$element.toggleClass(this.options.grabClass, event.type === "mousedown");
        this.speed(0);
        this._drag.time = new Date().getTime();
        this._drag.target = $(event.target);
        this._drag.stage.start = stage;
        this._drag.stage.current = stage;
        this._drag.pointer = this.pointer(event);
        $(document).on("mouseup.owl.core touchend.owl.core", $.proxy(this.onDragEnd, this));
        $(document).one("mousemove.owl.core touchmove.owl.core", $.proxy(function(event) {
            var delta = this.difference(this._drag.pointer, this.pointer(event));
            $(document).on("mousemove.owl.core touchmove.owl.core", $.proxy(this.onDragMove, this));
            if (Math.abs(delta.x) < Math.abs(delta.y) && this.is("valid")) {
                return;
            }
            event.preventDefault();
            this.enter("dragging");
            this.trigger("drag");
        }, this));
    };
    Owl.prototype.onDragMove = function(event) {
        var minimum = null, maximum = null, pull = null, delta = this.difference(this._drag.pointer, this.pointer(event)), stage = this.difference(this._drag.stage.start, delta);
        if (!this.is("dragging")) {
            return;
        }
        event.preventDefault();
        if (this.settings.loop) {
            minimum = this.coordinates(this.minimum());
            maximum = this.coordinates(this.maximum() + 1) - minimum;
            stage.x = ((stage.x - minimum) % maximum + maximum) % maximum + minimum;
        } else {
            minimum = this.settings.rtl ? this.coordinates(this.maximum()) : this.coordinates(this.minimum());
            maximum = this.settings.rtl ? this.coordinates(this.minimum()) : this.coordinates(this.maximum());
            pull = this.settings.pullDrag ? -1 * delta.x / 5 : 0;
            stage.x = Math.max(Math.min(stage.x, minimum + pull), maximum + pull);
        }
        this._drag.stage.current = stage;
        this.animate(stage.x);
    };
    Owl.prototype.onDragEnd = function(event) {
        var delta = this.difference(this._drag.pointer, this.pointer(event)), stage = this._drag.stage.current, direction = delta.x > 0 ^ this.settings.rtl ? "left" : "right";
        $(document).off(".owl.core");
        this.$element.removeClass(this.options.grabClass);
        if (delta.x !== 0 && this.is("dragging") || !this.is("valid")) {
            this.speed(this.settings.dragEndSpeed || this.settings.smartSpeed);
            this.current(this.closest(stage.x, delta.x !== 0 ? direction : this._drag.direction));
            this.invalidate("position");
            this.update();
            this._drag.direction = direction;
            if (Math.abs(delta.x) > 3 || new Date().getTime() - this._drag.time > 300) {
                this._drag.target.one("click.owl.core", function() {
                    return false;
                });
            }
        }
        if (!this.is("dragging")) {
            return;
        }
        this.leave("dragging");
        this.trigger("dragged");
    };
    Owl.prototype.closest = function(coordinate, direction) {
        var position = -1, pull = 30, width = this.width(), coordinates = this.coordinates();
        if (!this.settings.freeDrag) {
            $.each(coordinates, $.proxy(function(index, value) {
                if (direction === "left" && coordinate > value - pull && coordinate < value + pull) {
                    position = index;
                } else if (direction === "right" && coordinate > value - width - pull && coordinate < value - width + pull) {
                    position = index + 1;
                } else if (this.op(coordinate, "<", value) && this.op(coordinate, ">", coordinates[index + 1] !== undefined ? coordinates[index + 1] : value - width)) {
                    position = direction === "left" ? index + 1 : index;
                }
                return position === -1;
            }, this));
        }
        if (!this.settings.loop) {
            if (this.op(coordinate, ">", coordinates[this.minimum()])) {
                position = coordinate = this.minimum();
            } else if (this.op(coordinate, "<", coordinates[this.maximum()])) {
                position = coordinate = this.maximum();
            }
        }
        return position;
    };
    Owl.prototype.animate = function(coordinate) {
        var animate = this.speed() > 0;
        this.is("animating") && this.onTransitionEnd();
        if (animate) {
            this.enter("animating");
            this.trigger("translate");
        }
        if ($.support.transform3d && $.support.transition) {
            this.$stage.css({
                transform: "translate3d(" + coordinate + "px,0px,0px)",
                transition: this.speed() / 1e3 + "s" + (this.settings.slideTransition ? " " + this.settings.slideTransition : "")
            });
        } else if (animate) {
            this.$stage.animate({
                left: coordinate + "px"
            }, this.speed(), this.settings.fallbackEasing, $.proxy(this.onTransitionEnd, this));
        } else {
            this.$stage.css({
                left: coordinate + "px"
            });
        }
    };
    Owl.prototype.is = function(state) {
        return this._states.current[state] && this._states.current[state] > 0;
    };
    Owl.prototype.current = function(position) {
        if (position === undefined) {
            return this._current;
        }
        if (this._items.length === 0) {
            return undefined;
        }
        position = this.normalize(position);
        if (this._current !== position) {
            var event = this.trigger("change", {
                property: {
                    name: "position",
                    value: position
                }
            });
            if (event.data !== undefined) {
                position = this.normalize(event.data);
            }
            this._current = position;
            this.invalidate("position");
            this.trigger("changed", {
                property: {
                    name: "position",
                    value: this._current
                }
            });
        }
        return this._current;
    };
    Owl.prototype.invalidate = function(part) {
        if ($.type(part) === "string") {
            this._invalidated[part] = true;
            this.is("valid") && this.leave("valid");
        }
        return $.map(this._invalidated, function(v, i) {
            return i;
        });
    };
    Owl.prototype.reset = function(position) {
        position = this.normalize(position);
        if (position === undefined) {
            return;
        }
        this._speed = 0;
        this._current = position;
        this.suppress([ "translate", "translated" ]);
        this.animate(this.coordinates(position));
        this.release([ "translate", "translated" ]);
    };
    Owl.prototype.normalize = function(position, relative) {
        var n = this._items.length, m = relative ? 0 : this._clones.length;
        if (!this.isNumeric(position) || n < 1) {
            position = undefined;
        } else if (position < 0 || position >= n + m) {
            position = ((position - m / 2) % n + n) % n + m / 2;
        }
        return position;
    };
    Owl.prototype.relative = function(position) {
        position -= this._clones.length / 2;
        return this.normalize(position, true);
    };
    Owl.prototype.maximum = function(relative) {
        var settings = this.settings, maximum = this._coordinates.length, iterator, reciprocalItemsWidth, elementWidth;
        if (settings.loop) {
            maximum = this._clones.length / 2 + this._items.length - 1;
        } else if (settings.autoWidth || settings.merge) {
            iterator = this._items.length;
            if (iterator) {
                reciprocalItemsWidth = this._items[--iterator].width();
                elementWidth = this.$element.width();
                while (iterator--) {
                    reciprocalItemsWidth += this._items[iterator].width() + this.settings.margin;
                    if (reciprocalItemsWidth > elementWidth) {
                        break;
                    }
                }
            }
            maximum = iterator + 1;
        } else if (settings.center) {
            maximum = this._items.length - 1;
        } else {
            maximum = this._items.length - settings.items;
        }
        if (relative) {
            maximum -= this._clones.length / 2;
        }
        return Math.max(maximum, 0);
    };
    Owl.prototype.minimum = function(relative) {
        return relative ? 0 : this._clones.length / 2;
    };
    Owl.prototype.items = function(position) {
        if (position === undefined) {
            return this._items.slice();
        }
        position = this.normalize(position, true);
        return this._items[position];
    };
    Owl.prototype.mergers = function(position) {
        if (position === undefined) {
            return this._mergers.slice();
        }
        position = this.normalize(position, true);
        return this._mergers[position];
    };
    Owl.prototype.clones = function(position) {
        var odd = this._clones.length / 2, even = odd + this._items.length, map = function(index) {
            return index % 2 === 0 ? even + index / 2 : odd - (index + 1) / 2;
        };
        if (position === undefined) {
            return $.map(this._clones, function(v, i) {
                return map(i);
            });
        }
        return $.map(this._clones, function(v, i) {
            return v === position ? map(i) : null;
        });
    };
    Owl.prototype.speed = function(speed) {
        if (speed !== undefined) {
            this._speed = speed;
        }
        return this._speed;
    };
    Owl.prototype.coordinates = function(position) {
        var multiplier = 1, newPosition = position - 1, coordinate;
        if (position === undefined) {
            return $.map(this._coordinates, $.proxy(function(coordinate, index) {
                return this.coordinates(index);
            }, this));
        }
        if (this.settings.center) {
            if (this.settings.rtl) {
                multiplier = -1;
                newPosition = position + 1;
            }
            coordinate = this._coordinates[position];
            coordinate += (this.width() - coordinate + (this._coordinates[newPosition] || 0)) / 2 * multiplier;
        } else {
            coordinate = this._coordinates[newPosition] || 0;
        }
        coordinate = Math.ceil(coordinate);
        return coordinate;
    };
    Owl.prototype.duration = function(from, to, factor) {
        if (factor === 0) {
            return 0;
        }
        return Math.min(Math.max(Math.abs(to - from), 1), 6) * Math.abs(factor || this.settings.smartSpeed);
    };
    Owl.prototype.to = function(position, speed) {
        var current = this.current(), revert = null, distance = position - this.relative(current), direction = (distance > 0) - (distance < 0), items = this._items.length, minimum = this.minimum(), maximum = this.maximum();
        if (this.settings.loop) {
            if (!this.settings.rewind && Math.abs(distance) > items / 2) {
                distance += direction * -1 * items;
            }
            position = current + distance;
            revert = ((position - minimum) % items + items) % items + minimum;
            if (revert !== position && revert - distance <= maximum && revert - distance > 0) {
                current = revert - distance;
                position = revert;
                this.reset(current);
            }
        } else if (this.settings.rewind) {
            maximum += 1;
            position = (position % maximum + maximum) % maximum;
        } else {
            position = Math.max(minimum, Math.min(maximum, position));
        }
        this.speed(this.duration(current, position, speed));
        this.current(position);
        if (this.isVisible()) {
            this.update();
        }
    };
    Owl.prototype.next = function(speed) {
        speed = speed || false;
        this.to(this.relative(this.current()) + 1, speed);
    };
    Owl.prototype.prev = function(speed) {
        speed = speed || false;
        this.to(this.relative(this.current()) - 1, speed);
    };
    Owl.prototype.onTransitionEnd = function(event) {
        if (event !== undefined) {
            event.stopPropagation();
            if ((event.target || event.srcElement || event.originalTarget) !== this.$stage.get(0)) {
                return false;
            }
        }
        this.leave("animating");
        this.trigger("translated");
    };
    Owl.prototype.viewport = function() {
        var width;
        if (this.options.responsiveBaseElement !== window) {
            width = $(this.options.responsiveBaseElement).width();
        } else if (window.innerWidth) {
            width = window.innerWidth;
        } else if (document.documentElement && document.documentElement.clientWidth) {
            width = document.documentElement.clientWidth;
        } else {
            console.warn("Can not detect viewport width.");
        }
        return width;
    };
    Owl.prototype.replace = function(content) {
        this.$stage.empty();
        this._items = [];
        if (content) {
            content = content instanceof jQuery ? content : $(content);
        }
        if (this.settings.nestedItemSelector) {
            content = content.find("." + this.settings.nestedItemSelector);
        }
        content.filter(function() {
            return this.nodeType === 1;
        }).each($.proxy(function(index, item) {
            item = this.prepare(item);
            this.$stage.append(item);
            this._items.push(item);
            this._mergers.push(item.find("[data-merge]").addBack("[data-merge]").attr("data-merge") * 1 || 1);
        }, this));
        this.reset(this.isNumeric(this.settings.startPosition) ? this.settings.startPosition : 0);
        this.invalidate("items");
    };
    Owl.prototype.add = function(content, position) {
        var current = this.relative(this._current);
        position = position === undefined ? this._items.length : this.normalize(position, true);
        content = content instanceof jQuery ? content : $(content);
        this.trigger("add", {
            content: content,
            position: position
        });
        content = this.prepare(content);
        if (this._items.length === 0 || position === this._items.length) {
            this._items.length === 0 && this.$stage.append(content);
            this._items.length !== 0 && this._items[position - 1].after(content);
            this._items.push(content);
            this._mergers.push(content.find("[data-merge]").addBack("[data-merge]").attr("data-merge") * 1 || 1);
        } else {
            this._items[position].before(content);
            this._items.splice(position, 0, content);
            this._mergers.splice(position, 0, content.find("[data-merge]").addBack("[data-merge]").attr("data-merge") * 1 || 1);
        }
        this._items[current] && this.reset(this._items[current].index());
        this.invalidate("items");
        this.trigger("added", {
            content: content,
            position: position
        });
    };
    Owl.prototype.remove = function(position) {
        position = this.normalize(position, true);
        if (position === undefined) {
            return;
        }
        this.trigger("remove", {
            content: this._items[position],
            position: position
        });
        this._items[position].remove();
        this._items.splice(position, 1);
        this._mergers.splice(position, 1);
        this.invalidate("items");
        this.trigger("removed", {
            content: null,
            position: position
        });
    };
    Owl.prototype.preloadAutoWidthImages = function(images) {
        images.each($.proxy(function(i, element) {
            this.enter("pre-loading");
            element = $(element);
            $(new Image()).one("load", $.proxy(function(e) {
                element.attr("src", e.target.src);
                element.css("opacity", 1);
                this.leave("pre-loading");
                !this.is("pre-loading") && !this.is("initializing") && this.refresh();
            }, this)).attr("src", element.attr("src") || element.attr("data-src") || element.attr("data-src-retina"));
        }, this));
    };
    Owl.prototype.destroy = function() {
        this.$element.off(".owl.core");
        this.$stage.off(".owl.core");
        $(document).off(".owl.core");
        if (this.settings.responsive !== false) {
            window.clearTimeout(this.resizeTimer);
            this.off(window, "resize", this._handlers.onThrottledResize);
        }
        for (var i in this._plugins) {
            this._plugins[i].destroy();
        }
        this.$stage.children(".cloned").remove();
        this.$stage.unwrap();
        this.$stage.children().contents().unwrap();
        this.$stage.children().unwrap();
        this.$stage.remove();
        this.$element.removeClass(this.options.refreshClass).removeClass(this.options.loadingClass).removeClass(this.options.loadedClass).removeClass(this.options.rtlClass).removeClass(this.options.dragClass).removeClass(this.options.grabClass).attr("class", this.$element.attr("class").replace(new RegExp(this.options.responsiveClass + "-\\S+\\s", "g"), "")).removeData("owl.carousel");
    };
    Owl.prototype.op = function(a, o, b) {
        var rtl = this.settings.rtl;
        switch (o) {
          case "<":
            return rtl ? a > b : a < b;

          case ">":
            return rtl ? a < b : a > b;

          case ">=":
            return rtl ? a <= b : a >= b;

          case "<=":
            return rtl ? a >= b : a <= b;

          default:
            break;
        }
    };
    Owl.prototype.on = function(element, event, listener, capture) {
        if (element.addEventListener) {
            element.addEventListener(event, listener, capture);
        } else if (element.attachEvent) {
            element.attachEvent("on" + event, listener);
        }
    };
    Owl.prototype.off = function(element, event, listener, capture) {
        if (element.removeEventListener) {
            element.removeEventListener(event, listener, capture);
        } else if (element.detachEvent) {
            element.detachEvent("on" + event, listener);
        }
    };
    Owl.prototype.trigger = function(name, data, namespace, state, enter) {
        var status = {
            item: {
                count: this._items.length,
                index: this.current()
            }
        }, handler = $.camelCase($.grep([ "on", name, namespace ], function(v) {
            return v;
        }).join("-").toLowerCase()), event = $.Event([ name, "owl", namespace || "carousel" ].join(".").toLowerCase(), $.extend({
            relatedTarget: this
        }, status, data));
        if (!this._supress[name]) {
            $.each(this._plugins, function(name, plugin) {
                if (plugin.onTrigger) {
                    plugin.onTrigger(event);
                }
            });
            this.register({
                type: Owl.Type.Event,
                name: name
            });
            this.$element.trigger(event);
            if (this.settings && typeof this.settings[handler] === "function") {
                this.settings[handler].call(this, event);
            }
        }
        return event;
    };
    Owl.prototype.enter = function(name) {
        $.each([ name ].concat(this._states.tags[name] || []), $.proxy(function(i, name) {
            if (this._states.current[name] === undefined) {
                this._states.current[name] = 0;
            }
            this._states.current[name]++;
        }, this));
    };
    Owl.prototype.leave = function(name) {
        $.each([ name ].concat(this._states.tags[name] || []), $.proxy(function(i, name) {
            this._states.current[name]--;
        }, this));
    };
    Owl.prototype.register = function(object) {
        if (object.type === Owl.Type.Event) {
            if (!$.event.special[object.name]) {
                $.event.special[object.name] = {};
            }
            if (!$.event.special[object.name].owl) {
                var _default = $.event.special[object.name]._default;
                $.event.special[object.name]._default = function(e) {
                    if (_default && _default.apply && (!e.namespace || e.namespace.indexOf("owl") === -1)) {
                        return _default.apply(this, arguments);
                    }
                    return e.namespace && e.namespace.indexOf("owl") > -1;
                };
                $.event.special[object.name].owl = true;
            }
        } else if (object.type === Owl.Type.State) {
            if (!this._states.tags[object.name]) {
                this._states.tags[object.name] = object.tags;
            } else {
                this._states.tags[object.name] = this._states.tags[object.name].concat(object.tags);
            }
            this._states.tags[object.name] = $.grep(this._states.tags[object.name], $.proxy(function(tag, i) {
                return $.inArray(tag, this._states.tags[object.name]) === i;
            }, this));
        }
    };
    Owl.prototype.suppress = function(events) {
        $.each(events, $.proxy(function(index, event) {
            this._supress[event] = true;
        }, this));
    };
    Owl.prototype.release = function(events) {
        $.each(events, $.proxy(function(index, event) {
            delete this._supress[event];
        }, this));
    };
    Owl.prototype.pointer = function(event) {
        var result = {
            x: null,
            y: null
        };
        event = event.originalEvent || event || window.event;
        event = event.touches && event.touches.length ? event.touches[0] : event.changedTouches && event.changedTouches.length ? event.changedTouches[0] : event;
        if (event.pageX) {
            result.x = event.pageX;
            result.y = event.pageY;
        } else {
            result.x = event.clientX;
            result.y = event.clientY;
        }
        return result;
    };
    Owl.prototype.isNumeric = function(number) {
        return !isNaN(parseFloat(number));
    };
    Owl.prototype.difference = function(first, second) {
        return {
            x: first.x - second.x,
            y: first.y - second.y
        };
    };
    $.fn.owlCarousel = function(option) {
        var args = Array.prototype.slice.call(arguments, 1);
        return this.each(function() {
            var $this = $(this), data = $this.data("owl.carousel");
            if (!data) {
                data = new Owl(this, typeof option == "object" && option);
                $this.data("owl.carousel", data);
                $.each([ "next", "prev", "to", "destroy", "refresh", "replace", "add", "remove" ], function(i, event) {
                    data.register({
                        type: Owl.Type.Event,
                        name: event
                    });
                    data.$element.on(event + ".owl.carousel.core", $.proxy(function(e) {
                        if (e.namespace && e.relatedTarget !== this) {
                            this.suppress([ event ]);
                            data[event].apply(this, [].slice.call(arguments, 1));
                            this.release([ event ]);
                        }
                    }, data));
                });
            }
            if (typeof option == "string" && option.charAt(0) !== "_") {
                data[option].apply(data, args);
            }
        });
    };
    $.fn.owlCarousel.Constructor = Owl;
})(window.Zepto || window.jQuery, window, document);

(function($, window, document, undefined) {
    var AutoRefresh = function(carousel) {
        this._core = carousel;
        this._interval = null;
        this._visible = null;
        this._handlers = {
            "initialized.owl.carousel": $.proxy(function(e) {
                if (e.namespace && this._core.settings.autoRefresh) {
                    this.watch();
                }
            }, this)
        };
        this._core.options = $.extend({}, AutoRefresh.Defaults, this._core.options);
        this._core.$element.on(this._handlers);
    };
    AutoRefresh.Defaults = {
        autoRefresh: true,
        autoRefreshInterval: 500
    };
    AutoRefresh.prototype.watch = function() {
        if (this._interval) {
            return;
        }
        this._visible = this._core.isVisible();
        this._interval = window.setInterval($.proxy(this.refresh, this), this._core.settings.autoRefreshInterval);
    };
    AutoRefresh.prototype.refresh = function() {
        if (this._core.isVisible() === this._visible) {
            return;
        }
        this._visible = !this._visible;
        this._core.$element.toggleClass("owl-hidden", !this._visible);
        this._visible && (this._core.invalidate("width") && this._core.refresh());
    };
    AutoRefresh.prototype.destroy = function() {
        var handler, property;
        window.clearInterval(this._interval);
        for (handler in this._handlers) {
            this._core.$element.off(handler, this._handlers[handler]);
        }
        for (property in Object.getOwnPropertyNames(this)) {
            typeof this[property] != "function" && (this[property] = null);
        }
    };
    $.fn.owlCarousel.Constructor.Plugins.AutoRefresh = AutoRefresh;
})(window.Zepto || window.jQuery, window, document);

(function($, window, document, undefined) {
    var Lazy = function(carousel) {
        this._core = carousel;
        this._loaded = [];
        this._handlers = {
            "initialized.owl.carousel change.owl.carousel resized.owl.carousel": $.proxy(function(e) {
                if (!e.namespace) {
                    return;
                }
                if (!this._core.settings || !this._core.settings.lazyLoad) {
                    return;
                }
                if (e.property && e.property.name == "position" || e.type == "initialized") {
                    var settings = this._core.settings, n = settings.center && Math.ceil(settings.items / 2) || settings.items, i = settings.center && n * -1 || 0, position = (e.property && e.property.value !== undefined ? e.property.value : this._core.current()) + i, clones = this._core.clones().length, load = $.proxy(function(i, v) {
                        this.load(v);
                    }, this);
                    if (settings.lazyLoadEager > 0) {
                        n += settings.lazyLoadEager;
                        if (settings.loop) {
                            position -= settings.lazyLoadEager;
                            n++;
                        }
                    }
                    while (i++ < n) {
                        this.load(clones / 2 + this._core.relative(position));
                        clones && $.each(this._core.clones(this._core.relative(position)), load);
                        position++;
                    }
                }
            }, this)
        };
        this._core.options = $.extend({}, Lazy.Defaults, this._core.options);
        this._core.$element.on(this._handlers);
    };
    Lazy.Defaults = {
        lazyLoad: false,
        lazyLoadEager: 0
    };
    Lazy.prototype.load = function(position) {
        var $item = this._core.$stage.children().eq(position), $elements = $item && $item.find(".owl-lazy");
        if (!$elements || $.inArray($item.get(0), this._loaded) > -1) {
            return;
        }
        $elements.each($.proxy(function(index, element) {
            var $element = $(element), image, url = window.devicePixelRatio > 1 && $element.attr("data-src-retina") || $element.attr("data-src") || $element.attr("data-srcset");
            this._core.trigger("load", {
                element: $element,
                url: url
            }, "lazy");
            if ($element.is("img")) {
                $element.one("load.owl.lazy", $.proxy(function() {
                    $element.css("opacity", 1);
                    this._core.trigger("loaded", {
                        element: $element,
                        url: url
                    }, "lazy");
                }, this)).attr("src", url);
            } else if ($element.is("source")) {
                $element.one("load.owl.lazy", $.proxy(function() {
                    this._core.trigger("loaded", {
                        element: $element,
                        url: url
                    }, "lazy");
                }, this)).attr("srcset", url);
            } else {
                image = new Image();
                image.onload = $.proxy(function() {
                    $element.css({
                        "background-image": 'url("' + url + '")',
                        opacity: "1"
                    });
                    this._core.trigger("loaded", {
                        element: $element,
                        url: url
                    }, "lazy");
                }, this);
                image.src = url;
            }
        }, this));
        this._loaded.push($item.get(0));
    };
    Lazy.prototype.destroy = function() {
        var handler, property;
        for (handler in this.handlers) {
            this._core.$element.off(handler, this.handlers[handler]);
        }
        for (property in Object.getOwnPropertyNames(this)) {
            typeof this[property] != "function" && (this[property] = null);
        }
    };
    $.fn.owlCarousel.Constructor.Plugins.Lazy = Lazy;
})(window.Zepto || window.jQuery, window, document);

(function($, window, document, undefined) {
    var AutoHeight = function(carousel) {
        this._core = carousel;
        this._previousHeight = null;
        this._handlers = {
            "initialized.owl.carousel refreshed.owl.carousel": $.proxy(function(e) {
                if (e.namespace && this._core.settings.autoHeight) {
                    this.update();
                }
            }, this),
            "changed.owl.carousel": $.proxy(function(e) {
                if (e.namespace && this._core.settings.autoHeight && e.property.name === "position") {
                    this.update();
                }
            }, this),
            "loaded.owl.lazy": $.proxy(function(e) {
                if (e.namespace && this._core.settings.autoHeight && e.element.closest("." + this._core.settings.itemClass).index() === this._core.current()) {
                    this.update();
                }
            }, this)
        };
        this._core.options = $.extend({}, AutoHeight.Defaults, this._core.options);
        this._core.$element.on(this._handlers);
        this._intervalId = null;
        var refThis = this;
        $(window).on("load", function() {
            if (refThis._core.settings.autoHeight) {
                refThis.update();
            }
        });
        $(window).resize(function() {
            if (refThis._core.settings.autoHeight) {
                if (refThis._intervalId != null) {
                    clearTimeout(refThis._intervalId);
                }
                refThis._intervalId = setTimeout(function() {
                    refThis.update();
                }, 250);
            }
        });
    };
    AutoHeight.Defaults = {
        autoHeight: false,
        autoHeightClass: "owl-height"
    };
    AutoHeight.prototype.update = function() {
        var start = this._core._current, end = start + this._core.settings.items, lazyLoadEnabled = this._core.settings.lazyLoad, visible = this._core.$stage.children().toArray().slice(start, end), heights = [], maxheight = 0;
        $.each(visible, function(index, item) {
            heights.push($(item).height());
        });
        maxheight = Math.max.apply(null, heights);
        if (maxheight <= 1 && lazyLoadEnabled && this._previousHeight) {
            maxheight = this._previousHeight;
        }
        this._previousHeight = maxheight;
        this._core.$stage.parent().height(maxheight).addClass(this._core.settings.autoHeightClass);
    };
    AutoHeight.prototype.destroy = function() {
        var handler, property;
        for (handler in this._handlers) {
            this._core.$element.off(handler, this._handlers[handler]);
        }
        for (property in Object.getOwnPropertyNames(this)) {
            typeof this[property] !== "function" && (this[property] = null);
        }
    };
    $.fn.owlCarousel.Constructor.Plugins.AutoHeight = AutoHeight;
})(window.Zepto || window.jQuery, window, document);

(function($, window, document, undefined) {
    var Video = function(carousel) {
        this._core = carousel;
        this._videos = {};
        this._playing = null;
        this._handlers = {
            "initialized.owl.carousel": $.proxy(function(e) {
                if (e.namespace) {
                    this._core.register({
                        type: "state",
                        name: "playing",
                        tags: [ "interacting" ]
                    });
                }
            }, this),
            "resize.owl.carousel": $.proxy(function(e) {
                if (e.namespace && this._core.settings.video && this.isInFullScreen()) {
                    e.preventDefault();
                }
            }, this),
            "refreshed.owl.carousel": $.proxy(function(e) {
                if (e.namespace && this._core.is("resizing")) {
                    this._core.$stage.find(".cloned .owl-video-frame").remove();
                }
            }, this),
            "changed.owl.carousel": $.proxy(function(e) {
                if (e.namespace && e.property.name === "position" && this._playing) {
                    this.stop();
                }
            }, this),
            "prepared.owl.carousel": $.proxy(function(e) {
                if (!e.namespace) {
                    return;
                }
                var $element = $(e.content).find(".owl-video");
                if ($element.length) {
                    $element.css("display", "none");
                    this.fetch($element, $(e.content));
                }
            }, this)
        };
        this._core.options = $.extend({}, Video.Defaults, this._core.options);
        this._core.$element.on(this._handlers);
        this._core.$element.on("click.owl.video", ".owl-video-play-icon", $.proxy(function(e) {
            this.play(e);
        }, this));
    };
    Video.Defaults = {
        video: false,
        videoHeight: false,
        videoWidth: false
    };
    Video.prototype.fetch = function(target, item) {
        var type = function() {
            if (target.attr("data-vimeo-id")) {
                return "vimeo";
            } else if (target.attr("data-vzaar-id")) {
                return "vzaar";
            } else {
                return "youtube";
            }
        }(), id = target.attr("data-vimeo-id") || target.attr("data-youtube-id") || target.attr("data-vzaar-id"), width = target.attr("data-width") || this._core.settings.videoWidth, height = target.attr("data-height") || this._core.settings.videoHeight, url = target.attr("href");
        if (url) {
            id = url.match(/(http:|https:|)\/\/(player.|www.|app.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com|be\-nocookie\.com)|vzaar\.com)\/(video\/|videos\/|embed\/|channels\/.+\/|groups\/.+\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/);
            if (id[3].indexOf("youtu") > -1) {
                type = "youtube";
            } else if (id[3].indexOf("vimeo") > -1) {
                type = "vimeo";
            } else if (id[3].indexOf("vzaar") > -1) {
                type = "vzaar";
            } else {
                throw new Error("Video URL not supported.");
            }
            id = id[6];
        } else {
            throw new Error("Missing video URL.");
        }
        this._videos[url] = {
            type: type,
            id: id,
            width: width,
            height: height
        };
        item.attr("data-video", url);
        this.thumbnail(target, this._videos[url]);
    };
    Video.prototype.thumbnail = function(target, video) {
        var tnLink, icon, path, dimensions = video.width && video.height ? "width:" + video.width + "px;height:" + video.height + "px;" : "", customTn = target.find("img"), srcType = "src", lazyClass = "", settings = this._core.settings, create = function(path) {
            icon = '<div class="owl-video-play-icon"></div>';
            if (settings.lazyLoad) {
                tnLink = $("<div/>", {
                    class: "owl-video-tn " + lazyClass,
                    srcType: path
                });
            } else {
                tnLink = $("<div/>", {
                    class: "owl-video-tn",
                    style: "opacity:1;background-image:url(" + path + ")"
                });
            }
            target.after(tnLink);
            target.after(icon);
        };
        target.wrap($("<div/>", {
            class: "owl-video-wrapper",
            style: dimensions
        }));
        if (this._core.settings.lazyLoad) {
            srcType = "data-src";
            lazyClass = "owl-lazy";
        }
        if (customTn.length) {
            create(customTn.attr(srcType));
            customTn.remove();
            return false;
        }
        if (video.type === "youtube") {
            path = "//img.youtube.com/vi/" + video.id + "/hqdefault.jpg";
            create(path);
        } else if (video.type === "vimeo") {
            $.ajax({
                type: "GET",
                url: "//vimeo.com/api/v2/video/" + video.id + ".json",
                jsonp: "callback",
                dataType: "jsonp",
                success: function(data) {
                    path = data[0].thumbnail_large;
                    create(path);
                }
            });
        } else if (video.type === "vzaar") {
            $.ajax({
                type: "GET",
                url: "//vzaar.com/api/videos/" + video.id + ".json",
                jsonp: "callback",
                dataType: "jsonp",
                success: function(data) {
                    path = data.framegrab_url;
                    create(path);
                }
            });
        }
    };
    Video.prototype.stop = function() {
        this._core.trigger("stop", null, "video");
        this._playing.find(".owl-video-frame").remove();
        this._playing.removeClass("owl-video-playing");
        this._playing = null;
        this._core.leave("playing");
        this._core.trigger("stopped", null, "video");
    };
    Video.prototype.play = function(event) {
        var target = $(event.target), item = target.closest("." + this._core.settings.itemClass), video = this._videos[item.attr("data-video")], width = video.width || "100%", height = video.height || this._core.$stage.height(), html, iframe;
        if (this._playing) {
            return;
        }
        this._core.enter("playing");
        this._core.trigger("play", null, "video");
        item = this._core.items(this._core.relative(item.index()));
        this._core.reset(item.index());
        html = $('<iframe frameborder="0" allowfullscreen mozallowfullscreen webkitAllowFullScreen ></iframe>');
        html.attr("height", height);
        html.attr("width", width);
        if (video.type === "youtube") {
            html.attr("src", "//www.youtube.com/embed/" + video.id + "?autoplay=1&rel=0&v=" + video.id);
        } else if (video.type === "vimeo") {
            html.attr("src", "//player.vimeo.com/video/" + video.id + "?autoplay=1");
        } else if (video.type === "vzaar") {
            html.attr("src", "//view.vzaar.com/" + video.id + "/player?autoplay=true");
        }
        iframe = $(html).wrap('<div class="owl-video-frame" />').insertAfter(item.find(".owl-video"));
        this._playing = item.addClass("owl-video-playing");
    };
    Video.prototype.isInFullScreen = function() {
        var element = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;
        return element && $(element).parent().hasClass("owl-video-frame");
    };
    Video.prototype.destroy = function() {
        var handler, property;
        this._core.$element.off("click.owl.video");
        for (handler in this._handlers) {
            this._core.$element.off(handler, this._handlers[handler]);
        }
        for (property in Object.getOwnPropertyNames(this)) {
            typeof this[property] != "function" && (this[property] = null);
        }
    };
    $.fn.owlCarousel.Constructor.Plugins.Video = Video;
})(window.Zepto || window.jQuery, window, document);

(function($, window, document, undefined) {
    var Animate = function(scope) {
        this.core = scope;
        this.core.options = $.extend({}, Animate.Defaults, this.core.options);
        this.swapping = true;
        this.previous = undefined;
        this.next = undefined;
        this.handlers = {
            "change.owl.carousel": $.proxy(function(e) {
                if (e.namespace && e.property.name == "position") {
                    this.previous = this.core.current();
                    this.next = e.property.value;
                }
            }, this),
            "drag.owl.carousel dragged.owl.carousel translated.owl.carousel": $.proxy(function(e) {
                if (e.namespace) {
                    this.swapping = e.type == "translated";
                }
            }, this),
            "translate.owl.carousel": $.proxy(function(e) {
                if (e.namespace && this.swapping && (this.core.options.animateOut || this.core.options.animateIn)) {
                    this.swap();
                }
            }, this)
        };
        this.core.$element.on(this.handlers);
    };
    Animate.Defaults = {
        animateOut: false,
        animateIn: false
    };
    Animate.prototype.swap = function() {
        if (this.core.settings.items !== 1) {
            return;
        }
        if (!$.support.animation || !$.support.transition) {
            return;
        }
        this.core.speed(0);
        var left, clear = $.proxy(this.clear, this), previous = this.core.$stage.children().eq(this.previous), next = this.core.$stage.children().eq(this.next), incoming = this.core.settings.animateIn, outgoing = this.core.settings.animateOut;
        if (this.core.current() === this.previous) {
            return;
        }
        if (outgoing) {
            left = this.core.coordinates(this.previous) - this.core.coordinates(this.next);
            previous.one($.support.animation.end, clear).css({
                left: left + "px"
            }).addClass("animated owl-animated-out").addClass(outgoing);
        }
        if (incoming) {
            next.one($.support.animation.end, clear).addClass("animated owl-animated-in").addClass(incoming);
        }
    };
    Animate.prototype.clear = function(e) {
        $(e.target).css({
            left: ""
        }).removeClass("animated owl-animated-out owl-animated-in").removeClass(this.core.settings.animateIn).removeClass(this.core.settings.animateOut);
        this.core.onTransitionEnd();
    };
    Animate.prototype.destroy = function() {
        var handler, property;
        for (handler in this.handlers) {
            this.core.$element.off(handler, this.handlers[handler]);
        }
        for (property in Object.getOwnPropertyNames(this)) {
            typeof this[property] != "function" && (this[property] = null);
        }
    };
    $.fn.owlCarousel.Constructor.Plugins.Animate = Animate;
})(window.Zepto || window.jQuery, window, document);

(function($, window, document, undefined) {
    var Autoplay = function(carousel) {
        this._core = carousel;
        this._call = null;
        this._time = 0;
        this._timeout = 0;
        this._paused = true;
        this._handlers = {
            "changed.owl.carousel": $.proxy(function(e) {
                if (e.namespace && e.property.name === "settings") {
                    if (this._core.settings.autoplay) {
                        this.play();
                    } else {
                        this.stop();
                    }
                } else if (e.namespace && e.property.name === "position" && this._paused) {
                    this._time = 0;
                }
            }, this),
            "initialized.owl.carousel": $.proxy(function(e) {
                if (e.namespace && this._core.settings.autoplay) {
                    this.play();
                }
            }, this),
            "play.owl.autoplay": $.proxy(function(e, t, s) {
                if (e.namespace) {
                    this.play(t, s);
                }
            }, this),
            "stop.owl.autoplay": $.proxy(function(e) {
                if (e.namespace) {
                    this.stop();
                }
            }, this),
            "mouseover.owl.autoplay": $.proxy(function() {
                if (this._core.settings.autoplayHoverPause && this._core.is("rotating")) {
                    this.pause();
                }
            }, this),
            "mouseleave.owl.autoplay": $.proxy(function() {
                if (this._core.settings.autoplayHoverPause && this._core.is("rotating")) {
                    this.play();
                }
            }, this),
            "touchstart.owl.core": $.proxy(function() {
                if (this._core.settings.autoplayHoverPause && this._core.is("rotating")) {
                    this.pause();
                }
            }, this),
            "touchend.owl.core": $.proxy(function() {
                if (this._core.settings.autoplayHoverPause) {
                    this.play();
                }
            }, this)
        };
        this._core.$element.on(this._handlers);
        this._core.options = $.extend({}, Autoplay.Defaults, this._core.options);
    };
    Autoplay.Defaults = {
        autoplay: false,
        autoplayTimeout: 5e3,
        autoplayHoverPause: false,
        autoplaySpeed: false
    };
    Autoplay.prototype._next = function(speed) {
        this._call = window.setTimeout($.proxy(this._next, this, speed), this._timeout * (Math.round(this.read() / this._timeout) + 1) - this.read());
        if (this._core.is("interacting") || document.hidden) {
            return;
        }
        this._core.next(speed || this._core.settings.autoplaySpeed);
    };
    Autoplay.prototype.read = function() {
        return new Date().getTime() - this._time;
    };
    Autoplay.prototype.play = function(timeout, speed) {
        var elapsed;
        if (!this._core.is("rotating")) {
            this._core.enter("rotating");
        }
        timeout = timeout || this._core.settings.autoplayTimeout;
        elapsed = Math.min(this._time % (this._timeout || timeout), timeout);
        if (this._paused) {
            this._time = this.read();
            this._paused = false;
        } else {
            window.clearTimeout(this._call);
        }
        this._time += this.read() % timeout - elapsed;
        this._timeout = timeout;
        this._call = window.setTimeout($.proxy(this._next, this, speed), timeout - elapsed);
    };
    Autoplay.prototype.stop = function() {
        if (this._core.is("rotating")) {
            this._time = 0;
            this._paused = true;
            window.clearTimeout(this._call);
            this._core.leave("rotating");
        }
    };
    Autoplay.prototype.pause = function() {
        if (this._core.is("rotating") && !this._paused) {
            this._time = this.read();
            this._paused = true;
            window.clearTimeout(this._call);
        }
    };
    Autoplay.prototype.destroy = function() {
        var handler, property;
        this.stop();
        for (handler in this._handlers) {
            this._core.$element.off(handler, this._handlers[handler]);
        }
        for (property in Object.getOwnPropertyNames(this)) {
            typeof this[property] != "function" && (this[property] = null);
        }
    };
    $.fn.owlCarousel.Constructor.Plugins.autoplay = Autoplay;
})(window.Zepto || window.jQuery, window, document);

(function($, window, document, undefined) {
    "use strict";
    var Navigation = function(carousel) {
        this._core = carousel;
        this._initialized = false;
        this._pages = [];
        this._controls = {};
        this._templates = [];
        this.$element = this._core.$element;
        this._overrides = {
            next: this._core.next,
            prev: this._core.prev,
            to: this._core.to
        };
        this._handlers = {
            "prepared.owl.carousel": $.proxy(function(e) {
                if (e.namespace && this._core.settings.dotsData) {
                    this._templates.push('<div class="' + this._core.settings.dotClass + '">' + $(e.content).find("[data-dot]").addBack("[data-dot]").attr("data-dot") + "</div>");
                }
            }, this),
            "added.owl.carousel": $.proxy(function(e) {
                if (e.namespace && this._core.settings.dotsData) {
                    this._templates.splice(e.position, 0, this._templates.pop());
                }
            }, this),
            "remove.owl.carousel": $.proxy(function(e) {
                if (e.namespace && this._core.settings.dotsData) {
                    this._templates.splice(e.position, 1);
                }
            }, this),
            "changed.owl.carousel": $.proxy(function(e) {
                if (e.namespace && e.property.name == "position") {
                    this.draw();
                }
            }, this),
            "initialized.owl.carousel": $.proxy(function(e) {
                if (e.namespace && !this._initialized) {
                    this._core.trigger("initialize", null, "navigation");
                    this.initialize();
                    this.update();
                    this.draw();
                    this._initialized = true;
                    this._core.trigger("initialized", null, "navigation");
                }
            }, this),
            "refreshed.owl.carousel": $.proxy(function(e) {
                if (e.namespace && this._initialized) {
                    this._core.trigger("refresh", null, "navigation");
                    this.update();
                    this.draw();
                    this._core.trigger("refreshed", null, "navigation");
                }
            }, this)
        };
        this._core.options = $.extend({}, Navigation.Defaults, this._core.options);
        this.$element.on(this._handlers);
    };
    Navigation.Defaults = {
        nav: false,
        navText: [ '<span aria-label="' + "Previous" + '">&#x2039;</span>', '<span aria-label="' + "Next" + '">&#x203a;</span>' ],
        navSpeed: false,
        navElement: 'button type="button" role="presentation"',
        navContainer: false,
        navContainerClass: "owl-nav",
        navClass: [ "owl-prev", "owl-next" ],
        slideBy: 1,
        dotClass: "owl-dot",
        dotsClass: "owl-dots",
        dots: true,
        dotsEach: false,
        dotsData: false,
        dotsSpeed: false,
        dotsContainer: false
    };
    Navigation.prototype.initialize = function() {
        var override, settings = this._core.settings;
        this._controls.$relative = (settings.navContainer ? $(settings.navContainer) : $("<div>").addClass(settings.navContainerClass).appendTo(this.$element)).addClass("disabled");
        this._controls.$previous = $("<" + settings.navElement + ">").addClass(settings.navClass[0]).html(settings.navText[0]).prependTo(this._controls.$relative).on("click", $.proxy(function(e) {
            this.prev(settings.navSpeed);
        }, this));
        this._controls.$next = $("<" + settings.navElement + ">").addClass(settings.navClass[1]).html(settings.navText[1]).appendTo(this._controls.$relative).on("click", $.proxy(function(e) {
            this.next(settings.navSpeed);
        }, this));
        if (!settings.dotsData) {
            this._templates = [ $('<button role="button">').addClass(settings.dotClass).append($("<span>")).prop("outerHTML") ];
        }
        this._controls.$absolute = (settings.dotsContainer ? $(settings.dotsContainer) : $("<div>").addClass(settings.dotsClass).appendTo(this.$element)).addClass("disabled");
        this._controls.$absolute.on("click", "button", $.proxy(function(e) {
            var index = $(e.target).parent().is(this._controls.$absolute) ? $(e.target).index() : $(e.target).parent().index();
            e.preventDefault();
            this.to(index, settings.dotsSpeed);
        }, this));
        for (override in this._overrides) {
            this._core[override] = $.proxy(this[override], this);
        }
    };
    Navigation.prototype.destroy = function() {
        var handler, control, property, override, settings;
        settings = this._core.settings;
        for (handler in this._handlers) {
            this.$element.off(handler, this._handlers[handler]);
        }
        for (control in this._controls) {
            if (control === "$relative" && settings.navContainer) {
                this._controls[control].html("");
            } else {
                this._controls[control].remove();
            }
        }
        for (override in this.overides) {
            this._core[override] = this._overrides[override];
        }
        for (property in Object.getOwnPropertyNames(this)) {
            typeof this[property] != "function" && (this[property] = null);
        }
    };
    Navigation.prototype.update = function() {
        var i, j, k, lower = this._core.clones().length / 2, upper = lower + this._core.items().length, maximum = this._core.maximum(true), settings = this._core.settings, size = settings.center || settings.autoWidth || settings.dotsData ? 1 : settings.dotsEach || settings.items;
        if (settings.slideBy !== "page") {
            settings.slideBy = Math.min(settings.slideBy, settings.items);
        }
        if (settings.dots || settings.slideBy == "page") {
            this._pages = [];
            for (i = lower, j = 0, k = 0; i < upper; i++) {
                if (j >= size || j === 0) {
                    this._pages.push({
                        start: Math.min(maximum, i - lower),
                        end: i - lower + size - 1
                    });
                    if (Math.min(maximum, i - lower) === maximum) {
                        break;
                    }
                    j = 0, ++k;
                }
                j += this._core.mergers(this._core.relative(i));
            }
        }
    };
    Navigation.prototype.draw = function() {
        var difference, settings = this._core.settings, disabled = this._core.items().length <= settings.items, index = this._core.relative(this._core.current()), loop = settings.loop || settings.rewind;
        this._controls.$relative.toggleClass("disabled", !settings.nav || disabled);
        if (settings.nav) {
            this._controls.$previous.toggleClass("disabled", !loop && index <= this._core.minimum(true));
            this._controls.$next.toggleClass("disabled", !loop && index >= this._core.maximum(true));
        }
        this._controls.$absolute.toggleClass("disabled", !settings.dots || disabled);
        if (settings.dots) {
            difference = this._pages.length - this._controls.$absolute.children().length;
            if (settings.dotsData && difference !== 0) {
                this._controls.$absolute.html(this._templates.join(""));
            } else if (difference > 0) {
                this._controls.$absolute.append(new Array(difference + 1).join(this._templates[0]));
            } else if (difference < 0) {
                this._controls.$absolute.children().slice(difference).remove();
            }
            this._controls.$absolute.find(".active").removeClass("active");
            this._controls.$absolute.children().eq($.inArray(this.current(), this._pages)).addClass("active");
        }
    };
    Navigation.prototype.onTrigger = function(event) {
        var settings = this._core.settings;
        event.page = {
            index: $.inArray(this.current(), this._pages),
            count: this._pages.length,
            size: settings && (settings.center || settings.autoWidth || settings.dotsData ? 1 : settings.dotsEach || settings.items)
        };
    };
    Navigation.prototype.current = function() {
        var current = this._core.relative(this._core.current());
        return $.grep(this._pages, $.proxy(function(page, index) {
            return page.start <= current && page.end >= current;
        }, this)).pop();
    };
    Navigation.prototype.getPosition = function(successor) {
        var position, length, settings = this._core.settings;
        if (settings.slideBy == "page") {
            position = $.inArray(this.current(), this._pages);
            length = this._pages.length;
            successor ? ++position : --position;
            position = this._pages[(position % length + length) % length].start;
        } else {
            position = this._core.relative(this._core.current());
            length = this._core.items().length;
            successor ? position += settings.slideBy : position -= settings.slideBy;
        }
        return position;
    };
    Navigation.prototype.next = function(speed) {
        $.proxy(this._overrides.to, this._core)(this.getPosition(true), speed);
    };
    Navigation.prototype.prev = function(speed) {
        $.proxy(this._overrides.to, this._core)(this.getPosition(false), speed);
    };
    Navigation.prototype.to = function(position, speed, standard) {
        var length;
        if (!standard && this._pages.length) {
            length = this._pages.length;
            $.proxy(this._overrides.to, this._core)(this._pages[(position % length + length) % length].start, speed);
        } else {
            $.proxy(this._overrides.to, this._core)(position, speed);
        }
    };
    $.fn.owlCarousel.Constructor.Plugins.Navigation = Navigation;
})(window.Zepto || window.jQuery, window, document);

(function($, window, document, undefined) {
    "use strict";
    var Hash = function(carousel) {
        this._core = carousel;
        this._hashes = {};
        this.$element = this._core.$element;
        this._handlers = {
            "initialized.owl.carousel": $.proxy(function(e) {
                if (e.namespace && this._core.settings.startPosition === "URLHash") {
                    $(window).trigger("hashchange.owl.navigation");
                }
            }, this),
            "prepared.owl.carousel": $.proxy(function(e) {
                if (e.namespace) {
                    var hash = $(e.content).find("[data-hash]").addBack("[data-hash]").attr("data-hash");
                    if (!hash) {
                        return;
                    }
                    this._hashes[hash] = e.content;
                }
            }, this),
            "changed.owl.carousel": $.proxy(function(e) {
                if (e.namespace && e.property.name === "position") {
                    var current = this._core.items(this._core.relative(this._core.current())), hash = $.map(this._hashes, function(item, hash) {
                        return item === current ? hash : null;
                    }).join();
                    if (!hash || window.location.hash.slice(1) === hash) {
                        return;
                    }
                    window.location.hash = hash;
                }
            }, this)
        };
        this._core.options = $.extend({}, Hash.Defaults, this._core.options);
        this.$element.on(this._handlers);
        $(window).on("hashchange.owl.navigation", $.proxy(function(e) {
            var hash = window.location.hash.substring(1), items = this._core.$stage.children(), position = this._hashes[hash] && items.index(this._hashes[hash]);
            if (position === undefined || position === this._core.current()) {
                return;
            }
            this._core.to(this._core.relative(position), false, true);
        }, this));
    };
    Hash.Defaults = {
        URLhashListener: false
    };
    Hash.prototype.destroy = function() {
        var handler, property;
        $(window).off("hashchange.owl.navigation");
        for (handler in this._handlers) {
            this._core.$element.off(handler, this._handlers[handler]);
        }
        for (property in Object.getOwnPropertyNames(this)) {
            typeof this[property] != "function" && (this[property] = null);
        }
    };
    $.fn.owlCarousel.Constructor.Plugins.Hash = Hash;
})(window.Zepto || window.jQuery, window, document);

(function($, window, document, undefined) {
    var style = $("<support>").get(0).style, prefixes = "Webkit Moz O ms".split(" "), events = {
        transition: {
            end: {
                WebkitTransition: "webkitTransitionEnd",
                MozTransition: "transitionend",
                OTransition: "oTransitionEnd",
                transition: "transitionend"
            }
        },
        animation: {
            end: {
                WebkitAnimation: "webkitAnimationEnd",
                MozAnimation: "animationend",
                OAnimation: "oAnimationEnd",
                animation: "animationend"
            }
        }
    }, tests = {
        csstransforms: function() {
            return !!test("transform");
        },
        csstransforms3d: function() {
            return !!test("perspective");
        },
        csstransitions: function() {
            return !!test("transition");
        },
        cssanimations: function() {
            return !!test("animation");
        }
    };
    function test(property, prefixed) {
        var result = false, upper = property.charAt(0).toUpperCase() + property.slice(1);
        $.each((property + " " + prefixes.join(upper + " ") + upper).split(" "), function(i, property) {
            if (style[property] !== undefined) {
                result = prefixed ? property : true;
                return false;
            }
        });
        return result;
    }
    function prefixed(property) {
        return test(property, true);
    }
    if (tests.csstransitions()) {
        $.support.transition = new String(prefixed("transition"));
        $.support.transition.end = events.transition.end[$.support.transition];
    }
    if (tests.cssanimations()) {
        $.support.animation = new String(prefixed("animation"));
        $.support.animation.end = events.animation.end[$.support.animation];
    }
    if (tests.csstransforms()) {
        $.support.transform = new String(prefixed("transform"));
        $.support.transform3d = tests.csstransforms3d();
    }
})(window.Zepto || window.jQuery, window, document);

jQuery(function($) {
    if ($("#back-to-top").length) {
        var scrollTrigger = 100, backToTop = function() {
            var scrollTop = $(window).scrollTop();
            if (scrollTop > scrollTrigger) {
                $("#back-to-top").addClass("show");
            } else {
                $("#back-to-top").removeClass("show");
            }
        };
        backToTop();
        $(window).on("scroll", function() {
            backToTop();
        });
        $("#back-to-top").on("click", function(e) {
            e.preventDefault();
            $("html,body").animate({
                scrollTop: 0
            }, 700);
        });
    }
    $('[data-fancybox="gallery"]').fancybox({
        loop: true,
        buttons: [ "close" ]
    });
    $(".nx-accordion").on("shown.bs.collapse", ".panel-default", function(e) {
        var topDistance = 68;
        if ($("body").hasClass("admin-bar")) {
            topDistance = 100;
        }
        $("html,body").animate({
            scrollTop: jQuery(this).offset().top - topDistance
        }, 500);
    });
    $(".nx-fancybox").fancybox({});
    $(".nx-slider").owlCarousel({
        stagePadding: 0,
        items: 1,
        loop: true,
        margin: 0,
        singleItem: true,
        nav: false,
        dots: true,
        autoplay: true,
        autoplayTimeout: $(".nx-slider").data("interval") || 3e3,
        navText: [ "<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>" ]
    });
});