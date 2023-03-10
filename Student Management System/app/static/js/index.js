const signUpBtnLink = document.querySelector('.signUpBtn-link');
const signInBtnLink = document.querySelector('.signInBtn-link');
const wrapper = document.querySelector('.wrapper');

signUpBtnLink.addEventListener('click', () => {
    wrapper.classList.toggle('active');
});

signInBtnLink.addEventListener('click', () => {
    wrapper.classList.toggle('active');
});


const csrf = $('#csrf_token').val();



$('document').ready(function(){
    $('#college_searchbar').on('input', search_college)
    $('#college_filter').on('change', search_college)
    $('#course_searchbar').on('input',course_search)
    $('#course_filter').on('change',course_search)
    $('#student_searchbar').on('input', student_search)
    $('#student_filter').on('input', student_search)
    $('#gender_filter').on('input', student_search)
    $('.profile_pic').on('click', expand_img)
    
})



function student_search(){
    var search_query = $('#student_searchbar').val();
    var search_filter = $('#student_filter').val();
    var gender_filter = $('#gender_filter').val();
    const student_thead = $('#student_thead');
    const student_tbody = $('#student_tbody');  
    const student_tc = $('#student_tc');
    console.log(search_query)
    fetch('/student-search', {
        method: 'POST',
        credentials: "include",
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrf,
        },
        body: JSON.stringify({ 
            search_query: search_query,
            search_filter: search_filter,
            gender_filter: gender_filter,
            }),
      }).then(response => (response.json()))
      .then(function(response){
          student_tbody.html('')
          for(var i=0; i<response[0].length; i++){
              
             course = response[0][i][6]
             year = response[0][i][4]
             gender = response[0][i][5]
             if (response[0][i][7]){
                img_src = response[0][i][7]
             } else {
                img_src = '../../static/img/default_profile.jpeg'
             }
             
            student_tbody.append(`
            <tr>
            <td class="text-center"> 
              <div class="d-flex justify-content-center p-0 "> 
                <div class="b-ovr-pic p-0">
                     <a type="button" style="text-decoration: none;" class="a-ovr-pic d-flex justify-content-center align-items-center flex-column p-0 m-0" data-bs-target="#student-picture${response[0][i][0]}" data-bs-toggle="modal">
                     <i class="bi-eye text-light" style="font-size: 18px"></i>
                     <span class="text-light"style="font-size: 12px;">View</span>
                     </a>
                     <img src="${img_src}" alt="${response[0][i][0]}_profile_picture" class="profile_pic" loading="lazy">
                </div>
              </div>
            </td>
            <th scope="row" class="text-center">${response[0][i][0]}</th>
            <td>${response[0][i][1]}</td>
            <td>${response[0][i][2]}</td>
            <td id="student_course${response[0][i][0]}"></td>
            <td>${response[0][i][4]}</td>
            <td>${response[0][i][5]}</td>
  
            <td class="pe-0 text-center">
                <a href="/student-edit/${response[0][i][0]}"class="btn btn-warning btn-sm my-1" role="button" aria-pressed="true" data-bs-toggle="modal" data-bs-target="#editstudent${response[0][i][0]}" style="width: 100px;" onmouseover="set_selectfield('${course}','${year}','${gender}')"><i class="bi-pencil-fill"></i></a>
  
                <a href="/student-delete/${response[0][i][0]}" class="btn btn-danger btn-sm my-1" role="button" aria-pressed="true" style="width: 100px;" data-bs-target="#confirmdelete${response[0][i][0]}" data-bs-toggle="modal"><i class="bi-trash-fill"></i></a>
  
            </td>
            `)
            if (!response[0][i][3]){
            $("#student_course"+response[0][i][0]).html('<p class="fst-italic fw-light my-auto h-50"> Course Removed</p>')
            } else {
            $("#student_course"+response[0][i][0]).html(response[0][i][3])
            }

      }
    })

}


