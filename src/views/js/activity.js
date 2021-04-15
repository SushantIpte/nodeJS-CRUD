var tab;
$(document).ready(function (argument) {
    sav();
});

function sav() {
    var str;
    $.ajax({
        url: '/api/get',
        type: 'get',
        success: function (data) {
            tab = data;
            $('#table').html();
            str = `<tbody><tr>
                <th>Profile</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Contact</th>
                <th>Action</th>
            </tr>`;
            $.each(data, function (index, el) {
                str = str + `<tr>
                                <td><img src = "`+ data[index].Profile + `" width="30" height="30"></td>
                                <td>`+ data[index].First + `</td>
                                <td>`+ data[index].Last + `</td>
                                <td>`+ data[index].Email + `</td>
                                <td>`+ data[index].Contact + `</td>
                                <td><i onclick="delet('`+ data[index].Id + `')" class="fa fa-trash"></i> | <i onclick="edit('` + index + `','` + data[index].Id + `')" class="fa fa-edit"></i></td>
                            </tr>`;
            });
            $('#table').html(str + '</tbody>');
        },
        error: function (err) {
            alert('Error Fetching data');
            console.log(err);
        }
    });
}

function subm(params) {

}

function edit(index, id) {
    $('#first').val(tab[index].First);
    $('#last').val(tab[index].Last);
    $('#email').val(tab[index].Email);
    $('#contact').val(tab[index].Contact);
    $('#imageTag').html('');
    $('#imageTag').append('<img class="img img-thumbnail col-md-10" src="' + tab[index].Profile + '">')
    $('#form').append('<input class="form-control" type="hidden" name="_id" value=' + tab[index].Id + '>')
    $('#form').removeAttr('action');
    $('#form').attr('action', '/api/edit');
}

function submitForm() {
    var error = 0;
    if ($('#first').val() == '') {
        $('#first').css({ border: '4px solid red' })
        $('#span_first').css({ display: 'block' })
        error++
    } else {
        $('#first').css({ border: '' })
        $('#span_first').css({ display: 'none' })
    }

    if ($('#last').val() == '') {
        $('#last').css({ border: '4px solid red' })
        $('#span_last').css({ display: 'block' })
        error++
    } else {
        $('#last').css({ border: '' })
        $('#span_last').css({ display: 'none' })
    }

    if ($('#email').val() == '' || !validateEmail($('#email').val())) {
        $('#email').css({ border: '4px solid red' })
        $('#span_email').css({ display: 'block' })
        error++
    } else {
        $('#span_email').css({ display: 'none' })
        $('#email').css({ border: '' })
    }

    if ($('#contact').val() == '' || !validateContact($('#contact').val())) {
        $('#contact').css({ border: '4px solid red' })
        $('#span_contact').css({ display: 'block' })
        error++
    } else {
        $('#span_email').css({ display: 'none' })
        $('#contact').css({ border: '' })
    }

    if (error == 0) {
        // $('#form').submit();
        callSaveApi();
    } else {
        console.log(error)
    }
    // $('#form').submit();
}

function callSaveApi(params) {
    $.post({
        url: '/api/save',
        type: 'post',
        data: $("form-api").serializeArray(),
        success: function (data) {
            console.log(data);
        },
        error: function (err) {
            alert('Error Fetching data');
            console.log(err);
        }
    });
}

function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#imageTag').html('');
            $('#imageTag').append('<img class="img img-thumbnail col-md-10" src="' + e.target.result + '">')
        }
        reader.readAsDataURL(input.files[0]);
    }
}



function delet(id) {
    $.ajax({
        url: 'http://localhost:4000/api/delete',
        type: 'delete',
        data: { prodid: id },
        success: function (data) {
            alert("Successfully Deleted");
            sav();
        }
    });
}

function validateEmail(email) {
    var re = /\S+@\S+\.\S+/;
    var res = re.test(email);
    return res
}

function validateContact(number) {
    var re = /^\d{10}$/;
    var res = re.test(number);
    return res
}
