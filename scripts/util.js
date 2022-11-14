function doLogin(){
    var inUN = document.getElementById('inUN').value;
    var inPWD = document.getElementById('inPWD').value;
    var loginData = JSON.parse(localStorage.getItem('loginDetail'));
    if(inUN !== '' && inPWD !== ''){
        for(var i=0; i<loginData.length; i++){
            if(inUN === loginData[i].userName && inPWD === loginData[i].password){
                localStorage.setItem('sessionID', loginData[i].userID + '_' + loginData[i].displayName);
                location.href = 'bot.html';
                return;
            }
        }
        alert('User Tidak Ditemukan');
    } else {
        alert('Masukan UserName dan Password Anda');
    }
}

function doLogout(){
    location.href = 'index.html';
}

var UID = '';
function checkSession(){
    var SID = localStorage.getItem('sessionID');
    if(SID){
        UID = localStorage.getItem('sessionID').split('_')[0];
        var dvUser = document.getElementById('dvUser');
        dvUser.innerHTML = 'Selamat Datang, ' + SID.split('_')[1] + '&nbsp;<span class="logoutLink" onclick="doLogout()">[LOGOUT]</span>';
        $.ajax({
            url: "https://jsonplaceholder.typicode.com/posts",
            method: "GET",
            dataType: 'json',
            success: renderPost
        });
        $.ajax({
            url: "https://jsonplaceholder.typicode.com/todos",
            method: "POST",
            dataType: 'json',
            success: renderTodo
        });
    } else {
        location.href = 'index.html';
    }
}
function renderPost(data){
    var retVal = '';
    var dvContent = document.getElementById('dvPosts');
    for(var i=0; i<data.length; i++){
        if(Number(UID) === data[i].userId){
            retVal += ['<div class="wrapper"><div class="title">',data[i].title,'</div>'
                ,'<div class="body">',data[i].body,'</div>'
                ,'<div class="comment" onclick="getComment(',data[i].id,')">Baca Komentar</div>'
                ,'</div>'
            ].join('');
        }
    }
    if(retVal !== ''){
        dvContent.innerHTML = 'Berikut Daftar Post anda : <br/>' + retVal;    
    } else {
        dvContent.innerHTML = 'Belum ada Post';
    }
    
}

function renderTodo(data){
    var retVal = '';
    var dvContent = document.getElementById('dvTodos');
    for(var i=0; i<data.length; i++){
        if(Number(UID) === data[i].userId){
            retVal += ['<div class="wrapperTodo ',(data[i].completed ? 'red' : 'green'),'"><div class="todotitle">',data[i].title,'</div></div>'
            ].join('');
        }
    }
    if(retVal !== ''){
        dvContent.innerHTML = 'Berikut Daftar ToDo anda : <br/>' + retVal;    
    } else {
        dvContent.innerHTML = 'Belum ada ToDo';
    }
}

function getComment(postid){
    $.ajax({
        url: ['https://jsonplaceholder.typicode.com/posts/',postid,'/comments'].join(''),
        method: "GET",
        dataType: 'json',
        success: showComment
    });
}

function showComment(comments){
    var retBody = '';
    for(var i=0; i<comments.length; i++){
        retBody += ['<div class="wrapperComment">'
            ,'<div class="emailComment">',comments[i].email,' (',comments[i].name, ')</div>'
            ,'<div class="bodyComment">',comments[i].body,'</div>'
            ,'</div>'
        ].join('');
    }
    $('#dvModalBody').html(retBody);
    $('#myModal').modal('show');
}

function closeModal(){
    $('#myModal').modal('hide');
}