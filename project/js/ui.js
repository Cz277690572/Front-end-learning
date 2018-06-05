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

// 页面的脚本逻辑
$(function(){
	$('.ui-search').UiSearch();

	$('.content-tab').UiTab('.caption > .item','.block > .item');
	$('.content-tab .block .item').UiTab('.block-caption > a','.block-content > .block-wrap','block-caption-');

	$('body').UiBackTop();
})