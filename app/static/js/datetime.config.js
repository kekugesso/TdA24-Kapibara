if (/Mobi/.test(navigator.userAgent)) {
    // if mobile device, use native pickers
    $(".date input").attr("type", "date");
    $(".time input").attr("type", "time");
  } else {
    $("#StartTime").datetimepicker({
        locale: 'cs',
        format: "YYYY-MM-DD HH",
        minDate: moment().add(1, 'days').format("YYYY-MM-DD HH"),
        //useCurrent: true,
        //date: moment().add(1, 'days').format("YYYY-MM-DD HH"),
        daysOfWeekDisabled: [0,6],
        disabledHours: [0, 1, 2, 3, 4, 5, 6, 7, 21, 22, 23, 24],
        enabledHours: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17,18, 19, 20],
        sideBySide: true,
        showTodayButton: true,
    });
    $("#EndTime").datetimepicker({
        locale: 'cs',
        format: "YYYY-MM-DD HH",
        minDate: moment().add(1, 'days').add(1, 'hours').format("YYYY-MM-DD HH"),
        //useCurrent: true,
        //date: moment().add(1, 'days').add(1, 'hours').format("YYYY-MM-DD HH"),
        daysOfWeekDisabled: [0,6],
        disabledHours: [0, 1, 2, 3, 4, 5, 6, 7, 21, 22, 23, 24],
        enabledHours: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17,18, 19, 20],
        sideBySide: true,
        showTodayButton: true,
    });
}