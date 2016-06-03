$(function ($) {
    var ref = new Firebase("https://lfchallenge.firebaseio.com/students");
    /** Create Operations ======================
     *
     */


    /** Click handler to submit student information
     * Take values of the student-add-form
     */


    /** Send the values to firebase
     * firebaseRef.push will append a new item to the user list
     */

    /** Read Operations ======================
     * Attach an asynchronous callback to read the data at our users firebaseReference on load
     * child_added will update the DOM everytime a new student is added to the data base
     */
    ref.on("child_added", function (snapshot) {
        updateDom(snapshot);
    }), function (error) {
        console.log("read error: ",error);
    };


    /** Update Operations ======================
     * Click handler to update student data and send to firebase
     * Get the unique id of any student
     */

    /** Edit button handler */


    /** Edit Student Function
     * studentFirebaseReference argument should be the unique url of the selected student
     */


    /** Click handler for modal confirm button */


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
                id: uniqueKey,
                class: "row"
            });
            edit.append(sEditBtnIcon);
            del.append(sDeleteBtnIcon);
            sRow.append(sName,sCourse,sGrade,edit);
            $('#student-table').append(sRow);
        }
    };////end of update DOM











});
