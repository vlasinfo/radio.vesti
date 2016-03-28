var window_popup_opener = [], window_popup_opener_id = 0;
function coreola(){

    this.time           = 0;
    this.langid         = 0;
    this.time           = 0;
    this.userid         = 0;
    this.loaded         = null;
    this.member         = {};
    this.sections 	    = [];
    this.loadfunc       = {};
    this.url_data       = {};
    this.cookie_setngs  = {expires:365, path:'/', domain:'.vesti-ukr.com'};

    this.start = function(){
        var this_ = this;
        $.ajax({
            url		 : '',
            type	 : 'GET',
            data	 : this.url_data,
            async	 : true,
            cache    : false,
            dataType : 'json',
            success	 : function(data){
                this_.start_after(data);
            }
        });
    };

    this.reload = function(){
        this.start();
    };

    this.add_url = function(key, val){
        this.url_data[key] = val;
    };

    this.member_get = function(name){
        if(this.member[name]) return this.member[name];
        if($.cookie('coreola_member_'+name)) return $.cookie('coreola_member_'+name);
        return '';
    };
    this.member_set = function(name, value){
        $.cookie('coreola_member_'+name, value, this.cookie_setngs);
    };

    this.start_after = function(data){
        this.userid = data.userid;
        this.member = data.member;
        this.time   = data.time;

        if(this.userid){
            $('img.user_data_ava_tn').attr('src', data.member['ava_tn']);
            $('#user_top_menubar').html('<span class="username">Привет, '+this.member.name+'!</span> <a href="/html/logoff.html">выход</a>');
        }else{
            $('#user_top_menubar').html('<a target="_blank" href="/html/auth.html" class="coreola_popup" p_w="650" p_h="300">Авторизация</a>');
        }
        $.each(this.loadfunc, function(k, func){if(func) func();});

        this.artvotes_update();

        this.loaded = true;
    };

    this.artvotes_update = function(){
        var this_ = this;

        $.ajax({
            url		 : '/ajax/articlevote_data.html',
            type	 : 'GET',
            async	 : true,
            cache    : false,
            dataType : 'json',
            success	 : function(data){
                if(data && data.votes){
                    $.each($('div.articlevotes_item'), function(){
                        var a = parseInt($(this).attr('absnum'), 10);
                        if(data.votes[a]){
                            this_.artvotes_update_val(this, {rate_plus_percent:data.votes[a]['p'], rate_minus_percent:data.votes[a]['m']});
                            $('.articlevotes_vote', this).show();
                            $('.procent', this).removeClass('add-vote');
                        }else{
                            $('.articlevotes_vote', this).hide();
                            $('.procent', this).addClass('add-vote');
                        }
                    });
                }
            }
        });
    };

    this.artvotes_update_val = function(context, data){
        $('.articlevotes_rate_plus_line', context).attr('pvalue', data.rate_plus_percent);
        $('.articlevotes_rate_minus_line', context).attr('pvalue', data.rate_minus_percent);
        $('.articlevotes_rate_plus_val', context).text(data.rate_plus_percent+'%');
        $('.articlevotes_rate_minus_val', context).text(data.rate_minus_percent+'%');
        $('.articlevotes_rate_plus_line', context).animate({'width':data.rate_plus_percent+'%'});
        $('.articlevotes_rate_minus_line', context).animate({'width': data.rate_minus_percent+'%'});
    };

    this.addfunc = function(key, val){
        if(this.loaded){
            val(this.jdata);
        }else{
            this.loadfunc[key] = function(){val();};
        }
    };

    this.popup = function(href, w, h){
        h = parseInt(h, 10);
        if(!h){
            h = $(window).height()-50;
        }
        var left = ($(window).width()/2)-(w/2);
        window_popup_opener[window_popup_opener_id] = window.open(href, 'popup_'+window_popup_opener_id, 'left='+left+',menubar=no,location=yes,scrollbars=no,status=yes,width=' + w +',height=' + h +',top=0');
        window_popup_opener[window_popup_opener_id].focus();
        window_popup_opener_id++;
        return false;
    };

    this.alert = function(message, params){
        alert(message);
    };

    this.vidmin = function(n, t){
        c = new Array (2,0,1,1,1,2); return t[(n%100>4 && n%100<20)? 2:c[Math.min(n%10,5)]];
    };
}

coreola = new coreola();