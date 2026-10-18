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
  {"id": "1", "title": "Check what your average button has", "screens": [
   {"id": "1", "title": "Check what your average button already does", "foot": "have",
    "goal": "I check the average button has code, refuses letters, and shows 6 for 5, 6 and 7.",
    "blocks": [
    {"p": "Your average button may have some code already. This screen checks what is there."},
    {"check": [
     have("1-1.t1", "In the Design tab, double-click the average button. Is there code between its curly brackets?",
          "The code tab opens at btnCalculateAverage_Click. Lines between the curly brackets mean yes.", "Go to stage 2.", "#cw/05/2-1"),
     have("1-1.t2", "Run it. Type letters in an attempt box and press the button. Does a number only message appear?",
          "Use the green Start arrow. Log in and fill in the details first.", "Go to stage 2.", "#cw/05/2-1"),
     have("1-1.t3", "Type 5, 6 and 7 and press the button. Does 6 appear and the quiz panel switch on?",
          "The average shows in the box beside the button.", "Go to stage 3.", "#cw/05/3-1")]}
   ]}]},
  {"id": "2", "title": "Check the three boxes", "screens": [
   {"id": "1", "title": "Start the average button by saying every box is right", "foot": "done",
    "goal": "The average button starts with a bool called passValidation set to true. Any failed check turns it false.",
    "blocks": [
    {"p": "The average button checks the three attempt boxes before it adds them up."},
    {"p": "It starts by saying every box is right. Any check that fails changes that to wrong."},
    {"words": [
      ["!", "Not. It turns true into false.", "2-3", True],
      [".All(char.IsDigit)", "Is every character a number from 0 to 9?", "2-3", True],
      ["Convert.ToDouble", "Turn the words in a box into a number with a point.", "3-1", True],
      ["Math.Round(x, 2)", "Cut a number down to 2 numbers after the point.", "3-1", True],
      [".ToString()", "Turn a number back into words, so a box can show it.", "3-1", True]],
     "intro": "Five new things in this chapter. Click any marked word to see what it means."},
    {"steps": [step("2-1.1", "In the Design tab, double-click the average button.", "The code tab opens at btnCalculateAverage_Click.")]},
    code("2-1.c1", "The average button, part 1 of 8", "between the curly brackets of btnCalculateAverage_Click", D, M, 1, 4,
         [given(1, 2),
          [3, 4, "Trust the boxes", "passValidation means did every box pass? It is a bool, true or false. It starts true."]],
         ["passValidation"], ["bool"]),
    {"watch": "passValidation starts true. Only a failed check turns it false."}
   ]},
   {"id": "2", "title": "Turn passValidation false when a box is empty", "foot": "done",
    "goal": "If any of the three attempt boxes is empty, passValidation is set to false.",
    "blocks": [
    {"p": "The first check asks: is any of the three boxes empty?"},
    {"p": "It is the same question as on the Enter button, asked three times. Two straight lines mean or."},
    code("2-2.c1", "The average button, part 2 of 8", "under part 1, " + IN, D, M, 5, 9,
         [[5, 5, "Is a box empty?", "Is attempt 1 empty, OR attempt 2, OR attempt 3? It is all one line."],
          [6, 9, "Then do not trust them", "passValidation becomes false."]],
         ["tbxAttempt1", "tbxAttempt2", "tbxAttempt3", "passValidation"], ["tbxAttempt1"]),
    {"watch": "Type the question as one long line. Visual Studio wraps it for you."}
   ]},
   {"id": "3", "title": "Turn passValidation false when attempt 1 holds a letter", "foot": "done",
    "goal": "If the first attempt box holds something that is not a number from 0 to 9, passValidation is set to false.",
    "blocks": [
    {"p": "The next check asks: does a box hold anything that is not a number?"},
    {"p": "[[.All(char.IsDigit)|1]] asks if every character is a number. [[!|0]] in front turns the answer round."},
    {"p": "So the question means: is it NOT all numbers?"},
    code("2-3.c1", "The average button, part 3 of 8", "under part 2, " + IN, D, M, 10, 14,
         [[10, 10, "Attempt 1 not all numbers?", "Is the first box NOT all numbers?"],
          [11, 14, "Then do not trust them", "passValidation becomes false."]],
         ["tbxAttempt1", "passValidation"], ["tbxAttempt1"]),
    {"watch": "The ! goes straight in front of the box name. There is no space."}
   ]},
   {"id": "4", "title": "Do the same check for attempts 2 and 3", "foot": "done",
    "goal": "The same letter check is done for the second and third attempt boxes.",
    "blocks": [
    {"p": "Now the same check for the other two boxes. Only the box name changes."},
    code("2-4.c1", "The average button, part 4 of 8", "under part 3, " + IN, D, M, 15, 24,
         [[15, 19, "Attempt 2 not all numbers?", "The same check for the second box."],
          [20, 24, "Attempt 3 not all numbers?", "The same check for the third box."]],
         ["tbxAttempt2", "tbxAttempt3", "passValidation"], ["tbxAttempt2"]),
    {"watch": "Each check names a different box. Check you changed the 1 to 2, then to 3."}
   ]},
   {"id": "5", "title": "Show a message and empty the boxes if a check failed", "foot": "done",
    "goal": "If passValidation is false, a message asks for numbers only and the three boxes are emptied.",
    "blocks": [
    {"p": "Now every check is done. If passValidation is false, something was wrong."},
    code("2-5.c1", "The average button, part 5 of 8", "under part 4, " + IN, D, M, 25, 31,
         [[25, 26, "Did a check fail?", "Is passValidation false?"],
          [27, 31, "Say so and empty the boxes", "A message box asks for numbers only. The three boxes are emptied."]],
         ["passValidation", "tbxAttempt1", "tbxAttempt2", "tbxAttempt3"], ["tbxAttempt3"]),
    {"watch": "Two equals signs ask a question. One equals sign would change passValidation."}
   ]}]},
  {"id": "3", "title": "Work out the average", "screens": [
   {"id": "1", "title": "Add the three attempts, divide by 3 and round", "foot": "done",
    "goal": "The three attempts are added, divided by 3, rounded to 2 places, kept in Global.cs and shown in the box.",
    "blocks": [
    {"p": "else runs when every box held a number. Now the average is worked out."},
    {"p": "A box holds words. [[Convert.ToDouble|2]] turns them into a number that can have a point."},
    {"p": "[[Math.Round(x, 2)|3]] keeps 2 numbers after the point. [[.ToString()|4]] turns the number back into words for the box."},
    code("3-1.c1", "The average button, part 6 of 8", "under part 5, inside the else", D, M, 32, 39,
         [[32, 34, "Add and divide", "else, then the three attempts are added and divided by 3. It is all one line."],
          [35, 36, "Round it", "roundedAv keeps 2 numbers after the point."],
          [37, 39, "Keep it and show it", "The average goes into Global.cs, the file you made in chapter 3. Then the box beside the button shows it."]],
         ["average", "tbxAttempt1", "tbxAttempt2", "tbxAttempt3", "roundedAv", "Global.average", "tbxCalculateAverage"], ["double"]),
    {"watch": "The brackets round the three numbers matter. Without them only the last one is divided by 3."}
   ]},
   {"id": "2", "title": "Save the three attempts in Global.cs and switch off the attempts panel", "foot": "done",
    "goal": "Global.cs notes the average is worked out and keeps the three attempts. The attempts panel switches off.",
    "blocks": [
    {"p": "Next, the average button notes the average is done. It saves the three attempts in Global.cs too."},
    {"p": "Convert.ToInt32 turns the words in a box into a whole number."},
    code("3-2.c1", "The average button, part 7 of 8", "under part 6, inside the else", D, M, 40, 46,
         [[40, 42, "Worked out. Switch off this panel", "averageCalculated becomes true. The attempts panel switches off."],
          [43, 46, "Keep the three attempts", "Each attempt goes into its line in Global.cs as a whole number."]],
         ["Global.averageCalculated", "pnlSwimLengths", "Global.attempt1", "tbxAttempt1", "Global.attempt2", "tbxAttempt2",
          "Global.attempt3", "tbxAttempt3"], ["Global.attempt1"]),
    {"watch": "else opens with a curly bracket. Its closing curly bracket comes in part 8."}
   ]},
   {"id": "3", "title": "Switch on the quiz panel", "foot": "done",
    "goal": "After the attempts are kept, the quiz panel switches on so the pupil can move on.",
    "blocks": [
    {"p": "Last, the average button moves the pupil on to the quiz."},
    {"flow": {"form": D, "lit": ["pnlSwimLengths"], "then": ["pnlQuizResult"], "keep": False,
              "before": "The average is worked out. The button is pressed.",
              "say": "The attempts panel goes grey and switches off. The quiz panel switches on."}},
    code("3-3.c1", "The average button, part 8 of 8", "under part 7, inside the else", D, M, 47, 50,
         [[47, 48, "Switch on the quiz panel", "The quiz panel can now be clicked."],
          given(49, 50)],
         ["pnlQuizResult"], ["pnlQuizResult"])
   ]}]},
  {"id": "4", "title": "Try your average button", "screens": [
   {"id": "1", "title": "Try every way through the average button", "foot": "chapter-done",
    "goal": "I run the program and try letters, 5 6 7, 5 6 8, and typing in the grey attempts panel.",
    "blocks": [
    {"p": "Run your program, log in and fill in the details. Then try each row."},
    {"check": [
     tryit("4-1.t1", "Type a letter in one attempt box. Fill in the rest. Press the average button.",
           "A message asks for numbers only. The three boxes are empty.", "Look at parts 3 to 5 on screens 2-3 to 2-5.", "#cw/05/2-3"),
     tryit("4-1.t2", "Type 5, 6 and 7. Press the average button.",
           "The box beside the button shows 6.", "Look at part 6 on screen 3-1.", "#cw/05/3-1"),
     tryit("4-1.t3", "Run it again. Type 5, 6 and 8. Press the average button.",
           "The box shows 6.33.", "Look at the rounding in part 6 on screen 3-1.", "#cw/05/3-1"),
     tryit("4-1.t4", "After the average appears, click in an attempt box and try to type.",
           "You must NOT be able to type in it.", "If you can, look at part 7 on screen 3-2.", "#cw/05/3-2", neg=True)]}
   ]}]}
 ]}