function course_search(){
    var search_query = $('#course_searchbar').val()
    var search_filter = $('#course_filter').val();
    const course_thead = $('#course_thead');
    const course_tbody = $('#course_tbody');  
    const course_tc = $('#course_tc');

    fetch('/course-search', {
        method: 'POST',
        credentials: "include",
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrf,
        },
        body: JSON.stringify({ 
            search_query: search_query,
            search_filter: search_filter,
            }),
      }).then(response => (response.json()))
      .then(function(response) {
            course_tbody.html('')
        for(var i = 0; i<response[0].length; i++){
        
        
        course_tbody.append(
            '<tr>'+
            '<th scope="row" class="text-center">'+response[0][i][0]+'</th>'+
            '<td>'+response[0][i][1]+'</td>'+
            '<td id="course_college'+response[0][i][0]+'"></td>'+
            
            '<td class="pe-0 text-center">'+
                '<a href="/course-edit/'+response[0][i][0]+'"class="btn btn-warning btn-sm my-1 me-1" role="button"'+ 'aria-pressed="true" data-bs-toggle="modal" data-bs-target="#editcourse'+response[0][i][0]+'" style="width:'+ `100px;" onmouseover="course_selectfield('${response[0][i][3]}')"><i class="bi-pencil-fill"></i></a>`+
  
                '<a href="/course-delete/'+response[0][i][0]+'" class="btn btn-danger btn-sm my-1" role="button"'+ 'aria-pressed="true" style="width: 100px;" data-bs-target="#confirmdelete'+response[0][i][0]+'"'+ 'data-bs-toggle="modal"><i class="bi-trash-fill"></i></a>'+
  
            '</td>'+
            '</tr>'
        )

        if (!response[0][i][2]){
            $('#course_college'+response[0][i][0]).html('<p class="fst-italic fw-light my-auto h-50">College Removed</p>')
        }
        else {
            $('#course_college'+response[0][i][0]).html(response[0][i][2])
        }
      }    
    })
    
}

function search_college(){
    var search_query = $('#college_searchbar').val();
    var search_filter = $('#college_filter').val();
    const college_thead = $('#college_thead');
    const college_tbody = $('#college_tbody');  
    const college_tc = $('#college_tc');
    fetch('/college-search', {
      method: 'POST',
      credentials: "include",
      headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrf,
      },
      body: JSON.stringify({ 
          search_query: search_query,
          search_filter: search_filter,
          }),
    }).then(response => (response.json()))
    .then(function(response) {
        college_tbody.html('')
        
        for(var i = 0; i<response[0].length; i++){
          college_tbody.append(
          '<tr id="college_row">'+
              '<th scope="row" class="ps-5">'+response[0][i][0]+'</th>'+
              '<td>'+response[0][i][1]+'</td>'+
              '<td class="pe-0 text-center">'+
                  '<a href="/college-edit/'+response[0][i][0]+'"class="btn btn-warning btn-sm my-1 me-1" role="button"'+ 'aria-pressed="true" data-bs-toggle="modal" data-bs-target="#editcollege'+response[0][i][0]+'" style="width:'+ '100px;"><i class="bi-pencil-fill"></i></a>'+
  
                  '<button class="btn btn-danger btn-sm my-1" type="button" aria-pressed="true" style="width: 100px;"'+ 'data-bs-target="#confirmdelete'+response[0][i][0]+'" data-bs-toggle="modal"><i class="bi-trash-fill"></i></button>'+
              '</td>'+
              '</tr>'
          )
          
      }      
  })
}

