# Chapter 11, save the details to the file (DESIGN_SPEC §9 ch11, voice §7a). Run by tools/build_content.py with its helpers.
# Round 3 (21 Oct 2026): the Save button is typed in line order, 1 to 55, in six chunks; the else chunk comes last.
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
  {"id": "1", "title": "Check what you need first", "thing": "the parts this chapter needs", "verb": "checking", "screens": [
   {"id": "1", "title": "Check the parts this chapter needs", "foot": "have", "done": "every row is ticked, or you have gone where its link says",
    "goal": "Before I start, I check the group, the Save button and Global.cs.",
    "blocks": [
    {"p": "This chapter uses work from earlier chapters, so this screen checks that it is there."},
    {"check": [
     have("1-1.t1", "Is chapter 10 done, so a group appears when you click Calculate?",
          "Run the program. Do every part, then click Calculate.", "Go to chapter 10.", "#cw/10/1-1"),
     have("1-1.t2", "Is there a Save button under the panels, named btnSaveDetails?",
          "Open frmDataEntry in the Design tab. Click the Save button and look at its Name.", "Go to chapter 2, part 3.", "#cw/02/3-1"),
     have("1-1.t3", "Does Global.cs have all fourteen names?",
          "Double-click Global.cs in Solution Explorer. Count the lines that start with public static.", "Go to chapter 3, part 3.", "#cw/03/3-1")]}
   ]}]},
  {"id": "2", "title": "The file tools", "thing": "the file tools line", "verb": "making", "screens": [
   opener("Add the line that lets the form use files", "This part adds one line at the top of frmDataEntry's code, after four new words.",
          "One line at the very top of frmDataEntry's code lets this form use File. Four new words come first.",
          "When it works, using System.IO sits under the other using lines and File is not red."),
   {"id": "1", "title": "Meet the four new words", "foot": "next", "done": "you have read the four words",
    "goal": "I know the four new words before I type any of them.",
    "blocks": [
    {"p": "Four new words come up in this chapter."},
    {"words": [
      ["using System.IO", "A line at the top that lets the form use the file tools.", "2-2", True],
      ["~", "A wavy line. It sits between the pieces of a line, like a fence.", "4-1", True],
      ["Environment.NewLine", "The end of a line. The next words start on a new line.", "4-3", True],
      ["File.AppendAllText", "Adds words to the end of a file. It makes the file if it is not there.", "4-3", True]],
     "intro": "Click a marked word to see what it means."}
   ]},
   {"id": "2", "title": "Add the file tools line at the top", "foot": "done", "done": "using System.IO sits under the other using lines and is not red",
    "goal": "One line at the top of frmDataEntry's code lets this form use the file tools.",
    "blocks": [
    {"p": "Open frmDataEntry's code and scroll to the very top."},
    {"p": "The top lines start with the word using. Click at the end of the last one and press Enter, so a new line waits."},
    {"code": {"id": "2-1.c1", "kind": "type", "snippet": True, "title": "One line at the top", "lang": "cs",
              "where": "under the other using lines, at the very top of frmDataEntry's code",
              "text": "using System.IO;",
              "partLines": [[1, 1, "The file tools", "It lets this form use File, which writes to a file."]],
              "names": ["System.IO"], "isense": []}},
    {"p": "Without [[using System.IO|0]] the word File goes red."},
    {"box": {"title": "See where it goes", "fold": True, "blocks": [
      frames("F21", "The using line at the top", [
        ("f21-1", "The top of frmDataEntry.cs with using System.IO typed under the other using lines", "The new line sits under the other using lines.")],
        watch="Watch the new line sit under the other using lines")]}}
   ]}]},
  {"id": "3", "title": "Only when everything is done", "thing": "the Save button's check", "verb": "making", "screens": [
   {"id": "1", "title": "Check all five panels are off before saving", "foot": "done", "done": "lines 3 to 5 are typed and the code has no red squiggles",
    "goal": "The Save code only goes ahead when all five panels are grey.",
    "blocks": [
    {"p": "In the Design tab, double-click the Save button."},
    {"p": "A panel is switched off when its part is done, so this if checks all five."},
    code("3-1.c1", "The Save button: code 1 of 6", "between the curly brackets of " + B, D, B, 1, 6,
         [given(1, 2),
          [3, 3, "Are all five panels grey?", "One long line. && means and. All five must be switched off."],
          [4, 6, "Room inside", "A curly bracket, then two empty lines. Code 2 goes straight after them."]],
         P5, []),
    {"watch": "Line 3 is one long line. Keep it on one line in Visual Studio."}
   ]}]},
  {"id": "4", "title": "Write the line to the file", "thing": "the line that goes in the file", "verb": "making", "screens": [
   opener("Write one line to the file", "This part joins every detail into one line and puts it on the end of the file.",
          "Two pieces of code join the details into one line and write it to the file.",
          "When it works, pupilStats.txt has one new line, with a ~ between each detail."),
   {"id": "1", "title": "Join all the details into one line", "foot": "done", "done": "lines 7 to 18 are typed and the code has no red squiggles",
    "goal": "All eleven details join into one line, with a ~ between each piece.",
    "blocks": [
    {"p": "Each [[~|1]] is a fence between two pieces of the line."},
    code("4-1.c1", "The Save button: code 2 of 6", "under code 1, " + IN, D, B, 7, 18,
         [[7, 7, "A note", "A note about the fences. It does not run."],
          [8, 12, "The first five pieces", "Surname, first name, quiz score, year group and gender, each followed by a ~."],
          [13, 18, "The last six pieces", "The average, the three attempts, the test score and the group."]],
         ["record", "Global.surname", "Global.firstname", "Global.quizScore", "Global.yearGroup", "Global.gender",
          "Global.average", "Global.attempt1", "Global.attempt2", "Global.attempt3", "Global.reactionTestScore", "Global.assignedGroup"], [])
   ]},
   {"id": "2", "title": "See the line that goes in the file", "foot": "next", "done": "you have looked at the picture and read the line under it",
    "goal": "I see the eleven pieces in order, with a fence between each.",
    "blocks": [
    {"p": "This picture shows the line that code 2 builds."},
    {"drawn": {"id": "record-line", "pieces": ["Smith", "Anna", "4", "12", "F", "6.33", "5", "6", "8", "5", "Advanced"],
               "alt": "The line Smith~Anna~4~12~F~6.33~5~6~8~5~Advanced. Each piece has its own colour and a number from 0 to 10.",
               "say": "The order matters. The report reads the pieces back in this order."}}
   ]},
   {"id": "3", "title": "Write the line to the file", "foot": "done", "done": "lines 19 to 26 are typed and the code has no red squiggles",
    "goal": "The line ends, goes on the end of the file and a message says it is saved.",
    "blocks": [
    {"p": "[[Environment.NewLine|2]] ends the line and [[File.AppendAllText|3]] adds it to the end of the file."},
    code("4-2.c1", "The Save button: code 3 of 6", "under code 2, " + IN, D, B, 19, 27,
         [[19, 21, "End the line", "An empty line and a note. Then the end of a line is added to record."],
          [22, 24, "Write it to the file", "An empty line and a note. Then record goes on the end of the file."],
          [25, 27, "Say it is saved", "A message tells the pupil it worked. Empty lines sit either side."]],
         ["record", "Environment.NewLine", "File.AppendAllText"], [],
         yours="MY file is pupilStats.txt. If YOU choose another name, type it in place of pupilStats.txt. The report needs the same name.")
   ]}]},
  {"id": "5", "title": "Clear Global.cs and start again", "thing": "the fresh start for the next pupil", "verb": "making", "screens": [
   opener("Make Global.cs empty and start again", "This part clears all fourteen names in Global.cs, closes the form and opens a fresh one.",
          "Two pieces of code empty all fourteen names in Global.cs, then a fresh form opens.",
          "When it works, the form closes after a save and a brand new empty one opens."),
   {"id": "1", "title": "Put the first seven names back to empty", "foot": "done", "done": "lines 28 to 35 are typed and the code has no red squiggles",
    "goal": "The first seven names in Global.cs go back to empty, ready for the next pupil.",
    "blocks": [
    {"p": "Global.cs still holds this pupil's details, so clear them for the next pupil."},
    code("4-3.c1", "The Save button: code 4 of 6", "under code 3, " + IN, D, B, 28, 35,
         [[28, 28, "A note", "A note about clearing. It does not run."],
          [29, 30, "Two empty words", "Surname and first name go back to two speech marks with nothing between."],
          [31, 31, "Back to 0", "The quiz score goes back to 0."],
          [32, 33, "Two more empty words", "Year group and gender go back to empty."],
          [34, 35, "Back to the start", "averageCalculated goes back to false. The average goes back to 0."]],
         ["Global.surname", "Global.firstname", "Global.quizScore", "Global.yearGroup", "Global.gender",
          "Global.averageCalculated", "Global.average"], [])
   ]},
   {"id": "2", "title": "Put the rest back and start again", "foot": "done", "done": "lines 36 to 45 are typed and the code has no red squiggles",
    "goal": "The other seven names are cleared, the form closes and a fresh data entry form opens.",
    "blocks": [
    {"p": "Each number goes back to 0 and each true or false goes back to false."},
    code("4-4.c1", "The Save button: code 5 of 6", "under code 4, " + IN, D, B, 36, 45,
         [[36, 42, "The other seven", "The attempts, the test, the two true or false names and the group."],
          [43, 45, "Start again", "An empty line. Then this form closes and a fresh one opens."]],
         ["Global.attempt1", "Global.attempt2", "Global.attempt3", "Global.reactionTestScore", "Global.reactionTestTaken",
          "Global.quizTaken", "Global.assignedGroup", "frmDataEntry"], ["frmDataEntry"])
   ]},
   {"id": "3", "title": "See the fresh form for the next pupil", "foot": "next", "done": "you have looked at the picture and read the line under it",
    "goal": "I see the file keep the line while the form starts fresh.",
    "blocks": [
    {"p": "This picture shows the form after a save."},
    {"drawn": {"id": "fresh-screen", "alt": "The data entry form, fresh and empty, beside Global.cs.",
               "say": "The file keeps the line and the form starts fresh."}}
   ]}]},
  {"id": "6", "title": "If a panel is still on, stop", "thing": "the stop when a part is missing", "verb": "making", "screens": [
   {"id": "1", "title": "Stop and say so when a panel is still on", "foot": "done", "done": "lines 46 to 54 are typed and the code has no red squiggles",
    "goal": "If any panel is still on, a message shows and nothing is saved.",
    "blocks": [
    {"p": "When a panel is still on, this else shows a message and stops."},
    code("3-2.c1", "The Save button: code 6 of 6", "under code 5, to end the if and add the else", D, B, 46, 55,
         [[46, 47, "Two empty lines", "Two empty lines after the line that opens the fresh form."],
          [48, 48, "End the if", "The curly bracket that ends the if. Visual Studio may have typed it already."],
          [49, 53, "Not done? Say so and stop", "else runs when a panel is still on. A message shows and return stops the code."],
          [54, 54, "An empty line", "Leave one empty line here."],
          given(55, 55)],
         [], []),
    {"watch": "Visual Studio may already have a } under line 45. Press Enter twice at the end of line 45 to push it to line 48."}
   ]}]},
  {"id": "7", "title": "Try it", "thing": "your Save button", "verb": "testing", "screens": [
   {"id": "1", "title": "Try your Save button", "foot": "chapter-done", "done": "every row is ticked, or you have gone where its link says",
    "goal": "I save two pupils, find the file and check it has two lines with fences.",
    "blocks": [
    {"p": "Run your program, log in and do every part, then click Calculate."},
    {"p": "Then try each row. The Find the file box under the rows shows the Debug folder."},
    {"check": [
     tryit("5-1.t1", "Click Save.", "The saved message shows. Then a fresh data entry form opens.", "Look at the code on screens 4-3 and 5-2.", "#cw/11/4-3"),
     tryit("5-1.t2", "Stop the program. Find the Debug folder. Look for YOUR file.", "YOUR file is there, next to the program.", "Look at the code on screen 4-3.", "#cw/11/4-3"),
     tryit("5-1.t3", "Double-click YOUR file. It opens in Notepad.", "One line, with a ~ between each piece.", "Look at the code on screen 4-1.", "#cw/11/4-1"),
     tryit("5-1.t4", "Run again and save a second pupil. Open the file again.", "Two lines. The second pupil is on the second line.", "Look at the code on screen 4-3.", "#cw/11/4-3"),
     tryit("5-1.t5", "Log in and click Save straight away.", "The not all results message shows. NO line is added to the file.", "Look at the code on screens 3-1 and 6-1.", "#cw/11/3-1", neg=True)]},
    {"box": {"title": "Find the file", "fold": True, "blocks": [
      frames("F19", "Find the Debug folder", [
        ("f19-1", "Solution Explorer with the right-click menu open on the project", "Right-click the project. Click Open Folder in File Explorer."),
        ("f19-2", "File Explorer showing the bin folder", "Double-click bin."),
        ("f19-3", "File Explorer showing the Debug folder", "Double-click Debug.")],
        watch="Watch for the bin folder, then Debug inside it")]}},
    {"box": {"title": "See the file", "fold": True, "blocks": [
      frames("F17", "The file after the first save", [
        ("f17-1", "The Debug folder with pupilStats.txt in it", "The file is in the Debug folder."),
        ("f17-2", "pupilStats.txt open in Notepad with one line and a ~ between the pieces", "One line, with a ~ between each piece.")],
        watch="Watch for the ~ between each piece")]}}
   ]}]}
 ]}
