/* STUDENTS IGNORE THIS FUNCTION
 * All this does is create an initial
 * attendance record if one is not found
 * within localStorage.
 */
(function() {
    if (!localStorage.attendance) {
        console.log('Creating attendance records...');
        function getRandom() {
            return (Math.random() >= 0.5);
        }

        var nameColumns = $('tbody .name-col'),
            attendance = {};

        nameColumns.each(function() {
            var name = this.innerText;
            attendance[name] = [];

            for (var i = 0; i <= 11; i++) {
                attendance[name].push(getRandom());
            }
        });

        localStorage.attendance = JSON.stringify(attendance);
    }
}());


/* STUDENT APPLICATION */
$(function() {
  'use strict';

  var model = {
    students: [
      {name: 'Slappy the Frog'},
      {name: 'Lilly the Lizard'},
      {name: 'Paulrus the Walrus'},
      {name: 'Gregory the Goat'},
      {name: 'Adam the Anaconda'}
    ],

    totalStudents: 5,
    totalDays: 12,

    getRandomBoolean: function() {
      return (Math.random() >= 0.5);
    },

    init: function() {
      model.totalStudents = model.students.length;
      if (!localStorage.attendance) {
        console.log('Creating attendance records...');
        var i, j, bool;
        for (i = 0; i < model.totalStudents; i++) {
          model.students[i].numMissed = 0;
          model.students[i].attendance = [];
          for (j = 0; j < model.totalDays; j++) {
            bool = model.getRandomBoolean();
            model.students[i].numMissed += bool ? 0 : 1;
            model.students[i].attendance.push(bool);
          }
        }
        localStorage.attendance = JSON.stringify(model.students);
      } else {
        model.students = JSON.parse(localStorage.attendance);
        model.totalStudents = model.students.length;
        model.totalDays = model.students[0].attendance.length;
      }
    }
  };


    var attendance = JSON.parse(localStorage.attendance),
        $allMissed = $('tbody .missed-col'),
        $allCheckboxes = $('tbody input');

    // Count a student's missed days
    function countMissing() {
        $allMissed.each(function() {
            var studentRow = $(this).parent('tr'),
                dayChecks = $(studentRow).children('td').children('input'),
                numMissed = 0;

            dayChecks.each(function() {
                if (!$(this).prop('checked')) {
                    numMissed++;
                }
            });

            $(this).text(numMissed);
        });
    }

    // Check boxes, based on attendace records
    $.each(attendance, function(name, days) {
        var studentRow = $('tbody .name-col:contains("' + name + '")').parent('tr'),
            dayChecks = $(studentRow).children('.attend-col').children('input');

        dayChecks.each(function(i) {
            $(this).prop('checked', days[i]);
        });
    });

    // When a checkbox is clicked, update localStorage
    $allCheckboxes.on('click', function() {
        var studentRows = $('tbody .student'),
            newAttendance = {};

        studentRows.each(function() {
            var name = $(this).children('.name-col').text(),
                $allCheckboxes = $(this).children('td').children('input');

            newAttendance[name] = [];

            $allCheckboxes.each(function() {
                newAttendance[name].push($(this).prop('checked'));
            });
        });

        countMissing();
        localStorage.attendance = JSON.stringify(newAttendance);
    });

    countMissing();
}());
