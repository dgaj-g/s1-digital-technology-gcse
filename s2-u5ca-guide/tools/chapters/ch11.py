# Chapter 11, save the details to the file (DESIGN_SPEC §9 ch11, voice §7a). Run by tools/build_content.py with its helpers.
D = 'frmDataEntry'
B = 'btnSaveDetails_Click'
IN = 'inside the if of btnSaveDetails_Click'
P5 = ["pnlSwimLengths", "pnlReactionTest", "pnlQuizResult", "pnlPupilDetails", "pnlSwimmingGroup"]
CH = {
 "id": "11", "n": 11, "of": 15, "title": "Save the details to the file", "kind": "new", "color": "#6A994E",
 "one": "Put one line in the file, clear Global.cs, start again.",
 "prev": {"id": "10", "n": 10, "title": "Work out the group"},
 "next": {"id": "12", "n": 12, "title": "The report"},
 "methods": [[D, B]],
 "stages": [
  {"id": "1", "title": "Check what you need first", "screens": [
   {"id": "1", "title": "Check the parts this chapter needs", "foot": "have",
    "goal": "Before I start, I check the group, the Save button and Global.cs.",
    "blocks": [
    {"p": "This chapter uses work from earlier chapters. This screen checks that it is there."},
    {"check": [
     have("1-1.t1", "Is chapter 10 done, so a group appears when you click Calculate?",
          "Run the program. Do every part, then click Calculate.", "Go to chapter 10.", "#cw/10/1-1"),
     have("1-1.t2", "Is there a Save button under the panels, named btnSaveDetails?",
          "Open frmDataEntry in the Design tab. Click the Save button and look at its Name.", "Go to chapter 2, stage 3.", "#cw/02/3-1"),
     have("1-1.t3", "Does Global.cs have all fourteen names?",
          "Double-click Global.cs in Solution Explorer. Count the lines that start with public static.", "Go to chapter 3, stage 3.", "#cw/03/3-1")]}
   ]}]},
  {"id": "2", "title": "The file tools", "screens": [
   {"id": "1", "title": "Let the form use files", "foot": "done",
    "goal": "One line at the top of frmDataEntry's code lets this form use the file tools.",
    "blocks": [
    {"p": "Open frmDataEntry's code. Scroll to the very top. The top lines start with the word using. Click at the end of the last one and press Enter."},
    {"code": {"id": "2-1.c1", "kind": "type", "snippet": True, "title": "One line at the top", "lang": "cs",
              "where": "under the other using lines, at the very top of frmDataEntry's code",
              "text": "using System.IO;",
              "partLines": [[1, 1, "The file tools", "It lets this form use File, which writes to a file."]],
              "names": ["System.IO"], "isense": []}},
    {"p": "Without [[using System.IO|0]] the word File goes red."},
    {"words": [
      ["using System.IO", "A line at the top that lets the form use the file tools.", "2-1", True],
      ["~", "A wavy line. It sits between the pieces of a line, like a fence.", "4-1", True],
      ["Environment.NewLine", "The end of a line. The next words start on a new line.", "4-2", True],
      ["File.AppendAllText", "Adds words to the end of a file. It makes the file if it is not there.", "4-2", True]],
     "intro": "Four new words in this chapter. Click a marked word to see what it means."},
    {"box": {"title": "See where it goes", "fold": True, "blocks": [
      frames("F21", "The using line at the top", [
        ("f21-1", "The top of frmDataEntry.cs with using System.IO typed under the other using lines", "The new line sits under the other using lines.")])]}}
   ]}]},
  {"id": "3", "title": "Only when everything is done", "screens": [
   {"id": "1", "title": "Save only when all five panels are switched off", "foot": "done",
    "goal": "The Save code only goes ahead when all five panels are grey.",
    "blocks": [
    {"p": "In the Design tab, double-click the Save button. A panel is switched off when its part is done."},
    code("3-1.c1", "The Save button, part 1 of 6", "between the curly brackets of " + B, D, B, 1, 6,
         [given(1, 2),
          [3, 3, "Are all five panels grey?", "One long line. && means and. All five must be switched off."],
          [4, 6, "Room inside", "A curly bracket, then two empty lines. The saving goes here later."]],
         P5, []),
    {"watch": "Line 3 is one long line. Keep it on one line in Visual Studio."}
   ]},
   {"id": "2", "title": "If a panel is still on, stop", "foot": "done",
    "goal": "If any panel is still on, a message shows and nothing is saved.",
    "blocks": [
    {"p": "Click on the second empty line inside the if. The line numbers jump to 46, because the saving fills the gap later."},
    code("3-2.c1", "The Save button, part 2 of 6", "under the two empty lines inside the if", D, B, 46, 55,
         [[46, 48, "End the if", "Two empty lines, then the curly bracket that ends the if."],
          [49, 53, "Not done? Say so and stop", "else runs when a panel is still on. A message shows and return stops the code."],
          [54, 54, "An empty line", "Leave one empty line here."],
          given(55, 55)],
         [], []),
    {"watch": "The saving goes on the empty lines inside the if. The next screens fill them."}
   ]}]},
  {"id": "4", "title": "Write the line to the file", "screens": [
   {"id": "1", "title": "Join all the details into one line", "foot": "done",
    "goal": "All eleven details join into one line, with a ~ between each piece.",
    "blocks": [
    {"p": "Click on the first empty line inside the if. Each [[~|1]] is a fence between two pieces."},
    code("4-1.c1", "The Save button, part 3 of 6", "on the first empty line " + IN, D, B, 7, 18,
         [[7, 7, "A note", "A note about the fences. It does not run."],
          [8, 12, "The first five pieces", "Surname, first name, quiz score, year group and gender, each followed by a ~."],
          [13, 18, "The last six pieces", "The average, the three attempts, the test score and the group."]],
         ["record", "Global.surname", "Global.firstname", "Global.quizScore", "Global.yearGroup", "Global.gender",
          "Global.average", "Global.attempt1", "Global.attempt2", "Global.attempt3", "Global.reactionTestScore", "Global.assignedGroup"], []),
    {"drawn": {"id": "record-line", "pieces": ["Smith", "Anna", "4", "12", "F", "6.33", "5", "6", "8", "5", "Advanced"],
               "alt": "The line Smith~Anna~4~12~F~6.33~5~6~8~5~Advanced. Each piece has its own colour and a number from 0 to 10.",
               "say": "The order matters. The report reads the pieces back in this order."}}
   ]},
   {"id": "2", "title": "End the line and write the file", "foot": "done",
    "goal": "The line ends, goes on the end of the file and a message says it is saved.",
    "blocks": [
    {"p": "[[Environment.NewLine|2]] ends the line. [[File.AppendAllText|3]] adds it to the end of the file."},
    code("4-2.c1", "The Save button, part 4 of 6", "under part 3, " + IN, D, B, 19, 27,
         [[19, 21, "End the line", "An empty line and a note. Then the end of a line is added to record."],
          [22, 24, "Write it to the file", "An empty line and a note. Then record goes on the end of the file."],
          [25, 27, "Say it is saved", "A message tells the pupil it worked. Empty lines sit either side."]],
         ["record", "Environment.NewLine", "File.AppendAllText"], [],
         yours="MY file is pupilStats.txt. If YOU choose another name, type it in place of pupilStats.txt. The report needs the same name.")
   ]},
   {"id": "3", "title": "Clear Global.cs, first half", "foot": "done",
    "goal": "The first seven names in Global.cs go back to empty, ready for the next pupil.",
    "blocks": [
    {"p": "Global.cs still holds this pupil's details. Clear them, so the next pupil starts empty."},
    code("4-3.c1", "The Save button, part 5 of 6", "under part 4, " + IN, D, B, 28, 35,
         [[28, 28, "A note", "A note about clearing. It does not run."],
          [29, 33, "Empty words", "Words go back to two speech marks with nothing between them."],
          [34, 35, "Back to the start", "averageCalculated goes back to false. The average goes back to 0."]],
         ["Global.surname", "Global.firstname", "Global.quizScore", "Global.yearGroup", "Global.gender",
          "Global.averageCalculated", "Global.average"], [])
   ]},
   {"id": "4", "title": "Clear the rest and start again", "foot": "done",
    "goal": "The other seven names are cleared, the form closes and a fresh data entry form opens.",
    "blocks": [
    {"p": "Each number goes back to 0. Each true or false goes back to false."},
    code("4-4.c1", "The Save button, part 6 of 6", "under part 5, " + IN, D, B, 36, 45,
         [[36, 42, "The other seven", "The attempts, the test, the two true or false names and the group."],
          [43, 45, "Start again", "An empty line. Then this form closes and a fresh one opens."]],
         ["Global.attempt1", "Global.attempt2", "Global.attempt3", "Global.reactionTestScore", "Global.reactionTestTaken",
          "Global.quizTaken", "Global.assignedGroup", "frmDataEntry"], ["frmDataEntry"]),
    {"drawn": {"id": "fresh-screen", "alt": "The data entry form, fresh and empty, beside Global.cs.",
               "say": "The file keeps the line. The form starts fresh for the next pupil."}}
   ]}]},
  {"id": "5", "title": "Try it", "screens": [
   {"id": "1", "title": "Try your Save button", "foot": "chapter-done",
    "goal": "I save two pupils, find the file and check it has two lines with fences.",
    "blocks": [
    {"p": "Run your program. Log in and do every part. Click Calculate. Then try each row. The Find the file box shows the Debug folder."},
    {"check": [
     tryit("5-1.t1", "Click Save.", "The saved message shows. Then a fresh data entry form opens.", "Look at screens 4-2 and 4-4.", "#cw/11/4-2"),
     tryit("5-1.t2", "Stop the program. Find the Debug folder. Look for YOUR file.", "YOUR file is there, next to the program.", "Look at screen 4-2.", "#cw/11/4-2"),
     tryit("5-1.t3", "Double-click YOUR file. It opens in Notepad.", "One line, with a ~ between each piece.", "Look at screen 4-1.", "#cw/11/4-1"),
     tryit("5-1.t4", "Run again and save a second pupil. Open the file again.", "Two lines. The second pupil is on the second line.", "Look at screen 4-2.", "#cw/11/4-2"),
     tryit("5-1.t5", "Log in and click Save straight away.", "The not all results message shows. NO line is added to the file.", "Look at screens 3-1 and 3-2.", "#cw/11/3-1", neg=True)]},
    {"box": {"title": "Find the file", "fold": True, "blocks": [
      frames("F19", "Find the Debug folder", [
        ("f19-1", "Solution Explorer with the right-click menu open on the project", "Right-click the project. Click Open Folder in File Explorer."),
        ("f19-2", "File Explorer showing the bin folder", "Double-click bin."),
        ("f19-3", "File Explorer showing the Debug folder", "Double-click Debug.")])]}},
    {"box": {"title": "See the file", "fold": True, "blocks": [
      frames("F17", "The file after the first save", [
        ("f17-1", "The Debug folder with pupilStats.txt in it", "The file is in the Debug folder."),
        ("f17-2", "pupilStats.txt open in Notepad with one line and a ~ between the pieces", "One line, with a ~ between each piece.")])]}}
   ]}]}
 ]}
