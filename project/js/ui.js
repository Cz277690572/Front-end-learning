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

/**
 * 1.左右箭头需要能控制翻页
 * 2.翻页的时候，进度点，要联动进行focus
 * 3.翻到第三页的时候，下一页需要回到 第一页，翻到第一页的时候，同理
 * 4.进度点，在点击的时候，需要切换到对应的页面
 * 5.没有(进度点击，翻页操作) 的时候需要进行自动滚动
 * 6.滚动过程中，屏蔽其他操作（自动滚动，左右翻页，进度点点击）
 * 7.高级-无缝滚动
 */
$.fn.uiSlider = function(){

	var ui = $(this);
	var wrap = $('.ui-slider-wrap',ui);
	// console.log('内容框架:'+wrap);
	var goPrev = $('.ui-slider-arrow .left',ui);
	// console.log(goPrev);
	var goNext = $('.ui-slider-arrow .right',ui);
	// console.log(goNext);
	var items  = $('.ui-slider-wrap .item',ui);
	var tips   = $('.ui-slider-process .item',ui);
	
	// 预定义
	var current = 0;
	var size    = items.size();
	var width   = items.eq(0).width();
	var enableAuto = true;

	ui
	.on('mouseover',function(){
		enableAuto = false;
	})
	.on('mouseout',function(){
		enableAuto = true;
	})

	wrap
	.on('move_prev',function(){
		if(current <= 0){
			current = size;
		}
		current -= 1;
		console.log(current);
		wrap.triggerHandler('move_to',current);
	})
	.on('move_next',function(){
		if(current >= size-1){
			current = -1;
		}
		current += 1;
		console.log(current);
		wrap.triggerHandler('move_to',current);
	})
	.on('move_to',function(evt,index){
		wrap.css('left',index*width*-1);
		tips.removeClass('item_focus').eq(index).addClass('item_focus');
	})
	.on('auto_move',function(){
		setInterval(function(){
			enableAuto && wrap.triggerHandler('move_next')
		},2000)
	})
	.triggerHandler('auto_move');

	goPrev.on('click',function(){
		console.log('shangyige');
		wrap.triggerHandler('move_prev');
	});
	goNext.on('click',function(){
		wrap.triggerHandler('move_next');
	});
	tips.on('click',function(){
		var index = $(this).index();
		wrap.triggerHandler('move_to',index);
	})

}

// 页面的脚本逻辑
$(function(){
	$('.ui-search').UiSearch();

	$('.content-tab').UiTab('.caption > .item','.block > .item');
	$('.content-tab .block .item').UiTab('.block-caption > a','.block-content > .block-wrap','block-caption-');

	$('body').UiBackTop();

	$('.ui-slider').uiSlider();
})