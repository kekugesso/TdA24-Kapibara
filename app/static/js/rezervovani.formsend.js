$('#rezervacni-formular').on("submit", function(event) {
    event.preventDefault();
    validateAllFields();

    if (checkAllFieldsValid()) {
        const formData = {
            lecturer_uuid: new URLSearchParams(window.location.search).get('lecturer'),
            first_name_student: $('#firstName').val(),
            last_name_student: $('#lastName').val(),
            email_student: $('#email').val(),
            number_student: $('#phone').val(),
            location: $('#location').val(),
            subject: $('#subject').val(),
            notes: $('#notes').val(),
            start_time: $('#StartTime').val(),
            end_time: $('#EndTime').val(),
        };
        $.ajax({
            url: '/rezervace',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(formData),
            success: function(data) {
                window.location.replace("/rezervace?success=true")
            },
            error: function(xhr, status, error) {
                location.reload()
            }
        });
    }
});

function validateAllFields() {
$('.rezervovani-form input[required], .rezervovani-form select[required]').each(function() {
    validateField($(this));
});
}

$('.rezervovani-form input[required], .rezervovani-form select[required]').on('focusout', function() {
    validateField($(this));
});

function validateField(field) {
    var isValid = field[0].checkValidity();

    if (field.attr('id') === 'email') {
        isValid = validateEmail(field.val()) && isValid;
    } else if (field.attr('id') === 'phone') {
        isValid = validatePhone(field.val()) && isValid;
    }

    if (isValid) {
        field.removeClass('is-invalid').addClass('is-valid');
    } else {
        field.removeClass('is-valid').addClass('is-invalid');
    }
}

function checkAllFieldsValid() {
    var allFieldsValid = true;
    $('.rezervovani-form input[required], .rezervovani-form select[required]').each(function() {
        if (!$(this).hasClass('is-valid')) {
            allFieldsValid = false;
            return false;
        }
    });
    return allFieldsValid;
}

function validateEmail(email) {
    var regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return regex.test(email);
}
function validatePhone(phone) {
    var regex = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;
    return regex.test(phone);
}