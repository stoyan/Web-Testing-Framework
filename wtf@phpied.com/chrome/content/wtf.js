/*global YSLOW, Firebug, FirebugChrome */
YSLOW.WTF = {};
YSLOW.WTF.offenders = [];

YSLOW.WTF.listOffenders = function (offenders) {
    var i = 0, max = offenders.length, id, 
        msg = "<p>Here: ";
    for (i = 0; i < max; i += 1) {
        id = YSLOW.WTF.offenders.push(offenders[i]) - 1;
        msg += "&lt;<a href=\"javascript:document.ysview.wtfInspect(" + id + ")\">" + offenders[i].tagName.toLowerCase() + "</a>&gt; ";
    }    
    return msg + '</p>';
};

YSLOW.view.prototype.wtfInspect = function (id) {
    Firebug.toggleBar(true, "html");
	FirebugChrome.select(YSLOW.WTF.offenders[id], "html");    
};

YSLOW.registerRule({
    id: 'wtf-blink',
    name: '&lt;blink&gt;',
    info: "&quot;There's a lady who knows, all that blinkers is gold&quot; - Led Zeppelin",
    category: ['Essentials'],
    config: {},

    lint: function (doc, cset, config) {
        var offenders = doc.getElementsByTagName('blink'),
            count = offenders.length,
            message = '';
            
        if (count) {
            message = YSLOW.util.plural('Oh my, %num% blink tag%s%, <blink style="color:red">seriously?</blink>', count);
            message += YSLOW.WTF.listOffenders(offenders);
        }
        
        return {
            score: count ? 1 : 100,
            message: message
        };
    }
});



YSLOW.registerRule({
    id: 'wtf-marquee',
    name: '&lt;marquee&gt;',
    info: "&quot;Hello&quot; - Marqueez de Sade",
    category: ['Essentials'],
    config: {},

    lint: function (doc, cset, config) {
        var offenders = doc.getElementsByTagName('marquee'),
            count = offenders.length,
            message = '';
            
        if (count) {
            message = YSLOW.util.plural('Ah-ha, %num% marquee tag%s%, impressive!', count);
            message += YSLOW.WTF.listOffenders(offenders);
        }
        
        return {
            score: count ? 1 : 100,
            message: message
        };
    }
});

YSLOW.registerRule({
    id: 'wtf-font',
    name: '&lt;font&gt;',
    info: "Once upon a time, a long time a ago, before the @font-face has even been imagined, there was the &lt;font&gt; tag",
    category: ['Essentials'],
    config: {
        points: 21
    },

    lint: function (doc, cset, config) {
        var offenders = doc.getElementsByTagName('font'),
            count = offenders.length,
            message = '';
            
        if (count) {
            message = YSLOW.util.plural('%num% font tag%s% - must be one hell of a web page', count);
            message += YSLOW.WTF.listOffenders(offenders);
        }
        
        return {
            score: count ? 100 - count * config.points : 100,
            message: message
        };
    }
});

YSLOW.registerRule({
    id: 'wtf-doctype',
    name: 'Use a doctype',
    info: "Without a DOCTYPE, the page renders in quirks mode. The shortest doctype you can put at the very top of the page is <code>&lt;!doctype html&gt;</code>",
    category: ['Essentials'],
    config: {},

    lint: function (doc, cset, config) {
        var dtype = doc.doctype,
            message = '';
            
        if (!dtype) {
            message = "The page doesn't have a doctype";
        }
        
        return {
            score: !dtype ? 1 : 100,
            message: message
        };
    }
});