function verify_info(csrf, url, dest) {

    fetch(url, {
        method: 'POST',
        credentials: "include",
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrf
          },
        body: JSON.stringify({ 
            email: $('#email').val(),
            password: $('#password').val(), 
            password2: $('#password2').val(),
            }),
        })
        .then(response => {
            if (response.status == 299){
                console.log('Successfully registered')
                window.location.replace(dest)    
            } else if( response.status == 497){
                console.log('Verified connection')
                return
            } 
            return response.json()
            

        })
        .then(function(responses) {
            responses[1].forEach(function(field){

                formfield = $('#'+field);
                formfieldnext = formfield.next();
                formfieldnext.html('');
                formfield.css({"border-color":""});
                if (field in responses[0]) {
                    formfield.css({"border-color":"red"});
                    formfieldnext.html(
                        "<span class=\"ms-auto float-end text-danger\">"+responses[0][field][0]+" <i class=\"bi-exclamation-circle-fill\"></i> </span>");
                } else{
                    if (responses[1].length < 5){
                        return
                    }
                    formfield.css({"border-color":"green"});
                    formfieldnext.html("<span class=\"ms-auto float-end text-success\">Looks Good! <i class=\"bi-check-circle-fill\"></i> </span>");
                    formfieldnext.css({"color":"green"});
                }
            })
            

        })
}


 
function verify_college(csrf, mode,hid=0) {
    item1 = $('#college_code')
    item2 = $('#college_name')
    if (mode == 1){
        item1 = $('div#editcollege'+hid+' #college_code')
        item2 = $('div#editcollege'+hid+' #college_name')
    } 

    fetch('/college-verify', {
        method: 'POST',
        credentials: "include",
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrf
          },
        body: JSON.stringify({ 
            college_code: item1.val(),
            college_name: item2.val(), 
            hid: hid,
            mode: mode,
            }),
        })
        .then(response => {
            if (response.status == 299){
                console.log('Successfully Added College') 
                location.reload()
                return
            } else if( response.status == 497){
                console.log('Verified connection')
                return
            } 
            return response.json()
        })
        .then(function(responses) {
            responses[1].forEach(function(field){
                
                if (field in responses[0]) {
                    
                    formfield = $('#'+field);
                    if (mode == 1){
                        $('div#confirm'+hid+' #back').click(); 
                        formfield = $('div#editcollege'+hid+' #'+field)
                    }
                    formfieldnext = formfield.next();
                    formfield.css({"border-color":"red"});
                    formfieldnext.html('');
                    formfieldnext.html(
                        "<span class=\"ms-auto float-end text-danger\">"+responses[0][field][0]+" <i class=\"bi-exclamation-circle-fill\"></i> </span>");
                } else{
                    formfield = $('.modal-body #'+field);
                    if (mode == 1){
                        formfield = $('div#editcollege'+hid+' #'+field)
                    }
                    formfieldnext = formfield.next();
                    formfield.css({"border-color":"green"});
                    formfieldnext.html("<span class=\"ms-auto float-end text-success\">Looks Good! <i class=\"bi-check-circle-fill\"></i> </span>");
                    formfieldnext.css({"color":"green"});
                }
            })
        })
}


function verify_course(mode,hid=0) {
    course_code = $('div#addcourse #course_code')
    course_name = $('div#addcourse #course_name')
    college_origin = $('div#addcourse #college')
    if (mode == 1){
        course_code = $('div#editcourse'+hid+' #course_code')
        course_name = $('div#editcourse'+hid+' #course_name')
        college_origin = $('div#editcourse'+hid+' #college')

    } 

    fetch('/course-verify', {
        method: 'POST',     
        credentials: "include",
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrf
          },
        body: JSON.stringify({ 
            course_code: course_code.val(),
            course_name: course_name.val(),
            college: college_origin.val(),
            hid: hid,
            mode: mode,
            }),
        })
        .then(response => {
            if (response.status == 299){
                console.log('Successfully Added Course') 
                location.reload()
                return
            } else if( response.status == 497){
                console.log('Verified connection')
                return
            } 
            return response.json()
        })
        .then(function(responses) {
            responses[1].forEach(function(field){
                if (field == 'college'){
                    return;
                }
                if (field in responses[0]) {
                    
                    formfield = $('#'+field);
                    if (mode == 1){
                        $('div#confirm'+hid+' #back').click(); 
                        
                        formfield = $('div#editcourse'+hid+' #'+field)
                    }

                    formfieldnext = formfield.next();
                    formfield.css({"border-color":"red"});
                    formfieldnext.html('');
                    formfieldnext.html(
                        "<span class=\"ms-auto float-end text-danger\">"+responses[0][field][0]+" <i class=\"bi-exclamation-circle-fill\"></i> </span>");
                } else {
                    formfield = $('.modal-body #'+field);
                    if (mode == 1){
                        formfield = $('div#editcourse'+hid+' #'+field)
                    }
                    formfieldnext = formfield.next();
                    formfield.css({"border-color":"green"});
                    formfieldnext.html("<span class=\"ms-auto float-end text-success\">Looks Good! <i class=\"bi-check-circle-fill\"></i> </span>");
                    formfieldnext.css({"color":"green"});
                }
            })
        })
}


