//ui-search 定义
$.fn.UiSearch = function(){
	var ui = $(this);
	$('.ui-search-selected').on('click',function(){
		$(".ui-search-select-list").toggle(500);
		return false;
	});
	$('.ui-search-select-list a').on('click',function(){
		$('.ui-search-selected').text( $(this).text() );
		$('.ui-search-select-list').hide();
		return false;
	});
	$('body').on('click',function(){
		$('.ui-search-select-list').hide();
	});
}

/**
 *@param {string} header  TAB组件，的所有选项卡 item
 *@param {string} content TAB组件，内容区域   所有 item
 *@param {string} focus_prefix 选项卡高亮样式前缀，可选
 */
$.fn.UiTab = function(header,content,focus_prefix){
	var ui   = $(this);
	// console.log(ui);
	var tabs = $(header,ui);
	// console.log(tabs);
	var cons = $(content,ui);
	// console.log(cons);
	var focus_prefix = focus_prefix || '';
	tabs.on('click',function(){
		var index = $(this).index();
		tabs.removeClass(focus_prefix+'item_focus').eq(index).addClass(focus_prefix+'item_focus');
		cons.hide().eq(index).show();
		return false;
	});
}

$.fn.UiBackTop = function(){
	var ui = $(this);
	// console.log(ui);
	var el = $('<a href="#" class="ui-backTop"></a>');
	// console.log(el);
	ui.append(el);

	var windowHeight = $(window).height();
	// console.log(windowHeight);
	$(window).scroll(function(){
		var top = $(window).scrollTop(); 
		// console.log(top);
		if(top > windowHeight){
			el.show();
		}else{
			el.hide();
		}
	});

	el.on('click',function(){
		$(window).scrollTop(0);
	})
}



// ui-cascading
$.fn.UiCascading = function(){
	var ui = $(this);
	var selects = $('select',ui);
	// console.log(selects);

	selects
	.on('change',function(){
		var val   = $(this).val();
		var index = selects.index(this);
		// 触发下一个select的更新，根据当前的值
		var where = $(this).attr('data-where');
		where = where ? where.split(',',where) : [];
		where.push( $(this).val );
		selects.eq(index+1)
			.attr('data-where',where,join(','))
			.triggerHandler('reloadOptions');
		// 触发下一个之后select的初始化(清除不应该的数据项)
		ui.find('select:gt('+(index+1)+')').each(function(){
			$(this)
			.attr('data-where','')
			.triggerHandler('reloadOptions');
		})
	})
	.on('reloadOptions',function(){
		var method = $(this).attr('data-search');
		var args   = $(this).attr('data-where').split(',');
		var data   = AjaxRemoteGetData[ method ].apply(this,args)

		var select = $(this);
		select.find('option').remove();
		$.each('data',function(i,item){
			var el = $('<option value="'+item+'">'+item+'</option>');
			select.append(el);
		})
	})
}


// 幻灯片
$.fn.Uislider = function(){
	var ui   = $(this);
	var wrap = $('.ui-slider-wrap',ui);
	// console.log(wrap);

	var goPrev  = $('.ui-slider-arrow .left',ui);
	var goNext  = $('.ui-slider-arrow .right',ui);

	var tips = $('.ui-slider-process .item',ui);
	// console.log(tips);

	var width   = $('.ui-slider-wrap .item').width();
	var current = 0;
	var size    = $('.ui-slider-wrap .item').size();
	var enableAuto = true; // 自动轮播开关
	// console.log('current:'+current);
	// console.log('imgWidth:'+width);
	// console.log('size:'+size);

	ui
	.on('mouseover',function(){
		enableAuto = false;
		// console.log('鼠标入');
	})
	.on('mouseout',function(){
		enableAuto = true;
		// console.log('鼠标出');
	})
	wrap
	.on('move_prev',function(){
		// console.log('move_prev');
		if(current <= 0){
			current = size;
		}
		current -= 1;
		wrap.triggerHandler('move_to',current);
	})
	.on('move_next',function(){
		// console.log('move_next');
		if(current >= size - 1){
			current = -1;
		}
		current += 1;
		wrap.triggerHandler('move_to',current);
	})
	.on('move_to',function(evt,index){
		// console.log('evt:'+evt);
		// console.log('move_to');
		// console.log('current:'+index);
		// console.log('left:'+wrap.css('left'));
		wrap.css('left',width*index*-1);
		tips.removeClass('item_focus').eq(index).addClass('item_focus');
	})
	.on('move_auto',function(){
		setInterval(function(){
			enableAuto && wrap.triggerHandler('move_next');
		},2000);
	})
	.triggerHandler('move_auto');

	goPrev.on('click',function(){
		// console.log('上一步');
		wrap.triggerHandler('move_prev');
	})
	goNext.on('click',function(){
		// console.log('下一步');
		wrap.triggerHandler('move_next');
	})
	tips.on('click',function(){
		var index = tips.index(this);
		// console.log(index);
		wrap.triggerHandler('move_to',index);
	})


}

// 页面的脚本逻辑
$(function(){
	$('.ui-search').UiSearch();

	$('.content-tab').UiTab('.caption > .item','.block > .item');
	$('.content-tab .block .item').UiTab('.block-caption > a','.block-content > .block-wrap','block-caption-');

	$('body').UiBackTop();

	$('.ui-slider').Uislider();

	$('.ui-cascading').UiCascading();
})