YSLOW.registerRule({
    id: 'wtf-spacer',
    name: 'No more spacer.gif',
    info: "For layout purposes, use CSS instead of spacer images",
    category: ['Essentials'],
    config: {
        hints: ['spacer', 'dot', 'clear', 'pixel', '1x1'],
        points: 21
    },

    lint: function (doc, cset, config) {
        var images = doc.images,
            i = 0, max = images.length,
            message = '',
            count = 0,
            offenders = [],
            url,
            img,
            re = new RegExp(config.hints.join('|'), 'i');
        
        
        for (i = 0; i < max; i += 1) {
            img = images[i];
            url = img.src;
            url = url.split('/').pop();
            if (re.test(url) && img.naturalWidth === 1 && img.naturalHeight === 1) {
                count += 1;
                offenders.push(images[i]);
            }
        }
        
            
        if (count) {
            message = YSLOW.util.plural('%num% spacer GIF%s% found', count);
            message += YSLOW.WTF.listOffenders(offenders);
        }
        
        return {
            score: count ? 100 - count * config.points : 100,
            message: message
        };
    }
});



YSLOW.registerRule({
    id: 'wtf-hashlinks',
    name: 'Semantic link hrefs',
    info: "Links should be links. Links with href such as href=# and href=&quot;javascript:&quot; should be avoided like the plague",
    category: ['Essentials'],
    config: {
        points: 21
    },

    lint: function (doc, cset, config) {
        
        var links = doc.links,
            i, max = links.length,
            href,
            message = '',
            count = 0,
            offenders = [];
        
        for (i = 0; i < max; i += 1) {
            href = links[i].getAttribute('href').toString();
            if (href === "#" || href.indexOf('javascript:') === 0) {
                count += 1;
                offenders.push(links[i]);
            }
        }
        
        if (count) {
            message = YSLOW.util.plural('Found %num% link%s% with non-semantic href attributes', count);
            message += YSLOW.WTF.listOffenders(offenders);
        }
        
        return {
            score: count ? 100 - count * config.points : 100,
            message: message
        };
    }
});


YSLOW.registerRule({
    id: 'wtf-inlinestyles',
    name: 'Inline styles',
    info: "Inline style attributes might be OK for an occasional <code>display:none</code> but should be avoided in general",
    category: ['Overachievers only'],
    config: {
        points: 11
    },

    lint: function (doc, cset, config) {
        
        var all = doc.querySelectorAll('*[style]'),
            i, max = all.length,
            el,
            message = '',
            count = 0,
            bytes = 0,
            offenders = [];
        
        for (i = 0; i < max; i += 1) {
            el = all[i].getAttribute('style');
            if (el) {
                count += 1;
                bytes += el.toString().length;
                offenders.push(all[i]);
            }
        }
        
        if (count) {
            message = YSLOW.util.plural('Found %num% style attribute%s% with a total of ' + bytes + ' bytes', count);
            message += YSLOW.WTF.listOffenders(offenders);
        }
        
        return {
            score: count ? 100 - count * config.points : 100,
            message: message
        };
    }
});


