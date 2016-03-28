function corecomments(){
    this.article	= 0;
    this.comtype	= 1;
    this.url		= '/html/comments/';
    this.sendurl	= '/ajax/addcomments.html';
    this.page		= 1;
    this.totpage 	= 0;
    this.maxchars 	= 1000;
    this.started 	= false;
    this.comname	= 'comments';

    this.start = function(comname){
        var this_ = this;
        if(comname) this.comname = comname;
        if(coreola.userid){
            this.eventload();
        }else{
            $('#'+this.comname+'_textarea, #'+this.comname+'_send, #'+this.comname+'_commentslist .comment_reply_a').off('click').on('click',function(){
                coreola.popup('/html/auth.html', 650, 300);
                $(this).blur();
                return false;
            });
        }
        $('#'+this_.comname+'_nextpage').off('click').on('click', function(){
            if(this_.totpage > this_.page){
                this_.page++;
                this_.getcomments(this_.page);
            }
            return false;
        });


        if($('#'+this_.comname+'_formdiv').offset().top-$(window).height()-window.scrollY-500 < 1){
            this_.started = true;
            this_.getcomments(this_.page);
        }else{
            $(window).scroll(function(){
                if(!this_.started && $('#'+this_.comname+'_formdiv').offset().top-$(window).height()-window.scrollY-500 < 1){
                    this_.started = true;
                    this_.getcomments(this_.page);
                }
            });
        }

        setInterval(function(){this_.formatime();}, 60000);
    };

    this.eventload = function(){
        var this_ = this;
        $('#'+this_.comname+'_textarea').on('keyup', function(){
            this_.scounter(this);
        });

        this.scounter($('#'+this_.comname+'_textarea'));

        $('#'+this.comname+'_send').off('click').on('click', function(){
            this_.send();
            return false;
        });

        $('#'+this.comname+'_textarea, #comments_reply_div textarea').on('focus', function(){
            $(this).css({'height':'150px'});
        }).on('blur', function(){
            if(!$(this).val().trim()){
                $(this).css({'height':'70px'});
            }
        });

        $('#'+this.comname+'_reply_div .commentescape').off('click').on('click', function(){
            $('#'+this_.comname+'_commentslist .comment_reply_divtext').slideUp(function(){$(this).html('');});
            $('#'+this_.comname+'_commentslist .comment_reply_a').show();
            return false;
        });

        $('#'+this.comname+'_reply_div .commentsend').off('click').on('click', function(){
            this_.reply($(this).attr('comment'), $(this).attr('page'));
            return false;
        });

        $('#'+this.comname+'_formdiv .rules, #'+this.comname+'_reply_div .rules').show().find('a').off('click').on('click', function(){
            $(this).closest('.comments-coreola').find('.comments-rules_div').slideToggle();
            return false;
        });
    };

    this.listevent = function(obj){
        var this_ = this;
        if(coreola.userid > 0){
            $('.comment_reply_a', obj).show().off('click').on('click', function(){
                $(obj).find('.comment_reply_a').show().filter(this).hide();
                $('#'+this_.comname+'_commentslist').find('.comment_reply_divtext').slideUp(function(){$(this).html('');});
                var form = $(obj).find('.comment_reply_divtext[comment='+$(this).attr('comment')+']');
                $(form).html('').append($('#comments_reply_div').children().clone(true));
                $(form).slideDown().find('.commentsend').attr('comment', $(this).attr('comment')).attr('page', $(this).attr('page'));
                return false;
            });
        }

        $('.pluse', obj).off('click').on('click', function(){
            this_.addrate($(this).attr('comment'), 1, $(this).attr('page'));
            return false;
        });

        $('.minus', obj).off('click').on('click', function(){
            this_.addrate($(this).attr('comment'), -1, $(this).attr('page'));
            return false;
        });
    };

    this.addrate = function(absnum, rate, page){
        var this_ = this;
        $.ajax({
            url			: this_.sendurl,
            type		: 'POST',
            data		: {article:+this_.article, comtype:this_.comtype, absnum:absnum, rate:rate},
            cache       : false,
            async		: true,
            dataType	: 'json',
            success		: function(data){
                if(data.error){
                    coreola.alert(data.error);
                }else{
                    this_.getcomments(parseInt(page, 10));
                }
            }
        });
    };

    this.reply = function(parent, page){
        var this_ = this;
        var textar = $('#'+this_.comname+'_commentslist').find('.comment_reply_divtext[comment='+parent+']').find('textarea');
        $.ajax({
            url			: this_.sendurl,
            type		: 'POST',
            data		: {article:+this_.article, comtype:this_.comtype, parent:parent, text:$(textar).val()},
            cache       : false,
            async		: true,
            dataType	: 'json',
            success		: function(data){
                if(data.error){
                    coreola.alert(data.error);
                    $(textar).focus();
                }else{
                    $(textar).val('');
                    $('#'+this_.comname+'_commentslist').find('.comment_reply_divtext').hide().html('');
                    $('#'+this_.comname+'_commentslist').find('.comment_reply').show();
                    this_.getcomments(page);
                }
            }
        });
    };

    this.send = function(){
        var this_ = this;
        $.ajax({
            url			: this_.sendurl,
            type		: 'POST',
            data		: {article:+this_.article, comtype:this_.comtype, text:$('#'+this_.comname+'_textarea').val()},
            cache       : false,
            async		: true,
            dataType	: 'json',
            success		: function(data){
                if(data.error){
                    coreola.alert(data.error);
                    $('#'+this_.comname+'_textarea').focus();
                }else{
                    $('#'+this_.comname+'_textarea').val('');
                    this_.scounter($('#'+this_.comname+'_textarea'));
                    this_.getcomments(1);
                }
            }
        });
    };

    this.getcomments = function(page){
        var this_ = this;
        page = page ? page : 1;
        $.ajax({
            url			: this_.url+'comtype='+this_.comtype+'/'+Math.floor(this_.article/100)+'/absnum='+this_.article+'/page='+page+'.html',
            type		: 'GET',
            cache       : false,
            async		: true,
            dataType	: 'html',
            success		: function(data){
                var resdom = $('#'+this_.comname+'_commentcontairerdom').html('').append(data);
                var comcnt = $(resdom).find('acronym.commentscountdata');
                var thcom  = $('#'+this_.comname+'_commentslist').find('.comments_pagecontainer[page='+page+']');
                this_.totpage = parseInt(isNaN($(comcnt).attr('comments_count_totpage')) ? 0 : $(comcnt).attr('comments_count_totpage'), 10);

                if($(thcom).size()){
                    $(thcom).html($(resdom).find('.comments_pagecontainer').html());
                }else{
                    $('#'+this_.comname+'_commentslist').append($(resdom).find('.comments_pagecontainer'));
                }

                this_.listevent($('#'+this_.comname+'_commentslist').find('.comments_pagecontainer[page='+page+']'));

                $('#'+this_.comname+'_commentslist').find('.comments_pagecontainer[page='+page+']').slideDown("slow");

                if(this_.totpage > this_.page){
                    $('#'+this_.comname+'_nextpage').show();
                }else{
                    $('#'+this_.comname+'_nextpage').fadeOut();
                }

                $('#'+this_.comname+'_commentcontairerdom').html('');

                this_.formatime();
            }
        });
    };

    this.scounter = function(obj){
        if($('#'+this.comname+'_charcounter').size()){
            var len = $(obj).val().length;
            if(len > this.maxchars){
                $(obj).val($(obj).val().substr(0, this.maxchars));
            }
            $('#'+this.comname+'_charcounter').text(this.maxchars-len).css("color",(this.maxchars-len < 10?'red':'black'));
        }
    };

    this.formatime = function(){
        var this_ = this;
        $.each($('#'+this.comname+'_commentslist').find('span.adateformat'), function(){
            var text = this_.prettyDate($(this).attr('adate'));
            if(text) $(this).text(text);
        });
    }

    this.prettyDate = function(time){
        var diff = coreola.time-time, day_diff = Math.floor(diff / 86400);
        if(isNaN(day_diff) || day_diff < 0){
            return;
        }
        if(day_diff == 0)
            if(diff < 60) 			return "только что";
            else if(diff < 120) 	return "минуту назад";
            else if(diff < 3600) 	return Math.floor(diff/60)+' '+coreola.vidmin(Math.floor(diff/60), ['минуту', 'минуты', 'минут'])+" назад";
            else if(diff < 7200)	return "час назад";
            else 					return Math.floor(diff/3600)+' '+coreola.vidmin(Math.floor(diff/3600), ['час','часа','часов'])+" назад";
        else if(day_diff == 1)					return "вчера";
        else if(day_diff < 7)					return day_diff+' '+coreola.vidmin(day_diff, ['день','дня','дней'])+" назад"
        else if(day_diff == 7)					return "неделю назад";
        else if(Math.ceil(day_diff / 7) < 5)	return Math.ceil(day_diff / 7)+' '+coreola.vidmin(Math.ceil(day_diff / 7), ['неделю','недели','недель'])+" назад";
        else									return;
    };
}