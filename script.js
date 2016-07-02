$(function ($) {
    var sgt = {
        index: 0,
        displayArray: [],
        studentArray: []
    };
    /** Create Operations ======================
     *
     */
            // var currentFireBaseRef = new Firebase("https://lfchallenge.firebaseio.com/students");
            var currentFireBaseRef = new Firebase("https://boiling-torch-7959.firebaseio.com/");
            var addBtn = $("#add-student-btn");
            var sgtTable = $("#student-table");

    /** Click handler to submit student information
     * Take values of the student-add-form, assigns those values, then push the new object containing those keys and values to database and clear form
     */
            addBtn.click(function(){
                var studentName = capitalizeFirstLetter($("#s-name-input").val()),
                    studentCourse = $("#s-course-input").val().toUpperCase(),
                    studentGrade = parseFloat($("#s-grade-input").val());
                        //console.log("testing addBtn click handler: ", studentName, studentCourse, studentGrade);
                currentFireBaseRef.push({
                    name: studentName,
                    course: studentCourse,
                    grade: studentGrade
                });
                clearAddStudentForm();
            });//addBtn click handler

    /**ClearAddStudentForm function, empties the input fields of the AddStudent form*/
            function clearAddStudentForm(){
                $('#s-name-input').val('eg.John');
                $('#s-course-input').val('');
                $('#s-grade-input').val('');
            }


    /** Read Operations ======================
     * Attach an asynchronous callback to read the data at our users firebaseReference on load
     * child_added will update the DOM every-time a new student is added to the data base
     */


            currentFireBaseRef.on("child_added", function (snapshot) {
                updateDom(snapshot);
                currentSnapshot();
            }, function (error) {
                console.log("read error: ",error);
            });

            currentFireBaseRef.on("child_changed", function (studentSnapShot) {
                updateDom(studentSnapShot);
                currentSnapshot();
            }, function (errorObject) {
                console.log("The read on update failed: " + errorObject.code);
            });
    currentFireBaseRef.on("child_removed",function (snapshot) {
        var theRow = snapshot.key();
        // console.log("the row:",$("#",theRow));
        $("#"+theRow).remove();
        currentSnapshot();
    });
    /** Update Operations ======================
     * Click handler to update student data and send to firebase
     * Get the unique id of any student
     */

        /** Edit button handler - calls the edit student info modal*/
                sgtTable.on("click",".edit-btn", function(){
                    var studentObjectId = $(this).data('id');
                    var studentInFireBaseRef = currentFireBaseRef.child(studentObjectId);
                    /** correlate studentObject information and modal inputs in order to populate info when modal is called*/
                    studentInFireBaseRef.once('value', function(snapshot){
                        $("#modal-edit-name").val(snapshot.val().name);
                        $("#modal-edit-grade").val(snapshot.val().grade);
                        $("#modal-edit-course").val(snapshot.val().course);
                        $("#student-id").val(studentObjectId);
                        $("#edit-modal").modal("show");
                    });
                });  //edit button click handler
        /** Edit Student Function
         * editStudentInfo func should take as parameter the studentInFireBaseRef, replace current studentInFireBaseRef info with new values from the input fields, then uses CRUD update() method to push to database when confirm button is clicked
         */
                function editStudentInfo(studentInFireBaseRef){
                    var newName = capitalizeFirstLetter($("#modal-edit-name").val());
                    var newGrade = parseFloat($("#modal-edit-grade").val());
                    var newCourse =$("#modal-edit-course").val().toUpperCase();
                    studentInFireBaseRef.update({
                        name: newName,
                        grade: newGrade,
                        course: newCourse
                    });
                }//end editStudentInfo

        /** Click handler for modal confirm button - define current studentObj, call editStudentInfo, pass in the correct student, hide modal */

            $("#edit-modal").on("click","#confirm-edit", function(){
                var studentInFireBaseRefID = $("#student-id").val();
                var studentInFireBaseRef = currentFireBaseRef.child(studentInFireBaseRefID);
                editStudentInfo(studentInFireBaseRef);
                $("#edit-modal").modal('hide');
            }); //end confirm click handler
    /** DELETE OPERATIONS ==================================
     *
     */

    /** Delete button handler */
      sgtTable.on("click",".delete-btn",function () {
          var stdfirebaseref = currentFireBaseRef.child($(this).data('id'));
          console.log("delete: ",stdfirebaseref);
          stdfirebaseref.remove();
      });

    /** DOM CREATION ================================== */
    function updateDom(studentsnapshot) {
        console.log("inside update dom");
    var studentsObject = studentsnapshot.val();
        // console.log("studentsObject =", studentsObject);
        // console.log("studentsnapshot =", studentsnapshot);
    var uniqueKey = studentsnapshot.key();
        //console.log("uniqueKey =", uniqueKey);
        var row = $("#"+uniqueKey);
        if(row.length>0){  //update existing studentObject
            row.find('.name').text(studentsObject.name);
            row.find('.course').text(studentsObject.course);
            row.find('.grade').text(studentsObject.grade);
        }
        else{
            ////add a new row
            var sName=$("<td>",{
                text: studentsObject.name,
                class: "name"
            });
            var sCourse=$("<td>",{
                text: studentsObject.course,
                class: "course"
            });
            var sGrade=$("<td>",{
                text: studentsObject.grade,
                class: "grade"
            });
            var edit=$("<button>",{
                class: "btn btn-info edit-btn",
                'data-id': uniqueKey
            });
            var sEditBtnIcon = $('<span>', {
                class: "glyphicon glyphicon-pencil"
            });
            var del = $("<button>",{
                class: "btn btn-danger delete-btn",
                'data-id': uniqueKey
            });
            var sDeleteBtnIcon = $('<span>', {
                class: "glyphicon glyphicon-remove"
            });
            var sRow = $("<tr>",{
                id: uniqueKey
            });
            edit.append(sEditBtnIcon);
            del.append(sDeleteBtnIcon);
            sRow.append(sName,sCourse,sGrade,edit,del);
            $('#student-table').append(sRow);
        }
    }////end of update DOM
////cancel button click handler
    $("#cancel-btn").on("click",function () {
        clearAddStudentForm();
    });

    //////////////////////reading current info from db//////////////
    function currentSnapshot() {
        sgt.studentArray = [];
        currentFireBaseRef.once("value", function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
                // key will be "fred" the first time and "barney" the second time
                var key = childSnapshot.key();
                // childData will be the actual contents of the child
                var childData = childSnapshot.val();
                sgt.studentArray.push(childData);
                // console.log("child data: ",childData);
            });
            // console.log("student array : ", sgt.studentArray);
            calculateAverage();
        }, function (errorObject) {
            console.log("The read failed: " + errorObject.code);
        });
    }

    ////////////////average calculate////////////////////////
    function calculateAverage() {
        // console.log("inside cal");

        if (sgt.studentArray.length > 0) {
            var total = 0;
            for (var i = 0; i < sgt.studentArray.length; i++) {
                total += parseFloat(sgt.studentArray[i].grade);
            }
            var average =  Math.round(total / (sgt.studentArray.length));
        } else {
            var average =  0;
        }
        $(".avgGrade").text(average);
        // updateDom();
    }
 ///////////////////////sort////////////////////
    $('.sort').hide();
    $('.sort-reverse').click(function() {

        sort(this);
        $(this).siblings(0).show();
        $(this).hide();
    });

    function sort(object) {
        switch ($(object).attr('column')) {
            case 'name-col':
                $("#course .sort").hide();
                $("#course .sort-reverse").show();
                $("#grade .sort").hide();
                $("#grade .sort-reverse").show();

                console.log("name sort");
                $("tbody").empty();
                currentFireBaseRef.orderByChild("name").on("child_added",function(snapshot) {
                    console.log("sort snapshot: " , snapshot.val());
                    updateDom(snapshot);
                });
                break;
            case 'course-col':

                $("#name .sort").hide();
                $("#name .sort-reverse").show();
                $("#grade .sort").hide();
                $("#grade .sort-reverse").show();
                console.log("course sort");
                $("tbody").empty();
                currentFireBaseRef.orderByChild("course").on("child_added",function(snapshot) {
                    console.log("sort snapshot: " , snapshot.val());
                    updateDom(snapshot);
                });
                break;
            case 'grade-col':
                $("#name .sort").hide();
                $("#name .sort-reverse").show();
                $("#course .sort").hide();
                $("#course .sort-reverse").show();
                console.log("grade sort");
                $("tbody").empty();
                currentFireBaseRef.orderByChild("grade").on("child_added",function(snapshot) {
                    console.log("sort snapshot: " , snapshot.val());
                    updateDom(snapshot);
                });
                break;
        }
    }
    //////////////////////////capitalize function///////////////////////
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
});//end document ready

