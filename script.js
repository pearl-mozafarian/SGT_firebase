$(function ($) {
    /** Create Operations ======================
     *
     */
            var currentFireBaseRef = new Firebase("https://lfchallenge.firebaseio.com/students");
            var addBtn = $("#add-student-btn");
            var sgtTable = $("#student-table");

    /** Click handler to submit student information
     * Take values of the student-add-form, assigns those values, then push the new object containing those keys and values to database and clear form
     */
            addBtn.click(function(){
                var studentName = $("#s-name-input").val(),
                    studentCourse = $("#s-course-input").val(),
                    studentGrade = $("#s-grade-input").val();
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
                $('#s-name-input').val('');
                $('#s-course-input').val('');
                $('#s-grade-input').val('');
            }


    /** Read Operations ======================
     * Attach an asynchronous callback to read the data at our users firebaseReference on load
     * child_added will update the DOM every-time a new student is added to the data base
     */
            currentFireBaseRef.on("child_added", function (snapshot) {
                updateDom(snapshot);
            }, function (error) {
                console.log("read error: ",error);
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
                    })
                });  //edit button click handler
        /** Edit Student Function
         * editStudentInfo func should take as parameter the studentInFireBaseRef, replace current studentInFireBaseRef info with new values from the input fields, then uses CRUD update() method to push to database when confirm button is clicked
         */
                function editStudentInfo(studentInFireBaseRef){
                    var newName = $("#modal-edit-name").val();
                    var newGrade = $("#modal-edit-grade").val();
                    var newCourse = $("#modal-edit-course").val();
                    studentInFireBaseRef.update({
                        name: newName,
                        grade: newGrade,
                        course: newCourse
                    })
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


    /** DOM CREATION ================================== */
    function updateDom(studentsnapshot) {
    var studentsObject = studentsnapshot.val();
        console.log("studentsObject =", studentsObject);
        console.log("studentsnapshot =", studentsnapshot);
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











});//end document ready
