# Chapter 5, the average of three attempts (DESIGN_SPEC §9 ch05, voice §7a). Run by tools/build_content.py with its helpers.
D = 'frmDataEntry'
M = 'btnCalculateAverage_Click'
IN = "inside btnCalculateAverage_Click"
CH = {
 "id": "05", "n": 5, "of": 15, "title": "The average of three attempts", "kind": "expected", "color": "#8E44AD",
 "one": "Three numbers in, one average out, kept in Global.cs.",
 "prev": {"id": "04", "n": 4, "title": "Pupil details: the Enter button"},
 "next": {"id": "06", "n": 6, "title": "The quiz: the first three questions"},
 "methods": [[D, M]],
 "stages": [
  {"id": "1", "title": "Check what your average button has", "thing": "your average button so far", "verb": "checking", "screens": [
   {"id": "1", "title": "Check what your average button already does", "foot": "have", "done": "every row is ticked, or you have gone where its link says",
    "goal": "I check the average button has code, refuses letters, and shows 6 for 5, 6 and 7.",
    "blocks": [
    {"p": "Your average button may already have some code, so this screen checks what is there."},
    {"check": [
     have("1-1.t1", "In the Design tab, double-click the average button. Is there code between its curly brackets?",
          "The code tab opens at btnCalculateAverage_Click. Lines between the curly brackets mean yes.", "Go to part 2.", "#cw/05/2-1"),
     have("1-1.t2", "Run it. Type letters in an attempt box and press the button. Does a number only message appear?",
          "Use the green Start arrow. Log in and fill in the details first.", "Go to part 2.", "#cw/05/2-1"),
     have("1-1.t3", "Type 5, 6 and 7 and press the button. Does 6 appear and the quiz panel switch on?",
          "The average shows in the box beside the button.", "Go to part 3.", "#cw/05/3-1")]}
   ]}]},
  {"id": "2", "title": "Check the three boxes", "thing": "the three checks", "verb": "making", "screens": [
   opener("Make the average button check the three boxes", "This part gives the average button three checks. A bool called passValidation remembers if any check failed.",
           "Each box is checked for being empty, then for holding a letter. A failed check turns passValidation false.",
           "When it works, letters in a box bring a numbers only message. The three boxes are emptied."),
   {"id": "1", "title": "Open the code behind the average button", "foot": "done", "done": "the code tab is open at btnCalculateAverage_Click with your cursor between its curly brackets",
    "goal": "I open the code behind the average button and meet the six new things in this chapter.",
    "blocks": [
    {"p": "The average button checks the three attempt boxes before it adds them up."},
    {"p": "It starts by saying every box is right. Any check that fails changes that to wrong."},
    {"words": [
      ["!", "Not. It turns true into false.", "2-4", True],
      [".All(char.IsDigit)", "Is every character a number from 0 to 9?", "2-4", True],
      ["Convert.ToDouble", "Turn the words in a box into a number with a point.", "3-1", True],
      ["Math.Round(x, 2)", "Cut a number down to 2 numbers after the point.", "3-1", True],
      [".ToString()", "Turn a number back into words, so a box can show it.", "3-1", True],
      ["Convert.ToInt32", "Turn the words in a box into a whole number.", "3-2", True]],
     "intro": "Six new things in this chapter. Click any marked word to see what it means."},
    {"steps": [step("2-1.1", "In the Design tab, double-click the average button.", "The code tab opens at btnCalculateAverage_Click.")]},
   ]},
   {"id": "2", "title": "Start by saying every box is right", "foot": "done", "done": "lines 3 to 3 are typed and the code has no red squiggles",
    "goal": "The average button starts with a bool called passValidation set to true. Any failed check turns it false.",
    "blocks": [
    {"p": "The first line of code makes passValidation, a bool that starts true."},
    code("2-1.c1", "The average button: code 1 of 8", "between the curly brackets of btnCalculateAverage_Click", D, M, 1, 4,
         [given(1, 2),
          [3, 4, "Trust the boxes", "passValidation means did every box pass? It is a bool, true or false. It starts true."]],
         ["passValidation"], ["bool"]),
    {"watch": "passValidation starts true. Only a failed check turns it false."}
   ]},
   {"id": "3", "title": "Turn passValidation false when a box is empty", "foot": "done", "done": "lines 5 to 8 are typed and the code has no red squiggles",
    "goal": "If any of the three attempt boxes is empty, passValidation is set to false.",
    "blocks": [
    {"p": "The first check asks: is any of the three boxes empty?"},
    {"p": "It is the same question as on the Enter button, asked three times. Two straight lines mean or."},
    code("2-2.c1", "The average button: code 2 of 8", "under code 1, " + IN, D, M, 5, 9,
         [[5, 5, "Is a box empty?", "Is attempt 1 empty, OR attempt 2, OR attempt 3? It is all one line."],
          [6, 9, "Then do not trust them", "passValidation becomes false."]],
         ["tbxAttempt1", "tbxAttempt2", "tbxAttempt3", "passValidation"], ["tbxAttempt1"]),
    {"watch": "Type the question as one long line. Visual Studio wraps it for you."}
   ]},
   {"id": "4", "title": "Turn passValidation false when attempt 1 holds a letter", "foot": "done", "done": "lines 10 to 13 are typed and the code has no red squiggles",
    "goal": "If the first attempt box holds something that is not a number from 0 to 9, passValidation is set to false.",
    "blocks": [
    {"p": "The next check asks: does a box hold anything that is not a number?"},
    {"p": "[[.All(char.IsDigit)|1]] asks if every character is a number. [[!|0]] in front turns the answer round."},
    {"p": "So the question means: is it NOT all numbers?"},
    code("2-3.c1", "The average button: code 3 of 8", "under code 2, " + IN, D, M, 10, 14,
         [[10, 10, "Attempt 1 not all numbers?", "Is the first box NOT all numbers?"],
          [11, 14, "Then do not trust them", "passValidation becomes false."]],
         ["tbxAttempt1", "passValidation"], ["tbxAttempt1"]),
    {"watch": "The ! goes straight in front of the box name. There is no space."}
   ]},
   {"id": "5", "title": "Do the same check for attempts 2 and 3", "foot": "done", "done": "lines 15 to 23 are typed and the code has no red squiggles",
    "goal": "The same letter check is done for the second and third attempt boxes.",
    "blocks": [
    {"p": "Now the same check for the other two boxes, where only the box name changes."},
    code("2-4.c1", "The average button: code 4 of 8", "under code 3, " + IN, D, M, 15, 24,
         [[15, 19, "Attempt 2 not all numbers?", "The same check for the second box."],
          [20, 24, "Attempt 3 not all numbers?", "The same check for the third box."]],
         ["tbxAttempt2", "tbxAttempt3", "passValidation"], ["tbxAttempt2"]),
    {"watch": "Each check names a different box. Check you changed the 1 to 2, then to 3."}
   ]},
   {"id": "6", "title": "Show a message if a check failed", "foot": "done", "done": "lines 25 to 31 are typed and the code has no red squiggles",
    "goal": "If passValidation is false, a message asks for numbers only and the three boxes are emptied.",
    "blocks": [
    {"p": "Every check is done now, so if passValidation is false something was wrong."},
    code("2-5.c1", "The average button: code 5 of 8", "under code 4, " + IN, D, M, 25, 31,
         [[25, 26, "Did a check fail?", "Is passValidation false?"],
          [27, 31, "Say so and empty the boxes", "A message box asks for numbers only. The three boxes are emptied."]],
         ["passValidation", "tbxAttempt1", "tbxAttempt2", "tbxAttempt3"], ["tbxAttempt3"]),
    {"watch": "Two equals signs ask a question. One equals sign would change passValidation."}
   ]}]},
  {"id": "3", "title": "Work out the average", "thing": "the average", "verb": "making", "screens": [
   opener("Work out the average and move on to the quiz", "This part adds the three attempts and divides by 3. It keeps the answer in Global.cs.",
           "else runs only when every box held a number. The average is rounded, kept, and shown in its box.",
           "When it works, 5, 6 and 7 show 6 in the box. The quiz panel switches on."),
   {"id": "1", "title": "Add the three attempts, divide by 3 and round", "foot": "done", "done": "lines 32 to 38 are typed and the code has no red squiggles",
    "goal": "The three attempts are added, divided by 3, rounded to 2 places, kept in Global.cs and shown in the box.",
    "blocks": [
    {"p": "else runs when every box held a number, so now the average is worked out."},
    {"p": "A box holds words. [[Convert.ToDouble|2]] turns them into a number that can have a point."},
    {"p": "[[Math.Round(x, 2)|3]] keeps 2 numbers after the point. [[.ToString()|4]] turns the number back into words for the box."},
    code("3-1.c1", "The average button: code 6 of 8", "under code 5, inside the else", D, M, 32, 39,
         [[32, 34, "Add and divide", "else, then the three attempts are added and divided by 3. It is all one line."],
          [35, 36, "Round it", "roundedAv keeps 2 numbers after the point."],
          [37, 39, "Keep it and show it", "The average goes into Global.cs, the file you made in chapter 3. Then the box beside the button shows it."]],
         ["average", "tbxAttempt1", "tbxAttempt2", "tbxAttempt3", "roundedAv", "Global.average", "tbxCalculateAverage"], ["double"]),
    {"watch": "The brackets round the three numbers matter. Without them only the last one is divided by 3."}
   ]},
   {"id": "2", "title": "Keep the three attempts in Global.cs", "foot": "done", "done": "lines 40 to 45 are typed and the code has no red squiggles",
    "goal": "Global.cs notes the average is worked out and keeps the three attempts. The attempts panel switches off.",
    "blocks": [
    {"p": "Next, the average button notes the average is done and keeps the three attempts in Global.cs."},
    {"p": "[[Convert.ToInt32|5]] turns the words in a box into a whole number."},
    code("3-2.c1", "The average button: code 7 of 8", "under code 6, inside the else", D, M, 40, 46,
         [[40, 42, "Worked out. Switch off this panel", "averageCalculated becomes true. The attempts panel switches off."],
          [43, 46, "Keep the three attempts", "Each attempt goes into its line in Global.cs as a whole number."]],
         ["Global.averageCalculated", "pnlSwimLengths", "Global.attempt1", "tbxAttempt1", "Global.attempt2", "tbxAttempt2",
          "Global.attempt3", "tbxAttempt3"], ["Global.attempt1"]),
    {"watch": "else opens with a curly bracket. Its closing curly bracket comes in code 8."}
   ]},
   {"id": "3", "title": "See the quiz panel switch on", "foot": "done", "done": "you have watched the panels switch and read the line under the picture",
    "goal": "I watch the attempts panel switch off and the quiz panel switch on.",
    "blocks": [
    {"p": "Last, the average button moves the pupil on to the quiz."},
    {"flow": {"watch": "Watch the attempts panel go grey as the quiz panel wakes up", "labels": DL, "form": D, "lit": ["pnlSwimLengths"], "then": ["pnlQuizResult"], "keep": False,
              "before": "The average is worked out. The button is pressed.",
              "say": "The attempts panel goes grey. The quiz panel wakes up."}},
   ]},
   {"id": "4", "title": "Switch the panels over in code", "foot": "done", "done": "lines 47 to 48 are in place and the code has no red squiggles",
    "goal": "After the attempts are kept, the quiz panel switches on so the pupil can move on.",
    "blocks": [
    {"p": "The last lines switch the quiz panel on, so the pupil can move on."},
    code("3-3.c1", "The average button: code 8 of 8", "under code 7, inside the else", D, M, 47, 50,
         [[47, 48, "Switch on the quiz panel", "The quiz panel can now be clicked."],
          given(49, 50)],
         ["pnlQuizResult"], ["pnlQuizResult"])
   ]}]},
  {"id": "4", "title": "Try your average button", "thing": "your average button", "verb": "testing", "screens": [
   {"id": "1", "title": "Try every way through the average button", "foot": "chapter-done", "done": "every row is ticked, or you have gone where its link says",
    "goal": "I run the program and try letters, 5 6 7, 5 6 8, and typing in the grey attempts panel.",
    "blocks": [
    {"p": "Run your program, log in, fill in the details, then try each row."},
    {"check": [
     tryit("4-1.t1", "Type a letter in one attempt box. Fill in the rest. Press the average button.",
           "A message asks for numbers only. The three boxes are empty.", "Look at the code on screens 2-4 to 2-6.", "#cw/05/2-4"),
     tryit("4-1.t2", "Type 5, 6 and 7. Press the average button.",
           "The box beside the button shows 6.", "Look at the code on screen 3-1.", "#cw/05/3-1"),
     tryit("4-1.t3", "Run it again. Type 5, 6 and 8. Press the average button.",
           "The box shows 6.33.", "Look at the rounding in the code on screen 3-1.", "#cw/05/3-1"),
     tryit("4-1.t4", "After the average appears, click in an attempt box and try to type.",
           "You must NOT be able to type in it.", "If you can, look at the code on screen 3-2.", "#cw/05/3-2", neg=True)]}
   ]}]}
 ]}