YSLOW.registerRule({
    id: 'wtf-inlinehandlers',
    name: 'onclick, etc',
    info: "Inline event handlers are frowned upon",
    category: ['Overachievers only'],
    config: {
        points: 11,
        attribs: [
            'onabort',
            'onactivate',
            'onafterprint',
            'onafterupdate',
            'onbeforeactivate',
            'onbeforecopy',
            'onbeforecut',
            'onbeforedeactivate',
            'onbeforeeditfocus',
            'onbeforepaste',
            'onbeforeprint',
            'onbeforeunload',
            'onbeforeupdate',
            'onblur',
            'onbounce',
            'oncellchange',
            'onchange',
            'onclick',
            'oncontextmenu',
            'oncontrolselect',
            'oncopy',
            'oncut',
            'ondataavailable',
            'ondatasetchanged',
            'ondatasetcomplete',
            'ondblclick',
            'ondeactivate',
            'ondrag',
            'ondragend',
            'ondragenter',
            'ondragleave',
            'ondragover',
            'ondragstart',
            'ondrop',
            'onerror',
            'onerrorupdate',
            'onfilterchange',
            'onfinish',
            'onfocus',
            'onfocusin',
            'onfocusout',
            'onhashchange',
            'onhelp',
            'onkeydown',
            'onkeypress',
            'onkeyup',
            'onlayoutcomplete',
            'onload',
            'onlosecapture',
            'onmessage',
            'onmousedown',
            'onmouseenter',
            'onmouseleave',
            'onmousemove',
            'onmouseout',
            'onmouseover',
            'onmouseup',
            'onmousewheel',
            'onmove',
            'onmoveend',
            'onmovestart',
            'onoffline',
            'ononline',
            'onpage',
            'onpaste',
            'onprogress',
            'onpropertychange',
            'onreset',
            'onresize',
            'onresizeend',
            'onresizestart',
            'onrowenter',
            'onrowexit',
            'onrowsdelete',
            'onrowsinserted',
            'onscroll',
            'onselect',
            'onselectionchange',
            'onselectstart',
            'onstart',
            'onstop',
            'onstorage',
            'onstoragecommit',
            'onsubmit',
            'ontimeout',
            'onunload'
        ]
    },

    lint: function (doc, cset, config) {
        var all = doc.getElementsByTagName('*'),
            i, j, max = all.length, maxa = config.attribs.length,
            el,
            message = '',
            count = 0,
            bytes = 0,
            offenders = [],
            offends;

        for (i = 0; i < max; i += 1) {
            offends = false;
            for (j = 0; j < maxa; j += 1) {
                el = all[i].getAttribute(config.attribs[j]);
                if (el) {
                    count += 1;
                    bytes += el.toString().length;
                    offends = true;
                }
            }
            if (offends) {
                offenders.push(all[i]);
            }
        }
        
        if (count) {
            message = YSLOW.util.plural('Found %num% inline onSomething attribute%s% with a total of ' + bytes + ' bytes', count);
            message += YSLOW.WTF.listOffenders(offenders);
            
            if (!this.infod) {
                this.infod = true;
                this.info += ". <p>These were checked: " + this.config.attribs.join(', ');
            }
        }
        
        return {
            score: count ? 100 - count * config.points : 100,
            message: message
        };
    }
});


YSLOW.registerRule({
    id: 'wtf-layouttables',
    name: 'Headless tables',
    info: "Is it possible that you're still using tables for layout?",
    category: ['Overachievers only'],
    config: {
        points: 11
    },

    lint: function (doc, cset, config) {
        
        var tables = doc.getElementsByTagName('table'),
            i, max = tables.length,
            head,
            message = '',
            count = 0,
            offenders = [];
        
        for (i = 0; i < max; i += 1) {
            head = tables[i].getElementsByTagName('th').length || tables[i].getElementsByTagName('thead').length;
            if (!head) {
                count += 1;
                offenders.push(tables[i]);
            }
            
        }
        
        if (count) {
            message = YSLOW.util.plural('Found %num% table%s% without a TH or a THEAD', count);
            message += YSLOW.WTF.listOffenders(offenders);
        }
        
        return {
            score: count ? 100 - count * config.points : 100,
            message: message
        };
    }
});

YSLOW.registerRuleset({
    id: 'wtf',
    name: 'Web Testing Framework',
    rules: {
        'wtf-blink':     {},
        'wtf-marquee':   {},
        'wtf-font':      {},
        'wtf-doctype':   {},
        'wtf-spacer':    {},
        'wtf-hashlinks': {},
        'wtf-inlinestyles':   {},
        'wtf-inlinehandlers': {},
        'wtf-layouttables':   {}
    },
    weights: {
        'wtf-blink':     3,
        'wtf-marquee':   3,
        'wtf-font':      3,
        'wtf-doctype':   3,
        'wtf-spacer':    3,
        'wtf-hashlinks': 3,
        'wtf-inlinestyles':   1,
        'wtf-inlinehandlers': 1,
        'wtf-layouttables':   1
    }
});

