$(document).ready(() => {

  $('#myModal').on('shown.bs.modal', function() {
    $('#myInput').focus()
  })

  // populate certified coaches table in certified view
  if (document.location.href.match(/certified$/)) {

    $.getJSON("/api/coaches/certified").then(data => {

      let tbody = $('#certifiedList tbody')

      data.forEach((coach) => {
        tbody.append($(`<tr>
          <td>${coach.lastName}</td>
          <td>${coach.firstName}</td>
          <td>${coach.teamName}</td>
          <td>${coach.cprExpDate}</td>
          <td>${coach.faExpDate}</td>
          <td>${coach.ssExpDate}</td>
          <td>${coach.bgExpDate}</td>
          <td>${coach.usacMembership}</td>
          <td>${coach.isCertified}</td>
          <td>
            <div class="btn-group" role="group" aria-label="Basic example">
              <button type="button" class="btn"><a id="button-link-text" class="form-button-text" href="/admin/${coach.userId}/edit">EDIT</a></button>
            </div>
          </td>
        </tr>`))
      })
    })
  }

  // populate pending coaches table in pending view
  if (document.location.href.match(/pending$/)) {

    $.getJSON("/api/coaches/pending").then(data => {

      let tbody = $('#pendingList tbody')

      data.forEach((coach) => {
        tbody.append($(`<tr>
          <td>${coach.lastName}</td>
          <td>${coach.firstName}</td>
          <td>${coach.teamName}</td>
          <td>${coach.cprExpDate}</td>
          <td>${coach.faExpDate}</td>
          <td>${coach.ssExpDate}</td>
          <td>${coach.bgExpDate}</td>
          <td>${coach.usacMembership}</td>
          <td>${coach.isCertified}</td>
          <td>
            <div class="btn-group" role="group" aria-label="Basic example">
              <button type="button" class="btn"><a id="button-link-text" class="form-button-text" href="/admin/${coach.userId}/edit">EDIT</a></button>
            </div>
          </td>
        </tr>`))
      })
    })
  }

  // populate pending coaches table on home dashboard
  if (document.location.href.match(/home$/)) {

    $.getJSON("/api/coaches/home").then(data => {

      let tbody = $('#pendingList tbody')

      data.forEach((coach) => {
        tbody.append($(`<tr>
          <td>${coach.lastName}</td>
          <td>${coach.firstName}</td>
          <td>${coach.teamName}</td>
          <td>${coach.cprExpDate}</td>
          <td>${coach.faExpDate}</td>
          <td>${coach.ssExpDate}</td>
          <td>${coach.bgExpDate}</td>
          <td>${coach.usacMembership}</td>
          <td>${coach.isCertified}</td>
          <td>
            <div class="btn-group" role="group" aria-label="Basic example">
              <button type="button" class="btn"><a id="button-link-text" class="form-button-text" href="/admin/${coach.userId}/edit">EDIT</a></button>
            </div>
          </td>
        </tr>`))
      })
    })
  }


  // get one coach
  let checkId = document.location.href.match(/(\d+)\/edit$/)

  if (checkId) {
    let id = checkId[1]

    // grab the information from the token, saved during login
    // look up json web token javascript library
    // verify token and get payload...


    // grab information from the api with the id from token
    $.getJSON(`../../api/coaches/${id}`).then(data => {

      // set the form values to match the database info
      $('.admin-coach-header-first_name').html(data.firstName + "'s Coaching Profile")
      $('#admin-coach-dash-firstname').val(data.firstName)
      $('#admin-coach-dash-lastname').val(data.lastName)
      $('#admin-coach-dash-teamname').val(data.teamName)
      $('#admin-coach-dash-usacmem').val(data.usacMembership)
      $('#admin-coach-dash-bgExpDate').val(data.bgExpDate)

      if (data.cprLink) {
        $('#cprImage').attr('src', `${data.cprLink}`);
      }

      if (data.faLink) {
        $('#firstAidImage').attr('src', `${data.faLink}`);
      }

      if (data.ssLink) {
        $('#safeSportImage').attr('src', `${data.ssLink}`);
      }

      $('#modalViewBtnCpr').click((e) => {
        $('#modal-cprImage').attr('src', `${data.cprLink}`);
      })
      $('#modalViewBtnFirstAid').click((e) => {
        $('#modal-firstAidImage').attr('src', `${data.faLink}`);
      })
      $('#modalViewBtnSafeSort').click((e) => {
        $('#modal-safeSportImage').attr('src', `${data.ssLink}`);
      })

      // change certifed status from true/false to words
      if (data.isCertified == true) {
        $('#admin-coach-dash-is_certified').html('<h4 style="color:green;">USAC CERTIFIED</h4>')
        $('#certification_status').html('<button type="button" class="btn">Uncertify</button>')
      } else {
        $('#admin-coach-dash-is_certified').html('<h4 style="color:red;">NOT CERTIFIED</h4>')
        $('#certification_status').html('<button type="button" class="btn">Certify</button>')
      }

      // date form fields, check to see if value is null
      // CPR date check and set value
      let cprDate = $('#admin-coach-dash-cprExpDate').val()
      if (cprDate != 'X') {
        $('#admin-coach-dash-cprExpDate').val(data.cprExpDate)
      }
      // first aid date check and set value
      let faDate = $('#admin-coach-dash-faExpDate').val()
      if (faDate != 'X') {
        $('#admin-coach-dash-faExpDate').val(data.faExpDate)
      }
      // first aid date check and set value
      let ssDate = $('#admin-coach-dash-ssExpDate').val()
      if (ssDate != 'X') {
        $('#admin-coach-dash-ssExpDate').val(data.ssExpDate)
      }

      //listen for click on certify/uncertify button
      $('#certification_status').click((e) => {
        e.preventDefault()

        //change cert status
        let status

        if (data.isCertified == true) {
          status = 'false'
        } else if (data.isCertified == false) {
          status = 'true'
        }

        const newCertStatus = {
          contentType: 'application/json',
          data: JSON.stringify({
            isCertified: status
          }),
          dataType: 'json',
          type: 'PATCH',
          url: `../../api/coaches/${id}`
        }

        $.ajax(newCertStatus)
          .done(res => {
            window.location.href = `/admin/${id}/edit`
          })
      })


      // listen for click on update button
      $('#admin-coach-updateUser').click((e) => {
        e.preventDefault()

        // grab new values from fields
        let firstName = $('#admin-coach-dash-firstname').val()
        let lastName = $('#admin-coach-dash-lastname').val()
        let teamName = $('#admin-coach-dash-teamname').val()
        let usacMembership = $('#admin-coach-dash-usacmem').val()
        let bgExpDate = $('#admin-coach-dash-bgExpDate').val()
        let cprExpDate = $('#admin-coach-dash-cprExpDate').val()
        let faExpDate = $('#admin-coach-dash-faExpDate').val()
        let ssExpDate = $('#admin-coach-dash-ssExpDate').val()

        const options = {
          contentType: 'application/json',
          data: JSON.stringify({
            firstName,
            lastName,
            teamName,
            usacMembership,
            bgExpDate,
            cprExpDate,
            faExpDate,
            ssExpDate
          }),
          dataType: 'json',
          type: 'PATCH',
          url: `../../api/coaches/${id}`
        }

        $.ajax(options)
          .done(res => {
            $('#hidden-pop').removeClass('hidden')
            $('#hidden-pop').on('animationend', () => {
              setTimeout(function() {
                $('#hidden-pop').addClass('hidden')
              }, 1100);
            })
          })
          .fail((err, res) => {
            window.location.href = '../../error'
          })
      })

      // listen for click on delete coach button
      $('#admin-coach-deleteUser').click((e) => {
        e.preventDefault()
        $.ajax({
          url: `/api/coaches/${id}`,
          method: "DELETE",
          dataType: 'json'
        }).done(data => {
          window.location.href = '/admin/home'
        })
      })
    })
  }

  // populate current admin table in admin view
  if (document.location.href.match(/admins$/)) {

    $.getJSON("/api/admin/admins").then(data => {

      let tbody = $('#currentAdmin tbody')

      data.forEach((admin) => {
        tbody.append(`<tr>
          <td>${admin.username}</td>
          <td>
            <div class="btn-group" role="group" aria-label="Basic example">
              <button type="button" class="btn" data-id="${admin.id}">Delete</button>
            </div>
          </td>
        </tr>`)
      })
    })
  }

  // listen to delete button in admin table
  $('#currentAdmin tbody').on('click', '.deleteBtn', (e) => {
    let id = $(e.target).data('id')
    if (id) {
      $.ajax({
          url: `/api/admin/${id}`,
          type: "DELETE",
          dataType: 'json'
        })
        .done(data => {}).fail(window.location.href = '/admin/admins')
    }
  })

  //listen to add admin button
  $('#newAdminForm').submit((e) => {
    e.preventDefault()

    let data = $('#newAdminForm').serialize()

    $.post("/api/admin/", data, null, 'json').then((data) => {
      window.location.href = '/admin/admins'
    }).fail((err) => {})
  })

})
