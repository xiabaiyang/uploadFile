// var OL_Action_Root = "http://127.0.0.1:3000"; 
var OL_Action_Root = "http://119.29.68.244:3000";

function upload() {            
    var formData = new FormData($("#imagelist")[0]);
    formData.append('picName', $('picName').val());
    $.ajax({
        url: OL_Action_Root + '/file_upload',
        type: 'POST',
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        success: function(data){
            var res = data;
            if(res.msg == 'success')
            {
                document.getElementById("status").innerHTML = "<span style='color:green'>文件上传成功</span>";
            }
            else
            {
                document.getElementById("status").innerHTML = "<span style='color:#EF0000'>文件上传失败</span>";
            }
        },
        error: function(jqXHR, textStatus, errorThrown){
            document.getElementById("status").innerHTML = "<span style='color:#EF0000'>连接不到服务器，请检查网络！</span>";
        }
    });
}

function getAllImages() {
    $.ajax({
        url: OL_Action_Root + '/getAllImages',
        type: 'get',
        success: function(data) {
            console.log(data);
        }
    });
}

function download(fileName) {
    $.ajax({
        url: OL_Action_Root + '/download',
        type: 'get',
        data: {
            fileName: fileName
        },
        success: function(data) {
            console.log(data);
        }
    });
}