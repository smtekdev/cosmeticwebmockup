const tabHashesMap = new Map();
const definedTabWidgetIdHashes = new Set();
(location.hash || '').split('|').forEach((hashDef)=> {
		
	const [tabsWidgetId, tabId] = hashDef.split(',');
	
	if (!tabId)
		return;
	
	const wId = tabsWidgetId.replace('#','');
	definedTabWidgetIdHashes.add(wId);
	tabHashesMap.set(wId, tabId);
});


const rebuildHashTags = () => {
	const resultParts = [];
	definedTabWidgetIdHashes.forEach(widgetId => {
		resultParts.push(widgetId + ',' + tabHashesMap.get(widgetId));
	});
	location.hash = resultParts.join('|');
};

const setHashtagForTabWidget = (widgetId, tabId) => {
	if (!widgetId || !tabId)
		return;
	tabHashesMap.set(widgetId, tabId);
	definedTabWidgetIdHashes.add(widgetId);
	rebuildHashTags();
};

var tabsWidget;
tabsWidget = {

    init: function(id) {

        var widget = $('#' + id);
        if (widget.length > 0) {

			var deepLinkEnabled = widget.attr('data-deeplink') === "enabled";
            var effect = widget.attr('data-effect');
            var tabsList = widget.find('>ul.nav');
            var mobileDropdownList = widget.find('>div.dropdown>ul.dropdown-menu');
            var panelsWrap = widget.find('>.tab-content');
            var panels = panelsWrap.find('>.tab-pane');

            widget.on('shown.bs.tab','[data-toggle="tab"]',function(event){
                if (mobileDropdownList.length > 0) {
                    var elem = $(event.target);
                    mobileDropdownList.parent().find('>button .selection').html(elem.html());
                }
                $(window).trigger('scroll');
                $(window).trigger('resize');

				if (deepLinkEnabled) {
					var tabId = $(this).attr('href').replace('#','');
					setHashtagForTabWidget(id, tabId);
					
					//refresh paginators if any
					$('nav ul.pagination li a').each((idx, elem) => {
						if (location.hash && location.hash !== '') {
							const anchor = $(elem);
							const href = anchor.attr('href').split("#")[0];
							anchor.attr('href', href + location.hash);
						}
					});
				}
            });


            if (panels.length > 0) {
                var isFirst = true;
                $.each(panels,function(){
                    var panel = $(this);
                    var tabTitle = panel.attr('data-tab_name');
                    var id = panel.attr('id');
                    panel.removeClass('active');

                    if (effect == 'fade') {
                        panel.addClass('fade');
                    }

                    var li = $('<li role="presentation"></li>');


                    var anchor = $('<a role="tab" data-toggle="tab"></a>');
                    anchor.attr('aria-controls',id);
                    anchor.attr('href','#' + id);
                    anchor.html(tabTitle);
                    li.append(anchor);

                    tabsList.append(li);

                    if (isFirst) {
                        isFirst = false;
                        li.addClass('active');
                        panel.addClass('active');
                        if (effect == 'fade') {
                            panel.addClass('in');
                        }
                        anchor.tab('show');

                        if (mobileDropdownList.length > 0) {
                            mobileDropdownList.parent().find('>button .selection').html(anchor.html());
                        }

                    }


                    if (mobileDropdownList.length > 0) {
                        mobileDropdownList.append(li.clone(true));
                        mobileDropdownList.on('click', 'li>a', function(){
                            var elem = $(this);
                            elem.parents('ul').find('li').removeClass('active');
                            var tabContentPanelSelector = elem.attr('href');

                            var panel = $(tabContentPanelSelector);
                            panel.parents('.tab-content').find('.tab-content').removeClass('active');
                            elem.parent().addClass('active'); //update the li

                            anchor.parents('.tabs-widget').find('.nav a[href="' + elem.attr('href') + '"]').tab('show');
                            elem.parents('.dropdown:first').find('button .selection').html(elem.html());
                        });
                    }


                });

				if (deepLinkEnabled) {
					if (definedTabWidgetIdHashes.has(id)) {
						var tabIdInHash = tabHashesMap.get(id);
						tabsList.find('a[href="#' + tabIdInHash + '"]').tab('show');
					}
				}

            }

        }

        widget.find('>.tab-content.hidden').removeClass('hidden');

    }
};