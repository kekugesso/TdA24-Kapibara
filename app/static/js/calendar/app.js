var options = {
	tmpl_path: "../static/js/calendar/tmpls/",
	language: 'cs-CZ',
	first_day: 1,
	view: 'month',
	weekbox: true,
	display_week_numbers: true,
	modal: '#events-modal',
	modal_type: 'iframe',
	modal_title: function(event) { return event.title },
	time_split: 60,
	events_source: events_data,
	onAfterEventsLoad: function(events) {
		if(!events) { return; }
		var list = $('#eventlist');
		list.html('');
		$.each(events, function(key, val) {
			$(document.createElement('li'))
				.html('<a href="' + val.url + '">' + val.title + '</a>')
				.appendTo(list);
		});
	},
	onAfterViewLoad: function(view) {
		$('.page-header h3').text(this.getTitle());
		$('.btn-group button').removeClass('active');
		$('button[data-calendar-view="' + view + '"]').addClass('active');
	},
	classes: {
		months: {
			general: 'label'
		}
	}
}
var calendarElement = $('#calendar');
var calendar = calendarElement.calendar(options);

$('.btn-group button[data-calendar-nav]').each(function() {
	var $this = $(this);
	$this.click(function() {
		calendar.navigate($this.data('calendar-nav'));
	});
});

$('.btn-group button[data-calendar-view]').each(function() {
	var $this = $(this);
	$this.click(function() {
		calendar.view($this.data('calendar-view'));
	});
});

$('#events-modal .modal-header, #events-modal .modal-footer').click(function(e){
	//e.preventDefault();
	//e.stopPropagation();
});