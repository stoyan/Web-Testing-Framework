/*global YSLOW */
YSLOW.registerRule({
    id: 'wtf-blink',
    name: '&lt;blink&gt;',
    info: "&quot;There's a lady who knows, all that blinkers is gold&quot; - Led Zeppelin",
    category: ['general'],
    config: {},

    lint: function (doc, cset, config) {
        var count = doc.getElementsByTagName('blink').length,
            message = '';
            
        if (count) {
            message = YSLOW.util.plural('Oh my, %num% blink tag%s%, <blink style="color:red">seriously?</blink>', count);
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
    category: ['general'],
    config: {},

    lint: function (doc, cset, config) {
        var count = doc.getElementsByTagName('marquee').length,
            message = '';
            
        if (count) {
            message = YSLOW.util.plural('Ah-ha, %num% marquee tag%s%, impressive!', count);
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
    category: ['general'],
    config: {
        points: 21
    },

    lint: function (doc, cset, config) {
        var count = doc.getElementsByTagName('font').length,
            message = '';
            
        if (count) {
            message = YSLOW.util.plural('%num% font tag%s% - must be one hell of a web page', count);
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
    category: ['general'],
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
    category: ['general'],
    config: {
        hints: ['spacer', 'dot', 'clear', 'pixel', '1x1'],
        points: 21
    },

    lint: function (doc, cset, config) {
        var images = doc.images,
            i = 0, max = images.length,
            message = '',
            count = 0,
            url,
            img,
            re = new RegExp(config.hints.join('|'), 'i');
        
        
        for (i = 0; i < max; i += 1) {
            img = images[i];
            url = img.src;
            url = url.split('/').pop();
            if (re.test(url) && img.naturalWidth === 1 && img.naturalHeight === 1) {
                count += 1;
            }
        }
        
            
        if (count) {
            message = YSLOW.util.plural('%num% spacer GIF%s% found', count);
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
    category: ['general'],
    config: {
        points: 21
    },

    lint: function (doc, cset, config) {
        
        var links = doc.links,
            i, max = links.length,
            href,
            message = '',
            count = 0;
        
        for (i = 0; i < max; i += 1) {
            href = links[i].getAttribute('href').toString();
            if (href === "#" || href.indexOf('javascript:') === 0) {
                count += 1;
            }
        }
        
        if (count) {
            message = YSLOW.util.plural('Found %num% link%s% with non-semantic href attributes', count);
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
        'wtf-blink': {},
        'wtf-marquee': {},
        'wtf-font': {},
        'wtf-doctype': {},
        'wtf-spacer': {},
        'wtf-hashlinks': {}
    },
    weights: {
        'wtf-blink': 1,
        'wtf-marquee': 1,
        'wtf-font': 1,
        'wtf-doctype': 1,
        'wtf-spacer': 1,
        'wtf-hashlinks': 1
    }
});

