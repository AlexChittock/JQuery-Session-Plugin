(function($){

	$.session = {

        _id: null,

        _cookieCache: undefined,

        _init: function()
        {
            if (!window.name) {
                window.name = Math.random();
            }
            this._id = window.name;

            // See if we've changed protcols

            var matches = (new RegExp(this._generatePrefix() + "=([^;]+);")).exec(document.cookie);
            if (matches && document.location.protocol !== matches[1]) {
               window.sessionStorage.clear();
               this._initCache();
               for (var key in this._cookieCache) {
                   window.sessionStorage.setItem(key, this._cookieCache[key])
               }
            }

            document.cookie = this._generatePrefix() + "=" + document.location.protocol + ';path=/';

        },

        _generatePrefix: function()
        {
            return '__session:' + this._id + ':';
        },

        _initCache: function()
        {
            var cookies = document.cookie.split(';');
            this._cookieCache = {};
            for (var i in cookies) {
                var kv = cookies[i].split('=');
                if ((new RegExp(this._generatePrefix() + '.+')).test(kv[0]) && kv[1]) {
                    this._cookieCache[kv[0].split(':', 3)[2]] = kv[1];
                }
            }
        },

        _setFallback: function(key, value)
        {
            document.cookie = this._generatePrefix() + key + "=" + value + ";path=/";
        },

        _getFallback: function(key)
        {
            if (!this._cookieCache) {
                this._initCache();
            }
            return this._cookieCache[key];
        },

        _clearFallback: function()
        {
            for (var i in this._cookieCache) {
                document.cookie = this._generatePrefix() + i + '=;path=/';
            }
            this._cookieCache = undefined;
        },

        _deleteFallback: function(key)
        {
            document.cookie = this._generatePrefix() + key + '=' + undefined;
            delete this._cookieCache[key];
        },

		get: function(key)
		{
			return window.sessionStorage.getItem(key) || this._getFallback(key);
		},

		set: function(key, value)
		{
			window.sessionStorage.setItem(key, value);
            this._setFallback(key, value);
			return this;
		},

		'delete': function(key)
		{
			window.sessionStorage.removeItem(key);
            this._deleteFallback(key);
			return this;
		},

		clear: function()
		{
			window.sessionStorage.clear();
            this._clearFallback();
			return this;
		}

	};

    $.session._init();

})(jQuery);