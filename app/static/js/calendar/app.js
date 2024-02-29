var options = {
	tmpl_path: "../../static/js/calendar/tmpls/",
	language: 'cs-CZ',
	first_day: 1,
	view: 'month',
	weekbox: true,
	display_week_numbers: true,
	modal: '#events-modal',
	modal_type: 'iframe',
	modal_title: function(event) { return event.title },
	time_split: 60,
	events_source: events_data(),
	onAfterEventsLoad: function(events) {
		if(!events) { return; }
		var list = $('#eventlist');
		list.html('');
		$.each(events, function(key, val) {
			var listItem = $(document.createElement('li'));
			var link = $('<a>', {
				href: val.url,
				text: val.title
			});
			var deleteButton = $('<button>', {
				type: 'button',
				class: 'btn btn-danger btn-sm ms-2',
				text: 'Zrušit'
			}).on('click', function() {
				// Send DELETE request to delete the event
				$.ajax({
					url: '/rezervace/' + val.id, // Replace with the actual endpoint
					type: 'DELETE',
					success: function(response) {
						// Optional: handle success response
						console.log('Event deleted:', response);
						// Remove the deleted event from the list
						listItem.remove();
					},
					error: function(xhr, status, error) {
						// Optional: handle error
						console.error('Error deleting event:', error);
					}
				});
			});
	
			listItem.append(link).append(deleteButton);
			list.append(listItem);
		});
	},
	onAfterViewLoad: function(view) {
		$('.page-header h3').text(this.getTitle());
		$('.btn-group button').removeClass('active');
		$('button[data-calendar-view="' + view + '"]').addClass('active');
	},
	onAfterModalHidden: console.log("hidden"),
	classes: {
		months: {
			general: 'label'
		}
	},
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