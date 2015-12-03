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
          model.students[i].id = 'sid-' + (Date.now() + i);
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
    },

    updateModel: function(id, bool) {
      var i;
      for (i = 0; i < model.totalStudents; i++) {
        if (model.students[i].id === id) {
          model.students[i].numMissed += bool ? -1 : 1;
          localStorage.attendance = JSON.stringify(model.students);
          return model.students[i].numMissed;
        }
      }
      return 0;
    }
  };

  var controller = {
    init: function() {
      model.init();
      view.init(model.students, model.totalStudents, model.totalDays);
    },

    updateModel: function(id, bool) {
      var numMissed = model.updateModel(id, bool);
      return numMissed;
    }
  };

  var view = {
    init: function(students, totalStudents, totalDays) {
      view.render_thead(totalDays);
      view.render_tbody(students, totalStudents, totalDays);
      view.setEventHandlers();
    },

    render_thead: function(totalDays) {
      var $tr = $('<tr>');
      var $th = $('<th>').attr('class', 'name-col').text('Student Name');
      $tr.append($th);

      var i;
      for (i = 0; i < totalDays; i++) {
        $th = $('<th>').text(i + 1);
        $tr.append($th);
      }

      $th = $('<th>').attr('class', 'missed-col').text('Days Missed');
      $tr.append($th);

      $('thead').append($tr);
    },

    render_tbody: function(students, totalStudents, totalDays) {
      var i, j, $tr, $td, $input;
      for (i = 0; i < totalStudents; i++) {
        $tr = $('<tr>').attr({
            'class': 'student',
            'id': students[i].id
          });

        $td = $('<td>').attr('class', 'name-col').text(students[i].name);
        $tr.append($td);

        for (j = 0; j < totalDays; j++) {
          $input = $('<input>').attr('type', 'checkbox').prop('checked', students[i].attendance[j]);
          $td = $('<td>').attr('class', 'name-col').append($input);
          $tr.append($td);
        }

        $td = $('<td>').attr({
              'class': 'missed-col',
              'id': students[i].id
            }).text(students[i].numMissed);
        $tr.append($td);

        $('tbody').append($tr);
      }
    },

    setEventHandlers: function() {
      $('tbody input[type="checkbox"]').change(function() {
        var bool = $(this).prop('checked');
        var id = $(this).parent('td').parent('tr').attr('id');
        var numMissed = controller.updateModel(id, bool);
        $('td#' + id).text(numMissed);
      });
    }
  };

  controller.init();
}());