function verify_student(mode,hid=0) {
    student_id = $('div#addstudent #id')
    last_name = $('div#addstudent #last_name')
    first_name = $('div#addstudent #first_name')
    year = $('div#addstudent #year')
    gender = $('div#addstudent #gender')
    course = $('div#addstudent #course')
    profile_pic = $('div#addstudent #profile_pic')
    cover = $('div#addstudent .modal-content')
    if (mode == 1){
        student_id = $('div#editstudent'+hid+' #id')
        last_name = $('div#editstudent'+hid+' #last_name')
        first_name = $('div#editstudent'+hid+' #first_name')
        year = $('div#editstudent'+hid+' #year')
        gender = $('div#editstudent'+hid+' #gender')
        course = $('div#editstudent'+hid+' #course')
        modal = $('div#editstudent'+hid)
        profile_pic = $('div#editstudent'+hid+' #'+hid+'_profile_picture')
        cover = $('div#confirm'+hid+' .modal-body')

    }

    fetch('/student-verify', {
        method: 'POST',     
        credentials: "include",
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrf
          },
        body: JSON.stringify({ 
            id: student_id.val(),
            last_name: last_name.val(),
            first_name: first_name.val(),
            year: year.val(),
            gender: gender.val(),
            course: course.val(),
            hid: hid,
            mode: mode,
            }),
        })
        .then(async response => {
            if (response.status == 299){
                console.log('Successfully Verified Student')
                wait_upload(cover, mode)
                await upload_img(response.json(), profile_pic, student_id)
                location.reload()
                return
            } else if(response.status == 497){
                console.log('Verified connection')
                return
            } else {
            return response.json()
            }
        })  
        .then(function(responses) {
            var scrolled = false;
            responses[1].forEach(function(field){
                if (field == 'year' || field == 'gender' || field == 'course'){
                    return
                }
                if (field in responses[0]) {
                    
                    formfield = $('#'+field);
                    if (mode == 1){
                        $('div#confirm'+hid+' #back').click(); 
                        
                        formfield = $('div#editstudent'+hid+' #'+field)
                        if (!scrolled){
                            $('.verify-student-modal').animate({
                                scrollTop: '+=150px'
                            });     
                            scrolled = true;
                        }
                    }
                    if (!scrolled){
                        $('.verify-student-modal').animate({
                            scrollTop: formfield.offset().top
                        });     
                        scrolled = true;
                    }
                    formfieldnext = formfield.next();
                    formfield.css({"border-color":"red"});
                    formfieldnext.html('');
                    formfieldnext.html(
                        "<span class=\"ms-auto float-end text-danger\">"+responses[0][field][0]+" <i class=\"bi-exclamation-circle-fill\"></i> </span>");
                } else {
                    formfield = $('.modal-body #'+field);
                    if (mode == 1){
                        formfield = $('div#editstudent'+hid+' #'+field)
                    }
                    formfieldnext = formfield.next();
                    formfield.css({"border-color":"green"});
                    formfieldnext.html("<span class=\"ms-auto float-end text-success\">Looks Good! <i class=\"bi-check-circle-fill\"></i> </span>");
                    formfieldnext.css({"color":"green"});
                }
            })
        })
}

function set_selectfield(code,year,gender){
    $('.set_course').val(code)
    $('.set_year').val(year)
    $('.set_gender').val(gender)
}

function course_selectfield(college) {
    $('.set_college').val(college)
}

function wait_upload(parent, mode){
    if (mode == 0){
        parent.prepend(`
        <div class="a-overlay">
            <span class="msu-text loader d-flex align-items-center">Adding Student...<div class="spinner-border msu-text loader ms-2" role="status"></div></span>
        </div>
        `)
    } else {
        parent.prepend(`
        <div class="a-overlay">
            <span class="msu-text loader d-flex align-items-center">Saving Changes...<div class="spinner-border msu-text loader ms-2" role="status"></div></span>
        </div>
        `)
    }
    

}


async function upload_img(response,profile_pic, student_id){
    final_res = await response.then(async function(response) {
        the_file = profile_pic.get(0).files[0]
        formData = new FormData()
        formData.append('file', the_file);
        formData.append('public_id', response[0]['public_id']);
        formData.append('api_key', response[0]['api_key']);
        formData.append('signature', response[0]['signature']);
        formData.append('folder', response[0]['folder']);
        formData.append('timestamp', response[0]['timestamp'])
        

        result = await fetch('https://api.cloudinary.com/v1_1/bermudo-cloud/image/upload', {
            method: 'POST',    
            body: formData,
        }).then(function(response){
            console.log(response)
            return response.json()
        }).then(async function(response) {
            console.log(response['secure_url'])

            result = await fetch('/upload-profile', {
            method: 'POST',     
            headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrf
            },
            body: JSON.stringify({
                profile_pic: response['secure_url'],
                student_id: student_id.val(),
            }),
            }).then((response) => {
                if (response.status == 299){
                    return response
                }
            })
            console.log(result)
            return result
        })
        console.log(result)
        return result
        

    })
    return final_res
}

function change_profile(input, img_container){
    var img = $('#'+img_container);
    img_url= URL.createObjectURL(input.files[0]);
    img.attr('src',img_url)
}